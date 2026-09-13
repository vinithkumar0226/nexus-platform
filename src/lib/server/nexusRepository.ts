import "server-only";

import type { Artifact, AuditEvent, Source } from "@/types";
import type { WorkspaceSnapshot } from "@/types/api";

export interface NexusRepository {
  getWorkspaceSnapshot(): Promise<WorkspaceSnapshot>;
  getSourceById(id: string): Promise<Source | undefined>;
  getArtifactById(id: string): Promise<Artifact | undefined>;
  createSource(source: Source): Promise<Source>;
  createAuditEvent(event: AuditEvent): Promise<void>;
}
