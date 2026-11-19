"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut, useMember } from "@/lib/member";
import { useAppState } from "@/lib/store";

/**
 * Shows children only to a paying member.
 * needProfile: true on app screens (sends new members to onboarding), false on onboarding itself.
 */
export function MemberGate({ needProfile, children }: { needProfile: boolean; children: React.ReactNode }) {
  const m = useMember();
  const state = useAppState();
  const router = useRouter();

  const hasAccount = Boolean(state?.account);
  const hasProfile = Boolean(state?.profile);
  const ready = (m.s === "demo" && hasAccount) || m.s === "ready";

  useEffect(() => {
    if (m.s === "signed-out") router.replace("/login");
    if (m.s === "demo" && state && !hasAccount) router.replace("/");
    if (ready && needProfile && !hasProfile) router.replace("/onboarding");
    if (ready && !needProfile && hasProfile) router.replace("/app");
  }, [m.s, state, hasAccount, hasProfile, ready, needProfile, router]);

  if (m.s === "no-purchase") {
    return (
      <div className="wrap narrow page stack">
        <h1>We couldn&apos;t find a purchase for {m.email}.</h1>
        <p>If you bought the program with a different email, sign in with that one. Otherwise you can get it here.</p>
        <div className="row">
          <button type="button" className="btn" onClick={() => signOut().then(() => router.replace("/login"))}>
            Use a different email
          </button>
          <Link href="/checkout" className="btn primary">Get the program</Link>
        </div>
      </div>
    );
  }
  if (m.s === "error") {
    return (
      <div className="wrap narrow page stack">
        <h1>Something went sideways.</h1>
        <p>We couldn&apos;t load your program ({m.message}). Check your connection and try again.</p>
        <button type="button" className="btn" onClick={() => window.location.reload()}>Try again</button>
      </div>
    );
  }
  if (!ready || (needProfile && !hasProfile) || (!needProfile && hasProfile)) {
    return <div className="wrap loading">Loading your program</div>;
  }
  return (
    <>
      {m.s === "ready" && m.syncError && (
        <div className="sync-error" role="alert">
          Your last change didn&apos;t save. It&apos;s kept on this device and will retry on your next change.
        </div>
      )}
      {children}
    </>
  );
}
