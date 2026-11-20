"use client";

// Demo-mode persistence: everything lives in this browser's localStorage.
// The shape is kept flat so it can move to a database table per key later.

import { useSyncExternalStore } from "react";
import type { VersionId } from "@/data/types";

export interface SetLog {
  weight: string;
  reps: string;
  done: boolean;
}

export interface SessionLog {
  completedAt?: string;
  /** keyed by exercise order, e.g. "1A" */
  sets: Record<string, SetLog[]>;
  /** conditioning: rounds, time or a short note */
  result?: string;
  note?: string;
  /** Gym version used for this session, when different from the default (traveling, split memberships) */
  version?: VersionId;
  /** Swapped exercises: exercise order ("2A") -> exercise id from data/exercises.ts */
  swaps?: Record<string, string>;
}

/** Saved answers from the macro calculator (see lib/macros.ts) */
export interface MacroInputs {
  v: 2;
  units: "imperial" | "metric";
  sex?: "male" | "female";
  age?: number;
  heightIn?: number;
  weightLb?: number;
  goal?: "lose" | "maintain" | "build" | "reverse" | "pregnant";
  daily?: number;
  training?: number;
  goalWeightLb?: number;
  rate?: number;
  proteinPerLb?: number;
  split: "balanced" | "more-carb" | "less-carb";
  meals: number;
  tracking?: "none" | "lazy" | "full";
  complete?: boolean;
}

export interface AppState {
  account?: { name: string; email: string; purchasedAt: string };
  profile?: { version: VersionId; startDate: string; days: number[] };
  logs: Record<string, SessionLog>;
  seenMilestones: number[];
  macros?: MacroInputs;
}

const KEY = "bp12:v1";
const EMPTY: AppState = { logs: {}, seenMilestones: [] };

let cache: AppState | null = null;
const listeners = new Set<() => void>();

function read(): AppState {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

/** Called after each local change so it can be saved to the database (see lib/sync.ts). */
type Saver = (prev: AppState, next: AppState) => void;
let saver: Saver | null = null;
export function setSaver(s: Saver | null) {
  saver = s;
}

function write(next: AppState, persistRemote = true) {
  const prev = cache ?? EMPTY;
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // storage blocked (private mode): keep working in memory
  }
  listeners.forEach((l) => l());
  if (persistRemote && saver) saver(prev, next);
}

export function update(fn: (s: AppState) => AppState) {
  write(fn(read()));
}

/** Replace local state with what the database holds, without writing it back. */
export function hydrate(next: AppState) {
  write(next, false);
}

export function resetAll() {
  write(EMPTY, false);
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}

/** Returns null during server render and the first client paint, then the stored state. */
export function useAppState(): AppState | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export const sessionKey = (week: number, day: number) => `w${week}d${day}`;
