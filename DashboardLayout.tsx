import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  FileText, LayoutDashboard, FolderOpen, Mail, HardDrive,
  CreditCard, Settings, LogOut, Menu, X, ChevronRight, Bell
} from 'lucide-react';
import { useAuth } from '../lib/auth';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'My Cases', icon: FolderOpen, href: '/dashboard/cases' },
  { label: 'Letters', icon: Mail, href: '/dashboard/letters' },
  { label: 'Documents', icon: HardDrive, href: '/dashboard/documents' },
  { label: 'Billing', icon: CreditCard, href: '/dashboard/billing' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] || 'U').toUpperCase();

  const Sidebar = () => (
    <aside className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#4F7DF3] to-[#14B8A6] rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold">FixMyProblem</span>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[#4F7DF3]/15 text-white border border-[#4F7DF3]/25'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/6'
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-[#4F7DF3]' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/8 space-y-2">
        <Link
          to="/start"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-white hover:shadow-lg hover:shadow-[#4F7DF3]/20 transition-all"
        >
          <FileText className="w-4 h-4" />
          New letter
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#4F7DF3]/30 to-[#14B8A6]/30 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{profile?.full_name || 'Account'}</div>
            <div className="text-xs text-[#64748B] truncate">{user?.email}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 text-[#475569] hover:text-white hover:bg-white/8 rounded-lg transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] flex">
      <div className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-[#0B1827] border-r border-white/8 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-[#0B1827] border-r border-white/8 h-full z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#64748B] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 lg:ml-60 flex flex-col">
        <header className="sticky top-0 z-20 bg-[#07111F]/90 backdrop-blur-lg border-b border-white/8 px-6 py-3.5 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-[#64748B] hover:text-white -ml-1">
            <Menu className="w-5 h-5" />
          </button>
          {title && (
            <div className="flex items-center gap-2 text-sm text-[#64748B]">
              <span>Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-medium">{title}</span>
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 text-[#64748B] hover:text-white hover:bg-white/6 rounded-lg transition-all">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
