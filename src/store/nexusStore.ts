// ============================================================
// NEXUS — Global State Store (Zustand)
// ============================================================

import { create } from 'zustand';
import type {
  Source, ContentDNA, Artifact, AuditEvent, ValidationIssue,
  ProvenanceLink, TransformationJob, Fact, PropagationImpact,
} from '@/types';
import {
  mockSources, mockContentDNA, mockArtifacts, mockAuditEvents,
  mockValidationSummary, mockProvenanceLinks, mockTransformationJob,
} from '@/data/mockData';

// ============================================================
// State Shape
// ============================================================

interface NexusState {
  // Sources
  sources: Source[];
  selectedSourceId: string | null;

  // Content DNA (shared across artifacts)
  contentDNA: ContentDNA;

  // Artifacts
  artifacts: Artifact[];

  // Active artifact for review/viewer
  activeArtifactId: string | null;

  // Provenance panel
  provenanceOpen: boolean;
  activeProvenanceLink: ProvenanceLink | null;

  // Transformation job
  transformationJob: TransformationJob | null;

  // Audit
  auditEvents: AuditEvent[];

  // Change propagation
  propagationImpact: PropagationImpact | null;
  propagationStatus: 'idle' | 'analyzing' | 'ready' | 'propagating' | 'complete';

  // Upload flow
  uploadProgress: number;
  uploadStage: 'idle' | 'uploading' | 'validating' | 'extracting' | 'analyzing' | 'done';

  // UI state
  sidebarCollapsed: boolean;
  toastMessages: ToastMessage[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
}

// ============================================================
// Actions Shape
// ============================================================

interface NexusActions {
  // Source actions
  selectSource: (id: string) => void;
  addSource: (source: Source) => void;
  setUploadStage: (stage: NexusState['uploadStage'], progress?: number) => void;

  // Content DNA actions
  updateFact: (factId: string, newValue: string) => void;
  analyzeFactImpact: (factId: string, newValue: string) => void;
  propagateChanges: () => void;

  // Artifact actions
  setActiveArtifact: (id: string) => void;
  updateArtifactStatus: (id: string, status: Artifact['status']) => void;
  updateArtifactSection: (artifactId: string, sectionId: string, content: string) => void;
  approveArtifact: (artifactId: string) => void;
  rejectArtifact: (artifactId: string, reason: string) => void;
  exportArtifact: (artifactId: string, format: string) => void;
  resolveValidationIssue: (artifactId: string, issueId: string, action: 'fix' | 'ignore') => void;

  // Provenance panel
  openProvenance: (link: ProvenanceLink) => void;
  closeProvenance: () => void;

  // Transformation
  startTransformation: (sourceId: string, outputs: string[]) => void;

  // Audit
  addAuditEvent: (event: Omit<AuditEvent, 'id'>) => void;

  // UI
  toggleSidebar: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

// ============================================================
// Store
// ============================================================

export const useNexusStore = create<NexusState & NexusActions>((set, get) => ({
  // ─── Initial State ───────────────────────────────────────

  sources: mockSources,
  selectedSourceId: 'src-001',
  contentDNA: mockContentDNA,
  artifacts: mockArtifacts,
  activeArtifactId: 'art-001',
  provenanceOpen: false,
  activeProvenanceLink: null,
  transformationJob: mockTransformationJob,
  auditEvents: mockAuditEvents,
  propagationImpact: null,
  propagationStatus: 'idle',
  uploadProgress: 0,
  uploadStage: 'idle',
  sidebarCollapsed: false,
  toastMessages: [],

  // ─── Source Actions ───────────────────────────────────────

  selectSource: (id) => set({ selectedSourceId: id }),

  addSource: (source) =>
    set((state) => ({ sources: [...state.sources, source] })),

  setUploadStage: (stage, progress = 0) =>
    set({ uploadStage: stage, uploadProgress: progress }),

  // ─── Content DNA Actions ──────────────────────────────────

  updateFact: (factId, newValue) =>
    set((state) => ({
      contentDNA: {
        ...state.contentDNA,
        facts: state.contentDNA.facts.map((f) =>
          f.id === factId ? { ...f, currentValue: newValue } : f
        ),
      },
    })),

  analyzeFactImpact: (factId, newValue) => {
    const { artifacts, contentDNA, addAuditEvent } = get();
    const fact = contentDNA.facts.find((f) => f.id === factId);
    if (!fact) return;

    const previousValue = fact.currentValue || fact.statement;

    // Find artifacts that reference this fact
    const affected = artifacts
      .filter((art) =>
        art.sections.some((sec) => sec.factIds.includes(factId))
      )
      .map((art) => ({
        artifactId: art.id,
        artifactType: art.type,
        artifactTitle: art.title,
        sectionIds: art.sections
          .filter((sec) => sec.factIds.includes(factId))
          .map((sec) => sec.id),
        status: 'pending' as const,
      }));

    const impact: PropagationImpact = {
      factId,
      factStatement: fact.statement,
      previousValue,
      newValue,
      affectedArtifacts: affected,
    };

    // Update DNA version
    set((state) => ({
      contentDNA: {
        ...state.contentDNA,
        version: '2.0',
        updatedAt: new Date().toISOString(),
        facts: state.contentDNA.facts.map((f) =>
          f.id === factId ? { ...f, currentValue: newValue } : f
        ),
      },
      propagationImpact: impact,
      propagationStatus: 'ready',
    }));

    addAuditEvent({
      timestamp: new Date().toISOString(),
      actor: 'Operator',
      action: 'fact_corrected',
      objectType: 'fact',
      objectId: factId,
      objectName: `Fact ${factId}`,
      version: '2.0',
      result: 'success',
      description: `Fact ${factId} updated: ${previousValue} → ${newValue}`,
      metadata: { previousValue, newValue, dnaVersionBumped: '2.0' },
    });
  },

  propagateChanges: () => {
    const { propagationImpact, addAuditEvent, addToast } = get();
    if (!propagationImpact) return;

    set({ propagationStatus: 'propagating' });

    // Simulate propagation — update artifact sections
    setTimeout(() => {
      set((state) => ({
        artifacts: state.artifacts.map((art) => {
          const affectedInfo = propagationImpact.affectedArtifacts.find(
            (a) => a.artifactId === art.id
          );
          if (!affectedInfo) return art;

          return {
            ...art,
            dnaVersion: '2.0',
            status: 'generated' as const,
            updatedAt: new Date().toISOString(),
            sections: art.sections.map((sec) => {
              if (!affectedInfo.sectionIds.includes(sec.id)) return sec;
              // Replace old value with new value in content
              return {
                ...sec,
                content: sec.content
                  .replace(new RegExp(propagationImpact.previousValue, 'g'), propagationImpact.newValue)
                  .replace('180 servers', '20 servers'), // fix the deliberate conflict too
              };
            }),
            // Clear old validation issues related to this fact
            validationIssues: art.validationIssues.filter(
              (vi) => vi.factId !== propagationImpact.factId
            ),
          };
        }),
        propagationImpact: {
          ...propagationImpact,
          affectedArtifacts: propagationImpact.affectedArtifacts.map((a) => ({
            ...a,
            status: 'updated' as const,
          })),
        },
        propagationStatus: 'complete',
      }));

      addAuditEvent({
        timestamp: new Date().toISOString(),
        actor: 'System',
        action: 'propagation_triggered',
        objectType: 'content_dna',
        objectId: 'dna-001',
        objectName: 'Content DNA v2.0',
        version: '2.0',
        result: 'success',
        description: `Change propagated to ${propagationImpact.affectedArtifacts.length} artifacts`,
        metadata: { artifactsUpdated: propagationImpact.affectedArtifacts.length },
      });

      addToast({
        type: 'success',
        title: 'Propagation Complete',
        description: `${propagationImpact.affectedArtifacts.length} artefacts updated and revalidated.`,
      });
    }, 1500);
  },

  // ─── Artifact Actions ─────────────────────────────────────

  setActiveArtifact: (id) => set({ activeArtifactId: id }),

  updateArtifactStatus: (id, status) =>
    set((state) => ({
      artifacts: state.artifacts.map((a) =>
        a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
      ),
    })),

  updateArtifactSection: (artifactId, sectionId, content) =>
    set((state) => ({
      artifacts: state.artifacts.map((art) =>
        art.id === artifactId
          ? {
              ...art,
              sections: art.sections.map((sec) =>
                sec.id === sectionId ? { ...sec, content } : sec
              ),
              updatedAt: new Date().toISOString(),
            }
          : art
      ),
    })),

  approveArtifact: (artifactId) => {
    const { addAuditEvent, addToast } = get();
    set((state) => ({
      artifacts: state.artifacts.map((a) =>
        a.id === artifactId
          ? {
              ...a,
              status: 'approved' as const,
              approvedBy: 'Operator',
              approvedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    }));
    addAuditEvent({
      timestamp: new Date().toISOString(),
      actor: 'Operator',
      action: 'artifact_approved',
      objectType: 'artifact',
      objectId: artifactId,
      objectName: 'Artifact',
      result: 'success',
      description: 'Artifact approved by operator',
      metadata: {},
    });
    addToast({ type: 'success', title: 'Artefact Approved', description: 'Ready for export.' });
  },

  rejectArtifact: (artifactId, reason) => {
    const { addAuditEvent, addToast } = get();
    set((state) => ({
      artifacts: state.artifacts.map((a) =>
        a.id === artifactId
          ? {
              ...a,
              status: 'rejected' as const,
              rejectedBy: 'Operator',
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    }));
    addAuditEvent({
      timestamp: new Date().toISOString(),
      actor: 'Operator',
      action: 'artifact_rejected',
      objectType: 'artifact',
      objectId: artifactId,
      objectName: 'Artifact',
      result: 'warning',
      description: `Artifact rejected: ${reason}`,
      metadata: { reason },
    });
    addToast({ type: 'warning', title: 'Artefact Rejected', description: reason });
  },

  exportArtifact: (artifactId, format) => {
    const { addAuditEvent, addToast } = get();
    set((state) => ({
      artifacts: state.artifacts.map((a) =>
        a.id === artifactId
          ? {
              ...a,
              status: 'exported' as const,
              exportedAt: new Date().toISOString(),
              exportFormat: format,
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    }));
    addAuditEvent({
      timestamp: new Date().toISOString(),
      actor: 'Operator',
      action: 'artifact_exported',
      objectType: 'export',
      objectId: artifactId,
      objectName: `Artifact — ${format.toUpperCase()}`,
      result: 'success',
      description: `Artifact exported as ${format.toUpperCase()}`,
      metadata: { format },
    });
    addToast({ type: 'success', title: 'Export Ready', description: `${format.toUpperCase()} file is ready for download.` });
  },

  resolveValidationIssue: (artifactId, issueId, action) =>
    set((state) => ({
      artifacts: state.artifacts.map((art) =>
        art.id === artifactId
          ? {
              ...art,
              validationIssues: art.validationIssues.map((vi) =>
                vi.id === issueId ? { ...vi, status: action === 'fix' ? 'fixed' : 'ignored' } : vi
              ),
            }
          : art
      ),
    })),

  // ─── Provenance ───────────────────────────────────────────

  openProvenance: (link) => set({ provenanceOpen: true, activeProvenanceLink: link }),
  closeProvenance: () => set({ provenanceOpen: false, activeProvenanceLink: null }),

  // ─── Transformation ───────────────────────────────────────

  startTransformation: (sourceId, outputs) => {
    set({ transformationJob: { ...mockTransformationJob, sourceId } });
  },

  // ─── Audit ────────────────────────────────────────────────

  addAuditEvent: (event) =>
    set((state) => ({
      auditEvents: [
        ...state.auditEvents,
        { ...event, id: `audit-${Date.now()}` },
      ],
    })),

  // ─── UI ───────────────────────────────────────────────────

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  addToast: (toast) =>
    set((state) => ({
      toastMessages: [
        ...state.toastMessages,
        { ...toast, id: `toast-${Date.now()}` },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toastMessages: state.toastMessages.filter((t) => t.id !== id),
    })),
}));
