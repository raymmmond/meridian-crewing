import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in your .env file."
  );
}

// The anon/publishable key is safe in frontend code by design — it only
// grants what Row Level Security policies allow, which for this app is
// nothing directly (our Express API does all the real data access). This
// client exists only for auth: signup, login, logout, session handling.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
