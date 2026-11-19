"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/Brand";
import { update } from "@/lib/store";

export default function SuccessPage() {
  return (
    <Suspense>
      <Success />
    </Suspense>
  );
}

function Success() {
  const id = useSearchParams().get("session_id") ?? "";
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "We couldn't confirm your payment.");
        if (cancelled) return;
        update((st) => ({
          ...st,
          account: { name: data.name || "there", email: data.email, purchasedAt: data.paidAt },
        }));
        router.replace("/onboarding");
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "We couldn't confirm your payment.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  return (
    <div className="checkout">
      <div className="wrap narrow">
        <div className="checkout-top"><Logo /></div>
        {error ? (
          <div className="stack">
            <h1>Something went sideways.</h1>
            <p>{error} If you were charged, email us and we&apos;ll get you in right away.</p>
            <Link href="/checkout" className="btn">Back to checkout</Link>
          </div>
        ) : (
          <div className="stack">
            <p className="label">Payment received</p>
            <h1>You&apos;re in. Setting up your program.</h1>
          </div>
        )}
      </div>
    </div>
  );
}
