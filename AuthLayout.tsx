import { FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] flex flex-col">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#4F7DF3]/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#14B8A6]/6 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 px-6 py-5 flex items-center">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold group-hover:text-[#CBD5E1] transition-colors">FixMyProblem</span>
        </button>
      </header>

      <main className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1>
            <p className="text-[#94A3B8]">{subtitle}</p>
          </div>
          <div className="bg-[#0D1728] border border-white/10 rounded-2xl p-8 shadow-2xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
