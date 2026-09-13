"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Presentation,
  MessageSquareText,
  Send,
  Image as ImageIcon,
  Video,
  CheckCircle,
  ArrowRight,
  Settings2,
  Sparkles,
  Network,
} from "lucide-react";
import { useNexusStore } from "@/store/nexusStore";
import Link from "next/link";

export default function Transform() {
  const params = useParams();
  const router = useRouter();
  const sourceId = params.id as string;

  const source = useNexusStore((state) =>
    state.sources.find((s) => s.id === sourceId),
  );
  const contentDNA = useNexusStore((state) => state.contentDNA);
  const startTransformation = useNexusStore(
    (state) => state.startTransformation,
  );

  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([
    "executive_brief",
    "advisory",
  ]);

  const toggleOutput = (id: string) => {
    setSelectedOutputs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleTransform = () => {
    startTransformation(sourceId, selectedOutputs);
    // In a real app we might navigate to a progress screen, but for this demo we can stay or go to dashboard
    router.push("/");
  };

  const outputs = [
    {
      id: "executive_brief",
      title: "Executive Brief",
      desc: "Concise decision-ready summary for leadership.",
      icon: FileText,
      format: "PDF / DOCX",
      available: true,
    },
    {
      id: "advisory",
      title: "Cybersecurity Advisory",
      desc: "Action-oriented communication for affected stakeholders.",
      icon: Shield,
      format: "PDF / DOCX",
      available: true,
    },
    {
      id: "presentation",
      title: "Presentation",
      desc: "Structured slide deck with speaker notes.",
      icon: Presentation,
      format: "PPTX",
      available: true,
    },
    {
      id: "linkedin",
      title: "LinkedIn Post",
      desc: "Professional summary for social sharing.",
      icon: MessageSquareText,
      format: "TXT",
      available: false,
    },
    {
      id: "twitter",
      title: "X Thread",
      desc: "Short-form episodic updates.",
      icon: Send,
      format: "TXT",
      available: false,
    },
    {
      id: "infographic",
      title: "Infographic",
      desc: "Visual representation of timeline and impact.",
      icon: ImageIcon,
      format: "PNG",
      available: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-nexus-cyan" /> Transform
          Intelligence
        </h1>
        <p className="text-nexus-text-secondary">
          Generate multiple verified communication artefacts simultaneously from
          the Content DNA.
        </p>
      </div>

      {/* DNA Reference Banner */}
      <div className="bg-nexus-panel border border-nexus-cyan/30 rounded-xl p-4 mb-8 flex items-center justify-between shadow-[0_0_15px_rgba(0,212,255,0.05)]">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-nexus-cyan/10 rounded border border-nexus-cyan/20">
            <Network className="w-5 h-5 text-nexus-cyan" />
          </div>
          <div>
            <div className="text-sm font-medium text-white flex items-center gap-2">
              Using Content DNA v{contentDNA.version}
              <CheckCircle className="w-3 h-3 text-nexus-green" />
            </div>
            <div className="text-xs text-nexus-text-secondary mt-0.5">
              {contentDNA.facts.length} Verified Facts •{" "}
              {contentDNA.entities.length} Entities • Source:{" "}
              {source?.filename || "Document"}
            </div>
          </div>
        </div>
        <Link
          href={`/content-dna/${contentDNA.id}`}
          className="text-xs text-nexus-cyan hover:underline"
        >
          Review DNA Base
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Output Selection */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">
            Select Output Artefacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {outputs.map((out) => {
              const Icon = out.icon;
              const isSelected = selectedOutputs.includes(out.id);
              return (
                <div
                  key={out.id}
                  onClick={() => out.available && toggleOutput(out.id)}
                  className={`relative p-4 rounded-xl border transition-all ${
                    !out.available
                      ? "bg-nexus-bg border-nexus-border/50 opacity-50 cursor-not-allowed"
                      : isSelected
                        ? "bg-nexus-cyan/10 border-nexus-cyan cursor-pointer shadow-[0_0_15px_rgba(0,212,255,0.1)]"
                        : "bg-nexus-panel border-nexus-border hover:border-nexus-cyan/50 cursor-pointer"
                  }`}
                >
                  {!out.available && (
                    <div className="absolute top-2 right-2 text-[10px] font-bold bg-nexus-bg px-2 py-0.5 rounded text-nexus-text-secondary uppercase">
                      Coming Soon
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-nexus-cyan">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}

                  <Icon
                    className={`w-8 h-8 mb-3 ${isSelected ? "text-nexus-cyan" : "text-nexus-text-secondary"}`}
                  />
                  <h3
                    className={`font-semibold mb-1 ${isSelected ? "text-white" : "text-gray-300"}`}
                  >
                    {out.title}
                  </h3>
                  <p className="text-xs text-nexus-text-secondary mb-3 leading-relaxed">
                    {out.desc}
                  </p>
                  <div className="text-[10px] font-mono bg-nexus-bg inline-block px-2 py-1 rounded text-gray-400">
                    {out.format}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parameters & Action */}
        <div className="lg:col-span-1">
          <div className="nexus-card rounded-xl border border-nexus-border p-5 sticky top-6">
            <h2 className="text-sm font-bold text-nexus-text-secondary uppercase tracking-wider mb-6 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Global Parameters
            </h2>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-xs font-medium text-nexus-text-secondary mb-1.5">
                  Primary Audience
                </label>
                <select className="w-full bg-nexus-bg border border-nexus-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nexus-cyan">
                  <option>Executive Leadership</option>
                  <option>Technical Teams</option>
                  <option>General Public</option>
                  <option>External Stakeholders</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-nexus-text-secondary mb-1.5">
                  Communication Objective
                </label>
                <select
                  className="w-full bg-nexus-bg border border-nexus-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nexus-cyan"
                  defaultValue="Inform and Direct Action"
                >
                  <option>Inform and Direct Action</option>
                  <option>General Awareness</option>
                  <option>Reassurance & Crisis Comm</option>
                  <option>Compliance Reporting</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-nexus-text-secondary mb-1.5">
                  Language
                </label>
                <select className="w-full bg-nexus-bg border border-nexus-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-nexus-cyan">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-nexus-text-secondary mb-2 flex justify-between">
                  <span>Level of Detail</span>
                  <span className="text-nexus-cyan">Balanced</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  defaultValue="2"
                  className="w-full accent-nexus-cyan bg-nexus-bg"
                />
                <div className="flex justify-between text-[10px] text-nexus-text-secondary mt-1">
                  <span>Concise</span>
                  <span>Detailed</span>
                </div>
              </div>
            </div>

            <div className="border-t border-nexus-border pt-6">
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-nexus-text-secondary">
                  Selected Outputs
                </span>
                <span className="text-white font-bold">
                  {selectedOutputs.length} Artefacts
                </span>
              </div>
              <button
                onClick={handleTransform}
                disabled={selectedOutputs.length === 0}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-nexus-blue to-nexus-cyan text-nexus-panel font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" /> Transform Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
