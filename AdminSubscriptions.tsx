import { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { AdminLayout } from '../../components/AdminLayout';
import { supabase } from '../../lib/supabase';

interface SubscriptionRow {
  id: string;
  customer_id: string;
  subscription_id: string | null;
  status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  created_at: string;
}

const statusColors: Record<string, string> = {
  active: 'bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20',
  trialing: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  canceled: 'bg-red-500/15 text-red-400 border-red-500/20',
  past_due: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  not_started: 'bg-white/8 text-[#64748B] border-white/10',
};

export function AdminSubscriptions() {
  const [subs, setSubs] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('stripe_subscriptions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setSubs(data || []); setLoading(false); });
  }, []);

  return (
    <AdminLayout title="Subscriptions">
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-bold">Subscriptions</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{subs.filter(s => s.status === 'active').length} active subscriptions</p>
        </div>

        <div className="bg-[#0D1728] border border-white/8 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/8 text-xs text-[#64748B] font-medium uppercase tracking-wider">
            <div className="col-span-4">Customer ID</div>
            <div className="col-span-3">Subscription ID</div>
            <div className="col-span-2">Renews</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Cancel</div>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-white/4 rounded-xl animate-pulse" />)}</div>
          ) : subs.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-10 h-10 text-[#334155] mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">No subscriptions yet</p>
            </div>
          ) : (
            <div>
              {subs.map((s, i) => (
                <div key={s.id} className={`grid grid-cols-12 gap-4 px-5 py-3.5 items-center text-sm ${i < subs.length - 1 ? 'border-b border-white/6' : ''} hover:bg-white/3 transition-all`}>
                  <div className="col-span-4 text-xs text-[#94A3B8] font-mono truncate">{s.customer_id.slice(0, 18)}...</div>
                  <div className="col-span-3 text-xs text-[#64748B] font-mono truncate">{s.subscription_id ? s.subscription_id.slice(0, 14) + '...' : '—'}</div>
                  <div className="col-span-2 text-xs text-[#94A3B8]">
                    {s.current_period_end ? new Date(s.current_period_end * 1000).toLocaleDateString('en-GB') : '—'}
                  </div>
                  <div className="col-span-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusColors[s.status] || 'bg-white/8 text-[#64748B] border-white/10'}`}>
                      {s.status}
                    </span>
                  </div>
                  <div className="col-span-1 text-xs text-[#64748B]">
                    {s.cancel_at_period_end ? 'Yes' : '—'}
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
