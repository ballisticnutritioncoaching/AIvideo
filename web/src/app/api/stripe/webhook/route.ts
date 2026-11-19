import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { CONFIG } from "@/lib/config";
import { stripe } from "@/lib/stripe";
import { admin, adminEnabled, recordPurchase } from "@/lib/supabaseAdmin";

/**
 * Stripe calls this when a purchase completes, even if the buyer closes the tab before returning.
 * It records the purchase and emails the buyer a sign-in link.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 501 });

  const sig = req.headers.get("stripe-signature") ?? "";
  let event: Stripe.Event;
  try {
    event = await stripe().webhooks.constructEventAsync(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const email = s.customer_details?.email;
    if (s.payment_status === "paid" && s.metadata?.product === "12-week-program" && email) {
      if (adminEnabled()) {
        try {
          await recordPurchase({
            sessionId: s.id,
            email,
            name: s.customer_details?.name,
            amountCents: s.amount_total,
            paidAt: new Date(s.created * 1000).toISOString(),
          });
          const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
          const { error } = await admin().auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: true,
              emailRedirectTo: site ? `${site}/app` : undefined,
              data: { name: s.customer_details?.name ?? "" },
            },
          });
          if (error) console.error("Sign-in email failed", error);
        } catch (e) {
          console.error("Recording purchase failed", e);
          return NextResponse.json({ error: "Retry later." }, { status: 500 }); // Stripe retries
        }
      } else {
        console.log(`${CONFIG.productName} purchase`, { session: s.id, email });
      }
    }
  }
  return NextResponse.json({ received: true });
}
