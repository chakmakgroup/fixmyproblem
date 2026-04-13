import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type DocumentType = 'parking' | 'refund' | 'landlord' | 'utility' | 'employer' | 'consumer';
export type DocumentStatus = 'draft' | 'generated' | 'paid';

export interface Document {
  id: string;
  created_at: string;
  updated_at: string;
  type: DocumentType;
  full_name: string;
  email: string;
  input_data: Record<string, any>;
  generated_text: string | null;
  status: DocumentStatus;
  user_id: string | null;
}
