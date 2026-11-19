"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BoxBreathing } from "@/components/BoxBreathing";
import { RestTimer, type RestRequest } from "@/components/RestTimer";
import { DemoButton } from "@/components/Video";
import type { StrengthDay, StrengthExercise } from "@/data/types";
import {
  blockForWeek,
  conditioningFor,
  dayEffort,
  dayTitle,
  getVersion,
  groupExercises,
  prescription,
  setCount,
  WEEKS,
} from "@/lib/program";
import { sessionKey, update, useAppState, type SessionLog, type SetLog } from "@/lib/store";

export default function SessionPage() {
  const params = useParams<{ week: string; day: string }>();
  const week = Number(params.week);
  const day = Number(params.day);
  const router = useRouter();
  const s = useAppState()!;
  const [rest, setRest] = useState<RestRequest | null>(null);

  if (!(week >= 1 && week <= WEEKS && day >= 1 && day <= 4)) {
    return (
      <div className="wrap page">
        <p>That session doesn&apos;t exist. <Link href="/app">Back to today</Link></p>
      </div>
    );
  }

  const version = getVersion(s.profile!.version);
  const block = blockForWeek(version, week);
  const key = sessionKey(week, day);
  const log: SessionLog = s.logs[key] ?? { sets: {} };
  const done = Boolean(log.completedAt);

  const save = (next: SessionLog) => update((st) => ({ ...st, logs: { ...st.logs, [key]: next } }));
  const complete = () => {
    save({ ...log, completedAt: new Date().toISOString() });
    router.push("/app");
  };
  const undo = () => save({ ...log, completedAt: undefined });

  const prevKey = week > block.weeks[0] ? sessionKey(week - 1, day) : null;
  const prevLog = prevKey ? s.logs[prevKey] : undefined;

  return (
    <div className="wrap narrow page">
      <Link href="/app" className="back">← Today</Link>
      <p className="label">
        Week {week} · Day {day} · Block {block.block}
      </p>
      <h1>{dayTitle(version, day)}</h1>
      <p className="muted">
        {version.name} · {dayEffort(version, day)}
        {done && <span className="pill" style={{ marginLeft: 10 }}>Done</span>}
      </p>

      {(day === 1 || day === 3) && (
        <Strength
          dayData={day === 1 ? block.day1 : block.day3}
          week={week}
          log={log}
          prevLog={prevLog}
          onChange={save}
          onRest={setRest}
        />
      )}

      {day === 2 && block.day2.kind === "conditioning" && (
        <Conditioning workout={conditioningFor(block, week)} log={log} onChange={save} />
      )}

      {day === 2 && block.day2.kind === "walkjog" && (
        <section className="card stack session-card">
          <p className="label blue">Walk-jog</p>
          <h3>{block.day2.title}</h3>
          <p>{block.day2.body}</p>
          <ul>
            {block.day2.examples.map((e) => <li key={e}>{e}</li>)}
          </ul>
          <ResultField log={log} onChange={save} placeholder="What you did, e.g. 5 rounds: 3 min jog, 3 min walk" />
        </section>
      )}

      {day === 4 && (
        <section className="card stack session-card">
          <p className="label blue">Weighted walk</p>
          <h3>{block.day4.title}</h3>
          <p>{block.day4.body}</p>
          <p className="small muted">
            Using a heart rate monitor? 180 minus your age is a rough ceiling for this pace.
          </p>
          <ResultField log={log} onChange={save} placeholder="Minutes walked and vest or backpack weight" />
        </section>
      )}

      <div className="session-done">
        {done ? (
          <>
            <p className="small muted">Completed {new Date(log.completedAt!).toLocaleDateString()}.</p>
            <button type="button" className="btn small ghost" onClick={undo}>Mark as not done</button>
          </>
        ) : (
          <button type="button" className="btn primary block" onClick={complete}>Finish session</button>
        )}
      </div>

      {rest && <RestTimer req={rest} onClose={() => setRest(null)} />}
    </div>
  );
}

function Strength({
  dayData,
  week,
  log,
  prevLog,
  onChange,
  onRest,
}: {
  dayData: StrengthDay;
  week: number;
  log: SessionLog;
  prevLog?: SessionLog;
  onChange: (l: SessionLog) => void;
  onRest: (r: RestRequest) => void;
}) {
  const groups = groupExercises(dayData.exercises);
  return (
    <div className="stack">
      {groups.map((g) => (
        <section key={g.key} className={`group ${g.items.length > 1 ? "superset" : ""}`}>
          {g.items.length > 1 && (
            <p className="label muted group-label">
              Superset: one set of each, then rest
            </p>
          )}
          {g.items.map((ex, i) => (
            <ExerciseCard
              key={ex.order}
              ex={ex}
              week={week}
              sets={log.sets[ex.order]}
              prev={prevLog?.sets[ex.order]}
              restAfter={i === g.items.length - 1 ? lastRest(g.items) : ""}
              onChange={(sets) => onChange({ ...log, sets: { ...log.sets, [ex.order]: sets } })}
              onRest={onRest}
            />
          ))}
        </section>
      ))}
      <BoxBreathing text={dayData.finisher} />
    </div>
  );
}

/** In a superset, the rest printed on the first line applies after the last exercise of the round. */
function lastRest(items: StrengthExercise[]) {
  return items.map((x) => x.rest).find((r) => r && r.trim()) ?? "";
}

function ExerciseCard({
  ex,
  week,
  sets,
  prev,
  restAfter,
  onChange,
  onRest,
}: {
  ex: StrengthExercise;
  week: number;
  sets?: SetLog[];
  prev?: SetLog[];
  restAfter: string;
  onChange: (s: SetLog[]) => void;
  onRest: (r: RestRequest) => void;
}) {
  const p = prescription(ex, week);
  const n = setCount(ex, week);
  const rows: SetLog[] = Array.from({ length: n }, (_, i) => sets?.[i] ?? { weight: "", reps: "", done: false });
  const set = (i: number, patch: Partial<SetLog>) => {
    const next = rows.map((r, j) => (j === i ? { ...r, ...patch } : r));
    onChange(next);
    if (patch.done && restAfter) onRest({ label: ex.name, rest: restAfter });
  };
  const prevSummary = prev?.filter((x) => x.weight || x.reps).map((x) => `${x.weight || "-"} × ${x.reps || "-"}`).join(", ");
  const videos = ex.videoUrls ?? (ex.videoUrl ? [{ name: ex.name, url: ex.videoUrl }] : []);

  return (
    <article className="exercise">
      <div className="ex-head">
        <span className="ex-order">{ex.order}</span>
        <div>
          <h3 className="ex-name">{ex.name}</h3>
          {ex.note && <p className="small muted ex-note">{ex.note}</p>}
        </div>
      </div>
      <dl className="ex-rx">
        <div><dt>Sets</dt><dd>{p.sets || "-"}</dd></div>
        <div><dt>Reps</dt><dd>{p.reps || "-"}</dd></div>
        <div><dt>Tempo</dt><dd>{ex.tempo || "-"}</dd></div>
        <div><dt>Rest</dt><dd>{restAfter || (ex.rest ? ex.rest : "Go")}</dd></div>
      </dl>
      {videos.map((v) => (
        <DemoButton key={v.url} url={v.url} name={v.name} />
      ))}
      {prevSummary && <p className="small muted">Last week: {prevSummary}</p>}
      <table className="sets">
        <thead>
          <tr><th>Set</th><th>Weight</th><th>Reps</th><th><span className="sr-only">Done</span></th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={r.done ? "set-done" : ""}>
              <td>{i + 1}</td>
              <td>
                <input className="input" inputMode="decimal" placeholder="lb" value={r.weight}
                  aria-label={`Set ${i + 1} weight`} onChange={(e) => set(i, { weight: e.target.value })} />
              </td>
              <td>
                <input className="input" inputMode="numeric" placeholder={p.reps} value={r.reps}
                  aria-label={`Set ${i + 1} reps`} onChange={(e) => set(i, { reps: e.target.value })} />
              </td>
              <td>
                <button type="button" className={`check ${r.done ? "on" : ""}`} aria-pressed={r.done}
                  aria-label={`Set ${i + 1} done`} onClick={() => set(i, { done: !r.done })}>✓</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
}

function Conditioning({
  workout,
  log,
  onChange,
}: {
  workout: ReturnType<typeof conditioningFor>;
  log: SessionLog;
  onChange: (l: SessionLog) => void;
}) {
  if (!workout) return <p className="muted">No conditioning listed for this week.</p>;
  return (
    <section className="card stack session-card">
      <p className="label blue">Week {workout.week} conditioning</p>
      <h2>{workout.title}</h2>
      <ul className="movements">
        {workout.movements.map((m, i) => (
          <li key={i}>
            <span>{m.text}</span>
            {m.videoUrl && <DemoButton url={m.videoUrl} name={m.text} />}
          </li>
        ))}
      </ul>
      {workout.footnote && <p className="small muted"><em>{workout.footnote}</em></p>}
      <p><span className="pill">RPE {workout.rpe}</span></p>
      <div>
        <p className="label muted">Stimulus</p>
        <p>{workout.stimulus}</p>
      </div>
      {workout.scaling.length > 0 && (
        <div>
          <p className="label muted">Scaling</p>
          <ul className="scaling">
            {workout.scaling.map((x, i) => (
              <li key={i}><strong>{x.movement}:</strong> {x.text}</li>
            ))}
          </ul>
        </div>
      )}
      <ResultField log={log} onChange={onChange} placeholder="Rounds, time or how it felt" />
    </section>
  );
}

function ResultField({ log, onChange, placeholder }: { log: SessionLog; onChange: (l: SessionLog) => void; placeholder: string }) {
  return (
    <div className="field">
      <label htmlFor="result">Your result</label>
      <input id="result" className="input" placeholder={placeholder} value={log.result ?? ""}
        onChange={(e) => onChange({ ...log, result: e.target.value })} />
    </div>
  );
}
