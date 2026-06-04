import { Link } from 'react-router-dom';
import { FileText, Users, CheckCircle, AlertCircle, ArrowRight, Plus } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export default function RecruiterOverview() {
  const { currentUser, getCompanyByOwner, listings, applications } = useApp();
  if (!currentUser) return null;

  const company = getCompanyByOwner(currentUser.id);
  const myListings = company ? listings.filter(l => l.companyId === company.id) : [];
  const activeListings = myListings.filter(l => l.status === 'active');
  const myApps = applications.filter(a => myListings.some(l => l.id === a.listingId));
  const newApps = myApps.filter(a => a.status === 'new');
  const shortlisted = myApps.filter(a => a.status === 'shortlisted');

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">Dashboard</h1>
        <Link to="/dashboard/recruiter/listings/new" className="flex items-center gap-2 bg-[#C1121F] hover:bg-[#9B0D18] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Post Listing
        </Link>
      </div>

      {!company && (
        <div className="bg-[#FDECEE] border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-[#C1121F]" />
            <div>
              <p className="text-sm font-medium text-[#111111]">Set up your company profile</p>
              <p className="text-xs text-[#5F6368]">Create a company profile to start posting listings</p>
            </div>
          </div>
          <Link to="/dashboard/recruiter/company" className="text-sm font-medium text-[#C1121F] hover:text-[#9B0D18] flex items-center gap-1">
            Set up <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {company && !company.verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-600" />
            <div>
              <p className="text-sm font-medium text-[#111111]">Verification pending</p>
              <p className="text-xs text-[#5F6368]">Your company profile is awaiting verification</p>
            </div>
          </div>
          <Link to="/dashboard/recruiter/verification" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
            Details <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: FileText, value: activeListings.length, label: 'Active Listings', color: 'text-[#111111]' },
          { icon: Users, value: myApps.length, label: 'Total Applicants', color: 'text-[#C1121F]' },
          { icon: AlertCircle, value: newApps.length, label: 'New Applications', color: 'text-amber-600' },
          { icon: CheckCircle, value: shortlisted.length, label: 'Shortlisted', color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-[#E5E7EB] rounded-lg p-4">
            <stat.icon size={18} className={stat.color + ' mb-2'} />
            <p className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">{stat.value}</p>
            <p className="text-xs text-[#5F6368]">{stat.label}</p>
          </div>
        ))}
      </div>

      {myListings.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)]">Recent Listings</h2>
            <Link to="/dashboard/recruiter/listings" className="text-sm text-[#C1121F] hover:text-[#9B0D18]">View all →</Link>
          </div>
          <div className="space-y-2">
            {myListings.slice(0, 5).map(listing => {
              const appCount = applications.filter(a => a.listingId === listing.id).length;
              const statusColors: Record<string, string> = {
                active: 'bg-green-50 text-green-700', paused: 'bg-amber-50 text-amber-700',
                closed: 'bg-[#F3F4F6] text-[#5F6368]', draft: 'bg-blue-50 text-blue-700', pending: 'bg-amber-50 text-amber-700',
              };
              return (
                <div key={listing.id} className="bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#111111]">{listing.title}</p>
                    <p className="text-xs text-[#5F6368]">{listing.type} · {appCount} applicants · Posted {listing.createdAt}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize ${statusColors[listing.status]}`}>{listing.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
