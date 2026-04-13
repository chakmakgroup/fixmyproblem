import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Copy, FileText, Sparkles, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { documentService } from '../services/documentService';
import { pdfService } from '../services/pdfService';
import { emailService } from '../services/emailService';
import { Document } from '../lib/supabase';
import { useAuth } from '../lib/auth';

export function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<Document | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const documentId = searchParams.get('document_id');

  useEffect(() => {
    const loadDocumentAndSendEmail = async () => {
      if (!documentId) {
        setLoading(false);
        return;
      }

      try {
        const doc = await documentService.getDocument(documentId);
        if (doc && doc.generated_text) {
          setDocument(doc);

          await sendEmailWithPDF(doc);
        }
      } catch (error) {
        console.error('Error loading document:', error);
      }
      setLoading(false);
    };

    loadDocumentAndSendEmail();
  }, [documentId]);

  const sendEmailWithPDF = async (doc: Document) => {
    console.log('=== EMAIL DELIVERY DEBUG ===');
    console.log('Document ID:', doc.id);
    console.log('Customer Email from DB:', doc.email);
    console.log('Customer Name from DB:', doc.full_name);
    console.log('Has Generated Text:', !!doc.generated_text);

    if (!doc.email || !doc.generated_text || !doc.full_name) {
      console.error('CRITICAL: Missing required fields for email delivery!', {
        email: doc.email,
        hasText: !!doc.generated_text,
        name: doc.full_name,
      });
      setEmailError('Missing customer information - email cannot be sent');
      return;
    }

    setEmailSending(true);
    setEmailError(null);

    try {
      console.log('Step 1: Generating PDF for email attachment...');
      const pdfBase64 = await pdfService.generateBase64PDF({
        letterText: doc.generated_text,
        filename: 'fixmyproblem-letter.pdf',
      });
      console.log('Step 1: PDF generated successfully, length:', pdfBase64.length);

      console.log('Step 2: Sending email via Supabase Edge Function...');
      console.log('  → Recipient:', doc.email);
      console.log('  → Customer Name:', doc.full_name);
      console.log('  → Letter Length:', doc.generated_text.length, 'characters');

      const result = await emailService.sendLetterEmail({
        to: doc.email,
        customerName: doc.full_name,
        letterText: doc.generated_text,
        pdfBase64,
      });

      console.log('Step 2: Email sent successfully!', result);
      console.log('=== EMAIL DELIVERY SUCCESS ===');
      setEmailSent(true);
    } catch (error) {
      console.error('=== EMAIL DELIVERY FAILED ===');
      console.error('Error:', error);
      setEmailError('Failed to send email. You can still download the PDF below.');
    } finally {
      setEmailSending(false);
    }
  };

  const handleCopyText = () => {
    if (!document?.generated_text) return;
    navigator.clipboard.writeText(document.generated_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    if (!document?.generated_text) return;

    try {
      pdfService.downloadPDF({
        letterText: document.generated_text,
        filename: 'fixmyproblem-letter.pdf',
      });
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111F] text-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-[#4F7DF3] mx-auto mb-4 animate-spin" />
          <p className="text-[#CBD5E1]">Loading your letter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F7DF3]/10 rounded-full blur-[120px] animate-glow-pulse"></div>
      </div>

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

      <main className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#14B8A6] to-[#10B981] rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Payment Successful!
            </h1>
            <p className="text-lg text-[#CBD5E1]">
              Your letter is now unlocked and ready to use
            </p>
          </div>

          {emailSending && (
            <div className="bg-[#4F7DF3]/10 border border-[#4F7DF3]/20 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
              <Sparkles className="w-5 h-5 text-[#4F7DF3] animate-spin" />
              <p className="text-[#CBD5E1]">Sending your letter to {document?.email}...</p>
            </div>
          )}

          {emailSent && (
            <div className="bg-[#14B8A6]/10 border border-[#14B8A6]/20 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
              <Mail className="w-5 h-5 text-[#14B8A6]" />
              <div>
                <p className="text-[#14B8A6] font-semibold">Email sent successfully!</p>
                <p className="text-sm text-[#CBD5E1]">Check your inbox at {document?.email}</p>
              </div>
            </div>
          )}

          {emailError && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-yellow-500 font-semibold">Email delivery issue</p>
                <p className="text-sm text-[#CBD5E1]">{emailError}</p>
              </div>
            </div>
          )}

          {document ? (
            <>
              <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-gray-900 mb-8 animate-fade-in">
                <div style={{ fontFamily: 'Georgia, serif', lineHeight: '1.7', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
                  {document.generated_text}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in">
                <button
                  onClick={handleCopyText}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-[#14B8A6]" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Text
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-lg hover:scale-105 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#14B8A6]" />
                  What's Next?
                </h3>
                <ul className="space-y-2 text-[#CBD5E1]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#14B8A6]">1.</span>
                    <span>Review your letter above and make any personal edits if needed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#14B8A6]">2.</span>
                    <span>Send it via email, post, or upload it to the relevant portal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#14B8A6]">3.</span>
                    <span>Keep a copy for your records (already sent to your email)</span>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 mb-8">
              <p className="text-[#CBD5E1] mb-6">
                Your payment was successful! Your letter will be available shortly.
              </p>
            </div>
          )}

          {!user && (
            <div className="bg-[#0D1728] border border-[#4F7DF3]/25 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold mb-1">Save this case to your account</h3>
              <p className="text-sm text-[#94A3B8] mb-4">
                Create a free account to save your letter, track your case, and access membership features for ongoing disputes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/signup')}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] font-semibold text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-sm"
                >
                  Create free account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="flex-1 py-3 rounded-xl bg-white/6 border border-white/10 font-medium text-[#CBD5E1] hover:bg-white/10 transition-all text-sm"
                >
                  View Case Membership
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-[#CBD5E1] hover:text-white transition-colors"
            >
              ← Create another letter
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
