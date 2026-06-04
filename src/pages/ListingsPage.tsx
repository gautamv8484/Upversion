import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronDown, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import ListingCard from '@/components/ui/ListingCard';
import { ListingType, WorkMode, ExperienceLevel } from '@/types';
import { categories } from '@/data/mock';

interface ListingsPageProps {
  filterType?: ListingType;
  title?: string;
  subtitle?: string;
}

export default function ListingsPage({ filterType, title, subtitle }: ListingsPageProps) {
  const { listings, getCompanyById } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    workMode: [] as WorkMode[],
    experienceLevel: [] as ExperienceLevel[],
    location: '',
    salaryMin: '',
    salaryMax: '',
  });

  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'salary'>('newest');

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, [filters, filterType]);

  const filteredListings = useMemo(() => {
    let result = listings.filter(l => l.status === 'active');

    if (filterType) {
      result = result.filter(l => l.type === filterType);
    }

    if (filters.q.trim()) {
      const q = filters.q.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.skillsRequired.some(s => s.toLowerCase().includes(q)) ||
        l.category.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        getCompanyById(l.companyId)?.companyName.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      result = result.filter(l => l.category === filters.category);
    }

    if (filters.workMode.length) {
      result = result.filter(l => filters.workMode.includes(l.workMode));
    }

    if (filters.experienceLevel.length) {
      result = result.filter(l => filters.experienceLevel.includes(l.experienceLevel));
    }

    if (filters.location) {
      result = result.filter(l => l.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return 0;
    });

    return result;
  }, [listings, filterType, filters, sortBy, getCompanyById]);

  const toggleArrayFilter = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const clearFilters = () => {
    setFilters({ q: '', category: '', workMode: [], experienceLevel: [], location: '', salaryMin: '', salaryMax: '' });
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.workMode.length || filters.experienceLevel.length || filters.location;

  const workModes: WorkMode[] = ['remote', 'onsite', 'hybrid'];
  const expLevels: { value: ExperienceLevel; label: string }[] = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead / Manager' },
  ];

  // Update URL on search
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.q) params.q = filters.q;
    if (filters.category) params.category = filters.category;
    setSearchParams(params, { replace: true });
  }, [filters.q, filters.category]);

  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
            {title || 'All Opportunities'}
          </h1>
          {subtitle && <p className="text-sm text-[#5F6368] mt-1">{subtitle}</p>}

          {/* Search Bar */}
          <div className="flex gap-2 mt-5">
            <div className="flex-1 relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.q}
                onChange={e => setFilters(p => ({ ...p, q: e.target.value }))}
                placeholder="Search by title, skill, company..."
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] bg-white rounded-lg text-sm focus:outline-none focus:border-[#111111] transition-colors"
              />
              {filters.q && (
                <button
                  onClick={() => setFilters(p => ({ ...p, q: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                hasActiveFilters
                  ? 'border-[#C1121F] bg-red-50 text-[#C1121F]'
                  : 'border-[#E5E7EB] bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-[#C1121F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {(filters.category ? 1 : 0) + filters.workMode.length + filters.experienceLevel.length + (filters.location ? 1 : 0)}
                </span>
              )}
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="px-3 py-2.5 border border-[#E5E7EB] bg-white rounded-lg text-sm text-gray-700 focus:outline-none focus:border-gray-300 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 sticky top-24 space-y-6">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full text-xs text-red-600 font-medium flex items-center gap-1.5 hover:underline"
                >
                  <X size={12} /> Clear all filters
                </button>
              )}

              {/* Category */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Category</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setFilters(p => ({ ...p, category: '' }))}
                    className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${!filters.category ? 'text-[#C1121F] font-medium bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    All categories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilters(p => ({ ...p, category: p.category === cat ? '' : cat }))}
                      className={`w-full text-left text-sm px-2 py-1.5 rounded-lg transition-colors ${filters.category === cat ? 'text-[#C1121F] font-medium bg-red-50' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Mode */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Work Mode</h3>
                <div className="space-y-2">
                  {workModes.map(mode => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.workMode.includes(mode)}
                        onChange={() => setFilters(p => ({ ...p, workMode: toggleArrayFilter(p.workMode, mode) }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#C1121F] accent-[#C1121F]"
                      />
                      <span className="text-sm text-gray-700 capitalize">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Experience</h3>
                <div className="space-y-2">
                  {expLevels.map(level => (
                    <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.experienceLevel.includes(level.value)}
                        onChange={() => setFilters(p => ({ ...p, experienceLevel: toggleArrayFilter(p.experienceLevel, level.value) }))}
                        className="w-4 h-4 rounded border-gray-300 text-[#C1121F] accent-[#C1121F]"
                      />
                      <span className="text-sm text-gray-700">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2.5">Location</h3>
                <input
                  type="text"
                  value={filters.location}
                  onChange={e => setFilters(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g. San Francisco"
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>
            </div>
          </aside>

          {/* Mobile Filter Panel */}
          {filtersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
              <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto animate-slide-in">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-4 space-y-6">
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-xs text-red-600 font-medium flex items-center gap-1">
                      <X size={12} /> Clear all filters
                    </button>
                  )}
                  {/* Same filters as desktop */}
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Category</h3>
                    <div className="space-y-1">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setFilters(p => ({ ...p, category: p.category === cat ? '' : cat }))}
                          className={`w-full text-left text-sm px-2 py-1.5 rounded-lg ${filters.category === cat ? 'text-[#C1121F] bg-red-50 font-medium' : 'text-gray-600'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Work Mode</h3>
                    <div className="space-y-2">
                      {workModes.map(mode => (
                        <label key={mode} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={filters.workMode.includes(mode)}
                            onChange={() => setFilters(p => ({ ...p, workMode: toggleArrayFilter(p.workMode, mode) }))}
                            className="accent-[#C1121F]" />
                          <span className="text-sm capitalize">{mode}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="w-full py-3 bg-[#C1121F] text-white font-medium rounded-xl text-sm"
                  >
                    Apply Filters ({filteredListings.length} results)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#5F6368]">
                <span className="font-semibold text-[#111111]">{filteredListings.length}</span> opportunities found
              </p>
              {/* Type tabs */}
              {!filterType && (
                <div className="hidden sm:flex gap-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { label: 'All', value: null },
                    { label: 'Jobs', value: 'job' },
                    { label: 'Internships', value: 'internship' },
                    { label: 'Freelance', value: 'freelance' },
                  ].map(tab => (
                    <button key={tab.label} className="text-xs px-3 py-1.5 rounded-md font-medium text-gray-500 hover:text-gray-900 transition-colors">
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="text-[#C1121F] animate-spin" />
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No listings found</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Try adjusting your search or removing some filters
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#C1121F] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredListings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}