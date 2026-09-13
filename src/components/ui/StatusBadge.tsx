'use client';

import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; dot?: string }> = {
  // Artifact statuses
  approved: { bg: 'rgba(0,230,118,0.1)', text: '#00e676', border: 'rgba(0,230,118,0.2)', dot: '#00e676' },
  exported: { bg: 'rgba(0,230,118,0.1)', text: '#00e676', border: 'rgba(0,230,118,0.2)', dot: '#00e676' },
  validated: { bg: 'rgba(0,212,255,0.1)', text: '#00d4ff', border: 'rgba(0,212,255,0.2)', dot: '#00d4ff' },
  generated: { bg: 'rgba(79,142,247,0.1)', text: '#4f8ef7', border: 'rgba(79,142,247,0.2)', dot: '#4f8ef7' },
  reviewed: { bg: 'rgba(255,179,0,0.1)', text: '#ffb300', border: 'rgba(255,179,0,0.2)', dot: '#ffb300' },
  rejected: { bg: 'rgba(255,61,90,0.1)', text: '#ff3d5a', border: 'rgba(255,61,90,0.2)', dot: '#ff3d5a' },
  pending: { bg: 'rgba(132,146,168,0.1)', text: '#8492a8', border: 'rgba(132,146,168,0.2)', dot: '#8492a8' },
  generating: { bg: 'rgba(0,212,255,0.1)', text: '#00d4ff', border: 'rgba(0,212,255,0.2)', dot: '#00d4ff' },
  // Source statuses
  processed: { bg: 'rgba(0,230,118,0.1)', text: '#00e676', border: 'rgba(0,230,118,0.2)', dot: '#00e676' },
  analyzed: { bg: 'rgba(0,212,255,0.1)', text: '#00d4ff', border: 'rgba(0,212,255,0.2)', dot: '#00d4ff' },
  failed: { bg: 'rgba(255,61,90,0.1)', text: '#ff3d5a', border: 'rgba(255,61,90,0.2)', dot: '#ff3d5a' },
  // Validation
  verified: { bg: 'rgba(0,230,118,0.1)', text: '#00e676', border: 'rgba(0,230,118,0.2)', dot: '#00e676' },
  conflict: { bg: 'rgba(255,61,90,0.1)', text: '#ff3d5a', border: 'rgba(255,61,90,0.2)', dot: '#ff3d5a' },
  conflicting: { bg: 'rgba(255,61,90,0.1)', text: '#ff3d5a', border: 'rgba(255,61,90,0.2)', dot: '#ff3d5a' },
  uncertain: { bg: 'rgba(255,179,0,0.1)', text: '#ffb300', border: 'rgba(255,179,0,0.2)', dot: '#ffb300' },
  supported: { bg: 'rgba(0,230,118,0.1)', text: '#00e676', border: 'rgba(0,230,118,0.2)', dot: '#00e676' },
  requires_review: { bg: 'rgba(255,179,0,0.1)', text: '#ffb300', border: 'rgba(255,179,0,0.2)', dot: '#ffb300' },
  // Severity
  high: { bg: 'rgba(255,61,90,0.1)', text: '#ff3d5a', border: 'rgba(255,61,90,0.2)' },
  critical: { bg: 'rgba(255,61,90,0.15)', text: '#ff3d5a', border: 'rgba(255,61,90,0.3)' },
  medium: { bg: 'rgba(255,179,0,0.1)', text: '#ffb300', border: 'rgba(255,179,0,0.2)' },
  low: { bg: 'rgba(0,230,118,0.1)', text: '#00e676', border: 'rgba(0,230,118,0.2)' },
  informational: { bg: 'rgba(132,146,168,0.1)', text: '#8492a8', border: 'rgba(132,146,168,0.2)' },
  // Steps
  completed: { bg: 'rgba(0,230,118,0.1)', text: '#00e676', border: 'rgba(0,230,118,0.2)', dot: '#00e676' },
  processing: { bg: 'rgba(0,212,255,0.1)', text: '#00d4ff', border: 'rgba(0,212,255,0.2)', dot: '#00d4ff' },
  needs_review: { bg: 'rgba(255,179,0,0.1)', text: '#ffb300', border: 'rgba(255,179,0,0.2)', dot: '#ffb300' },
  error: { bg: 'rgba(255,61,90,0.1)', text: '#ff3d5a', border: 'rgba(255,61,90,0.2)', dot: '#ff3d5a' },
};

const STATUS_LABELS: Record<string, string> = {
  executive_brief: 'Executive Brief',
  advisory: 'Advisory',
  presentation: 'Presentation',
  approved: 'Approved',
  exported: 'Exported',
  validated: 'AI Validated',
  generated: 'Generated',
  reviewed: 'Reviewed',
  rejected: 'Rejected',
  pending: 'Pending',
  generating: 'Generating',
  processed: 'Processed',
  analyzed: 'Analyzed',
  failed: 'Failed',
  verified: 'Verified',
  conflict: 'Conflict',
  conflicting: 'Conflict',
  uncertain: 'Uncertain',
  supported: 'Supported',
  requires_review: 'Requires Review',
  high: 'HIGH',
  critical: 'CRITICAL',
  medium: 'MEDIUM',
  low: 'LOW',
  informational: 'INFO',
  completed: 'Completed',
  processing: 'Processing',
  needs_review: 'Needs Review',
  error: 'Error',
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s+/g, '_');
  const config = STATUS_CONFIG[key] || {
    bg: 'rgba(132,146,168,0.1)',
    text: '#8492a8',
    border: 'rgba(132,146,168,0.2)',
  };
  const displayLabel = label || STATUS_LABELS[key] || status;

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium', className)}
      style={{
        background: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
      }}
    >
      {config.dot && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: config.dot }}
        />
      )}
      {displayLabel}
    </span>
  );
}

// Confidence bar
export function ConfidenceBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.round(value * 100);
  const color = pct >= 90 ? '#00e676' : pct >= 75 ? '#00d4ff' : pct >= 60 ? '#ffb300' : '#ff3d5a';

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono shrink-0" style={{ color, minWidth: 32 }}>
        {pct}%
      </span>
    </div>
  );
}

// Fact ID badge
export function FactIdBadge({ id, className }: { id: string; className?: string }) {
  return (
    <span
      className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono font-bold', className)}
      style={{
        background: 'rgba(0,212,255,0.1)',
        color: '#00d4ff',
        border: '1px solid rgba(0,212,255,0.2)',
        letterSpacing: '0.05em',
      }}
    >
      {id}
    </span>
  );
}

// Section header
export function SectionHeader({ title, count, action, className }: {
  title: string;
  count?: number;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
        {count !== undefined && (
          <span
            className="px-1.5 py-0.5 rounded text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.08)', color: '#8492a8' }}
          >
            {count}
          </span>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Empty state
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 opacity-30" style={{ color: '#4f8ef7' }}>
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm max-w-sm" style={{ color: '#8492a8' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// Stat card
export function StatCard({ label, value, trend, color, icon }: {
  label: string;
  value: number | string;
  trend?: string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col p-4 rounded-lg"
      style={{
        background: '#0f1629',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#556070' }}>
          {label}
        </span>
        {icon && (
          <span style={{ color: color || '#4f8ef7' }}>{icon}</span>
        )}
      </div>
      <p
        className="text-3xl font-bold tracking-tight font-mono"
        style={{ color: color || '#e8edf5' }}
      >
        {value}
      </p>
      {trend && (
        <p className="text-xs mt-1.5" style={{ color: '#8492a8' }}>{trend}</p>
      )}
    </div>
  );
}
