"use client";

import Link from "next/link";
import { useState } from "react";
import {
  calculate,
  DAILY,
  FAT_FLOOR_PER_LB,
  GOALS,
  inFromCm,
  lbFromKg,
  needsGoalWeight,
  SPLITS,
  TRAINING,
  type Goal,
  type MacroInput,
  type MacroResult,
  type Portion,
  type Split,
} from "@/lib/macros";
import { update, useAppState, type MacroInputs } from "@/lib/store";

const DEFAULTS: MacroInputs = { v: 2, units: "imperial", split: "balanced", meals: 3, training: 2 };

export default function MacrosPage() {
  const s = useAppState()!;
  const saved = s.macros?.v === 2 ? s.macros : undefined;
  const m: MacroInputs = { ...DEFAULTS, ...saved };
  const set = (patch: Partial<MacroInputs>) => update((st) => ({ ...st, macros: { ...m, ...patch } }));
  const [step, setStep] = useState(m.complete ? -1 : 0); // -1 = results

  const askGoalWeight = !!(m.weightLb && m.heightIn && needsGoalWeight(m.weightLb, m.heightIn) && m.goal !== "build");
  const steps = ["about", "goal", "daily", "training", ...(askGoalWeight ? ["goalWeight"] : []), "meals"] as const;
  const input = toInput(m);
  const result = m.complete && input ? calculate(input) : null;
  const key = step >= 0 || !result ? steps[Math.min(Math.max(step, 0), steps.length - 1)] : null;

  const next = () => (step + 1 >= steps.length ? (set({ complete: true }), setStep(-1)) : setStep(step + 1));
  const back = () => setStep(Math.max(0, step - 1));

  if (key === null && input && result) {
    return <Results m={m} input={input} r={result} set={set} edit={() => setStep(0)} />;
  }

  return (
    <div className="wrap narrow page">
      <p className="label">Nutrition</p>
      <h1>Your starting numbers</h1>
      <p className="muted">A few quick questions. Your answers are saved, so you can come back and adjust any time.</p>
      <div className="wizard card">
        <div className="wizard-progress" aria-hidden>
          {steps.map((s2, i) => <span key={s2} className={i <= step ? "on" : ""} />)}
        </div>
        <p className="label blue">Step {Math.max(1, step + 1)} of {steps.length}</p>
        {key === "about" && <AboutYou m={m} set={set} onNext={next} />}
        {key === "goal" && (
          <Choice title="What's your goal right now?" options={(Object.keys(GOALS) as Goal[]).map((g) => ({ value: g, label: GOALS[g].label, desc: GOALS[g].desc }))}
            value={m.goal} onPick={(goal) => { set({ goal, proteinPerLb: undefined }); next(); }} />
        )}
        {key === "daily" && (
          <Choice title="How active are you during the day, outside of workouts?" options={DAILY.map((d, i) => ({ value: i, label: d.label, desc: d.desc }))}
            value={m.daily} onPick={(daily) => { set({ daily }); next(); }} />
        )}
        {key === "training" && (
          <Choice title="What do your workouts look like each week?" options={TRAINING.map((d, i) => ({ value: i, label: d.label, desc: d.desc, tag: i === 2 ? "Most members" : undefined }))}
            value={m.training} onPick={(training) => { set({ training }); next(); }} />
        )}
        {key === "goalWeight" && <GoalWeight m={m} set={set} onNext={next} />}
        {key === "meals" && <MealsTracking m={m} set={set} onNext={next} />}
        {step > 0 && (
          <button type="button" className="btn ghost small" onClick={back} style={{ marginTop: 12 }}>← Back</button>
        )}
      </div>
    </div>
  );
}

function toInput(m: MacroInputs): MacroInput | null {
  if (!m.sex || !m.age || !m.heightIn || !m.weightLb || !m.goal || m.daily === undefined || m.training === undefined) return null;
  return { sex: m.sex, age: m.age, heightIn: m.heightIn, weightLb: m.weightLb, goal: m.goal, daily: m.daily, training: m.training,
    goalWeightLb: m.goalWeightLb, proteinPerLb: m.proteinPerLb, split: m.split, meals: m.meals };
}

/* ---------- Steps ---------- */

function AboutYou({ m, set, onNext }: { m: MacroInputs; set: (p: Partial<MacroInputs>) => void; onNext: () => void }) {
  const metric = m.units === "metric";
  const [age, setAge] = useState(m.age ? String(m.age) : "");
  const [ft, setFt] = useState(m.heightIn ? String(Math.floor(m.heightIn / 12)) : "");
  const [inch, setInch] = useState(m.heightIn ? String(Math.round(m.heightIn % 12)) : "");
  const [cm, setCm] = useState(m.heightIn ? String(Math.round(m.heightIn * 2.54)) : "");
  const [wt, setWt] = useState(m.weightLb ? String(metric ? Math.round(m.weightLb * 0.4536) : Math.round(m.weightLb)) : "");
  const [sex, setSex] = useState(m.sex);

  const heightIn = metric ? inFromCm(parseFloat(cm)) : parseInt(ft || "0", 10) * 12 + parseFloat(inch || "0");
  const weightLb = metric ? lbFromKg(parseFloat(wt)) : parseFloat(wt);
  const ageN = parseInt(age, 10);
  const valid = ageN >= 18 && ageN <= 90 && heightIn >= 48 && heightIn <= 90 && weightLb >= 80 && weightLb <= 600 && !!sex;

  const go = () => {
    if (!valid) return;
    set({ age: ageN, heightIn: Math.round(heightIn * 10) / 10, weightLb: Math.round(weightLb * 10) / 10, sex });
    onNext();
  };
  const switchUnits = (u: MacroInputs["units"]) => {
    if (u === m.units) return;
    if (u === "metric") { if (heightIn) setCm(String(Math.round(heightIn * 2.54))); if (weightLb) setWt(String(Math.round(weightLb * 0.4536))); }
    else { if (heightIn) { setFt(String(Math.floor(heightIn / 12))); setInch(String(Math.round(heightIn % 12))); } if (weightLb) setWt(String(Math.round(weightLb))); }
    set({ units: u });
  };

  return (
    <form className="stack" onSubmit={(e) => { e.preventDefault(); go(); }}>
      <div className="row between">
        <h2 style={{ margin: 0 }}>About you</h2>
        <div className="seg" role="group" aria-label="Units">
          <button type="button" className={!metric ? "on" : ""} onClick={() => switchUnits("imperial")}>lb / in</button>
          <button type="button" className={metric ? "on" : ""} onClick={() => switchUnits("metric")}>kg / cm</button>
        </div>
      </div>
      <div className="field">
        <label htmlFor="age">Age</label>
        <input id="age" className="input" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} placeholder="34" />
      </div>
      <div className="field">
        <label htmlFor={metric ? "cm" : "ft"}>Height</label>
        {metric ? (
          <div className="unit-input"><input id="cm" className="input" inputMode="decimal" value={cm} onChange={(e) => setCm(e.target.value)} placeholder="165" /><span>cm</span></div>
        ) : (
          <div className="grid two" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="unit-input"><input id="ft" className="input" inputMode="numeric" value={ft} onChange={(e) => setFt(e.target.value)} placeholder="5" aria-label="Feet" /><span>ft</span></div>
            <div className="unit-input"><input className="input" inputMode="numeric" value={inch} onChange={(e) => setInch(e.target.value)} placeholder="6" aria-label="Inches" /><span>in</span></div>
          </div>
        )}
      </div>
      <div className="field">
        <label htmlFor="wt">Current weight</label>
        <div className="unit-input"><input id="wt" className="input" inputMode="decimal" value={wt} onChange={(e) => setWt(e.target.value)} placeholder={metric ? "70" : "160"} /><span>{metric ? "kg" : "lb"}</span></div>
      </div>
      <fieldset className="choice">
        <legend>Sex <span className="small muted">(used in the calorie formula)</span></legend>
        <div className="grid two" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {(["female", "male"] as const).map((x) => (
            <label key={x} className={sex === x ? "on" : ""}>
              <input type="radio" name="sex" checked={sex === x} onChange={() => setSex(x)} />
              <span>{x === "female" ? "Female" : "Male"}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="btn solid block" disabled={!valid}>Next</button>
    </form>
  );
}

function Choice<T extends string | number>({ title, options, value, onPick }: {
  title: string; options: { value: T; label: string; desc: string; tag?: string }[]; value?: T; onPick: (v: T) => void;
}) {
  return (
    <div className="stack">
      <h2>{title}</h2>
      <div className="option-list">
        {options.map((o) => (
          <button key={String(o.value)} type="button" className={`option ${value === o.value ? "on" : ""}`} onClick={() => onPick(o.value)}>
            <span className="option-title">{o.label}{o.tag && <span className="pill outline" style={{ marginLeft: 8 }}>{o.tag}</span>}</span>
            <span className="small muted">{o.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GoalWeight({ m, set, onNext }: { m: MacroInputs; set: (p: Partial<MacroInputs>) => void; onNext: () => void }) {
  const metric = m.units === "metric";
  const [v, setV] = useState(m.goalWeightLb ? String(metric ? Math.round(m.goalWeightLb * 0.4536) : Math.round(m.goalWeightLb)) : "");
  const lb = metric ? lbFromKg(parseFloat(v)) : parseFloat(v);
  const valid = lb >= 80 && lb <= (m.weightLb ?? 600);
  return (
    <form className="stack" onSubmit={(e) => { e.preventDefault(); if (valid) { set({ goalWeightLb: Math.round(lb * 10) / 10 }); onNext(); } }}>
      <h2>What&apos;s a goal weight that feels realistic?</h2>
      <p className="muted small">
        We set your protein from your goal weight, not your current weight. It&apos;s a better match for the muscle you
        want to keep. Not sure? Pick a number you&apos;d be happy with in a year.
      </p>
      <div className="unit-input"><input className="input" inputMode="decimal" value={v} onChange={(e) => setV(e.target.value)} aria-label="Goal weight" /><span>{metric ? "kg" : "lb"}</span></div>
      <button type="submit" className="btn solid block" disabled={!valid}>Next</button>
    </form>
  );
}

function MealsTracking({ m, set, onNext }: { m: MacroInputs; set: (p: Partial<MacroInputs>) => void; onNext: () => void }) {
  const levels = [
    { v: "none", t: "No tracking", d: "Use your hand to size portions. No apps, no scale. Plenty of people never need more." },
    { v: "lazy", t: "Lazy macros", d: "Track 2 numbers: calories and protein. About 90% of the result for a fraction of the effort." },
    { v: "full", t: "Full macros", d: "Track protein, carbs and fat. For more precision, or when progress has stalled." },
  ] as const;
  return (
    <div className="stack">
      <h2>How do you want to eat?</h2>
      <div className="field">
        <label htmlFor="meals">Meals a day (snacks count): <strong>{m.meals}</strong></label>
        <input id="meals" type="range" min={3} max={6} value={m.meals} onChange={(e) => set({ meals: Number(e.target.value) })} className="range" />
      </div>
      <p className="small muted" style={{ margin: 0 }}>How much tracking do you want to do? Pick the lowest level that works. You can move up later.</p>
      <div className="option-list">
        {levels.map((l) => (
          <button key={l.v} type="button" className={`option ${m.tracking === l.v ? "on" : ""}`} onClick={() => { set({ tracking: l.v }); onNext(); }}>
            <span className="option-title">{l.t}</span>
            <span className="small muted">{l.d}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- Results ---------- */

const fmt = (n: number) => n.toLocaleString();
const perMeal = (p: Portion) => (p.perMealLow === p.perMealHigh ? `${p.perMealLow}` : `${p.perMealLow} or ${p.perMealHigh}`);

function Results({ m, input, r, set, edit }: { m: MacroInputs; input: MacroInput; r: MacroResult; set: (p: Partial<MacroInputs>) => void; edit: () => void }) {
  const goal = GOALS[input.goal];
  const tracking = m.tracking ?? "none";
  const hands = <HandPortions r={r} meals={input.meals} />;
  const grams = <Grams r={r} tracking={tracking} />;

  return (
    <div className="wrap narrow page stack">
      <div>
        <p className="label">Your starting numbers</p>
        <h1>{fmt(r.calories)} calories a day</h1>
        <p className="lede">
          At your size and activity, your goal of <strong>{goal.label.toLowerCase()}</strong> needs about {fmt(r.calories)} calories a day.
          {input.goal === "lose" && ` That's about 20% under your maintenance of ${fmt(r.maintenance)}.`}
          {input.goal === "build" && ` That's about 10% over your maintenance of ${fmt(r.maintenance)}.`}
        </p>
      </div>

      {input.goal === "pregnant" && (
        <div className="callout red"><p><strong>Pregnant or breastfeeding?</strong> Don&apos;t diet. These numbers are maintenance. Eat at this level or above, and talk to your provider about what you need right now.</p></div>
      )}
      {input.goal === "reverse" && (
        <div className="callout"><p><strong>Coming off a diet:</strong> {fmt(r.calories)} is roughly your maintenance. Don&apos;t jump straight there. Add 50-100 calories a day each week, mostly from carbs, and keep protein the same. Stop adding when your weekly average climbs two weeks in a row.</p></div>
      )}

      {tracking === "none" ? <>{hands}{grams}</> : <>{grams}{hands}</>}

      <div className="callout">
        <p><strong>Veggies: 800 grams a day.</strong> That&apos;s about 6-8 fists of fruits and vegetables, spread across your meals. Fresh, frozen and canned all count.</p>
      </div>

      <section className="card stack">
        <h3>Fine-tune</h3>
        <div className="field">
          <label>Carbs and fat</label>
          <div className="seg" role="group" aria-label="Carbs and fat">
            {(Object.keys(SPLITS) as Split[]).map((k) => (
              <button key={k} type="button" className={input.split === k ? "on" : ""} onClick={() => set({ split: k })}>{SPLITS[k].label}</button>
            ))}
          </div>
          <p className="small muted" style={{ margin: 0 }}>Protein stays the same. This only moves calories between carbs and fat.</p>
        </div>
        <div className="field">
          <label>Protein: {r.proteinPerLb.toFixed(1)} g per lb {r.usedGoalWeight ? "of goal weight" : "of bodyweight"}</label>
          <div className="row">
            <button type="button" className="btn small" disabled={r.proteinPerLb <= 0.7} onClick={() => set({ proteinPerLb: Math.round((r.proteinPerLb - 0.1) * 10) / 10 })}>Less</button>
            <button type="button" className="btn small" disabled={r.proteinPerLb >= 1} onClick={() => set({ proteinPerLb: Math.round((r.proteinPerLb + 0.1) * 10) / 10 })}>More</button>
            {m.proteinPerLb !== undefined && <button type="button" className="btn small ghost" onClick={() => set({ proteinPerLb: undefined })}>Reset</button>}
          </div>
        </div>
        <div className="field">
          <label htmlFor="meals2">Meals a day: <strong>{input.meals}</strong></label>
          <input id="meals2" type="range" min={3} max={6} value={input.meals} onChange={(e) => set({ meals: Number(e.target.value) })} className="range" />
        </div>
        <div className="row">
          <span className="small muted">Tracking:</span>
          <div className="seg" role="group" aria-label="Tracking level">
            {([["none", "Hands"], ["lazy", "Lazy"], ["full", "Full"]] as const).map(([k, t]) => (
              <button key={k} type="button" className={tracking === k ? "on" : ""} onClick={() => set({ tracking: k })}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      <details className="card how">
        <summary><strong>How we got these numbers</strong></summary>
        <ol className="small">
          <li><strong>Resting burn: {fmt(r.bmr)} calories.</strong> The Mifflin-St Jeor formula, from your age, height, weight and sex.</li>
          <li><strong>Maintenance: {fmt(r.maintenance)} calories.</strong> Resting burn × {r.activity.toFixed(2)} for your daily activity ({DAILY[input.daily].label.toLowerCase()}) plus your workouts ({TRAINING[input.training].label.toLowerCase()}).</li>
          <li><strong>Your target: {fmt(r.calories)} calories.</strong> {input.goal === "lose" ? "Maintenance minus about 20%, never below your resting burn." : input.goal === "build" ? "Maintenance plus about 10%." : "Maintenance."}</li>
          <li><strong>Protein: {r.protein} g.</strong> {r.proteinPerLb.toFixed(1)} g × {Math.round(r.proteinBasisLb)} lb {r.usedGoalWeight ? `(your goal weight, since your BMI is ${r.bmi})` : "(your bodyweight)"}. That&apos;s {r.protein * 4} calories.</li>
          <li><strong>Carbs and fat split the rest.</strong> {fmt(r.calories - r.protein * 4)} calories left, split {Math.round(SPLITS[input.split].carbShare * 100)}% carbs and {Math.round((1 - SPLITS[input.split].carbShare) * 100)}% fat: <strong>{r.carbs} g carbs</strong> ({r.carbs * 4} cal) and <strong>{r.fat} g fat</strong> ({r.fat * 9} cal).{r.fatFloorApplied && ` Fat was raised to the minimum of ${FAT_FLOOR_PER_LB} g per lb for hormone health.`}</li>
          <li><strong>Hand portions:</strong> 1 palm ≈ {r.hand.palm} g protein, 1 cupped hand ≈ {r.hand.cupped} g carbs, 1 thumb ≈ {r.hand.thumb} g fat.</li>
        </ol>
      </details>

      <section className="card stack">
        <h3>Check it and adjust</h3>
        <p className="small" style={{ margin: 0 }}>These are a starting point, not a final answer. Your weekly average weight tells you if they&apos;re right.</p>
        <ul className="small">
          <li>Weigh in most mornings, after the bathroom, before you eat. Only the weekly average matters.</li>
          <li>A good rate of fat loss is about 0.5-1% of your bodyweight per week.</li>
          <li><strong>Not moving in 2-3 weeks</strong>, and you&apos;ve actually been hitting it? Take off about 200 calories: 1 cupped hand of carbs and 1 thumb of fat. Keep protein the same.</li>
          <li><strong>Losing faster than 1% a week</strong>, starving, or training falling apart? Add those 200 calories back.</li>
        </ul>
      </section>

      <div className="row">
        <button type="button" className="btn" onClick={edit}>Change my answers</button>
        <Link href="/app/library/macros" className="btn ghost">Read: Macros and lazy macros</Link>
      </div>
    </div>
  );
}

function HandPortions({ r, meals }: { r: MacroResult; meals: number }) {
  const rows = [
    { icon: "✋", what: "palms of protein", p: r.hands.protein, g: r.protein, eg: "Chicken, lean beef, fish, eggs, Greek yogurt, cottage cheese", cls: "p" },
    { icon: "✊", what: "fists of veggies", day: r.hands.veggiesPerDay, meal: r.hands.veggiesPerMeal, eg: "Steam-bag veggies, salad kits, baby carrots, peppers", cls: "v" },
    { icon: "🤲", what: "cupped hands of carbs", p: r.hands.carbs, g: r.carbs, eg: "Rice, potatoes, oats, fruit, tortillas, beans", cls: "c" },
    { icon: "👍", what: "thumbs of fat", p: r.hands.fat, g: r.fat, eg: "Olive oil, nut butter, cheese, avocado, nuts", cls: "f" },
  ];
  return (
    <section className="card stack">
      <div className="row between">
        <h3 style={{ margin: 0 }}>Your hand portions</h3>
        <span className="small muted">{meals} meals a day</span>
      </div>
      <ul className="hands">
        {rows.map((x) => (
          <li key={x.what} className={x.cls}>
            <span className="hand-icon" aria-hidden>{x.icon}</span>
            <div>
              <p className="hand-main"><strong>{x.p ? x.p.perDay : x.day} {x.what}</strong> a day{x.g ? <span className="muted"> ({x.g} g)</span> : null}</p>
              <p className="small">That&apos;s <strong>{x.p ? perMeal(x.p) : x.meal}</strong> per meal.</p>
              <p className="small muted">For example: {x.eg}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Grams({ r, tracking }: { r: MacroResult; tracking: "none" | "lazy" | "full" }) {
  const lazy = tracking === "lazy";
  return (
    <section className="stack">
      <div className="macro-results">
        <div className="macro-big">
          <p className="label blue">Calories</p>
          <p className="stat">{fmt(r.calories)}</p>
          <p className="small muted">a day</p>
        </div>
        <div className="macro-big">
          <p className="label blue">Protein</p>
          <p className="stat">{r.protein}<span> g</span></p>
          <p className="small muted">{r.perMeal.protein} g per meal</p>
        </div>
        <div className={`macro-big ${lazy ? "dim" : ""}`}>
          <p className="label muted">Carbs</p>
          <p className="stat small-stat">{r.carbs}<span> g</span></p>
          <p className="small muted">{r.perMeal.carbs} g per meal</p>
        </div>
        <div className={`macro-big ${lazy ? "dim" : ""}`}>
          <p className="label muted">Fat</p>
          <p className="stat small-stat">{r.fat}<span> g</span></p>
          <p className="small muted">{r.perMeal.fat} g per meal</p>
        </div>
      </div>
      {lazy && (
        <p className="small muted" style={{ margin: 0 }}>
          <strong>Lazy macros:</strong> hit your protein and stay at or under your calories. Let carbs and fat land wherever they land.
        </p>
      )}
      {tracking === "none" && (
        <p className="small muted" style={{ margin: 0 }}>These are the grams behind your hand portions, if you ever want to check.</p>
      )}
    </section>
  );
}
