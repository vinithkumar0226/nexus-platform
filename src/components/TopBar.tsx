"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNexusStore } from "@/store/nexusStore";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const { artifacts } = useNexusStore();

  const pendingCount = artifacts.filter(
    (a) => a.status === "validated" || a.status === "generated",
  ).length;
  const conflictCount = artifacts.reduce(
    (acc, a) =>
      acc + a.validationIssues.filter((vi) => vi.status === "open").length,
    0,
  );

  const alerts: Array<{
    id: number;
    type: "conflict" | "info" | "warning";
    message: string;
    time: string;
  }> = [
    ...(conflictCount > 0
      ? [
          {
            id: 1,
            type: "conflict" as const,
            message: `${conflictCount} validation conflict${conflictCount > 1 ? "s" : ""} require review`,
            time: "2m ago",
          },
        ]
      : []),
    {
      id: 2,
      type: "info",
      message: "3 artefacts generated from Content DNA v1.0",
      time: "8m ago",
    },
    {
      id: 3,
      type: "warning",
      message: "2 sensitive items detected in source document",
      time: "10m ago",
    },
  ];

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center px-4 gap-3"
      style={{
        left: "var(--sidebar-width, 240px)",
        height: 56,
        background: "rgba(8,11,20,0.88)",
        borderBottom: "1px solid rgba(169,190,215,0.12)",
        backdropFilter: "blur(8px)",
        transition: "left 0.25s ease",
      }}
    >
      {/* ── Search ───────────────────────────────────────── */}
      <div className="flex-1 max-w-sm relative">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-nexus-text-muted"
          style={{ color: "#556070" }}
        />
        <input
          type="text"
          placeholder="Search sources, artefacts, facts..."
          className="w-full pl-8 pr-3 py-1.5 text-sm rounded"
          style={{
            background: "rgba(255,255,255,0.045)",
            border: "1px solid rgba(169,190,215,0.14)",
            color: "#95a3b8",
            fontSize: "0.8rem",
          }}
          readOnly
          onClick={() => {}}
        />
      </div>

      <div className="flex-1" />

      {/* ── System Status ────────────────────────────────── */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded"
        style={{
          background: "rgba(139,226,139,0.08)",
          border: "1px solid rgba(139,226,139,0.18)",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-nexus-green animate-pulse" />
        <span className="text-xs text-nexus-green font-medium">
          System Operational
        </span>
      </div>

      {/* ── Alerts ───────────────────────────────────────── */}
      <div className="relative">
        <button
          onClick={() => {
            setAlertsOpen(!alertsOpen);
            setUserMenuOpen(false);
          }}
          className="relative p-2 rounded hover:bg-white/5 transition-colors text-nexus-text-secondary hover:text-white"
          aria-label="Alerts"
        >
          <Bell size={16} />
          {alerts.length > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
              style={{
                background: "#ff3d5a",
                color: "#fff",
                fontSize: "0.55rem",
              }}
            >
              {alerts.length}
            </span>
          )}
        </button>

        <AnimatePresence>
          {alertsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-72 rounded-lg overflow-hidden z-50"
              style={{
                background: "#141c35",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="px-3 py-2 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="text-xs font-semibold text-white">
                  Notifications
                </span>
                <span className="text-2xs text-nexus-text-secondary">
                  {alerts.length} new
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="px-3 py-2.5 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                          alert.type === "conflict"
                            ? "bg-nexus-red"
                            : alert.type === "warning"
                              ? "bg-nexus-amber"
                              : "bg-nexus-cyan",
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white leading-snug">
                          {alert.message}
                        </p>
                        <p
                          className="text-2xs mt-0.5"
                          style={{ color: "#556070" }}
                        >
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── User Menu ─────────────────────────────────────── */}
      <div className="relative">
        <button
          onClick={() => {
            setUserMenuOpen(!userMenuOpen);
            setAlertsOpen(false);
          }}
          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-white/5 transition-colors"
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: "linear-gradient(135deg, #5ee7d1, #7aa7ff)",
              color: "#08101a",
            }}
          >
            O
          </div>
          <span className="text-sm font-medium text-white">Operator</span>
          <ChevronDown size={12} className="text-nexus-text-secondary" />
        </button>

        <AnimatePresence>
          {userMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-1 w-48 rounded-lg overflow-hidden z-50"
              style={{
                background: "#151c2d",
                border: "1px solid rgba(169,190,215,0.16)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="px-3 py-2.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-xs font-semibold text-white">Operator</p>
                <p className="text-xs" style={{ color: "#556070" }}>
                  NTRO System Access
                </p>
              </div>
              {[
                { icon: User, label: "Profile", href: "/settings" },
                { icon: Shield, label: "Security", href: "/settings" },
                { icon: HelpCircle, label: "Help", href: "/settings" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-nexus-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              ))}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-nexus-red hover:bg-nexus-red/10 transition-colors">
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
