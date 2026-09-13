-- CreateEnum
CREATE TYPE "SourceStatus" AS ENUM ('uploading', 'validating', 'extracting', 'analyzing', 'processed', 'analyzed', 'failed');

-- CreateEnum
CREATE TYPE "ArtifactStatus" AS ENUM ('pending', 'generating', 'generated', 'validated', 'reviewed', 'approved', 'exported', 'rejected');

-- CreateEnum
CREATE TYPE "ValidationIssueStatus" AS ENUM ('open', 'fixed', 'ignored');

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "sha256" TEXT NOT NULL,
    "pageCount" INTEGER NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "status" "SourceStatus" NOT NULL,
    "securityFlags" JSONB NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "contentDnaId" TEXT,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentDNA" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "communicationObjective" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "previousVersionId" TEXT,

    CONSTRAINT "ContentDNA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fact" (
    "id" TEXT NOT NULL,
    "contentDnaId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "sourcePage" INTEGER NOT NULL,
    "sourceSection" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentValue" TEXT,

    CONSTRAINT "Fact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "contentDnaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "mentions" INTEGER NOT NULL,
    "sourcePage" INTEGER NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DnaEvent" (
    "id" TEXT NOT NULL,
    "contentDnaId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "significance" TEXT NOT NULL,
    "sourcePage" INTEGER NOT NULL,

    CONSTRAINT "DnaEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "contentDnaId" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "sourcePage" INTEGER NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" TEXT NOT NULL,
    "contentDnaId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "sourcePage" INTEGER NOT NULL,

    CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Uncertainty" (
    "id" TEXT NOT NULL,
    "contentDnaId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "impact" TEXT NOT NULL,

    CONSTRAINT "Uncertainty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artifact" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "contentDnaId" TEXT NOT NULL,
    "dnaVersion" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "ArtifactStatus" NOT NULL,
    "title" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "exportedAt" TIMESTAMP(3),
    "exportFormat" TEXT,

    CONSTRAINT "Artifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtifactSection" (
    "id" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "factIds" JSONB NOT NULL,
    "slideNumber" INTEGER,
    "speakerNotes" TEXT,

    CONSTRAINT "ArtifactSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValidationIssue" (
    "id" TEXT NOT NULL,
    "artifactId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" "ValidationIssueStatus" NOT NULL,
    "generatedText" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "factId" TEXT,
    "sourcePage" INTEGER,
    "sourceFile" TEXT,
    "description" TEXT NOT NULL,

    CONSTRAINT "ValidationIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "objectType" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "objectName" TEXT NOT NULL,
    "version" TEXT,
    "result" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransformationJob" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "contentDnaId" TEXT,
    "selectedOutputs" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "artifactIds" JSONB NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL,

    CONSTRAINT "TransformationJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Source_sha256_key" ON "Source"("sha256");

-- CreateIndex
CREATE INDEX "Source_status_idx" ON "Source"("status");

-- CreateIndex
CREATE INDEX "Source_uploadedAt_idx" ON "Source"("uploadedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentDNA_sourceId_key" ON "ContentDNA"("sourceId");

-- CreateIndex
CREATE INDEX "ContentDNA_updatedAt_idx" ON "ContentDNA"("updatedAt");

-- CreateIndex
CREATE INDEX "Fact_contentDnaId_idx" ON "Fact"("contentDnaId");

-- CreateIndex
CREATE INDEX "Entity_contentDnaId_idx" ON "Entity"("contentDnaId");

-- CreateIndex
CREATE INDEX "DnaEvent_contentDnaId_idx" ON "DnaEvent"("contentDnaId");

-- CreateIndex
CREATE INDEX "Artifact_sourceId_idx" ON "Artifact"("sourceId");

-- CreateIndex
CREATE INDEX "Artifact_status_idx" ON "Artifact"("status");

-- CreateIndex
CREATE INDEX "ArtifactSection_artifactId_idx" ON "ArtifactSection"("artifactId");

-- CreateIndex
CREATE INDEX "ValidationIssue_artifactId_status_idx" ON "ValidationIssue"("artifactId", "status");

-- CreateIndex
CREATE INDEX "AuditEvent_timestamp_idx" ON "AuditEvent"("timestamp");

-- CreateIndex
CREATE INDEX "AuditEvent_objectType_objectId_idx" ON "AuditEvent"("objectType", "objectId");

-- CreateIndex
CREATE INDEX "TransformationJob_sourceId_idx" ON "TransformationJob"("sourceId");

-- CreateIndex
CREATE INDEX "TransformationJob_status_idx" ON "TransformationJob"("status");

-- AddForeignKey
ALTER TABLE "ContentDNA" ADD CONSTRAINT "ContentDNA_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_contentDnaId_fkey" FOREIGN KEY ("contentDnaId") REFERENCES "ContentDNA"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_contentDnaId_fkey" FOREIGN KEY ("contentDnaId") REFERENCES "ContentDNA"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DnaEvent" ADD CONSTRAINT "DnaEvent_contentDnaId_fkey" FOREIGN KEY ("contentDnaId") REFERENCES "ContentDNA"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_contentDnaId_fkey" FOREIGN KEY ("contentDnaId") REFERENCES "ContentDNA"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_contentDnaId_fkey" FOREIGN KEY ("contentDnaId") REFERENCES "ContentDNA"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Uncertainty" ADD CONSTRAINT "Uncertainty_contentDnaId_fkey" FOREIGN KEY ("contentDnaId") REFERENCES "ContentDNA"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artifact" ADD CONSTRAINT "Artifact_contentDnaId_fkey" FOREIGN KEY ("contentDnaId") REFERENCES "ContentDNA"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtifactSection" ADD CONSTRAINT "ArtifactSection_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValidationIssue" ADD CONSTRAINT "ValidationIssue_artifactId_fkey" FOREIGN KEY ("artifactId") REFERENCES "Artifact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransformationJob" ADD CONSTRAINT "TransformationJob_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;
