import type {
  Artifact,
  AuditEvent,
  ContentDNA,
  Source,
  TransformationJob,
} from "@/types";

export interface ApiSuccess<T> {
  data: T;
  requestId: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
  requestId: string;
}

export interface HealthResponse {
  service: "nexus-api";
  status: "ok" | "degraded";
  persistence: "in-memory" | "postgresql";
  timestamp: string;
}

export interface WorkspaceSnapshot {
  sources: Source[];
  contentDNA: ContentDNA;
  artifacts: Artifact[];
  auditEvents: AuditEvent[];
  transformationJob: TransformationJob | null;
}
