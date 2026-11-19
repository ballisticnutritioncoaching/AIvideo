import { stripeEnabled } from "@/lib/stripe";
import CheckoutClient from "./CheckoutClient";

// Read the Stripe setting at request time so adding the key doesn't need a rebuild.
export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return <CheckoutClient stripe={stripeEnabled()} />;
}
