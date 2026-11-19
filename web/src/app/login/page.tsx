"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Brand";
import { useMember } from "@/lib/member";
import { remoteEnabled, sb } from "@/lib/supabase";

export default function LoginPage() {
  const m = useMember();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (m.s === "ready" || m.s === "no-purchase") router.replace("/app");
    if (!remoteEnabled) router.replace("/");
  }, [m.s, router]);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setBusy(true);
    setError("");
    const { error } = await sb().auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/app`, shouldCreateUser: true },
    });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <div className="checkout">
      <div className="wrap narrow">
        <div className="checkout-top"><Logo /></div>
        <div className="login-box stack">
          {sent ? (
            <>
              <p className="label">Check your email</p>
              <h1>Your sign-in link is on its way.</h1>
              <p>We sent it to <strong>{email}</strong>. Open it on this device to go straight to your program.</p>
              <button type="button" className="btn small ghost" onClick={() => setSent(false)}>Use a different email</button>
            </>
          ) : (
            <form className="stack" onSubmit={send}>
              <p className="label">Members</p>
              <h1>Sign in</h1>
              <p className="muted">Use the email you bought the program with. We&apos;ll email you a link, no password needed.</p>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" className="input" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn solid block" disabled={!valid || busy}>
                {busy ? "Sending" : "Email me a sign-in link"}
              </button>
              {error && <p className="small" role="alert" style={{ color: "var(--deep-red)", margin: 0 }}>{error}</p>}
              <p className="small muted center" style={{ margin: 0 }}>
                Don&apos;t have the program yet? <Link href="/checkout">Get it here</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
