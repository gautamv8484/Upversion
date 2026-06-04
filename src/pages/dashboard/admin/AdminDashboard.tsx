import { Outlet, Navigate } from 'react-router-dom';
import { useApp } from '@/store/AppContext';
import DashboardSidebar from '@/components/ui/DashboardSidebar';

export default function AdminDashboard() {
  const { currentUser } = useApp();

  if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/login" />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <DashboardSidebar role="admin" title="Admin" />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}