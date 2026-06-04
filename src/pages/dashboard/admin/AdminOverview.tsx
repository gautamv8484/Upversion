import { Link } from 'react-router-dom';
import {
  Users, FileText, Building2, Flag, ShieldCheck,
  TrendingUp, ArrowRight, AlertCircle, Activity
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { formatDate } from '@/utils/cn';

export default function AdminOverview() {
  const { users, listings, companies, applications, reports, verifications } = useApp();

  const candidates = users.filter(u => u.role === 'candidate');
  const recruiters = users.filter(u => u.role === 'recruiter');
  const activeListings = listings.filter(l => l.status === 'active');
  const pendingVerifications = verifications.filter(v => v.status === 'pending');
  const pendingReports = reports.filter(r => r.status === 'pending');
  const bannedUsers = users.filter(u => u.isBanned);

  const stats = [
    {
      icon: Users, value: users.length, label: 'Total Users',
      sub: candidates.length + ' candidates · ' + recruiters.length + ' recruiters',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: FileText, value: listings.length, label: 'Total Listings',
      sub: activeListings.length + ' active',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Building2, value: companies.length, label: 'Companies',
      sub: companies.filter(c => c.verified).length + ' verified',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: TrendingUp, value: applications.length, label: 'Applications',
      sub: 'Total submissions',
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: ShieldCheck, value: pendingVerifications.length, label: 'Pending Verifications',
      sub: 'Awaiting review',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: Flag, value: pendingReports.length, label: 'Open Reports',
      sub: 'Need attention',
      color: 'bg-red-50 text-red-600',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#5F6368] mt-0.5">Platform overview and quick actions</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-green-500" />
          <span className="text-xs font-medium text-green-600">System Online</span>
        </div>
      </div>

      {/* Alert Cards */}
      {(pendingVerifications.length > 0 || pendingReports.length > 0 || bannedUsers.length > 0) && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {pendingVerifications.length > 0 && (
            <Link
              to="/admin/verifications"
              className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <ShieldCheck size={20} className="text-orange-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-800">{pendingVerifications.length} pending verification{pendingVerifications.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-orange-600">Review company documents</p>
              </div>
              <ArrowRight size={16} className="text-orange-400" />
            </Link>
          )}
          {pendingReports.length > 0 && (
            <Link
              to="/admin/reports"
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
            >
              <Flag size={20} className="text-red-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">{pendingReports.length} open report{pendingReports.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-red-600">Need your attention</p>
              </div>
              <ArrowRight size={16} className="text-red-400" />
            </Link>
          )}
          {bannedUsers.length > 0 && (
            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <AlertCircle size={20} className="text-gray-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{bannedUsers.length} banned user{bannedUsers.length !== 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-600">Review suspended accounts</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </Link>
          )}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-gray-300 transition-colors">
            <div className={'w-10 h-10 rounded-xl flex items-center justify-center mb-3 ' + stat.color}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">{stat.value}</p>
            <p className="text-xs font-medium text-[#111111] mt-1">{stat.label}</p>
            <p className="text-xs text-[#5F6368]">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-semibold text-[#111111] font-[family-name:var(--font-heading)]">Recent Users</h2>
            <Link to="/admin/users" className="text-xs text-[#C1121F] font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {users.slice(-5).reverse().map(u => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3 hover:bg-[#FAFAFA] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center shrink-0">
                    {(u.avatarFile || u.avatarUrl) ? (
                      <img src={u.avatarFile || u.avatarUrl} alt={u.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-white text-xs font-medium">{u.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111111]">{u.name}</p>
                    <p className="text-xs text-[#5F6368]">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ' +
                    (u.role === 'candidate' ? 'bg-blue-50 text-blue-600' :
                     u.role === 'recruiter' ? 'bg-purple-50 text-purple-600' :
                     'bg-red-50 text-red-600')
                  }>
                    {u.role}
                  </span>
                  {u.isBanned && (
                    <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">BANNED</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-semibold text-[#111111] font-[family-name:var(--font-heading)]">Recent Listings</h2>
            <Link to="/admin/listings" className="text-xs text-[#C1121F] font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-[#F3F4F6]">
            {listings.slice(-5).reverse().map(l => {
              const statusStyle: Record<string, string> = {
                active: 'bg-green-50 text-green-700',
                paused: 'bg-amber-50 text-amber-700',
                closed: 'bg-gray-100 text-gray-600',
                draft: 'bg-blue-50 text-blue-700',
                pending: 'bg-orange-50 text-orange-700',
              };
              return (
                <div key={l.id} className="flex items-center justify-between px-5 py-3 hover:bg-[#FAFAFA] transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#111111] truncate">{l.title}</p>
                    <p className="text-xs text-[#5F6368]">
                      {l.type} · {formatDate(l.createdAt)}
                    </p>
                  </div>
                  <span className={'text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0 ml-2 ' + (statusStyle[l.status] || '')}>
                    {l.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}