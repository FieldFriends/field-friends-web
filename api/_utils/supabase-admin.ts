import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  throw new Error('Server Error: Missing Supabase environment variables.');
}

// FriendDev: We're creating an admin client that connects to our database.
//            We disable persistSession because serverless functions are stateless.
//            If we didn't, we might get an error, since the serverless Node.js
//            environment has no local storage to save the session to.
//            We do not automatically refresh the token for admin tasks.
//            Our secret key does not expire, so we never want to refresh it.
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});