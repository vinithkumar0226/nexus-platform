'use client';

import React from 'react';
import { useNexusStore } from '@/store/nexusStore';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Circle, Loader2, AlertTriangle, 
  ArrowRight, FileText, Shield, Presentation, Check
} from 'lucide-react';
import Link from 'next/link';

export default function TransformationProgressPage({ params }: { params: { id: string } }) {
  const { transformationJob, artifacts } = useNexusStore();
  
  if (!transformationJob) {
    return <div className="p-8 text-nexus-text-secondary">No active transformation job found.</div>;
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-nexus-green" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-nexus-cyan animate-spin" />;
      case 'needs_review':
        return <AlertTriangle className="w-5 h-5 text-nexus-amber" />;
      default:
        return <Circle className="w-5 h-5 text-nexus-border" />;
    }
  };

  return (
    <div className="min-h-screen bg-nexus-bg p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Transformation Pipeline</h1>
            <p className="text-nexus-text-secondary mt-2">Processing source document: <span className="text-nexus-cyan">src-001</span></p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-nexus-card rounded-md border border-nexus-border">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-nexus-cyan"></span>
            </span>
            <span className="text-sm font-medium text-white">Pipeline Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Pipeline Steps */}
          <div className="lg:col-span-2 bg-nexus-panel border border-nexus-border rounded-xl p-8">
            <h2 className="text-xl font-semibold text-white mb-8 border-b border-nexus-border pb-4">Execution Steps</h2>
            
            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-[1.125rem] top-4 bottom-8 w-px bg-nexus-border"></div>

              <div className="space-y-6">
                {transformationJob.steps.map((step, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={step.step} 
                    className="relative flex items-start gap-6"
                  >
                    <div className="relative z-10 bg-nexus-panel p-1 rounded-full">
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between">
                        <h3 className={cn(
                          "font-medium",
                          step.status === 'completed' ? "text-white" : 
                          step.status === 'processing' ? "text-nexus-cyan" : 
                          step.status === 'needs_review' ? "text-nexus-amber" : 
                          "text-nexus-text-secondary"
                        )}>
                          {step.label}
                        </h3>
                        {step.timestamp && (
                          <span className="text-xs text-nexus-text-secondary">{step.timestamp}</span>
                        )}
                      </div>
                      {step.detail && (
                        <p className={cn(
                          "text-sm mt-1",
                          step.status === 'needs_review' ? "text-nexus-amber/80" : "text-nexus-text-secondary"
                        )}>{step.detail}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Output Status & Actions */}
          <div className="space-y-6">
            <div className="bg-nexus-panel border border-nexus-border rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Generated Artefacts</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-nexus-card rounded-lg border border-nexus-border">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-nexus-cyan" />
                    <span className="text-sm font-medium text-white">Executive Brief</span>
                  </div>
                  <Check className="w-4 h-4 text-nexus-green" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-nexus-card rounded-lg border border-nexus-border">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-nexus-cyan" />
                    <span className="text-sm font-medium text-white">Advisory</span>
                  </div>
                  <Check className="w-4 h-4 text-nexus-green" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-nexus-card rounded-lg border border-nexus-border">
                  <div className="flex items-center gap-3">
                    <Presentation className="w-5 h-5 text-nexus-cyan" />
                    <span className="text-sm font-medium text-white">Presentation</span>
                  </div>
                  <Check className="w-4 h-4 text-nexus-green" />
                </div>
              </div>

              <div className="mt-6 p-4 bg-nexus-amber/10 border border-nexus-amber/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-nexus-amber shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-nexus-amber">1 conflict requires review</h4>
                    <p className="text-xs text-nexus-amber/80 mt-1">Found in Executive Brief validation phase.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="bg-nexus-panel border border-nexus-border rounded-xl p-6 flex flex-col gap-3">
              <Link href={`/transform/${params.id}/graph`} className="w-full flex items-center justify-between px-4 py-3 bg-nexus-card hover:bg-nexus-card/80 border border-nexus-border rounded-lg text-sm font-medium text-white transition-colors">
                View Transformation Graph
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link href={`/artifacts/art-001`} className="w-full flex items-center justify-between px-4 py-3 bg-nexus-card hover:bg-nexus-card/80 border border-nexus-border rounded-lg text-sm font-medium text-white transition-colors">
                View Artefacts
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link href={`/validation/${params.id}`} className="w-full flex items-center justify-between px-4 py-3 bg-nexus-cyan hover:bg-nexus-cyan/90 rounded-lg text-sm font-medium text-[#0a0f1e] transition-colors">
                Open Validation Center
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
