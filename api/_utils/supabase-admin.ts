import { createClient } from "@supabase/supabase-js";
import { SERVER_ENV } from './server-env.js';
import { PUBLIC_ENV } from './env-public.js';

// FriendDev: Admin client that connects to our DB.
//            We disable persistSession because serverless functions are stateless.
//            If we didn't, we might get an error, since the serverless Node.js
//            environment has no local storage to save the session to.
export const supabaseAdmin = createClient(PUBLIC_ENV.VITE_SUPABASE_URL, SERVER_ENV.SUPABASE_SECRET_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});