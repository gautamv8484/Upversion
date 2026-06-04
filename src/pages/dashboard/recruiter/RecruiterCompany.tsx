import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export default function RecruiterCompany() {
  const { currentUser, getCompanyByOwner, createCompany, updateCompany } = useApp();
  if (!currentUser) return null;

  const company = getCompanyByOwner(currentUser.id);
  const [companyName, setCompanyName] = useState(company?.companyName || '');
  const [description, setDescription] = useState(company?.description || '');
  const [website, setWebsite] = useState(company?.website || '');
  const [industry, setIndustry] = useState(company?.industry || '');
  const [size, setSize] = useState(company?.size || '');
  const [location, setLocation] = useState(company?.location || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (company) {
      updateCompany(company.id, { companyName, description, website, industry, size, location, slug });
    } else {
      createCompany({ ownerUserId: currentUser.id, companyName, slug, description, website, industry, size, location, verified: false });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">Company Profile</h1>
        <button onClick={handleSave} className="flex items-center gap-2 bg-[#C1121F] hover:bg-[#9B0D18] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Save size={16} /> {saved ? 'Saved!' : 'Save'}
        </button>
      </div>

      {company?.verified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-600" />
          <p className="text-sm font-medium text-green-700">Your company is verified</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">Company Logo</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-xl flex items-center justify-center border border-[#E5E7EB]">
              <span className="text-2xl font-bold text-[#1A1A1A]">{companyName.charAt(0) || '?'}</span>
            </div>
            <button className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm text-[#5F6368] hover:border-[#111111]">Upload Logo</button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">Company Details</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Company Name</label>
              <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your Company"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="What does your company do?"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Website</label>
              <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://…"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Industry</label>
              <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Fintech"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Company Size</label>
              <select value={size} onChange={e => setSize(e.target.value)} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:border-[#111111]">
                <option value="">Select…</option>
                <option>1-10</option><option>11-50</option><option>50-200</option><option>200-500</option><option>500-1000</option><option>1000-5000</option><option>5000+</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Location</label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
