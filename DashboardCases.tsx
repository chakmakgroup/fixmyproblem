import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderOpen, Plus, ArrowRight, Search } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

interface Case {
  id: string;
  title: string;
  category: string;
  status: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  drafting: { label: 'Drafting', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20' },
  'awaiting response': { label: 'Awaiting response', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  'response received': { label: 'Response received', color: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
  'escalation suggested': { label: 'Escalation suggested', color: 'bg-red-500/15 text-red-400 border-red-500/20' },
  closed: { label: 'Closed', color: 'bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20' },
};

const categoryIcons: Record<string, string> = {
  parking: '🅿️', refund: '💰', landlord: '🏠', utility: '⚡', employer: '💼', consumer: '🛡️',
};

export function DashboardCases() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase
      .from('cases')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data }) => { setCases(data || []); setLoading(false); });
  }, [user]);

  const filtered = cases.filter(c =>
    !search ||
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.category?.toLowerCase().includes(search.toLowerCase()) ||
    c.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="My Cases">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">My Cases</h1>
            <p className="text-sm text-[#64748B] mt-0.5">{cases.length} case{cases.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => navigate('/start')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold text-white hover:shadow-lg transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New case
          </button>
        </div>

        {cases.length > 3 && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
            <input
              type="text"
              placeholder="Search cases..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/40 transition-all"
            />
          </div>
        )}

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-[#0D1728] border border-white/8 rounded-2xl animate-pulse" />
          ))}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#0D1728] border border-white/8 rounded-2xl">
            <FolderOpen className="w-12 h-12 text-[#334155] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{search ? 'No matching cases' : 'No cases yet'}</h3>
            <p className="text-sm text-[#64748B] mb-5 max-w-xs mx-auto">
              {search ? 'Try a different search term.' : 'Start by generating a letter for your first complaint or dispute.'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/start')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold text-white hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Start your first case
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => {
              const sc = statusConfig[c.status] || { label: c.status, color: 'bg-white/8 text-[#94A3B8] border-white/10' };
              return (
                <button
                  key={c.id}
                  onClick={() => navigate(`/dashboard/cases/${c.id}`)}
                  className="w-full flex items-center gap-4 p-4 bg-[#0D1728] border border-white/8 rounded-2xl hover:bg-[#0D1728]/80 hover:border-white/15 transition-all group text-left"
                >
                  <div className="text-2xl flex-shrink-0">{categoryIcons[c.category] || '📋'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white group-hover:text-[#4F7DF3] transition-colors truncate">
                      {c.title || `${c.category} case`}
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5 capitalize">
                      {c.category} · Updated {new Date(c.updated_at).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 capitalize ${sc.color}`}>
                    {sc.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#475569] group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
