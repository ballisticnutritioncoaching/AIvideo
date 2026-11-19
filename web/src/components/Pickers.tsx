"use client";

import { PROGRAM } from "@/data/program";
import type { VersionId } from "@/data/types";
import { DAY_NAMES } from "@/lib/config";

export function VersionPicker({ value, onChange }: { value?: VersionId; onChange: (v: VersionId) => void }) {
  return (
    <div className="grid three version-picker" role="radiogroup" aria-label="Gym version">
      {PROGRAM.map((v) => (
        <button
          key={v.id}
          type="button"
          role="radio"
          aria-checked={value === v.id}
          className={`version-card ${value === v.id ? "on" : ""}`}
          onClick={() => onChange(v.id)}
        >
          <span className="label blue">{v.name}</span>
          <span className="small">{v.summary}</span>
        </button>
      ))}
    </div>
  );
}

/** Pick 4 days. The guide asks for at least 1 day between the 2 strength days. */
export function DayPicker({ value, onChange }: { value: number[]; onChange: (d: number[]) => void }) {
  const toggle = (d: number) => {
    if (value.includes(d)) onChange(value.filter((x) => x !== d));
    else if (value.length < 4) onChange([...value, d].sort((a, b) => a - b));
  };
  return (
    <div className="stack">
      <div className="day-picker" role="group" aria-label="Training days">
        {DAY_NAMES.map((n, i) => (
          <button key={n} type="button" aria-pressed={value.includes(i)} className={value.includes(i) ? "on" : ""} onClick={() => toggle(i)}>
            {n}
          </button>
        ))}
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        {value.length === 4
          ? "Your first and third days are strength days. Put at least 1 day between them."
          : `Pick ${4 - value.length} more ${4 - value.length === 1 ? "day" : "days"}. A week that works for a lot of parents: Monday, Tuesday, Thursday, Saturday.`}
      </p>
    </div>
  );
}
