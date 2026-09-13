import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client";
import {
  mockArtifacts,
  mockAuditEvents,
  mockContentDNA,
  mockSources,
  mockTransformationJob,
} from "../src/data/mockData";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function seed() {
  for (const source of mockSources) {
    await prisma.source.upsert({
      where: { id: source.id },
      update: {
        filename: source.filename,
        fileType: source.fileType,
        fileSize: source.fileSize,
        sha256: source.sha256,
        pageCount: source.pageCount,
        wordCount: source.wordCount,
        status: source.status,
        securityFlags: source.securityFlags as unknown as Prisma.InputJsonValue,
        uploadedAt: new Date(source.uploadedAt),
        processedAt: source.processedAt ? new Date(source.processedAt) : null,
        contentDnaId: source.contentDnaId ?? null,
      },
      create: {
        id: source.id,
        filename: source.filename,
        fileType: source.fileType,
        fileSize: source.fileSize,
        sha256: source.sha256,
        pageCount: source.pageCount,
        wordCount: source.wordCount,
        status: source.status,
        securityFlags: source.securityFlags as unknown as Prisma.InputJsonValue,
        uploadedAt: new Date(source.uploadedAt),
        processedAt: source.processedAt ? new Date(source.processedAt) : null,
        contentDnaId: source.contentDnaId ?? null,
      },
    });
  }

  const dnaRecords = mockSources.map((source) =>
    source.id === mockContentDNA.sourceId
      ? mockContentDNA
      : {
          ...mockContentDNA,
          id: source.contentDnaId ?? `dna-${source.id}`,
          sourceId: source.id,
          topic: source.filename,
          summary: `Demo Content DNA generated from ${source.filename}.`,
          facts: [],
          entities: [],
          events: [],
          claims: [],
          recommendations: [],
          uncertainties: [],
        },
  );

  for (const dna of dnaRecords) {
    await prisma.contentDNA.upsert({
      where: { id: dna.id },
      update: {
        sourceId: dna.sourceId,
        version: dna.version,
        topic: dna.topic,
        domain: dna.domain,
        severity: dna.severity,
        communicationObjective: dna.communicationObjective,
        summary: dna.summary,
        createdAt: new Date(dna.createdAt),
        updatedAt: new Date(dna.updatedAt),
        previousVersionId: dna.previousVersionId ?? null,
      },
      create: {
        id: dna.id,
        sourceId: dna.sourceId,
        version: dna.version,
        topic: dna.topic,
        domain: dna.domain,
        severity: dna.severity,
        communicationObjective: dna.communicationObjective,
        summary: dna.summary,
        createdAt: new Date(dna.createdAt),
        updatedAt: new Date(dna.updatedAt),
        previousVersionId: dna.previousVersionId ?? null,
      },
    });

    await prisma.fact.deleteMany({ where: { contentDnaId: dna.id } });
    await prisma.entity.deleteMany({ where: { contentDnaId: dna.id } });
    await prisma.dnaEvent.deleteMany({ where: { contentDnaId: dna.id } });
    await prisma.claim.deleteMany({ where: { contentDnaId: dna.id } });
    await prisma.recommendation.deleteMany({ where: { contentDnaId: dna.id } });
    await prisma.uncertainty.deleteMany({ where: { contentDnaId: dna.id } });

    await prisma.fact.createMany({
      data: dna.facts.map((fact) => ({ ...fact, contentDnaId: dna.id })),
    });
    await prisma.entity.createMany({
      data: dna.entities.map((entity) => ({ ...entity, contentDnaId: dna.id })),
    });
    await prisma.dnaEvent.createMany({
      data: dna.events.map((event) => ({ ...event, contentDnaId: dna.id })),
    });
    await prisma.claim.createMany({
      data: dna.claims.map((claim) => ({ ...claim, contentDnaId: dna.id })),
    });
    await prisma.recommendation.createMany({
      data: dna.recommendations.map((recommendation) => ({
        ...recommendation,
        contentDnaId: dna.id,
      })),
    });
    await prisma.uncertainty.createMany({
      data: dna.uncertainties.map((uncertainty) => ({
        ...uncertainty,
        contentDnaId: dna.id,
      })),
    });
  }

  for (const artifact of mockArtifacts) {
    await prisma.artifact.upsert({
      where: { id: artifact.id },
      update: {
        sourceId: artifact.sourceId,
        contentDnaId: artifact.contentDnaId,
        dnaVersion: artifact.dnaVersion,
        type: artifact.type,
        status: artifact.status,
        title: artifact.title,
        generatedAt: new Date(artifact.generatedAt),
        updatedAt: new Date(artifact.updatedAt),
        approvedBy: artifact.approvedBy ?? null,
        approvedAt: artifact.approvedAt ? new Date(artifact.approvedAt) : null,
        rejectedBy: artifact.rejectedBy ?? null,
        rejectedAt: artifact.rejectedAt ? new Date(artifact.rejectedAt) : null,
        rejectionReason: artifact.rejectionReason ?? null,
        exportedAt: artifact.exportedAt ? new Date(artifact.exportedAt) : null,
        exportFormat: artifact.exportFormat ?? null,
      },
      create: {
        id: artifact.id,
        sourceId: artifact.sourceId,
        contentDnaId: artifact.contentDnaId,
        dnaVersion: artifact.dnaVersion,
        type: artifact.type,
        status: artifact.status,
        title: artifact.title,
        generatedAt: new Date(artifact.generatedAt),
        updatedAt: new Date(artifact.updatedAt),
        approvedBy: artifact.approvedBy ?? null,
        approvedAt: artifact.approvedAt ? new Date(artifact.approvedAt) : null,
        rejectedBy: artifact.rejectedBy ?? null,
        rejectedAt: artifact.rejectedAt ? new Date(artifact.rejectedAt) : null,
        rejectionReason: artifact.rejectionReason ?? null,
        exportedAt: artifact.exportedAt ? new Date(artifact.exportedAt) : null,
        exportFormat: artifact.exportFormat ?? null,
      },
    });

    await prisma.artifactSection.deleteMany({
      where: { artifactId: artifact.id },
    });
    await prisma.validationIssue.deleteMany({
      where: { artifactId: artifact.id },
    });

    await prisma.artifactSection.createMany({
      data: artifact.sections.map((section) => ({
        id: section.id,
        artifactId: artifact.id,
        title: section.title,
        content: section.content,
        factIds: section.factIds,
        slideNumber: section.slideNumber ?? null,
        speakerNotes: section.speakerNotes ?? null,
      })),
    });
    await prisma.validationIssue.createMany({
      data: artifact.validationIssues.map((issue) => ({
        id: issue.id,
        artifactId: artifact.id,
        sectionId: issue.sectionId,
        type: issue.type,
        severity: issue.severity,
        status: issue.status,
        generatedText: issue.generatedText,
        sourceText: issue.sourceText,
        factId: issue.factId ?? null,
        sourcePage: issue.sourcePage ?? null,
        sourceFile: issue.sourceFile ?? null,
        description: issue.description,
      })),
    });
  }

  await prisma.auditEvent.deleteMany();
  await prisma.auditEvent.createMany({
    data: mockAuditEvents.map((event) => ({
      id: event.id,
      timestamp: new Date(event.timestamp),
      actor: event.actor,
      action: event.action,
      objectType: event.objectType,
      objectId: event.objectId,
      objectName: event.objectName,
      version: event.version ?? null,
      result: event.result,
      metadata: event.metadata,
      description: event.description,
    })),
  });

  await prisma.transformationJob.upsert({
    where: { id: mockTransformationJob.id },
    update: {
      sourceId: mockTransformationJob.sourceId,
      contentDnaId: mockTransformationJob.contentDnaId ?? null,
      selectedOutputs: mockTransformationJob.selectedOutputs,
      steps: mockTransformationJob.steps as unknown as Prisma.InputJsonValue,
      artifactIds: mockTransformationJob.artifactIds,
      startedAt: new Date(mockTransformationJob.startedAt),
      completedAt: mockTransformationJob.completedAt
        ? new Date(mockTransformationJob.completedAt)
        : null,
      status: mockTransformationJob.status,
    },
    create: {
      id: mockTransformationJob.id,
      sourceId: mockTransformationJob.sourceId,
      contentDnaId: mockTransformationJob.contentDnaId ?? null,
      selectedOutputs: mockTransformationJob.selectedOutputs,
      steps: mockTransformationJob.steps as unknown as Prisma.InputJsonValue,
      artifactIds: mockTransformationJob.artifactIds,
      startedAt: new Date(mockTransformationJob.startedAt),
      completedAt: mockTransformationJob.completedAt
        ? new Date(mockTransformationJob.completedAt)
        : null,
      status: mockTransformationJob.status,
    },
  });

  console.log(
    `Seeded ${mockSources.length} sources, ${mockArtifacts.length} artifacts, and ${mockAuditEvents.length} audit events.`,
  );
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
