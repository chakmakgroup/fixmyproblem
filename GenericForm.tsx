import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { generationService } from '../../services/generationService';
import { DocumentType } from '../../lib/supabase';

interface GenericFormProps {
  type: DocumentType;
  icon: string;
  title: string;
  fields: {
    step1: { label: string; field: string; type?: string; required?: boolean }[];
    step2: { label: string; field: string; type?: string; required?: boolean; textarea?: boolean }[];
    step3: { label: string; field: string; type?: string; required?: boolean; textarea?: boolean }[];
  };
}

export function GenericForm({ type, icon, title, fields }: GenericFormProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    postcode: ''
  });

  const totalSteps = 3;
  const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const document = await documentService.createDocument({
        type,
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

  const renderField = (field: { label: string; field: string; type?: string; required?: boolean; textarea?: boolean }) => {
    const commonClasses = "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-[#4F7DF3] transition-colors";

    if (field.textarea) {
      return (
        <div key={field.field}>
          <label className="block text-sm font-medium mb-2">{field.label} {field.required && '*'}</label>
          <textarea
            value={formData[field.field] || ''}
            onChange={(e) => updateField(field.field, e.target.value)}
            className={`${commonClasses} min-h-[120px]`}
            required={field.required}
          ></textarea>
        </div>
      );
    }

    return (
      <div key={field.field}>
        <label className="block text-sm font-medium mb-2">{field.label} {field.required && '*'}</label>
        <input
          type={field.type || 'text'}
          value={formData[field.field] || ''}
          onChange={(e) => updateField(field.field, e.target.value)}
          className={commonClasses}
          required={field.required}
        />
      </div>
    );
  };

  const currentFields = step === 1 ? fields.step1 : step === 2 ? fields.step2 : fields.step3;

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
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{icon} {title}</h1>
            <p className="text-[#CBD5E1]">Fill in the details to generate your letter</p>
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
            <div className="bg-white/6 border border-white/8 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in">
              {currentFields.map(field => renderField(field))}
            </div>

            <div className="flex gap-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="flex-1 px-6 py-4 rounded-xl bg-white/6 hover:bg-white/10 border border-white/8 transition-all font-semibold flex items-center justify-center gap-2">
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              {step < totalSteps ? (
                <button type="button" onClick={() => setStep(step + 1)} className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-lg hover:shadow-[#4F7DF3]/20 transition-all font-semibold flex items-center justify-center gap-2">
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] hover:shadow-lg hover:shadow-[#4F7DF3]/20 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Generating...</> : <>Generate Letter<ArrowRight className="w-5 h-5" /></>}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
