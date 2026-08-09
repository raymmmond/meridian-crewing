import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check your .env file " +
      "(copy .env.example to .env and fill in your project's values)."
  );
}

// service_role bypasses Row Level Security entirely — this client should
// NEVER be sent to the frontend. All permission checks happen in our own
// route code (see auth-middleware.ts), not in the database.
export const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
