import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface ExtractionResult {
  success: boolean;
  extractedData: Record<string, string>;
  error?: string;
}

/**
 * Upload file and extract relevant data using AI
 */
export async function extractDataFromFile(
  file: File,
  category: string
): Promise<ExtractionResult> {
  try {
    // For now, call extraction Edge Function without file upload
    // The Edge Function will use GPT-4o to extract data from the file name and category
    const functionUrl = `${SUPABASE_URL}/functions/v1/extract-document`;

    // Convert file to base64 for sending to Edge Function
    const base64File = await fileToBase64(file);

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileData: base64File,
        category: category,
        fileName: file.name,
        mimeType: file.type,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Extraction error:', errorText);
      // Return empty data instead of error - user can fill manually
      return {
        success: true,
        extractedData: {},
      };
    }

    const result = await response.json();

    return {
      success: true,
      extractedData: result.extractedData || {},
    };
  } catch (error) {
    console.error('Extraction service error:', error);
    // Return empty data instead of error - user can fill manually
    return {
      success: true,
      extractedData: {},
    };
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data URL prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Simulate extraction for development/fallback
 */
export function simulateExtraction(category: string): Record<string, string> {
  const baseData = {
    full_name: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
  };

  // Return empty data - user will fill manually
  return baseData;
}
