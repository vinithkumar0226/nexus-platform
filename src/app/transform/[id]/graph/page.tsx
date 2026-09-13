"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Network,
  CheckCircle2,
  AlertTriangle,
  FileUp,
  Shield,
  Presentation,
  ArrowLeft,
  BrainCircuit,
  type LucideIcon,
} from "lucide-react";

type NodeCardProps = {
  icon: LucideIcon;
  title: string;
  status: "completed" | "validated" | "needs_review" | "active";
  version?: string;
  onClick?: () => void;
  className: string;
};

function NodeCard({
  icon: Icon,
  title,
  status,
  version,
  onClick,
  className,
}: NodeCardProps) {
  return (
    <div
      onClick={onClick}
      className={`absolute w-56 bg-gradient-to-b from-[#121d32] to-[#0d1424] border border-nexus-border/80 rounded-2xl p-4 shadow-[0_18px_36px_rgba(0,0,0,0.35)] z-10 cursor-pointer hover:border-nexus-cyan/50 transition-all duration-200 ${className}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-nexus-cyan/10 border border-nexus-cyan/30">
          <Icon className="w-5 h-5 text-nexus-cyan" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white leading-tight truncate">
            {title}
          </h3>
          {version && (
            <span className="text-[10px] uppercase tracking-[0.18em] text-nexus-text-secondary">
              v{version}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3">
        {status === "completed" || status === "validated" ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-nexus-green" />
            <span className="text-xs text-nexus-green font-medium">
              Verified
            </span>
          </>
        ) : status === "needs_review" ? (
          <>
            <AlertTriangle className="w-4 h-4 text-nexus-amber" />
            <span className="text-xs text-nexus-amber font-medium">
              Needs Review
            </span>
          </>
        ) : (
          <>
            <Network className="w-4 h-4 text-nexus-cyan" />
            <span className="text-xs text-nexus-cyan font-medium">Active</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function TransformationGraphPage({
  params,
}: {
  params: { id: string };
}) {
  const demoSteps = [
    "Upload source report",
    "Extract facts and entities",
    "Create Content DNA v1.0",
    "Generate 3 artefacts",
    "Detect conflict and validate",
    "Update once and re-propagate",
    "Approve and export",
  ];

  return (
    <div className="min-h-screen bg-nexus-bg relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-nexus-panel/50 via-nexus-bg to-nexus-bg pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative z-20 p-6 border-b border-nexus-border bg-nexus-panel/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/transform/${params.id}/progress`}
            className="p-2 hover:bg-nexus-card rounded-md text-nexus-text-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Data Flow & Lineage
            </h1>
            <p className="text-sm text-nexus-text-secondary">
              One source. Three coordinated outputs. One verified source of
              truth.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1.5 bg-nexus-card border border-nexus-border rounded-md text-xs font-medium text-white">
            3 Artefacts
          </div>
          <div className="px-3 py-1.5 bg-nexus-amber/10 border border-nexus-amber/20 rounded-md text-xs font-medium text-nexus-amber">
            1 Conflict
          </div>
          <div className="px-3 py-1.5 bg-nexus-card border border-nexus-border rounded-md text-xs font-medium text-nexus-text-secondary">
            Awaiting Review
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto mt-6 w-full max-w-6xl px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          {demoSteps.map((item, index) => (
            <div
              key={item}
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${index === 4 ? "border-nexus-amber/30 bg-nexus-amber/10 text-nexus-amber" : "border-nexus-border bg-nexus-panel text-nexus-text-secondary"}`}
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-nexus-cyan text-[9px] font-bold text-[#08111f]">
                {index + 1}
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative w-full max-w-5xl mx-auto mt-6 h-[760px]">
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <motion.path
            d="M 512 100 L 512 250"
            stroke="#00d4ff"
            strokeWidth="2.5"
            strokeDasharray="6,6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          <motion.path
            d="M 512 330 C 512 400, 250 400, 250 450"
            stroke="#00d4ff"
            strokeWidth="2.5"
            strokeDasharray="6,6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M 512 330 L 512 450"
            stroke="#00d4ff"
            strokeWidth="2.5"
            strokeDasharray="6,6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M 512 330 C 512 400, 774 400, 774 450"
            stroke="#00d4ff"
            strokeWidth="2.5"
            strokeDasharray="6,6"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          />
          <motion.path
            d="M 250 530 C 250 580, 512 580, 512 620"
            stroke="#ffb300"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
          />
          <motion.path
            d="M 512 530 L 512 620"
            stroke="#00e676"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
          />
          <motion.path
            d="M 774 530 C 774 580, 512 580, 512 620"
            stroke="#00e676"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1, ease: "easeInOut" }}
          />
        </svg>

        <NodeCard
          icon={FileUp}
          title="Source Document"
          status="completed"
          className="left-1/2 -translate-x-1/2 top-[20px]"
        />
        <NodeCard
          icon={BrainCircuit}
          title="Content DNA"
          version="1.0"
          status="completed"
          className="left-1/2 -translate-x-1/2 top-[250px]"
        />
        <NodeCard
          icon={FileText}
          title="Executive Brief"
          status="needs_review"
          className="left-[138px] top-[450px]"
        />
        <NodeCard
          icon={Shield}
          title="Advisory"
          status="validated"
          className="left-1/2 -translate-x-1/2 top-[450px]"
        />
        <NodeCard
          icon={Presentation}
          title="Presentation"
          status="validated"
          className="left-[662px] top-[450px]"
        />
        <NodeCard
          icon={AlertTriangle}
          title="Validation Center"
          status="needs_review"
          className="left-1/2 -translate-x-1/2 top-[620px] !border-nexus-amber/50"
        />
      </div>
    </div>
  );
}
