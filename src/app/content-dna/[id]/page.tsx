"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Network,
  CheckCircle,
  AlertTriangle,
  Shield,
  Clock,
  FileText,
  ArrowRight,
  Edit3,
  Tag,
  MessageSquare,
  ListChecks,
  Hash,
  AlertCircle,
} from "lucide-react";
import { useNexusStore } from "@/store/nexusStore";
import { getSeverityColor, getSeverityBg, formatConfidence } from "@/lib/utils";
import Link from "next/link";

export default function ContentDNA() {
  const params = useParams();
  const dnaId = params.id as string;
  const contentDNA = useNexusStore((state) => state.contentDNA);
  // Assuming the mock store has the requested DNA

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-nexus-cyan/10 border border-nexus-cyan/30 rounded shadow-[0_0_15px_rgba(0,212,255,0.2)]">
              <Network className="w-6 h-6 text-nexus-cyan" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Content DNA
            </h1>
            <span className="px-2.5 py-1 text-xs font-bold bg-nexus-panel border border-nexus-border rounded-full text-nexus-text-secondary">
              v{contentDNA.version}
            </span>
          </div>
          <p className="text-nexus-text-secondary text-lg">
            Structured source-of-truth for every downstream artefact.
          </p>
        </div>

        <Link
          href={`/transform/${contentDNA.sourceId}`}
          className="btn-primary flex items-center gap-2 px-6 py-3 text-base shadow-[0_0_20px_rgba(0,212,255,0.3)]"
        >
          Transform to Artefacts <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overview & Metadata */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            className="nexus-panel rounded-xl border border-nexus-border p-5"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <h2 className="text-sm font-bold text-nexus-text-secondary uppercase tracking-wider mb-4 border-b border-nexus-border pb-2">
              DNA Profile
            </h2>

            <div className="space-y-4">
              <motion.div variants={item}>
                <div className="text-xs text-nexus-text-secondary mb-1">
                  Topic
                </div>
                <div className="text-white font-medium">{contentDNA.topic}</div>
              </motion.div>

              <motion.div variants={item}>
                <div className="text-xs text-nexus-text-secondary mb-1">
                  Domain
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-nexus-bg border border-nexus-border text-sm text-white">
                  <Shield className="w-3.5 h-3.5 text-nexus-blue" />{" "}
                  {contentDNA.domain}
                </div>
              </motion.div>

              <motion.div variants={item}>
                <div className="text-xs text-nexus-text-secondary mb-1">
                  Assessed Severity
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium ${getSeverityBg(contentDNA.severity)}`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />{" "}
                  {contentDNA.severity}
                </div>
              </motion.div>

              <motion.div variants={item}>
                <div className="text-xs text-nexus-text-secondary mb-1">
                  Summary
                </div>
                <div className="text-sm text-nexus-text-secondary leading-relaxed bg-nexus-bg p-3 rounded-lg border border-nexus-border">
                  {contentDNA.summary}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Entities Preview */}
          <div className="nexus-panel rounded-xl border border-nexus-border p-5">
            <div className="flex justify-between items-center mb-4 border-b border-nexus-border pb-2">
              <h2 className="text-sm font-bold text-nexus-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Tag className="w-4 h-4" /> Entities
              </h2>
              <span className="text-xs bg-nexus-bg px-2 py-0.5 rounded text-nexus-text-secondary">
                {contentDNA.entities.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {contentDNA.entities.slice(0, 8).map((entity) => (
                <div
                  key={entity.id}
                  className="text-xs px-2 py-1 rounded bg-nexus-bg border border-nexus-border text-nexus-text-secondary flex items-center gap-1.5 hover:border-nexus-cyan/50 hover:text-white transition-colors cursor-default"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-nexus-blue opacity-70"></span>
                  {entity.name}
                </div>
              ))}
              {contentDNA.entities.length > 8 && (
                <div className="text-xs px-2 py-1 rounded bg-nexus-bg border border-nexus-border text-nexus-text-secondary">
                  +{contentDNA.entities.length - 8} more
                </div>
              )}
            </div>
          </div>

          {/* Uncertainties Preview */}
          {contentDNA.uncertainties.length > 0 && (
            <div className="nexus-panel rounded-xl border border-nexus-amber/30 p-5 bg-nexus-amber/5">
              <div className="flex justify-between items-center mb-4 border-b border-nexus-amber/20 pb-2">
                <h2 className="text-sm font-bold text-nexus-amber uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Uncertainties
                </h2>
                <span className="text-xs bg-nexus-amber/20 px-2 py-0.5 rounded text-nexus-amber font-bold">
                  {contentDNA.uncertainties.length}
                </span>
              </div>
              <div className="space-y-3">
                {contentDNA.uncertainties.map((u) => (
                  <div
                    key={u.id}
                    className="text-sm text-nexus-text-secondary border-l-2 border-nexus-amber pl-3"
                  >
                    {u.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Facts & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          <div className="nexus-panel rounded-xl border border-nexus-border overflow-hidden">
            <div className="p-4 border-b border-nexus-border bg-nexus-bg/50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-nexus-cyan" /> Verified
                Facts Base
              </h2>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-nexus-green">
                  <CheckCircle className="w-4 h-4" />{" "}
                  {
                    contentDNA.facts.filter((f) => f.status === "verified")
                      .length
                  }
                </span>
                <span className="flex items-center gap-1 text-nexus-amber">
                  <AlertTriangle className="w-4 h-4" />{" "}
                  {
                    contentDNA.facts.filter((f) => f.status !== "verified")
                      .length
                  }
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {contentDNA.facts.map((fact) => (
                <div
                  key={fact.id}
                  className="bg-nexus-bg border border-nexus-border rounded-lg p-4 transition-all hover:border-nexus-cyan/40 hover:shadow-[0_0_15px_rgba(0,212,255,0.05)] relative group"
                >
                  {/* Status Indicator Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${fact.status === "verified" ? "bg-nexus-green" : "bg-nexus-amber"}`}
                  />

                  <div className="flex justify-between items-start gap-4 mb-3 pl-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-nexus-cyan bg-nexus-cyan/10 px-2 py-1 rounded border border-nexus-cyan/20">
                        {fact.id}
                      </span>
                      <p className="text-white font-medium text-lg leading-snug">
                        {fact.statement}
                      </p>
                    </div>
                    {fact.currentValue && (
                      <button className="p-1.5 text-nexus-text-secondary hover:text-nexus-cyan hover:bg-nexus-panel rounded transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="pl-2 mt-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-nexus-text-secondary flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Page{" "}
                          {fact.sourcePage}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-nexus-text-secondary">
                            Extraction Confidence
                          </span>
                          <div className="w-24 h-1.5 bg-nexus-panel rounded-full overflow-hidden">
                            <div
                              className={`h-full ${fact.confidence > 0.9 ? "bg-nexus-green" : fact.confidence > 0.7 ? "bg-nexus-cyan" : "bg-nexus-amber"}`}
                              style={{ width: `${fact.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-white font-mono">
                            {formatConfidence(fact.confidence)}
                          </span>
                        </div>
                      </div>
                      <button className="text-nexus-cyan flex items-center gap-1 hover:underline">
                        View Source <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="bg-nexus-panel/50 p-3 rounded border border-nexus-border/50 text-sm font-serif text-nexus-text-secondary italic relative">
                      <div className="absolute -left-2 -top-2 text-2xl text-nexus-border">
                        &quot;
                      </div>
                      {fact.sourceText}
                      <div className="absolute -right-2 -bottom-4 text-2xl text-nexus-border">
                        &quot;
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
