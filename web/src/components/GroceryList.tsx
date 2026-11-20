"use client";

import { useEffect, useState } from "react";
import { GROCERY } from "@/data/library";

// Saved on this device only: the list you shop from lives on your phone.
const KEY = "bp12:grocery";

interface GroceryState {
  checked: string[];
  custom: string[];
}

function load(): GroceryState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return { checked: [], custom: [], ...JSON.parse(raw) };
  } catch {}
  return { checked: [], custom: [] };
}

export function GroceryList() {
  const [state, setState] = useState<GroceryState | null>(null);
  const [newItem, setNewItem] = useState("");
  useEffect(() => setState(load()), []);

  const save = (next: GroceryState) => {
    setState(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  };
  if (!state) return null;

  const checked = new Set(state.checked);
  const toggle = (item: string) =>
    save({ ...state, checked: checked.has(item) ? state.checked.filter((x) => x !== item) : [...state.checked, item] });
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const item = newItem.trim();
    if (!item || state.custom.includes(item)) return;
    save({ ...state, custom: [...state.custom, item] });
    setNewItem("");
  };
  const sections = [...GROCERY, ...(state.custom.length ? [{ category: "My extras", items: state.custom }] : [])];
  const total = sections.reduce((n, s) => n + s.items.length, 0);

  return (
    <section className="grocery">
      <div className="grocery-bar">
        <span className="small"><strong>{checked.size}</strong> of {total} in the cart</span>
        <div className="row" style={{ gap: 8 }}>
          <button type="button" className="btn small" disabled={!checked.size} onClick={() => save({ ...state, checked: [] })}>
            Clear checks
          </button>
          {state.custom.length > 0 && (
            <button type="button" className="btn small ghost" onClick={() => window.confirm("Remove your added items and clear all checks?") && save({ checked: [], custom: [] })}>
              Reset all
            </button>
          )}
        </div>
      </div>

      {sections.map((sec) => {
        const got = sec.items.filter((i) => checked.has(i)).length;
        return (
          <div key={sec.category} className="grocery-section">
            <div className="row between">
              <h3>{sec.category}</h3>
              <span className="small muted">{got}/{sec.items.length}</span>
            </div>
            <ul>
              {sec.items.map((item) => (
                <li key={item}>
                  <label className={checked.has(item) ? "got" : ""}>
                    <input type="checkbox" checked={checked.has(item)} onChange={() => toggle(item)} />
                    <span>{item}</span>
                    {sec.category === "My extras" && (
                      <button type="button" className="link-btn small" aria-label={`Remove ${item}`}
                        onClick={(e) => { e.preventDefault(); save({ checked: state.checked.filter((x) => x !== item), custom: state.custom.filter((x) => x !== item) }); }}>
                        Remove
                      </button>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <form className="row grocery-add" onSubmit={add}>
        <input className="input" placeholder="Add something else (diapers count)" value={newItem} onChange={(e) => setNewItem(e.target.value)} aria-label="Add an item" />
        <button type="submit" className="btn small solid" disabled={!newItem.trim()}>Add</button>
      </form>
    </section>
  );
}
