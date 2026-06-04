import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Search, Bell, ChevronDown, User, LogOut, Settings,
  LayoutDashboard, Briefcase, Building2, BookOpen, Zap, MessageSquare
} from 'lucide-react';
import { useApp } from '@/store/AppContext';

export default function Navbar() {
  const { currentUser, logout, getUnreadNotificationCount, getUnreadMessageCount, notifications, markNotificationRead } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = currentUser ? getUnreadNotificationCount(currentUser.id) : 0;
  const userNotifs = currentUser
    ? notifications.filter(n => n.userId === currentUser.id).slice(0, 5)
    : [];

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const dashboardPath = currentUser?.role === 'admin'
    ? '/admin'
    : currentUser?.role === 'recruiter'
    ? '/dashboard/recruiter'
    : '/dashboard/candidate';

  const navLinks = [
    { label: 'Jobs', to: '/jobs' },
    { label: 'Internships', to: '/internships' },
    { label: 'Freelance', to: '/freelance' },
    { label: 'Companies', to: '/companies' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-[#C1121F] rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="text-lg font-bold text-[#111111] font-[family-name:var(--font-heading)] hidden sm:block">
                Upversion
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-[#C1121F] bg-red-50'
                      : 'text-text-secondary hover:text-[#111111] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[#5F6368] hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors"
                title="Search"
              >
                <Search size={18} />
              </button>

              {currentUser ? (
                <>
                  {/* Notifications */}
                  <div ref={notifRef} className="relative">
                    <button
                      onClick={() => setNotifOpen(!notifOpen)}
                      className="relative p-2 text-[#5F6368] hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Bell size={18} />
                      {unreadNotifs > 0 && (
                        <span className="absolute top-1 right-1 w-4 h-4 bg-[#C1121F] text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                          {unreadNotifs > 9 ? '9+' : unreadNotifs}
                        </span>
                      )}
                    </button>

                    {notifOpen && (
                      <div className="absolute right-0 top-12 w-80 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6]">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                          {unreadNotifs > 0 && (
                            <span className="text-xs text-[#C1121F] font-medium">{unreadNotifs} new</span>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {userNotifs.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-500">
                              No notifications yet
                            </div>
                          ) : (
                            userNotifs.map(notif => (
                              <div
                                key={notif.id}
                                onClick={() => {
                                  markNotificationRead(notif.id);
                                  if (notif.link) navigate(notif.link);
                                  setNotifOpen(false);
                                }}
                                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${!notif.isRead ? 'bg-red-50/50' : ''}`}
                              >
                                <div className="flex items-start gap-2">
                                  {!notif.isRead && (
                                    <span className="w-2 h-2 bg-[#C1121F] rounded-full mt-1.5 shrink-0" />
                                  )}
                                  <div className={!notif.isRead ? '' : 'pl-4'}>
                                    <p className="text-xs font-semibold text-gray-900">{notif.title}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">{notif.body}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{notif.createdAt}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="px-4 py-2 border-t border-[#F3F4F6]">
                          <Link
                            to={`${dashboardPath}/notifications`}
                            onClick={() => setNotifOpen(false)}
                            className="text-xs text-[#C1121F] font-medium hover:underline"
                          >
                            View all notifications →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User menu */}
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#1A1A1A] overflow-hidden flex items-center justify-center">
                        {currentUser.avatarUrl || currentUser.avatarFile ? (
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
                      <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-12 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in">
                        <div className="px-4 py-3 border-b border-[#F3F4F6]">
                          <p className="text-sm font-semibold text-gray-900 truncate">{currentUser.name}</p>
                          <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">
                            {currentUser.role}
                          </span>
                        </div>
                        <div className="py-1">
                          <Link
                            to={dashboardPath}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboard size={15} className="text-gray-400" />
                            Dashboard
                          </Link>
                          {currentUser.role === 'candidate' && (
                            <Link
                              to="/dashboard/candidate/profile"
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <User size={15} className="text-gray-400" />
                              My Profile
                            </Link>
                          )}
                          {currentUser.role === 'recruiter' && (
                            <Link
                              to="/dashboard/recruiter/company"
                              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Building2 size={15} className="text-gray-400" />
                              My Company
                            </Link>
                          )}
                          <Link
                            to={`${dashboardPath}/settings`}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Settings size={15} className="text-gray-400" />
                            Settings
                          </Link>
                        </div>
                        <div className="py-1 border-t border-[#F3F4F6]">
                          <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-[#5F6368] hover:text-[#111111] px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors hidden sm:block"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium bg-[#111111] text-white px-4 py-2 rounded-lg hover:bg-[#1A1A1A] transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#E5E7EB] bg-white animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-2">
                <Link to="/about" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <BookOpen size={15} /> About
                </Link>
                <Link to="/pricing" className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <Briefcase size={15} /> Pricing
                </Link>
              </div>
              {!currentUser && (
                <div className="pt-2 border-t border-gray-100 mt-2 flex gap-2">
                  <Link to="/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Sign In
                  </Link>
                  <Link to="/register" className="flex-1 text-center py-2.5 text-sm font-medium bg-[#111111] text-white rounded-lg">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[9998] flex items-start justify-center pt-20 px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-gray-100">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search jobs, skills, companies..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 text-base outline-none text-gray-900 placeholder-gray-400"
              />
              <button title='.'
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </form>
            <div className="p-4">
              <p className="text-xs font-medium text-gray-400 mb-3">QUICK LINKS</p>
              <div className="flex flex-wrap gap-2">
                {['React Developer', 'UX Designer', 'Remote Jobs', 'Internships', 'Freelance Design', 'Python'].map(q => (
                  <button
                    key={q}
                    onClick={() => { navigate(`/explore?q=${encodeURIComponent(q)}`); setSearchOpen(false); }}
                    className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}