import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function formatTimestamp(iso: string, compact = false): string {
  const d = new Date(iso);
  if (compact) {
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical': return 'text-nexus-red';
    case 'high': return 'text-nexus-red';
    case 'medium': return 'text-nexus-amber';
    case 'low': return 'text-nexus-green';
    case 'informational': return 'text-nexus-text-secondary';
    default: return 'text-nexus-text-secondary';
  }
}

export function getSeverityBg(severity: string): string {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-nexus-red/10 text-nexus-red border border-nexus-red/20';
    case 'high': return 'bg-nexus-red/10 text-nexus-red border border-nexus-red/20';
    case 'medium': return 'bg-nexus-amber/10 text-nexus-amber border border-nexus-amber/20';
    case 'low': return 'bg-nexus-green/10 text-nexus-green border border-nexus-green/20';
    default: return 'bg-nexus-text-secondary/10 text-nexus-text-secondary border border-nexus-text-secondary/20';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved': case 'exported': case 'verified': return 'text-nexus-green';
    case 'validated': case 'processed': case 'generated': return 'text-nexus-cyan';
    case 'rejected': case 'conflict': case 'failed': return 'text-nexus-red';
    case 'reviewed': case 'needs_review': return 'text-nexus-amber';
    case 'pending': case 'generating': return 'text-nexus-text-secondary';
    default: return 'text-nexus-text-secondary';
  }
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'approved':
    case 'exported':
    case 'verified':
    case 'supported':
      return 'badge-verified';
    case 'rejected':
    case 'conflict':
    case 'conflicting':
    case 'failed':
      return 'badge-conflict';
    case 'needs_review':
    case 'uncertain':
    case 'requires_review':
      return 'badge-warning';
    case 'validated':
    case 'generated':
    case 'processed':
      return 'badge-info';
    default:
      return 'badge-neutral';
  }
}

export function getArtifactIcon(type: string): string {
  switch (type) {
    case 'executive_brief': return 'FileText';
    case 'advisory': return 'Shield';
    case 'presentation': return 'Presentation';
    case 'linkedin': return 'Linkedin';
    case 'twitter': return 'Twitter';
    case 'infographic': return 'Image';
    case 'video': return 'Video';
    default: return 'File';
  }
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
