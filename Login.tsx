import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { AuthLayout } from '../components/AuthLayout';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    const { error: authError } = await signIn(email, password);
    setLoading(false);
    if (authError) {
      if (authError.message?.includes('Invalid login credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (authError.message?.includes('Email not confirmed')) {
        setError('Please verify your email address before signing in.');
      } else {
        setError(authError.message || 'Sign in failed. Please try again.');
      }
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your FixMyProblem account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

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
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[#CBD5E1]">Password</label>
            <Link to="/forgot-password" className="text-xs text-[#4F7DF3] hover:text-[#6B95F5] transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg hover:shadow-[#4F7DF3]/20 hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : 'Sign in'}
        </button>

        <p className="text-center text-sm text-[#64748B]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#4F7DF3] hover:text-[#6B95F5] font-medium transition-colors">
            Create one free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
