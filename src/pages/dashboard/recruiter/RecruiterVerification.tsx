import { useApp } from '@/store/AppContext';
import { ShieldCheck, Clock, CheckCircle } from 'lucide-react';

export default function RecruiterVerification() {
  const { currentUser, getCompanyByOwner } = useApp();
  if (!currentUser) return null;
  const company = getCompanyByOwner(currentUser.id);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-6">Verification Status</h1>

      {!company ? (
        <div className="text-center py-16 bg-[#F7F7F8] rounded-lg">
          <ShieldCheck size={32} className="text-[#5F6368] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#111111]">No company profile</h3>
          <p className="text-sm text-[#5F6368] mt-1">Create a company profile to begin verification</p>
        </div>
      ) : company.verified ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle size={40} className="text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-green-700 font-[family-name:var(--font-heading)]">Verified</h2>
          <p className="text-sm text-green-600 mt-2">Your company has been verified. A verification badge is visible on your profile and listings.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
            <Clock size={40} className="text-amber-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-amber-700 font-[family-name:var(--font-heading)]">Pending Verification</h2>
            <p className="text-sm text-amber-600 mt-2">Your company profile is under review. This usually takes 1–3 business days.</p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-lg p-6">
            <h3 className="text-base font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">Upload Verification Documents</h3>
            <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-8 text-center">
              <p className="text-sm text-[#5F6368] mb-2">Upload business registration, tax ID, or other documents</p>
              <button className="text-sm font-medium text-[#C1121F] hover:text-[#9B0D18]">Choose Files</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
