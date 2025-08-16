import { createClient } from "@supabase/supabase-js";

// These environment variables are only used server-side in API routes
// They should NOT have VITE_ prefix to avoid exposure to client-side code
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  phone_number: string;
  routing_number: string;
  address: string;
  discord?: string;
  created_at: string;
  updated_at: string;
};
