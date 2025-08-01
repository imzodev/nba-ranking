import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Create a supabase client with admin privileges for server-side operations
// IMPORTANT: This should ONLY be used in server-side code (API routes, Server Components, etc.)
// and never exposed to the client
export const createClient = () => {
  // Use the same URL as the public client
  const supabaseUrl = process.env.SUPABASE_URL;
  // Service role key should NEVER have NEXT_PUBLIC_ prefix
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for admin client');
  }
  
  return createSupabaseClient(supabaseUrl, supabaseServiceKey);
};
