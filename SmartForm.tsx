import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Upload, X, Sparkles, Check, ArrowRight, Loader } from 'lucide-react';
import { documentService } from '../services/documentService';
import { generationService } from '../services/generationService';
import { quickReasonsByCategory } from '../config/quickReasons';
import { extractDataFromFile } from '../services/extractionService';
import { baseFields, categoryFields, commonFields, FormField } from '../types/formFields';
import { DocumentType } from '../lib/supabase';

const categoryConfig: Record<string, { icon: string; title: string; uploadHint: string }> = {
  parking: {
    icon: '🅿️',
    title: 'Parking Ticket Appeal',
    uploadHint: 'Upload your parking ticket, PCN notice, or related evidence'
  },
  refund: {
    icon: '💰',
    title: 'Refund Request',
    uploadHint: 'Upload your receipt, invoice, order confirmation, or product photos'
  },
  landlord: {
    icon: '🏠',
    title: 'Landlord Complaint',
    uploadHint: 'Upload photos of the issue, tenancy agreement, or correspondence'
  },
  utility: {
    icon: '⚡',
    title: 'Utility Complaint',
    uploadHint: 'Upload your bill, meter reading, or account statement'
  },
  employer: {
    icon: '💼',
    title: 'Employer Issue',
    uploadHint: 'Upload contract, correspondence, or evidence of the issue'
  },
  consumer: {
    icon: '🛡️',
    title: 'Consumer Rights',
    uploadHint: 'Upload receipt, product photos, or correspondence with the trader'
  },
};

export function SmartForm() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [step, setStep] = useState<'upload' | 'processing' | 'form'>('upload');
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedFields, setExtractedFields] = useState<Set<string>>(new Set());
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<Record<string, string>>({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    what_happened: '',
    additional_details: ''
  });

  if (!type || !categoryConfig[type]) {
    navigate('/start');
    return null;
  }

  const config = categoryConfig[type];
  const quickReasons = quickReasonsByCategory[type] || [];
  const categorySpecificFields = categoryFields[type] || [];

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setStep('processing');
    setExtracting(true);
    setError('');

    try {
      const result = await extractDataFromFile(file, type);

      if (result.success && result.extractedData) {
        // Mark which fields were extracted
        const extracted = new Set<string>();
        Object.entries(result.extractedData).forEach(([key, value]) => {
          if (value && typeof value === 'string' && value.trim()) {
            setFormData(prev => ({ ...prev, [key]: value }));
            extracted.add(key);
          }
        });
        setExtractedFields(extracted);
      }
    } catch (err) {
      console.error('Extraction failed:', err);
      setError('Could not extract data from file. Please fill the form manually.');
    } finally {
      setExtracting(false);
      setTimeout(() => setStep('form'), 1000);
    }
  };

  const skipUpload = () => {
    setStep('form');
  };

  const toggleReason = (reason: string) => {
    const reasonText = quickReasons.find(r => r.label === reason)?.text || '';

    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
      const current = formData.additional_details;
      const newDetails = current.replace(reasonText + '\n\n', '').replace(reasonText, '');
      updateField('additional_details', newDetails.trim());
    } else {
      setSelectedReasons([...selectedReasons, reason]);
      const current = formData.additional_details;
      const newDetails = current ? `${current}\n\n${reasonText}` : reasonText;
      updateField('additional_details', newDetails);
    }
  };

  const clearReasons = () => {
    setSelectedReasons([]);
    updateField('additional_details', '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Full Name:', formData.full_name);
    console.log('Email:', formData.email);
    console.log('Type:', type);
    console.log('All Form Data:', formData);

    try {
      // Create document with all form data
      const document = await documentService.createDocument({
        type: type as DocumentType,
        full_name: formData.full_name,
        email: formData.email,
        input_data: formData,
      });

      console.log('Document created with ID:', document.id);
      console.log('Document email field:', document.email);

      // Generate letter
      await generationService.generateDocument(document.id);

      // Navigate to result page
      navigate(`/result/${document.id}`);
    } catch (err) {
      console.error('Generation failed:', err);
      setError('Failed to generate letter. Please try again.');
      setLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    const isExtracted = extractedFields.has(field.name);
    const value = formData[field.name] || '';

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="space-y-2">
          <label className="block text-sm font-medium text-white">
            {field.label}
            {field.required && <span className="text-orange-400 ml-1">*</span>}
          </label>
          <textarea
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className={`w-full px-4 py-3 bg-white/5 border ${
              isExtracted ? 'border-green-400/50 bg-green-400/5' : 'border-white/10'
            } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 transition-all`}
          />
          {isExtracted && (
            <p className="text-xs text-green-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI-filled from your document
            </p>
          )}
        </div>
      );
    }

    if (field.type === 'select' && field.options) {
      return (
        <div key={field.name} className="space-y-2">
          <label className="block text-sm font-medium text-white">
            {field.label}
            {field.required && <span className="text-orange-400 ml-1">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => updateField(field.name, e.target.value)}
            required={field.required}
            className={`w-full px-4 py-3 bg-white/5 border ${
              isExtracted ? 'border-green-400/50 bg-green-400/5' : 'border-white/10'
            } rounded-lg text-white focus:outline-none focus:border-orange-400/50 transition-all`}
          >
            <option value="">Select...</option>
            {field.options.map(option => (
              <option key={option} value={option} className="bg-gray-900">
                {option}
              </option>
            ))}
          </select>
          {isExtracted && (
            <p className="text-xs text-green-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              AI-filled from your document
            </p>
          )}
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-2">
        <label className="block text-sm font-medium text-white">
          {field.label}
          {field.required && <span className="text-orange-400 ml-1">*</span>}
        </label>
        <input
          type={field.type}
          value={value}
          onChange={(e) => updateField(field.name, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className={`w-full px-4 py-3 bg-white/5 border ${
            isExtracted ? 'border-green-400/50 bg-green-400/5' : 'border-white/10'
          } rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-400/50 transition-all`}
        />
        {isExtracted && (
          <p className="text-xs text-green-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI-filled from your document
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/start')}
            className="text-white/60 hover:text-white mb-4 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{config.icon}</span>
            <h1 className="text-3xl font-bold text-white">{config.title}</h1>
          </div>
        </div>

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h2 className="text-xl font-semibold text-white mb-4">Upload Evidence (Optional)</h2>
              <p className="text-white/60 mb-6">{config.uploadHint}</p>

              <label className="block cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <div className="border-2 border-dashed border-white/20 rounded-lg p-12 hover:border-orange-400/50 transition-all text-center">
                  <Upload className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">Click to upload a file</p>
                  <p className="text-sm text-white/40">Images, PDFs, receipts, bills, tickets accepted</p>
                </div>
              </label>
            </div>

            <div className="text-center">
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 text-sm text-white/40 bg-gray-900">or</span>
                </div>
              </div>
              <button
                onClick={skipUpload}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Skip and enter details manually →
              </button>
            </div>
          </div>
        )}

        {/* Processing Step */}
        {step === 'processing' && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
            <Loader className="w-16 h-16 text-orange-400 mx-auto mb-6 animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {extracting ? 'Analyzing your document...' : 'Processing complete'}
            </h2>
            <p className="text-white/60">
              {extracting ? 'Extracting key details from your evidence' : 'Preparing your form'}
            </p>
            {extractedFields.size > 0 && !extracting && (
              <p className="text-green-400 mt-4 flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                Extracted {extractedFields.size} fields from your document
              </p>
            )}
          </div>
        )}

        {/* Form Step */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {uploadedFile && (
              <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-white/60">
                      {extractedFields.size > 0
                        ? `${extractedFields.size} fields extracted`
                        : 'No data extracted - fill manually'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFile(null);
                    setExtractedFields(new Set());
                  }}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {error && (
              <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4 text-red-400">
                {error}
              </div>
            )}

            {/* Contact Details */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Contact Details</h3>
              {baseFields.map(renderField)}
            </div>

            {/* Category-Specific Fields */}
            {categorySpecificFields.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Case Details</h3>
                {categorySpecificFields.map(renderField)}
              </div>
            )}

            {/* What Happened + Quick Reasons */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Your Case</h3>
              {commonFields.map(field => {
                if (field.name === 'additional_details') {
                  return (
                    <div key={field.name} className="space-y-3">
                      {quickReasons.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-white">
                              Quick Points
                            </label>
                            {selectedReasons.length > 0 && (
                              <button
                                type="button"
                                onClick={clearReasons}
                                className="text-xs text-white/40 hover:text-white/60"
                              >
                                Clear selected
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-white/40 mb-3">
                            Tap any points that apply. They'll be added to your case automatically.
                          </p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {quickReasons.map((reason) => (
                              <button
                                key={reason.label}
                                type="button"
                                onClick={() => toggleReason(reason.label)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                  selectedReasons.includes(reason.label)
                                    ? 'bg-orange-400 text-white'
                                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                              >
                                {selectedReasons.includes(reason.label) && (
                                  <Check className="w-3 h-3 inline mr-1" />
                                )}
                                {reason.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {renderField(field)}
                    </div>
                  );
                }
                return renderField(field);
              })}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Your Letter...
                </>
              ) : (
                <>
                  Generate My Letter
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
