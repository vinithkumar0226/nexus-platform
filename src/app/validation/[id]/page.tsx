"use client";

import React, { useState } from "react";
import { useNexusStore } from "@/store/nexusStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Check,
  X,
  FileText,
  ExternalLink,
  Activity,
} from "lucide-react";
import Link from "next/link";

type ValidationTab = "all" | "conflicts" | "verified";

export default function ValidationCenterPage({
  params,
}: {
  params: { id: string };
}) {
  const {
    mockValidationSummary,
    artifacts,
    resolveValidationIssue,
    openProvenance,
    provenanceOpen,
    activeProvenanceLink,
    closeProvenance,
  } = useNexusStore((state) => ({
    mockValidationSummary: {
      // manual inject for demo as it's not exported from state directly
      totalClaims: 31,
      verified: 28,
      conflicts: 1,
      unsupported: 1,
      uncertain: 1,
      numbersChecked: 12,
      datesChecked: 7,
      entitiesChecked: 11,
    },
    artifacts: state.artifacts,
    resolveValidationIssue: state.resolveValidationIssue,
    openProvenance: state.openProvenance,
    provenanceOpen: state.provenanceOpen,
    activeProvenanceLink: state.activeProvenanceLink,
    closeProvenance: state.closeProvenance,
  }));

  const [activeTab, setActiveTab] = useState<ValidationTab>("conflicts");

  // Find the critical issue
  const executiveBrief = artifacts.find((a) => a.type === "executive_brief");
  const criticalIssue = executiveBrief?.validationIssues.find(
    (vi) => vi.id === "vi-001",
  );

  return (
    <div className="min-h-screen bg-nexus-bg flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <ShieldAlert className="w-8 h-8 text-nexus-cyan" />
                Validation Center
              </h1>
              <p className="text-nexus-text-secondary mt-2">
                Source:{" "}
                <span className="text-nexus-cyan font-mono">
                  Cybersecurity_Incident_Report_Sept2026.pdf
                </span>
              </p>
            </div>

            {/* Summary Stats Row */}
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-nexus-panel border border-nexus-border rounded-xl p-4 flex flex-col items-center justify-center">
                <CheckCircle className="w-6 h-6 text-nexus-green mb-2" />
                <span className="text-2xl font-bold text-white">28</span>
                <span className="text-xs text-nexus-text-secondary uppercase tracking-wider">
                  Claims Verified
                </span>
              </div>
              <div className="bg-nexus-red/10 border border-nexus-red/30 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-nexus-red/5 animate-pulse" />
                <AlertTriangle className="w-6 h-6 text-nexus-red mb-2 relative z-10" />
                <span className="text-2xl font-bold text-nexus-red relative z-10">
                  1
                </span>
                <span className="text-xs text-nexus-red uppercase tracking-wider relative z-10">
                  Conflict Detected
                </span>
              </div>
              <div className="bg-nexus-panel border border-nexus-border rounded-xl p-4 flex flex-col items-center justify-center">
                <Activity className="w-6 h-6 text-nexus-cyan mb-2" />
                <span className="text-2xl font-bold text-white">12</span>
                <span className="text-xs text-nexus-text-secondary uppercase tracking-wider">
                  Numbers Checked
                </span>
              </div>
              <div className="bg-nexus-panel border border-nexus-border rounded-xl p-4 flex flex-col items-center justify-center">
                <Activity className="w-6 h-6 text-nexus-cyan mb-2" />
                <span className="text-2xl font-bold text-white">7</span>
                <span className="text-xs text-nexus-text-secondary uppercase tracking-wider">
                  Dates Checked
                </span>
              </div>
              <div className="bg-nexus-panel border border-nexus-border rounded-xl p-4 flex flex-col items-center justify-center">
                <Activity className="w-6 h-6 text-nexus-cyan mb-2" />
                <span className="text-2xl font-bold text-white">11</span>
                <span className="text-xs text-nexus-text-secondary uppercase tracking-wider">
                  Entities Checked
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-nexus-border">
              {["conflicts", "verified", "all"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as ValidationTab)}
                  className={cn(
                    "px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors",
                    activeTab === tab
                      ? "border-nexus-cyan text-nexus-cyan"
                      : "border-transparent text-nexus-text-secondary hover:text-white",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content based on tab */}
            {activeTab === "conflicts" &&
              criticalIssue &&
              criticalIssue.status === "open" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-nexus-card border-l-4 border-l-nexus-red border border-nexus-border rounded-lg p-6 shadow-2xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="w-6 h-6 text-nexus-red" />
                      <h2 className="text-lg font-bold text-white">
                        FACTUAL CONFLICT — CRITICAL
                      </h2>
                    </div>
                    <span className="px-3 py-1 bg-nexus-panel border border-nexus-border rounded text-xs text-nexus-text-secondary font-mono">
                      Fact ID: {criticalIssue.factId}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-nexus-red/5 p-4 rounded-lg border border-nexus-red/10">
                      <div className="text-xs font-semibold text-nexus-red mb-2 uppercase">
                        Generated Artifact Output
                      </div>
                      <p className="text-sm text-white font-medium">
                        &quot;...
                        <span className="text-nexus-red bg-nexus-red/20 px-1 rounded">
                          180 servers
                        </span>{" "}
                        were compromised...&quot;
                      </p>
                    </div>
                    <div className="bg-nexus-green/5 p-4 rounded-lg border border-nexus-green/10">
                      <div className="text-xs font-semibold text-nexus-green mb-2 uppercase">
                        Source Document Truth
                      </div>
                      <p className="text-sm text-white font-medium">
                        &quot;...
                        <span className="text-nexus-green bg-nexus-green/20 px-1 rounded">
                          18 servers
                        </span>{" "}
                        distributed across three network segments...&quot;
                      </p>
                      <div className="mt-2 text-xs text-nexus-text-secondary">
                        Source: {criticalIssue.sourceFile}, Page{" "}
                        {criticalIssue.sourcePage}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-nexus-border">
                    <button
                      onClick={() => {
                        openProvenance({
                          id: "prov-001",
                          artifactId: criticalIssue.artifactId,
                          sectionId: criticalIssue.sectionId,
                          statement: "180 servers were compromised",
                          factId: "F001",
                          factStatement: "18 servers were affected",
                          sourceFile: criticalIssue.sourceFile!,
                          sourcePage: criticalIssue.sourcePage!,
                          sourceSection: "Impact Assessment",
                          sourceText: criticalIssue.sourceText,
                          dnaVersion: "1.0",
                          confidence: 0.96,
                        });
                      }}
                      className="px-4 py-2 bg-nexus-panel border border-nexus-border rounded text-sm text-white font-medium hover:bg-nexus-panel/80 transition-colors flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> View Evidence
                    </button>
                    <Link
                      href="/content-dna/dna-001/impact"
                      className="px-4 py-2 bg-nexus-cyan text-[#0a0f1e] rounded text-sm font-medium hover:bg-nexus-cyan/90 transition-colors"
                    >
                      Fix in Content DNA
                    </Link>
                    <button
                      onClick={() =>
                        resolveValidationIssue(
                          criticalIssue.artifactId,
                          criticalIssue.id,
                          "ignore",
                        )
                      }
                      className="px-4 py-2 bg-transparent text-nexus-text-secondary rounded text-sm font-medium hover:text-white transition-colors"
                    >
                      Ignore
                    </button>
                  </div>
                </motion.div>
              )}

            {activeTab === "verified" && (
              <div className="bg-nexus-panel border border-nexus-border rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Verified Claims
                </h3>
                {[
                  "Attack was first detected on September 10, 2026 at 03:47 UTC",
                  "Threat actor employed a custom variant of BlackManta ransomware",
                  "Initial access was achieved via a spear-phishing campaign",
                ].map((claim, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-nexus-card rounded-lg border border-nexus-border"
                  >
                    <CheckCircle className="w-5 h-5 text-nexus-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">{claim}</p>
                      <p className="text-xs text-nexus-text-secondary mt-1">
                        Cross-referenced with source data. Confidence: {94 - i}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Security Check Section */}
            <div className="bg-nexus-panel border border-nexus-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Security & Compliance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-nexus-card border border-nexus-border rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-nexus-green" />
                  <div>
                    <div className="text-sm font-medium text-white">
                      SHA-256 Verified
                    </div>
                    <div className="text-xs text-nexus-text-secondary">
                      Integrity hash matches original upload
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-nexus-amber/10 border border-nexus-amber/30 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-nexus-amber" />
                  <div>
                    <div className="text-sm font-medium text-nexus-amber">
                      2 Sensitive Items Flagged
                    </div>
                    <div className="text-xs text-nexus-amber/80">
                      Internal IPs and emails detected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Provenance (Slide in) */}
        <AnimatePresence>
          {provenanceOpen && activeProvenanceLink && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-[400px] bg-nexus-panel border-l border-nexus-border shadow-2xl flex flex-col z-20 shrink-0"
            >
              <div className="flex items-center justify-between p-4 border-b border-nexus-border">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-nexus-cyan" />
                  Source Evidence
                </h3>
                <button
                  onClick={closeProvenance}
                  className="p-1 hover:bg-nexus-card rounded text-nexus-text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <div className="text-xs font-medium text-nexus-text-secondary mb-1">
                    Generated Claim
                  </div>
                  <div className="p-3 bg-nexus-red/10 border border-nexus-red/20 rounded-lg text-nexus-red text-sm font-medium">
                    &quot;{activeProvenanceLink.statement}&quot;
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-nexus-text-secondary mb-1">
                    Source Fact (F001)
                  </div>
                  <div className="p-3 bg-nexus-card border border-nexus-border rounded-lg text-white text-sm font-medium">
                    &quot;{activeProvenanceLink.factStatement}&quot;
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-nexus-text-secondary mb-1 flex justify-between">
                    <span>Source Document</span>
                    <span className="text-nexus-cyan">
                      Page {activeProvenanceLink.sourcePage}
                    </span>
                  </div>
                  <div className="p-4 bg-[#1e293b] rounded-lg border border-nexus-border relative">
                    <p className="text-sm text-gray-300 italic">
                      &quot;...a total of{" "}
                      <span className="bg-nexus-cyan/30 text-white font-bold px-1 rounded">
                        18 servers
                      </span>{" "}
                      distributed across three network segments were confirmed
                      to be affected by the intrusion...&quot;
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
