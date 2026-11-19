import "server-only";
import Stripe from "stripe";

/** True once STRIPE_SECRET_KEY is set. Until then the checkout page runs in demo mode. */
export const stripeEnabled = () => Boolean(process.env.STRIPE_SECRET_KEY);

let client: Stripe | null = null;

export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // fetch works on Vercel and behind HTTPS proxies
  client ??= new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
  return client;
}

/** The public URL of the site, used for Stripe's return links. */
export function siteUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const h = req.headers;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
