import { NextResponse } from "next/server";
import { CONFIG } from "@/lib/config";
import { siteUrl, stripe, stripeEnabled } from "@/lib/stripe";

/** Creates a Stripe Checkout session for the one-time program purchase and returns its URL. */
export async function POST(req: Request) {
  if (!stripeEnabled()) {
    return NextResponse.json({ error: "Payments are not set up yet." }, { status: 501 });
  }
  const base = siteUrl(req);
  const priceId = process.env.STRIPE_PRICE_ID;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: CONFIG.priceUsd * 100,
                product_data: {
                  name: CONFIG.productName,
                  description: "12 weeks of strength, conditioning and nutrition. 3 gym versions. One-time payment.",
                },
              },
            },
      ],
      customer_creation: "always",
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      metadata: { product: "12-week-program" },
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout?canceled=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error", e);
    return NextResponse.json({ error: "We couldn't start checkout. Please try again." }, { status: 502 });
  }
}
