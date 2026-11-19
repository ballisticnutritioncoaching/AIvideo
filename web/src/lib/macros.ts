// The guide's 5-step method (Nutrition: Calculating your macros).
// 1 maintenance = bodyweight x 14 (sitting most of the day) or x 15-16 (on your feet a lot)
// 2 calories: fat loss = maintenance minus about 20%, maintenance = step 1
// 3 protein: 0.8-1 g per lb of goal bodyweight
// 4 fat: 0.3-0.4 g per lb of current bodyweight
// 5 carbs: calories left after protein and fat, divided by 4

export interface MacroResult {
  maintenance: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  proteinCal: number;
  fatCal: number;
}

// Matches the guide's worked examples: ties round down (52.5 g fat -> 50, 202.5 g carbs -> 200)
const round5 = (n: number) => Math.round(n / 5 - 1e-6) * 5;

export function calculateMacros(input: {
  weight: number;
  goalWeight: number;
  activity: number;
  phase: "deficit" | "maintenance";
  proteinPerLb: number;
  fatPerLb: number;
}): MacroResult | null {
  const { weight, goalWeight, activity, phase, proteinPerLb, fatPerLb } = input;
  if (!(weight > 50 && weight < 700) || !(goalWeight > 50 && goalWeight < 700)) return null;
  const maintenance = Math.round(weight * activity);
  // The guide rounds fat-loss calories to the nearest 100 (2,128 -> 2,100)
  const calories = phase === "deficit" ? Math.round((maintenance * 0.8) / 100) * 100 : maintenance;
  const protein = round5(proteinPerLb * goalWeight);
  const fat = round5(fatPerLb * weight);
  const proteinCal = protein * 4;
  const fatCal = fat * 9;
  const carbs = Math.max(0, round5((calories - proteinCal - fatCal) / 4));
  return { maintenance, calories, protein, fat, carbs, proteinCal, fatCal };
}
