'use client';

import React from 'react';
import { useNexusStore } from '@/store/nexusStore';
import { cn } from '@/lib/utils';
import { Download, FileText, CheckCircle2, AlertTriangle, Clock, Presentation, Shield } from 'lucide-react';

export default function ExportsPage() {
  const { artifacts, exportArtifact, auditEvents } = useNexusStore();

  const approvedCount = artifacts.filter(a => a.status === 'approved').length;
  const exportedCount = artifacts.filter(a => a.status === 'exported').length;
  const readyCount = approvedCount; // or something similar based on logic

  const getExportHistory = () => {
    return auditEvents
      .filter(e => e.action === 'artifact_exported')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };
  const exportHistory = getExportHistory();

  const handleExport = (id: string, format: string) => {
    exportArtifact(id, format);
  };

  const getIcon = (type: string) => {
    if (type === 'presentation') return <Presentation className="w-5 h-5" />;
    if (type === 'advisory') return <Shield className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-nexus-bg text-white">
      {/* Header */}
      <header className="px-8 py-6 border-b border-nexus-border bg-nexus-panel flex justify-between items-center z-10 sticky top-0">
        <div>
          <h1 className="text-2xl font-bold">Exports</h1>
          <p className="text-gray-400 mt-1">Generate final documents for distribution</p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="px-4 py-2 bg-nexus-card border border-nexus-border rounded-lg flex items-center">
            <span className="text-gray-400 mr-2">Approved:</span>
            <span className="font-mono font-bold text-white">{approvedCount}</span>
          </div>
          <div className="px-4 py-2 bg-nexus-green/10 border border-nexus-green/30 rounded-lg flex items-center text-nexus-green">
            <span className="mr-2">Exported:</span>
            <span className="font-mono font-bold">{exportedCount}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Warning */}
          <div className="p-4 bg-nexus-amber/10 border border-nexus-amber/30 rounded-lg flex items-center text-nexus-amber">
            <AlertTriangle className="w-5 h-5 mr-3" />
            <p className="font-medium">Only approved artefacts can be exported. Artefacts pending review or generation are locked.</p>
          </div>

          {/* Artifacts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artifacts.map(art => {
              const isApproved = art.status === 'approved' || art.status === 'exported';
              const isExported = art.status === 'exported';
              
              return (
                <div key={art.id} className={cn(
                  "bg-nexus-panel border rounded-xl p-6 transition-all",
                  isExported ? "border-nexus-green/30" : (isApproved ? "border-nexus-cyan/30" : "border-nexus-border opacity-75")
                )}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className={cn(
                        "p-2 rounded-lg mr-3",
                        isApproved ? "bg-nexus-cyan/10 text-nexus-cyan" : "bg-black/40 text-gray-400"
                      )}>
                        {getIcon(art.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-200 uppercase tracking-wide">
                          {art.type.replace('_', ' ')}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{art.title}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 bg-black/30 p-4 rounded-lg border border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Status</span>
                      {isExported ? (
                        <span className="text-nexus-green flex items-center font-medium"><CheckCircle2 className="w-4 h-4 mr-1" /> Exported</span>
                      ) : isApproved ? (
                        <span className="text-nexus-cyan flex items-center font-medium"><CheckCircle2 className="w-4 h-4 mr-1" /> Approved</span>
                      ) : (
                        <span className="text-nexus-amber flex items-center font-medium"><Clock className="w-4 h-4 mr-1" /> {art.status.charAt(0).toUpperCase() + art.status.slice(1)}</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">DNA Version</span>
                      <span className="font-mono text-gray-300">v{art.dnaVersion}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Generated</span>
                      <span className="text-gray-300">{new Date(art.generatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {art.type === 'presentation' ? (
                      <button 
                        disabled={!isApproved}
                        onClick={() => handleExport(art.id, 'pptx')}
                        className={cn(
                          "flex-1 py-2.5 rounded text-sm font-medium transition-colors flex items-center justify-center border",
                          isApproved 
                            ? "bg-nexus-card hover:bg-nexus-card/80 text-white border-white/20" 
                            : "bg-black/40 text-gray-600 border-transparent cursor-not-allowed"
                        )}
                      >
                        <Download className="w-4 h-4 mr-2" /> Export PPTX
                      </button>
                    ) : (
                      <>
                        <button 
                          disabled={!isApproved}
                          onClick={() => handleExport(art.id, 'pdf')}
                          className={cn(
                            "flex-1 py-2.5 rounded text-sm font-medium transition-colors flex items-center justify-center border",
                            isApproved 
                              ? "bg-nexus-cyan hover:bg-nexus-cyan/90 text-black border-transparent" 
                              : "bg-black/40 text-gray-600 border-transparent cursor-not-allowed"
                          )}
                        >
                          <Download className="w-4 h-4 mr-2" /> Export PDF
                        </button>
                        <button 
                          disabled={!isApproved}
                          onClick={() => handleExport(art.id, 'docx')}
                          className={cn(
                            "flex-1 py-2.5 rounded text-sm font-medium transition-colors flex items-center justify-center border",
                            isApproved 
                              ? "bg-nexus-card hover:bg-nexus-card/80 text-white border-white/20" 
                              : "bg-black/40 text-gray-600 border-transparent cursor-not-allowed"
                          )}
                        >
                          <Download className="w-4 h-4 mr-2" /> Export DOCX
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Export History */}
          {exportHistory.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gray-400" /> Export History
              </h2>
              <div className="bg-nexus-panel border border-nexus-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/40 border-b border-nexus-border text-gray-400 uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4 font-medium">Time</th>
                      <th className="px-6 py-4 font-medium">Artefact</th>
                      <th className="px-6 py-4 font-medium">Format</th>
                      <th className="px-6 py-4 font-medium">Operator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nexus-border text-gray-300">
                    {exportHistory.map(evt => (
                      <tr key={evt.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-mono">{new Date(evt.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4 font-medium">{evt.objectName.split(' — ')[0]}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-black rounded border border-white/10 font-mono text-xs">
                            {String(evt.metadata.format).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">{evt.actor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
