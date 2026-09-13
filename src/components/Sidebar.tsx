"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Dna,
  Zap,
  ShieldCheck,
  UserCheck,
  Download,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  Bell,
} from "lucide-react";
import { useNexusStore } from "@/store/nexusStore";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "WORKSPACE",
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/" },
      { icon: FolderOpen, label: "Sources", href: "/sources" },
      { icon: Dna, label: "Content DNA", href: "/content-dna/dna-001" },
      { icon: Zap, label: "Transform", href: "/transform/src-001" },
      { icon: ShieldCheck, label: "Validation", href: "/validation/src-001" },
      { icon: UserCheck, label: "Review", href: "/review/art-001" },
      { icon: Download, label: "Exports", href: "/exports" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { icon: ClipboardList, label: "Audit", href: "/audit" },
      { icon: Settings, label: "Settings", href: "/settings" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useNexusStore();

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      sidebarCollapsed ? "60px" : "240px",
    );
  }, [sidebarCollapsed]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 60 : 240 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col overflow-hidden"
      style={{
        background: "#0b0f19",
        borderRight: "1px solid rgba(169,190,215,0.12)",
      }}
    >
      {/* ── Logo ───────────────────────────────────────── */}
      <div
        className="flex items-center px-4 shrink-0 overflow-hidden"
        style={{ height: 56, borderBottom: "1px solid rgba(169,190,215,0.12)" }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Icon mark */}
          <div
            className="shrink-0 w-7 h-7 rounded flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #5ee7d1 0%, #7aa7ff 100%)",
              boxShadow: "0 0 18px rgba(94,231,209,0.22)",
            }}
          >
            <Activity size={14} color="#fff" strokeWidth={2.5} />
          </div>

          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="min-w-0"
              >
                <p className="text-sm font-bold tracking-[0.22em] text-white leading-none">
                  NEXUS
                </p>
                <p
                  className="text-2xs tracking-wide leading-none mt-0.5"
                  style={{ color: "#4a6080", fontSize: "0.55rem" }}
                >
                  AI CONTENT PLATFORM
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-2 mb-1 text-2xs font-semibold tracking-[0.18em]"
                  style={{ color: "#3a4a60", fontSize: "0.6rem" }}
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm transition-all duration-150 relative group",
                      active
                        ? "text-nexus-cyan"
                        : "text-nexus-text-secondary hover:text-white hover:bg-white/5",
                    )}
                    style={
                      active
                        ? {
                            background: "rgba(0,212,255,0.08)",
                            borderRight: "2px solid #00d4ff",
                          }
                        : {}
                    }
                  >
                    <item.icon
                      size={16}
                      strokeWidth={active ? 2 : 1.5}
                      className="shrink-0"
                    />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.15 }}
                          className="font-medium truncate"
                          style={{ fontSize: "0.8125rem" }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Tooltip for collapsed */}
                    {sidebarCollapsed && (
                      <div
                        className="absolute left-full ml-2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                        style={{
                          background: "#1a2540",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#e8edf5",
                        }}
                      >
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Collapse Toggle ─────────────────────────────── */}
      <div
        className="p-2 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded text-nexus-text-secondary hover:text-white hover:bg-white/5 transition-colors"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-2 text-xs"
              >
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
