"use client";

import React from "react";
import { useNexusStore } from "@/store/nexusStore";
import {
  cn,
  formatFileSize,
  formatRelativeTime,
  getStatusBadgeClass,
} from "@/lib/utils";
import {
  FileText,
  Plus,
  File,
  Search,
  Filter,
  MoreVertical,
  Cpu,
  FileUp,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function SourcesPage() {
  const { sources, artifacts } = useNexusStore();

  const getArtifactsForSource = (id: string) =>
    artifacts.filter((a) => a.sourceId === id).length;

  return (
    <div className="min-h-screen bg-nexus-bg p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Intelligence Sources
            </h1>
            <p className="text-nexus-text-secondary mt-2">
              Manage and analyze ingested intelligence documents.
            </p>
          </div>
          <Link
            href="/sources/new"
            className="px-4 py-2 bg-nexus-cyan text-[#0a0f1e] rounded-md font-medium flex items-center gap-2 hover:bg-nexus-cyan/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> New Source
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-nexus-panel border border-nexus-border rounded-xl p-6 flex items-center gap-4">
            <div className="p-3 bg-nexus-card rounded-lg border border-nexus-border">
              <FileUp className="w-6 h-6 text-nexus-cyan" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {sources.length}
              </div>
              <div className="text-sm text-nexus-text-secondary">
                Total Sources
              </div>
            </div>
          </div>
          <div className="bg-nexus-panel border border-nexus-border rounded-xl p-6 flex items-center gap-4">
            <div className="p-3 bg-nexus-card rounded-lg border border-nexus-border">
              <FileText className="w-6 h-6 text-nexus-cyan" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {artifacts.length}
              </div>
              <div className="text-sm text-nexus-text-secondary">
                Generated Artefacts
              </div>
            </div>
          </div>
          <div className="bg-nexus-panel border border-nexus-border rounded-xl p-6 flex items-center gap-4">
            <div className="p-3 bg-nexus-card rounded-lg border border-nexus-border">
              <Cpu className="w-6 h-6 text-nexus-cyan" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">45s</div>
              <div className="text-sm text-nexus-text-secondary">
                Avg. Processing Time
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-nexus-text-secondary" />
            <input
              type="text"
              placeholder="Search sources by name, hash, or tags..."
              className="w-full bg-nexus-panel border border-nexus-border rounded-md pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-nexus-cyan transition-colors"
            />
          </div>
          <button className="px-3 py-2 bg-nexus-panel border border-nexus-border rounded-md text-sm text-nexus-text-secondary hover:text-white flex items-center gap-2 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-nexus-panel border border-nexus-border rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-nexus-card border-b border-nexus-border text-xs uppercase tracking-wider text-nexus-text-secondary font-semibold">
                <th className="px-6 py-4">Source Document</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Size & Pages</th>
                <th className="px-6 py-4">Ingested</th>
                <th className="px-6 py-4">Artefacts</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nexus-border">
              {sources.map((source) => (
                <tr
                  key={source.id}
                  className="hover:bg-nexus-card/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <File className="w-5 h-5 text-nexus-cyan" />
                      <div>
                        <Link
                          href={`/sources/${source.id}`}
                          className="font-medium text-white hover:text-nexus-cyan transition-colors"
                        >
                          {source.filename}
                        </Link>
                        <div className="text-xs text-nexus-text-secondary font-mono mt-0.5">
                          {source.sha256.substring(0, 12)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded text-xs font-medium uppercase",
                        getStatusBadgeClass(source.status),
                      )}
                    >
                      {source.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-nexus-text-secondary">
                    {formatFileSize(source.fileSize)} • {source.pageCount} pgs
                  </td>
                  <td className="px-6 py-4 text-sm text-nexus-text-secondary">
                    {formatRelativeTime(source.uploadedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-medium text-white">
                      <FileText className="w-4 h-4 text-nexus-cyan" />
                      {getArtifactsForSource(source.id)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {source.status === "processed" ? (
                        <>
                          <Link
                            href={`/content-dna/${source.contentDnaId}`}
                            className="px-3 py-1.5 bg-nexus-card border border-nexus-border rounded text-xs font-medium text-white hover:bg-nexus-panel transition-colors"
                          >
                            View DNA
                          </Link>
                          <Link
                            href={`/transform/${source.id}/progress`}
                            className="px-3 py-1.5 bg-nexus-cyan text-[#0a0f1e] rounded text-xs font-medium hover:bg-nexus-cyan/90 transition-colors"
                          >
                            Transform
                          </Link>
                        </>
                      ) : (
                        <button className="px-3 py-1.5 bg-nexus-card border border-nexus-border rounded text-xs font-medium text-white hover:bg-nexus-panel transition-colors">
                          View Analysis
                        </button>
                      )}
                      <button className="p-1.5 text-nexus-text-secondary hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sources.length === 0 && (
            <div className="p-12 text-center text-nexus-text-secondary">
              <FileUp className="w-12 h-12 mx-auto text-nexus-border mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No Sources Found
              </h3>
              <p className="max-w-md mx-auto">
                Upload a document to begin the intelligence transformation
                process.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
