import { Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Building2, FileText, Plus, Users, ShieldCheck, Settings } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import DashboardSidebar from '@/components/ui/DashboardSidebar';

export default function RecruiterDashboard() {
  const { currentUser, getCompanyByOwner, listings, applications } = useApp();

  if (!currentUser || currentUser.role !== 'recruiter') return <Navigate to="/login" />;

  const company = getCompanyByOwner(currentUser.id);
  const myListings = company ? listings.filter(l => l.companyId === company.id) : [];
  const myApps = applications.filter(a => myListings.some(l => l.id === a.listingId));

  const items = [
    { to: '/dashboard/recruiter', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/recruiter/company', label: 'Company', icon: Building2 },
    { to: '/dashboard/recruiter/listings/new', label: 'Post Listing', icon: Plus },
    { to: '/dashboard/recruiter/listings', label: 'Manage Listings', icon: FileText, badge: myListings.filter(l => l.status === 'active').length },
    { to: '/dashboard/recruiter/applicants', label: 'Applicants', icon: Users, badge: myApps.filter(a => a.status === 'new').length },
    { to: '/dashboard/recruiter/verification', label: 'Verification', icon: ShieldCheck },
    { to: '/dashboard/recruiter/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <DashboardSidebar items={items} title="Recruiter" />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
