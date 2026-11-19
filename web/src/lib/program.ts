import { PROGRAM } from "@/data/program";
import type {
  Block,
  ConditioningWorkout,
  ProgramVersion,
  StrengthExercise,
  VersionId,
} from "@/data/types";
import { sessionKey, type AppState } from "./store";

export const WEEKS = 12;
export const DAYS = [1, 2, 3, 4] as const;
export const TOTAL_SESSIONS = WEEKS * DAYS.length;

export function getVersion(id: VersionId): ProgramVersion {
  return PROGRAM.find((v) => v.id === id) ?? PROGRAM[0];
}

export function blockForWeek(version: ProgramVersion, week: number): Block {
  return version.blocks.find((b) => week >= b.weeks[0] && week <= b.weeks[1]) ?? version.blocks[0];
}

export function dayTitle(version: ProgramVersion, day: number): string {
  if (day === 1 || day === 3) return "Full-body strength";
  if (day === 2) return version.id === "home" ? "Walk-jog" : "Conditioning";
  return "Weighted walk";
}

export function dayEffort(version: ProgramVersion, day: number): string {
  if (day === 1 || day === 3) return "1-2 RIR";
  if (day === 2) return "RPE 6-7";
  return "RPE 5-6";
}

export function dayLength(day: number): string {
  if (day === 4) return "45-60 min";
  return "About an hour";
}

/** Sets and reps for one exercise in a given week. */
export function prescription(ex: StrengthExercise, week: number) {
  const w = ex.byWeek?.[week];
  return { sets: w?.sets ?? ex.sets ?? "", reps: w?.reps ?? ex.reps ?? "" };
}

export function setCount(ex: StrengthExercise, week: number): number {
  const n = parseInt(prescription(ex, week).sets, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function conditioningFor(block: Block, week: number): ConditioningWorkout | undefined {
  return block.day2.kind === "conditioning"
    ? block.day2.workouts.find((w) => w.week === week)
    : undefined;
}

/** Superset groups: "3A" and "3B" share a group "3". */
export function groupExercises(list: StrengthExercise[]) {
  const groups: { key: string; items: StrengthExercise[] }[] = [];
  for (const ex of list) {
    const key = ex.order.replace(/[A-Z]$/i, "");
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(ex);
    else groups.push({ key, items: [ex] });
  }
  return groups;
}

export interface SessionRef {
  week: number;
  day: number;
  index: number; // 0..47
}

export function allSessions(): SessionRef[] {
  const out: SessionRef[] = [];
  for (let w = 1; w <= WEEKS; w++) for (const d of DAYS) out.push({ week: w, day: d, index: out.length });
  return out;
}

export const isDone = (s: AppState, week: number, day: number) =>
  Boolean(s.logs[sessionKey(week, day)]?.completedAt);

/** Missed a day? Pick up with the next session on your list. */
export function nextSession(s: AppState): SessionRef | null {
  return allSessions().find((r) => !isDone(s, r.week, r.day)) ?? null;
}

export function completedCount(s: AppState): number {
  return allSessions().filter((r) => isDone(s, r.week, r.day)).length;
}

export function weekComplete(s: AppState, week: number) {
  return DAYS.every((d) => isDone(s, week, d));
}

/** Weeks with at least two lifts done count toward the streak. "2 lifts and a walk beats skipping the week." */
export function weekStreak(s: AppState): number {
  const next = nextSession(s);
  const current = next ? next.week : WEEKS + 1;
  let streak = 0;
  for (let w = current - 1; w >= 1; w--) {
    if (isDone(s, w, 1) && isDone(s, w, 3)) streak++;
    else break;
  }
  return streak;
}

/** Block milestones after weeks 4, 8 and 12 */
export const MILESTONE_WEEKS = [4, 8, 12];

export function pendingMilestone(s: AppState): number | null {
  for (const w of MILESTONE_WEEKS) {
    if (weekComplete(s, w) && !s.seenMilestones.includes(w)) return w;
  }
  return null;
}

/** Suggested calendar day for a session, based on the start date and chosen training days. */
export function suggestedDate(startDate: string, days: number[], index: number): Date | null {
  if (!startDate || days.length !== 4) return null;
  const sorted = [...days].sort((a, b) => a - b);
  const d = new Date(startDate + "T12:00:00");
  let found = -1;
  for (let i = 0; i < 7 * 13 && found < index; i++) {
    if (sorted.includes(d.getDay())) found++;
    if (found === index) return d;
    d.setDate(d.getDate() + 1);
  }
  return null;
}
