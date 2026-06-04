import { useState } from 'react';
import { Save, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [siteName, setSiteName] = useState('WorkHive');
  const [adminEmail, setAdminEmail] = useState('admin@workly.com');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-1">Settings</h1>
      <p className="text-sm text-[#5F6368] mb-6">Platform configuration</p>

      <div className="space-y-5">
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
          <h2 className="text-sm font-semibold text-[#111111] mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Site Name</label>
              <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Admin Email</label>
              <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-xl text-sm focus:outline-none focus:border-[#111111]" />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#C1121F] hover:bg-[#9B0D18] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}