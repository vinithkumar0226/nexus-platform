'use client';

import React, { useState } from 'react';
import { useNexusStore } from '@/store/nexusStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Shield, Presentation, Download, Edit3, CheckCircle, 
  RefreshCw, X, ExternalLink, ChevronRight, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function ArtifactViewerPage({ params }: { params: { id: string } }) {
  const { 
    artifacts, 
    activeArtifactId, 
    setActiveArtifact,
    provenanceOpen,
    activeProvenanceLink,
    openProvenance,
    closeProvenance,
    approveArtifact
  } = useNexusStore();

  const [activeType, setActiveType] = useState<'executive_brief' | 'advisory' | 'presentation'>('executive_brief');

  const currentArtifact = artifacts.find(a => a.id === activeArtifactId) || artifacts.find(a => a.type === activeType);
  const allForSource = artifacts.filter(a => a.sourceId === 'src-001');

  // Handle section text replacement for highlighting conflicts
  const renderContent = (content: string, sectionId: string) => {
    if (currentArtifact?.type === 'executive_brief' && content.includes('180 servers')) {
      const parts = content.split('180 servers');
      return (
        <p className="text-nexus-text-secondary leading-relaxed">
          {parts[0]}
          <span 
            className="inline-flex items-center gap-1 bg-nexus-red/20 text-nexus-red px-1 rounded cursor-pointer border border-nexus-red/30 hover:bg-nexus-red/30 transition-colors"
            onClick={() => {
              // Mock opening provenance for this specific conflict
              openProvenance({
                id: 'prov-001',
                artifactId: currentArtifact.id,
                sectionId: sectionId,
                statement: '180 servers were compromised',
                factId: 'F001',
                factStatement: '18 servers were affected',
                sourceFile: 'Cybersecurity_Incident_Report_Sept2026.pdf',
                sourcePage: 4,
                sourceSection: 'Impact Assessment',
                sourceText: '...a total of 18 servers distributed across three network segments were confirmed to be affected by the intrusion...',
                dnaVersion: '1.0',
                confidence: 0.96
              });
            }}
          >
            <AlertTriangle className="w-3 h-3" />
            180 servers
          </span>
          {parts[1]}
        </p>
      );
    }
    return <p className="text-nexus-text-secondary leading-relaxed">{content}</p>;
  };

  if (!currentArtifact) return <div>Artefact not found</div>;

  return (
    <div className="h-screen flex flex-col bg-nexus-bg overflow-hidden">
      {/* Top Nav */}
      <div className="h-16 border-b border-nexus-border bg-nexus-panel flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/transform/src-001/progress" className="text-sm font-medium text-nexus-text-secondary hover:text-white transition-colors">
            Transformation
          </Link>
          <ChevronRight className="w-4 h-4 text-nexus-border" />
          <h1 className="text-sm font-bold text-white">Artefact Viewer</h1>
        </div>
        
        <div className="flex bg-nexus-card p-1 rounded-lg border border-nexus-border">
          <button 
            onClick={() => { setActiveType('executive_brief'); setActiveArtifact(allForSource.find(a=>a.type==='executive_brief')?.id || ''); }}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2", activeType === 'executive_brief' ? "bg-nexus-cyan text-[#0a0f1e]" : "text-nexus-text-secondary hover:text-white")}
          >
            <FileText className="w-4 h-4" /> Brief
          </button>
          <button 
            onClick={() => { setActiveType('advisory'); setActiveArtifact(allForSource.find(a=>a.type==='advisory')?.id || ''); }}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2", activeType === 'advisory' ? "bg-nexus-cyan text-[#0a0f1e]" : "text-nexus-text-secondary hover:text-white")}
          >
            <Shield className="w-4 h-4" /> Advisory
          </button>
          <button 
            onClick={() => { setActiveType('presentation'); setActiveArtifact(allForSource.find(a=>a.type==='presentation')?.id || ''); }}
            className={cn("px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2", activeType === 'presentation' ? "bg-nexus-cyan text-[#0a0f1e]" : "text-nexus-text-secondary hover:text-white")}
          >
            <Presentation className="w-4 h-4" /> Deck
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Col: Outline */}
        <div className="w-64 border-r border-nexus-border bg-nexus-panel/50 flex flex-col hidden md:flex shrink-0">
          <div className="p-4 border-b border-nexus-border font-semibold text-white text-sm">Document Outline</div>
          <div className="p-2 overflow-y-auto flex-1 space-y-1">
            {currentArtifact.sections.map((section, idx) => (
              <button 
                key={section.id}
                className="w-full text-left px-3 py-2 text-sm text-nexus-text-secondary hover:text-white hover:bg-nexus-card rounded-md transition-colors flex justify-between items-center"
              >
                <span className="truncate">{section.title}</span>
                {currentArtifact.validationIssues.some(vi => vi.sectionId === section.id) && (
                  <AlertTriangle className="w-3 h-3 text-nexus-red shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Center Col: Main Content */}
        <div className="flex-1 overflow-y-auto bg-[#0f1629]/50 p-8 relative">
          <div className="max-w-4xl mx-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8 bg-nexus-panel p-4 rounded-xl border border-nexus-border">
              <div>
                <h2 className="text-xl font-bold text-white">{currentArtifact.title}</h2>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="text-nexus-text-secondary">v{currentArtifact.dnaVersion}</span>
                  <span className={cn("px-2 py-0.5 rounded uppercase font-semibold", currentArtifact.status === 'approved' ? "bg-nexus-green/20 text-nexus-green" : "bg-nexus-cyan/20 text-nexus-cyan")}>
                    {currentArtifact.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-nexus-card border border-nexus-border rounded hover:bg-nexus-card/80 text-nexus-text-secondary hover:text-white transition-colors" title="Edit">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-nexus-card border border-nexus-border rounded hover:bg-nexus-card/80 text-nexus-text-secondary hover:text-white transition-colors" title="Regenerate">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => approveArtifact(currentArtifact.id)}
                  className="px-4 py-2 bg-nexus-green/10 text-nexus-green border border-nexus-green/30 hover:bg-nexus-green/20 rounded flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <CheckCircle className="w-4 h-4" /> Approve
                </button>
                <button className="px-4 py-2 bg-nexus-cyan text-[#0a0f1e] rounded flex items-center gap-2 text-sm font-medium hover:bg-nexus-cyan/90 transition-colors">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>

            {/* Document Render */}
            <div className="bg-white text-black p-10 rounded-xl shadow-2xl min-h-[800px] mb-12">
              <div className="border-b-2 border-gray-200 pb-4 mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900">{currentArtifact.title}</h1>
                <p className="text-gray-500 text-sm mt-2 font-mono">Generated: {new Date(currentArtifact.generatedAt).toLocaleString()}</p>
              </div>

              {activeType === 'presentation' ? (
                <div className="space-y-8">
                  {currentArtifact.sections.map(slide => (
                    <div key={slide.id} className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="aspect-[16/9] bg-gray-50 p-8 flex flex-col justify-center items-center text-center">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">{slide.title}</h2>
                        <div className="text-lg text-gray-600 whitespace-pre-wrap">{slide.content}</div>
                      </div>
                      <div className="bg-gray-100 p-4 border-t border-gray-300 text-sm">
                        <span className="font-semibold text-gray-700">Speaker Notes:</span>
                        <p className="text-gray-600 mt-1">{slide.speakerNotes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {currentArtifact.sections.map(section => (
                    <section key={section.id}>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{section.title}</h3>
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap font-serif">
                        {renderContent(section.content, section.id)}
                      </div>
                    </section>
                  ))}
                </div>
              )}
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
                <button onClick={closeProvenance} className="p-1 hover:bg-nexus-card rounded text-nexus-text-secondary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div>
                  <div className="text-xs font-medium text-nexus-text-secondary mb-1">Generated Claim</div>
                  <div className="p-3 bg-nexus-red/10 border border-nexus-red/20 rounded-lg text-nexus-red text-sm font-medium">
                    "{activeProvenanceLink.statement}"
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-nexus-text-secondary mb-1">Source Fact (F001)</div>
                  <div className="p-3 bg-nexus-card border border-nexus-border rounded-lg text-white text-sm font-medium">
                    "{activeProvenanceLink.factStatement}"
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-nexus-text-secondary mb-1 flex justify-between">
                    <span>Source Document</span>
                    <span className="text-nexus-cyan">Page {activeProvenanceLink.sourcePage}</span>
                  </div>
                  <div className="p-4 bg-[#1e293b] rounded-lg border border-nexus-border relative">
                    <p className="text-sm text-gray-300 italic">
                      "...a total of <span className="bg-nexus-cyan/30 text-white font-bold px-1 rounded">18 servers</span> distributed across three network segments were confirmed to be affected by the intrusion..."
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-nexus-border flex gap-3">
                  <Link href={`/validation/src-001`} className="flex-1 text-center py-2 bg-nexus-cyan text-[#0a0f1e] font-medium rounded-lg text-sm hover:bg-nexus-cyan/90 transition-colors">
                    Fix in Validation Center
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
