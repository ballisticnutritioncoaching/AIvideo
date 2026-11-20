"use client";

import { useEffect, useRef, useState } from "react";

export interface RestRequest {
  label: string;
  rest: string; // "2:00", ":30", "1:30"
}

function toSeconds(rest: string): number {
  const [m, s] = rest.split(":");
  return (parseInt(m || "0", 10) || 0) * 60 + (parseInt(s || "0", 10) || 0);
}

const mmss = (n: number) => `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`;

/** Starts automatically when a set with rest after it is checked off. +30 / -30 adjust the time left. */
export function RestTimer({ req, onClose }: { req: RestRequest; onClose: () => void }) {
  const total = toSeconds(req.rest);
  const endAt = useRef(Date.now() + total * 1000);
  const buzzed = useRef(false);
  const [left, setLeft] = useState(total);

  useEffect(() => {
    endAt.current = Date.now() + total * 1000;
    buzzed.current = false;
    setLeft(total);
  }, [req, total]);

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setLeft(remaining);
      if (remaining === 0 && !buzzed.current) {
        buzzed.current = true;
        try { navigator.vibrate?.(200); } catch {}
      }
    };
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, []);

  const adjust = (secs: number) => {
    const now = Date.now();
    endAt.current = Math.max(now, Math.max(endAt.current, now) + secs * 1000);
    if (endAt.current > now) buzzed.current = false;
    setLeft(Math.max(0, Math.ceil((endAt.current - now) / 1000)));
  };

  if (total <= 0) return null;
  return (
    <div className={`rest-timer ${left === 0 ? "over" : ""}`} role="status" aria-live="polite">
      <div>
        <p className="label" style={{ margin: 0, color: "inherit" }}>{left === 0 ? "Rest's up" : "Rest"}</p>
        <p className="rest-time">{mmss(left)}</p>
      </div>
      <div className="rest-actions">
        <button type="button" className="btn small" onClick={() => adjust(-30)} disabled={left === 0} aria-label="Remove 30 seconds">−30s</button>
        <button type="button" className="btn small" onClick={() => adjust(30)} aria-label="Add 30 seconds">+30s</button>
        <button type="button" className="btn small" onClick={onClose}>{left === 0 ? "Go" : "Skip"}</button>
      </div>
    </div>
  );
}
