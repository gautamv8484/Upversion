import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  CandidateProfile,
  Company,
  Listing,
  Application,
  SavedListing,
  Notification,
  ApplicationStatus,
  ListingStatus,
  CompanyVerification,
  Report,
} from "@/types";
import {
  mockUsers,
  mockCandidateProfiles,
  mockCompanies,
  mockListings,
  mockApplications,
  mockSavedListings,
  mockNotifications,
  mockVerifications,
  mockReports,
} from "@/data/mock";


interface AppState {
  // State
  currentUser: User | null;
  users: User[];
  candidateProfiles: CandidateProfile[];
  companies: Company[];
  listings: Listing[];
  applications: Application[];
  savedListings: SavedListing[];
  notifications: Notification[];
  verifications: CompanyVerification[];
  reports: Report[];

  // Auth
  login: (email: string, password: string) => { success: boolean; message: string };
register: (name: string, email: string, role: 'candidate' | 'recruiter') => { success: boolean; message: string };

  logout: () => void;

  // User
  updateCurrentUser: (data: Partial<User>) => void;
  uploadAvatar: (file: File) => void;
  isProfileComplete: (userId: string) => boolean;
  getProfileCompletion: (userId: string) => number; 

  // Profile
  updateProfile: (profile: Partial<CandidateProfile>) => void;
  uploadResume: (file: File) => void;

  // Company
  createCompany: (company: Omit<Company, "id" | "createdAt">) => Company;
  updateCompany: (id: string, data: Partial<Company>) => void;
  uploadCompanyLogo: (companyId: string, file: File) => void;
  uploadCompanyCover: (companyId: string, file: File) => void;

  // Listings
  createListing: (
    listing: Omit<Listing, "id" | "createdAt" | "slug">,
  ) => Listing;
  updateListing: (id: string, data: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  incrementViewCount: (listingId: string) => void;

  // Applications
  applyToListing: (
    application: Omit<Application, "id" | "createdAt">,
  ) => boolean;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
  hasApplied: (listingId: string) => boolean;

  // Saved
  toggleSaveListing: (listingId: string) => void;
  isListingSaved: (listingId: string) => boolean;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  addNotification: (notif: Omit<Notification, "id" | "createdAt">) => void;
  getUnreadNotificationCount: (userId: string) => number;

  // Listings Status
  updateListingStatus: (listingId: string, status: ListingStatus) => void;

  // Verifications
  submitVerification: (companyId: string, docsFile?: File) => void;
  updateVerification: (
    id: string,
    status: "approved" | "rejected",
    notes?: string,
  ) => void;

  // Reports
  submitReport: (report: Omit<Report, "id" | "createdAt" | "status">) => void;
  resolveReport: (id: string) => void;

  // Admin
  verifyCompany: (companyId: string) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // Getters
  getCompanyById: (id: string) => Company | undefined;
  getListingById: (id: string) => Listing | undefined;
  getUserById: (id: string) => User | undefined;
  getCandidateProfile: (userId: string) => CandidateProfile | undefined;
  getCompanyByOwner: (userId: string) => Company | undefined;
  getApplicationsForListing: (listingId: string) => Application[];
  getApplicationsForCandidate: (userId: string) => Application[];
  getListingsForCompany: (companyId: string) => Listing[];
  getSavedListingsForUser: (userId: string) => Listing[];
  getNotificationsForUser: (userId: string) => Notification[];
  getVerificationForCompany: (
    companyId: string,
  ) => CompanyVerification | undefined;
  getUnreadMessageCount: (userId: string) => number;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [candidateProfiles, setCandidateProfiles] = useState<
    CandidateProfile[]
  >(mockCandidateProfiles);
  const [companies, setCompanies] = useState<Company[]>(mockCompanies);
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [applications, setApplications] =
    useState<Application[]>(mockApplications);
  const [savedListings, setSavedListings] =
    useState<SavedListing[]>(mockSavedListings);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [verifications, setVerifications] =
    useState<CompanyVerification[]>(mockVerifications);
  const [reports, setReports] = useState<Report[]>(mockReports);

  // ── AUTH ──────────────────────────────────────────────
  const login = useCallback(
    (
      email: string,
      _password: string,
    ): { success: boolean; message: string } => {
      const user = users.find((u) => u.email === email);

      if (!user) {
        return {
          success: false,
          message: "No account found with this email address.",
        };
      }
      if (user.isBanned) {
        return {
          success: false,
          message: "Your account has been suspended. Contact support.",
        };
      }

      setCurrentUser(user);
      return { success: true, message: "Logged in successfully" };
    },
    [users],
  );
  const getProfileCompletion = useCallback((userId: string): number => {
  const profile = candidateProfiles.find(p => p.userId === userId);
  const user = users.find(u => u.id === userId);
  if (!profile) return 0;

  let score = 0;
  if (user?.avatarFile || user?.avatarUrl) score += 10;
  if (profile.headline && profile.headline.length > 5) score += 15;
  if (profile.bio && profile.bio.length > 20) score += 10;
  if (profile.location) score += 5;
  if (profile.skills.length >= 3) score += 15;
  if (profile.portfolioUrl || profile.githubUrl) score += 10;
  if (profile.linkedinUrl) score += 5;
  if (profile.availability) score += 5;
  if (profile.experience.length > 0) score += 15;
  if (profile.education.length > 0) score += 5;
  if (profile.resumeFile || profile.resumeUrl) score += 5;
  return Math.min(score, 100);
}, [candidateProfiles, users]);

const isProfileComplete = useCallback((userId: string): boolean => {
  return getProfileCompletion(userId) >= 100;
}, [getProfileCompletion]);

  const register = useCallback(
    (
      name: string,
      email: string,
      role: "candidate" | "recruiter",
    ): { success: boolean; message: string } => {
      if (users.find((u) => u.email === email)) {
        return {
          success: false,
          message: "An account with this email already exists.",
        };
      }
      const newUser: User = {
        id: `u${Date.now()}`,
        name,
        email,
        role,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [...prev, newUser]);
      if (role === "candidate") {
        setCandidateProfiles((prev) => [
          ...prev,
          {
            id: `cp${Date.now()}`,
            userId: newUser.id,
            headline: "",
            bio: "",
            location: "",
            skills: [],
            experience: [],
            education: [],
            availability: "",
            preferredWorkType: [],
            profileCompletion: 10,
          },
        ]);
      }
      setCurrentUser(newUser);
      return { success: true, message: "Account created successfully!" };
    },
    [users],
  );

  const logout = useCallback(() => setCurrentUser(null), []);

  // ── USER ─────────────────────────────────────────────
  const updateCurrentUser = useCallback(
    (data: Partial<User>) => {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : prev));
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser?.id ? { ...u, ...data } : u)),
      );
    },
    [currentUser],
  );

  const uploadAvatar = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      updateCurrentUser({ avatarFile: url });
    },
    [updateCurrentUser],
  );

  // ── PROFILE ───────────────────────────────────────────
  const updateProfile = useCallback(
    (profile: Partial<CandidateProfile>) => {
      if (!currentUser) return;
      setCandidateProfiles((prev) => {
        const existing = prev.find((p) => p.userId === currentUser.id);
        if (existing) {
          return prev.map((p) =>
            p.userId === currentUser.id ? { ...p, ...profile } : p,
          );
        }
        return [
          ...prev,
          {
            id: `cp${Date.now()}`,
            userId: currentUser.id,
            headline: "",
            bio: "",
            location: "",
            skills: [],
            experience: [],
            education: [],
            availability: "",
            preferredWorkType: [],
            profileCompletion: 10,
            ...profile,
          } as CandidateProfile,
        ];
      });
    },
    [currentUser],
  );

  const uploadResume = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      updateProfile({
        resumeFile: url,
        resumeFileName: file.name,
      });
    },
    [updateProfile],
  );

  // ── COMPANY ───────────────────────────────────────────
  const createCompany = useCallback(
    (company: Omit<Company, "id" | "createdAt">): Company => {
      const newCompany: Company = {
        ...company,
        id: `c${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCompanies((prev) => [...prev, newCompany]);
      return newCompany;
    },
    [],
  );

  const updateCompany = useCallback((id: string, data: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
    );
  }, []);

  const uploadCompanyLogo = useCallback(
    (companyId: string, file: File) => {
      const url = URL.createObjectURL(file);
      updateCompany(companyId, { logoFile: url });
    },
    [updateCompany],
  );

  const uploadCompanyCover = useCallback(
    (companyId: string, file: File) => {
      const url = URL.createObjectURL(file);
      updateCompany(companyId, { coverImageFile: url });
    },
    [updateCompany],
  );

  // ── LISTINGS ─────────────────────────────────────────
  const createListing = useCallback(
    (listing: Omit<Listing, "id" | "createdAt" | "slug">): Listing => {
      const slug = `${listing.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}-${Date.now()}`;
      const newListing: Listing = {
        ...listing,
        id: `l${Date.now()}`,
        slug,
        createdAt: new Date().toISOString().split("T")[0],
        viewCount: 0,
        applicationCount: 0,
      };
      setListings((prev) => [...prev, newListing]);
      return newListing;
    },
    [],
  );

  const updateListing = useCallback((id: string, data: Partial<Listing>) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...data } : l)),
    );
  }, []);

  const deleteListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateListingStatus = useCallback(
    (listingId: string, status: ListingStatus) => {
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? { ...l, status } : l)),
      );
    },
    [],
  );

  const incrementViewCount = useCallback((listingId: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId ? { ...l, viewCount: (l.viewCount || 0) + 1 } : l,
      ),
    );
  }, []);

  // ── APPLICATIONS ─────────────────────────────────────
  const hasApplied = useCallback(
    (listingId: string): boolean => {
      if (!currentUser) return false;
      return applications.some(
        (a) =>
          a.listingId === listingId && a.candidateUserId === currentUser.id,
      );
    },
    [currentUser, applications],
  );

  const applyToListing = useCallback(
    (application: Omit<Application, "id" | "createdAt">): boolean => {
      if (hasApplied(application.listingId)) return false;
      const newApp: Application = {
        ...application,
        id: `a${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setApplications((prev) => [...prev, newApp]);
      // Increment application count
      setListings((prev) =>
        prev.map((l) =>
          l.id === application.listingId
            ? { ...l, applicationCount: (l.applicationCount || 0) + 1 }
            : l,
        ),
      );
      // Notify candidate
      setNotifications((prev) => [
        ...prev,
        {
          id: `n${Date.now()}`,
          userId: application.candidateUserId,
          title:
            application.applicationType === "apply"
              ? "Application Submitted ✓"
              : "Proposal Sent ✓",
          body: `Your ${application.applicationType === "apply" ? "application" : "proposal"} has been submitted successfully.`,
          isRead: false,
          link:
            application.applicationType === "apply"
              ? "/dashboard/candidate/applications"
              : "/dashboard/candidate/proposals",
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      return true;
    },
    [hasApplied],
  );

  const updateApplicationStatus = useCallback(
    (appId: string, status: ApplicationStatus) => {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id !== appId) return a;
          // Notify candidate
          const messages: Record<ApplicationStatus, string> = {
            reviewed: "Your application has been reviewed.",
            shortlisted: "🎉 Congratulations! You have been shortlisted.",
            rejected: "Your application was not selected this time.",
            hired: "🎊 You have been hired! Congratulations!",
            new: "Application status updated.",
          };
          setNotifications((prev2) => [
            ...prev2,
            {
              id: `n${Date.now()}`,
              userId: a.candidateUserId,
              title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
              body: messages[status],
              isRead: false,
              link: "/dashboard/candidate/applications",
              createdAt: new Date().toISOString().split("T")[0],
            },
          ]);
          return { ...a, status };
        }),
      );
    },
    [],
  );

  // ── SAVED ─────────────────────────────────────────────
  const toggleSaveListing = useCallback(
    (listingId: string) => {
      if (!currentUser) return;
      setSavedListings((prev) => {
        const exists = prev.find(
          (s) => s.userId === currentUser.id && s.listingId === listingId,
        );
        if (exists) {
          return prev.filter(
            (s) => !(s.userId === currentUser.id && s.listingId === listingId),
          );
        }
        return [
          ...prev,
          {
            id: `s${Date.now()}`,
            userId: currentUser.id,
            listingId,
            createdAt: new Date().toISOString().split("T")[0],
          },
        ];
      });
    },
    [currentUser],
  );

  const isListingSaved = useCallback(
    (listingId: string): boolean => {
      if (!currentUser) return false;
      return savedListings.some(
        (s) => s.userId === currentUser.id && s.listingId === listingId,
      );
    },
    [currentUser, savedListings],
  );

  // ── NOTIFICATIONS ─────────────────────────────────────
  const addNotification = useCallback(
    (notif: Omit<Notification, "id" | "createdAt">) => {
      setNotifications((prev) => [
        ...prev,
        {
          ...notif,
          id: `n${Date.now()}`,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    },
    [],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const markAllNotificationsRead = useCallback((userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, isRead: true } : n)),
    );
  }, []);

  const getUnreadNotificationCount = useCallback(
    (userId: string): number => {
      return notifications.filter((n) => n.userId === userId && !n.isRead)
        .length;
    },
    [notifications],
  );

  // ── VERIFICATIONS ─────────────────────────────────────
  const submitVerification = useCallback(
    (companyId: string, docsFile?: File) => {
      const url = docsFile ? URL.createObjectURL(docsFile) : undefined;
      setVerifications((prev) => {
        const existing = prev.find((v) => v.companyId === companyId);
        if (existing) {
          return prev.map((v) =>
            v.companyId === companyId
              ? { ...v, status: "pending", submittedDocsFile: url }
              : v,
          );
        }
        return [
          ...prev,
          {
            id: `v${Date.now()}`,
            companyId,
            submittedDocsFile: url,
            status: "pending",
          },
        ];
      });
    },
    [],
  );

  const updateVerification = useCallback(
    (id: string, status: "approved" | "rejected", notes?: string) => {
      setVerifications((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status,
                notes,
                reviewedBy: currentUser?.id,
                reviewedAt: new Date().toISOString(),
              }
            : v,
        ),
      );
      if (status === "approved") {
        const verif = verifications.find((v) => v.id === id);
        if (verif) {
          setCompanies((prev) =>
            prev.map((c) =>
              c.id === verif.companyId ? { ...c, verified: true } : c,
            ),
          );
        }
      }
    },
    [currentUser, verifications],
  );

  // ── REPORTS ───────────────────────────────────────────
  const submitReport = useCallback(
    (report: Omit<Report, "id" | "createdAt" | "status">) => {
      setReports((prev) => [
        ...prev,
        {
          ...report,
          id: `r${Date.now()}`,
          status: "pending",
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    },
    [],
  );

  const resolveReport = useCallback((id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)),
    );
  }, []);

  // ── ADMIN ─────────────────────────────────────────────
  const verifyCompany = useCallback((companyId: string) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, verified: true } : c)),
    );
  }, []);

  const banUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: true } : u)),
    );
  }, []);

  const unbanUser = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: false } : u)),
    );
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  // ── GETTERS ───────────────────────────────────────────
  const getCompanyById = useCallback(
    (id: string) => companies.find((c) => c.id === id),
    [companies],
  );
  const getListingById = useCallback(
    (id: string) => listings.find((l) => l.id === id),
    [listings],
  );
  const getUserById = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users],
  );
  const getCandidateProfile = useCallback(
    (userId: string) => candidateProfiles.find((p) => p.userId === userId),
    [candidateProfiles],
  );
  const getCompanyByOwner = useCallback(
    (userId: string) => companies.find((c) => c.ownerUserId === userId),
    [companies],
  );
  const getApplicationsForListing = useCallback(
    (listingId: string) =>
      applications.filter((a) => a.listingId === listingId),
    [applications],
  );
  const getApplicationsForCandidate = useCallback(
    (userId: string) =>
      applications.filter((a) => a.candidateUserId === userId),
    [applications],
  );
  const getListingsForCompany = useCallback(
    (companyId: string) => listings.filter((l) => l.companyId === companyId),
    [listings],
  );
  const getSavedListingsForUser = useCallback(
    (userId: string) => {
      const saved = savedListings.filter((s) => s.userId === userId);
      return listings.filter((l) => saved.some((s) => s.listingId === l.id));
    },
    [savedListings, listings],
  );
  const getNotificationsForUser = useCallback(
    (userId: string) =>
      notifications
        .filter((n) => n.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
    [notifications],
  );
  const getVerificationForCompany = useCallback(
    (companyId: string) => verifications.find((v) => v.companyId === companyId),
    [verifications],
  );
  const getUnreadMessageCount = useCallback(
    (_userId: string) => 0, // Placeholder for future messaging
    [],
  );

  return (
    <AppContext.Provider
      value={{
        // State
        currentUser,
        users,
        candidateProfiles,
        companies,
        listings,
        applications,
        savedListings,
        notifications,
        verifications,
        reports,
        // Auth
        login,
        register,
        logout,
        // User
        updateCurrentUser,
        uploadAvatar,
        getProfileCompletion, 
        isProfileComplete,
        // Profile
        updateProfile,
        uploadResume,
        // Company
        createCompany,
        updateCompany,
        uploadCompanyLogo,
        uploadCompanyCover,
        // Listings
        createListing,
        updateListing,
        deleteListing,
        updateListingStatus,
        incrementViewCount,
        // Applications
        applyToListing,
        updateApplicationStatus,
        hasApplied,
        // Saved
        toggleSaveListing,
        isListingSaved,
        // Notifications
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        getUnreadNotificationCount,
        // Verifications
        submitVerification,
        updateVerification,
        // Reports
        submitReport,
        resolveReport,
        // Admin
        verifyCompany,
        banUser,
        unbanUser,
        deleteUser,
        // Getters
        getCompanyById,
        getListingById,
        getUserById,
        getCandidateProfile,
        getCompanyByOwner,
        getApplicationsForListing,
        getApplicationsForCandidate,
        getListingsForCompany,
        getSavedListingsForUser,
        getNotificationsForUser,
        getVerificationForCompany,
        getUnreadMessageCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
