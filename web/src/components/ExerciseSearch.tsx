"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { EXERCISES, exerciseById, optionsFor, PATTERNS, searchExercises, type Exercise, type Pattern } from "@/data/exercises";
import { VideoEmbed } from "./Video";

const VERSION_NAMES = { functional: "Functional gym", commercial: "Commercial gym", home: "Home" } as const;

export function ExerciseSearch() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}

function Search() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const selected = exerciseById(params.get("ex") ?? "");
  const [q, setQ] = useState("");
  const results = useMemo(() => searchExercises(q), [q]);

  const select = (ex: Exercise | null) => {
    router.replace(ex ? `${path}?ex=${ex.id}` : path, { scroll: false });
    setQ("");
    if (ex) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="ex-search">
      <div className="field">
        <label htmlFor="ex-q">Search an exercise</label>
        <input id="ex-q" className="input" type="search" placeholder="Try goblet squat, row, push-up, bike" value={q}
          onChange={(e) => setQ(e.target.value)} autoComplete="off" />
      </div>

      {q && (
        <ul className="ex-results">
          {results.length === 0 && <li className="small muted">No match. Try one word, like &quot;squat&quot; or &quot;row&quot;.</li>}
          {results.map((ex) => (
            <li key={ex.id}>
              <button type="button" onClick={() => select(ex)}>
                <strong>{ex.name}</strong>
                <span className="small muted">{PATTERNS[ex.pattern]} · {ex.equipment}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected ? (
        <ExerciseDetail ex={selected} onSelect={select} />
      ) : (
        !q && <Browse onSelect={select} />
      )}
    </section>
  );
}

function ExerciseDetail({ ex, onSelect }: { ex: Exercise; onSelect: (e: Exercise | null) => void }) {
  const { easier, alternatives } = optionsFor(ex);
  return (
    <div className="stack">
      <div className="card stack">
        <div className="row between">
          <p className="label blue" style={{ margin: 0 }}>{PATTERNS[ex.pattern]}</p>
          <button type="button" className="btn ghost small" onClick={() => onSelect(null)}>All exercises</button>
        </div>
        <h2 style={{ margin: 0 }}>{ex.name}</h2>
        <p className="small muted" style={{ margin: 0 }}>
          {ex.equipment}
          {ex.versions.length > 0 && ` · In the program: ${ex.versions.map((v) => VERSION_NAMES[v]).join(", ")}`}
        </p>
        {ex.videoUrl && <VideoEmbed url={ex.videoUrl} name={ex.name} />}
      </div>
      <OptionGroup title="Different equipment, similar stimulus" hint="Swap when you don't have the gear." items={alternatives} onSelect={onSelect} />
      <OptionGroup title="Easier versions" hint="Less load, less range or more support. Use when something doesn't feel right." items={easier} onSelect={onSelect} />
      {!alternatives.length && !easier.length && <p className="small muted">This is the simplest version of this movement, so there&apos;s nothing to swap down to.</p>}
    </div>
  );
}

function OptionGroup({ title, hint, items, onSelect }: { title: string; hint: string; items: Exercise[]; onSelect: (e: Exercise) => void }) {
  if (!items.length) return null;
  return (
    <div className="stack">
      <div>
        <h3 style={{ marginBottom: 2 }}>{title}</h3>
        <p className="small muted" style={{ margin: 0 }}>{hint}</p>
      </div>
      {items.map((o) => (
        <div key={o.id} className="swap-option">
          <p className="swap-kind"><span className="pill outline">{o.equipment}</span></p>
          <h4>{o.name}</h4>
          {o.videoUrl && <VideoEmbed url={o.videoUrl} name={o.name} />}
          <button type="button" className="link-btn small" onClick={() => onSelect(o)}>See swaps for {o.name}</button>
        </div>
      ))}
    </div>
  );
}

function Browse({ onSelect }: { onSelect: (e: Exercise) => void }) {
  const patterns = Object.keys(PATTERNS) as Pattern[];
  return (
    <div className="stack">
      <p className="small muted" style={{ margin: 0 }}>Or browse by movement:</p>
      {patterns.map((p) => {
        const list = EXERCISES.filter((e) => e.pattern === p).sort((a, b) => a.level - b.level);
        if (!list.length) return null;
        return (
          <details key={p} className="browse-group">
            <summary>{PATTERNS[p]} <span className="small muted">({list.length})</span></summary>
            <ul>
              {list.map((e) => (
                <li key={e.id}>
                  <button type="button" onClick={() => onSelect(e)}>
                    {e.name} <span className="small muted">· {e.equipment}</span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
