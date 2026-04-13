import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '../lib/supabase';
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

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setValidSession(!!session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!/\d/.test(password)) { setError('Password must contain at least one number.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      if (updateError.message?.includes('expired') || updateError.message?.includes('invalid')) {
        setError('This reset link has expired. Please request a new one.');
      } else {
        setError(updateError.message || 'Failed to reset password. Please try again.');
      }
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  if (validSession === null) {
    return (
      <AuthLayout title="Reset Password" subtitle="">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#4F7DF3]" />
        </div>
      </AuthLayout>
    );
  }

  if (!validSession) {
    return (
      <AuthLayout title="Link expired" subtitle="This reset link is no longer valid">
        <div className="text-center space-y-5">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-[#94A3B8] text-sm">
            This password reset link has expired or has already been used. Please request a new one.
          </p>
          <Link
            to="/forgot-password"
            className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg transition-all text-center"
          >
            Request new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout title="Password updated" subtitle="Your new password is set">
        <div className="text-center space-y-5">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <p className="text-[#CBD5E1]">Your password has been updated successfully.</p>
          <p className="text-sm text-[#64748B]">Redirecting you to sign in...</p>
          <Link
            to="/login"
            className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg transition-all text-center"
          >
            Sign in now
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create new password" subtitle="Choose a strong password for your account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#CBD5E1]">New password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Create a strong password"
              autoComplete="new-password"
              className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/60 focus:bg-white/8 transition-all"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94A3B8] transition-colors">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-[#CBD5E1]">Confirm new password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Repeat your new password"
              autoComplete="new-password"
              className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-[#475569] focus:outline-none focus:bg-white/8 transition-all ${
                confirmPassword && confirmPassword !== password ? 'border-red-500/40' : 'border-white/10 focus:border-[#4F7DF3]/60'
              }`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94A3B8] transition-colors">
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
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Updating password...</> : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  );
}
