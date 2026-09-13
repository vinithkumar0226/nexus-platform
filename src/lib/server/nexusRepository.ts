import "server-only";

import type { Artifact, Source } from "@/types";
import type { WorkspaceSnapshot } from "@/types/api";

export interface NexusRepository {
  getWorkspaceSnapshot(): Promise<WorkspaceSnapshot>;
  getSourceById(id: string): Promise<Source | undefined>;
  getArtifactById(id: string): Promise<Artifact | undefined>;
}
