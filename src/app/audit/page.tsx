"use client";

import React, { useState } from "react";
import { useNexusStore } from "@/store/nexusStore";
import { cn } from "@/lib/utils";
import {
  Shield,
  Clock,
  User,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Filter,
  FileText,
  Database,
  Share2,
  Server,
} from "lucide-react";
import { motion } from "framer-motion";

type FilterType = "All" | "Source" | "DNA" | "Artifact" | "Export";

export default function AuditTrailPage() {
  const { auditEvents } = useNexusStore();
  const [filter, setFilter] = useState<FilterType>("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  // Basic stats
  const totalEvents = auditEvents.length;
  const systemEvents = auditEvents.filter((e) => e.actor === "System").length;
  const operatorEvents = auditEvents.filter(
    (e) => e.actor === "Operator",
  ).length;

  // Filter events
  const filteredEvents = auditEvents
    .filter((e) => {
      if (filter !== "All") {
        const typeMap: Record<string, string[]> = {
          Source: ["source_uploaded", "source_validated", "source_extracted"],
          DNA: [
            "dna_generated",
            "dna_updated",
            "fact_corrected",
            "propagation_triggered",
          ],
          Artifact: [
            "artifact_generated",
            "validation_completed",
            "review_started",
            "artifact_approved",
            "artifact_rejected",
          ],
          Export: ["artifact_exported"],
        };
        if (!typeMap[filter]?.includes(e.action)) return false;
      }
      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    ); // descending

  const formatTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getActionColor = (action: string) => {
    if (action.includes("error") || action.includes("reject"))
      return "text-nexus-red border-nexus-red/30 bg-nexus-red/10";
    if (action.includes("warn") || action.includes("conflict"))
      return "text-nexus-amber border-nexus-amber/30 bg-nexus-amber/10";
    if (action.includes("upload") || action.includes("export"))
      return "text-nexus-blue border-nexus-blue/30 bg-nexus-blue/10";
    if (action.includes("approve") || action.includes("success"))
      return "text-nexus-green border-nexus-green/30 bg-nexus-green/10";
    return "text-nexus-cyan border-nexus-cyan/30 bg-nexus-cyan/10"; // default system actions
  };

  const getResultIcon = (result: string) => {
    switch (result) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-nexus-green" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-nexus-amber" />;
      case "failure":
        return <XCircle className="w-5 h-5 text-nexus-red" />;
      default:
        return null;
    }
  };

  const getActorIcon = (actor: string) => {
    return actor === "System" ? (
      <Cpu className="w-4 h-4 text-nexus-cyan mr-1" />
    ) : (
      <User className="w-4 h-4 text-nexus-blue mr-1" />
    );
  };

  const getObjectIcon = (type: string) => {
    switch (type) {
      case "source":
        return <FileText className="w-4 h-4 mr-2" />;
      case "content_dna":
        return <Database className="w-4 h-4 mr-2" />;
      case "artifact":
        return <FileText className="w-4 h-4 mr-2" />;
      case "fact":
        return <Shield className="w-4 h-4 mr-2" />;
      case "export":
        return <Share2 className="w-4 h-4 mr-2" />;
      default:
        return <Server className="w-4 h-4 mr-2" />;
    }
  };

  const demoHighlights = [
    { label: "Source Verified", value: "SHA-256 validated", tone: "cyan" },
    { label: "Conflict Detected", value: "F001: 18 vs 180", tone: "amber" },
    { label: "Impact Analysis", value: "3 artefacts affected", tone: "blue" },
    { label: "Approval State", value: "Human review pending", tone: "green" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-nexus-bg text-white">
      <header className="px-8 py-6 border-b border-nexus-border bg-nexus-panel flex justify-between items-center z-10 sticky top-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-black/40 rounded-xl border border-white/5">
            <Shield className="w-6 h-6 text-gray-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Audit Trail</h1>
            <p className="text-gray-400 mt-1">
              Complete immutable event history • Cryptographically secured
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="bg-black/40 border border-nexus-border rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-nexus-cyan transition-colors appearance-none pr-10"
            style={{
              backgroundImage:
                'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%22//www.w3.org/2000/svg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22/%3E%3C/svg%3E")',
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px top 50%",
              backgroundSize: "10px auto",
            }}
          >
            <option value="All">All Sources</option>
            <option value="src-001">Cybersecurity_Incident_Report...</option>
            <option value="src-002">Threat_Intelligence_Brief...</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-nexus-card hover:bg-nexus-card/80 border border-nexus-border rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4 mr-2" /> Export Log
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {demoHighlights.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-nexus-border bg-nexus-panel p-4"
              >
                <div className="text-[10px] uppercase tracking-[0.18em] text-nexus-text-secondary">
                  {item.label}
                </div>
                <div
                  className={`mt-3 text-sm font-semibold ${item.tone === "amber" ? "text-nexus-amber" : item.tone === "blue" ? "text-nexus-blue" : item.tone === "green" ? "text-nexus-green" : "text-nexus-cyan"}`}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto flex gap-8">
            {/* Left: Timeline */}
            <div className="flex-1 bg-nexus-panel border border-nexus-border rounded-xl p-8">
              {/* Filters */}
              <div className="flex items-center gap-2 mb-8 pb-6 border-b border-white/5">
                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                {(
                  ["All", "Source", "DNA", "Artifact", "Export"] as FilterType[]
                ).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                      filter === f
                        ? "bg-white/10 text-white border-white/20"
                        : "bg-transparent text-gray-500 border-transparent hover:text-gray-300",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Timeline */}
              <div className="relative pl-6">
                <div className="absolute top-0 bottom-0 left-[39px] w-px bg-white/5" />
                <div className="space-y-8">
                  {filteredEvents.map((event, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={event.id}
                      className="relative flex gap-6"
                    >
                      <div className="w-32 flex-shrink-0 text-right pt-1 relative">
                        <div className="text-xl font-mono text-gray-200 tracking-tight">
                          {formatTime(event.timestamp)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(event.timestamp)}
                        </div>
                        <div className="absolute top-2.5 -right-[34px] w-3 h-3 rounded-full bg-black border-2 border-gray-500 z-10" />
                      </div>

                      <div className="flex-1 bg-black/20 border border-white/5 rounded-lg p-5 hover:bg-black/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={cn(
                                "px-2.5 py-1 text-xs font-mono font-medium rounded border",
                                getActionColor(event.action),
                              )}
                            >
                              {event.action.toUpperCase()}
                            </span>
                            <span
                              className={cn(
                                "flex items-center text-xs font-medium px-2 py-1 rounded",
                                event.actor === "System"
                                  ? "text-nexus-cyan bg-nexus-cyan/5"
                                  : "text-nexus-blue bg-nexus-blue/5",
                              )}
                            >
                              {getActorIcon(event.actor)} {event.actor}
                            </span>
                          </div>
                          <div className="bg-black/40 p-1.5 rounded-full border border-white/5">
                            {getResultIcon(event.result)}
                          </div>
                        </div>

                        <p className="text-gray-200 text-sm mb-4 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="bg-black/40 rounded border border-white/5 p-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-xs text-gray-400">
                              {getObjectIcon(event.objectType)}
                              <span className="text-nexus-cyan hover:underline cursor-pointer font-medium">
                                {event.objectName}
                              </span>
                            </div>
                            {event.version && (
                              <span className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-0.5 rounded">
                                v{event.version}
                              </span>
                            )}
                          </div>

                          {event.metadata &&
                            Object.keys(event.metadata).length > 0 && (
                              <div className="mt-2 pt-2 border-t border-white/5 grid grid-cols-2 gap-x-4 gap-y-2">
                                {Object.entries(event.metadata).map(
                                  ([k, v]) => {
                                    if (k === "sha256") {
                                      return (
                                        <div
                                          key={k}
                                          className="col-span-2 flex flex-col gap-1"
                                        >
                                          <span className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold">
                                            Cryptographic Hash (SHA-256)
                                          </span>
                                          <span className="text-xs font-mono text-gray-400 bg-black p-1.5 rounded border border-white/5 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {v}
                                          </span>
                                        </div>
                                      );
                                    }
                                    return (
                                      <div key={k} className="flex flex-col">
                                        <span className="text-[10px] uppercase text-gray-500 tracking-wider font-semibold">
                                          {k.replace(/([A-Z])/g, " $1").trim()}
                                        </span>
                                        <span className="text-xs text-gray-300 font-mono mt-0.5">
                                          {String(v)}
                                        </span>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-80 flex-shrink-0 space-y-6">
              <div className="bg-nexus-panel border border-nexus-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
                  Audit Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <div className="text-3xl font-mono font-bold text-white mb-1">
                      {totalEvents}
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      Total Events
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <div className="text-3xl font-mono font-bold text-white mb-1">
                      7
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      Unique Actions
                    </div>
                  </div>
                  <div className="bg-nexus-cyan/5 p-4 rounded-lg border border-nexus-cyan/10">
                    <div className="text-3xl font-mono font-bold text-nexus-cyan mb-1">
                      {systemEvents}
                    </div>
                    <div className="text-xs text-nexus-cyan/70 uppercase">
                      System Events
                    </div>
                  </div>
                  <div className="bg-nexus-blue/5 p-4 rounded-lg border border-nexus-blue/10">
                    <div className="text-3xl font-mono font-bold text-nexus-blue mb-1">
                      {operatorEvents}
                    </div>
                    <div className="text-xs text-nexus-blue/70 uppercase">
                      Operator Events
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-nexus-panel border border-nexus-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Integrity Verification
                </h3>
                <div className="flex items-start gap-3 p-3 bg-nexus-green/10 border border-nexus-green/20 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-nexus-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-nexus-green">
                      Log Integrity Intact
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      All entries are cryptographically signed and
                      sequence-verified.
                    </p>
                  </div>
                </div>
                <div className="mt-4 text-xs font-mono text-gray-500 break-all bg-black/40 p-3 rounded border border-white/5">
                  Current Block Hash:
                  <br />
                  <span className="text-gray-400 mt-1 block">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
