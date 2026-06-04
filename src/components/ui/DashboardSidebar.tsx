import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, User, Bookmark, FileText, Bell, Settings, LogOut,
  Building2, PlusSquare, List, Users, ShieldCheck,
  Flag, Sliders, Briefcase, ChevronRight, Zap, Menu, X
} from 'lucide-react';
import { useApp } from '@/store/AppContext';

interface SidebarItem {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
  badge?: number;
}

interface SidebarProps {
  role?: 'candidate' | 'recruiter' | 'admin';
  items?: SidebarItem[];
  title?: string;
  onClose?: () => void;
}

export default function DashboardSidebar({ role, items, title, onClose }: SidebarProps) {
  const { currentUser, logout, getUnreadNotificationCount } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadCount = currentUser ? getUnreadNotificationCount(currentUser.id) : 0;

  const candidateLinks: SidebarItem[] = [
    { to: '/dashboard/candidate', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/dashboard/candidate/profile', icon: User, label: 'My Profile' },
    { to: '/dashboard/candidate/applications', icon: FileText, label: 'Applications' },
    { to: '/dashboard/candidate/proposals', icon: Briefcase, label: 'Proposals' },
    { to: '/dashboard/candidate/saved', icon: Bookmark, label: 'Saved' },
    { to: '/dashboard/candidate/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
    { to: '/dashboard/candidate/settings', icon: Settings, label: 'Settings' },
  ];

  const recruiterLinks: SidebarItem[] = [
    { to: '/dashboard/recruiter', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/dashboard/recruiter/company', icon: Building2, label: 'Company Profile' },
    { to: '/dashboard/recruiter/listings/new', icon: PlusSquare, label: 'Post Listing' },
    { to: '/dashboard/recruiter/listings', icon: List, label: 'My Listings' },
    { to: '/dashboard/recruiter/applicants', icon: Users, label: 'Applicants' },
    { to: '/dashboard/recruiter/verification', icon: ShieldCheck, label: 'Verification' },
    { to: '/dashboard/recruiter/settings', icon: Settings, label: 'Settings' },
  ];

  const adminLinks: SidebarItem[] = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/listings', icon: List, label: 'Listings' },
    { to: '/admin/recruiters', icon: Building2, label: 'Companies' },
    { to: '/admin/verifications', icon: ShieldCheck, label: 'Verifications' },
    { to: '/admin/reports', icon: Flag, label: 'Reports' },
    { to: '/admin/settings', icon: Sliders, label: 'Settings' },
  ];

  // Use items prop if passed, otherwise use role-based links
  const links = items || (role === 'candidate' ? candidateLinks : role === 'recruiter' ? recruiterLinks : adminLinks);
  const displayTitle = title || (role === 'candidate' ? 'Candidate' : role === 'recruiter' ? 'Recruiter' : 'Admin');

  const handleClose = () => {
    setMobileOpen(false);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E5E7EB]">
        <NavLink to="/" className="flex items-center gap-2" onClick={handleClose}>
          <div className="w-7 h-7 bg-[#C1121F] rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white fill-white" />
          </div>
          <span className="font-bold text-[#111111] font-[family-name:var(--font-heading)]">Upversion</span>
        </NavLink>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="px-4 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1A1A] overflow-hidden flex items-center justify-center shrink-0">
              {(currentUser.avatarFile || currentUser.avatarUrl) ? (
                <img
                  src={currentUser.avatarFile || currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-sm font-semibold">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111111] truncate">{currentUser.name}</p>
              <p className="text-xs text-[#5F6368] capitalize">{displayTitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {links.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                onClick={handleClose}
                className={({ isActive }) =>
                  'flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ' +
                  (isActive
                    ? 'bg-[#FEF2F2] text-[#C1121F]'
                    : 'text-[#5F6368] hover:bg-gray-50 hover:text-[#111111]')
                }
              >
                <span className="flex items-center gap-2.5">
                  <link.icon size={16} />
                  {link.label}
                </span>
                {link.badge && link.badge > 0 ? (
                  <span className="w-5 h-5 bg-[#C1121F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {link.badge > 9 ? '9+' : link.badge}
                  </span>
                ) : (
                  <ChevronRight size={14} className="text-gray-300" />
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#E5E7EB]">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[260px] shrink-0">
        <div
          className="sticky top-20 border border-[#E5E7EB] rounded-xl overflow-hidden bg-white"
          style={{ maxHeight: 'calc(100vh - 100px)' }}
        >
          {sidebarContent}
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#5F6368] hover:border-[#111111] hover:text-[#111111] transition-colors w-full justify-center mb-4"
        >
          <Menu size={16} /> {displayTitle} Menu
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[9998]">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl animate-fade-in">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}