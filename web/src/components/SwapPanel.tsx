"use client";

import Link from "next/link";
import { optionsFor, PATTERNS, type Exercise } from "@/data/exercises";
import { VideoEmbed } from "./Video";

/**
 * Easier versions and different-equipment alternatives for the programmed exercise, each with its
 * demo and a swap button. Swaps never go harder. Same movement, same muscles: keep sets, reps, tempo, rest.
 */
export function SwapPanel({
  current,
  original,
  onSwap,
  onClose,
}: {
  current: Exercise;
  original?: Exercise;
  onSwap: (ex: Exercise | null) => void;
  onClose: () => void;
}) {
  // Options always come from the programmed exercise, so a swap can't drift harder than the plan
  const base = original ?? current;
  const { easier, alternatives } = optionsFor(base);
  const picks: { label: string; ex: Exercise }[] = [
    ...alternatives.map((ex) => ({ label: "Different equipment, similar stimulus", ex })),
    ...easier.slice(0, 2).map((ex) => ({ label: "Easier", ex })),
  ].filter((p) => p.ex.id !== current.id);

  return (
    <div className="swap-panel" role="region" aria-label={`Swaps for ${current.name}`}>
      <div className="row between">
        <p className="label blue" style={{ margin: 0 }}>Swaps · {PATTERNS[base.pattern]}</p>
        <button type="button" className="btn ghost small" onClick={onClose}>Close</button>
      </div>
      <p className="small muted" style={{ margin: 0 }}>Missing equipment or need it easier today? Same movement, same muscles. Keep the sets, reps, tempo and rest.</p>
      {original && original.id !== current.id && (
        <div className="swap-option">
          <p className="swap-kind">Original</p>
          <h4>{original.name}</h4>
          <button type="button" className="btn small" onClick={() => onSwap(null)}>Switch back to {original.name}</button>
        </div>
      )}
      {picks.length === 0 && <p className="small">No swaps listed for this one yet.</p>}
      {picks.map(({ label, ex }) => (
        <div key={ex.id} className="swap-option">
          <p className="swap-kind">{label} <span className="pill outline">{ex.equipment}</span></p>
          <h4>{ex.name}</h4>
          {ex.videoUrl && <VideoEmbed url={ex.videoUrl} name={ex.name} />}
          <button type="button" className="btn solid small block" onClick={() => onSwap(ex)}>Swap for this exercise</button>
        </div>
      ))}
      <Link href={`/app/library/swaps?ex=${base.id}`} className="small">See every swap for {base.name}</Link>
    </div>
  );
}
