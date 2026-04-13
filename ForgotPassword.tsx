import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AuthLayout } from '../components/AuthLayout';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message || 'Something went wrong. Please try again.');
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your inbox" subtitle="We've sent you a reset link">
        <div className="text-center space-y-5">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <p className="text-[#CBD5E1]">
              We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
            </p>
            <p className="text-sm text-[#64748B]">
              The link expires in 1 hour. If you don't see it, check your spam folder.
            </p>
          </div>
          <div className="pt-2 space-y-3">
            <Link
              to="/login"
              className="block w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg transition-all text-center"
            >
              Back to sign in
            </Link>
            <button
              onClick={() => setSent(false)}
              className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] hover:bg-white/8 transition-all text-sm"
            >
              Resend link
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset link">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg hover:shadow-[#4F7DF3]/20 hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Sending link...</> : 'Send reset link'}
        </button>

        <p className="text-center text-sm text-[#64748B]">
          Remember your password?{' '}
          <Link to="/login" className="text-[#4F7DF3] hover:text-[#6B95F5] font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
