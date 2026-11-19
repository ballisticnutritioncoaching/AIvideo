// Content model for the Ballistic 12-Week Program.

export type VersionId = "functional" | "commercial" | "home";
export type BlockId = 1 | 2 | 3; // weeks 1-4, 5-8, 9-12

/** One line of prescription. When a lift changes week to week, `byWeek` holds one entry per week. */
export interface Prescription {
  sets: string; // "4"
  reps: string; // "10", "8-10e", "30-45s", "MAX", "6-8 + 4-6"
}

export interface StrengthExercise {
  order: string; // "1A", "3B"
  name: string; // "Dumbbell Goblet Squat"
  /** Optional second exercise for combos, e.g. "Dumbbell Floor Press + Eccentric Deficit Push-up" */
  note?: string; // small grey note under the name
  videoUrl?: string; // demo link; for combos, the first exercise's demo
  videoUrls?: { name: string; url: string }[]; // combos with several demos
  /** Same prescription every week of the block */
  sets?: string;
  reps?: string;
  /** Week-by-week prescription; keys are absolute week numbers (1-12) */
  byWeek?: Record<number, Prescription>;
  tempo?: string; // "22X1"
  rest?: string; // "2:00", ":30", "" (blank = go straight to next)
}

export interface StrengthDay {
  kind: "strength";
  day: 1 | 3;
  exercises: StrengthExercise[];
  /** Every strength day ends with box breathing */
  finisher: string;
}

export interface Movement {
  text: string; // "45 sec Burpee", "40-cal Echo/Assault Bike"
  videoUrl?: string;
}

export interface ScalingNote {
  movement: string; // "Burpee"
  text: string; // "modify to Up-down"
}

export interface ConditioningWorkout {
  week: number; // absolute week 1-12
  title: string; // "Seven rounds", "Every 12 minutes, for 36 minutes"
  movements: Movement[];
  footnote?: string; // "One round of Cindy = ..."
  rpe: string; // "6-7" or "6-7 / 4-5"
  stimulus: string;
  scaling: ScalingNote[];
}

export interface ConditioningDay {
  kind: "conditioning";
  day: 2;
  workouts: ConditioningWorkout[]; // one per week of the block
}

/** Minimalist home version replaces Day 2 conditioning with a walk-jog */
export interface WalkJogDay {
  kind: "walkjog";
  day: 2;
  title: string; // "Every week · 20-30 min · RPE 6-7"
  body: string;
  examples: string[];
}

export interface WalkDay {
  kind: "walk";
  day: 4;
  title: string; // "Every week · 45-60 minute Weighted Walk · RPE 5-6"
  body: string;
}

export interface Block {
  block: BlockId;
  weeks: [number, number]; // [1, 4]
  day1: StrengthDay;
  day2: ConditioningDay | WalkJogDay;
  day3: StrengthDay;
  day4: WalkDay;
}

export interface ProgramVersion {
  id: VersionId;
  name: string; // "Functional Fitness Gym"
  short: string; // "Functional Fitness"
  equipment: string; // "What you need: ..."
  summary: string; // card blurb from "Pick your version"
  blocks: Block[];
}
