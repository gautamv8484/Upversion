import { useApp } from '@/store/AppContext';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  reviewed: 'bg-amber-50 text-amber-700',
  shortlisted: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  hired: 'bg-[#FDECEE] text-[#C1121F]',
};

interface Props {
  type: 'apply' | 'proposal';
}

export default function CandidateApplications({ type }: Props) {
  const { currentUser, getApplicationsForCandidate, getListingById, getCompanyById } = useApp();
  if (!currentUser) return null;

  const apps = getApplicationsForCandidate(currentUser.id).filter(a => a.applicationType === type);
  const title = type === 'apply' ? 'Applications' : 'Proposals';

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-6">{title}</h1>
      {apps.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F7F8] rounded-lg">
          <FileText size={32} className="text-[#5F6368] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#111111]">No {title.toLowerCase()} yet</h3>
          <p className="text-sm text-[#5F6368] mt-1 mb-4">Start exploring opportunities</p>
          <Link to="/explore" className="text-sm font-medium text-[#C1121F] hover:text-[#9B0D18]">Browse listings →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {apps.map(app => {
            const listing = getListingById(app.listingId);
            const company = listing ? getCompanyById(listing.companyId) : null;
            return (
              <div key={app.id} className="bg-white border border-[#E5E7EB] rounded-lg p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link to={listing ? `/listing/${listing.slug}` : '#'} className="text-base font-semibold text-[#111111] hover:text-[#C1121F] transition-colors font-[family-name:var(--font-heading)]">
                      {listing?.title || 'Unknown Listing'}
                    </Link>
                    <p className="text-sm text-[#5F6368] mt-0.5">{company?.companyName || 'Unknown Company'}</p>
                    <p className="text-xs text-[#5F6368] mt-1">Submitted on {app.createdAt}</p>
                    {type === 'proposal' && app.expectedBudget && (
                      <p className="text-xs text-[#5F6368] mt-1">Budget: ${app.expectedBudget} · Timeline: {app.estimatedTimeline}</p>
                    )}
                  </div>
                  <span className={`text-[11px] font-medium px-2.5 py-1 rounded capitalize shrink-0 ${statusColors[app.status]}`}>
                    {app.status}
                  </span>
                </div>
                {app.coverLetter && <p className="text-sm text-[#5F6368] mt-3 line-clamp-2 leading-relaxed">{app.coverLetter}</p>}
                {app.proposalText && <p className="text-sm text-[#5F6368] mt-3 line-clamp-2 leading-relaxed">{app.proposalText}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
