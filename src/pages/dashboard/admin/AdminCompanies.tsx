import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle, XCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export default function AdminCompanies() {
  const { companies, verifyCompany, getListingsForCompany } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');

  let filtered = [...companies];
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(c => c.companyName.toLowerCase().includes(q));
  }
  if (filter === 'verified') filtered = filtered.filter(c => c.verified);
  if (filter === 'unverified') filtered = filtered.filter(c => !c.verified);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-1">Companies</h1>
      <p className="text-sm text-[#5F6368] mb-6">{filtered.length} companies</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6368]" />
          <input type="text" placeholder="Search companies…" value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#111111]" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          className="px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm bg-white focus:outline-none">
          <option value="">All</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(c => {
          const activeListings = getListingsForCompany(c.id).filter(l => l.status === 'active').length;
          return (
            <div key={c.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl border border-[#E5E7EB] flex items-center justify-center shrink-0 overflow-hidden">
                    {(c.logoFile || c.logoUrl) ? (
                      <img src={c.logoFile || c.logoUrl} alt={c.companyName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-gray-700">{c.companyName.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#111111] truncate">{c.companyName}</h3>
                      {c.verified && <CheckCircle size={14} className="text-[#C1121F] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#5F6368]">{c.industry} · {c.location} · {activeListings} listings</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={'/company/' + c.slug} className="p-2 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-lg transition-colors">
                    <ExternalLink size={15} />
                  </Link>
                  {!c.verified && (
                    <button
                      onClick={() => verifyCompany(c.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-green-600 px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
                    >
                      <ShieldCheck size={13} /> Verify
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}