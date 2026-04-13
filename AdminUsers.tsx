import { useEffect, useState } from 'react';
import { Users, Search } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';

interface UserRow {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('user_profiles')
      .select('id,full_name,role,created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setUsers(data || []); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.id.includes(search)
  );

  return (
    <AdminLayout title="Users">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Users</h1>
            <p className="text-sm text-[#64748B] mt-0.5">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/40 transition-all"
          />
        </div>

        <div className="bg-[#0D1728] border border-white/8 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/8 text-xs text-[#64748B] font-medium uppercase tracking-wider">
            <div className="col-span-5">Name</div>
            <div className="col-span-4">User ID</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1">Role</div>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-white/4 rounded-xl animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-10 h-10 text-[#334155] mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">{search ? 'No matching users' : 'No users yet'}</p>
            </div>
          ) : (
            <div>
              {filtered.map((u, i) => (
                <div key={u.id} className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center ${i < filtered.length - 1 ? 'border-b border-white/6' : ''} hover:bg-white/3 transition-all`}>
                  <div className="col-span-5 flex items-center gap-3">
                    <div className="w-7 h-7 bg-[#4F7DF3]/15 rounded-full flex items-center justify-center text-xs font-bold text-[#4F7DF3] flex-shrink-0">
                      {(u.full_name?.[0] || '?').toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white truncate">{u.full_name || 'Unknown'}</span>
                  </div>
                  <div className="col-span-4 text-xs text-[#64748B] font-mono truncate">{u.id.slice(0, 16)}...</div>
                  <div className="col-span-2 text-sm text-[#94A3B8]">
                    {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                  </div>
                  <div className="col-span-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${u.role === 'admin' ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-white/8 text-[#64748B] border-white/10'}`}>
                      {u.role}
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
