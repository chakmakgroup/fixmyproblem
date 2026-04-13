import { useEffect, useState } from 'react';
import { Mail, Search } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';

interface LetterRow {
  id: string;
  user_id: string | null;
  type: string;
  status: string;
  full_name: string;
  email: string;
  created_at: string;
}

export function AdminLetters() {
  const [letters, setLetters] = useState<LetterRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('documents')
      .select('id,user_id,type,status,full_name,email,created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setLetters(data || []); setLoading(false); });
  }, []);

  const filtered = letters.filter(l =>
    !search || l.type.toLowerCase().includes(search.toLowerCase()) || l.full_name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Letters">
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-bold">Letters</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{letters.length} letters generated · {letters.filter(l => l.status === 'paid').length} paid</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input type="text" placeholder="Search by type, name, email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/40 transition-all" />
        </div>

        <div className="bg-[#0D1728] border border-white/8 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/8 text-xs text-[#64748B] font-medium uppercase tracking-wider">
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-white/4 rounded-xl animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-10 h-10 text-[#334155] mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">{search ? 'No matching letters' : 'No letters yet'}</p>
            </div>
          ) : (
            <div>
              {filtered.map((l, i) => (
                <div key={l.id} className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center ${i < filtered.length - 1 ? 'border-b border-white/6' : ''} hover:bg-white/3 transition-all`}>
                  <div className="col-span-2 text-sm capitalize text-[#CBD5E1]">{l.type}</div>
                  <div className="col-span-3 text-sm text-white truncate">{l.full_name}</div>
                  <div className="col-span-3 text-xs text-[#64748B] truncate">{l.email}</div>
                  <div className="col-span-2 text-xs text-[#94A3B8]">
                    {new Date(l.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </div>
                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${
                      l.status === 'paid' ? 'bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20'
                      : l.status === 'generated' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
                      : 'bg-white/8 text-[#64748B] border-white/10'
                    }`}>
                      {l.status === 'paid' ? 'Paid' : l.status === 'generated' ? 'Preview' : 'Draft'}
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
