'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ExternalLink, Hash, Shield, ChevronRight } from 'lucide-react';
import { useNexusStore } from '@/store/nexusStore';
import { FactIdBadge, ConfidenceBar } from '@/components/ui/StatusBadge';

export default function ProvenancePanel() {
  const { provenanceOpen, activeProvenanceLink, closeProvenance } = useNexusStore();

  return (
    <AnimatePresence>
      {provenanceOpen && activeProvenanceLink && (
        <motion.div
          initial={{ opacity: 0, x: 360 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 360 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-14 bottom-0 z-50 flex flex-col overflow-hidden"
          style={{
            width: 360,
            background: '#0f1629',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.2)' }}
              >
                <Shield size={12} style={{ color: '#00d4ff' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Source Evidence</h3>
                <p className="text-xs" style={{ color: '#556070' }}>Provenance trace</p>
              </div>
            </div>
            <button
              onClick={closeProvenance}
              className="p-1.5 rounded hover:bg-white/5 transition-colors"
              style={{ color: '#8492a8' }}
              aria-label="Close provenance panel"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {/* Generated Statement */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#556070' }}>
                Generated Statement
              </p>
              <div
                className="px-3 py-2.5 rounded-md text-sm text-white leading-relaxed"
                style={{
                  background: 'rgba(79,142,247,0.08)',
                  border: '1px solid rgba(79,142,247,0.15)',
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{activeProvenanceLink.statement}&rdquo;
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <ChevronRight size={12} style={{ color: '#556070' }} />
              <span className="text-xs" style={{ color: '#556070' }}>sourced from</span>
              <ChevronRight size={12} style={{ color: '#556070' }} />
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Source File */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#556070' }}>
                Source Document
              </p>
              <div
                className="flex items-center gap-3 px-3 py-2.5 rounded-md"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <FileText size={16} style={{ color: '#4f8ef7' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {activeProvenanceLink.sourceFile}
                  </p>
                  <p className="text-xs" style={{ color: '#8492a8' }}>
                    Page {activeProvenanceLink.sourcePage} &bull; {activeProvenanceLink.sourceSection}
                  </p>
                </div>
              </div>
            </div>

            {/* Source Excerpt */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#556070' }}>
                Relevant Source Text
              </p>
              <div
                className="px-3 py-3 rounded-md text-sm leading-relaxed"
                style={{
                  background: 'rgba(0,212,255,0.06)',
                  borderLeft: '3px solid rgba(0,212,255,0.4)',
                  color: '#c8d4e8',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {activeProvenanceLink.sourceText}
              </div>
              <p className="text-xs mt-2" style={{ color: '#556070' }}>
                Page {activeProvenanceLink.sourcePage}, {activeProvenanceLink.sourceSection}
              </p>
            </div>

            {/* Metadata */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#556070' }}>
                Provenance Metadata
              </p>
              <div
                className="rounded-md divide-y"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#141c35' }}
              >
                {[
                  { label: 'Fact ID', value: <FactIdBadge id={activeProvenanceLink.factId} /> },
                  { label: 'Content DNA Version', value: `v${activeProvenanceLink.dnaVersion}` },
                  { label: 'Source Page', value: `Page ${activeProvenanceLink.sourcePage}` },
                  { label: 'Section', value: activeProvenanceLink.sourceSection },
                  { label: 'Source File', value: activeProvenanceLink.sourceFile.split('.')[0] },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-3 py-2"
                    style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-xs" style={{ color: '#8492a8' }}>{label}</span>
                    <span className="text-xs font-medium text-white text-right max-w-[180px] truncate">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Extraction Confidence */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#556070' }}>
                Extraction Confidence
              </p>
              <ConfidenceBar value={activeProvenanceLink.confidence} />
              <p className="text-xs mt-1.5" style={{ color: '#556070' }}>
                Extraction confidence — not a truth score. The AI extracted this claim from the source with {Math.round(activeProvenanceLink.confidence * 100)}% confidence.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-5 py-4 space-y-2 shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <button
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all"
              style={{
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.2)',
                color: '#00d4ff',
              }}
              onClick={() => closeProvenance()}
            >
              <ExternalLink size={14} />
              Open Source Document
            </button>
            <button
              onClick={closeProvenance}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all hover:bg-white/5"
              style={{ color: '#8492a8' }}
            >
              <X size={14} />
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
