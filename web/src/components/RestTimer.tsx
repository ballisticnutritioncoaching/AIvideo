"use client";

import { useEffect, useState } from "react";

export interface RestRequest {
  label: string;
  rest: string; // "2:00", ":30", "1:30"
}

function toSeconds(rest: string): number {
  const [m, s] = rest.split(":");
  return (parseInt(m || "0", 10) || 0) * 60 + (parseInt(s || "0", 10) || 0);
}

const mmss = (n: number) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;

/** Starts automatically when a set with rest after it is checked off. */
export function RestTimer({ req, onClose }: { req: RestRequest; onClose: () => void }) {
  const total = toSeconds(req.rest);
  const [left, setLeft] = useState(total);

  useEffect(() => {
    setLeft(total);
    const started = Date.now();
    const id = window.setInterval(() => {
      const remaining = Math.max(0, total - Math.floor((Date.now() - started) / 1000));
      setLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(id);
        try { navigator.vibrate?.(200); } catch {}
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [req, total]);

  if (total <= 0) return null;
  return (
    <div className={`rest-timer ${left === 0 ? "over" : ""}`} role="status" aria-live="polite">
      <div>
        <p className="label" style={{ margin: 0, color: "inherit" }}>{left === 0 ? "Rest's up" : "Rest"}</p>
        <p className="rest-time">{mmss(left)}</p>
      </div>
      <button type="button" className="btn small" onClick={onClose}>{left === 0 ? "Go" : "Skip"}</button>
    </div>
  );
}
