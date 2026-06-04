import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { ListingType, WorkMode, ExperienceLevel, ListingStatus } from '@/types';
import { useApp } from '@/store/AppContext';
import { categories } from '@/data/mock';

export default function RecruiterPostListing() {
  const { currentUser, getCompanyByOwner, createListing } = useApp();
  const navigate = useNavigate();
  if (!currentUser) return null;

  const company = getCompanyByOwner(currentUser.id);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ListingType>('job');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [workMode, setWorkMode] = useState<WorkMode>('remote');
  const [expLevel, setExpLevel] = useState<ExperienceLevel>('mid');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [perks, setPerks] = useState('');
  const [deadline, setDeadline] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  if (!company) {
    return (
      <div className="animate-fade-in text-center py-16">
        <h2 className="text-xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">Set up your company first</h2>
        <p className="text-sm text-[#5F6368] mt-2 mb-4">You need a company profile before posting listings</p>
        <button onClick={() => navigate('/dashboard/recruiter/company')} className="bg-[#C1121F] text-white px-4 py-2 rounded-lg text-sm font-medium">
          Create Company Profile
        </button>
      </div>
    );
  }

  const handleSubmit = (status: ListingStatus) => {
    const lines = (s: string) => s.split('\n').filter(l => l.trim());
    createListing({
      companyId: company.id, postedBy: currentUser.id, title, type, category, location, workMode,
      experienceLevel: expLevel,
      salaryMin: type === 'job' ? Number(salaryMin) || undefined : undefined,
      salaryMax: type === 'job' ? Number(salaryMax) || undefined : undefined,
      stipendMin: type === 'internship' ? Number(salaryMin) || undefined : undefined,
      stipendMax: type === 'internship' ? Number(salaryMax) || undefined : undefined,
      budgetMin: type === 'freelance' ? Number(salaryMin) || undefined : undefined,
      budgetMax: type === 'freelance' ? Number(salaryMax) || undefined : undefined,
      skillsRequired: skills, description,
      responsibilities: lines(responsibilities),
      requirements: lines(requirements),
      perks: lines(perks),
      deadline, status, featured: false,
    });
    navigate('/dashboard/recruiter/listings');
  };

  const compLabel = type === 'job' ? 'Salary' : type === 'internship' ? 'Stipend' : 'Budget';

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-6">Post New Listing</h1>

      <div className="space-y-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Listing Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['job', 'internship', 'freelance'] as ListingType[]).map(t => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={`py-2 rounded-lg text-sm font-medium border transition-colors capitalize ${type === t ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-[#5F6368] border-[#E5E7EB] hover:border-[#111111]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:border-[#111111]">
                <option value="">Select…</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State or Remote"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Work Mode</label>
              <select value={workMode} onChange={e => setWorkMode(e.target.value as WorkMode)} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:border-[#111111]">
                <option value="remote">Remote</option><option value="onsite">Onsite</option><option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Experience Level</label>
              <select value={expLevel} onChange={e => setExpLevel(e.target.value as ExperienceLevel)} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:border-[#111111]">
                <option value="entry">Entry</option><option value="mid">Mid</option><option value="senior">Senior</option><option value="lead">Lead</option><option value="any">Any</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">{compLabel} Min ($)</label>
              <input type="number" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} placeholder="e.g. 100000"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">{compLabel} Max ($)</label>
              <input type="number" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} placeholder="e.g. 150000"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Application Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">Skills Required</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map(s => (
              <span key={s} className="flex items-center gap-1 text-xs font-medium bg-[#F3F4F6] text-[#111111] px-2.5 py-1 rounded-md border border-[#E5E7EB]">
                {s} <button onClick={() => setSkills(skills.filter(sk => sk !== s))} className="text-[#5F6368] hover:text-[#C1121F]"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill…" className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            <button type="button" onClick={addSkill} className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#5F6368] hover:border-[#111111]"><Plus size={16} /></button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Describe the role…"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Responsibilities (one per line)</label>
              <textarea value={responsibilities} onChange={e => setResponsibilities(e.target.value)} rows={4} placeholder="One responsibility per line"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Requirements (one per line)</label>
              <textarea value={requirements} onChange={e => setRequirements(e.target.value)} rows={4} placeholder="One requirement per line"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Perks & Benefits (one per line)</label>
              <textarea value={perks} onChange={e => setPerks(e.target.value)} rows={3} placeholder="One perk per line"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] resize-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pb-8">
          <button onClick={() => handleSubmit('active')} className="bg-[#C1121F] hover:bg-[#9B0D18] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Publish Listing
          </button>
          <button onClick={() => handleSubmit('draft')} className="bg-white border border-[#E5E7EB] hover:border-[#111111] text-[#5F6368] px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Save as Draft
          </button>
        </div>
      </div>
    </div>
  );
}
