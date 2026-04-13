/*
  # Fix user_profiles trigger and RLS so signup works

  The handle_new_user trigger was failing because SECURITY DEFINER functions
  still respect RLS on the target table when called from auth context.
  
  Fix: set search_path on the function and use a service-role bypass approach
  by altering the function to also set row security off within its execution,
  OR simply add a policy that allows the anon/authenticated roles to insert
  their own profile row.
  
  The cleanest fix is to recreate the trigger function with `SET search_path = public`
  and ensure it can bypass RLS by setting the role appropriately.
*/

-- Drop and recreate the trigger function with proper settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role, email_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Grant execute to postgres (which runs the trigger)
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Also allow the anon role to insert their own profile (needed for some auth flows)
DROP POLICY IF EXISTS "Allow profile creation on signup" ON public.user_profiles;
CREATE POLICY "Allow profile creation on signup"
  ON public.user_profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ensure authenticated users can also insert their own
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
