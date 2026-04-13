import { supabase, DocumentType, Document } from '../lib/supabase';

export interface CreateDocumentInput {
  type: DocumentType;
  full_name: string;
  email: string;
  input_data: Record<string, any>;
}

export const documentService = {
  async createDocument(input: CreateDocumentInput): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        type: input.type,
        full_name: input.full_name,
        email: input.email,
        input_data: input.input_data,
        status: 'draft'
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to create document');

    return data;
  },

  async getDocument(id: string): Promise<Document | null> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Failed to update document');

    return data;
  }
};
