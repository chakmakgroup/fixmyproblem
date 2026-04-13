import React, { useState, useEffect } from 'react';
import { usePimport { ArrowLeft, Download, CredLink } from 'react-router-dom';
import { ArrowLeft, Download, CreditCard as Edit, FileText, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { PaymentButton } from '../components/PaymentButton';
import { Alert } from '../components/ui/Alert';

interface Document {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_paid: boolean;
  preview_content: string;
}

export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const { user, signOut } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setDocument(data);
      } catch (err) {
        setError('Failed to load document');
        console.error('Error fetching document:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [id]);

  const handlePaymentRequired = () => {
    setAuthMessage('Please sign in or create an account to unlock your letter.');
    setShowAuthPrompt(true);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Document not found</h1>
          <p className="text-gray-600">{error || 'The document you\'re looking for doesn\'t exist.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">FixMyProblem</h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500">Sign in</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>

        {showAuthPrompt && (
          <div className="mb-6">
            <Alert type="info" onClose={() => setShowAuthPrompt(false)}>
              {authMessage}
            </Alert>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-400 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">{document.title}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 p-6">
              <div className="prose max-w-none">
                <div 
                  className="whitespace-pre-wrap text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: document.is_paid ? document.content : document.preview_content 
                  }}
                />
              </div>
            </div>
            <div className="flex-1 max-w-xs">
              <PaymentButton onPaymentRequired={handlePaymentRequired} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}