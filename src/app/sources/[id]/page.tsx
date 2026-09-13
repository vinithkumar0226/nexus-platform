'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  FileText, Shield, AlertTriangle, CheckCircle, BrainCircuit, 
  Eye, FileSearch, Hash, List, Tag, Clock, ArrowRight, EyeOff
} from 'lucide-react';
import { useNexusStore } from '@/store/nexusStore';
import { formatFileSize, formatTimestamp, getSeverityColor, getStatusBadgeClass } from '@/lib/utils';
import Link from 'next/link';

export default function SourceAnalysis() {
  const params = useParams();
  const router = useRouter();
  const sourceId = params.id as string;
  
  const source = useNexusStore((state) => state.sources.find(s => s.id === sourceId));
  const contentDNA = useNexusStore((state) => state.contentDNA);
  
  if (!source) {
    return <div className="p-8 text-center text-white">Source not found.</div>;
  }

  // Use mock content DNA matching this source, or fallback
  const dna = (contentDNA.sourceId === sourceId) ? contentDNA : useNexusStore.getState().contentDNA;

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-nexus-panel p-4 rounded-xl border border-nexus-border shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-nexus-bg rounded-lg border border-nexus-border">
            <FileText className="w-6 h-6 text-nexus-blue" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-white">{source.filename}</h1>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass(source.status)}`}>
                {source.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-nexus-text-secondary">
              <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> {source.sha256.substring(0, 12)}...</span>
              <span>{formatFileSize(source.fileSize)}</span>
              <span>{source.pageCount} Pages</span>
              <span>Uploaded {formatTimestamp(source.uploadedAt, true)}</span>
            </div>
          </div>
        </div>
        
        <Link href={`/content-dna/${dna.id}`} className="btn-primary flex items-center gap-2">
          Generate Content DNA <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Security Check Panel */}
      <div className="bg-nexus-panel rounded-xl border border-nexus-border p-4 shrink-0 flex items-center gap-6 overflow-x-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-nexus-bg rounded-md border border-nexus-border shrink-0">
          <CheckCircle className="w-4 h-4 text-nexus-green" />
          <span className="text-sm font-medium text-white">File Validated</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-nexus-bg rounded-md border border-nexus-border shrink-0">
          <CheckCircle className="w-4 h-4 text-nexus-green" />
          <span className="text-sm font-medium text-white">SHA-256 Recorded</span>
        </div>
        {source.securityFlags.length > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-nexus-amber/10 border border-nexus-amber/30 rounded-md shrink-0">
            <AlertTriangle className="w-4 h-4 text-nexus-amber" />
            <span className="text-sm font-medium text-nexus-amber">{source.securityFlags.length} Sensitive Items Detected</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-nexus-bg rounded-md border border-nexus-border shrink-0">
            <CheckCircle className="w-4 h-4 text-nexus-green" />
            <span className="text-sm font-medium text-white">No PII Detected</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Document Thumbnail Previews */}
        <div className="lg:col-span-1 bg-nexus-panel rounded-xl border border-nexus-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-nexus-border bg-nexus-bg/50">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-nexus-text-secondary" /> Source Document
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-nexus-bg/30">
            {/* Fake document pages */}
            {[1, 2, 3].map((page) => (
              <div key={page} className="relative aspect-[1/1.4] bg-white rounded shadow-sm flex flex-col p-4 opacity-90 border border-nexus-border/50">
                <div className="absolute top-2 right-2 text-[10px] text-gray-400 font-mono">Page {page}</div>
                <div className="w-3/4 h-3 bg-gray-200 rounded mb-4 mt-2"></div>
                <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
                <div className="w-full h-2 bg-gray-100 rounded mb-2"></div>
                <div className="w-5/6 h-2 bg-gray-100 rounded mb-4"></div>
                
                {page === 2 && source.securityFlags.length > 0 && (
                  <div className="absolute top-1/3 left-4 right-4 h-6 border-2 border-nexus-amber/50 bg-nexus-amber/10 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-nexus-amber uppercase tracking-wider bg-white px-1">Redacted</span>
                  </div>
                )}
                
                <div className="w-full h-2 bg-gray-100 rounded mb-2 mt-auto"></div>
                <div className="w-2/3 h-2 bg-gray-100 rounded mb-2"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Extracted Intelligence */}
        <div className="lg:col-span-2 bg-nexus-panel rounded-xl border border-nexus-border flex flex-col overflow-hidden">
          <div className="p-4 border-b border-nexus-border flex items-center gap-6 overflow-x-auto bg-nexus-bg/50 shrink-0">
            <div className="flex items-center gap-2 text-nexus-cyan font-medium border-b-2 border-nexus-cyan pb-1 whitespace-nowrap">
              <List className="w-4 h-4" /> Overview
            </div>
            <div className="flex items-center gap-2 text-nexus-text-secondary hover:text-white transition-colors cursor-pointer pb-1 whitespace-nowrap">
              <CheckCircle className="w-4 h-4" /> Facts ({dna.facts.length})
            </div>
            <div className="flex items-center gap-2 text-nexus-text-secondary hover:text-white transition-colors cursor-pointer pb-1 whitespace-nowrap">
              <Tag className="w-4 h-4" /> Entities ({dna.entities.length})
            </div>
            <div className="flex items-center gap-2 text-nexus-text-secondary hover:text-white transition-colors cursor-pointer pb-1 whitespace-nowrap">
              <Clock className="w-4 h-4" /> Events ({dna.events.length})
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Overview Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-nexus-bg p-4 rounded-lg border border-nexus-border">
                  <div className="text-xs text-nexus-text-secondary uppercase mb-1">Topic</div>
                  <div className="text-white font-medium">{dna.topic}</div>
                </div>
                <div className="bg-nexus-bg p-4 rounded-lg border border-nexus-border">
                  <div className="text-xs text-nexus-text-secondary uppercase mb-1">Domain</div>
                  <div className="text-white font-medium">{dna.domain}</div>
                </div>
                <div className="bg-nexus-bg p-4 rounded-lg border border-nexus-border">
                  <div className="text-xs text-nexus-text-secondary uppercase mb-1">Severity</div>
                  <div className={`font-medium ${getSeverityColor(dna.severity)}`}>{dna.severity}</div>
                </div>
                <div className="bg-nexus-bg p-4 rounded-lg border border-nexus-border">
                  <div className="text-xs text-nexus-text-secondary uppercase mb-1">Communication Objective</div>
                  <div className="text-white font-medium">{dna.communicationObjective}</div>
                </div>
              </div>

              {/* Security Findings Action Area */}
              {source.securityFlags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-nexus-amber" /> Security Flags
                  </h3>
                  <div className="space-y-3">
                    {source.securityFlags.map(flag => (
                      <div key={flag.id} className="bg-nexus-bg border border-nexus-amber/30 rounded-lg p-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-nexus-amber/10 text-nexus-amber text-xs font-bold rounded uppercase">
                              {flag.type.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-nexus-text-secondary">Page {flag.page}</span>
                          </div>
                          <div className="text-white text-sm">{flag.description}</div>
                          <div className="text-nexus-text-secondary text-xs font-mono mt-1 bg-nexus-panel px-2 py-1 rounded inline-block">
                            "{flag.excerpt}"
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-nexus-panel hover:bg-nexus-border text-sm text-white rounded border border-nexus-border transition-colors flex items-center gap-1">
                            <EyeOff className="w-3 h-3" /> Mask
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
