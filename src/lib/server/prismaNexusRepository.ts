import "server-only";

import { getPrismaClient } from "./prisma";
import type {
  Artifact,
  ArtifactSection,
  ArtifactStatus,
  AuditEvent,
  ContentDNA,
  Entity,
  Fact,
  Claim,
  Recommendation,
  Source,
  TransformationJob,
  ValidationIssue,
} from "@/types";
import type { WorkspaceSnapshot } from "@/types/api";
import type { NexusRepository } from "./nexusRepository";

function toSource(record: {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  sha256: string;
  pageCount: number;
  wordCount: number;
  status: string;
  securityFlags: unknown;
  uploadedAt: Date;
  processedAt: Date | null;
  contentDnaId: string | null;
}): Source {
  return {
    id: record.id,
    filename: record.filename,
    fileType: record.fileType as Source["fileType"],
    fileSize: record.fileSize,
    sha256: record.sha256,
    pageCount: record.pageCount,
    wordCount: record.wordCount,
    status: record.status as Source["status"],
    securityFlags: record.securityFlags as Source["securityFlags"],
    uploadedAt: record.uploadedAt.toISOString(),
    processedAt: record.processedAt?.toISOString(),
    contentDnaId: record.contentDnaId ?? undefined,
  };
}

function toContentDNA(record: {
  id: string;
  sourceId: string;
  version: string;
  topic: string;
  domain: string;
  severity: string;
  communicationObjective: string;
  summary: string;
  createdAt: Date;
  updatedAt: Date;
  previousVersionId: string | null;
  facts: Array<{
    id: string;
    statement: string;
    confidence: number;
    sourcePage: number;
    sourceSection: string;
    sourceText: string;
    status: string;
    currentValue: string | null;
  }>;
  entities: Array<{
    id: string;
    name: string;
    type: string;
    mentions: number;
    sourcePage: number;
  }>;
  events: Array<{
    id: string;
    date: string;
    event: string;
    significance: string;
    sourcePage: number;
  }>;
  claims: Array<{
    id: string;
    statement: string;
    status: string;
    confidence: number;
    sourcePage: number;
  }>;
  recommendations: Array<{
    id: string;
    action: string;
    priority: string;
    sourcePage: number;
  }>;
  uncertainties: Array<{
    id: string;
    description: string;
    impact: string;
  }>;
}): ContentDNA {
  return {
    id: record.id,
    sourceId: record.sourceId,
    version: record.version,
    topic: record.topic,
    domain: record.domain,
    severity: record.severity as ContentDNA["severity"],
    communicationObjective: record.communicationObjective,
    summary: record.summary,
    facts: record.facts.map(
      (fact): Fact => ({
        id: fact.id,
        statement: fact.statement,
        confidence: fact.confidence,
        sourcePage: fact.sourcePage,
        sourceSection: fact.sourceSection,
        sourceText: fact.sourceText,
        status: fact.status as Fact["status"],
        currentValue: fact.currentValue ?? undefined,
      }),
    ),
    entities: record.entities.map(
      (entity): Entity => ({
        id: entity.id,
        name: entity.name,
        type: entity.type as Entity["type"],
        mentions: entity.mentions,
        sourcePage: entity.sourcePage,
      }),
    ),
    events: record.events.map((event) => ({
      id: event.id,
      date: event.date,
      event: event.event,
      significance:
        event.significance as ContentDNA["events"][number]["significance"],
      sourcePage: event.sourcePage,
    })),
    claims: record.claims.map(
      (claim): Claim => ({
        id: claim.id,
        statement: claim.statement,
        status: claim.status as Claim["status"],
        confidence: claim.confidence,
        sourcePage: claim.sourcePage,
      }),
    ),
    recommendations: record.recommendations.map(
      (recommendation): Recommendation => ({
        id: recommendation.id,
        action: recommendation.action,
        priority: recommendation.priority as Recommendation["priority"],
        sourcePage: recommendation.sourcePage,
      }),
    ),
    uncertainties: record.uncertainties.map((uncertainty) => ({
      id: uncertainty.id,
      description: uncertainty.description,
      impact:
        uncertainty.impact as ContentDNA["uncertainties"][number]["impact"],
    })),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    previousVersionId: record.previousVersionId ?? undefined,
  };
}

function toArtifact(record: {
  id: string;
  sourceId: string;
  contentDnaId: string;
  dnaVersion: string;
  type: string;
  status: string;
  title: string;
  generatedAt: Date;
  updatedAt: Date;
  approvedBy: string | null;
  approvedAt: Date | null;
  rejectedBy: string | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
  exportedAt: Date | null;
  exportFormat: string | null;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    factIds: unknown;
    slideNumber: number | null;
    speakerNotes: string | null;
  }>;
  issues: Array<{
    id: string;
    artifactId: string;
    sectionId: string;
    type: string;
    severity: string;
    status: string;
    generatedText: string;
    sourceText: string;
    factId: string | null;
    sourcePage: number | null;
    sourceFile: string | null;
    description: string;
  }>;
}): Artifact {
  return {
    id: record.id,
    sourceId: record.sourceId,
    contentDnaId: record.contentDnaId,
    dnaVersion: record.dnaVersion,
    type: record.type as Artifact["type"],
    status: record.status as ArtifactStatus,
    title: record.title,
    sections: record.sections.map(
      (section): ArtifactSection => ({
        id: section.id,
        title: section.title,
        content: section.content,
        factIds: section.factIds as string[],
        slideNumber: section.slideNumber ?? undefined,
        speakerNotes: section.speakerNotes ?? undefined,
      }),
    ),
    validationIssues: record.issues.map(
      (issue): ValidationIssue => ({
        id: issue.id,
        artifactId: issue.artifactId,
        sectionId: issue.sectionId,
        type: issue.type as ValidationIssue["type"],
        severity: issue.severity as ValidationIssue["severity"],
        status: issue.status as ValidationIssue["status"],
        generatedText: issue.generatedText,
        sourceText: issue.sourceText,
        factId: issue.factId ?? undefined,
        sourcePage: issue.sourcePage ?? undefined,
        sourceFile: issue.sourceFile ?? undefined,
        description: issue.description,
      }),
    ),
    approvedBy: record.approvedBy ?? undefined,
    approvedAt: record.approvedAt?.toISOString(),
    rejectedBy: record.rejectedBy ?? undefined,
    rejectedAt: record.rejectedAt?.toISOString(),
    rejectionReason: record.rejectionReason ?? undefined,
    exportedAt: record.exportedAt?.toISOString(),
    exportFormat: record.exportFormat ?? undefined,
    generatedAt: record.generatedAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function toAuditEvent(record: {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  objectType: string;
  objectId: string;
  objectName: string;
  version: string | null;
  result: string;
  metadata: unknown;
  description: string;
}): AuditEvent {
  return {
    id: record.id,
    timestamp: record.timestamp.toISOString(),
    actor: record.actor,
    action: record.action as AuditEvent["action"],
    objectType: record.objectType as AuditEvent["objectType"],
    objectId: record.objectId,
    objectName: record.objectName,
    version: record.version ?? undefined,
    result: record.result as AuditEvent["result"],
    metadata: record.metadata as AuditEvent["metadata"],
    description: record.description,
  };
}

function toTransformationJob(record: {
  id: string;
  sourceId: string;
  contentDnaId: string | null;
  selectedOutputs: unknown;
  steps: unknown;
  artifactIds: unknown;
  startedAt: Date;
  completedAt: Date | null;
  status: string;
}): TransformationJob {
  return {
    id: record.id,
    sourceId: record.sourceId,
    contentDnaId: record.contentDnaId ?? undefined,
    selectedOutputs:
      record.selectedOutputs as TransformationJob["selectedOutputs"],
    steps: record.steps as TransformationJob["steps"],
    artifactIds: record.artifactIds as string[],
    startedAt: record.startedAt.toISOString(),
    completedAt: record.completedAt?.toISOString(),
    status: record.status as TransformationJob["status"],
  };
}

const contentDnaInclude = {
  facts: true,
  entities: true,
  events: true,
  claims: true,
  recommendations: true,
  uncertainties: true,
} as const;

const artifactInclude = {
  sections: true,
  issues: true,
} as const;

export const prismaNexusRepository: NexusRepository = {
  async getWorkspaceSnapshot(): Promise<WorkspaceSnapshot> {
    const prisma = getPrismaClient();
    const [sources, contentDna, artifacts, auditEvents, transformationJob] =
      await Promise.all([
        prisma.source.findMany({ orderBy: { uploadedAt: "desc" } }),
        prisma.contentDNA.findUnique({
          where: { sourceId: "src-001" },
          include: contentDnaInclude,
        }),
        prisma.artifact.findMany({
          orderBy: { updatedAt: "desc" },
          include: artifactInclude,
        }),
        prisma.auditEvent.findMany({ orderBy: { timestamp: "asc" } }),
        prisma.transformationJob.findFirst({ orderBy: { startedAt: "desc" } }),
      ]);

    if (!contentDna) {
      throw new Error(
        "No Content DNA record exists in the workspace database.",
      );
    }

    return {
      sources: sources.map(toSource),
      contentDNA: toContentDNA(contentDna),
      artifacts: artifacts.map(toArtifact),
      auditEvents: auditEvents.map(toAuditEvent),
      transformationJob: transformationJob
        ? toTransformationJob(transformationJob)
        : null,
    };
  },

  async getSourceById(id: string): Promise<Source | undefined> {
    const source = await getPrismaClient().source.findUnique({ where: { id } });
    return source ? toSource(source) : undefined;
  },

  async getArtifactById(id: string): Promise<Artifact | undefined> {
    const artifact = await getPrismaClient().artifact.findUnique({
      where: { id },
      include: artifactInclude,
    });
    return artifact ? toArtifact(artifact) : undefined;
  },
};
