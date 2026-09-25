import { createClient, SupabaseClient } from "@supabase/supabase-js";

let serverInstance: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (serverInstance) return serverInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://shkfcqbtxhjiiiuxrsrz.supabase.co";
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!apiKey || apiKey === "your_supabase_anon_key_here") {
    return null;
  }

  try {
    serverInstance = createClient(supabaseUrl, apiKey, {
      auth: { persistSession: false },
    });
    return serverInstance;
  } catch (error) {
    console.error("Failed to initialize Supabase server client:", error);
    return null;
  }
}
