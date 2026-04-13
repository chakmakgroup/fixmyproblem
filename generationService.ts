import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const generationService = {
  async generateDocument(documentId: string): Promise<void> {
    const functionUrl = `${SUPABASE_URL}/functions/v1/generate-letter`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate letter');
    }

    const data = await response.json();
    return data;
  },

  async pollDocumentStatus(documentId: string, maxAttempts = 30): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      const { data: document } = await supabase
        .from('documents')
        .select('status')
        .eq('id', documentId)
        .maybeSingle();

      if (document?.status === 'generated') {
        return true;
      }

      if (document?.status === 'error') {
        throw new Error('Document generation failed');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    throw new Error('Document generation timed out');
  }
};
