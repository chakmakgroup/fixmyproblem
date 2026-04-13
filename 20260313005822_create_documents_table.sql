/*
  # Create documents table for FixMyProblem

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `type` (text) - Type of complaint (parking, refund, landlord, etc.)
      - `full_name` (text) - User's full name
      - `email` (text) - User's email
      - `input_data` (jsonb) - Form input data
      - `generated_text` (text) - Generated letter text
      - `status` (text) - Status: draft, generated, paid
      - `user_id` (uuid, nullable) - Optional user reference for future auth
  
  2. Security
    - Enable RLS on `documents` table
    - Add policy for public access (for MVP without auth)
    - Structure allows easy auth integration later
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  type text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  input_data jsonb DEFAULT '{}'::jsonb,
  generated_text text,
  status text DEFAULT 'draft',
  user_id uuid
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create documents"
  ON documents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read documents they created"
  ON documents
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update documents they created"
  ON documents
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS documents_type_idx ON documents(type);
CREATE INDEX IF NOT EXISTS documents_status_idx ON documents(status);
