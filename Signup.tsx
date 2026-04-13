import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { AuthLayout } from '../components/AuthLayout';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      {checks.map((c, i) => (
        <div key={i} className="flex items-center gap-2">
          {c.pass ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-[#14B8A6] flex-shrink-0" />
          ) : (
            <Circle className="w-3.5 h-3.5 text-[#475569] flex-shrink-0" />
          )}
          <span className={`text-xs ${c.pass ? 'text-[#14B8A6]' : 'text-[#64748B]'}`}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const redirectTo = (location.state as any)?.redirectTo || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!email) { setError('Please enter your email address.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!/\d/.test(password)) { setError('Password must contain at least one number.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');
    const { error: authError } = await signUp(email, password, fullName.trim());
    setLoading(false);
    if (authError) {
      if (authError.message?.includes('already registered') || authError.message?.includes('already exists') || authError.message?.includes('User already registered')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else {
        setError(authError.message || 'Sign up failed. Please try again.');
      }
    } else {
      navigate(redirectTo, { replace: true });
    }
  };

  if (success) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent you a verification link">
        <div className="text-center space-y-5">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <p className="text-[#CBD5E1]">
              We've sent a verification email to <span className="text-white font-medium">{email}</span>.
            </p>
            <p className="text-sm text-[#64748B]">
              Click the link in that email to activate your account, then sign in.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <button
              onClick={() => navigate('/login', { state: { redirectTo } })}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg transition-all"
            >
              Continue to sign in
            </button>
            <p className="text-xs text-[#475569]">
              Didn't receive it? Check your spam folder, or{' '}
              <button
                onClick={() => setSuccess(false)}
                className="text-[#4F7DF3] hover:underline"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create your account" subtitle="Get ongoing help with your complaints and disputes">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#CBD5E1]">Full name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Jane Smith"
            autoComplete="name"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/60 focus:bg-white/8 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#CBD5E1]">Email address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/60 focus:bg-white/8 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#CBD5E1]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/60 focus:bg-white/8 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94A3B8] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#CBD5E1]">Confirm password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-[#475569] focus:outline-none focus:bg-white/8 transition-all ${
                confirmPassword && confirmPassword !== password
                  ? 'border-red-500/40 focus:border-red-500/60'
                  : confirmPassword && confirmPassword === password
                  ? 'border-[#14B8A6]/40 focus:border-[#14B8A6]/60'
                  : 'border-white/10 focus:border-[#4F7DF3]/60'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94A3B8] transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="text-xs text-red-400">Passwords don't match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg hover:shadow-[#4F7DF3]/20 hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account...</> : 'Create account'}
        </button>

        <p className="text-center text-xs text-[#475569]">
          By creating an account, you agree to our{' '}
          <span className="text-[#4F7DF3]">Terms of Service</span>{' '}
          and{' '}
          <span className="text-[#4F7DF3]">Privacy Policy</span>
        </p>

        <p className="text-center text-sm text-[#64748B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#4F7DF3] hover:text-[#6B95F5] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
