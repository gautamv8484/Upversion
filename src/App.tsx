import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from '@/store/AppContext';
import { ToastProvider } from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Pages
import HomePage from '@/pages/HomePage';
import ListingsPage from '@/pages/ListingsPage';
import ListingDetailPage from '@/pages/ListingDetailPage';
import CompaniesPage from '@/pages/CompaniesPage';
import CompanyDetailPage from '@/pages/CompanyDetailPage';

// Auth
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';

// Static
import AboutPage from '@/pages/static/AboutPage';
import ContactPage from '@/pages/static/ContactPage';
import PricingPage from '@/pages/static/PricingPage';
import TermsPage from '@/pages/static/TermsPage';
import PrivacyPage from '@/pages/static/PrivacyPage';

// Candidate Dashboard
import CandidateDashboard from '@/pages/dashboard/candidate/CandidateDashboard';
import CandidateOverview from '@/pages/dashboard/candidate/CandidateOverview';
import CandidateProfile from '@/pages/dashboard/candidate/CandidateProfile';
import CandidateSaved from '@/pages/dashboard/candidate/CandidateSaved';
import CandidateApplications from '@/pages/dashboard/candidate/CandidateApplications';
import CandidateNotifications from '@/pages/dashboard/candidate/CandidateNotifications';
import CandidateSettings from '@/pages/dashboard/candidate/CandidateSettings';

// Recruiter Dashboard
import RecruiterDashboard from '@/pages/dashboard/recruiter/RecruiterDashboard';
import RecruiterOverview from '@/pages/dashboard/recruiter/RecruiterOverview';
import RecruiterCompany from '@/pages/dashboard/recruiter/RecruiterCompany';
import RecruiterPostListing from '@/pages/dashboard/recruiter/RecruiterPostListing';
import RecruiterListings from '@/pages/dashboard/recruiter/RecruiterListings';
import RecruiterApplicants from '@/pages/dashboard/recruiter/RecruiterApplicants';
import RecruiterVerification from '@/pages/dashboard/recruiter/RecruiterVerification';

// Admin Dashboard
import AdminDashboard from '@/pages/dashboard/admin/AdminDashboard';
import AdminOverview from '@/pages/dashboard/admin/AdminOverview';
import AdminUsers from '@/pages/dashboard/admin/AdminUsers';
import AdminListings from '@/pages/dashboard/admin/AdminListings';
import AdminCompanies from '@/pages/dashboard/admin/AdminCompanies';
import AdminVerifications from '@/pages/dashboard/admin/AdminVerifications';
import AdminReports from '@/pages/dashboard/admin/AdminReports';
import AdminSettings from '@/pages/dashboard/admin/AdminSettings';

// ── Scroll to top on route change ─────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ── Main Layout ───────────────────────────────────────
function AppLayout() {
  const { pathname } = useLocation();
  const hideFooter =
    pathname.startsWith('/dashboard') || pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ListingsPage />} />
          <Route path="/jobs" element={<ListingsPage filterType="job" />} />
          <Route path="/internships" element={<ListingsPage filterType="internship" />} />
          <Route path="/freelance" element={<ListingsPage filterType="freelance" />} />
          <Route path="/listing/:slug" element={<ListingDetailPage />} />
          <Route path="/companies" element={<CompaniesPage />} />
          <Route path="/company/:slug" element={<CompanyDetailPage />} />

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Static */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Candidate Dashboard */}
          <Route path="/dashboard/candidate" element={<CandidateDashboard />}>
            <Route index element={<CandidateOverview />} />
            <Route path="profile" element={<CandidateProfile />} />
            <Route path="saved" element={<CandidateSaved />} />
            <Route path="applications" element={<CandidateApplications type="apply" />} />
            <Route path="proposals" element={<CandidateApplications type="proposal" />} />
            <Route path="notifications" element={<CandidateNotifications />} />
            <Route path="settings" element={<CandidateSettings />} />
          </Route>

          {/* Recruiter Dashboard */}
          <Route path="/dashboard/recruiter" element={<RecruiterDashboard />}>
            <Route index element={<RecruiterOverview />} />
            <Route path="company" element={<RecruiterCompany />} />
            <Route path="listings/new" element={<RecruiterPostListing />} />
            <Route path="listings" element={<RecruiterListings />} />
            <Route path="applicants" element={<RecruiterApplicants />} />
            <Route path="verification" element={<RecruiterVerification />} />
            <Route path="settings" element={<CandidateSettings />} />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="listings" element={<AdminListings />} />
            <Route path="recruiters" element={<AdminCompanies />} />
            <Route path="verifications" element={<AdminVerifications />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
              <div className="max-w-md mx-auto">
                <h1 className="text-6xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
                  404
                </h1>
                <p className="text-[#5F6368] mt-3 mb-6 text-lg">Page not found</p>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 bg-[#111111] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#1A1A1A] transition-colors"
                >
                  Go Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <AppLayout />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
}