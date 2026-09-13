'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNexusStore } from '@/store/nexusStore';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, GitBranch, AlertTriangle, CheckCircle2, FileText, Database, ShieldAlert, Cpu } from 'lucide-react';

export default function ChangePropagationPage() {
  const router = useRouter();
  const { 
    contentDNA, 
    analyzeFactImpact, 
    propagateChanges, 
    propagationImpact, 
    propagationStatus 
  } = useNexusStore();

  const [newValue, setNewValue] = useState('20');
  
  // We'll hardcode focus on F001 for the WOW demo
  const targetFactId = 'F001';
  const fact = contentDNA.facts.find(f => f.id === targetFactId);
  const otherFacts = contentDNA.facts.filter(f => f.id !== targetFactId).slice(0, 3); // show a few

  const handleAnalyze = () => {
    analyzeFactImpact(targetFactId, newValue);
  };

  const handlePropagate = () => {
    propagateChanges();
  };

  if (!fact) return <div className="p-8 text-white">Fact not found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-nexus-bg text-white">
      {/* Header */}
      <header className="px-8 py-6 border-b border-nexus-border bg-nexus-panel flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-nexus-cyan/10 rounded-lg">
            <GitBranch className="w-6 h-6 text-nexus-cyan" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Content DNA — Change Propagation</h1>
            <p className="text-gray-400 mt-1">Source of Truth Management • v{contentDNA.version}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-hidden relative">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nexus-cyan blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-nexus-blue blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <div className="h-full flex items-center justify-center p-8 z-10 relative">
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: FACT EDITOR */}
            {(propagationStatus === 'idle' || propagationStatus === 'analyzing') && (
              <motion.div 
                key="stage-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-3xl"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-3">Update Core Fact</h2>
                  <p className="text-gray-400 text-lg">Modifying Content DNA will cascade changes to all derived artefacts.</p>
                </div>

                <div className="bg-nexus-panel border border-nexus-border rounded-xl shadow-2xl overflow-hidden">
                  <div className="p-6 bg-black/40 border-b border-nexus-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-nexus-cyan/20 text-nexus-cyan text-xs font-mono rounded border border-nexus-cyan/30">Fact {fact.id}</span>
                      <span className="text-xs text-gray-500 font-mono">Confidence: {(fact.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <p className="text-lg text-gray-200">{fact.statement}</p>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center justify-between gap-8 mb-8">
                      <div className="flex-1 bg-black/30 p-4 rounded-lg border border-white/5">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Current Value</label>
                        <div className="text-2xl font-mono text-gray-300">{fact.currentValue || '18'}</div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center text-nexus-cyan">
                        <ArrowRight className="w-8 h-8" />
                      </div>
                      
                      <div className="flex-1 bg-nexus-cyan/5 p-4 rounded-lg border border-nexus-cyan/30 relative">
                        <label className="block text-xs font-semibold text-nexus-cyan uppercase tracking-wider mb-2">New Value</label>
                        <input 
                          type="text" 
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          className="w-full bg-transparent text-2xl font-mono text-white focus:outline-none border-b border-nexus-cyan/50 focus:border-nexus-cyan pb-1"
                          autoFocus
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <span className="w-2 h-2 rounded-full bg-nexus-cyan animate-pulse"></span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleAnalyze}
                      className="w-full py-4 bg-nexus-cyan hover:bg-nexus-cyan/90 text-black font-bold rounded-lg text-lg transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] flex items-center justify-center"
                    >
                      <Activity className="w-5 h-5 mr-2" /> Analyze Impact
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-nexus-border/50">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Contextual Facts (Read-Only)</h3>
                  <div className="space-y-3">
                    {otherFacts.map(f => (
                      <div key={f.id} className="p-4 bg-nexus-card border border-nexus-border rounded-lg flex items-start opacity-60">
                        <Database className="w-4 h-4 text-gray-500 mr-3 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-400">{f.statement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: IMPACT ANALYSIS */}
            {propagationStatus === 'ready' && propagationImpact && (
              <motion.div 
                key="stage-2"
                initial={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-4xl"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center p-3 bg-nexus-amber/10 rounded-full mb-4 border border-nexus-amber/30">
                    <AlertTriangle className="w-8 h-8 text-nexus-amber" />
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-white">Content Change Detected</h2>
                  <div className="flex items-center justify-center gap-4 text-lg">
                    <span className="text-gray-400">Content DNA: v{contentDNA.version}</span>
                    <ArrowRight className="w-4 h-4 text-nexus-cyan" />
                    <span className="text-nexus-cyan font-bold">v2.0</span>
                  </div>
                  <div className="mt-2 text-xl font-mono">
                    <span className="text-nexus-red line-through mr-3 opacity-70">{propagationImpact.previousValue}</span>
                    <span className="text-nexus-green">{propagationImpact.newValue}</span>
                  </div>
                </div>

                <div className="bg-nexus-panel border border-nexus-border rounded-xl shadow-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-nexus-amber via-nexus-red to-nexus-amber opacity-50" />
                  
                  <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-300">
                    <Cpu className="w-5 h-5 mr-2 text-nexus-amber" /> Impact Analysis
                  </h3>

                  <div className="space-y-4">
                    {propagationImpact.affectedArtifacts.map((art, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={art.artifactId} 
                        className="flex items-center justify-between p-4 bg-black/40 border border-nexus-amber/30 rounded-lg relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-nexus-amber/5 w-0 group-hover:w-full transition-all duration-500" />
                        <div className="flex items-center z-10">
                          <FileText className="w-5 h-5 mr-3 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-200">{art.artifactTitle}</p>
                            <p className="text-xs text-gray-500 mt-1">Affects {art.sectionIds.length} section(s)</p>
                          </div>
                        </div>
                        <div className="z-10 flex items-center px-3 py-1 bg-nexus-amber/20 text-nexus-amber rounded border border-nexus-amber/30">
                          <AlertTriangle className="w-3 h-3 mr-2" /> Affected
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-10 flex gap-4">
                    <button 
                      onClick={() => window.location.reload()}
                      className="flex-1 py-4 bg-nexus-card hover:bg-nexus-card/80 text-white font-medium rounded-lg transition-colors border border-nexus-border"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handlePropagate}
                      className="flex-[2] py-4 bg-nexus-cyan hover:bg-nexus-cyan/90 text-black font-bold rounded-lg text-lg transition-all shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_30px_rgba(0,212,255,0.5)] flex items-center justify-center relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        <GitBranch className="w-5 h-5 mr-2" /> Update All Artefacts
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: PROPAGATION COMPLETE (or propagating) */}
            {(propagationStatus === 'propagating' || propagationStatus === 'complete') && (
              <motion.div 
                key="stage-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-3xl text-center"
              >
                {propagationStatus === 'propagating' ? (
                  <div className="py-20 flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-8">
                      <div className="absolute inset-0 border-4 border-nexus-cyan/20 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-nexus-cyan rounded-full border-t-transparent animate-spin"></div>
                      <GitBranch className="absolute inset-0 m-auto w-8 h-8 text-nexus-cyan animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Propagating Changes</h2>
                    <p className="text-gray-400">Updating affected artefacts and re-running validation checks...</p>
                  </div>
                ) : (
                  <div className="py-10">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="inline-flex items-center justify-center p-4 bg-nexus-green/20 rounded-full mb-6 border border-nexus-green/40 shadow-[0_0_30px_rgba(0,230,118,0.3)]"
                    >
                      <CheckCircle2 className="w-12 h-12 text-nexus-green" />
                    </motion.div>
                    
                    <h2 className="text-4xl font-bold mb-4 text-white">System Synchronized</h2>
                    <p className="text-xl text-nexus-green mb-8">Content DNA v2.0 is now the active source-of-truth.</p>

                    <div className="bg-nexus-panel border border-nexus-green/30 rounded-xl shadow-2xl p-6 text-left mb-8 max-w-2xl mx-auto">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Propagation Log</h3>
                      <div className="space-y-3">
                        {propagationImpact?.affectedArtifacts.map((art, idx) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            key={art.artifactId} 
                            className="flex items-center text-gray-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-nexus-green mr-3 flex-shrink-0" />
                            <span><strong className="text-white">{art.artifactTitle}</strong> updated and re-validated</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <motion.button 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      onClick={() => router.push('/review/art-001')}
                      className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-lg text-lg transition-all shadow-lg flex items-center mx-auto"
                    >
                      Continue to Human Review <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
