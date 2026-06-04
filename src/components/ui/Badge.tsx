import { cn } from '@/utils/cn';
import { ListingType, WorkMode, ApplicationStatus, ListingStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'job' | 'internship' | 'freelance' | 'remote' | 'onsite' | 'hybrid' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

const variants = {
  default: 'bg-gray-100 text-gray-700',
  job: 'badge-job',
  internship: 'badge-internship',
  freelance: 'badge-freelance',
  remote: 'badge-remote',
  onsite: 'badge-onsite',
  hybrid: 'badge-hybrid',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  outline: 'bg-transparent border border-[#E5E7EB] text-[#5F6368]',
};

const sizes = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export default function Badge({ children, variant = 'default', size = 'md', className, dot }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap',
      variants[variant],
      sizes[size],
      className
    )}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

// Helper functions for consistent badge rendering
export function getTypeBadge(type: ListingType) {
  const map: Record<ListingType, { variant: BadgeProps['variant']; label: string }> = {
    job: { variant: 'job', label: 'Job' },
    internship: { variant: 'internship', label: 'Internship' },
    freelance: { variant: 'freelance', label: 'Freelance' },
  };
  return map[type];
}

export function getWorkModeBadge(mode: WorkMode) {
  const map: Record<WorkMode, { variant: BadgeProps['variant']; label: string }> = {
    remote: { variant: 'remote', label: 'Remote' },
    onsite: { variant: 'onsite', label: 'On-site' },
    hybrid: { variant: 'hybrid', label: 'Hybrid' },
  };
  return map[mode];
}

export function getApplicationStatusBadge(status: ApplicationStatus) {
  const map: Record<ApplicationStatus, { variant: BadgeProps['variant']; label: string }> = {
    new: { variant: 'info', label: 'New' },
    reviewed: { variant: 'warning', label: 'Reviewed' },
    shortlisted: { variant: 'success', label: 'Shortlisted' },
    rejected: { variant: 'danger', label: 'Not Selected' },
    hired: { variant: 'success', label: 'Hired 🎉' },
  };
  return map[status];
}

export function getListingStatusBadge(status: ListingStatus) {
  const map: Record<ListingStatus, { variant: BadgeProps['variant']; label: string }> = {
    active: { variant: 'success', label: 'Active' },
    draft: { variant: 'outline', label: 'Draft' },
    paused: { variant: 'warning', label: 'Paused' },
    closed: { variant: 'danger', label: 'Closed' },
    pending: { variant: 'info', label: 'Pending' },
  };
  return map[status];
}