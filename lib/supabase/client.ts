import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database.types';

// Create a single supabase client for the entire application
export const createClient = () => {
  // Use NEXT_PUBLIC_ prefix for client-side accessible variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createSupabaseClient(supabaseUrl, supabaseKey);
};

// Singleton instance for client-side usage
let clientInstance: SupabaseClient<Database> | null = null;

export const getClientInstance = () => {
  if (!clientInstance) {
    clientInstance = createClient() as SupabaseClient<Database>;
  }
  return clientInstance;
};
