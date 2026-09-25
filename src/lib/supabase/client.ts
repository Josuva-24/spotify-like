import { createClient, SupabaseClient } from "@supabase/supabase-js";

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (clientInstance) return clientInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://shkfcqbtxhjiiiuxrsrz.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseAnonKey || supabaseAnonKey === "your_supabase_anon_key_here") {
    return null;
  }

  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey);
    return clientInstance;
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    return null;
  }
}
