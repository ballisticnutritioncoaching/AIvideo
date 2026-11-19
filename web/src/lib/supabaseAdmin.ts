import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Server-side Supabase client with the secret key. Bypasses row level security: use only in API routes. */
export const adminEnabled = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

let client: SupabaseClient | null = null;

export function admin(): SupabaseClient {
  if (!adminEnabled()) throw new Error("Supabase admin is not configured");
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/** Records a paid Stripe purchase. Safe to call from both the webhook and the success page. */
export async function recordPurchase(p: {
  sessionId: string;
  email: string;
  name?: string | null;
  amountCents?: number | null;
  paidAt: string;
}) {
  const { error } = await admin()
    .from("purchases")
    .upsert(
      {
        stripe_session_id: p.sessionId,
        email: p.email.toLowerCase(),
        name: p.name ?? null,
        amount_cents: p.amountCents ?? null,
        paid_at: p.paidAt,
      },
      { onConflict: "stripe_session_id", ignoreDuplicates: true },
    );
  if (error) throw error;
}
