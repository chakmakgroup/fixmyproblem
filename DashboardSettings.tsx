import { useState } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export function DashboardSettings() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setNameError('Name cannot be empty.'); return; }
    setNameLoading(true); setNameError(''); setNameSuccess(false);
    const { error } = await supabase.from('user_profiles').update({ full_name: fullName.trim(), updated_at: new Date().toISOString() }).eq('id', user!.id);
    setNameLoading(false);
    if (error) { setNameError('Failed to update name. Please try again.'); }
    else { setNameSuccess(true); refreshProfile(); setTimeout(() => setNameSuccess(false), 3000); }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) { setPasswordError('New password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
    setPasswordLoading(true); setPasswordError(''); setPasswordSuccess(false);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);
    if (error) { setPasswordError(error.message || 'Failed to update password.'); }
    else {
      setPasswordSuccess(true);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/60 focus:bg-white/8 transition-all text-sm";

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold mb-0.5">Settings</h1>
          <p className="text-sm text-[#64748B]">Manage your account information and preferences.</p>
        </div>

        <div className="bg-[#0D1728] border border-white/8 rounded-2xl p-6">
          <h2 className="font-semibold mb-5">Account information</h2>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#CBD5E1]">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your full name"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#CBD5E1]">Email address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className={`${inputClass} opacity-50 cursor-not-allowed`}
              />
              <p className="text-xs text-[#475569]">Email address cannot be changed from this screen.</p>
            </div>
            {nameError && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {nameError}
              </div>
            )}
            {nameSuccess && (
              <div className="flex items-center gap-2 text-sm text-[#14B8A6]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Name updated successfully
              </div>
            )}
            <button
              type="submit"
              disabled={nameLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold text-white hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {nameLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Save changes'}
            </button>
          </form>
        </div>

        <div className="bg-[#0D1728] border border-white/8 rounded-2xl p-6">
          <h2 className="font-semibold mb-5">Change password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#CBD5E1]">New password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94A3B8] transition-colors">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#CBD5E1]">Confirm new password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#475569] hover:text-[#94A3B8] transition-colors">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {passwordError && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-center gap-2 text-sm text-[#14B8A6]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Password updated successfully
              </div>
            )}
            <button
              type="submit"
              disabled={passwordLoading || !newPassword}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold text-white hover:shadow-lg transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {passwordLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Updating...</> : 'Update password'}
            </button>
          </form>
        </div>

        <div className="bg-[#0D1728] border border-red-500/15 rounded-2xl p-6">
          <h2 className="font-semibold mb-2 text-red-400">Danger zone</h2>
          <p className="text-sm text-[#64748B] mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-all">
            Delete account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
