import "server-only";

import type { Artifact, AuditEvent, ContentDNA, Source } from "@/types";
import type { WorkspaceSnapshot } from "@/types/api";

export interface NexusRepository {
  getWorkspaceSnapshot(): Promise<WorkspaceSnapshot>;
  getSourceById(id: string): Promise<Source | undefined>;
  getArtifactById(id: string): Promise<Artifact | undefined>;
  createSource(source: Source): Promise<Source>;
  saveContentDNA(contentDNA: ContentDNA): Promise<ContentDNA>;
  linkContentDNA(sourceId: string, contentDnaId: string): Promise<Source>;
  reviewArtifact(
    artifactId: string,
    action: "approve" | "reject",
    reason?: string,
  ): Promise<Artifact | undefined>;
  createAuditEvent(event: AuditEvent): Promise<void>;
}
