import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Zap, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
    showToast('success', 'Email Sent!', 'Check your inbox for reset instructions.');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-[#5F6368] hover:text-[#111111] mb-6 transition-colors">
          <ArrowLeft size={15} /> Back to login
        </Link>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#C1121F] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
              Reset Password
            </h1>
            <p className="text-sm text-[#5F6368] mt-1">
              Enter your email and we'll send reset instructions
            </p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-[#111111] mb-1">Check your email</h2>
              <p className="text-sm text-[#5F6368] mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 bg-[#111111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1A1A1A] transition-colors">
                Back to Sign In
              </Link>
              <p className="text-xs text-[#5F6368] mt-4">
                Didn't receive it?{' '}
                <button onClick={() => setSent(false)} className="text-[#C1121F] hover:underline font-medium">
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={'w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 ' +
                      (error ? 'border-red-400 bg-red-50' : 'border-[#E5E7EB] focus:border-[#C1121F]')}
                  />
                </div>
                {error && <p className="text-xs text-red-600 mt-1.5">⚠ {error}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#C1121F] hover:bg-[#9B0D18] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}