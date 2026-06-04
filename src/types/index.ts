export type UserRole = 'candidate' | 'recruiter' | 'admin';
export type ListingType = 'job' | 'internship' | 'freelance';
export type WorkMode = 'remote' | 'onsite' | 'hybrid';
export type ListingStatus = 'draft' | 'active' | 'paused' | 'closed' | 'pending';
export type ApplicationStatus = 'new' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
export type ApplicationType = 'apply' | 'proposal';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'any';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  avatarFile?: string;      // ← blob URL for uploaded photo
  createdAt: string;
  isBanned?: boolean;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  headline: string;
  bio: string;
  location: string;
  skills: string[];
  resumeUrl?: string;
  resumeFile?: string;      // ← blob URL
  resumeFileName?: string;  // ← original filename
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  availability: string;
  preferredWorkType: WorkMode[];
  profileCompletion: number;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: string;
  field: string;
}

export interface Company {
  id: string;
  ownerUserId: string;
  companyName: string;
  slug: string;
  logoUrl?: string;
  logoFile?: string;        // ← blob URL
  coverImageUrl?: string;
  coverImageFile?: string;  // ← blob URL
  website?: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  verified: boolean;
  createdAt: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface Listing {
  id: string;
  companyId: string;
  postedBy: string;
  title: string;
  slug: string;
  type: ListingType;
  category: string;
  location: string;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  stipendMin?: number;
  stipendMax?: number;
  budgetMin?: number;
  budgetMax?: number;
  experienceLevel: ExperienceLevel;
  skillsRequired: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  perks: string[];
  deadline: string;
  status: ListingStatus;
  featured: boolean;
  viewCount?: number;
  applicationCount?: number;
  createdAt: string;
}

export interface Application {
  id: string;
  listingId: string;
  candidateUserId: string;
  applicationType: ApplicationType;
  coverLetter?: string;
  proposalText?: string;
  expectedBudget?: number;
  estimatedTimeline?: string;
  resumeUrl?: string;
  resumeFile?: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface SavedListing {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterUserId: string;
  targetType: 'listing' | 'user' | 'company';
  targetId: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface CompanyVerification {
  id: string;
  companyId: string;
  submittedDocsUrl?: string;
  submittedDocsFile?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}