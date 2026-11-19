"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/Brand";
import { update } from "@/lib/store";
import { remoteEnabled, sb } from "@/lib/supabase";

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
  const [needLogin, setNeedLogin] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "We couldn't confirm your payment.");
        if (cancelled) return;
        if (remoteEnabled) {
          // Sign straight in with the one-time token. If it was already used, fall back to an email link.
          if (data.tokenHash) {
            const { error } = await sb().auth.verifyOtp({ token_hash: data.tokenHash, type: "email" }); // "email" covers both new and returning users
            if (!error) return router.replace("/onboarding");
          }
          setNeedLogin(data.email);
          return;
        }
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
        {needLogin ? (
          <div className="stack">
            <p className="label">Payment received</p>
            <h1>You&apos;re in.</h1>
            <p>Sign in with <strong>{needLogin}</strong> to start your program. We&apos;ll email you a link, no password needed.</p>
            <Link href="/login" className="btn primary">Sign in</Link>
          </div>
        ) : error ? (
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
