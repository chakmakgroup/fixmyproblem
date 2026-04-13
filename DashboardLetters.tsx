import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Download, Copy, Plus, CheckCircle, Search } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { pdfService } from '../../services/pdfService';

interface Letter {
  id: string;
  type: string;
  status: string;
  generated_text: string | null;
  created_at: string;
  full_name: string;
}

export function DashboardLetters() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('documents')
      .select('id,type,status,generated_text,created_at,full_name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setLetters(data || []); setLoading(false); });
  }, [user]);

  const handleCopy = (letter: Letter) => {
    if (!letter.generated_text) return;
    navigator.clipboard.writeText(letter.generated_text);
    setCopied(letter.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (letter: Letter) => {
    if (!letter.generated_text) return;
    pdfService.downloadPDF({ letterText: letter.generated_text, filename: `fixmyproblem-${letter.type}-letter.pdf` });
  };

  const filtered = letters.filter(l =>
    !search || l.type.toLowerCase().includes(search.toLowerCase()) || l.full_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Letters">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Letters</h1>
            <p className="text-sm text-[#64748B] mt-0.5">{letters.length} letter{letters.length !== 1 ? 's' : ''} generated</p>
          </div>
          <button
            onClick={() => navigate('/start')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold text-white hover:shadow-lg transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            New letter
          </button>
        </div>

        {letters.length > 3 && (
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
            <input
              type="text"
              placeholder="Search letters..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#4F7DF3]/40 transition-all"
            />
          </div>
        )}

        {loading ? (
          <div className="space-y-3">{[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-[#0D1728] border border-white/8 rounded-2xl animate-pulse" />
          ))}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#0D1728] border border-white/8 rounded-2xl">
            <Mail className="w-12 h-12 text-[#334155] mx-auto mb-4" />
            <h3 className="font-semibold mb-2">{search ? 'No matching letters' : 'No letters yet'}</h3>
            <p className="text-sm text-[#64748B] mb-5 max-w-xs mx-auto">
              {search ? 'Try a different search term.' : 'Generate your first complaint or appeal letter to get started.'}
            </p>
            {!search && (
              <button onClick={() => navigate('/start')} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold text-white hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" /> Generate a letter
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((l) => (
              <div key={l.id} className="flex items-center gap-4 p-4 bg-[#0D1728] border border-white/8 rounded-2xl">
                <div className="w-10 h-10 bg-white/6 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#64748B]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white capitalize">{l.type.replace('_', ' ')} letter</div>
                  <div className="text-xs text-[#64748B] mt-0.5">
                    {new Date(l.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${
                  l.status === 'paid' ? 'bg-[#14B8A6]/15 text-[#14B8A6] border-[#14B8A6]/20'
                  : l.status === 'generated' ? 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
                  : 'bg-white/8 text-[#64748B] border-white/10'
                }`}>
                  {l.status === 'paid' ? 'Unlocked' : l.status === 'generated' ? 'Preview' : 'Draft'}
                </span>
                {l.status === 'paid' && l.generated_text && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(l)}
                      className="p-2 text-[#475569] hover:text-white hover:bg-white/8 rounded-lg transition-all"
                      title="Copy text"
                    >
                      {copied === l.id ? <CheckCircle className="w-4 h-4 text-[#14B8A6]" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDownload(l)}
                      className="p-2 text-[#475569] hover:text-white hover:bg-white/8 rounded-lg transition-all"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {l.status === 'generated' && (
                  <button
                    onClick={() => navigate(`/result/${l.id}`)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#4F7DF3]/15 text-[#4F7DF3] hover:bg-[#4F7DF3]/25 transition-all font-medium"
                  >
                    Unlock
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
