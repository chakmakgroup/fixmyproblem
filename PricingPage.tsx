import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, FileText, Zap, Shield, Users } from 'lucide-react';
import { useAuth } from '../lib/auth';

const memberFeatures = [
  '2 active cases at any time',
  '5 full letters per month',
  'Unlimited edits within fair use',
  'Reply & response analyser',
  'Escalation guidance',
  'Evidence document storage',
  'Saved case history',
  'Full dashboard access',
  'Cancel anytime',
];

const singleFeatures = [
  'One full professionally written letter',
  'Copy, download, or email',
  'UK-formatted with legal references',
  'Download as PDF',
  'No account required',
];

export function PricingPage() {
  const navigate = useNavigate();
  const { user, hasActiveSubscription } = useAuth();

  const handleMembershipCTA = () => {
    if (user) {
      navigate('/checkout/membership');
    } else {
      navigate('/signup', { state: { redirectTo: '/checkout/membership' } });
    }
  };

  const handleSingleLetterCTA = () => {
    navigate('/start');
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-[#4F7DF3]/8 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#14B8A6]/6 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 backdrop-blur-lg bg-[#0D1728]/80 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">FixMyProblem</span>
          </button>
          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-lg bg-white/8 hover:bg-white/12 border border-white/10 text-sm font-medium transition-all">
                Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-sm text-[#94A3B8] hover:text-white transition-colors">Sign in</button>
                <button onClick={() => navigate('/signup')} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold hover:shadow-lg transition-all">
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative pt-20 pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4F7DF3]/10 border border-[#4F7DF3]/20 mb-6">
              <Zap className="w-3.5 h-3.5 text-[#4F7DF3]" />
              <span className="text-xs text-[#4F7DF3] font-semibold tracking-wide uppercase">Simple, honest pricing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Handle your case properly,<br />
              <span className="bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] bg-clip-text text-transparent">
                from first letter to resolution
              </span>
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-xl mx-auto">
              Start with a free preview. Pay only when you're ready to send.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#0D1728] border border-white/10 rounded-2xl p-8 flex flex-col">
              <div className="mb-6">
                <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">One-off</div>
                <h2 className="text-2xl font-bold mb-1">Single Letter</h2>
                <p className="text-[#94A3B8] text-sm">Best for a simple, one-off issue where you just need to send something today.</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold">£10</span>
                  <span className="text-[#64748B] mb-1">one-time</span>
                </div>
                <p className="text-xs text-[#475569] mt-1">No account required</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {singleFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#14B8A6] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#CBD5E1]">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleSingleLetterCTA}
                className="w-full py-3.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 font-semibold text-white transition-all flex items-center justify-center gap-2 group"
              >
                Start your case
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="relative bg-[#0D1728] border-2 border-[#4F7DF3]/40 rounded-2xl p-8 flex flex-col shadow-2xl shadow-[#4F7DF3]/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1 bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] rounded-full text-xs font-bold text-white tracking-wide">
                  BEST FOR ONGOING ISSUES
                </div>
              </div>

              <div className="mb-6">
                <div className="text-xs font-semibold text-[#4F7DF3] uppercase tracking-wider mb-3">Membership</div>
                <h2 className="text-2xl font-bold mb-1">Case Membership</h2>
                <p className="text-[#94A3B8] text-sm">Ongoing help for complaints, appeals, disputes, landlord problems, billing issues, and employer disputes.</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold">£29.99</span>
                  <span className="text-[#64748B] mb-1">/ month</span>
                </div>
                <p className="text-xs text-[#475569] mt-1">Cancel anytime. No lock-in.</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {memberFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#4F7DF3] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#CBD5E1]">{f}</span>
                  </li>
                ))}
              </ul>

              {hasActiveSubscription ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg hover:shadow-[#4F7DF3]/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  Go to dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleMembershipCTA}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg hover:shadow-[#4F7DF3]/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 group"
                >
                  {user ? 'Activate membership' : 'Get started — create account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#475569]">
              Want a simple one-off letter?{' '}
              <button onClick={handleSingleLetterCTA} className="text-[#4F7DF3] hover:underline">
                Continue without an account
              </button>
              {' '}— no sign-up required.
            </p>
          </div>

          <div className="mt-20 grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Shield className="w-5 h-5" />, title: 'UK-formatted letters', body: 'Every letter references relevant UK legislation, consumer rights acts, and regulatory bodies.' },
              { icon: <FileText className="w-5 h-5" />, title: 'Handle the whole case', body: 'From the first letter through to escalation — keep all your case information in one place.' },
              { icon: <Users className="w-5 h-5" />, title: 'Cancel any time', body: 'No lock-in. No hidden fees. Cancel your membership from your dashboard whenever you like.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-6 space-y-3">
                <div className="w-10 h-10 bg-[#4F7DF3]/10 rounded-lg flex items-center justify-center text-[#4F7DF3]">
                  {item.icon}
                </div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
