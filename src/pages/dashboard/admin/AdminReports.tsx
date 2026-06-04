import { useApp } from '@/store/AppContext';
import { Flag, CheckCircle, AlertCircle, User, FileText, Building2 } from 'lucide-react';
import { formatDate } from '@/utils/cn';

export default function AdminReports() {
  const { reports, resolveReport, getUserById, getListingById, getCompanyById } = useApp();

  const targetIcon: Record<string, React.ElementType> = {
    listing: FileText, user: User, company: Building2,
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-1">Reports</h1>
      <p className="text-sm text-[#5F6368] mb-6">{reports.filter(r => r.status === 'pending').length} pending</p>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-10 text-center">
            <Flag size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No reports yet</p>
          </div>
        ) : (
          reports.map(r => {
            const reporter = getUserById(r.reporterUserId);
            const Icon = targetIcon[r.targetType] || AlertCircle;
            const isResolved = r.status === 'resolved';
            return (
              <div key={r.id} className={'bg-white border rounded-xl p-5 transition-colors ' + (isResolved ? 'border-[#E5E7EB] opacity-60' : 'border-orange-200')}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + (isResolved ? 'bg-gray-100' : 'bg-orange-50')}>
                      <Icon size={18} className={isResolved ? 'text-gray-500' : 'text-orange-600'} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={'text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ' +
                          (r.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                           r.status === 'reviewed' ? 'bg-blue-50 text-blue-600' :
                           'bg-green-50 text-green-600')
                        }>
                          {r.status}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase">{r.targetType}</span>
                      </div>
                      <p className="text-sm text-[#111111] font-medium">{r.reason}</p>
                      <p className="text-xs text-[#5F6368] mt-1">
                        Reported by {reporter?.name || 'Unknown'} · {formatDate(r.createdAt)}
                      </p>
                    </div>
                  </div>
                  {!isResolved && (
                    <button
                      onClick={() => resolveReport(r.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-green-600 px-3 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-colors shrink-0"
                    >
                      <CheckCircle size={13} /> Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}