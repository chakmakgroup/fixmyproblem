import { useEffect, useState } from 'react';
import { FolderOpen, Search } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';

interface CaseRow {
  id: string;
  user_id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  drafting: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  'awaiting response': 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  'response received': 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  'escalation suggested': 'bg-red-500/15 text-red-400 border-red-500/20',
  closed: 'bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20',
};

export function AdminCases() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('cases')
      .select('id,user_id,title,category,status,created_at,updated_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setCases(data || []); setLoading(false); });
  }, []);

  const filtered = cases.filter(c =>
    !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.category?.toLowerCase().includes(search.toLowerCase()) || c.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Cases">
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-bold">Cases</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{cases.length} total case{cases.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input type="text" placeholder="Search cases..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/40 transition-all" />
        </div>

        <div className="bg-[#0D1728] border border-white/8 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/8 text-xs text-[#64748B] font-medium uppercase tracking-wider">
            <div className="col-span-4">Title / Category</div>
            <div className="col-span-3">User</div>
            <div className="col-span-2">Created</div>
            <div className="col-span-3">Status</div>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-white/4 rounded-xl animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-10 h-10 text-[#334155] mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">{search ? 'No matching cases' : 'No cases yet'}</p>
            </div>
          ) : (
            <div>
              {filtered.map((c, i) => (
                <div key={c.id} className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center ${i < filtered.length - 1 ? 'border-b border-white/6' : ''} hover:bg-white/3 transition-all`}>
                  <div className="col-span-4">
                    <div className="text-sm font-medium text-white truncate">{c.title || `${c.category} case`}</div>
                    <div className="text-xs text-[#64748B] capitalize">{c.category}</div>
                  </div>
                  <div className="col-span-3 text-xs text-[#64748B] font-mono truncate">{c.user_id.slice(0, 14)}...</div>
                  <div className="col-span-2 text-xs text-[#94A3B8]">
                    {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </div>
                  <div className="col-span-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColors[c.status] || 'bg-white/8 text-[#64748B] border-white/10'}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
