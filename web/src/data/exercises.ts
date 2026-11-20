// Exercise library: every movement in the program, grouped by pattern and ordered easiest to hardest.
// Swaps follow the guide's rule: same movement, same muscles. Keep the sets, reps, tempo and rest.
// Swaps are only ever easier (regressions) or a different piece of equipment at the same level.
// Videos come from the program data, plus conditioning demos linked in the guide's scaling notes.

import { PROGRAM } from "./program";

export type Pattern =
  | "squat" | "hinge" | "glutes" | "single-leg"
  | "horizontal-push" | "vertical-push" | "vertical-pull" | "horizontal-pull"
  | "biceps" | "triceps" | "shoulders" | "core-front" | "core-side"
  | "cardio" | "jump" | "burpee" | "carry" | "power";

export const PATTERNS: Record<Pattern, string> = {
  squat: "Squat",
  hinge: "Hinge",
  glutes: "Glutes",
  "single-leg": "Single leg",
  "horizontal-push": "Horizontal push",
  "vertical-push": "Vertical push",
  "vertical-pull": "Vertical pull",
  "horizontal-pull": "Horizontal pull",
  biceps: "Arms: biceps",
  triceps: "Arms: triceps",
  shoulders: "Shoulders and upper back",
  "core-front": "Core: front",
  "core-side": "Core: sides and rotation",
  cardio: "Cardio machine",
  jump: "Jump rope",
  burpee: "Burpee",
  carry: "Carry",
  power: "Power and med ball",
};

/** Level 1 is the easiest version of the pattern. Same level = an equipment swap. */
const LADDER: [name: string, pattern: Pattern, level: number][] = [
  ["Air Squat", "squat", 0],
  ["Dumbbell Goblet Squat", "squat", 1],
  ["1-1/4 Dumbbell Goblet Squat", "squat", 2],
  ["Dumbbell Front Squat", "squat", 2],
  ["Front Box Squat", "squat", 3],
  ["Back Squat", "squat", 4],

  ["Kettlebell RDL", "hinge", 1],
  ["Dumbbell RDL", "hinge", 1],
  ["B-stance Dumbbell RDL", "hinge", 2],
  ["Barbell RDL", "hinge", 3],
  ["Supported Single-leg Dumbbell RDL", "hinge", 3],
  ["Russian Kettlebell Swing", "power", 2],

  ["Dumbbell Glute Bridge", "glutes", 1],
  ["B-stance Dumbbell Glute Bridge", "glutes", 2],
  ["Tall-kneeling Dumbbell Good Morning", "glutes", 2],
  ["Single-leg Dumbbell Glute Bridge", "glutes", 3],
  ["Tall-kneeling Zercher Good Morning", "glutes", 3],
  ["Barbell Glute Bridge", "glutes", 4],

  ["Split Squat", "single-leg", 0],
  ["Walking Lunge", "single-leg", 0],
  ["Dumbbell Split Squat", "single-leg", 1],
  ["Dumbbell Reverse Lunge", "single-leg", 2],
  ["Front Foot Elevated Dumbbell Split Squat", "single-leg", 3],
  ["Dumbbell Walking Lunge", "single-leg", 3],
  ["Dumbbell Drop Lunge", "single-leg", 4],

  ["Alternating Dumbbell Floor Press", "horizontal-push", 1],
  ["Alternating Dumbbell Bench Press", "horizontal-push", 1],
  ["Dumbbell Floor Press", "horizontal-push", 2],
  ["Dumbbell Bench Press", "horizontal-push", 2],
  ["Eccentric Deficit Push-up", "horizontal-push", 2],
  ["Deficit Push-up", "horizontal-push", 3],
  ["Barbell Bench Press", "horizontal-push", 4],

  ["Half-kneeling Single-arm Dumbbell Shoulder Press", "vertical-push", 1],
  ["Dumbbell Shoulder Press", "vertical-push", 2],
  ["Tall-kneeling Arnold Press", "vertical-push", 2],
  ["Barbell Shoulder Press", "vertical-push", 3],

  ["Banded Lat Pull-down", "vertical-pull", 1],
  ["Half-kneeling Band Lat Pull-down", "vertical-pull", 1],
  ["Lat Pull-down", "vertical-pull", 1],
  ["Eccentric Pull-up", "vertical-pull", 2],
  ["Tempo Pull-up", "vertical-pull", 3],
  ["Weighted Eccentric Chin-up", "vertical-pull", 4],

  ["Half-kneeling Single-arm Band Row", "horizontal-pull", 2],
  ["Chest-supported Dumbbell Row", "horizontal-pull", 2],
  ["Three-point Dumbbell Row", "horizontal-pull", 2],
  ["Half-kneeling Single-arm Cable Row", "horizontal-pull", 2],
  ["Ring/TRX Row", "horizontal-pull", 2],
  ["Barbell Inverted Row, supinated grip", "horizontal-pull", 3],
  ["Dumbbell Bent-over Row", "horizontal-pull", 3],

  ["1-1/4 Dumbbell Biceps Curl", "biceps", 2],
  ["Incline Dumbbell Biceps Curl", "biceps", 2],
  ["Zottman Curl", "biceps", 2],
  ["Banded Triceps Push-down", "triceps", 1],
  ["Cable Triceps Push-down", "triceps", 1],

  ["Band Pull-apart", "shoulders", 1],
  ["Band Face Pull", "shoulders", 1],
  ["Cable Face Pull", "shoulders", 1],
  ["Three-position Bent-over Lateral Raise", "shoulders", 2],
  ["Prone Three-position Lateral Raise", "shoulders", 2],

  ["Low Front Plank", "core-front", 0],
  ["Hollow Hold", "core-front", 1],
  ["AbMat Sit-up", "core-front", 1],
  ["Hollow Rock", "core-front", 2],
  ["Alternating V-up", "core-front", 3],
  ["Hanging Knee Raise", "core-front", 3],

  ["Low Side Plank", "core-side", 1],
  ["Split Stance Pallof Press", "core-side", 2],
  ["Half-kneeling Band Rotation", "core-side", 2],
  ["Half-kneeling Cable Rotation", "core-side", 2],
  ["Plank Pull-through", "core-side", 2],

  ["Echo/Assault Bike", "cardio", 1],
  ["Row", "cardio", 1],
  ["Ski Erg", "cardio", 1],
  ["Line Hop", "jump", 1],
  ["Jump Rope", "jump", 2],
  ["Double Under", "jump", 3],
  ["Up-down", "burpee", 1],
  ["Burpee", "burpee", 2],
  ["Burpee Box Jump", "burpee", 3],
  ["Farmer Carry", "carry", 1],
  ["Medicine Ball Run", "power", 1],
  ["Lateral Medicine Ball Toss", "power", 2],
];

/** Demos linked from the guide's conditioning pages and scaling notes. */
const EXTRA_VIDEOS: Record<string, string> = {
  "Up-down": "https://youtu.be/81YB9bhQk3g",
  "Line Hop": "https://youtube.com/shorts/mdJNoLES120",
  Burpee: "https://youtu.be/c1M1wjeZOYY",
  "Burpee Box Jump": "https://youtu.be/HWkusQYVQAo",
  "Air Squat": "https://www.youtube.com/watch?v=hh2WDbmfwj0",
  "Walking Lunge": "https://youtu.be/adn4iQE7psM",
  "Jump Rope": "https://youtu.be/hCuXYrTOMxI",
  "Double Under": "https://youtu.be/-tF3hUsPZAI",
  "Echo/Assault Bike": "https://youtube.com/shorts/sGCxySj1VT8",
  Row: "https://youtu.be/Y1GhfJoWLko",
  "Ski Erg": "https://youtu.be/tJU6VGbGEaI",
  "Farmer Carry": "https://youtu.be/9539aIvAhm4",
  "Plank Pull-through": "https://youtu.be/Zko5x2SoQmo",
  "Low Front Plank": "https://youtu.be/EPiXN2bkLoQ",
  "Medicine Ball Run": "https://youtu.be/SyY9xrJiGuw",
  "Lateral Medicine Ball Toss": "https://youtu.be/hP1KEu3UAGM",
  "Russian Kettlebell Swing": "https://youtu.be/KkYOW3jDhoM",
  "AbMat Sit-up": "https://youtube.com/shorts/ShrFtX559Tc",
};

/** Exercises without their own demo that borrow another's, with a note on the difference. */
const BORROWED_DEMOS: Record<string, { from: string; note: string }> = {
  "Split Squat": { from: "Dumbbell Split Squat", note: "The demo shows the dumbbell version. Same movement, no weights." },
};

export interface Exercise {
  id: string;
  name: string;
  note?: string;
  pattern: Pattern;
  level: number;
  equipment: string;
  videoUrl?: string;
  /** Gym versions where the program uses it */
  versions: ("functional" | "commercial" | "home")[];
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function equipmentOf(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("barbell") || n.includes("back squat") || n.includes("front box") || n.includes("zercher")) return "Barbell";
  if (n.includes("cable") || n === "lat pull-down") return "Cable";
  if (n.includes("band")) return "Band";
  if (n.includes("ring") || n.includes("trx")) return "Rings/TRX";
  if (n.includes("kettlebell")) return "Kettlebell";
  if (n.includes("dumbbell") || n.includes("zottman") || n.includes("arnold") || n.includes("lateral raise") || n.includes("farmer")) return "Dumbbells";
  if (n.includes("pull-up") || n.includes("chin-up") || n.includes("hanging")) return "Pull-up bar";
  if (n.includes("medicine ball")) return "Med ball";
  if (n.includes("bike") || n === "row" || n.includes("ski erg")) return "Machine";
  if (n.includes("rope") || n.includes("double under")) return "Jump rope";
  if (n.includes("box")) return "Box";
  return "Bodyweight";
}

function build(): Exercise[] {
  const videos = new Map<string, string>(Object.entries(EXTRA_VIDEOS));
  const versions = new Map<string, Set<Exercise["versions"][number]>>();
  for (const v of PROGRAM) {
    for (const b of v.blocks) {
      for (const d of [b.day1, b.day3]) {
        for (const x of d.exercises) {
          const parts = x.videoUrls ?? [{ name: x.name, url: x.videoUrl ?? "" }];
          for (const p of parts) {
            if (p.url && !videos.has(p.name)) videos.set(p.name, p.url);
            versions.set(p.name, (versions.get(p.name) ?? new Set()).add(v.id));
          }
        }
      }
    }
  }
  return LADDER.map(([name, pattern, level]) => ({
    id: slug(name),
    name,
    pattern,
    level,
    equipment: equipmentOf(name),
    videoUrl: videos.get(name) ?? (BORROWED_DEMOS[name] ? videos.get(BORROWED_DEMOS[name].from) : undefined),
    note: BORROWED_DEMOS[name]?.note,
    versions: [...(versions.get(name) ?? [])],
  }));
}

export const EXERCISES: Exercise[] = build();

/**
 * Same-stimulus swaps with different equipment that sit at different ladder levels.
 * 1) The program's own: the exercise each gym version uses in the same slot (block, day, order).
 * 2) A few equipment-only pairs for gyms without a rack or bench.
 */
const MANUAL_EQUIVALENTS: [string, string][] = [
  ["Back Squat", "Dumbbell Front Squat"],
  ["Deficit Push-up", "Dumbbell Bench Press"],
  ["Deficit Push-up", "Dumbbell Floor Press"],
];

function buildEquivalents(): Map<string, Set<string>> {
  const slots = new Map<string, Set<string>>();
  for (const v of PROGRAM) {
    for (const b of v.blocks) {
      for (const [dn, d] of [["d1", b.day1], ["d3", b.day3]] as const) {
        for (const x of d.exercises) {
          const name = x.videoUrls?.[0]?.name ?? x.name;
          const k = `${b.block}-${dn}-${x.order}`;
          slots.set(k, (slots.get(k) ?? new Set()).add(name));
        }
      }
    }
  }
  const eq = new Map<string, Set<string>>();
  const link = (a: string, c: string) => {
    if (a === c) return;
    eq.set(a, (eq.get(a) ?? new Set()).add(c));
    eq.set(c, (eq.get(c) ?? new Set()).add(a));
  };
  for (const names of slots.values()) for (const a of names) for (const c of names) link(a, c);
  for (const [a, c] of MANUAL_EQUIVALENTS) link(a, c);
  return eq;
}
const EQUIVALENTS = buildEquivalents();

/** Coach overrides: options never offered as a swap for a given exercise. */
const SWAP_EXCLUDE: Record<string, string[]> = {
  "Dumbbell Split Squat": ["Walking Lunge"],
};
const byId = new Map(EXERCISES.map((e) => [e.id, e]));
const byName = new Map(EXERCISES.map((e) => [e.name.toLowerCase(), e]));

export const exerciseById = (id: string) => byId.get(id);
export const exerciseByName = (name: string) => byName.get(name.toLowerCase());

/**
 * Swap options for an exercise: easier versions (regressions, closest first) and same-level
 * alternatives with different equipment for a similar stimulus. Swaps never go harder.
 */
export function optionsFor(ex: Exercise) {
  const excluded = new Set(SWAP_EXCLUDE[ex.name] ?? []);
  const same = EXERCISES.filter((e) => e.pattern === ex.pattern && e.id !== ex.id && !excluded.has(e.name));
  // Same level, plus the program's equivalents that aren't harder by the ladder
  const equivalentNames = EQUIVALENTS.get(ex.name) ?? new Set<string>();
  const alternatives = same
    .filter((e) => e.level === ex.level || (equivalentNames.has(e.name) && e.level <= ex.level))
    .sort((a, b) => b.level - a.level);
  const altIds = new Set(alternatives.map((e) => e.id));
  const easier = same.filter((e) => e.level < ex.level && !altIds.has(e.id)).sort((a, b) => b.level - a.level);
  return { easier, alternatives };
}

export function searchExercises(q: string): Exercise[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return EXERCISES.filter((e) => {
    const hay = `${e.name} ${PATTERNS[e.pattern]} ${e.equipment}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  }).slice(0, 30);
}

export interface SwapSlot {
  label: string;
  ex: Exercise;
}

/**
 * At most one option per slot, closest first, no repeats:
 * same level · same level (different equipment) · easier · easier (different equipment) · bodyweight.
 */
export function swapSlots(ex: Exercise): SwapSlot[] {
  const { easier, alternatives } = optionsFor(ex);
  const used = new Set<string>([ex.id]);
  const out: SwapSlot[] = [];
  const take = (label: string, list: Exercise[]) => {
    const pick = list.find((e) => !used.has(e.id));
    if (pick) {
      used.add(pick.id);
      out.push({ label, ex: pick });
    }
  };
  const sameGear = (e: Exercise) => e.equipment === ex.equipment;
  take("Same level", alternatives.filter(sameGear));
  take("Same level, different equipment", alternatives.filter((e) => !sameGear(e)));
  take("Easier", easier.filter(sameGear));
  take("Easier, different equipment", easier.filter((e) => !sameGear(e)));
  if (ex.equipment !== "Bodyweight") {
    take("Bodyweight", [...alternatives, ...easier].filter((e) => e.equipment === "Bodyweight"));
  }
  return out;
}
