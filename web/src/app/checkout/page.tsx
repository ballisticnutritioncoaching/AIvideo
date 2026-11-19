"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Brand";
import { CONFIG } from "@/lib/config";
import { update, useAppState } from "@/lib/store";

export default function Checkout() {
  const s = useAppState();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (s?.account) router.replace(s.profile ? "/app" : "/onboarding");
  }, [s, router]);

  const valid = name.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    // Demo mode: no card is charged. A Stripe Checkout session replaces this step when payments are connected.
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

          <form className="card stack" onSubmit={submit}>
            {CONFIG.demoMode && (
              <div className="callout">
                <p className="small"><strong>Demo checkout.</strong> No card is charged. Payments connect through Stripe before launch.</p>
              </div>
            )}
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input id="name" className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="input" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" className="btn primary block" disabled={!valid || busy}>
              {CONFIG.demoMode ? `Continue (demo, $${CONFIG.priceUsd})` : `Pay $${CONFIG.priceUsd}`}
            </button>
            <p className="small muted center" style={{ margin: 0 }}><Link href="/">Back</Link></p>
          </form>
        </div>
      </div>
    </div>
  );
}
