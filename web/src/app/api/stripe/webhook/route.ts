import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

/**
 * Stripe calls this when a purchase completes, even if the buyer closes the tab before returning.
 * Step 2 (Supabase) creates the member record here. For now it verifies the signature and logs the sale.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook not configured." }, { status: 501 });

  const sig = req.headers.get("stripe-signature") ?? "";
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch {
    return NextResponse.json({ error: "Bad signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    if (s.payment_status === "paid" && s.metadata?.product === "12-week-program") {
      console.log("12-week program purchase", { session: s.id, email: s.customer_details?.email });
      // TODO step 2: upsert the member in Supabase and send the login link.
    }
  }
  return NextResponse.json({ received: true });
}
