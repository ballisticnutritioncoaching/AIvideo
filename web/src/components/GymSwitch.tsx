"use client";

import type { VersionId } from "@/data/types";

const SHORT: Record<VersionId, string> = {
  functional: "Functional gym",
  commercial: "Commercial gym",
  home: "Home",
};

/** Switch between the three gym versions, e.g. traveling or splitting time between a gym and home. */
export function GymSwitch({
  value,
  onChange,
  label,
  note,
}: {
  value: VersionId;
  onChange: (v: VersionId) => void;
  label: string;
  note?: string;
}) {
  return (
    <div className="gym-switch">
      <span className="label muted">{label}</span>
      <div className="seg" role="radiogroup" aria-label={label}>
        {(Object.keys(SHORT) as VersionId[]).map((v) => (
          <button key={v} type="button" role="radio" aria-checked={value === v} className={value === v ? "on" : ""} onClick={() => onChange(v)}>
            {SHORT[v]}
          </button>
        ))}
      </div>
      {note && <p className="small muted" style={{ margin: 0 }}>{note}</p>}
    </div>
  );
}
