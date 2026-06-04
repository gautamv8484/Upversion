import { Link } from 'react-router-dom';
import { X, User, FileText, Briefcase, GraduationCap, Link as LinkIcon, Upload, AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';
import { useApp } from '@/store/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileCompleteModal({ isOpen, onClose }: Props) {
  const { currentUser, getCandidateProfile, getProfileCompletion } = useApp();

  if (!isOpen || !currentUser) return null;

  const profile = getCandidateProfile(currentUser.id);
  const completion = getProfileCompletion(currentUser.id);

  const hasAvatar = !!(currentUser.avatarFile || currentUser.avatarUrl);
  const hasHeadline = !!(profile?.headline && profile.headline.length > 5);
  const hasBio = !!(profile?.bio && profile.bio.length > 20);
  const hasLocation = !!profile?.location;
  const hasSkills = (profile?.skills?.length || 0) >= 3;
  const hasLinks = !!(profile?.portfolioUrl || profile?.githubUrl);
  const hasLinkedin = !!profile?.linkedinUrl;
  const hasAvailability = !!profile?.availability;
  const hasExperience = (profile?.experience?.length || 0) > 0;
  const hasEducation = (profile?.education?.length || 0) > 0;
  const hasResume = !!(profile?.resumeFile || profile?.resumeUrl);

  const checklist = [
    { label: 'Upload profile photo', done: hasAvatar, icon: User, points: 10 },
    { label: 'Add professional headline', done: hasHeadline, icon: User, points: 15 },
    { label: 'Write a bio (20+ chars)', done: hasBio, icon: FileText, points: 10 },
    { label: 'Set your location', done: hasLocation, icon: User, points: 5 },
    { label: 'Add at least 3 skills', done: hasSkills, icon: User, points: 15 },
    { label: 'Add portfolio or GitHub link', done: hasLinks, icon: LinkIcon, points: 10 },
    { label: 'Add LinkedIn profile', done: hasLinkedin, icon: LinkIcon, points: 5 },
    { label: 'Set availability status', done: hasAvailability, icon: User, points: 5 },
    { label: 'Add work experience', done: hasExperience, icon: Briefcase, points: 15 },
    { label: 'Add education', done: hasEducation, icon: GraduationCap, points: 5 },
    { label: 'Upload resume', done: hasResume, icon: Upload, points: 5 },
  ];

  const remaining = checklist.filter(c => !c.done);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle size={20} className="text-[#C1121F]" />
                <h2 className="text-lg font-bold text-[#111111] font-[family-name:var(--font-heading)]">
                  Complete Your Profile
                </h2>
              </div>
              <p className="text-sm text-[#5F6368]">
                You need 100% profile completion to apply for jobs.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-[#5F6368]">Profile Progress</span>
              <span className={
                'text-sm font-bold ' +
                (completion >= 100 ? 'text-green-600' : completion >= 70 ? 'text-yellow-600' : 'text-[#C1121F]')
              }>
                {completion}%
              </span>
            </div>
            <div className="w-full bg-[#F3F4F6] rounded-full h-3">
              <div
                className={
                  'h-3 rounded-full transition-all duration-500 ' +
                  (completion >= 100 ? 'bg-green-500' : completion >= 70 ? 'bg-yellow-500' : 'bg-[#C1121F]')
                }
                style={{ width: completion + '%' }}
              />
            </div>
            <p className="text-xs text-[#5F6368] mt-1.5">
              {remaining.length === 0
                ? '✅ Your profile is complete! You can now apply.'
                : remaining.length + ' item' + (remaining.length !== 1 ? 's' : '') + ' remaining'
              }
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="space-y-1">
            {checklist.map((item, i) => (
              <div
                key={i}
                className={
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ' +
                  (item.done ? 'bg-green-50' : 'bg-red-50/50 hover:bg-red-50')
                }
              >
                <div className={
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 ' +
                  (item.done ? 'bg-green-500' : 'bg-gray-200')
                }>
                  {item.done ? (
                    <CheckCircle size={14} className="text-white" />
                  ) : (
                    <span className="text-[10px] font-bold text-gray-500">{item.points}</span>
                  )}
                </div>
                <span className={
                  'text-sm flex-1 ' +
                  (item.done ? 'text-green-700 line-through opacity-70' : 'text-[#111111] font-medium')
                }>
                  {item.label}
                </span>
                {!item.done && (
                  <span className="text-[10px] text-[#C1121F] font-semibold">+{item.points}%</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] shrink-0">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl text-sm font-medium text-[#5F6368] hover:border-[#111111] hover:text-[#111111] transition-colors"
            >
              Close
            </button>
            <Link
              to="/dashboard/candidate/profile"
              onClick={onClose}
              className="flex-1 py-2.5 bg-[#C1121F] hover:bg-[#9B0D18] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Complete Profile <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}