// Ballistic macro calculator.
// Calories: Mifflin-St Jeor resting burn x activity, then adjusted for the goal.
// Protein: 0.7-1.0 g per lb (by goal), per lb of goal weight when BMI is 25 or higher.
// Carbs and fat: split the calories left after protein (balanced 50/50 by default).
// Hand portions convert grams into palms, cupped hands and thumbs.

const DEFAULT_RATE_CONST = 0.15;

export type Sex = "male" | "female";
export type Goal = "lose" | "maintain" | "build" | "reverse" | "pregnant";
export type Split = "balanced" | "more-carb" | "less-carb";
export type Tracking = "none" | "lazy" | "full";

export interface MacroInput {
  sex: Sex;
  age: number;
  heightIn: number;
  weightLb: number;
  goal: Goal;
  daily: number; // 0-3, activity outside workouts
  training: number; // 0-4, weekly exercise
  goalWeightLb?: number; // used when BMI >= 25
  rate?: number; // fat-loss deficit as a fraction of maintenance (0.10-0.25)
  proteinPerLb?: number; // override, 0.7-1.0
  split: Split;
  meals: number; // 3-6
}

export const DAILY = [
  { label: "Very light", desc: "Sitting most of the day (desk job, working from home).", factor: 1.2 },
  { label: "Light", desc: "A mix of sitting, standing and light activity (teacher, chasing a toddler at home).", factor: 1.3 },
  { label: "Moderate", desc: "On your feet most of the day (nurse on shifts, server, retail).", factor: 1.4 },
  { label: "Heavy", desc: "Hard physical work all day (construction, farm work).", factor: 1.55 },
];

export const TRAINING = [
  { label: "Very light", desc: "Almost no purposeful exercise right now.", add: 0 },
  { label: "Light", desc: "1-3 hours a week of gentle to moderate exercise.", add: 0.1 },
  { label: "This program", desc: "3-4 hours a week: 2 lifts, conditioning and a weighted walk.", add: 0.2 },
  { label: "Intense", desc: "4-6 hours a week of moderate to hard exercise.", add: 0.3 },
  { label: "Very intense", desc: "7+ hours a week of hard exercise.", add: 0.4 },
];

export const GOALS: Record<Goal, { label: string; desc: string; calorieFactor: number; proteinPerLb: number }> = {
  lose: { label: "Lose fat", desc: "Eat under maintenance, on purpose, for a set phase. You'll pick the pace.", calorieFactor: 1 - DEFAULT_RATE_CONST, proteinPerLb: 1.0 },
  maintain: { label: "Maintain and get stronger", desc: "Stay about the same weight while you build strength and habits.", calorieFactor: 1.0, proteinPerLb: 0.9 },
  build: { label: "Build muscle", desc: "Eat a little over maintenance to gain muscle slowly.", calorieFactor: 1.1, proteinPerLb: 0.8 },
  reverse: { label: "Coming off a diet", desc: "Add food back slowly until you reach maintenance.", calorieFactor: 1.0, proteinPerLb: 0.9 },
  pregnant: { label: "Pregnant or breastfeeding", desc: "No deficit. Eat at maintenance or above.", calorieFactor: 1.0, proteinPerLb: 0.9 },
};

/**
 * Fat-loss pace. Evidence: slower loss (~0.5-1% of bodyweight a week) better protects lean mass and RMR
 * (Garthe 2011 RCT; Ashtary-Larky 2020 meta-analysis; Helms 2014 review), and deficits over ~500 kcal/day
 * blunt lean-mass gains with lifting (Murphy & Koehler 2022 meta-analysis).
 */
export const PACES = [
  { rate: 0.1, label: "Gentle", desc: "Easiest to stick with. Best for protecting muscle, energy and sleep." },
  { rate: 0.15, label: "Steady", desc: "Realistic for most parents. Noticeable progress without feeling starved." },
  { rate: 0.2, label: "Faster", desc: "Harder to sustain. Expect more hunger, and keep phases short." },
  { rate: 0.25, label: "Aggressive", desc: "Short phases only. More muscle loss risk; only offered with more to lose." },
] as const;
export const DEFAULT_RATE = DEFAULT_RATE_CONST;
/** Aggressive pace is only offered when BMI is 25 or higher */
export const pacesFor = (bmi: number) => PACES.filter((p) => p.rate < 0.25 || bmi >= 25);

/** Estimated early weekly loss: deficit x 7 / 3,500 kcal per lb (loss slows over time, Hall 2011). */
export function paceEstimate(maintenance: number, rate: number, weightLb: number, bmr: number) {
  const target = Math.max(maintenance * (1 - rate), bmr);
  const deficit = maintenance - target;
  const lbPerWeek = (deficit * 7) / 3500;
  return { deficit: Math.round(deficit), lbPerWeek: Math.round(lbPerWeek * 10) / 10, pctPerWeek: Math.round((lbPerWeek / weightLb) * 1000) / 10 };
}

export const SPLITS: Record<Split, { label: string; carbShare: number }> = {
  balanced: { label: "Balanced", carbShare: 0.5 },
  "more-carb": { label: "More carbs", carbShare: 0.65 },
  "less-carb": { label: "Fewer carbs", carbShare: 0.35 },
};

/** Grams in one hand portion. Larger hands, larger portions. */
const HAND: Record<Sex, { palm: number; cupped: number; thumb: number }> = {
  male: { palm: 30, cupped: 30, thumb: 12 },
  female: { palm: 22, cupped: 22, thumb: 9 },
};

export const FAT_FLOOR_PER_LB = 0.25;

export const bmiOf = (weightLb: number, heightIn: number) => (703 * weightLb) / (heightIn * heightIn);
export const needsGoalWeight = (weightLb: number, heightIn: number) =>
  weightLb > 0 && heightIn > 0 && bmiOf(weightLb, heightIn) >= 25;

const round5 = (n: number) => Math.round(n / 5) * 5;
const round50 = (n: number) => Math.round(n / 50) * 50;

export interface Portion {
  perDay: number;
  perMealLow: number;
  perMealHigh: number;
}
const portion = (grams: number, per: number, meals: number): Portion => {
  const perDay = Math.max(1, Math.round(grams / per));
  return { perDay, perMealLow: Math.floor(perDay / meals) || 1, perMealHigh: Math.ceil(perDay / meals) };
};

export interface MacroResult {
  bmr: number;
  activity: number;
  rate: number;
  pace: { deficit: number; lbPerWeek: number; pctPerWeek: number } | null;
  maintenance: number;
  calories: number;
  bmi: number;
  proteinBasisLb: number;
  usedGoalWeight: boolean;
  proteinPerLb: number;
  protein: number;
  carbs: number;
  fat: number;
  fatFloorApplied: boolean;
  perMeal: { protein: number; carbs: number; fat: number };
  hands: { protein: Portion; carbs: Portion; fat: Portion; veggiesPerDay: string; veggiesPerMeal: string };
  hand: { palm: number; cupped: number; thumb: number };
}

export function calculate(i: MacroInput): MacroResult | null {
  if (!(i.age >= 18 && i.age <= 90 && i.heightIn >= 48 && i.heightIn <= 90 && i.weightLb >= 80 && i.weightLb <= 600)) return null;
  const kg = i.weightLb * 0.45359237;
  const cm = i.heightIn * 2.54;
  const bmr = 10 * kg + 6.25 * cm - 5 * i.age + (i.sex === "male" ? 5 : -161);
  const activity = DAILY[i.daily].factor + TRAINING[i.training].add;
  const maintenance = round50(bmr * activity);
  const goal = GOALS[i.goal];
  const rate = i.goal === "lose" ? Math.min(0.25, Math.max(0.1, i.rate ?? DEFAULT_RATE)) : 0;
  const factor = i.goal === "lose" ? 1 - rate : goal.calorieFactor;
  // A fat-loss target never goes below resting burn
  const calories = round50(Math.max(bmr * activity * factor, factor < 1 ? bmr : 0));
  const pace = i.goal === "lose" ? paceEstimate(bmr * activity, rate, i.weightLb, bmr) : null;

  const bmi = bmiOf(i.weightLb, i.heightIn);
  const usedGoalWeight = bmi >= 25 && !!i.goalWeightLb && i.goalWeightLb < i.weightLb;
  const proteinBasisLb = usedGoalWeight ? i.goalWeightLb! : i.weightLb;
  const proteinPerLb = Math.min(1, Math.max(0.7, i.proteinPerLb ?? goal.proteinPerLb));
  const protein = round5(proteinPerLb * proteinBasisLb);

  const remaining = Math.max(0, calories - protein * 4);
  const share = SPLITS[i.split].carbShare;
  let fat = (remaining * (1 - share)) / 9;
  const floor = FAT_FLOOR_PER_LB * i.weightLb;
  const fatFloorApplied = fat < floor;
  if (fatFloorApplied) fat = floor;
  fat = round5(fat);
  const carbs = Math.max(0, round5((calories - protein * 4 - fat * 9) / 4));

  const hand = HAND[i.sex];
  const m = i.meals;
  return {
    bmr: Math.round(bmr),
    activity,
    rate,
    pace,
    maintenance,
    calories,
    bmi: Math.round(bmi * 10) / 10,
    proteinBasisLb,
    usedGoalWeight,
    proteinPerLb,
    protein,
    carbs,
    fat,
    fatFloorApplied,
    perMeal: { protein: Math.round(protein / m), carbs: Math.round(carbs / m), fat: Math.round(fat / m) },
    hands: {
      protein: portion(protein, hand.palm, m),
      carbs: portion(carbs, hand.cupped, m),
      fat: portion(fat, hand.thumb, m),
      // 800 g of fruit and veg a day is roughly 6-8 fists
      veggiesPerDay: "6-8",
      veggiesPerMeal: m >= 5 ? "1-2" : "2",
    },
    hand,
  };
}

/** Unit helpers for the form */
export const lbFromKg = (kg: number) => kg / 0.45359237;
export const inFromCm = (cm: number) => cm / 2.54;
