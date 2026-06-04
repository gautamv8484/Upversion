import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowLeft, Mail, Lock } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useToast } from '@/components/ui/Toast';


export default function LoginPage() {
  const { login,users } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  await new Promise(r => setTimeout(r, 600));

  const result = login(form.email, form.password);
  setLoading(false);

  if (result.success) {
    showToast('success', 'Welcome back! 👋', 'You have been logged in successfully.');

    // Find the actual user to determine role
    const loggedInUser = users.find(u => u.email === form.email);
    let path = '/dashboard/candidate';
    if (loggedInUser?.role === 'recruiter') path = '/dashboard/recruiter';
    if (loggedInUser?.role === 'admin') path = '/admin';

    navigate(path);
  } else {
    showToast('error', 'Login Failed', result.message);
    setErrors({ form: result.message });
  }
};

  // Demo accounts
  const demoAccounts = [
    { label: 'Candidate', email: 'sarah@example.com', password: 'password123', color: 'blue' },
    { label: 'Recruiter', email: 'maria@example.com', password: 'password123', color: 'purple' },
    { label: 'Admin',     email: 'admin@workly.com',  password: 'admin123',    color: 'red' },
  ];

  const fillDemo = (email: string, password: string) => {
    setForm({ email, password });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#5F6368] hover:text-[#111111] mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to home
        </Link>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#C1121F] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#111111] font-[family-name:var(--font-heading)]">
              Welcome back
            </h1>
            <p className="text-sm text-[#5F6368] mt-1">Sign in to your WorkHive account</p>
          </div>

          {/* Demo Accounts */}
          <div className="mb-6 p-4 bg-[#F7F7F8] rounded-xl border border-[#E5E7EB]">
            <p className="text-xs font-semibold text-[#5F6368] uppercase tracking-wide mb-3">
              🎭 Try a demo account
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email, acc.password)}
                  className="py-2.5 px-2 text-xs border border-[#E5E7EB] bg-white rounded-lg
                    hover:border-[#C1121F] hover:bg-red-50 transition-all text-center
                    font-medium text-gray-700 shadow-sm"
                >
                  {acc.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#5F6368] mt-2 text-center">
              Click any role to auto-fill credentials
            </p>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-xs text-[#5F6368] font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* Error Banner */}
          {errors.form && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-colors
                    focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 ${
                    errors.email
                      ? 'border-red-400 bg-red-50'
                      : 'border-[#E5E7EB] focus:border-[#C1121F]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  ⚠ {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#C1121F] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl text-sm transition-colors
                    focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 ${
                    errors.password
                      ? 'border-red-400 bg-red-50'
                      : 'border-[#E5E7EB] focus:border-[#C1121F]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                  ⚠ {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C1121F] hover:bg-[#9B0D18] text-white font-semibold
                rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 mt-2 shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#5F6368] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#C1121F] font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#5F6368] mt-4">
          By signing in, you agree to our{' '}
          <Link to="/terms" className="hover:underline">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}