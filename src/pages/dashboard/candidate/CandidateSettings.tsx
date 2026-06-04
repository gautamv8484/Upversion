import { useApp } from '@/store/AppContext';

export default function CandidateSettings() {
  const { currentUser } = useApp();
  if (!currentUser) return null;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-6">Account Settings</h1>
      <div className="space-y-6">
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">Account Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Name</label>
              <input type="text" defaultValue={currentUser.name} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Email</label>
              <input type="email" defaultValue={currentUser.email} className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
          <h2 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">Change Password</h2>
          <div className="space-y-4 max-w-sm">
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Current Password</label>
              <input type="password" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">New Password</label>
              <input type="password" className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111]" />
            </div>
            <button className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#111111]">Update Password</button>
          </div>
        </div>
        <div className="bg-white border border-red-200 rounded-lg p-6">
          <h2 className="text-base font-semibold text-red-600 font-[family-name:var(--font-heading)] mb-2">Danger Zone</h2>
          <p className="text-sm text-[#5F6368] mb-4">Permanently delete your account and all associated data.</p>
          <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 border border-red-200">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
