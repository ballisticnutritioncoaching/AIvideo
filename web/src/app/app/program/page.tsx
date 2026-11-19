"use client";

import Link from "next/link";
import { useState } from "react";
import { dayTitle, DAYS, getVersion, isDone, nextSession, WEEKS } from "@/lib/program";
import { useAppState } from "@/lib/store";

export default function ProgramPage() {
  const s = useAppState()!;
  const version = getVersion(s.profile!.version);
  const next = nextSession(s);
  const [open, setOpen] = useState<number>(next?.week ?? 1);

  return (
    <div className="wrap narrow page">
      <p className="label">{version.name}</p>
      <h1>Your 12 weeks</h1>
      <p className="muted">3 blocks of 4 weeks. New block, new exercises, same structure.</p>

      {version.blocks.map((b) => (
        <section key={b.block} className="block-section">
          <h2 className="display block-title">Weeks {b.weeks[0]}-{b.weeks[1]}</h2>
          {Array.from({ length: b.weeks[1] - b.weeks[0] + 1 }, (_, i) => b.weeks[0] + i).map((w) => {
            const doneCount = DAYS.filter((d) => isDone(s, w, d)).length;
            const isOpen = open === w;
            return (
              <div key={w} className={`week-row ${isOpen ? "open" : ""}`}>
                <button type="button" className="week-head" onClick={() => setOpen(isOpen ? 0 : w)} aria-expanded={isOpen}>
                  <span>Week {w}</span>
                  <span className="small muted">
                    {doneCount === 4 ? "Complete ✓" : `${doneCount} of 4 done`}
                    {next?.week === w && <span className="pill" style={{ marginLeft: 8 }}>Current</span>}
                  </span>
                </button>
                {isOpen && (
                  <ul className="week-days">
                    {DAYS.map((d) => (
                      <li key={d}>
                        <Link href={`/app/session/${w}/${d}`} className={isDone(s, w, d) ? "done" : ""}>
                          <span className="day-n">{isDone(s, w, d) ? "✓" : `Day ${d}`}</span>
                          <span>{dayTitle(version, d)}</span>
                          <span aria-hidden>→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </section>
      ))}
      {WEEKS === 12 && (
        <p className="small muted center">Want a different version? Change it any time in <Link href="/app/settings">Settings</Link>.</p>
      )}
    </div>
  );
}
