import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';

export function StartPage() {
  const navigate = useNavigate();

  const problems = [
    { id: 'parking', title: 'Parking Ticket Appeal', icon: '🅿️', route: '/form/parking', description: 'Challenge unfair parking tickets and PCNs' },
    { id: 'refund', title: 'Refund Request', icon: '💰', route: '/form/refund', description: 'Get your money back for faulty goods or services' },
    { id: 'landlord', title: 'Landlord Complaint', icon: '🏠', route: '/form/landlord', description: 'Address property maintenance and tenancy issues' },
    { id: 'utility', title: 'Utility Complaint', icon: '⚡', route: '/form/utility', description: 'Dispute billing errors and service problems' },
    { id: 'employer', title: 'Employer Issue', icon: '💼', route: '/form/employer', description: 'Raise formal workplace grievances' },
    { id: 'consumer', title: 'Consumer Rights', icon: '🛡️', route: '/form/consumer', description: 'Assert your consumer protection rights' }
  ];

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC]">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F7DF3]/10 rounded-full blur-[120px] animate-glow-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-[120px] animate-glow-pulse-delayed"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-lg bg-[#0D1728]/80 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FixMyProblem</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              What do you need help with?
            </h1>
            <p className="text-lg text-[#CBD5E1]">
              Choose the type of issue you're facing
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((problem, index) => (
              <button
                key={problem.id}
                onClick={() => navigate(problem.route)}
                className="group text-left bg-white/6 hover:bg-white/10 border border-white/8 hover:border-[#4F7DF3]/30 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl active:scale-95 scroll-reveal"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="space-y-4">
                  <div className="text-5xl">{problem.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-[#4F7DF3] transition-colors">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-[#CBD5E1] mb-4">{problem.description}</p>
                    <div className="flex items-center gap-2 text-[#4F7DF3]">
                      <span className="text-sm font-medium">Get started</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[#CBD5E1] hover:text-white transition-colors"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
