import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, ArrowLeft, Mail, Lock, User, Briefcase, CheckCircle } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { useToast } from '@/components/ui/Toast';

export default function RegisterPage() {
  const { register } = useApp();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '' as 'candidate' | 'recruiter' | '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.role) errs.role = 'Please select a role';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const result = register(form.name.trim(), form.email, form.role as 'candidate' | 'recruiter');
    setLoading(false);

    if (result.success) {
      showToast('success', 'Welcome to WorkHive! 🎉', result.message);
      const path = form.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/candidate';
      navigate(path);
    } else {
      showToast('error', 'Registration Failed', result.message);
      setErrors({ form: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
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
              Create your account
            </h1>
            <p className="text-sm text-[#5F6368] mt-1">Join WorkHive and find your next opportunity</p>
          </div>

          {/* Error Banner */}
          {errors.form && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to… <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setForm(p => ({ ...p, role: 'candidate' })); setErrors(e => ({ ...e, role: '' })); }}
                  className={'relative flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all text-center ' +
                    (form.role === 'candidate'
                      ? 'border-[#C1121F] bg-red-50'
                      : 'border-[#E5E7EB] hover:border-gray-300'
                    )}
                >
                  {form.role === 'candidate' && (
                    <CheckCircle size={16} className="absolute top-2 right-2 text-[#C1121F]" />
                  )}
                  <div className={'w-10 h-10 rounded-xl flex items-center justify-center ' +
                    (form.role === 'candidate' ? 'bg-[#C1121F] text-white' : 'bg-gray-100 text-gray-500')
                  }>
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">Find Work</p>
                    <p className="text-[10px] text-[#5F6368] mt-0.5">Browse & apply to jobs</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => { setForm(p => ({ ...p, role: 'recruiter' })); setErrors(e => ({ ...e, role: '' })); }}
                  className={'relative flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all text-center ' +
                    (form.role === 'recruiter'
                      ? 'border-[#C1121F] bg-red-50'
                      : 'border-[#E5E7EB] hover:border-gray-300'
                    )}
                >
                  {form.role === 'recruiter' && (
                    <CheckCircle size={16} className="absolute top-2 right-2 text-[#C1121F]" />
                  )}
                  <div className={'w-10 h-10 rounded-xl flex items-center justify-center ' +
                    (form.role === 'recruiter' ? 'bg-[#C1121F] text-white' : 'bg-gray-100 text-gray-500')
                  }>
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">Hire Talent</p>
                    <p className="text-[10px] text-[#5F6368] mt-0.5">Post jobs & find people</p>
                  </div>
                </button>
              </div>
              {errors.role && <p className="text-xs text-red-600 mt-1.5">⚠ {errors.role}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="John Doe"
                  autoComplete="name"
                  className={'w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 ' +
                    (errors.name ? 'border-red-400 bg-red-50' : 'border-[#E5E7EB] focus:border-[#C1121F]')}
                />
              </div>
              {errors.name && <p className="text-xs text-red-600 mt-1.5">⚠ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={'w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 ' +
                    (errors.email ? 'border-red-400 bg-red-50' : 'border-[#E5E7EB] focus:border-[#C1121F]')}
                />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1.5">⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                  className={'w-full pl-10 pr-10 py-3 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 ' +
                    (errors.password ? 'border-red-400 bg-red-50' : 'border-[#E5E7EB] focus:border-[#C1121F]')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1.5">⚠ {errors.password}</p>}
              {/* Strength indicator */}
              {form.password && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={'h-1 flex-1 rounded-full ' +
                        (form.password.length >= i * 3
                          ? (form.password.length >= 12 ? 'bg-green-500' : form.password.length >= 8 ? 'bg-yellow-500' : 'bg-red-400')
                          : 'bg-gray-200'
                        )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  className={'w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#C1121F]/20 ' +
                    (errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-[#E5E7EB] focus:border-[#C1121F]')}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1.5">⚠ {errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C1121F] hover:bg-[#9B0D18] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#5F6368] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C1121F] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#5F6368] mt-4">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="hover:underline">Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}