import "server-only";

import {
  mockArtifacts,
  mockAuditEvents,
  mockContentDNA,
  mockSources,
  mockTransformationJob,
} from "@/data/mockData";
import type { Artifact, Source } from "@/types";
import type { WorkspaceSnapshot } from "@/types/api";
import type { NexusRepository } from "./nexusRepository";

function clone<T>(value: T): T {
  return structuredClone(value);
}

export const inMemoryNexusRepository: NexusRepository = {
  async getWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
    return clone({
      sources: mockSources,
      contentDNA: mockContentDNA,
      artifacts: mockArtifacts,
      auditEvents: mockAuditEvents,
      transformationJob: mockTransformationJob,
    });
  },

  async getSourceById(id: string): Promise<Source | undefined> {
    const source = mockSources.find((item) => item.id === id);
    return source ? clone(source) : undefined;
  },

  async getArtifactById(id: string): Promise<Artifact | undefined> {
    const artifact = mockArtifacts.find((item) => item.id === id);
    return artifact ? clone(artifact) : undefined;
  },
};
