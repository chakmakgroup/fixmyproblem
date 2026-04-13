import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Download,
  ChevronDown,
  Star,
  CheckCircle2,
  Shield,
  Lock,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  Send,
  Bot,
  User,
  Check
} from 'lucide-react';
import { useAuth } from '../lib/auth';

export function HomePage() {
  const navigate = useNavigate();
  const { user, hasActiveSubscription } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countersVisible, setCountersVisible] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [aiTyping, setAiTyping] = useState(true);
  const [aiVisible, setAiVisible] = useState(false);
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setAiTyping(false), 1800);
    const t2 = setTimeout(() => setAiVisible(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const problems = [
    { id: 'parking', title: 'Parking Ticket Appeal', icon: '🅿️', route: '/form/parking' },
    { id: 'refund', title: 'Refund Request', icon: '💰', route: '/form/refund' },
    { id: 'landlord', title: 'Landlord Complaint', icon: '🏠', route: '/form/landlord' },
    { id: 'utility', title: 'Utility Complaint', icon: '⚡', route: '/form/utility' },
    { id: 'employer', title: 'Employer Issue', icon: '💼', route: '/form/employer' },
    { id: 'consumer', title: 'Consumer Rights', icon: '🛡️', route: '/form/consumer' }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      location: 'Camden',
      text: 'Got my parking ticket overturned using the letter. Saved me £130 and took less than 5 minutes to create.',
      rating: 5
    },
    {
      name: 'James Thompson',
      location: 'Manchester',
      text: 'The letter was more professional than anything I could have written. My refund came through in 2 weeks.',
      rating: 5
    },
    {
      name: 'Emma Richardson',
      location: 'Hackney',
      text: 'Brilliant service. The letter referenced all the right laws and regulations. Exactly what I needed.',
      rating: 5
    }
  ];

  const faqs = [
    {
      question: 'How does FixMyProblem work?',
      answer: 'Simply choose your problem type, upload any evidence or details, and our AI generates a professional UK-formatted complaint letter referencing relevant laws and regulations. You can review, edit if needed, and download as PDF.'
    },
    {
      question: 'What types of problems can you help with?',
      answer: 'We handle parking ticket appeals, refund requests, landlord disputes, utility complaints, employer issues, consumer rights cases, and many other UK legal matters requiring formal complaint letters.'
    },
    {
      question: 'Are the letters legally valid?',
      answer: 'Yes. Our letters are formatted according to UK legal standards and reference appropriate consumer rights legislation, regulatory bodies, and legal frameworks relevant to your case.'
    },
    {
      question: 'How long does it take?',
      answer: 'Most users complete their letter in under 2 minutes. You just need to provide basic details and upload any supporting evidence like photos, receipts, or correspondence.'
    },
    {
      question: 'Is my information secure?',
      answer: 'Absolutely. All data is encrypted and we never share your information. Your letters and evidence are processed securely and you can delete them at any time.'
    }
  ];

  const trustMarqueeItems = [
    'Camden Council',
    'Hackney Council',
    'Islington Council',
    'Manchester City',
    'Haringey Council',
    'Westminster',
    'Tower Hamlets',
    'Retail Disputes',
    'Parking Appeals',
    'Utility Providers'
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCountersVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const Counter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!countersVisible) return;

      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, [countersVisible, end]);

    return <>{count.toLocaleString()}{suffix}</>;
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC]">
      {/* Animated Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F7DF3]/10 rounded-full blur-[120px] animate-glow-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-[120px] animate-glow-pulse-delayed"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-[#0D1728]/80 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button onClick={() => navigate('/')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FixMyProblem</span>
            </button>

            <nav className="hidden md:flex items-center gap-6">
              <a href="#how-it-works" className="text-[#94A3B8] hover:text-white transition-colors text-sm">How it works</a>
              <button onClick={() => navigate('/pricing')} className="text-[#94A3B8] hover:text-white transition-colors text-sm">Pricing</button>
              <a href="#faq" className="text-[#94A3B8] hover:text-white transition-colors text-sm">FAQ</a>
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2 rounded-lg bg-white/8 hover:bg-white/12 border border-white/10 transition-all text-sm font-semibold"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/login')} className="text-sm text-[#94A3B8] hover:text-white transition-colors">Sign in</button>
                  <button
                    onClick={() => navigate('/start')}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-lg hover:shadow-[#4F7DF3]/20 transition-all text-sm font-semibold"
                  >
                    Start your letter
                  </button>
                </>
              )}
            </nav>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 animate-fade-in">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block text-[#CBD5E1] hover:text-white transition-colors py-2">How it works</a>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/pricing'); }} className="block w-full text-left text-[#CBD5E1] hover:text-white transition-colors py-2">Pricing</button>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block text-[#CBD5E1] hover:text-white transition-colors py-2">FAQ</a>
              {user ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full px-5 py-2 rounded-lg bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold transition-all text-sm"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="w-full px-5 py-2 rounded-lg bg-white/6 hover:bg-white/10 border border-white/8 transition-all text-sm"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                    className="w-full px-5 py-2 rounded-lg bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold transition-all text-sm"
                  >
                    Create account
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Deep glow orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#4F7DF3]/12 rounded-full blur-[130px]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#14B8A6]/8 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative max-w-3xl mx-auto text-center animate-fade-in-up">
          {/* Label */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4F7DF3]/10 border border-[#4F7DF3]/25 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-[#4F7DF3]" />
            <span className="text-xs text-[#4F7DF3] font-semibold tracking-wide uppercase">AI Letter Generator</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
            Save money by generating{' '}
            <span className="bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] bg-clip-text text-transparent">
              powerful complaint letters
            </span>{' '}
            in seconds
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl mx-auto mb-10 leading-relaxed">
            Appeal parking tickets, refunds, landlord issues and more — instantly with AI
          </p>

          {/* Chat Window */}
          <div className="relative mx-auto max-w-2xl mb-8">
            <div className="absolute -inset-px bg-gradient-to-r from-[#4F7DF3]/40 to-[#14B8A6]/40 rounded-2xl blur-lg opacity-60"></div>
            <div className="relative bg-[#0B1525] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/8 bg-[#0D1A2D]">
                <div className="w-7 h-7 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">FixMyProblem AI</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-[#64748B]">Active</span>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-5 space-y-4">
                {/* User message */}
                <div className="flex items-end justify-end gap-3">
                  <div className="bg-[#4F7DF3] text-white px-4 py-3 rounded-2xl rounded-br-sm max-w-xs text-sm text-left leading-relaxed shadow-lg">
                    Generate a letter to appeal my £130 parking ticket
                  </div>
                  <div className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5">
                    <User className="w-3.5 h-3.5 text-white/70" />
                  </div>
                </div>

                {/* AI response / typing */}
                <div className="flex items-end gap-3">
                  <div className="w-7 h-7 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-full flex items-center justify-center flex-shrink-0 mb-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-[#131F33] border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm max-w-sm text-sm text-left leading-relaxed min-h-[48px] flex items-center">
                    {aiTyping ? (
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="w-2 h-2 bg-[#4F7DF3] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-[#4F7DF3] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-[#4F7DF3] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    ) : (
                      <div className={`transition-opacity duration-500 ${aiVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <span className="text-[#F8FAFC]">Your professional appeal letter is ready </span>
                        <span className="text-[#14B8A6] font-medium">— based on UK regulations </span>
                        <span className="text-[#94A3B8]">(Traffic Management Act 2004)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Letter preview snippet */}
                {aiVisible && (
                  <div className={`ml-10 bg-white rounded-xl p-4 text-left text-gray-800 text-xs space-y-2 shadow-md transition-all duration-500 ${aiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                    <div className="font-bold text-gray-900 text-sm">RE: Formal Appeal — PCN #4829301</div>
                    <p className="text-gray-600 leading-relaxed">
                      I am writing to formally appeal this Parking Charge Notice pursuant to the{' '}
                      <span className="text-blue-600 font-medium">Traffic Management Act 2004</span>{' '}
                      and{' '}
                      <span className="text-blue-600 font-medium">Civil Enforcement Regulations 2007</span>...
                    </p>
                    <div className="flex gap-1.5 pt-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">Legal refs</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">UK-formatted</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Ready to send</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input bar (decorative) */}
              <div className="px-5 py-4 border-t border-white/8 bg-[#0D1A2D]">
                <div className="flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-4 py-3">
                  <span className="flex-1 text-sm text-[#475569] text-left">Describe your problem...</span>
                  <div className="w-7 h-7 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-lg flex items-center justify-center">
                    <Send className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => navigate('/start')}
            className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-2xl hover:shadow-[#4F7DF3]/30 hover:scale-[1.03] transition-all duration-200 font-semibold text-lg text-white cta-glow mb-8"
          >
            Generate my letter
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#F4B740] text-[#F4B740]" />
              ))}
            </div>
            <p className="text-sm text-[#94A3B8] italic">
              "Saved me £130 in minutes — absolute lifesaver"
            </p>
            <span className="hidden sm:block text-[#334155]">·</span>
            <span className="text-xs text-[#475569]">67,000+ letters generated</span>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-8 text-sm text-[#475569]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
              <span>UK-formatted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#14B8A6]" />
              <span>Private & secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Download className="w-4 h-4 text-[#14B8A6]" />
              <span>Download as PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Marquee */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-white/8 bg-white/3 overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...trustMarqueeItems, ...trustMarqueeItems].map((item, index) => (
              <span key={index} className="flex items-center gap-2 mx-6 text-[#CBD5E1] text-sm whitespace-nowrap">
                <Shield className="w-4 h-4" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              How it works
            </h2>
            <p className="text-lg text-[#CBD5E1] max-w-2xl mx-auto">
              Three simple steps to get your professional complaint letter
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <FileText className="w-6 h-6" />,
                title: 'Choose your problem',
                description: 'Select from parking tickets, refunds, landlord issues, and more. We handle all common UK disputes.'
              },
              {
                step: '02',
                icon: <Upload className="w-6 h-6" />,
                title: 'Upload details or evidence',
                description: 'Add photos, receipts, or emails. Answer a few simple questions about your situation.'
              },
              {
                step: '03',
                icon: <Download className="w-6 h-6" />,
                title: 'Get a ready-to-send letter',
                description: 'Review your professionally formatted letter, make any edits, and download as PDF instantly.'
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group relative bg-white/6 hover:bg-white/8 border border-white/8 rounded-2xl p-8 transition-all hover:scale-105 hover:shadow-xl scroll-reveal"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute top-8 right-8 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors">
                  {item.step}
                </div>
                <div className="relative space-y-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-xl flex items-center justify-center shadow-lg">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-[#CBD5E1] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0D1728]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              What can we help you with?
            </h2>
            <p className="text-lg text-[#CBD5E1] max-w-2xl mx-auto">
              Choose your issue type and get started immediately
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
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{problem.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#4F7DF3] transition-colors">
                      {problem.title}
                    </h3>
                    <ArrowRight className="w-5 h-5 text-[#CBD5E1] group-hover:text-[#4F7DF3] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Letter Preview */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Professional, legally formatted letters
            </h2>
            <p className="text-lg text-[#CBD5E1] max-w-2xl mx-auto">
              Every letter includes relevant UK legislation and is ready to send
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-gray-900 scroll-reveal document-card">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <div className="text-sm text-gray-600 font-medium">Your Name</div>
                <div className="text-sm text-gray-600">Your Address</div>
                <div className="text-sm text-gray-600">Date: {new Date().toLocaleDateString('en-GB')}</div>
              </div>

              <div>
                <div className="text-sm text-gray-600 mb-2 font-medium">To:</div>
                <div className="text-sm font-semibold">Parking Services Department</div>
                <div className="text-sm text-gray-600">Council Name</div>
                <div className="text-sm text-gray-600">Address</div>
              </div>

              <div>
                <div className="font-bold mb-4 text-base">RE: Formal Appeal - Parking Charge Notice [PCN Number]</div>

                <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                  <p>Dear Sir/Madam,</p>

                  <p>
                    I am writing to formally appeal the Parking Charge Notice issued to me on [date]
                    for the alleged contravention of parking regulations at [location].
                  </p>

                  <p>
                    I wish to appeal this notice on the following grounds, with reference to the
                    Traffic Management Act 2004 and the Civil Enforcement of Parking Contraventions (England)
                    General Regulations 2007:
                  </p>

                  <p className="pl-4">
                    <span className="font-medium">1. </span>
                    The signage at the location was unclear and did not meet the requirements set out in
                    the Traffic Signs Regulations and General Directions 2016...
                  </p>

                  <div className="bg-gray-100 p-4 rounded-lg text-center text-xs text-gray-500 italic border border-gray-200">
                    [Letter continues with full legal arguments and evidence...]
                  </div>

                  <p>I have attached photographic evidence supporting my appeal.</p>

                  <p>
                    I look forward to your response within 14 days as required under the parking
                    regulations guidance.
                  </p>

                  <p>Yours faithfully,<br />[Your Name]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0D1728]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Trusted by thousands
            </h2>
            <p className="text-lg text-[#CBD5E1] max-w-2xl mx-auto">
              See what our customers say about their experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/6 border border-white/8 rounded-2xl p-8 space-y-4 hover:bg-white/8 hover:scale-105 transition-all scroll-reveal"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F4B740] text-[#F4B740]" />
                  ))}
                </div>
                <p className="text-[#CBD5E1] leading-relaxed">{testimonial.text}</p>
                <div className="pt-4 border-t border-white/8">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-[#CBD5E1]">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-12">
            <div className="text-center space-y-2 scroll-reveal">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] bg-clip-text text-transparent">
                <Counter end={67000} />+
              </div>
              <div className="text-[#CBD5E1]">Letters generated</div>
            </div>
            <div className="text-center space-y-2 scroll-reveal" style={{ animationDelay: '100ms' }}>
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] bg-clip-text text-transparent">
                ~<Counter end={2} /> min
              </div>
              <div className="text-[#CBD5E1]">Average completion time</div>
            </div>
            <div className="text-center space-y-2 scroll-reveal" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] bg-clip-text text-transparent">
                <Counter end={98} />%
              </div>
              <div className="text-[#CBD5E1]">Say it was easier than writing themselves</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0D1728]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Simple, honest pricing</h2>
            <p className="text-lg text-[#CBD5E1] max-w-xl mx-auto">Start with a free preview. Pay when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/6 border border-white/8 rounded-2xl p-7 flex flex-col scroll-reveal">
              <div className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">One-off</div>
              <h3 className="text-2xl font-bold mb-1">Single Letter</h3>
              <p className="text-[#94A3B8] text-sm mb-5">For a simple, one-off issue — no account needed.</p>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-bold">£10</span>
                <span className="text-[#64748B] mb-1">one-time</span>
              </div>
              <ul className="space-y-2 mb-7 flex-1">
                {['Full professionally written letter', 'Copy, download or email', 'No account required', 'UK-formatted with legal references'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                    <Check className="w-4 h-4 text-[#14B8A6] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/start')} className="w-full py-3 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 font-semibold text-white transition-all">
                Start your letter
              </button>
            </div>
            <div className="relative bg-white/6 border-2 border-[#4F7DF3]/40 rounded-2xl p-7 flex flex-col shadow-2xl scroll-reveal" style={{ animationDelay: '100ms' }}>
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1 bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] rounded-full text-xs font-bold text-white">BEST VALUE</div>
              </div>
              <div className="text-xs font-semibold text-[#4F7DF3] uppercase tracking-wider mb-3">Membership</div>
              <h3 className="text-2xl font-bold mb-1">Case Membership</h3>
              <p className="text-[#94A3B8] text-sm mb-5">Ongoing help for complaints, disputes, and appeals.</p>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-bold">£29.99</span>
                <span className="text-[#64748B] mb-1">/ month</span>
              </div>
              <ul className="space-y-2 mb-7 flex-1">
                {['2 active cases', '5 letters per month', 'Reply & response analyser', 'Escalation guidance', 'Evidence document storage', 'Full case dashboard', 'Cancel anytime'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#CBD5E1]">
                    <Check className="w-4 h-4 text-[#4F7DF3] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate(user ? '/pricing' : '/signup')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg hover:shadow-[#4F7DF3]/20 transition-all"
              >
                {user ? (hasActiveSubscription ? 'Go to dashboard' : 'Activate membership') : 'Get started'}
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-[#475569] mt-6">
            No account needed for a single letter.{' '}
            <button onClick={() => navigate('/pricing')} className="text-[#4F7DF3] hover:underline">
              Compare all options
            </button>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#07111F]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/6 border border-white/8 rounded-2xl overflow-hidden scroll-reveal"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/3 transition-colors"
                >
                  <span className="font-semibold pr-8">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-5 text-[#CBD5E1] leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center scroll-reveal">
          <div className="bg-gradient-to-br from-[#4F7DF3]/10 to-[#14B8A6]/10 border border-[#4F7DF3]/20 rounded-3xl p-12 sm:p-16 space-y-8 hover:scale-105 transition-all">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Start your complaint in minutes
            </h2>
            <p className="text-lg sm:text-xl text-[#CBD5E1] max-w-2xl mx-auto">
              Get a professional letter you can review, pay for, and download instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/start')}
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-lg hover:shadow-[#4F7DF3]/20 hover:scale-105 transition-all font-semibold flex items-center justify-center gap-2 cta-glow"
              >
                Start now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => setShowExampleModal(true)}
                className="px-8 py-4 rounded-xl bg-white/6 hover:bg-white/10 hover:scale-105 border border-white/8 transition-all font-semibold">
                View example
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">FixMyProblem</span>
            </div>
            <div className="text-sm text-[#CBD5E1]">
              © 2024 FixMyProblem. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Example Modal */}
      {showExampleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-[#0D1728] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-[#0D1728] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Example Professional Letter</h3>
                <p className="text-sm text-[#CBD5E1]">See the kind of letter you can generate in minutes</p>
              </div>
              <button
                onClick={() => setShowExampleModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="bg-white rounded-xl p-8 text-gray-900 shadow-lg">
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-semibold">John Smith</div>
                    <div className="text-gray-600">123 High Street</div>
                    <div className="text-gray-600">London, SW1A 1AA</div>
                    <div className="text-gray-600 mt-2">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>

                  <div className="pt-4">
                    <div className="font-semibold">Parking Services Department</div>
                    <div className="text-gray-600">Westminster City Council</div>
                    <div className="text-gray-600">PO Box 123</div>
                    <div className="text-gray-600">London, W1A 1AA</div>
                  </div>

                  <div className="pt-4 font-bold">
                    RE: Formal Appeal - Parking Charge Notice PCN123456789
                  </div>

                  <div className="space-y-3 text-gray-700 leading-relaxed">
                    <p>Dear Sir/Madam,</p>

                    <p>I am writing to formally appeal the Parking Charge Notice PCN123456789 issued to me on 15th March 2024 for the alleged contravention of parking regulations at High Street Car Park, Westminster.</p>

                    <p>I wish to appeal this notice on the following grounds, with reference to the Traffic Management Act 2004 and the Civil Enforcement of Parking Contraventions (England) General Regulations 2007:</p>

                    <div className="pl-4 space-y-2">
                      <p><span className="font-medium">1.</span> The signage at the location was unclear and did not meet the requirements set out in the Traffic Signs Regulations and General Directions 2016. The relevant parking restrictions were not adequately displayed, making it impossible for a reasonable driver to understand the applicable regulations.</p>

                      <p><span className="font-medium">2.</span> At the time of the alleged contravention, I was displaying a valid parking permit clearly visible on my dashboard, as evidenced by the photographs I have attached to this appeal.</p>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-400 p-4 my-4">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Full letter available after payment</p>
                          <p className="text-xs text-gray-600 mt-1">Complete letters include detailed legal arguments, relevant case law references, and professional formatting ready to send</p>
                        </div>
                      </div>
                    </div>

                    <p>I have attached photographic evidence supporting my appeal, including images of the unclear signage and my valid parking permit.</p>

                    <p>I request that this Parking Charge Notice be cancelled in full. I look forward to your response within 14 days as required under the parking regulations guidance.</p>

                    <p>Should you require any further information, please do not hesitate to contact me.</p>

                    <p className="pt-2">Yours faithfully,</p>
                    <p className="font-semibold">John Smith</p>
                    <p className="text-gray-600">Email: john.smith@email.com</p>
                    <p className="text-gray-600">Phone: 07700 900000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-[#0D1728] border-t border-white/10 px-6 py-4">
              <button
                onClick={() => {
                  setShowExampleModal(false);
                  navigate('/start');
                }}
                className="w-full px-8 py-3 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Start creating your letter
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
