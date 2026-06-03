import { createClient } from '@supabase/supabase-js';

// FriendDev: We need to manually import here because import.meta is not available
//            in the api/_utils/ directory.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing. Check .env.local');
}

// FriendDev: The client must only be used for auth and session.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
