import "server-only";

import {
  mockArtifacts,
  mockAuditEvents,
  mockContentDNA,
  mockSources,
  mockTransformationJob,
} from "@/data/mockData";
import type { Artifact, AuditEvent, ContentDNA, Source } from "@/types";
import type { WorkspaceSnapshot } from "@/types/api";
import type { NexusRepository } from "./nexusRepository";

function clone<T>(value: T): T {
  return structuredClone(value);
}

let sources = clone(mockSources);
let auditEvents = clone(mockAuditEvents);
let contentDNA = clone(mockContentDNA);

export const inMemoryNexusRepository: NexusRepository = {
  async getWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
    return clone({
      sources,
      contentDNA,
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

  async saveContentDNA(nextContentDNA: ContentDNA): Promise<ContentDNA> {
    contentDNA = clone(nextContentDNA);
    return clone(contentDNA);
  },

  async linkContentDNA(
    sourceId: string,
    contentDnaId: string,
  ): Promise<Source> {
    const source = sources.find((item) => item.id === sourceId);
    if (!source) throw new Error("Source was not found.");
    source.contentDnaId = contentDnaId;
    return clone(source);
  },

  async createAuditEvent(event: AuditEvent): Promise<void> {
    auditEvents = [...auditEvents, clone(event)];
  },
};
