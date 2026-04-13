import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle2, AlertCircle, ArrowRight, Calendar, Zap } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

interface SubscriptionData {
  status: string;
  subscription_status: string;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
  price_id: string | null;
}

interface Order {
  id: string;
  amount_total: number;
  currency: string;
  status: string;
  created_at: string;
}

export function DashboardBilling() {
  const navigate = useNavigate();
  const { user, hasActiveSubscription, refreshSubscription } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [subRes, ordersRes] = await Promise.all([
        supabase.from('stripe_user_subscriptions').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('stripe_orders').select('id,amount_total,currency,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ]);
      setSubscription(subRes.data);
      setOrders(ordersRes.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const isActive = hasActiveSubscription;
  const renewalDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <DashboardLayout title="Billing">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold mb-0.5">Billing</h1>
          <p className="text-sm text-[#64748B]">Manage your subscription and payment history.</p>
        </div>

        <div className="bg-[#0D1728] border border-white/8 rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-xs text-[#64748B] font-medium uppercase tracking-wider mb-1">Current plan</div>
              <h2 className="text-lg font-bold">{isActive ? 'Case Membership' : 'No active plan'}</h2>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
              isActive ? 'bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20' : 'bg-white/8 text-[#64748B] border-white/10'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {loading ? (
            <div className="h-16 bg-white/4 rounded-xl animate-pulse" />
          ) : isActive ? (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white/4 rounded-xl p-4">
                  <div className="text-xs text-[#64748B] mb-1">Monthly price</div>
                  <div className="font-semibold">£29.99</div>
                </div>
                {renewalDate && (
                  <div className="bg-white/4 rounded-xl p-4">
                    <div className="text-xs text-[#64748B] mb-1">
                      {subscription?.cancel_at_period_end ? 'Cancels on' : 'Renews on'}
                    </div>
                    <div className="font-semibold text-sm">{renewalDate}</div>
                  </div>
                )}
                {subscription?.payment_method_last4 && (
                  <div className="bg-white/4 rounded-xl p-4">
                    <div className="text-xs text-[#64748B] mb-1">Payment method</div>
                    <div className="font-semibold capitalize">
                      {subscription.payment_method_brand} ···· {subscription.payment_method_last4}
                    </div>
                  </div>
                )}
              </div>

              {subscription?.cancel_at_period_end ? (
                <div className="flex items-start gap-3 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-400">Cancellation scheduled</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">Your membership will end on {renewalDate}. You can reactivate any time before this date.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />
                  <p className="text-sm text-[#CBD5E1]">Your membership is active and renews automatically.</p>
                </div>
              )}

              <div className="pt-2">
                <p className="text-xs text-[#475569]">
                  To cancel your membership or update payment details, please contact us or manage via Stripe's customer portal.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#94A3B8]">
                You don't have an active membership. Activate Case Membership to get up to 2 active cases, 5 letters per month, reply analysis, and escalation support.
              </p>
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold text-white hover:shadow-lg transition-all group"
              >
                <Zap className="w-4 h-4" />
                Activate membership
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        <div className="bg-[#0D1728] border border-white/8 rounded-2xl p-6">
          <h2 className="font-semibold mb-4">Payment history</h2>
          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-white/4 rounded-xl animate-pulse" />)}</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-10 h-10 text-[#334155] mx-auto mb-3" />
              <p className="text-sm text-[#64748B]">No payment history yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center gap-4 py-3 border-b border-white/6 last:border-0">
                  <div className="w-8 h-8 bg-white/6 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-[#64748B]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Payment</div>
                    <div className="text-xs text-[#64748B]">
                      <Calendar className="inline w-3 h-3 mr-1" />
                      {new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    £{(o.amount_total / 100).toFixed(2)}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full border bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20 capitalize">
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
