"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  File,
  FileText,
  CheckCircle,
  Shield,
  Lock,
  FileSearch,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useNexusStore } from "@/store/nexusStore";
import type { ApiSuccess, SourceUploadResult } from "@/types/api";

export default function SourceUpload() {
  const router = useRouter();
  const {
    uploadStage,
    uploadProgress,
    setUploadStage,
    addSource,
    setContentDNA,
  } = useNexusStore();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset stage on mount
  useEffect(() => {
    setUploadStage("idle", 0);
  }, [setUploadStage]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file: File) => {
    setFile(file);
    setError(null);
    setUploadStage("uploading", 0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadStage("validating", 20);
      const response = await fetch("/api/sources", {
        method: "POST",
        body: formData,
      });

      const payload =
        (await response.json()) as ApiSuccess<SourceUploadResult> & {
          error?: { message: string };
        };
      if (!response.ok) {
        throw new Error(payload.error?.message || "The source upload failed.");
      }

      setUploadStage("extracting", 50);
      setUploadStage("analyzing", 80);
      addSource(payload.data.source);
      setContentDNA(payload.data.contentDNA);
      setUploadStage("done", 100);
      router.push(`/sources/${payload.data.source.id}`);
    } catch (uploadError) {
      setUploadStage("idle", 0);
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The source upload failed.",
      );
    }
  };

  const pipelineSteps = [
    { id: "uploading", label: "UPLOADING", icon: UploadCloud },
    { id: "validating", label: "VALIDATING", icon: Shield },
    { id: "extracting", label: "EXTRACTING", icon: FileSearch },
    { id: "analyzing", label: "CONTENT INTELLIGENCE", icon: Loader2 },
    { id: "done", label: "CONTENT DNA", icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    if (uploadStage === "idle") return -1;
    return pipelineSteps.findIndex((s) => s.id === uploadStage);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          New Transformation
        </h1>
        <p className="text-nexus-text-secondary">
          Securely ingest a source document to generate structured Content DNA.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Area */}
          <div
            className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              dragActive
                ? "border-nexus-cyan bg-nexus-cyan/5"
                : uploadStage !== "idle"
                  ? "border-nexus-border bg-nexus-panel opacity-50 pointer-events-none"
                  : "border-nexus-border bg-nexus-panel hover:border-nexus-cyan/50 hover:bg-nexus-cyan/5"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              onChange={handleChange}
              accept=".pdf,.docx,.txt"
              disabled={uploadStage !== "idle"}
            />

            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-4 rounded-full ${dragActive ? "bg-nexus-cyan/20" : "bg-nexus-bg border border-nexus-border"}`}
              >
                <UploadCloud
                  className={`w-8 h-8 ${dragActive ? "text-nexus-cyan" : "text-nexus-text-secondary"}`}
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {dragActive ? "Drop file to upload" : "Drop source here"}
                </h3>
                <p className="text-nexus-text-secondary mb-4">
                  or click to{" "}
                  <span className="text-nexus-cyan">browse files</span>
                </p>
              </div>

              <div className="flex gap-4 text-xs font-medium text-nexus-text-secondary/70">
                <span className="flex items-center gap-1 bg-nexus-bg px-2 py-1 rounded">
                  <FileText className="w-3 h-3" /> PDF
                </span>
                <span className="flex items-center gap-1 bg-nexus-bg px-2 py-1 rounded">
                  <FileText className="w-3 h-3" /> DOCX
                </span>
                <span className="flex items-center gap-1 bg-nexus-bg px-2 py-1 rounded">
                  <FileText className="w-3 h-3" /> TXT
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-nexus-red/30 bg-nexus-red/10 px-4 py-3 text-sm text-nexus-red">
              {error}
            </div>
          )}

          {/* Progress Indication */}
          <AnimatePresence>
            {uploadStage !== "idle" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="nexus-card p-6 rounded-xl border border-nexus-border"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <File className="text-nexus-cyan w-5 h-5" />
                    <span className="text-white font-medium">
                      {file?.name ||
                        "Cybersecurity_Incident_Report_Sept2026.pdf"}
                    </span>
                  </div>
                  <span className="text-nexus-cyan font-mono text-sm">
                    {uploadProgress}%
                  </span>
                </div>

                <div className="w-full bg-nexus-bg h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-nexus-blue to-nexus-cyan h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Guarantees */}
          <div className="nexus-panel rounded-xl p-6 border border-nexus-border">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-nexus-green" /> ENTERPRISE SECURITY
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-nexus-green shrink-0 mt-0.5" />
                <span className="text-sm text-nexus-text-secondary">
                  Strict file type & malware validation
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-nexus-green shrink-0 mt-0.5" />
                <span className="text-sm text-nexus-text-secondary">
                  Cryptographic SHA-256 fingerprinting
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-nexus-green shrink-0 mt-0.5" />
                <span className="text-sm text-nexus-text-secondary">
                  Isolated private processing enclave
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-nexus-green shrink-0 mt-0.5" />
                <span className="text-sm text-nexus-text-secondary">
                  Immutable source provenance tracing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Sidebar */}
        <div className="lg:col-span-1">
          <div className="nexus-card rounded-xl p-6 border border-nexus-border h-full">
            <h3 className="text-sm font-bold text-white tracking-wider mb-6">
              PROCESSING PIPELINE
            </h3>

            <div className="relative pl-6 space-y-8">
              {/* Vertical line connector */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-nexus-border"></div>

              {pipelineSteps.map((step, index) => {
                const isCurrent = step.id === uploadStage;
                const isPast = getCurrentStepIndex() > index;
                const Icon = step.icon;

                return (
                  <div
                    key={step.id}
                    className={`relative transition-all duration-300 ${isCurrent ? "opacity-100" : isPast ? "opacity-70" : "opacity-40"}`}
                  >
                    <div
                      className={`absolute w-6 h-6 rounded-full -left-[23px] flex items-center justify-center z-10 transition-colors
                      ${
                        isPast
                          ? "bg-nexus-green text-nexus-panel"
                          : isCurrent
                            ? "bg-nexus-cyan text-nexus-panel shadow-[0_0_10px_rgba(0,212,255,0.5)]"
                            : "bg-nexus-bg border border-nexus-border text-nexus-text-secondary"
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-bold tracking-wider flex items-center gap-2
                        ${isCurrent ? "text-nexus-cyan" : isPast ? "text-nexus-green" : "text-nexus-text-secondary"}`}
                      >
                        {step.label}
                        {isCurrent && step.id !== "done" && (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        )}
                      </h4>
                      {isCurrent && (
                        <p className="text-xs text-nexus-text-secondary mt-1">
                          {step.id === "uploading" &&
                            "Transferring encrypted payload..."}
                          {step.id === "validating" &&
                            "Verifying structure and running security checks..."}
                          {step.id === "extracting" &&
                            "Parsing layout, text, and metadata..."}
                          {step.id === "analyzing" &&
                            "Running NLP pipelines for entity and fact extraction..."}
                          {step.id === "done" &&
                            "Finalizing Content DNA matrix..."}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
