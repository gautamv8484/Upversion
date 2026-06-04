import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ExternalLink, Trash2, Pause, Play, X as XIcon } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import Badge, { getTypeBadge, getListingStatusBadge } from '@/components/ui/Badge';
import { formatDate } from '@/utils/cn';

export default function AdminListings() {
  const { listings, getCompanyById, updateListingStatus, deleteListing } = useApp();
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  let filtered = [...listings];
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(l => l.title.toLowerCase().includes(q));
  }
  if (typeFilter) filtered = filtered.filter(l => l.type === typeFilter);
  if (statusFilter) filtered = filtered.filter(l => l.status === statusFilter);

  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">All Listings</h1>
          <p className="text-sm text-[#5F6368] mt-0.5">{filtered.length} listing{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6368]" />
          <input type="text" placeholder="Search listings…" value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#111111] transition-colors" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:outline-none">
          <option value="">All Types</option>
          <option value="job">Jobs</option>
          <option value="internship">Internships</option>
          <option value="freelance">Freelance</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:outline-none">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-10 text-center">
            <p className="text-sm text-gray-500">No listings found</p>
          </div>
        ) : (
          filtered.map(l => {
            const company = getCompanyById(l.companyId);
            const typeBadge = getTypeBadge(l.type);
            const statusBadge = getListingStatusBadge(l.status);
            return (
              <div key={l.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 sm:p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant={typeBadge.variant} size="sm">{typeBadge.label}</Badge>
                      <Badge variant={statusBadge.variant} size="sm" dot>{statusBadge.label}</Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-[#111111] truncate">{l.title}</h3>
                    <p className="text-xs text-[#5F6368] mt-0.5">
                      {company?.companyName || 'Unknown'} · {l.location} · {formatDate(l.createdAt)}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#5F6368]">
                      <span>{l.viewCount || 0} views</span>
                      <span>{l.applicationCount || 0} applications</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Link to={'/listing/' + l.slug} className="p-2 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors" title="View">
                      <ExternalLink size={15} />
                    </Link>
                    {l.status === 'active' ? (
                      <button onClick={() => updateListingStatus(l.id, 'paused')} className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Pause">
                        <Pause size={15} />
                      </button>
                    ) : l.status === 'paused' ? (
                      <button onClick={() => updateListingStatus(l.id, 'active')} className="p-2 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Activate">
                        <Play size={15} />
                      </button>
                    ) : null}
                    <button
                      onClick={() => { if (confirm('Delete this listing?')) deleteListing(l.id); }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}