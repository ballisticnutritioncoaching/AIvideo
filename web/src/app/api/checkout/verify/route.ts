import { NextResponse } from "next/server";
import { admin, adminEnabled, recordPurchase } from "@/lib/supabaseAdmin";
import { stripe, stripeEnabled } from "@/lib/stripe";

/** Instant sign-in after paying works only once and only for an hour, so an old success URL can't log anyone in. */
const LOGIN_WINDOW_MS = 60 * 60 * 1000;

/**
 * Confirms a Checkout session was paid. With Supabase connected it also records the purchase
 * and returns a one-time sign-in token so the buyer goes straight into the app.
 */
export async function GET(req: Request) {
  if (!stripeEnabled()) return NextResponse.json({ error: "Payments are not set up yet." }, { status: 501 });
  const id = new URL(req.url).searchParams.get("session_id") ?? "";
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid session." }, { status: 400 });
  }
  try {
    const s = await stripe().checkout.sessions.retrieve(id);
    if (s.payment_status !== "paid" || s.metadata?.product !== "12-week-program") {
      return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
    }
    const email = s.customer_details?.email ?? "";
    const name = s.customer_details?.name ?? "";
    const paidAt = new Date(s.created * 1000).toISOString();
    let tokenHash: string | undefined;

    if (adminEnabled() && email) {
      await recordPurchase({ sessionId: s.id, email, name, amountCents: s.amount_total, paidAt });
      if (Date.now() - s.created * 1000 < LOGIN_WINDOW_MS) {
        // Claim the one-time login: only the first request flips the flag
        const { data: claimed } = await admin()
          .from("purchases")
          .update({ login_link_used: true })
          .eq("stripe_session_id", s.id)
          .eq("login_link_used", false)
          .select("stripe_session_id");
        if (claimed && claimed.length > 0) {
          const { data, error } = await admin().auth.admin.generateLink({
            type: "magiclink",
            email,
            options: { data: { name } },
          });
          if (error) throw error;
          tokenHash = data.properties?.hashed_token;
        }
      }
    }
    return NextResponse.json({ name, email, paidAt, tokenHash });
  } catch (e) {
    console.error("Checkout verify error", e);
    return NextResponse.json({ error: "We couldn't confirm your payment." }, { status: 502 });
  }
}
