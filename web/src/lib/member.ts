"use client";

import { useSyncExternalStore } from "react";
import { hydrate, resetAll } from "./store";
import { remoteEnabled, sb } from "./supabase";
import { loadMember, startSync } from "./sync";

export type MemberStatus =
  | { s: "demo" }
  | { s: "loading" }
  | { s: "signed-out" }
  | { s: "no-purchase"; email: string }
  | { s: "error"; message: string }
  | { s: "ready"; email: string; syncError?: string };

let status: MemberStatus = remoteEnabled ? { s: "loading" } : { s: "demo" };
let started = false;
let stopSync: (() => void) | null = null;
let currentUser: string | null = null;
const listeners = new Set<() => void>();

function set(next: MemberStatus) {
  status = next;
  listeners.forEach((l) => l());
}

async function onSession(user: { id: string; email?: string; user_metadata?: { name?: string } } | null) {
  if (!user) {
    currentUser = null;
    stopSync?.();
    stopSync = null;
    set({ s: "signed-out" });
    return;
  }
  if (currentUser === user.id && status.s === "ready") return;
  currentUser = user.id;
  set({ s: "loading" });
  const email = user.email ?? "";
  const res = await loadMember(user.id, email, user.user_metadata?.name);
  if (!res.ok) {
    set(res.reason === "no-purchase" ? { s: "no-purchase", email } : { s: "error", message: res.message ?? "Something went wrong" });
    return;
  }
  hydrate(res.state);
  stopSync?.();
  stopSync = startSync(user.id, (msg) => set({ s: "ready", email, syncError: msg }));
  set({ s: "ready", email });
}

function start() {
  if (started || !remoteEnabled) return;
  started = true;
  const client = sb();
  client.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "INITIAL_SESSION") {
      // Defer: Supabase recommends not awaiting other calls inside this callback
      setTimeout(() => onSession(session?.user ?? null), 0);
    }
  });
}

function subscribe(l: () => void) {
  start();
  listeners.add(l);
  return () => listeners.delete(l);
}

const SERVER_STATUS: MemberStatus = remoteEnabled ? { s: "loading" } : { s: "demo" };

export function useMember(): MemberStatus {
  return useSyncExternalStore(subscribe, () => status, () => SERVER_STATUS);
}

export async function signOut() {
  if (remoteEnabled) await sb().auth.signOut();
  resetAll();
}
