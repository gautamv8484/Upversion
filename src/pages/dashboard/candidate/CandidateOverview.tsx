import { Link } from 'react-router-dom';
import { Briefcase, Bookmark, FileText, Bell, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import Badge, { getApplicationStatusBadge } from '@/components/ui/Badge';
import { timeAgo } from '@/utils/cn';

export default function CandidateOverview() {
  const { currentUser, getApplicationsForCandidate, getSavedListingsForUser, getNotificationsForUser, getCandidateProfile, getListingById, getCompanyById } = useApp();

  if (!currentUser) return null;

  const applications = getApplicationsForCandidate(currentUser.id);
  const saved = getSavedListingsForUser(currentUser.id);
  const notifications = getNotificationsForUser(currentUser.id);
  const profile = getCandidateProfile(currentUser.id);
  const unread = notifications.filter(n => !n.isRead).length;

  const recentApps = applications.slice(-3).reverse();

  const stats = [
    { label: 'Applications', value: applications.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', link: 'applications' },
    { label: 'Saved Jobs', value: saved.length, icon: Bookmark, color: 'text-purple-600', bg: 'bg-purple-50', link: 'saved' },
    { label: 'Unread Notifications', value: unread, icon: Bell, color: 'text-[#C1121F]', bg: 'bg-red-50', link: 'notifications' },
    { label: 'Profile Completion', value: `${profile?.profileCompletion || 0}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', link: 'profile' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
          Welcome back, {currentUser.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-sm text-[#5F6368] mt-1">Here's what's happening with your job search.</p>
      </div>

      {/* Profile Completion Warning */}
      {profile && profile.profileCompletion < 60 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Complete your profile</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Your profile is {profile.profileCompletion}% complete. A complete profile gets 3x more views!
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/candidate/profile"
            className="shrink-0 text-xs font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Complete →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link key={stat.label} to={stat.link} className="card-hover bg-white border border-[#E5E7EB] rounded-xl p-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={18} className={stat.color} />
            </div>
            <p className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">{stat.value}</p>
            <p className="text-xs text-[#5F6368] mt-0.5">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F3F4F6]">
          <h2 className="font-semibold text-[#111111]">Recent Applications</h2>
          <Link to="applications" className="text-xs text-[#C1121F] font-medium flex items-center gap-1 hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        {recentApps.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <Briefcase size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No applications yet</p>
            <Link to="/explore" className="text-xs text-[#C1121F] font-medium mt-2 inline-block hover:underline">
              Browse opportunities →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#F3F4F6]">
            {recentApps.map(app => {
              const listing = getListingById(app.listingId);
              const company = listing ? getCompanyById(listing.companyId) : undefined;
              const statusBadge = getApplicationStatusBadge(app.status);

              return (
                <div key={app.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg border border-[#E5E7EB] flex items-center justify-center overflow-hidden shrink-0">
                    {company?.logoFile || company?.logoUrl ? (
                      <img src={company.logoFile || company.logoUrl} alt={company.companyName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-gray-600 text-sm">{company?.companyName?.charAt(0) || '?'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{listing?.title || 'Unknown Listing'}</p>
                    <p className="text-xs text-gray-500 truncate">{company?.companyName} · {timeAgo(app.createdAt)}</p>
                  </div>
                  <Badge variant={statusBadge.variant} size="sm">{statusBadge.label}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: 'Browse Jobs', desc: 'Find your next role', to: '/jobs', icon: Briefcase },
          { label: 'Update Profile', desc: 'Improve your visibility', to: '/dashboard/candidate/profile', icon: TrendingUp },
          { label: 'Saved Jobs', desc: `${saved.length} jobs saved`, to: '/dashboard/candidate/saved', icon: Bookmark },
        ].map(action => (
          <Link
            key={action.label}
            to={action.to}
            className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#C1121F] transition-all group"
          >
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
              <action.icon size={18} className="text-[#C1121F]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{action.label}</p>
              <p className="text-xs text-gray-500">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}