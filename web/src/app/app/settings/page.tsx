"use client";

import { useRouter } from "next/navigation";
import { VersionPicker, DayPicker } from "@/components/Pickers";
import { CONFIG } from "@/lib/config";
import { resetAll, update, useAppState } from "@/lib/store";

export default function SettingsPage() {
  const s = useAppState()!;
  const router = useRouter();
  const p = s.profile!;
  const setProfile = (patch: Partial<typeof p>) => update((st) => ({ ...st, profile: { ...p, ...patch } }));

  return (
    <div className="wrap narrow page stack">
      <div>
        <p className="label">Settings</p>
        <h1>Your program</h1>
        <p className="muted">Signed in as {s.account?.name} ({s.account?.email})</p>
      </div>

      <section className="stack">
        <h2>Gym version</h2>
        <p className="small muted">Pick the one that matches where you train and stay with it for all 12 weeks. Your logged sessions stay put if you switch.</p>
        <VersionPicker value={p.version} onChange={(version) => setProfile({ version })} />
      </section>

      <section className="stack">
        <h2>Training days</h2>
        <DayPicker value={p.days} onChange={(days) => setProfile({ days })} />
        <div className="field" style={{ maxWidth: 260 }}>
          <label htmlFor="start">Start date</label>
          <input id="start" type="date" className="input" value={p.startDate} onChange={(e) => setProfile({ startDate: e.target.value })} />
        </div>
      </section>

      {CONFIG.demoMode && (
        <section className="card stack">
          <h3>Demo mode</h3>
          <p className="small">
            This preview keeps your account and logs in this browser only. Once real login is connected, they&apos;ll
            sync across devices.
          </p>
          <button
            type="button"
            className="btn small"
            onClick={() => {
              if (window.confirm("Clear the demo account and all logged sessions in this browser?")) {
                resetAll();
                router.push("/");
              }
            }}
          >
            Reset demo
          </button>
        </section>
      )}
    </div>
  );
}
