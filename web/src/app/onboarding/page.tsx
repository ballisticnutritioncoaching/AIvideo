"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Brand";
import { MemberGate } from "@/components/MemberGate";
import { DayPicker, VersionPicker } from "@/components/Pickers";
import type { VersionId } from "@/data/types";
import { update, useAppState } from "@/lib/store";

function nextMonday(): string {
  const d = new Date();
  d.setDate(d.getDate() + ((8 - d.getDay()) % 7)); // today if it's Monday
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function OnboardingPage() {
  return (
    <MemberGate needProfile={false}>
      <Onboarding />
    </MemberGate>
  );
}

function Onboarding() {
  const s = useAppState();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [version, setVersion] = useState<VersionId | undefined>();
  const [days, setDays] = useState<number[]>([1, 2, 4, 6]);
  const [start, setStart] = useState(nextMonday);

  const finish = () => {
    if (!version || days.length !== 4) return;
    update((st) => ({ ...st, profile: { version, days, startDate: start } }));
    router.push("/app");
  };

  const first = s?.account?.name.split(" ")[0];

  return (
    <div className="onboarding">
      <div className="wrap narrow">
        <div className="checkout-top row between">
          <Logo />
          <span className="small muted">Step {step + 1} of 2</span>
        </div>

        {step === 0 && (
          <section className="stack">
            <p className="label">Welcome{first ? `, ${first}` : ""}</p>
            <h1>Where do you train?</h1>
            <p className="muted">Every version follows the same structure. Only the exercises change, to match your equipment.</p>
            <VersionPicker value={version} onChange={setVersion} />
            <button type="button" className="btn solid" disabled={!version} onClick={() => setStep(1)}>Next</button>
          </section>
        )}

        {step === 1 && (
          <section className="stack">
            <p className="label">Your week</p>
            <h1>Which 4 days work for you?</h1>
            <p className="muted">Move it around nap times, shifts and practices however you need to. You can change this later.</p>
            <DayPicker value={days} onChange={setDays} />
            <div className="field" style={{ maxWidth: 260 }}>
              <label htmlFor="start">Start date</label>
              <input id="start" type="date" className="input" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="row">
              <button type="button" className="btn" onClick={() => setStep(0)}>Back</button>
              <button type="button" className="btn primary" disabled={days.length !== 4} onClick={finish}>See my first session</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
