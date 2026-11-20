"use client";

import { useState } from "react";
import { GROCERY } from "@/data/library";
import { update, useAppState, type AppState } from "@/lib/store";

type Grocery = NonNullable<AppState["grocery"]>;
const EMPTY: Grocery = { checked: [], custom: {} };
const keyOf = (category: string, item: string) => `${category}::${item}`;

/** One food per line. Members can add their own foods to any section; those live on their account only. */
export function GroceryList() {
  const s = useAppState();
  const g: Grocery = { ...EMPTY, ...s?.grocery };
  const save = (next: Grocery) => update((st) => ({ ...st, grocery: next }));

  if (!s) return null;
  const checked = new Set(g.checked);
  const toggle = (k: string) =>
    save({ ...g, checked: checked.has(k) ? g.checked.filter((x) => x !== k) : [...g.checked, k] });
  const addFood = (category: string, food: string) => {
    const list = g.custom[category] ?? [];
    const all = [...(GROCERY.find((c) => c.category === category)?.items ?? []), ...list].map((x) => x.toLowerCase());
    if (all.includes(food.toLowerCase())) return false;
    save({ ...g, custom: { ...g.custom, [category]: [...list, food] } });
    return true;
  };
  const removeFood = (category: string, food: string) =>
    save({
      checked: g.checked.filter((x) => x !== keyOf(category, food)),
      custom: { ...g.custom, [category]: (g.custom[category] ?? []).filter((x) => x !== food) },
    });

  const total = GROCERY.reduce((n, c) => n + c.items.length + (g.custom[c.category]?.length ?? 0), 0);

  return (
    <section className="grocery">
      <div className="grocery-bar">
        <span className="small"><strong>{checked.size}</strong> of {total} in the cart</span>
        <button type="button" className="btn small" disabled={!checked.size} onClick={() => save({ ...g, checked: [] })}>
          Clear list
        </button>
      </div>

      {GROCERY.map((sec) => {
        const mine = g.custom[sec.category] ?? [];
        const lines = [...sec.items.map((item) => ({ item, own: false })), ...mine.map((item) => ({ item, own: true }))];
        const got = lines.filter((l) => checked.has(keyOf(sec.category, l.item))).length;
        return (
          <div key={sec.category} className="grocery-section">
            <div className="row between">
              <h3>{sec.category}</h3>
              <span className="small muted">{got}/{lines.length}</span>
            </div>
            <ul>
              {lines.map(({ item, own }) => {
                const k = keyOf(sec.category, item);
                return (
                  <li key={k}>
                    <label className={checked.has(k) ? "got" : ""}>
                      <input type="checkbox" checked={checked.has(k)} onChange={() => toggle(k)} />
                      <span>{item}</span>
                      {own && <span className="pill outline mine">Yours</span>}
                      {own && (
                        <button type="button" className="link-btn small" aria-label={`Remove ${item}`}
                          onClick={(e) => { e.preventDefault(); removeFood(sec.category, item); }}>
                          Remove
                        </button>
                      )}
                    </label>
                  </li>
                );
              })}
            </ul>
            <AddFood category={sec.category} onAdd={(food) => addFood(sec.category, food)} />
          </div>
        );
      })}
      <p className="small muted" style={{ margin: 0 }}>Foods you add are saved to your account only. They won&apos;t show up for anyone else.</p>
    </section>
  );
}

function AddFood({ category, onAdd }: { category: string; onAdd: (food: string) => boolean }) {
  const [open, setOpen] = useState(false);
  const [food, setFood] = useState("");
  const [msg, setMsg] = useState("");
  if (!open) {
    return (
      <button type="button" className="link-btn small grocery-add-link" onClick={() => setOpen(true)}>
        + Add a food to {category.toLowerCase()}
      </button>
    );
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const f = food.trim();
    if (!f) return;
    if (onAdd(f)) { setFood(""); setMsg(""); } else setMsg("That's already on the list.");
  };
  return (
    <form className="grocery-add" onSubmit={submit}>
      <div className="row" style={{ flexWrap: "nowrap" }}>
        <input className="input" autoFocus placeholder="One food, e.g. Turkey bacon" value={food}
          onChange={(e) => { setFood(e.target.value); setMsg(""); }} aria-label={`Add a food to ${category}`} />
        <button type="submit" className="btn small solid" disabled={!food.trim()}>Add</button>
        <button type="button" className="btn small ghost" onClick={() => { setOpen(false); setFood(""); setMsg(""); }}>Done</button>
      </div>
      {msg && <p className="small muted" style={{ margin: "6px 0 0" }}>{msg}</p>}
    </form>
  );
}
