import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { generationService } from '../../services/generationService';

export function RefundForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    company_name: '',
    company_address: '',
    order_number: '',
    purchase_date: '',
    amount: '',
    reason: '',
    details: '',
    contact_attempts: ''
  });

  const totalSteps = 3;
  const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const document = await documentService.createDocument({
        type: 'refund',
        full_name: formData.full_name,
        email: formData.email,
        input_data: formData
      });
      await generationService.generateDocument(document.id);
      navigate(`/result/${document.id}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.full_name && formData.email && formData.address && formData.postcode;
    if (step === 2) return formData.company_name && formData.order_number && formData.purchase_date && formData.amount;
    if (step === 3) return formData.reason && formData.details;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F8FAFC]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4F7DF3]/10 rounded-full blur-[120px] animate-glow-pulse"></div>
      </div>

      <header className="relative backdrop-blur-lg bg-[#0D1728]/80 border-b border-white/8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

      <main className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">💰 Refund Request</h1>
            <p className="text-[#CBD5E1]">Fill in the details to generate your refund letter</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#CBD5E1]">Step {step} of {totalSteps}</span>
              <span className="text-sm text-[#CBD5E1]">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] rounded-full transition-all duration-500" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/6 border border-white/8 rounded-2xl p-6 sm:p-8 space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Your Details</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input type="text" value={formData.full_name} onChange={(e) => updateField('full_name', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <input type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <input type="text" value={formData.address} onChange={(e) => updateField('address', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Postcode *</label>
                    <input type="text" value={formData.postcode} onChange={(e) => updateField('postcode', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" required />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Purchase Details</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name *</label>
                    <input type="text" value={formData.company_name} onChange={(e) => updateField('company_name', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Address</label>
                    <input type="text" value={formData.company_address} onChange={(e) => updateField('company_address', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Order Number *</label>
                    <input type="text" value={formData.order_number} onChange={(e) => updateField('order_number', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Purchase Date *</label>
                    <input type="date" value={formData.purchase_date} onChange={(e) => updateField('purchase_date', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (£) *</label>
                    <input type="number" step="0.01" value={formData.amount} onChange={(e) => updateField('amount', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors" required />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Refund Reason</h2>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reason for Refund *</label>
                    <textarea value={formData.reason} onChange={(e) => updateField('reason', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors min-h-[100px]" required></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Details *</label>
                    <textarea value={formData.details} onChange={(e) => updateField('details', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors min-h-[120px]" required></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Previous Contact Attempts</label>
                    <textarea value={formData.contact_attempts} onChange={(e) => updateField('contact_attempts', e.target.value)} className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors min-h-[100px]"></textarea>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="flex-1 px-6 py-4 rounded-xl bg-white/6 hover:bg-white/10 border border-white/8 transition-all font-semibold flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              {step < totalSteps ? (
                <button type="button" onClick={() => setStep(step + 1)} disabled={!isStepValid()} className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-lg hover:shadow-[#4F7DF3]/20 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={!isStepValid() || loading} className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-lg hover:shadow-[#4F7DF3]/20 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Generating...</> : <></>}Generate Letter<ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
