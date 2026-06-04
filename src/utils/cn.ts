import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format salary/stipend/budget
export function formatSalary(
  min?: number,
  max?: number,
  type: 'salary' | 'stipend' | 'budget' = 'salary'
): string {
  if (!min && !max) return 'Not specified';

  const prefix = type === 'salary' ? '$' : type === 'stipend' ? '$' : '$';
  const suffix = type === 'salary' ? '/yr' : type === 'stipend' ? '/mo' : '';

  const fmt = (n: number) => {
    if (n >= 1000) return `${prefix}${(n / 1000).toFixed(0)}k`;
    return `${prefix}${n}`;
  };

  if (min && max) return `${fmt(min)} – ${fmt(max)}${suffix}`;
  if (min) return `From ${fmt(min)}${suffix}`;
  if (max) return `Up to ${fmt(max)}${suffix}`;
  return 'Not specified';
}

// Time ago
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

// Generate slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Format date
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

// File to blob URL
export function fileToObjectURL(file: File): string {
  return URL.createObjectURL(file);
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// Validate file
export function validateFile(
  file: File,
  allowedTypes: string[],
  maxSizeMB: number
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed. Allowed: ${allowedTypes.join(', ')}` };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File too large. Max size: ${maxSizeMB}MB` };
  }
  return { valid: true };
}