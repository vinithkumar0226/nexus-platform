'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNexusStore } from '@/store/nexusStore';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, Save, FileText, Check, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HumanReviewPage() {
  const params = useParams();
  const router = useRouter();
  const artifactId = params.id as string;
  
  const { 
    artifacts, 
    updateArtifactSection, 
    approveArtifact, 
    rejectArtifact, 
    addToast 
  } = useNexusStore();

  const artifact = artifacts.find(a => a.id === artifactId);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [notes, setNotes] = useState('');

  if (!artifact) return <div className="p-8 text-white">Artifact not found</div>;

  const handleApprove = () => {
    approveArtifact(artifact.id);
    // addToast({ type: 'success', title: 'Artefact Approved', description: 'Ready for export.' });
    router.push('/exports');
  };

  const handleReject = () => {
    if (!rejectReason) {
      addToast({ type: 'error', title: 'Error', description: 'Please provide a rejection reason.' });
      return;
    }
    rejectArtifact(artifact.id, rejectReason);
    setShowRejectDialog(false);
  };

  const isApproved = artifact.status === 'approved' || artifact.status === 'exported';

  const renderHighlightedContent = (content: string, sectionId: string) => {
    const issue = artifact.validationIssues?.find(vi => vi.sectionId === sectionId);
    if (issue && content.includes(issue.generatedText)) {
      const parts = content.split(issue.generatedText);
      return (
        <div className="relative">
          {parts[0]}
          <span className="bg-nexus-red/20 text-nexus-red font-medium px-1 rounded mx-1 underline decoration-wavy decoration-nexus-red">
            {issue.generatedText}
          </span>
          {parts[1]}
        </div>
      );
    }
    return content;
  };

  return (
    <div className="flex flex-col h-full bg-nexus-bg text-white min-h-screen">
      {/* Header */}
      <header className="px-8 py-6 border-b border-nexus-border bg-nexus-panel flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Human Review</h1>
          <p className="text-gray-400 mt-1">{artifact.title} • Version {artifact.dnaVersion}</p>
        </div>
        <div className="flex gap-2">
          {artifacts.filter(a => a.sourceId === artifact.sourceId).map(a => (
            <button 
              key={a.id}
              onClick={() => router.push(`/review/${a.id}`)}
              className={cn(
                "px-4 py-2 rounded-md text-sm transition-colors",
                a.id === artifact.id ? "bg-nexus-cyan/20 text-nexus-cyan border border-nexus-cyan/50" : "bg-nexus-card text-gray-400 hover:bg-nexus-card/80 border border-transparent"
              )}
            >
              {a.type.replace('_', ' ').toUpperCase()}
              {a.status === 'approved' && <CheckCircle2 className="w-3 h-3 inline ml-2 text-nexus-green" />}
            </button>
          ))}
        </div>
      </header>

      {/* Workflow Indicator */}
      <div className="px-8 py-4 bg-nexus-panel/50 border-b border-nexus-border">
        <div className="flex items-center text-sm font-medium">
          <span className="text-gray-500">Generated</span>
          <ArrowRight className="w-4 h-4 mx-2 text-gray-600" />
          <span className="text-gray-500">AI Validated</span>
          <ArrowRight className="w-4 h-4 mx-2 text-gray-600" />
          <span className="text-nexus-cyan flex items-center bg-nexus-cyan/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-nexus-cyan mr-2 animate-pulse" /> Human Review
          </span>
          <ArrowRight className="w-4 h-4 mx-2 text-gray-600" />
          <span className={isApproved ? "text-nexus-green" : "text-gray-500"}>Approved</span>
          <ArrowRight className="w-4 h-4 mx-2 text-gray-600" />
          <span className={artifact.status === 'exported' ? "text-nexus-green" : "text-gray-500"}>Exported</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left: Content Editor */}
        <div className="flex-1 overflow-y-auto p-8 border-r border-nexus-border">
          {isApproved ? (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-nexus-green/10 border border-nexus-green/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center text-nexus-green">
                <CheckCircle2 className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="font-semibold text-lg">Artefact Approved</h3>
                  <p className="text-sm opacity-80">Ready for export and distribution.</p>
                </div>
              </div>
              <button onClick={() => router.push('/exports')} className="px-4 py-2 bg-nexus-green text-black font-semibold rounded hover:bg-nexus-green/90 transition-colors">
                Go to Exports →
              </button>
            </motion.div>
          ) : (
            <div className="mb-6 p-4 bg-nexus-blue/10 border border-nexus-blue/30 rounded-lg flex items-start text-nexus-blue">
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Review Required</h4>
                <p className="text-sm mt-1">AI validation identifies potential issues. Human approval authorizes this artefact for export.</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {artifact.sections.map(section => {
              const issue = artifact.validationIssues?.find(vi => vi.sectionId === section.id);
              return (
                <div key={section.id} className="bg-nexus-card rounded-xl border border-nexus-border overflow-hidden">
                  <div className="px-6 py-3 border-b border-nexus-border bg-black/20 flex justify-between items-center">
                    <h3 className="font-medium text-lg flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-400" /> {section.title}
                    </h3>
                    {issue && (
                      <span className="flex items-center text-xs px-2 py-1 bg-nexus-red/20 text-nexus-red rounded border border-nexus-red/30">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Conflict Detected
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    {!isApproved ? (
                      <textarea
                        className="w-full h-40 bg-black/20 border border-nexus-border rounded-lg p-4 text-gray-300 focus:outline-none focus:border-nexus-cyan focus:ring-1 focus:ring-nexus-cyan transition-all resize-none"
                        value={section.content}
                        onChange={(e) => updateArtifactSection(artifact.id, section.id, e.target.value)}
                      />
                    ) : (
                      <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {renderHighlightedContent(section.content, section.id)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Review Actions */}
        <div className="w-96 bg-nexus-panel overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Validation Section */}
            <section>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Validation Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-nexus-card border border-nexus-green/20 rounded-lg">
                  <span className="flex items-center text-gray-300"><CheckCircle2 className="w-4 h-4 text-nexus-green mr-2" /> Verified Claims</span>
                  <span className="font-mono text-nexus-green">28</span>
                </div>
                {artifact.validationIssues?.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-nexus-card border border-nexus-red/30 rounded-lg cursor-pointer hover:bg-nexus-card/80 transition-colors">
                    <span className="flex items-center text-gray-300"><AlertTriangle className="w-4 h-4 text-nexus-red mr-2" /> Requires Review</span>
                    <span className="font-mono text-nexus-red">{artifact.validationIssues.length}</span>
                  </div>
                )}
                
                {artifact.validationIssues?.map(issue => (
                  <div key={issue.id} className="p-4 bg-nexus-red/10 border border-nexus-red/30 rounded-lg mt-2">
                    <h4 className="text-sm font-medium text-nexus-red flex items-center"><AlertTriangle className="w-4 h-4 mr-2" /> {issue.type.replace('_', ' ').toUpperCase()}</h4>
                    <p className="text-sm text-gray-400 mt-2">{issue.description}</p>
                    <div className="mt-3 text-xs p-2 bg-black/40 rounded border border-white/5">
                      <p className="text-gray-500 mb-1">Generated: <span className="text-nexus-red font-medium">{issue.generatedText}</span></p>
                      <p className="text-gray-500">Source: <span className="text-nexus-green font-medium">{issue.sourceText}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Notes Section */}
            <section>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Review Notes</h3>
              <textarea 
                className="w-full h-32 bg-nexus-card border border-nexus-border rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-nexus-cyan transition-colors resize-none"
                placeholder="Add review notes or instructions for regeneration..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                disabled={isApproved}
              />
            </section>

            {/* Actions Section */}
            <section className="space-y-4 pt-4 border-t border-nexus-border">
              {!isApproved ? (
                <>
                  <button className="w-full py-3 px-4 bg-nexus-card hover:bg-nexus-card/80 border border-nexus-amber/50 text-nexus-amber rounded-lg font-medium transition-colors flex items-center justify-center">
                    Request Regeneration
                  </button>
                  <button 
                    onClick={() => setShowRejectDialog(true)}
                    className="w-full py-3 px-4 bg-nexus-card hover:bg-nexus-card/80 border border-nexus-red/50 text-nexus-red rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject Artefact
                  </button>
                  <button 
                    onClick={handleApprove}
                    className="w-full py-4 px-4 bg-nexus-green hover:bg-nexus-green/90 text-black rounded-lg font-bold shadow-lg shadow-nexus-green/20 transition-all flex items-center justify-center text-lg mt-4"
                  >
                    <Check className="w-5 h-5 mr-2" /> Approve Artefact
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => router.push('/exports')}
                  className="w-full py-4 px-4 bg-nexus-cyan hover:bg-nexus-cyan/90 text-black rounded-lg font-bold shadow-lg shadow-nexus-cyan/20 transition-all flex items-center justify-center text-lg"
                >
                  Proceed to Export <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-nexus-panel border border-nexus-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 flex items-center text-nexus-red"><XCircle className="w-6 h-6 mr-2" /> Reject Artefact</h2>
            <p className="text-gray-400 text-sm mb-4">Please provide a reason for rejection. This will be logged in the audit trail.</p>
            <textarea
              className="w-full h-32 bg-nexus-card border border-nexus-border rounded-lg p-3 text-sm text-gray-300 focus:outline-none focus:border-nexus-red transition-colors resize-none mb-6"
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRejectDialog(false)} className="px-4 py-2 bg-nexus-card hover:bg-nexus-card/80 text-white rounded-lg transition-colors">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 bg-nexus-red hover:bg-nexus-red/90 text-white rounded-lg font-medium transition-colors">Confirm Rejection</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
