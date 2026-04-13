import { useEffect, useState } from 'react';
import { Users, CreditCard, FileText, FolderOpen, TrendingUp, UserCheck } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';

interface Metrics {
  totalUsers: number;
  activeSubscriptions: number;
  totalLetters: number;
  totalCases: number;
  recentUsers: any[];
  recentOrders: any[];
}

export function AdminOverview() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalLetters: 0,
    totalCases: 0,
    recentUsers: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [usersRes, subsRes, lettersRes, casesRes, recentUsersRes, recentOrdersRes] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('stripe_subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('cases').select('id', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('id,full_name,role,created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('stripe_orders').select('id,amount_total,currency,status,created_at').order('created_at', { ascending: false }).limit(5),
      ]);
      setMetrics({
        totalUsers: usersRes.count || 0,
        activeSubscriptions: subsRes.count || 0,
        totalLetters: lettersRes.count || 0,
        totalCases: casesRes.count || 0,
        recentUsers: recentUsersRes.data || [],
        recentOrders: recentOrdersRes.data || [],
      });
      setLoading(false);
    };
    load();
  }, []);

  const stats = [
    { label: 'Total users', value: metrics.totalUsers, icon: Users, color: 'text-[#4F7DF3]', bg: 'bg-[#4F7DF3]/10' },
    { label: 'Active subscriptions', value: metrics.activeSubscriptions, icon: CreditCard, color: 'text-[#14B8A6]', bg: 'bg-[#14B8A6]/10' },
    { label: 'Total letters', value: metrics.totalLetters, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Total cases', value: metrics.totalCases, icon: FolderOpen, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-0.5">Admin Overview</h1>
          <p className="text-sm text-[#64748B]">Platform metrics and recent activity.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#0D1728] border border-white/8 rounded-2xl p-5">
              <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold mb-0.5">{loading ? '—' : stat.value.toLocaleString()}</div>
              <div className="text-xs text-[#64748B]">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-[#0D1728] border border-white/8 rounded-2xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#4F7DF3]" />
              Recent signups
            </h2>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/4 rounded-xl animate-pulse" />)}</div>
            ) : metrics.recentUsers.length === 0 ? (
              <p className="text-sm text-[#64748B] py-4 text-center">No users yet</p>
            ) : (
              <div className="space-y-2">
                {metrics.recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/6 last:border-0">
                    <div className="w-7 h-7 bg-[#4F7DF3]/15 rounded-full flex items-center justify-center text-xs font-bold text-[#4F7DF3]">
                      {(u.full_name?.[0] || '?').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{u.full_name || 'Unknown'}</div>
                      <div className="text-xs text-[#64748B]">{new Date(u.created_at).toLocaleDateString('en-GB')}</div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${u.role === 'admin' ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-white/8 text-[#64748B] border-white/10'}`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0D1728] border border-white/8 rounded-2xl p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#14B8A6]" />
              Recent payments
            </h2>
            {loading ? (
              <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-white/4 rounded-xl animate-pulse" />)}</div>
            ) : metrics.recentOrders.length === 0 ? (
              <p className="text-sm text-[#64748B] py-4 text-center">No payments yet</p>
            ) : (
              <div className="space-y-2">
                {metrics.recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center gap-3 py-2 border-b border-white/6 last:border-0">
                    <div className="w-7 h-7 bg-[#14B8A6]/15 rounded-full flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5 text-[#14B8A6]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">Payment</div>
                      <div className="text-xs text-[#64748B]">{new Date(o.created_at).toLocaleDateString('en-GB')}</div>
                    </div>
                    <div className="text-sm font-semibold">£{(o.amount_total / 100).toFixed(2)}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20 capitalize">
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
