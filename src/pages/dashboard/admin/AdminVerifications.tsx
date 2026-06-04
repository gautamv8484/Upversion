import { useApp } from '@/store/AppContext';
import { CheckCircle, XCircle, Clock, FileText, ExternalLink } from 'lucide-react';

export default function AdminVerifications() {
  const { verifications, companies, getCompanyById, updateVerification } = useApp();

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)] mb-1">Verification Requests</h1>
      <p className="text-sm text-[#5F6368] mb-6">{verifications.length} total requests</p>

      <div className="space-y-3">
        {verifications.length === 0 ? (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-10 text-center">
            <p className="text-sm text-gray-500">No verification requests</p>
          </div>
        ) : (
          verifications.map(v => {
            const company = getCompanyById(v.companyId);
            const isPending = v.status === 'pending';
            return (
              <div key={v.id} className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl border border-[#E5E7EB] flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-gray-700">{company?.companyName?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#111111]">{company?.companyName || 'Unknown'}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={'inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ' +
                          (v.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                           v.status === 'approved' ? 'bg-green-50 text-green-600' :
                           'bg-red-50 text-red-600')
                        }>
                          {v.status === 'pending' ? <Clock size={10} /> : v.status === 'approved' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                          {v.status}
                        </span>
                        {v.submittedDocsFile && (
                          <a href={v.submittedDocsFile} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-[#C1121F] hover:underline">
                            <FileText size={11} /> View Docs
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {isPending && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => updateVerification(v.id, 'approved')}
                        className="flex items-center gap-1.5 text-xs font-medium text-green-600 px-3 py-2 rounded-lg border border-green-200 hover:bg-green-50 transition-colors"
                      >
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button
                        onClick={() => updateVerification(v.id, 'rejected')}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-600 px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
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