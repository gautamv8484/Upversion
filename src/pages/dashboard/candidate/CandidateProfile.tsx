import { useState, useEffect, useRef } from 'react';
import {
  Plus, X, Save, Upload, Camera, Trash2,
  Briefcase, GraduationCap, Link as LinkIcon,
  CheckCircle, AlertCircle, FileText, Eye
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { ExperienceEntry, EducationEntry } from '@/types';
import { validateFile, formatFileSize } from '@/utils/cn';

export default function CandidateProfile() {
  const {
    currentUser, getCandidateProfile,
    updateProfile, uploadAvatar, uploadResume,
  } = useApp();

  if (!currentUser) return null;
  const profile = getCandidateProfile(currentUser.id);

  // ── Basic Info State ───────────────────────────────────
  const [headline, setHeadline]     = useState(profile?.headline || '');
  const [bio, setBio]               = useState(profile?.bio || '');
  const [location, setLocation]     = useState(profile?.location || '');
  const [availability, setAvail]    = useState(profile?.availability || '');
  const [preferredWork, setPrefWork]= useState<string[]>(profile?.preferredWorkType || []);

  // ── Skills State ──────────────────────────────────────
  const [skills, setSkills]         = useState<string[]>(profile?.skills || []);
  const [newSkill, setNewSkill]     = useState('');

  // ── Links State ───────────────────────────────────────
  const [portfolioUrl, setPortfolio]= useState(profile?.portfolioUrl || '');
  const [linkedinUrl, setLinkedin]  = useState(profile?.linkedinUrl || '');
  const [githubUrl, setGithub]      = useState(profile?.githubUrl || '');
  const [websiteUrl, setWebsite]    = useState(profile?.websiteUrl || '');

  // ── Experience State ──────────────────────────────────
  const [experience, setExperience] = useState<ExperienceEntry[]>(profile?.experience || []);
  const [showExpForm, setShowExpForm]= useState(false);
  const [editingExp, setEditingExp] = useState<ExperienceEntry | null>(null);
  const [expForm, setExpForm]       = useState<Omit<ExperienceEntry, 'id'>>({
    title: '', company: '', startDate: '', endDate: '', current: false, description: '',
  });

  // ── Education State ───────────────────────────────────
  const [education, setEducation]   = useState<EducationEntry[]>(profile?.education || []);
  const [showEduForm, setShowEduForm]= useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationEntry | null>(null);
  const [eduForm, setEduForm]       = useState<Omit<EducationEntry, 'id'>>({
    degree: '', institution: '', year: '', field: '',
  });

  // ── Upload State ──────────────────────────────────────
  const [avatarPreview, setAvatarPreview]   = useState<string>(
    currentUser.avatarFile || currentUser.avatarUrl || ''
  );
  const [resumeInfo, setResumeInfo]         = useState<{
    name: string; size: string; url: string;
  } | null>(
    profile?.resumeFileName
      ? { name: profile.resumeFileName, size: '', url: profile.resumeFile || '' }
      : null
  );
  const [uploadError, setUploadError]       = useState('');
  const [resumeError, setResumeError]       = useState('');

  // ── Refs ──────────────────────────────────────────────
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // ── Save State ────────────────────────────────────────
  const [saved, setSaved]           = useState(false);
  const [activeSection, setActive]  = useState<string>('basic');

  // Sync on profile change
  useEffect(() => {
    if (profile) {
      setHeadline(profile.headline);
      setBio(profile.bio);
      setLocation(profile.location);
      setAvail(profile.availability);
      setPrefWork(profile.preferredWorkType);
      setSkills(profile.skills);
      setPortfolio(profile.portfolioUrl || '');
      setLinkedin(profile.linkedinUrl || '');
      setGithub(profile.githubUrl || '');
      setWebsite(profile.websiteUrl || '');
      setExperience(profile.experience);
      setEducation(profile.education);
      if (profile.resumeFileName) {
        setResumeInfo({
          name: profile.resumeFileName,
          size: '',
          url: profile.resumeFile || '',
        });
      }
    }
  }, []);

  // ── Profile Completion ────────────────────────────────
  const calcCompletion = () => {
    let score = 0;
    if (currentUser.avatarFile || currentUser.avatarUrl) score += 10;
    if (headline)           score += 15;
    if (bio)                score += 10;
    if (location)           score += 5;
    if (skills.length > 2)  score += 15;
    if (portfolioUrl || githubUrl) score += 10;
    if (linkedinUrl)        score += 5;
    if (availability)       score += 5;
    if (experience.length > 0)    score += 15;
    if (education.length > 0)     score += 5;
    if (resumeInfo)         score += 5;
    return Math.min(score, 100);
  };

  // ── Avatar Upload ─────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    const { valid, error } = validateFile(
      file,
      ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      5
    );
    if (!valid) { setUploadError(error || 'Invalid file'); return; }
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
    uploadAvatar(file);
  };

  const removeAvatar = () => {
    setAvatarPreview('');
    uploadAvatar(new File([], ''));
  };

  // ── Resume Upload ─────────────────────────────────────
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeError('');
    const { valid, error } = validateFile(
      file,
      [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      5
    );
    if (!valid) { setResumeError(error || 'Invalid file'); return; }
    setResumeInfo({
      name: file.name,
      size: formatFileSize(file.size),
      url: URL.createObjectURL(file),
    });
    uploadResume(file);
  };

  // ── Skills ────────────────────────────────────────────
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) {
      setSkills(prev => [...prev, s]);
      setNewSkill('');
    }
  };

  const removeSkill = (s: string) =>
    setSkills(prev => prev.filter(sk => sk !== s));

  const toggleWorkType = (mode: string) => {
    setPrefWork(prev =>
      prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
    );
  };

  // ── Experience ────────────────────────────────────────
  const resetExpForm = () => {
    setExpForm({ title: '', company: '', startDate: '', endDate: '', current: false, description: '' });
    setEditingExp(null);
    setShowExpForm(false);
  };

  const saveExperience = () => {
    if (!expForm.title || !expForm.company || !expForm.startDate) return;
    if (editingExp) {
      setExperience(prev =>
        prev.map(e => e.id === editingExp.id ? { ...expForm, id: editingExp.id } : e)
      );
    } else {
      setExperience(prev => [...prev, { ...expForm, id: `e${Date.now()}` }]);
    }
    resetExpForm();
  };

  const editExperience = (e: ExperienceEntry) => {
    setEditingExp(e);
    setExpForm({
      title: e.title, company: e.company,
      startDate: e.startDate, endDate: e.endDate || '',
      current: e.current, description: e.description,
    });
    setShowExpForm(true);
    setActive('experience');
  };

  const deleteExperience = (id: string) =>
    setExperience(prev => prev.filter(e => e.id !== id));

  // ── Education ─────────────────────────────────────────
  const resetEduForm = () => {
    setEduForm({ degree: '', institution: '', year: '', field: '' });
    setEditingEdu(null);
    setShowEduForm(false);
  };

  const saveEducation = () => {
    if (!eduForm.degree || !eduForm.institution) return;
    if (editingEdu) {
      setEducation(prev =>
        prev.map(e => e.id === editingEdu.id ? { ...eduForm, id: editingEdu.id } : e)
      );
    } else {
      setEducation(prev => [...prev, { ...eduForm, id: `ed${Date.now()}` }]);
    }
    resetEduForm();
  };

  const editEducation = (e: EducationEntry) => {
    setEditingEdu(e);
    setEduForm({
      degree: e.degree, institution: e.institution,
      year: e.year, field: e.field,
    });
    setShowEduForm(true);
    setActive('education');
  };

  const deleteEducation = (id: string) =>
    setEducation(prev => prev.filter(e => e.id !== id));

  // ── Save All ──────────────────────────────────────────
  const handleSave = () => {
    updateProfile({
      headline, bio, location, skills,
      portfolioUrl, linkedinUrl, githubUrl, websiteUrl,
      availability,
      preferredWorkType: preferredWork as any,
      experience, education,
      profileCompletion: calcCompletion(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const completion = calcCompletion();

  // ── Sections config ───────────────────────────────────
  const sections = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'links', label: 'Links' },
    { id: 'resume', label: 'Resume' },
  ];

  return (
    <div className="animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
            My Profile
          </h1>
          <p className="text-sm text-[#5F6368] mt-0.5">
            Keep your profile updated to attract better opportunities
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#C1121F] hover:bg-[#9B0D18]
            text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {saved
            ? <><CheckCircle size={16} /> Saved!</>
            : <><Save size={16} /> Save Changes</>
          }
        </button>
      </div>

      {/* Completion Bar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#111111]">Profile Completion</span>
          <span className={`text-sm font-bold ${
            completion >= 80 ? 'text-green-600'
            : completion >= 50 ? 'text-yellow-600'
            : 'text-[#C1121F]'
          }`}>{completion}%</span>
        </div>
        <div className="w-full bg-[#F3F4F6] rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${
              completion >= 80 ? 'bg-green-500'
              : completion >= 50 ? 'bg-yellow-500'
              : 'bg-[#C1121F]'
            }`}
            style={{ width: `${completion}%` }}
          />
        </div>
        {completion < 100 && (
          <p className="text-xs text-[#5F6368] mt-2">
            {completion < 40
              ? 'Add your headline, bio, and skills to get started.'
              : completion < 70
              ? 'Add experience and links to boost your profile.'
              : 'Almost there! Upload a photo and resume to complete.'}
          </p>
        )}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeSection === s.id
                ? 'bg-[#111111] text-white'
                : 'text-[#5F6368] hover:bg-gray-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── BASIC INFO ───────────────────────────────────── */}
      {activeSection === 'basic' && (
        <div className="space-y-5 animate-fade-in">
          {/* Avatar Upload */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#111111]
              font-[family-name:var(--font-heading)] mb-4">
              Profile Photo
            </h2>
            <div className="flex items-center gap-5">
              {/* Avatar Preview */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[#1A1A1A] overflow-hidden
                  flex items-center justify-center border-4 border-[#F3F4F6]">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {/* Camera overlay */}
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-[#C1121F]
                    rounded-full flex items-center justify-center shadow-lg
                    hover:bg-[#9B0D18] transition-colors"
                >
                  <Camera size={14} className="text-white" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB]
                      rounded-lg text-sm font-medium text-[#5F6368]
                      hover:border-[#111111] hover:text-[#111111] transition-colors"
                  >
                    <Upload size={15} /> Upload Photo
                  </button>
                  {avatarPreview && (
                    <button
                      onClick={removeAvatar}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200
                        rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#5F6368] mt-2">
                  JPG, PNG, WebP or GIF · Max 5MB
                </p>
                {uploadError && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {uploadError}
                  </p>
                )}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* Basic Fields */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#111111]
              font-[family-name:var(--font-heading)] mb-4">
              Basic Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                  Professional Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="e.g. Full Stack Developer | React & Node.js"
                  maxLength={120}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                    text-sm focus:outline-none focus:border-[#111111] transition-colors"
                />
                <p className="text-xs text-[#5F6368] mt-1 text-right">
                  {headline.length}/120
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={5}
                  maxLength={1000}
                  placeholder="Tell recruiters about yourself, your experience, and what you're looking for…"
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                    text-sm focus:outline-none focus:border-[#111111] resize-none transition-colors"
                />
                <p className="text-xs text-[#5F6368] mt-1 text-right">
                  {bio.length}/1000
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="City, State / Country"
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                    text-sm focus:outline-none focus:border-[#111111] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                  Availability
                </label>
                <select
                  value={availability}
                  onChange={e => setAvail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                    text-sm focus:outline-none focus:border-[#111111] bg-white transition-colors"
                >
                  <option value="">Select status…</option>
                  <option>Immediate</option>
                  <option>2 weeks notice</option>
                  <option>1 month notice</option>
                  <option>Not actively looking</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[#5F6368] mb-2 block">
                  Preferred Work Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['remote', 'hybrid', 'onsite'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleWorkType(mode)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all capitalize ${
                        preferredWork.includes(mode)
                          ? 'bg-[#111111] text-white border-[#111111]'
                          : 'border-[#E5E7EB] text-[#5F6368] hover:border-[#111111]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SKILLS ───────────────────────────────────────── */}
      {activeSection === 'skills' && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 animate-fade-in">
          <h2 className="text-base font-semibold text-[#111111]
            font-[family-name:var(--font-heading)] mb-1">
            Skills
          </h2>
          <p className="text-xs text-[#5F6368] mb-4">
            Add skills that match the roles you're targeting
          </p>

          {/* Current Skills */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-10">
            {skills.length === 0 ? (
              <p className="text-sm text-[#5F6368] italic">No skills added yet</p>
            ) : (
              skills.map(s => (
                <span
                  key={s}
                  className="flex items-center gap-1.5 text-sm font-medium
                    bg-[#F3F4F6] text-[#111111] px-3 py-1.5 rounded-lg border border-[#E5E7EB]"
                >
                  {s}
                  <button
                    onClick={() => removeSkill(s)}
                    className="text-[#5F6368] hover:text-[#C1121F] transition-colors"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Skill */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Type a skill and press Enter…"
              className="flex-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                text-sm focus:outline-none focus:border-[#111111] transition-colors"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2.5 bg-[#111111] text-white rounded-lg
                text-sm font-medium hover:bg-[#1A1A1A] transition-colors flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </button>
          </div>

          {/* Popular Skills Suggestions */}
          <div className="mt-4">
            <p className="text-xs font-medium text-[#5F6368] mb-2">Popular Skills:</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'React', 'TypeScript', 'Python', 'Node.js', 'Figma',
                'SQL', 'AWS', 'Docker', 'GraphQL', 'Tailwind CSS',
                'Vue.js', 'Go', 'Kubernetes', 'Machine Learning', 'SEO',
              ]
                .filter(s => !skills.includes(s))
                .slice(0, 12)
                .map(s => (
                  <button
                    key={s}
                    onClick={() => setSkills(prev => [...prev, s])}
                    className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600
                      border border-gray-200 rounded-lg hover:border-[#111111]
                      hover:text-[#111111] transition-colors"
                  >
                    + {s}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ── EXPERIENCE ───────────────────────────────────── */}
      {activeSection === 'experience' && (
        <div className="space-y-4 animate-fade-in">
          {/* Existing Entries */}
          {experience.map(exp => (
            <div
              key={exp.id}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center
                    justify-center shrink-0 border border-[#E5E7EB]">
                    <Briefcase size={18} className="text-[#5F6368]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{exp.title}</h3>
                    <p className="text-sm text-[#5F6368]">{exp.company}</p>
                    <p className="text-xs text-[#5F6368] mt-0.5">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-[#5F6368] mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => editExperience(exp)}
                    className="p-1.5 text-[#5F6368] hover:text-[#111111]
                      hover:bg-gray-100 rounded-lg transition-colors text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteExperience(exp.id)}
                    className="p-1.5 text-red-400 hover:text-red-600
                      hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add/Edit Form */}
          {showExpForm ? (
            <div className="bg-white border border-[#111111] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#111111] mb-4">
                {editingExp ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={expForm.title}
                    onChange={e => setExpForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Frontend Developer"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                      text-sm focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={expForm.company}
                    onChange={e => setExpForm(p => ({ ...p, company: e.target.value }))}
                    placeholder="e.g. Google"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                      text-sm focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                    Start Date *
                  </label>
                  <input
                    type="month"
                    value={expForm.startDate}
                    onChange={e => setExpForm(p => ({ ...p, startDate: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                      text-sm focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={expForm.endDate}
                    disabled={expForm.current}
                    onChange={e => setExpForm(p => ({ ...p, endDate: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                      text-sm focus:outline-none focus:border-[#111111]
                      disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={expForm.current}
                      onChange={e => setExpForm(p => ({ ...p, current: e.target.checked, endDate: '' }))}
                      className="rounded border-gray-300 text-[#C1121F]"
                    />
                    <span className="text-xs text-[#5F6368]">Currently working here</span>
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                    Description
                  </label>
                  <textarea
                    value={expForm.description}
                    onChange={e => setExpForm(p => ({ ...p, description: e.target.value }))}
                    rows={3}
                    placeholder="Describe your responsibilities and achievements…"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                      text-sm focus:outline-none focus:border-[#111111] resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={saveExperience}
                  className="flex items-center gap-2 bg-[#111111] text-white
                    px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A1A1A] transition-colors"
                >
                  <Save size={14} /> {editingExp ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={resetExpForm}
                  className="px-4 py-2 border border-[#E5E7EB] rounded-lg
                    text-sm text-[#5F6368] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowExpForm(true)}
              className="w-full flex items-center justify-center gap-2 border-2
                border-dashed border-[#E5E7EB] rounded-xl p-5 text-sm font-medium
                text-[#5F6368] hover:border-[#111111] hover:text-[#111111] transition-all"
            >
              <Plus size={18} /> Add Experience
            </button>
          )}
        </div>
      )}

      {/* ── EDUCATION ────────────────────────────────────── */}
      {activeSection === 'education' && (
        <div className="space-y-4 animate-fade-in">
          {education.map(edu => (
            <div
              key={edu.id}
              className="bg-white border border-[#E5E7EB] rounded-xl p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center
                    justify-center shrink-0 border border-[#E5E7EB]">
                    <GraduationCap size={18} className="text-[#5F6368]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111111]">{edu.degree}</h3>
                    <p className="text-sm text-[#5F6368]">{edu.institution}</p>
                    <p className="text-xs text-[#5F6368] mt-0.5">
                      {edu.field} · {edu.year}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => editEducation(edu)}
                    className="p-1.5 text-[#5F6368] hover:text-[#111111]
                      hover:bg-gray-100 rounded-lg transition-colors text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEducation(edu.id)}
                    className="p-1.5 text-red-400 hover:text-red-600
                      hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {showEduForm ? (
            <div className="bg-white border border-[#111111] rounded-xl p-5">
              <h3 className="text-sm font-semibold text-[#111111] mb-4">
                {editingEdu ? 'Edit Education' : 'Add Education'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                    Degree / Certificate *
                  </label>
                  <input
                    type="text"
                    value={eduForm.degree}
                    onChange={e => setEduForm(p => ({ ...p, degree: e.target.value }))}
                    placeholder="e.g. B.S. Computer Science"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                      text-sm focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={eduForm.institution}
                    onChange={e => setEduForm(p => ({ ...p, institution: e.target.value }))}
                    placeholder="e.g. MIT"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                      text-sm focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={eduForm.field}
                    onChange={e => setEduForm(p => ({ ...p, field: e.target.value }))}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                      text-sm focus:outline-none focus:border-[#111111]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    value={eduForm.year}
                    onChange={e => setEduForm(p => ({ ...p, year: e.target.value }))}
                    placeholder="e.g. 2023"
                    min="1950"
                    max="2030"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg
                      text-sm focus:outline-none focus:border-[#111111]"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={saveEducation}
                  className="flex items-center gap-2 bg-[#111111] text-white
                    px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1A1A1A] transition-colors"
                >
                  <Save size={14} /> {editingEdu ? 'Update' : 'Save'}
                </button>
                <button
                  onClick={resetEduForm}
                  className="px-4 py-2 border border-[#E5E7EB] rounded-lg
                    text-sm text-[#5F6368] hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowEduForm(true)}
              className="w-full flex items-center justify-center gap-2 border-2
                border-dashed border-[#E5E7EB] rounded-xl p-5 text-sm font-medium
                text-[#5F6368] hover:border-[#111111] hover:text-[#111111] transition-all"
            >
              <Plus size={18} /> Add Education
            </button>
          )}
        </div>
      )}

      {/* ── LINKS ─────────────────────────────────────────── */}
      {activeSection === 'links' && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 animate-fade-in">
          <h2 className="text-base font-semibold text-[#111111]
            font-[family-name:var(--font-heading)] mb-1">
            Links & Portfolio
          </h2>
          <p className="text-xs text-[#5F6368] mb-5">
            Share your work and professional profiles
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                label: 'Portfolio URL', value: portfolioUrl,
                set: setPortfolio, placeholder: 'https://yourportfolio.com',
              },
              {
                label: 'LinkedIn', value: linkedinUrl,
                set: setLinkedin, placeholder: 'https://linkedin.com/in/yourname',
              },
              {
                label: 'GitHub', value: githubUrl,
                set: setGithub, placeholder: 'https://github.com/yourname',
              },
              {
                label: 'Personal Website', value: websiteUrl,
                set: setWebsite, placeholder: 'https://yourwebsite.com',
              },
            ].map(field => (
              <div key={field.label}>
                <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                  {field.label}
                </label>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2
                    -translate-y-1/2 text-[#5F6368]" />
                  <input
                    type="url"
                    value={field.value}
                    onChange={e => field.set(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full pl-8 pr-3 py-2.5 border border-[#E5E7EB]
                      rounded-lg text-sm focus:outline-none focus:border-[#111111]
                      transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RESUME ────────────────────────────────────────── */}
      {activeSection === 'resume' && (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 animate-fade-in">
          <h2 className="text-base font-semibold text-[#111111]
            font-[family-name:var(--font-heading)] mb-1">
            Resume / CV
          </h2>
          <p className="text-xs text-[#5F6368] mb-5">
            Upload your resume to auto-fill applications
          </p>

          {/* Current Resume */}
          {resumeInfo && (
            <div className="flex items-center justify-between bg-green-50
              border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center
                  justify-center">
                  <FileText size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">{resumeInfo.name}</p>
                  {resumeInfo.size && (
                    <p className="text-xs text-green-600">{resumeInfo.size}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {resumeInfo.url && (
                  <a
                    href={resumeInfo.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium
                      text-green-700 hover:text-green-900 px-3 py-1.5 rounded-lg
                      border border-green-200 hover:bg-green-100 transition-colors"
                  >
                    <Eye size={13} /> View
                  </a>
                )}
                <button
                  onClick={() => {
                    setResumeInfo(null);
                    updateProfile({ resumeFile: undefined, resumeFileName: undefined });
                  }}
                  className="flex items-center gap-1.5 text-xs font-medium
                    text-red-600 hover:text-red-800 px-3 py-1.5 rounded-lg
                    border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          )}

          {/* Upload Zone */}
          <div
            onClick={() => resumeInputRef.current?.click()}
            className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-10
              text-center cursor-pointer hover:border-[#111111] hover:bg-gray-50
              transition-all group"
          >
            <div className="w-14 h-14 bg-[#F3F4F6] rounded-xl flex items-center
              justify-center mx-auto mb-3 group-hover:bg-[#E5E7EB] transition-colors">
              <Upload size={24} className="text-[#5F6368]" />
            </div>
            <p className="text-sm font-medium text-[#111111] mb-1">
              {resumeInfo ? 'Replace Resume' : 'Upload Resume'}
            </p>
            <p className="text-xs text-[#5F6368]">
              Drag & drop or click to browse
            </p>
            <p className="text-xs text-[#5F6368] mt-1">
              PDF, DOC, DOCX · Max 5MB
            </p>
          </div>

          {resumeError && (
            <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle size={12} /> {resumeError}
            </p>
          )}

          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,
              application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleResumeChange}
            className="hidden"
          />
        </div>
      )}

      {/* Bottom Save */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#C1121F] hover:bg-[#9B0D18]
            text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {saved
            ? <><CheckCircle size={16} /> Changes Saved!</>
            : <><Save size={16} /> Save All Changes</>
          }
        </button>
      </div>
    </div>
  );
}