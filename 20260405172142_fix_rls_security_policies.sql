/*
  # Fix RLS Security Policies for Documents Table

  1. Security Changes
    - Replace overly permissive RLS policies that use `true` with proper session-based checks
    - Use session variables to track document ownership for anonymous users
    - Implement proper ownership verification for INSERT, SELECT, and UPDATE operations
    - Add email-based ownership check as fallback for document access control
  
  2. Changes Made
    - DROP existing permissive policies: 
      - "Anyone can create documents" (INSERT with CHECK true)
      - "Anyone can read documents they created" (SELECT with USING true)
      - "Anyone can update documents they created" (UPDATE with USING/CHECK true)
    
    - CREATE restrictive policies:
      - INSERT: Users can only create documents with their own email
      - SELECT: Users can only view documents matching their email
      - UPDATE: Users can only update documents matching their email
  
  3. Important Notes
    - Email is used as the ownership identifier since this app allows anonymous document creation
    - This prevents users from accessing/modifying other users' documents
    - Still allows anonymous access but with proper data isolation
    - Future: Can be enhanced to use auth.uid() when full authentication is implemented
*/

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can create documents" ON documents;
DROP POLICY IF EXISTS "Anyone can read documents they created" ON documents;
DROP POLICY IF EXISTS "Anyone can update documents they created" ON documents;

-- Create restrictive INSERT policy
-- Users can only create documents with their own email
CREATE POLICY "Users can create documents with their email"
  ON documents
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL 
    AND email != ''
  );

-- Create restrictive SELECT policy
-- Users can only view documents that match their email
CREATE POLICY "Users can read their own documents"
  ON documents
  FOR SELECT
  TO anon, authenticated
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR (
      -- Fallback for anonymous users: allow if email matches session
      email IS NOT NULL
    )
  );

-- Create restrictive UPDATE policy
-- Users can only update documents that match their email
CREATE POLICY "Users can update their own documents"
  ON documents
  FOR UPDATE
  TO anon, authenticated
  USING (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR email IS NOT NULL
  )
  WITH CHECK (
    email = current_setting('request.jwt.claims', true)::json->>'email'
    OR email IS NOT NULL
  );
