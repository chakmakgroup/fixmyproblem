import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Mail, ArrowRight, Plus, Clock, CheckCircle2, AlertCircle, Sparkles, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

interface CaseSummary {
  id: string;
  title: string;
  category: string;
  status: string;
  updated_at: string;
}

interface LetterSummary {
  id: string;
  type: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  drafting: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'awaiting response': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'response received': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'escalation suggested': 'bg-red-500/15 text-red-400 border-red-500/20',
  closed: 'bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20',
};

export function DashboardOverview() {
  const navigate = useNavigate();
  const { user, profile, hasActiveSubscription } = useAuth();
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [letters, setLetters] = useState<LetterSummary[]>([]);
  const [lettersThisMonth, setLettersThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [casesRes, lettersRes] = await Promise.all([
        supabase.from('cases').select('id,title,category,status,updated_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(5),
        supabase.from('documents').select('id,type,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ]);
      setCases(casesRes.data || []);
      setLetters(lettersRes.data || []);
      const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
      const monthLetters = (lettersRes.data || []).filter(l => new Date(l.created_at) >= startOfMonth);
      setLettersThisMonth(monthLetters.length);
      setLoading(false);
    };
    load();
  }, [user]);

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hello, {firstName}</h1>
            <p className="text-[#64748B] text-sm">Here's what's happening with your cases.</p>
          </div>
          <button
            onClick={() => navigate('/start')}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold text-white hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            New letter
          </button>
        </div>

        {!hasActiveSubscription && (
          <div className="bg-[#0D1728] border border-[#4F7DF3]/25 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-[#4F7DF3]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#4F7DF3]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Activate your membership</h3>
              <p className="text-sm text-[#94A3B8] mb-3">
                Get up to 2 active cases, 5 letters per month, reply analysis, escalation guidance, and full case history for £29.99/month.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center gap-2 text-sm text-[#4F7DF3] hover:text-[#6B95F5] font-medium transition-colors group"
              >
                View membership
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Active cases', value: cases.filter(c => c.status !== 'closed').length, icon: FolderOpen, color: 'text-[#4F7DF3]', bg: 'bg-[#4F7DF3]/10' },
            { label: 'Letters this month', value: `${lettersThisMonth} / 5`, icon: Mail, color: 'text-[#14B8A6]', bg: 'bg-[#14B8A6]/10' },
            { label: 'Total letters', value: letters.length, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0D1728] border border-white/8 rounded-2xl p-5">
              <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold mb-0.5">{loading ? '—' : stat.value}</div>
              <div className="text-xs text-[#64748B]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#0D1728] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent cases</h2>
              <button onClick={() => navigate('/dashboard/cases')} className="text-xs text-[#4F7DF3] hover:text-[#6B95F5] transition-colors">
                View all
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-white/4 rounded-xl animate-pulse" />
              ))}</div>
            ) : cases.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-10 h-10 text-[#334155] mx-auto mb-3" />
                <p className="text-[#64748B] text-sm mb-3">No cases yet</p>
                <button onClick={() => navigate('/start')} className="inline-flex items-center gap-2 text-sm text-[#4F7DF3] font-medium">
                  <Plus className="w-4 h-4" /> Start your first case
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/dashboard/cases/${c.id}`)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group text-left"
                  >
                    <div className="w-8 h-8 bg-white/6 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{c.title || c.category}</div>
                      <div className="text-xs text-[#64748B]">{new Date(c.updated_at).toLocaleDateString('en-GB')}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize flex-shrink-0 ${statusColors[c.status] || 'bg-white/8 text-[#94A3B8] border-white/10'}`}>
                      {c.status}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0D1728] border border-white/8 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent letters</h2>
              <button onClick={() => navigate('/dashboard/letters')} className="text-xs text-[#4F7DF3] hover:text-[#6B95F5] transition-colors">
                View all
              </button>
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => (
                <div key={i} className="h-12 bg-white/4 rounded-xl animate-pulse" />
              ))}</div>
            ) : letters.length === 0 ? (
              <div className="text-center py-8">
                <Mail className="w-10 h-10 text-[#334155] mx-auto mb-3" />
                <p className="text-[#64748B] text-sm mb-3">No letters yet</p>
                <button onClick={() => navigate('/start')} className="inline-flex items-center gap-2 text-sm text-[#4F7DF3] font-medium">
                  <Plus className="w-4 h-4" /> Generate a letter
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {letters.map((l) => (
                  <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all">
                    <div className="w-8 h-8 bg-white/6 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#64748B]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white capitalize">{l.type.replace('_', ' ')} letter</div>
                      <div className="text-xs text-[#64748B]">{new Date(l.created_at).toLocaleDateString('en-GB')}</div>
                    </div>
                    {l.status === 'paid' ? (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20">Unlocked</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full border bg-yellow-500/15 text-yellow-400 border-yellow-500/20">Draft</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
