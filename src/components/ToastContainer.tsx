'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useNexusStore } from '@/store/nexusStore';
import { cn } from '@/lib/utils';

const ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const COLORS = {
  success: { bg: 'rgba(0,230,118,0.08)', border: 'rgba(0,230,118,0.2)', icon: '#00e676' },
  warning: { bg: 'rgba(255,179,0,0.08)', border: 'rgba(255,179,0,0.2)', icon: '#ffb300' },
  error: { bg: 'rgba(255,61,90,0.08)', border: 'rgba(255,61,90,0.2)', icon: '#ff3d5a' },
  info: { bg: 'rgba(0,212,255,0.08)', border: 'rgba(0,212,255,0.2)', icon: '#00d4ff' },
};

function ToastItem({
  id, type, title, description,
}: { id: string; type: 'success' | 'warning' | 'error' | 'info'; title: string; description?: string }) {
  const { removeToast } = useNexusStore();
  const Icon = ICONS[type];
  const colors = COLORS[type];

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 4000);
    return () => clearTimeout(timer);
  }, [id, removeToast]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex items-start gap-3 px-4 py-3 rounded-lg shadow-nexus-lg"
      style={{
        background: '#141c35',
        border: `1px solid ${colors.border}`,
        minWidth: 280,
        maxWidth: 360,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <Icon size={16} style={{ color: colors.icon }} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight">{title}</p>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: '#8492a8' }}>{description}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(id)}
        className="shrink-0 text-nexus-text-secondary hover:text-white transition-colors ml-1"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export default function ToastContainer() {
  const { toastMessages } = useNexusStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toastMessages.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
