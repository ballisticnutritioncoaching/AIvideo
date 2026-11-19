import { NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";

/** Confirms a Checkout session was paid and returns the buyer's name and email. */
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
    return NextResponse.json({
      name: s.customer_details?.name ?? "",
      email: s.customer_details?.email ?? "",
      paidAt: new Date((s.created ?? Date.now() / 1000) * 1000).toISOString(),
    });
  } catch (e) {
    console.error("Stripe verify error", e);
    return NextResponse.json({ error: "We couldn't confirm your payment." }, { status: 502 });
  }
}
