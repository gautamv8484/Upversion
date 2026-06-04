import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Briefcase, Building2, Wifi, ShieldCheck, Code, Palette, Megaphone, TrendingUp, DollarSign, Cog, PenTool, BarChart3, Users, CheckCircle, Star } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import ListingCard from '@/components/ui/ListingCard';

const categories = [
  { name: 'Engineering', icon: Code, count: 0 },
  { name: 'Design', icon: Palette, count: 0 },
  { name: 'Marketing', icon: Megaphone, count: 0 },
  { name: 'Sales', icon: TrendingUp, count: 0 },
  { name: 'Finance', icon: DollarSign, count: 0 },
  { name: 'Operations', icon: Cog, count: 0 },
  { name: 'Content', icon: PenTool, count: 0 },
  { name: 'Data Science', icon: BarChart3, count: 0 },
];

export default function HomePage() {
  const { listings, companies } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'job' | 'internship' | 'freelance'>('all');
  const navigate = useNavigate();

  const activeListings = listings.filter(l => l.status === 'active');
  const featuredListings = activeListings.filter(l => l.featured).slice(0, 6);
  const remoteCount = activeListings.filter(l => l.workMode === 'remote').length;
  const verifiedCompanies = companies.filter(c => c.verified);

  const enrichedCategories = categories.map(cat => ({
    ...cat,
    count: activeListings.filter(l => l.category === cat.name).length,
  }));

  const handleSearch = () => {
    const path = activeType === 'all' ? '/explore' : `/${activeType === 'job' ? 'jobs' : activeType === 'internship' ? 'internships' : 'freelance'}`;
    navigate(`${path}?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] leading-[1.1] tracking-tight font-[family-name:var(--font-heading)]">
              Find work that fits<br />your next move.
            </h1>
            <p className="mt-5 text-lg text-[#5F6368] leading-relaxed max-w-xl">
              Discover jobs, internships, and freelance projects from companies that value great talent. One platform, every opportunity.
            </p>

            <div className="mt-8">
              <div className="flex gap-1 mb-3">
                {(['all', 'job', 'internship', 'freelance'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${activeType === t ? 'bg-[#111111] text-white' : 'text-[#5F6368] hover:bg-[#F3F4F6]'}`}
                  >
                    {t === 'all' ? 'All' : t === 'job' ? 'Jobs' : t === 'internship' ? 'Internships' : 'Freelance'}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5F6368]" />
                  <input
                    type="text"
                    placeholder="Search by title, skill, or company…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>
                <button onClick={handleSearch} className="bg-[#C1121F] hover:bg-[#9B0D18] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shrink-0">
                  Search
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#C1121F] hover:text-[#9B0D18] transition-colors">
                Explore all opportunities <ArrowRight size={14} />
              </Link>
              <span className="text-[#E5E7EB]">·</span>
              <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5F6368] hover:text-[#111111] transition-colors">
                Post a listing <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[#F7F7F8] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Briefcase, value: activeListings.length, label: 'Live Opportunities' },
              { icon: Building2, value: companies.length, label: 'Companies Hiring' },
              { icon: Wifi, value: remoteCount, label: 'Remote-Friendly' },
              { icon: ShieldCheck, value: verifiedCompanies.length, label: 'Verified Recruiters' },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-[#E5E7EB] rounded-lg flex items-center justify-center">
                  <stat.icon size={18} className="text-[#C1121F]" />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">{stat.value}</p>
                  <p className="text-xs text-[#5F6368]">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">Featured Opportunities</h2>
              <p className="text-sm text-[#5F6368] mt-1">Hand-picked roles from top companies</p>
            </div>
            <Link to="/explore" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#C1121F] hover:text-[#9B0D18]">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredListings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
          <Link to="/explore" className="sm:hidden mt-6 flex items-center justify-center gap-1 text-sm font-medium text-[#C1121F]">
            View all opportunities <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="bg-[#F7F7F8] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-2">Browse by Category</h2>
          <p className="text-sm text-[#5F6368] mb-8">Find opportunities in your field</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {enrichedCategories.map(cat => (
              <Link key={cat.name} to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="bg-white border border-[#E5E7EB] rounded-lg p-4 hover:border-[#111111] transition-all group">
                <cat.icon size={20} className="text-[#C1121F] mb-3" />
                <h3 className="text-sm font-semibold text-[#111111] group-hover:text-[#C1121F] transition-colors font-[family-name:var(--font-heading)]">{cat.name}</h3>
                <p className="text-xs text-[#5F6368] mt-0.5">{cat.count} positions</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For Recruiters */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-[#1A1A1A] rounded-xl p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-[family-name:var(--font-heading)]">Post roles and find<br />the right talent faster.</h2>
              <p className="text-sm text-gray-400 mt-3 max-w-md leading-relaxed">
                Reach thousands of qualified candidates, students, and freelancers. Create your company profile and start hiring today.
              </p>
            </div>
            <Link to="/pricing" className="bg-[#C1121F] hover:bg-[#9B0D18] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shrink-0 inline-flex items-center gap-2">
              Start Hiring <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="bg-[#F7F7F8] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-2">Top Companies</h2>
          <p className="text-sm text-[#5F6368] mb-8">Trusted teams actively hiring on Upversion</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {companies.slice(0, 6).map(c => (
              <Link key={c.id} to={`/company/${c.slug}`}
                className="bg-white border border-[#E5E7EB] rounded-lg p-4 text-center hover:border-[#111111] transition-all group">
                <div className="w-12 h-12 bg-[#F3F4F6] rounded-lg flex items-center justify-center mx-auto mb-3 border border-[#E5E7EB]">
                  <span className="text-lg font-bold text-[#1A1A1A] font-[family-name:var(--font-heading)]">{c.companyName.charAt(0)}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#111111] font-[family-name:var(--font-heading)] truncate">{c.companyName}</h3>
                {c.verified && <span className="inline-flex items-center gap-1 text-[10px] text-[#C1121F] mt-1"><CheckCircle size={10} /> Verified</span>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-2 text-center">How It Works</h2>
          <p className="text-sm text-[#5F6368] mb-12 text-center">Four simple steps to your next opportunity</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Profile', desc: 'Sign up and build your professional profile with skills, experience, and portfolio.' },
              { step: '02', title: 'Discover', desc: 'Browse jobs, internships, and freelance projects from verified companies.' },
              { step: '03', title: 'Apply', desc: 'Submit applications or send proposals directly through the platform.' },
              { step: '04', title: 'Get Hired', desc: 'Track your applications and connect with recruiters who value your talent.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-[#FDECEE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-sm font-bold text-[#C1121F] font-[family-name:var(--font-heading)]">{item.step}</span>
                </div>
                <h3 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-2">{item.title}</h3>
                <p className="text-sm text-[#5F6368] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#FAF8F5] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-8 text-center">Trusted by Professionals</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: 'Emily Zhang', role: 'Software Engineer', text: 'Found my dream job at a startup through Upversion. The process was smooth and the listings were high quality.' },
              { name: 'Marcus Johnson', role: 'Freelance Designer', text: 'As a freelancer, Upversion helps me find project-based work that matches my skills. Clean and simple to use.' },
              { name: 'Rachel Kim', role: 'HR Manager at Notion', text: 'We\'ve hired 5 people through Upversion this quarter. The quality of candidates is consistently strong.' },
            ].map(t => (
              <div key={t.name} className="bg-white border border-[#E5E7EB] rounded-lg p-6">
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[#C1121F] text-[#C1121F]" />)}
                </div>
                <p className="text-sm text-[#5F6368] leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#111111]">{t.name}</p>
                    <p className="text-xs text-[#5F6368]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] font-[family-name:var(--font-heading)] leading-tight">
              Ready for your next move?
            </h2>
            <p className="text-[#5F6368] mt-3 mb-8">Join thousands of professionals and companies already on Upversion.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register" className="bg-[#C1121F] hover:bg-[#9B0D18] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                <Users size={16} /> Create Your Profile
              </Link>
              <Link to="/pricing" className="bg-[#1A1A1A] hover:bg-[#111111] text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
                <Building2 size={16} /> Start Hiring
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
