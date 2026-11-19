"use client";

import { useEffect, useState } from "react";

// 4-second inhale, 1-second hold, 4-second exhale, 1-second hold. 10 cycles.
const PHASES = [
  { name: "Breathe in", secs: 4, scale: 1 },
  { name: "Hold", secs: 1, scale: 1 },
  { name: "Breathe out", secs: 4, scale: 0.55 },
  { name: "Hold", secs: 1, scale: 0.55 },
];
const CYCLES = 10;

export function BoxBreathing({ text }: { text: string }) {
  const [running, setRunning] = useState(false);
  const [tick, setTick] = useState(0); // seconds elapsed

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const cycleLen = PHASES.reduce((a, p) => a + p.secs, 0);
  const cycle = Math.floor(tick / cycleLen);
  const finished = cycle >= CYCLES;
  useEffect(() => {
    if (finished) setRunning(false);
  }, [finished]);

  let t = tick % cycleLen;
  let phase = PHASES[0];
  for (const p of PHASES) {
    if (t < p.secs) { phase = p; break; }
    t -= p.secs;
  }

  return (
    <section className="card tint breathing">
      <p className="label blue">Finish</p>
      <p className="small">{text}</p>
      {running || (tick > 0 && !finished) ? (
        <div className="breath-wrap">
          <div className="breath-circle" style={{ transform: `scale(${phase.scale})`, transitionDuration: `${phase.secs}s` }} />
          <p className="breath-phase">{phase.name}</p>
          <p className="small muted">Cycle {Math.min(cycle + 1, CYCLES)} of {CYCLES}</p>
          <button type="button" className="btn small" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Resume"}</button>
        </div>
      ) : finished ? (
        <p><strong>Done.</strong> Heart rate down. Back to work, the kids or the pickup line.</p>
      ) : (
        <button type="button" className="btn small solid" onClick={() => { setTick(0); setRunning(true); }}>
          Start box breathing
        </button>
      )}
    </section>
  );
}
