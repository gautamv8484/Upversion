import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Clock, Briefcase, Building2, Globe, ExternalLink,
  Bookmark, BookmarkCheck, Share2, ArrowLeft, CheckCircle, Zap,
  Send, Upload, FileText, X, AlertCircle, Eye, Users,
  DollarSign, Calendar, Award, ChevronRight,
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import Badge, { getTypeBadge, getWorkModeBadge } from "@/components/ui/Badge";
import ListingCard from "@/components/ui/ListingCard";
import ProfileCompleteModal from "@/components/ui/ProfileCompleteModal";
import { formatSalary, timeAgo, formatDate } from "@/utils/cn";

export default function ListingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const {
    listings,
    currentUser,
    getCompanyById,
    toggleSaveListing,
    isListingSaved,
    applyToListing,
    hasApplied,
    incrementViewCount,
    getApplicationsForListing,
    getListingsForCompany,
    isProfileComplete,
  } = useApp();

  const listing = listings.find((l) => l.slug === slug);
  const viewedRef = useRef(false);

  useEffect(() => {
    if (listing && !viewedRef.current) {
      incrementViewCount(listing.id);
      viewedRef.current = true;
    }
  }, [listing?.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // ── State ─────────────────────────────────────────────
  const [showApplyModal, setShowApplyModal]       = useState(false);
  const [showProfileModal, setShowProfileModal]   = useState(false);
  const [coverLetter, setCoverLetter]             = useState("");
  const [proposalText, setProposalText]           = useState("");
  const [expectedBudget, setExpectedBudget]       = useState("");
  const [estimatedTimeline, setEstimatedTimeline] = useState("");
  const [portfolioUrl, setPortfolioUrl]           = useState("");
  const [resumeFile, setResumeFile]               = useState<File | null>(null);
  const [applyError, setApplyError]               = useState("");
  const [applySuccess, setApplySuccess]           = useState(false);
  const [submitting, setSubmitting]               = useState(false);
  const [copied, setCopied]                       = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // ── 404 ───────────────────────────────────────────────
  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase size={28} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
            Listing Not Found
          </h1>
          <p className="text-[#5F6368] mt-2 mb-6">
            This listing may have been removed or the URL is incorrect.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A1A1A] transition-colors"
          >
            <ArrowLeft size={16} /> Browse All Listings
          </Link>
        </div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────
  const company          = getCompanyById(listing.companyId);
  const saved            = isListingSaved(listing.id);
  const alreadyApplied   = hasApplied(listing.id);
  const typeBadge        = getTypeBadge(listing.type);
  const modeBadge        = getWorkModeBadge(listing.workMode);
  const isFreelance      = listing.type === "freelance";
  const applicationsCount = getApplicationsForListing(listing.id).length;
  const companyListings  = company
    ? getListingsForCompany(company.id).filter((l) => l.status === "active").length
    : 0;

  const salary =
    listing.type === "job"
      ? formatSalary(listing.salaryMin, listing.salaryMax, "salary")
      : listing.type === "internship"
        ? formatSalary(listing.stipendMin, listing.stipendMax, "stipend")
        : formatSalary(listing.budgetMin, listing.budgetMax, "budget");

  const similarListings = listings
    .filter(
      (l) =>
        l.id !== listing.id &&
        l.status === "active" &&
        (l.category === listing.category || l.type === listing.type)
    )
    .slice(0, 3);

  const daysRemaining = () => {
    const diff = Math.ceil(
      (new Date(listing.deadline).getTime() - Date.now()) / 86400000
    );
    if (diff < 0) return "Expired";
    if (diff === 0) return "Last day!";
    if (diff === 1) return "1 day left";
    return diff + " days left";
  };
  const deadlineStatus = daysRemaining();
  const isExpired       = deadlineStatus === "Expired";

  // ── Handlers ──────────────────────────────────────────

  // Main apply click - profile check
  const handleApplyClick = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    if (currentUser.role !== "candidate") {
      return;
    }
    if (!isProfileComplete(currentUser.id)) {
      setShowProfileModal(true);
      return;
    }
    setShowApplyModal(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (_) {
      /* cancelled */
    }
  };

  const handleSave = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    toggleSaveListing(listing.id);
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      setApplyError("Only PDF, DOC, DOCX allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setApplyError("Max 5MB allowed");
      return;
    }
    setResumeFile(file);
    setApplyError("");
  };

  const handleApplySubmit = () => {
    setApplyError("");
    if (!currentUser) { navigate("/login"); return; }
    if (currentUser.role !== "candidate") {
      setApplyError("Only candidates can apply");
      return;
    }
    if (isFreelance) {
      if (!proposalText.trim()) { setApplyError("Please write a proposal"); return; }
      if (!expectedBudget)      { setApplyError("Please enter budget"); return; }
    } else {
      if (!coverLetter.trim())  { setApplyError("Please write a cover letter"); return; }
    }

    setSubmitting(true);
    setTimeout(() => {
      const resumeUrl = resumeFile ? URL.createObjectURL(resumeFile) : undefined;
      const success = applyToListing({
        listingId:          listing.id,
        candidateUserId:    currentUser.id,
        applicationType:    isFreelance ? "proposal" : "apply",
        coverLetter:        isFreelance ? undefined : coverLetter,
        proposalText:       isFreelance ? proposalText : undefined,
        expectedBudget:     isFreelance ? Number(expectedBudget) : undefined,
        estimatedTimeline:  isFreelance ? estimatedTimeline : undefined,
        resumeFile:         resumeUrl,
        portfolioUrl:       portfolioUrl || undefined,
        status:             "new",
      });
      setSubmitting(false);
      if (success) {
        setApplySuccess(true);
      } else {
        setApplyError("You have already applied to this listing");
      }
    }, 800);
  };

  const closeModal = () => {
    setShowApplyModal(false);
    setApplySuccess(false);
    setCoverLetter("");
    setProposalText("");
    setExpectedBudget("");
    setEstimatedTimeline("");
    setPortfolioUrl("");
    setResumeFile(null);
    setApplyError("");
  };

  // ── Render ────────────────────────────────────────────
  return (
    <>
      <div className="bg-white min-h-screen pb-24 lg:pb-0">

        {/* Breadcrumb */}
        <div className="border-b border-[#E5E7EB] bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 text-xs text-[#5F6368]">
              <Link to="/explore" className="hover:text-[#111111] transition-colors">
                Explore
              </Link>
              <ChevronRight size={12} />
              <Link
                to={"/" + (listing.type === "job" ? "jobs" : listing.type === "internship" ? "internships" : "freelance")}
                className="hover:text-[#111111] transition-colors capitalize"
              >
                {listing.type === "job" ? "Jobs" : listing.type === "internship" ? "Internships" : "Freelance"}
              </Link>
              <ChevronRight size={12} />
              <span className="text-[#111111] font-medium truncate max-w-[200px]">
                {listing.title}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── LEFT CONTENT ──────────────────────────── */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Header Card */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Link to={"/company/" + (company?.slug || "")} className="shrink-0">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl border border-[#E5E7EB] flex items-center justify-center overflow-hidden hover:border-gray-300 transition-colors">
                        {company?.logoFile || company?.logoUrl ? (
                          <img src={company.logoFile || company.logoUrl} alt={company.companyName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xl font-bold text-gray-700">
                            {company?.companyName?.charAt(0) || "?"}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={"/company/" + (company?.slug || "")} className="text-sm text-[#5F6368] hover:text-[#111111] transition-colors">
                          {company?.companyName}
                        </Link>
                        {company?.verified && <CheckCircle size={14} className="text-[#C1121F]" />}
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] leading-tight">
                        {listing.title}
                      </h1>
                    </div>
                  </div>
                  {listing.featured && (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Zap size={12} className="fill-amber-600 text-amber-600" /> Featured
                    </span>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant={typeBadge.variant} size="md">{typeBadge.label}</Badge>
                  <Badge variant={modeBadge.variant} size="md">{modeBadge.label}</Badge>
                  {listing.experienceLevel !== "any" && (
                    <Badge variant="outline" size="md" className="capitalize">
                      {listing.experienceLevel} Level
                    </Badge>
                  )}
                  <Badge variant="outline" size="md">{listing.category}</Badge>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#F3F4F6]">
                  {[
                    { icon: MapPin,     label: "Location", value: listing.location },
                    {
                      icon: DollarSign,
                      label: listing.type === "job" ? "Salary" : listing.type === "internship" ? "Stipend" : "Budget",
                      value: salary !== "Not specified" ? salary : "Undisclosed",
                    },
                    {
                      icon: Calendar,
                      label: "Deadline",
                      value: deadlineStatus,
                      red: isExpired,
                    },
                    { icon: Clock, label: "Posted", value: timeAgo(listing.createdAt) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#F3F4F6] rounded-lg flex items-center justify-center shrink-0">
                        <item.icon size={14} className="text-[#5F6368]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5F6368] uppercase tracking-wide">
                          {item.label}
                        </p>
                        <p className={"text-sm font-medium " + (item.red ? "text-red-600" : "text-[#111111]")}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-xs text-[#5F6368]">
                  {listing.viewCount ? (
                    <span className="flex items-center gap-1"><Eye size={13} /> {listing.viewCount} views</span>
                  ) : null}
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {applicationsCount} applicant{applicationsCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">
                  About This Role
                </h2>
                <p className="text-sm text-[#5F6368] leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Responsibilities */}
              {listing.responsibilities.length > 0 && (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">
                    Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {listing.responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#5F6368]">
                        <CheckCircle size={16} className="text-green-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {listing.requirements.length > 0 && (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {listing.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#5F6368]">
                        <Award size={16} className="text-[#C1121F] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">
                  Skills Required
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.skillsRequired.map((skill) => (
                    <span key={skill} className="text-sm px-3 py-1.5 bg-[#F3F4F6] text-[#111111] rounded-lg border border-[#E5E7EB] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Perks */}
              {listing.perks.length > 0 && (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sm:p-8">
                  <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">
                    Perks & Benefits
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {listing.perks.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
                        <CheckCircle size={16} className="text-green-600 shrink-0" />
                        <span className="text-sm text-green-800">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Listings */}
              {similarListings.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)] mb-4">
                    Similar Opportunities
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {similarListings.map((l) => (
                      <ListingCard key={l.id} listing={l} compact />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT SIDEBAR - Desktop ────────────────── */}
            <div className="hidden lg:block w-[340px] shrink-0">
              <div className="sticky top-20 space-y-5">

                {/* Apply Card */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                  {salary !== "Not specified" && (
                    <div className="mb-4">
                      <p className="text-xs text-[#5F6368] uppercase tracking-wide mb-1">
                        {listing.type === "job" ? "Salary Range" : listing.type === "internship" ? "Monthly Stipend" : "Project Budget"}
                      </p>
                      <p className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
                        {salary}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {alreadyApplied ? (
                      <div className="w-full py-3 bg-green-50 border border-green-200 rounded-lg text-center">
                        <p className="text-sm font-medium text-green-700 flex items-center justify-center gap-2">
                          <CheckCircle size={16} /> {isFreelance ? "Proposal Sent" : "Applied"}
                        </p>
                        <p className="text-xs text-green-600 mt-1">Check dashboard for updates</p>
                      </div>
                    ) : isExpired ? (
                      <div className="w-full py-3 bg-gray-100 rounded-lg text-center">
                        <p className="text-sm font-medium text-gray-500">Applications Closed</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleApplyClick}
                        className="w-full py-3 bg-[#C1121F] hover:bg-[#9B0D18] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Send size={16} /> {isFreelance ? "Send Proposal" : "Apply Now"}
                      </button>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className={"flex-1 py-2.5 border rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 " +
                          (saved ? "border-[#C1121F] text-[#C1121F] bg-red-50" : "border-[#E5E7EB] text-[#5F6368] hover:border-[#111111] hover:text-[#111111]")}
                      >
                        {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                        {saved ? "Saved" : "Save"}
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex-1 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#5F6368] hover:border-[#111111] hover:text-[#111111] transition-colors flex items-center justify-center gap-2"
                      >
                        <Share2 size={16} /> {copied ? "Copied!" : "Share"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#5F6368]">Apply before</span>
                      <span className={"font-medium " + (isExpired ? "text-red-600" : "text-[#111111]")}>
                        {formatDate(listing.deadline)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Company Card - NO BLACK COVER */}
                {company && (
                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-[#E5E7EB] overflow-hidden flex items-center justify-center shrink-0">
                        {company.logoFile || company.logoUrl ? (
                          <img src={company.logoFile || company.logoUrl} alt={company.companyName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg font-bold text-gray-700">{company.companyName.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#111111] flex items-center gap-1.5 text-sm">
                          {company.companyName}
                          {company.verified && <CheckCircle size={13} className="text-[#C1121F] shrink-0" />}
                        </h3>
                        <p className="text-xs text-[#5F6368]">{company.industry}</p>
                      </div>
                    </div>

                    <p className="text-xs text-[#5F6368] leading-relaxed mb-4"
                      style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {company.description}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-[#F3F4F6]">
                      <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                        <MapPin size={12} className="shrink-0" /> {company.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                        <Users size={12} className="shrink-0" /> {company.size} employees
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#5F6368]">
                        <Briefcase size={12} className="shrink-0" /> {companyListings} active listing{companyListings !== 1 ? "s" : ""}
                      </div>
                      {company.website && (
                        <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-[#C1121F] hover:underline">
                          <Globe size={12} className="shrink-0" /> Visit website <ExternalLink size={10} />
                        </a>
                      )}
                    </div>

                    <Link
                      to={"/company/" + company.slug}
                      className="mt-4 block w-full py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#5F6368] hover:border-[#111111] hover:text-[#111111] transition-colors text-center"
                    >
                      View Company Profile
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE STICKY BOTTOM BAR ──────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            {/* Price + Deadline */}
            <div className="flex-1 min-w-0">
              {salary !== "Not specified" && (
                <p className="text-sm font-bold text-[#111111] truncate">{salary}</p>
              )}
              <p className={"text-[10px] font-medium " + (isExpired ? "text-red-500" : "text-[#5F6368]")}>
                {isExpired ? "Expired" : "Deadline: " + formatDate(listing.deadline)}
              </p>
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              className={"p-2.5 border rounded-xl transition-colors shrink-0 " +
                (saved ? "border-[#C1121F] bg-red-50 text-[#C1121F]" : "border-[#E5E7EB] text-gray-500 hover:border-gray-300")}
            >
              {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>

            {/* Share */}
            <button title="."
              onClick={handleShare}
              className="p-2.5 border border-[#E5E7EB] rounded-xl text-gray-500 hover:border-gray-300 transition-colors shrink-0"
            >
              <Share2 size={18} />
            </button>

            {/* Apply CTA */}
            {alreadyApplied ? (
              <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0">
                <CheckCircle size={16} /> Applied
              </div>
            ) : isExpired ? (
              <div className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium text-gray-500 shrink-0">
                Closed
              </div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="flex items-center gap-2 bg-[#C1121F] hover:bg-[#9B0D18] text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shrink-0"
              >
                <Send size={16} /> {isFreelance ? "Propose" : "Apply"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── PROFILE COMPLETE MODAL ────────────────────── */}
      <ProfileCompleteModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* ── APPLY MODAL ───────────────────────────────── */}
      {showApplyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col"
            style={{ maxHeight: "90vh" }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-[#111111] font-[family-name:var(--font-heading)]">
                  {isFreelance ? "Send Proposal" : "Apply for this Role"}
                </h2>
                <p className="text-xs text-[#5F6368] mt-0.5">
                  {listing.title} at {company?.companyName}
                </p>
              </div>
              <button onClick={closeModal} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              {applySuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
                    {isFreelance ? "Proposal Sent!" : "Application Submitted!"}
                  </h3>
                  <p className="text-sm text-[#5F6368] mt-2 max-w-sm mx-auto">
                    Your {isFreelance ? "proposal" : "application"} for{" "}
                    <strong>{listing.title}</strong> has been sent to {company?.companyName}.
                  </p>
                  <div className="flex gap-3 justify-center mt-6">
                    <Link
                      to={isFreelance ? "/dashboard/candidate/proposals" : "/dashboard/candidate/applications"}
                      className="bg-[#111111] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#1A1A1A] transition-colors"
                    >
                      View Dashboard
                    </Link>
                    <button onClick={closeModal} className="px-5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#5F6368] hover:border-[#111111] transition-colors">
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {isFreelance ? (
                    <>
                      <div>
                        <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                          Your Proposal <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={proposalText}
                          onChange={(e) => setProposalText(e.target.value)}
                          rows={5}
                          maxLength={2000}
                          placeholder="Describe your approach and why you're the best fit…"
                          className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] resize-none transition-colors"
                        />
                        <p className="text-xs text-[#5F6368] text-right mt-1">{proposalText.length}/2000</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                            Budget ($) <span className="text-red-500">*</span>
                          </label>
                          <input type="number" value={expectedBudget} onChange={(e) => setExpectedBudget(e.target.value)} placeholder="5000" min="0"
                            className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Timeline</label>
                          <input type="text" value={estimatedTimeline} onChange={(e) => setEstimatedTimeline(e.target.value)} placeholder="4 weeks"
                            className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] transition-colors" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">
                        Cover Letter <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        rows={6}
                        maxLength={3000}
                        placeholder="Why are you interested and what makes you a great fit…"
                        className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] resize-none transition-colors"
                      />
                      <p className="text-xs text-[#5F6368] text-right mt-1">{coverLetter.length}/3000</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Portfolio URL</label>
                    <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://your-portfolio.com"
                      className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#111111] transition-colors" />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-[#5F6368] mb-1.5 block">Attach Resume</label>
                    {resumeFile ? (
                      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FileText size={18} className="text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">{resumeFile.name}</p>
                            <p className="text-xs text-blue-600">{(resumeFile.size / 1024 / 1024).toFixed(1)} MB</p>
                          </div>
                        </div>
                        <button onClick={() => setResumeFile(null)} className="p-1 text-blue-400 hover:text-red-600 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => resumeInputRef.current?.click()}
                        className="w-full py-4 border-2 border-dashed border-[#E5E7EB] rounded-lg text-sm text-[#5F6368] hover:border-[#111111] hover:text-[#111111] transition-all flex items-center justify-center gap-2">
                        <Upload size={16} /> Upload Resume (PDF, DOC · Max 5MB)
                      </button>
                    )}
                    <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="hidden" />
                  </div>

                  {applyError && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                      <AlertCircle size={16} className="shrink-0" /> {applyError}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!applySuccess && (
              <div className="px-6 py-4 border-t border-[#E5E7EB] flex gap-3 shrink-0">
                <button onClick={closeModal} className="flex-1 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#5F6368] hover:border-[#111111] transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleApplySubmit}
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#C1121F] hover:bg-[#9B0D18] text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <Send size={16} /> {isFreelance ? "Send Proposal" : "Submit Application"}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}