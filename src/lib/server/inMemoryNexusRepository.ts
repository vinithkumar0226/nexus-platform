import "server-only";

import {
  mockArtifacts,
  mockAuditEvents,
  mockContentDNA,
  mockSources,
  mockTransformationJob,
} from "@/data/mockData";
import type { Artifact, AuditEvent, Source } from "@/types";
import type { WorkspaceSnapshot } from "@/types/api";
import type { NexusRepository } from "./nexusRepository";

function clone<T>(value: T): T {
  return structuredClone(value);
}

let sources = clone(mockSources);
let auditEvents = clone(mockAuditEvents);

export const inMemoryNexusRepository: NexusRepository = {
  async getWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
    return clone({
      sources,
      contentDNA: mockContentDNA,
      artifacts: mockArtifacts,
      auditEvents,
      transformationJob: mockTransformationJob,
    });
  },

  async getSourceById(id: string): Promise<Source | undefined> {
    const source = sources.find((item) => item.id === id);
    return source ? clone(source) : undefined;
  },

  async getArtifactById(id: string): Promise<Artifact | undefined> {
    const artifact = mockArtifacts.find((item) => item.id === id);
    return artifact ? clone(artifact) : undefined;
  },

  async createSource(source: Source): Promise<Source> {
    sources = [...sources, clone(source)];
    return clone(source);
  },

  async createAuditEvent(event: AuditEvent): Promise<void> {
    auditEvents = [...auditEvents, clone(event)];
  },
};
