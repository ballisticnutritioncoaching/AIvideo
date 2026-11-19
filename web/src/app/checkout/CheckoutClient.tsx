"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/Brand";
import { CONFIG } from "@/lib/config";
import { update, useAppState } from "@/lib/store";

export default function CheckoutClient({ stripe }: { stripe: boolean }) {
  return (
    <Suspense>
      <Checkout stripe={stripe} />
    </Suspense>
  );
}

function Checkout({ stripe }: { stripe: boolean }) {
  const s = useAppState();
  const router = useRouter();
  const canceled = useSearchParams().get("canceled") === "1";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (s?.account) router.replace(s.profile ? "/app" : "/onboarding");
  }, [s, router]);

  const pay = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url; // Stripe's hosted checkout page
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed. Please try again.");
      setBusy(false);
    }
  };

  const validDemo = name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const demo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validDemo) return;
    update((st) => ({ ...st, account: { name: name.trim(), email: email.trim(), purchasedAt: new Date().toISOString() } }));
    router.push("/onboarding");
  };

  return (
    <div className="checkout">
      <div className="wrap narrow">
        <div className="checkout-top"><Logo /></div>
        <div className="grid two checkout-grid">
          <section>
            <p className="label">Your order</p>
            <h1>{CONFIG.productName}</h1>
            <ul className="checklist">
              <li>3 gym versions, 12 weeks each</li>
              <li>Daily sessions with 81 exercise demos</li>
              <li>Set-by-set workout logging</li>
              <li>Macro calculator and nutrition library</li>
            </ul>
            <div className="price-row">
              <span>Total today</span>
              <strong>${CONFIG.priceUsd}.00</strong>
            </div>
            <p className="small muted">One-time payment. No subscription.</p>
          </section>

          {stripe ? (
            <div className="card stack">
              {canceled && (
                <div className="callout"><p className="small">Checkout was canceled. No charge was made.</p></div>
              )}
              <p style={{ margin: 0 }}>
                You&apos;ll pay securely with Stripe, then come straight back here to set up your program.
              </p>
              <button type="button" className="btn primary block" onClick={pay} disabled={busy}>
                {busy ? "Opening checkout" : `Pay $${CONFIG.priceUsd}`}
              </button>
              {error && <p className="small" role="alert" style={{ color: "var(--deep-red)", margin: 0 }}>{error}</p>}
              <p className="small muted center" style={{ margin: 0 }}>Card, Apple Pay and Google Pay accepted.</p>
              <p className="small muted center" style={{ margin: 0 }}><Link href="/">Back</Link></p>
            </div>
          ) : (
            <form className="card stack" onSubmit={demo}>
              <div className="callout">
                <p className="small"><strong>Demo checkout.</strong> No card is charged. Payments switch on once the Stripe key is added.</p>
              </div>
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input id="name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" className="input" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn primary block" disabled={!validDemo}>
                Continue (demo, ${CONFIG.priceUsd})
              </button>
              <p className="small muted center" style={{ margin: 0 }}><Link href="/">Back</Link></p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
