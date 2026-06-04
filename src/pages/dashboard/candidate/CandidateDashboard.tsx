import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import DashboardSidebar from '@/components/ui/DashboardSidebar';

export default function CandidateDashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser || currentUser.role !== 'candidate') {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#F7F7F8]">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex w-60 shrink-0 border-r border-[#E5E7EB] bg-white">
        <DashboardSidebar role="candidate" />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white h-full shadow-2xl">
            <DashboardSidebar role="candidate" onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}