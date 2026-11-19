"use client";

import Link from "next/link";
import { calculateMacros } from "@/lib/macros";
import { update, useAppState, type MacroInputs } from "@/lib/store";

const DEFAULTS: MacroInputs = {
  weight: "",
  goalWeight: "",
  activity: "14",
  phase: "deficit",
  proteinPerLb: "1",
  fatPerLb: "0.35",
};

export default function MacrosPage() {
  const s = useAppState()!;
  const m = { ...DEFAULTS, ...s.macros };
  const set = (patch: Partial<MacroInputs>) => update((st) => ({ ...st, macros: { ...m, ...patch } }));

  const r = calculateMacros({
    weight: parseFloat(m.weight),
    goalWeight: parseFloat(m.goalWeight || m.weight),
    activity: Number(m.activity),
    phase: m.phase,
    proteinPerLb: parseFloat(m.proteinPerLb),
    fatPerLb: parseFloat(m.fatPerLb),
  });

  return (
    <div className="wrap narrow page">
      <p className="label">Nutrition</p>
      <h1>Your starting numbers</h1>
      <p className="muted">
        5 steps. The numbers are a starting point, not a final answer. Your bodyweight trend over the next few weeks
        tells you if they&apos;re right.
      </p>

      <div className="callout red">
        <p>
          <strong>Pregnant or breastfeeding?</strong> Don&apos;t diet. Eat at maintenance or above and talk to your
          provider. Had a baby recently? Get cleared before you start a deficit.
        </p>
      </div>

      <form className="card stack macro-form" onSubmit={(e) => e.preventDefault()}>
        <div className="grid two">
          <div className="field">
            <label htmlFor="w">Current weight (lb)</label>
            <input id="w" className="input" inputMode="decimal" value={m.weight} onChange={(e) => set({ weight: e.target.value })} placeholder="190" />
          </div>
          <div className="field">
            <label htmlFor="g">Goal weight (lb)</label>
            <input id="g" className="input" inputMode="decimal" value={m.goalWeight} onChange={(e) => set({ goalWeight: e.target.value })} placeholder="175" />
          </div>
        </div>

        <fieldset className="choice">
          <legend>1. How active are you outside this program?</legend>
          {[
            ["14", "I sit most of the day", "x 14"],
            ["15", "On my feet a fair bit", "x 15"],
            ["16", "On my feet a lot, or very active", "x 16"],
          ].map(([v, t, h]) => (
            <label key={v} className={m.activity === v ? "on" : ""}>
              <input type="radio" name="act" value={v} checked={m.activity === v} onChange={() => set({ activity: v as MacroInputs["activity"] })} />
              <span>{t}</span><span className="small muted">{h}</span>
            </label>
          ))}
        </fieldset>

        <fieldset className="choice">
          <legend>2. What phase are you in?</legend>
          {[
            ["deficit", "Fat loss", "maintenance minus about 20%"],
            ["maintenance", "Maintenance", "eat about what you burn"],
          ].map(([v, t, h]) => (
            <label key={v} className={m.phase === v ? "on" : ""}>
              <input type="radio" name="phase" value={v} checked={m.phase === v} onChange={() => set({ phase: v as MacroInputs["phase"] })} />
              <span>{t}</span><span className="small muted">{h}</span>
            </label>
          ))}
        </fieldset>

        <div className="grid two">
          <div className="field">
            <label htmlFor="p">3. Protein per lb of goal weight</label>
            <select id="p" className="input" value={m.proteinPerLb} onChange={(e) => set({ proteinPerLb: e.target.value })}>
              <option value="0.8">0.8 g</option><option value="0.9">0.9 g</option><option value="1">1 g</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="f">4. Fat per lb of current weight</label>
            <select id="f" className="input" value={m.fatPerLb} onChange={(e) => set({ fatPerLb: e.target.value })}>
              <option value="0.3">0.3 g</option><option value="0.35">0.35 g</option><option value="0.4">0.4 g</option>
            </select>
          </div>
        </div>
        <p className="small muted" style={{ margin: 0 }}>5. Carbs fill the rest of your calories.</p>
      </form>

      {r ? (
        <section className="stack" aria-live="polite">
          <div className="macro-results">
            <div className="macro-big">
              <p className="label blue">Calories</p>
              <p className="stat">{r.calories.toLocaleString()}</p>
              <p className="small muted">Maintenance about {r.maintenance.toLocaleString()}</p>
            </div>
            <div className="macro-big">
              <p className="label blue">Protein</p>
              <p className="stat">{r.protein}<span> g</span></p>
              <p className="small muted">{r.proteinCal} cal</p>
            </div>
            <div className="macro-big">
              <p className="label muted">Fat</p>
              <p className="stat small-stat">{r.fat}<span> g</span></p>
              <p className="small muted">{r.fatCal} cal</p>
            </div>
            <div className="macro-big">
              <p className="label muted">Carbs</p>
              <p className="stat small-stat">{r.carbs}<span> g</span></p>
              <p className="small muted">{r.carbs * 4} cal</p>
            </div>
          </div>
          <div className="card tint">
            <p className="label blue">Lazy macros version</p>
            <p style={{ marginBottom: 0 }}>
              <strong>{r.calories.toLocaleString()} calories and {r.protein} g protein.</strong> Hit your protein, stay at
              or under your calories, and let carbs and fat land wherever they land. It&apos;s about 90% of the result
              for a fraction of the effort.
            </p>
          </div>
          <div className="card">
            <h3>Check it and adjust</h3>
            <ul className="small">
              <li>Weigh yourself most mornings, after the bathroom, before you eat. Only the weekly average matters. Daily swings of 1-4 pounds from water, salt and sleep are normal.</li>
              <li>A good rate of fat loss is about 0.5-1% of your bodyweight per week.</li>
              <li>Weekly average hasn&apos;t moved in 2-3 weeks, and you&apos;ve actually been hitting your numbers? Take 100-200 calories off, mostly from carbs or fat. Keep protein the same.</li>
              <li>Losing faster than 1% a week, starving, or your training is falling apart? Add 100-200 calories back.</li>
            </ul>
            <p className="small" style={{ marginBottom: 0 }}>
              More in the library: <Link href="/app/library/macros">Macros and lazy macros</Link> ·{" "}
              <Link href="/app/library/deficit-maintenance-reverse">Deficit, maintenance and reverse</Link>
            </p>
          </div>
        </section>
      ) : (
        <p className="muted center">Enter your weight to see your numbers.</p>
      )}
    </div>
  );
}
