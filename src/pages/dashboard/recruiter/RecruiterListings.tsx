import { Link } from 'react-router-dom';
import { Plus, MoreVertical, Pause, Play, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '@/store/AppContext';

export default function RecruiterListings() {
  const { currentUser, getCompanyByOwner, listings, applications, updateListingStatus, deleteListing } = useApp();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  if (!currentUser) return null;

  const company = getCompanyByOwner(currentUser.id);
  const myListings = company ? listings.filter(l => l.companyId === company.id) : [];

  const statusColors: Record<string, string> = {
    active: 'bg-green-50 text-green-700', paused: 'bg-amber-50 text-amber-700',
    closed: 'bg-[#F3F4F6] text-[#5F6368]', draft: 'bg-blue-50 text-blue-700', pending: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">Manage Listings</h1>
        <Link to="/dashboard/recruiter/listings/new" className="flex items-center gap-2 bg-[#C1121F] hover:bg-[#9B0D18] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> New Listing
        </Link>
      </div>

      {myListings.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F7F8] rounded-lg">
          <h3 className="text-base font-semibold text-[#111111]">No listings yet</h3>
          <p className="text-sm text-[#5F6368] mt-1 mb-4">Create your first listing to start receiving applications</p>
          <Link to="/dashboard/recruiter/listings/new" className="text-sm font-medium text-[#C1121F]">Create listing →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {myListings.map(listing => {
            const appCount = applications.filter(a => a.listingId === listing.id).length;
            return (
              <div key={listing.id} className="bg-white border border-[#E5E7EB] rounded-lg px-4 py-3 sm:px-5 sm:py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded capitalize ${listing.type === 'job' ? 'bg-[#1A1A1A] text-white' : listing.type === 'internship' ? 'bg-[#E5E7EB] text-[#111111]' : 'bg-[#C1121F] text-white'}`}>
                        {listing.type}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded capitalize ${statusColors[listing.status]}`}>{listing.status}</span>
                    </div>
                    <Link to={`/listing/${listing.slug}`} className="text-base font-semibold text-[#111111] hover:text-[#C1121F] transition-colors font-[family-name:var(--font-heading)]">
                      {listing.title}
                    </Link>
                    <p className="text-xs text-[#5F6368] mt-1">{listing.location} · {appCount} applicants · Posted {listing.createdAt}</p>
                  </div>
                  <div className="relative">
                    <button onClick={() => setMenuOpen(menuOpen === listing.id ? null : listing.id)} className="p-2 text-[#5F6368] hover:text-[#111111]">
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === listing.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-10 animate-fade-in">
                        <Link to={`/listing/${listing.slug}`} className="flex items-center gap-2 px-3 py-2 text-sm text-[#5F6368] hover:bg-[#F7F7F8]" onClick={() => setMenuOpen(null)}>
                          <Eye size={14} /> View
                        </Link>
                        {listing.status === 'active' ? (
                          <button onClick={() => { updateListingStatus(listing.id, 'paused'); setMenuOpen(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#5F6368] hover:bg-[#F7F7F8]">
                            <Pause size={14} /> Pause
                          </button>
                        ) : (
                          <button onClick={() => { updateListingStatus(listing.id, 'active'); setMenuOpen(null); }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#5F6368] hover:bg-[#F7F7F8]">
                            <Play size={14} /> Activate
                          </button>
                        )}
                        <button onClick={() => { deleteListing(listing.id); setMenuOpen(null); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {menuOpen && <div className="fixed inset-0 z-5" onClick={() => setMenuOpen(null)} />}
    </div>
  );
}
