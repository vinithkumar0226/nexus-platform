// ============================================================
// NEXUS — Core TypeScript Types
// ============================================================

export type FileType = "pdf" | "docx" | "txt";
export type SeverityLevel =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Informational";
export type SourceStatus =
  | "uploading"
  | "validating"
  | "extracting"
  | "analyzing"
  | "processed"
  | "analyzed"
  | "failed";
export type ArtifactType =
  | "executive_brief"
  | "advisory"
  | "presentation"
  | "linkedin"
  | "twitter"
  | "infographic"
  | "video";
export type ArtifactStatus =
  | "pending"
  | "generating"
  | "generated"
  | "validated"
  | "reviewed"
  | "approved"
  | "exported"
  | "rejected";
export type ValidationStatus =
  | "verified"
  | "conflict"
  | "unsupported"
  | "uncertain"
  | "pending";
export type ClaimStatus =
  | "supported"
  | "uncertain"
  | "requires_review"
  | "conflicting";
export type AuditAction =
  | "source_uploaded"
  | "source_validated"
  | "source_extracted"
  | "dna_generated"
  | "artifact_generated"
  | "validation_completed"
  | "review_started"
  | "fact_corrected"
  | "artifact_regenerated"
  | "artifact_approved"
  | "artifact_rejected"
  | "artifact_exported"
  | "dna_updated"
  | "propagation_triggered"
  | "security_check_completed";

// ============================================================
// SOURCE
// ============================================================

export interface Source {
  id: string;
  filename: string;
  fileType: FileType;
  fileSize: number;
  sha256: string;
  pageCount: number;
  wordCount: number;
  status: SourceStatus;
  securityFlags: SecurityFinding[];
  uploadedAt: string;
  storageKey?: string;
  processedAt?: string;
  contentDnaId?: string;
}

export interface SourceChunk {
  id: string;
  sourceId: string;
  page: number;
  section: string;
  text: string;
  charStart: number;
  charEnd: number;
}

// ============================================================
// SECURITY
// ============================================================

export type SecurityFindingType =
  | "pii"
  | "credential"
  | "internal_ip"
  | "confidential_marker"
  | "phone"
  | "email";

export interface SecurityFinding {
  id: string;
  type: SecurityFindingType;
  description: string;
  excerpt: string;
  page: number;
  status: "pending" | "masked" | "reviewed" | "ignored";
}

// ============================================================
// CONTENT DNA
// ============================================================

export interface Fact {
  id: string; // F001, F002 ...
  statement: string;
  confidence: number; // 0-1 extraction confidence
  sourcePage: number;
  sourceSection: string;
  sourceText: string;
  status: "verified" | "uncertain" | "conflicting";
  currentValue?: string; // for editable numeric/key facts
}

export interface Entity {
  id: string;
  name: string;
  type:
    | "organization"
    | "person"
    | "location"
    | "threat_actor"
    | "system"
    | "technology"
    | "other";
  mentions: number;
  sourcePage: number;
}

export interface Event {
  id: string;
  date: string;
  event: string;
  significance: "high" | "medium" | "low";
  sourcePage: number;
}

export interface Claim {
  id: string;
  statement: string;
  status: ClaimStatus;
  confidence: number;
  sourcePage: number;
}

export interface Recommendation {
  id: string;
  action: string;
  priority: "immediate" | "short_term" | "long_term";
  sourcePage: number;
}

export interface Uncertainty {
  id: string;
  description: string;
  impact: "high" | "medium" | "low";
}

export interface ContentDNA {
  id: string;
  sourceId: string;
  version: string;
  topic: string;
  domain: string;
  severity: SeverityLevel;
  communicationObjective: string;
  summary: string;
  facts: Fact[];
  entities: Entity[];
  events: Event[];
  claims: Claim[];
  recommendations: Recommendation[];
  uncertainties: Uncertainty[];
  createdAt: string;
  updatedAt: string;
  previousVersionId?: string;
}

// ============================================================
// ARTIFACT
// ============================================================

export interface ArtifactSection {
  id: string;
  title: string;
  content: string;
  factIds: string[]; // which facts this section references
  slideNumber?: number; // for presentations
  speakerNotes?: string; // for presentations
}

export interface Artifact {
  id: string;
  sourceId: string;
  contentDnaId: string;
  dnaVersion: string;
  type: ArtifactType;
  status: ArtifactStatus;
  title: string;
  sections: ArtifactSection[];
  validationIssues: ValidationIssue[];
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  exportedAt?: string;
  exportFormat?: string;
  generatedAt: string;
  updatedAt: string;
}

// ============================================================
// VALIDATION
// ============================================================

export interface ValidationIssue {
  id: string;
  artifactId: string;
  sectionId: string;
  type:
    | "number_conflict"
    | "date_conflict"
    | "entity_conflict"
    | "unsupported_claim"
    | "semantic_inconsistency";
  severity: "critical" | "warning" | "info";
  status: "open" | "fixed" | "ignored";
  generatedText: string;
  sourceText: string;
  factId?: string;
  sourcePage?: number;
  sourceFile?: string;
  description: string;
}

export interface ValidationSummary {
  artifactId: string;
  totalClaims: number;
  verified: number;
  conflicts: number;
  unsupported: number;
  uncertain: number;
  numbersChecked: number;
  datesChecked: number;
  entitiesChecked: number;
  completedAt?: string;
}

// ============================================================
// PROVENANCE
// ============================================================

export interface ProvenanceLink {
  id: string;
  artifactId: string;
  sectionId: string;
  statement: string;
  factId: string;
  factStatement: string;
  sourceFile: string;
  sourcePage: number;
  sourceSection: string;
  sourceText: string;
  dnaVersion: string;
  confidence: number;
}

// ============================================================
// AUDIT
// ============================================================

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: AuditAction;
  objectType:
    | "source"
    | "content_dna"
    | "artifact"
    | "fact"
    | "export"
    | "system";
  objectId: string;
  objectName: string;
  version?: string;
  result: "success" | "failure" | "warning";
  metadata: Record<string, string | number | boolean>;
  description: string;
}

// ============================================================
// TRANSFORMATION
// ============================================================

export type TransformStep =
  | "upload"
  | "validate"
  | "extract"
  | "intelligence"
  | "dna"
  | "blueprint"
  | "generate"
  | "validate_output"
  | "provenance"
  | "security"
  | "review";

export type StepStatus =
  | "completed"
  | "processing"
  | "pending"
  | "needs_review"
  | "error";

export interface TransformStepState {
  step: TransformStep;
  label: string;
  status: StepStatus;
  detail?: string;
  timestamp?: string;
}

export interface TransformationJob {
  id: string;
  sourceId: string;
  contentDnaId?: string;
  selectedOutputs: ArtifactType[];
  steps: TransformStepState[];
  artifactIds: string[];
  startedAt: string;
  completedAt?: string;
  status: "running" | "completed" | "failed" | "needs_review";
}

// ============================================================
// CHANGE PROPAGATION
// ============================================================

export interface FactChange {
  factId: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  changedAt: string;
}

export interface PropagationImpact {
  factId: string;
  factStatement: string;
  previousValue: string;
  newValue: string;
  affectedArtifacts: {
    artifactId: string;
    artifactType: ArtifactType;
    artifactTitle: string;
    sectionIds: string[];
    status: "pending" | "updated" | "failed";
  }[];
}

// ============================================================
// UI STATE
// ============================================================

export interface TransformConfig {
  audience: string;
  tone: string;
  language: string;
  detailLevel: number; // 0-100
  communicationObjective: string;
  style: string;
  selectedOutputs: ArtifactType[];
}

export interface DashboardStats {
  totalSources: number;
  totalArtifacts: number;
  validated: number;
  pendingReview: number;
}
