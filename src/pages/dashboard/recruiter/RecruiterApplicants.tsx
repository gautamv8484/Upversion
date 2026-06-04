import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { ApplicationStatus } from '@/types';
import { User, ExternalLink } from 'lucide-react';

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  reviewed: 'bg-amber-50 text-amber-700 border-amber-200',
  shortlisted: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  hired: 'bg-[#FDECEE] text-[#C1121F] border-red-200',
};

const allStatuses: ApplicationStatus[] = ['new', 'reviewed', 'shortlisted', 'rejected', 'hired'];

export default function RecruiterApplicants() {
  const { currentUser, getCompanyByOwner, listings, applications, updateApplicationStatus, getUserById, getCandidateProfile } = useApp();
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | ''>('');
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  if (!currentUser) return null;

  const company = getCompanyByOwner(currentUser.id);
  const myListings = company ? listings.filter(l => l.companyId === company.id) : [];
  let myApps = applications.filter(a => myListings.some(l => l.id === a.listingId));
  if (filterStatus) myApps = myApps.filter(a => a.status === filterStatus);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-6">Applicants</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilterStatus('')}
          className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-colors ${!filterStatus ? 'bg-[#111111] text-white border-[#111111]' : 'text-[#5F6368] border-[#E5E7EB] hover:border-[#111111]'}`}>
          All ({applications.filter(a => myListings.some(l => l.id === a.listingId)).length})
        </button>
        {allStatuses.map(s => {
          const count = applications.filter(a => myListings.some(l => l.id === a.listingId) && a.status === s).length;
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-colors capitalize ${filterStatus === s ? 'bg-[#111111] text-white border-[#111111]' : 'text-[#5F6368] border-[#E5E7EB] hover:border-[#111111]'}`}>
              {s} ({count})
            </button>
          );
        })}
      </div>

      {myApps.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F7F8] rounded-lg">
          <User size={32} className="text-[#5F6368] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#111111]">No applicants yet</h3>
          <p className="text-sm text-[#5F6368] mt-1">Applicants will appear here when they apply to your listings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myApps.map(app => {
            const listing = listings.find(l => l.id === app.listingId);
            const user = getUserById(app.candidateUserId);
            const profile = getCandidateProfile(app.candidateUserId);
            const isExpanded = expandedApp === app.id;

            return (
              <div key={app.id} className="bg-white border border-[#E5E7EB] rounded-lg overflow-hidden">
                <div className="px-4 py-3 sm:px-5 sm:py-4 cursor-pointer" onClick={() => setExpandedApp(isExpanded ? null : app.id)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-[#1A1A1A] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-xs font-medium">{user?.name?.charAt(0) || '?'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111111]">{user?.name || 'Unknown'}</p>
                        <p className="text-xs text-[#5F6368]">{profile?.headline || user?.email}</p>
                        <p className="text-xs text-[#5F6368] mt-0.5">Applied for: <span className="font-medium">{listing?.title}</span></p>
                        <p className="text-xs text-[#5F6368]">{app.applicationType === 'proposal' ? 'Proposal' : 'Application'} · {app.createdAt}</p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded capitalize border ${statusColors[app.status]}`}>{app.status}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-[#E5E7EB] pt-3 animate-fade-in">
                    {app.coverLetter && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-[#5F6368] mb-1">Cover Letter</p>
                        <p className="text-sm text-[#111111] leading-relaxed bg-[#F7F7F8] rounded-lg p-3">{app.coverLetter}</p>
                      </div>
                    )}
                    {app.proposalText && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-[#5F6368] mb-1">Proposal</p>
                        <p className="text-sm text-[#111111] leading-relaxed bg-[#F7F7F8] rounded-lg p-3">{app.proposalText}</p>
                      </div>
                    )}
                    {app.expectedBudget && <p className="text-xs text-[#5F6368] mb-1">Expected Budget: <span className="font-medium text-[#111111]">${app.expectedBudget}</span></p>}
                    {app.estimatedTimeline && <p className="text-xs text-[#5F6368] mb-1">Timeline: <span className="font-medium text-[#111111]">{app.estimatedTimeline}</span></p>}
                    {profile?.skills && profile.skills.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-[#5F6368] mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.map(s => <span key={s} className="text-[10px] font-medium bg-[#F3F4F6] text-[#5F6368] px-2 py-0.5 rounded">{s}</span>)}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {app.portfolioUrl && (
                        <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-[#C1121F] flex items-center gap-1">
                          <ExternalLink size={12} /> Portfolio
                        </a>
                      )}
                      {app.resumeUrl && (
                        <span className="text-xs font-medium text-[#5F6368] flex items-center gap-1">
                          <ExternalLink size={12} /> Resume
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#E5E7EB]">
                      {allStatuses.filter(s => s !== app.status).map(s => (
                        <button key={s} onClick={() => updateApplicationStatus(app.id, s)}
                          className={`text-[11px] font-medium px-3 py-1.5 rounded-md border transition-colors capitalize ${statusColors[s]}`}>
                          {s === 'hired' ? 'Mark as Hired' : s === 'rejected' ? 'Reject' : s === 'shortlisted' ? 'Shortlist' : s === 'reviewed' ? 'Mark Reviewed' : 'Reset to New'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
