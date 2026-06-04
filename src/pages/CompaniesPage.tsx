import { useState, useMemo } from 'react';
import { Search, CheckCircle, Filter } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import CompanyCard from '@/components/ui/CompanyCard';

const industries = ['All', 'Fintech', 'SaaS / Developer Tools', 'Productivity', 'Design Tools', 'Health & Wellness', 'Cloud Infrastructure', 'E-commerce', 'Education'];

export default function CompaniesPage() {
  const { companies } = useApp();
  const [query, setQuery] = useState('');
  const [industry, setIndustry] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const matchQ = !query || c.companyName.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase());
      const matchIndustry = industry === 'All' || c.industry === industry;
      const matchVerified = !verifiedOnly || c.verified;
      return matchQ && matchIndustry && matchVerified;
    });
  }, [companies, query, industry, verifiedOnly]);

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
            Companies
          </h1>
          <p className="text-sm text-[#5F6368] mt-1">Discover companies that are actively hiring</p>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] bg-white rounded-lg text-sm focus:outline-none focus:border-[#111111] transition-colors"
              />
            </div>
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="px-3 py-2.5 border border-[#E5E7EB] bg-white rounded-lg text-sm text-gray-700 focus:outline-none cursor-pointer"
            >
              {industries.map(i => <option key={i}>{i}</option>)}
            </select>
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
                className="accent-[#C1121F]"
              />
              <span className="text-sm text-gray-700 whitespace-nowrap flex items-center gap-1">
                <CheckCircle size={13} className="text-[#C1121F]" /> Verified only
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <p className="text-sm text-[#5F6368] mb-4">
          Showing <span className="font-semibold text-[#111111]">{filtered.length}</span> companies
        </p>
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[#E5E7EB]">
            <p className="text-gray-500 text-sm">No companies found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(company => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}