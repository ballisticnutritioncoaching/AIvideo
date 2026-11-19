"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** True when Supabase is configured. Otherwise the app runs in browser-only demo mode. */
export const remoteEnabled = Boolean(url && key);

let client: SupabaseClient | null = null;

export function sb(): SupabaseClient {
  if (!remoteEnabled) throw new Error("Supabase is not configured");
  client ??= createClient(url!, key!, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}
