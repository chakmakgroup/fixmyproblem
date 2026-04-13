import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { generationService } from '../../services/generationService';

export function ParkingForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    pcn_number: '',
    incident_date: '',
    location: '',
    authority_name: '',
    authority_address: '',
    grounds: '',
    additional_details: ''
  });

  const totalSteps = 3;

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const document = await documentService.createDocument({
        type: 'parking',
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
    if (step === 1) {
      return formData.full_name && formData.email && formData.address && formData.postcode;
    }
    if (step === 2) {
      return formData.pcn_number && formData.incident_date && formData.location;
    }
    if (step === 3) {
      return formData.grounds;
    }
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">🅿️ Parking Ticket Appeal</h1>
            <p className="text-[#CBD5E1]">Fill in the details to generate your appeal letter</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-[#CBD5E1]">Step {step} of {totalSteps}</span>
              <span className="text-sm text-[#CBD5E1]">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] rounded-full transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/6 border border-white/8 rounded-2xl p-6 sm:p-8 space-y-6">
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Your Details</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => updateField('full_name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      placeholder="07123 456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      placeholder="123 Main Street, London"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Postcode *</label>
                    <input
                      type="text"
                      value={formData.postcode}
                      onChange={(e) => updateField('postcode', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      placeholder="SW1A 1AA"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Ticket Details</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">PCN Number *</label>
                    <input
                      type="text"
                      value={formData.pcn_number}
                      onChange={(e) => updateField('pcn_number', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      placeholder="12345678"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date of Incident *</label>
                    <input
                      type="date"
                      value={formData.incident_date}
                      onChange={(e) => updateField('incident_date', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      placeholder="High Street Car Park, London"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Authority Name</label>
                    <input
                      type="text"
                      value={formData.authority_name}
                      onChange={(e) => updateField('authority_name', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      placeholder="Camden Council"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Authority Address</label>
                    <input
                      type="text"
                      value={formData.authority_address}
                      onChange={(e) => updateField('authority_address', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors"
                      placeholder="Parking Services, Town Hall..."
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="text-xl font-bold">Appeal Grounds</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Main Grounds for Appeal *</label>
                    <textarea
                      value={formData.grounds}
                      onChange={(e) => updateField('grounds', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors min-h-[120px]"
                      placeholder="E.g., The signage was unclear and obscured by vegetation..."
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Details</label>
                    <textarea
                      value={formData.additional_details}
                      onChange={(e) => updateField('additional_details', e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors min-h-[120px]"
                      placeholder="Any other supporting information..."
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 px-6 py-4 rounded-xl bg-white/6 hover:bg-white/10 border border-white/8 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-lg hover:shadow-[#4F7DF3]/20 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isStepValid() || loading}
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-lg hover:shadow-[#4F7DF3]/20 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Generate Letter
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
