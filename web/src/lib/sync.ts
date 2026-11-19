"use client";

import type { VersionId } from "@/data/types";
import { sb } from "./supabase";
import { setSaver, type AppState, type SessionLog } from "./store";

type LoadResult = { ok: true; state: AppState } | { ok: false; reason: "no-purchase" | "error"; message?: string };

/** Loads everything for the signed-in member, or reports that their email has no purchase. */
export async function loadMember(userId: string, email: string, metaName?: string): Promise<LoadResult> {
  const client = sb();
  const [purchase, profile, logs] = await Promise.all([
    client.from("purchases").select("paid_at, name").order("paid_at", { ascending: true }).limit(1),
    client.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    client.from("session_logs").select("key, data, completed_at").eq("user_id", userId),
  ]);
  const err = purchase.error || profile.error || logs.error;
  if (err) return { ok: false, reason: "error", message: err.message };
  if (!purchase.data?.length) return { ok: false, reason: "no-purchase" };

  const p = profile.data;
  const state: AppState = {
    account: {
      name: p?.name || purchase.data[0].name || metaName || "",
      email,
      purchasedAt: purchase.data[0].paid_at,
    },
    profile:
      p?.version && p.start_date && p.days?.length === 4
        ? { version: p.version as VersionId, startDate: p.start_date, days: p.days }
        : undefined,
    seenMilestones: p?.seen_milestones ?? [],
    macros: p?.macros ?? undefined,
    logs: Object.fromEntries(
      (logs.data ?? []).map((r) => [
        r.key,
        { ...(r.data as SessionLog), completedAt: r.completed_at ?? undefined } satisfies SessionLog,
      ]),
    ),
  };
  return { ok: true, state };
}

/** Saves changes as they happen. Typing in a set is debounced so we don't write on every keystroke. */
export function startSync(userId: string, onError: (msg: string) => void) {
  const dirtyLogs = new Map<string, SessionLog>();
  let profileDirty: AppState | null = null;
  let timer: number | undefined;

  const flush = async () => {
    timer = undefined;
    const client = sb();
    const logRows = [...dirtyLogs.entries()].map(([key, log]) => {
      const { completedAt, ...data } = log;
      return { user_id: userId, key, data, completed_at: completedAt ?? null, updated_at: new Date().toISOString() };
    });
    dirtyLogs.clear();
    const prof = profileDirty;
    profileDirty = null;
    const ops = [];
    if (logRows.length) ops.push(client.from("session_logs").upsert(logRows, { onConflict: "user_id,key" }));
    if (prof) {
      ops.push(
        client.from("profiles").upsert(
          {
            user_id: userId,
            name: prof.account?.name ?? null,
            version: prof.profile?.version ?? null,
            start_date: prof.profile?.startDate ?? null,
            days: prof.profile?.days ?? null,
            seen_milestones: prof.seenMilestones,
            macros: prof.macros ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        ),
      );
    }
    const results = await Promise.all(ops);
    const failed = results.find((r) => r.error);
    if (failed?.error) onError(failed.error.message);
  };

  setSaver((prev, next) => {
    for (const [k, v] of Object.entries(next.logs)) if (prev.logs[k] !== v) dirtyLogs.set(k, v);
    if (
      prev.profile !== next.profile ||
      prev.seenMilestones !== next.seenMilestones ||
      prev.macros !== next.macros ||
      prev.account?.name !== next.account?.name
    ) {
      profileDirty = next;
    }
    // Finishing a session or changing settings saves right away; typing waits a moment
    const urgent = profileDirty !== null || Object.keys(next.logs).some((k) => prev.logs[k]?.completedAt !== next.logs[k]?.completedAt);
    window.clearTimeout(timer);
    timer = window.setTimeout(flush, urgent ? 0 : 800);
  });

  const onHide = () => {
    if (timer !== undefined) {
      window.clearTimeout(timer);
      void flush();
    }
  };
  window.addEventListener("pagehide", onHide);
  document.addEventListener("visibilitychange", onHide);
  return () => {
    onHide();
    setSaver(null);
    window.removeEventListener("pagehide", onHide);
    document.removeEventListener("visibilitychange", onHide);
  };
}
