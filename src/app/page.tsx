"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  File,
  ArrowRight,
  Activity,
  Plus,
  Upload,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useNexusStore } from "@/store/nexusStore";
import { formatRelativeTime, getStatusBadgeClass } from "@/lib/utils";

export default function Dashboard() {
  const sources = useNexusStore((state) => state.sources);
  const artifacts = useNexusStore((state) => state.artifacts);

  // Stats
  const stats = {
    sources: sources.length + 9, // Adding mock base
    artifacts: artifacts.length + 79,
    validated: 31,
    pendingReview: 3,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="dashboard-shell flex flex-col gap-8">
      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="eyebrow mb-3">NEXUS intelligence workspace</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">
            Turn one source into trusted action.
          </h1>
          <p className="text-nexus-text-secondary">
            A source-grounded workspace for transforming intelligence into
            verified communication.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/sources/new"
            className="btn-secondary flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Source
          </Link>
          <Link
            href="/sources/new"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Start transformation
          </Link>
        </div>
      </motion.div>

      <motion.div
        className="nexus-panel relative overflow-hidden rounded-2xl border border-nexus-cyan/25 p-6 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="relative z-10 max-w-2xl">
            <p className="eyebrow">The operating model</p>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight text-white">
              One Source → Many Verified Deliverables
            </h2>
            <p className="mt-2 text-sm text-nexus-text-secondary max-w-2xl">
              Upload a report, generate structured Content DNA, validate
              important facts, update once, and propagate the correction across
              every artefact before export.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-2 xl:max-w-[31rem] xl:justify-end">
            {["Upload", "DNA", "Validate", "Update", "Approve"].map(
              (step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-nexus-text-secondary"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-nexus-cyan text-[10px] font-bold text-[#08111f]">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ),
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="nexus-card p-5 rounded-xl border border-nexus-border"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-nexus-text-secondary text-xs font-medium uppercase tracking-wide">
              Sources Processed
            </div>
            <div className="p-2 bg-nexus-blue/10 rounded-lg">
              <FileText className="w-4 h-4 text-nexus-blue" />
            </div>
          </div>
          <div className="text-4xl font-bold tracking-tight text-white">
            {stats.sources}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="nexus-card p-5 rounded-xl border border-nexus-border"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-nexus-text-secondary text-xs font-medium uppercase tracking-wide">
              Output Artefacts
            </div>
            <div className="p-2 bg-nexus-cyan/10 rounded-lg">
              <Shield className="w-4 h-4 text-nexus-cyan" />
            </div>
          </div>
          <div className="text-4xl font-bold tracking-tight text-white">
            {stats.artifacts}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="nexus-card p-5 rounded-xl border border-nexus-border"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-nexus-text-secondary text-xs font-medium uppercase tracking-wide">
              Validated Items
            </div>
            <div className="p-2 bg-nexus-green/10 rounded-lg">
              <CheckCircle className="w-4 h-4 text-nexus-green" />
            </div>
          </div>
          <div className="text-4xl font-bold tracking-tight text-white">
            {stats.validated}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="nexus-card p-5 rounded-xl border border-nexus-border"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-nexus-text-secondary text-xs font-medium uppercase tracking-wide">
              Pending Review
            </div>
            <div className="p-2 bg-nexus-amber/10 rounded-lg">
              <Clock className="w-4 h-4 text-nexus-amber" />
            </div>
          </div>
          <div className="text-4xl font-bold tracking-tight text-nexus-amber flex items-center gap-2">
            {stats.pendingReview} <Activity className="w-4 h-4 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Transformations */}
        <motion.div
          className="xl:col-span-2 flex flex-col gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-white">
              Recent Transformations
            </h2>
            <Link
              href="/sources"
              className="text-sm text-nexus-cyan hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {sources.map((source) => {
              const sourceArtifacts = artifacts.filter(
                (a) => a.sourceId === source.id,
              );
              return (
                <Link
                  key={source.id}
                  href={`/sources/${source.id}`}
                  className="block"
                >
                  <div className="nexus-card p-4 rounded-xl border border-nexus-border hover:border-nexus-cyan/50 transition-colors flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="p-3 bg-nexus-panel rounded-lg shrink-0">
                      <File className="w-6 h-6 text-nexus-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-white font-medium truncate"
                        title={source.filename}
                      >
                        {source.filename}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-nexus-text-secondary mt-1">
                        <span>{formatRelativeTime(source.uploadedAt)}</span>
                        <span>•</span>
                        <span>
                          {sourceArtifacts.length} Artefact
                          {sourceArtifacts.length !== 1 ? "s" : ""}
                        </span>
                        {source.securityFlags.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-nexus-amber flex items-center gap-1">
                              <Shield className="w-3 h-3" />{" "}
                              {source.securityFlags.length} Flags
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Mini flow visualization */}
                    <div className="hidden md:flex items-center gap-2 text-xs text-nexus-text-secondary opacity-60">
                      <span className="px-2 py-1 bg-nexus-panel rounded">
                        Source
                      </span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="px-2 py-1 bg-nexus-cyan/10 text-nexus-cyan rounded">
                        DNA
                      </span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="px-2 py-1 bg-nexus-panel rounded">
                        Outputs
                      </span>
                    </div>

                    <div className="shrink-0 mt-2 sm:mt-0">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(source.status)}`}
                      >
                        {source.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* System Overview */}
        <motion.div
          className="nexus-panel rounded-xl border border-nexus-border p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-white mb-6">
            System Pipeline
          </h2>
          <div className="flex flex-col gap-6">
            <div className="relative pl-6 border-l border-nexus-cyan/30 pb-6">
              <div className="absolute w-3 h-3 bg-nexus-cyan rounded-full -left-[6.5px] top-1 shadow-[0_0_8px_rgba(0,212,255,0.8)]"></div>
              <h3 className="text-white font-medium leading-none mb-2">
                1. Secure Ingestion
              </h3>
              <p className="text-sm text-nexus-text-secondary">
                SHA-256 fingerprinting, format validation, and PII/credential
                masking.
              </p>
            </div>

            <div className="relative pl-6 border-l border-nexus-blue/30 pb-6">
              <div className="absolute w-3 h-3 bg-nexus-blue rounded-full -left-[6.5px] top-1 shadow-[0_0_8px_rgba(79,142,247,0.8)]"></div>
              <h3 className="text-white font-medium leading-none mb-2">
                2. Intelligence Extraction
              </h3>
              <p className="text-sm text-nexus-text-secondary">
                Fact extraction with source traceability, confidence scoring,
                and entity resolution.
              </p>
            </div>

            <div className="relative pl-6 border-l border-nexus-border pb-6">
              <div className="absolute w-3 h-3 bg-nexus-text-secondary rounded-full -left-[6.5px] top-1"></div>
              <h3 className="text-white font-medium leading-none mb-2">
                3. Content DNA Modeling
              </h3>
              <p className="text-sm text-nexus-text-secondary">
                Structured graph representation serving as the singular source
                of truth.
              </p>
            </div>

            <div className="relative pl-6 border-l border-transparent">
              <div className="absolute w-3 h-3 border-2 border-nexus-text-secondary rounded-full -left-[6.5px] top-1 bg-nexus-bg"></div>
              <h3 className="text-nexus-text-secondary font-medium leading-none mb-2">
                4. Artefact Generation
              </h3>
              <p className="text-sm text-nexus-text-secondary opacity-70">
                Audience-specific transformation with factual verification
                against DNA.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
