import { useApp } from '@/store/AppContext';
import { Bell, Check } from 'lucide-react';

export default function CandidateNotifications() {
  const { currentUser, getNotificationsForUser, markNotificationRead } = useApp();
  if (!currentUser) return null;

  const notifs = getNotificationsForUser(currentUser.id);

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-6">Notifications</h1>
      {notifs.length === 0 ? (
        <div className="text-center py-16 bg-[#F7F7F8] rounded-lg">
          <Bell size={32} className="text-[#5F6368] mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#111111]">No notifications</h3>
          <p className="text-sm text-[#5F6368] mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => (
            <div key={n.id} className={`border border-[#E5E7EB] rounded-lg px-4 py-3 flex items-start justify-between gap-4 ${n.isRead ? 'bg-white' : 'bg-[#FDECEE]'}`}>
              <div>
                <p className={`text-sm font-medium ${n.isRead ? 'text-[#5F6368]' : 'text-[#111111]'}`}>{n.title}</p>
                <p className="text-xs text-[#5F6368] mt-0.5">{n.body}</p>
                <p className="text-xs text-[#5F6368] mt-1">{n.createdAt}</p>
              </div>
              {!n.isRead && (
                <button onClick={() => markNotificationRead(n.id)} className="text-xs text-[#C1121F] hover:text-[#9B0D18] shrink-0 flex items-center gap-1">
                  <Check size={12} /> Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
