import { useState } from 'react';
import { X, Upload, FileText, Send, DollarSign, Clock } from 'lucide-react';
import { Listing } from '@/types';
import { useApp } from '@/store/AppContext';
import { useToast } from '@/components/ui/Toast';
import FileUpload from '@/components/ui/FileUpload';

interface Props {
  listing: Listing;
  onClose: () => void;
}

export default function ApplicationModal({ listing, onClose }: Props) {
  const { currentUser, applyToListing, getCandidateProfile } = useApp();
  const { showToast } = useToast();
  const profile = currentUser ? getCandidateProfile(currentUser.id) : null;
  const isFreelance = listing.type === 'freelance';

  const [form, setForm] = useState({
    coverLetter: '',
    proposalText: '',
    expectedBudget: '',
    estimatedTimeline: '',
    portfolioUrl: profile?.portfolioUrl || '',
    resumeFile: profile?.resumeFile || '',
    resumeFileName: profile?.resumeFileName || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!isFreelance && !form.coverLetter.trim()) {
      showToast('error', 'Required', 'Please write a cover letter.');
      return;
    }
    if (isFreelance && !form.proposalText.trim()) {
      showToast('error', 'Required', 'Please write your proposal.');
      return;
    }

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));

    const result = applyToListing({
      listingId: listing.id,
      candidateUserId: currentUser.id,
      applicationType: isFreelance ? 'proposal' : 'apply',
      coverLetter: form.coverLetter || undefined,
      proposalText: form.proposalText || undefined,
      expectedBudget: form.expectedBudget ? Number(form.expectedBudget) : undefined,
      estimatedTimeline: form.estimatedTimeline || undefined,
      resumeFile: form.resumeFile || undefined,
      resumeFileName: form.resumeFileName || undefined,
      portfolioUrl: form.portfolioUrl || undefined,
      status: 'new',
    });

    setSubmitting(false);

    if (result.success) {
      showToast('success', isFreelance ? 'Proposal sent!' : 'Application submitted!', result.message);
      onClose();
    } else {
      showToast('error', 'Failed', result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">{isFreelance ? 'Send Proposal' : 'Apply for Position'}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{listing.title}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {isFreelance ? (
            <>
              {/* Proposal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Proposal <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.proposalText}
                  onChange={e => setForm(p => ({ ...p, proposalText: e.target.value }))}
                  rows={5}
                  placeholder="Describe your approach, experience, and why you're the best fit for this project..."
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C1121F] transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.proposalText.length} / 2000 characters</p>
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <DollarSign size={14} className="inline mr-1" />Expected Budget
                  </label>
                  <input
                    type="number"
                    value={form.expectedBudget}
                    onChange={e => setForm(p => ({ ...p, expectedBudget: e.target.value }))}
                    placeholder="e.g. 5000"
                    className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C1121F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <Clock size={14} className="inline mr-1" />Timeline
                  </label>
                  <input
                    type="text"
                    value={form.estimatedTimeline}
                    onChange={e => setForm(p => ({ ...p, estimatedTimeline: e.target.value }))}
                    placeholder="e.g. 3 weeks"
                    className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C1121F]"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.coverLetter}
                  onChange={e => setForm(p => ({ ...p, coverLetter: e.target.value }))}
                  rows={5}
                  placeholder="Tell them why you're a great fit for this role..."
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C1121F] transition-colors resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">{form.coverLetter.length} / 2000 characters</p>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Resume
                  {profile?.resumeFile && <span className="text-green-600 text-xs ml-2">(profile resume available)</span>}
                </label>
                <FileUpload
                  type="document"
                  label="Upload Resume"
                  hint="PDF or Word document • Max 10MB"
                  maxSizeMB={10}
                  currentFile={form.resumeFile}
                  currentFileName={form.resumeFileName}
                  onFileSelect={(file, base64) => setForm(p => ({ ...p, resumeFile: base64, resumeFileName: file.name }))}
                  onClear={() => setForm(p => ({ ...p, resumeFile: '', resumeFileName: '' }))}
                />
              </div>
            </>
          )}

          {/* Portfolio URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Portfolio / Work Samples URL</label>
            <input
              type="url"
              value={form.portfolioUrl}
              onChange={e => setForm(p => ({ ...p, portfolioUrl: e.target.value }))}
              placeholder="https://yourportfolio.com"
              className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C1121F] transition-colors"
            />
          </div>

          {/* Profile Note */}
          {profile && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
              💡 Your profile information will be included with this application. Make sure it's up to date!
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#E5E7EB] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-[#C1121F] hover:bg-[#9B0D18] text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
              ) : (
                <><Send size={15} /> {isFreelance ? 'Send Proposal' : 'Submit Application'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}