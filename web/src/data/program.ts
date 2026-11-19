// Ballistic 12-Week Program, transcribed from the program guide PDF
// (Version 1: pages 9-14, Version 2: pages 16-21, Version 3: pages 23-25).

import type {
  Prescription,
  ProgramVersion,
  StrengthDay,
  WalkDay,
  WalkJogDay,
} from "./types";

/** Demo links from the PDF (tracking params stripped). */
const V = {
  // Strength
  dumbbellGobletSquat: "https://www.youtube.com/watch?v=a-dqF4NL2K4",
  kettlebellRdl: "https://youtu.be/mVSgE9S0G4w",
  latPullDown: "https://youtu.be/PEv0gTcMY3g",
  halfKneelingSingleArmDumbbellShoulderPress: "https://youtu.be/-7zgcCU2kW4",
  inclineDumbbellBicepsCurl: "https://youtu.be/aG7CXiKxepw",
  hollowHold: "https://youtu.be/4xRpGgttca8",
  alternatingDumbbellBenchPress: "https://youtu.be/7CHPqVxJOUE",
  dumbbellGluteBridge: "https://youtu.be/PSMW7iSi2BU",
  ringTrxRow: "https://youtu.be/B90sF7dbP04",
  dumbbellSplitSquat: "https://www.youtube.com/watch?v=T8k-J86Lz-w",
  bandPullApart: "https://youtu.be/MnDpmNYUjbc",
  lowSidePlank: "https://youtu.be/_R389Jk0tIo",
  frontBoxSquat: "https://www.youtube.com/watch?v=MBYVs31v5ZA",
  barbellRdl: "https://youtu.be/bT5OOBgY4bc",
  halfKneelingSingleArmCableRow: "https://youtu.be/DJtX3W3cc5I",
  dumbbellShoulderPress: "https://youtu.be/22gQUcvcW1o",
  cableFacePull: "https://youtu.be/_51xXOV8jO8",
  hollowRock: "https://youtu.be/6Qdh8qzxFY8",
  eccentricPullUp: "https://youtu.be/P_BlLZAMjsw",
  dumbbellBenchPress: "https://youtu.be/ZaDlbm8E8Tg",
  frontFootElevatedDumbbellSplitSquat: "https://www.youtube.com/watch?v=bZN3q31j8ks",
  cableTricepsPushDown: "https://youtu.be/-xa-6cQaZKY",
  bStanceDumbbellRdl: "https://youtu.be/LBzxZCUZrNA",
  halfKneelingCableRotation: "https://youtu.be/qnx_tHFkD0k",
  backSquat: "https://www.youtube.com/watch?v=Rvy12jFLBFo",
  supportedSingleLegDumbbellRdl: "https://youtu.be/Iok3nSFXLUU",
  barbellShoulderPress: "https://youtu.be/_aISMzimYEA",
  chestSupportedDumbbellRow: "https://youtu.be/DIS839guYUk",
  proneThreePositionLateralRaise: "https://youtu.be/NiH0GF48-ag",
  hangingKneeRaise: "https://youtu.be/KNzJ3GuIpB8",
  barbellBenchPress: "https://youtu.be/ejI1Nlsul9k",
  weightedEccentricChinUp: "https://youtu.be/W_rrGgVCvGI",
  barbellGluteBridge: "https://youtu.be/ti9u0SLrFVw",
  zottmanCurl: "https://youtu.be/ZXbOOIOPOi8",
  dumbbellDropLunge: "https://youtu.be/XFDJuLiZoXM",
  splitStancePallofPress: "https://youtu.be/7-hfxerzTHA",
  dumbbellRdl: "https://youtu.be/UsOjCcxSJaI",
  barbellInvertedRowSupinated: "https://youtu.be/zbLAEQ3e9gw",
  tempoPullUp: "https://youtube.com/shorts/9HrgRVA4KrM",
  tallKneelingZercherGoodMorning: "https://www.youtube.com/watch?v=LElW4KOm3vk",
  bandedLatPullDown: "https://www.youtube.com/watch?v=MDAk3N1wEfI",
  oneQuarterDumbbellBicepsCurl: "https://youtu.be/OxZ5Hgel_iQ",
  alternatingDumbbellFloorPress: "https://www.youtube.com/watch?v=5t9ggij1eXk",
  threePointDumbbellRow: "https://youtu.be/xeJMDUC5nck",
  dumbbellFrontSquat: "https://www.youtube.com/watch?v=rotBMUQHdZk",
  bStanceDumbbellGluteBridge: "https://youtu.be/ixmapIVvQLA",
  halfKneelingSingleArmBandRow: "https://youtube.com/shorts/Q3b4cM8P9DU",
  bandFacePull: "https://youtu.be/5jgKj8ColLg",
  halfKneelingBandLatPullDown: "https://youtu.be/ErDmbtmQrv4",
  dumbbellFloorPress: "https://youtu.be/tXv-rEa5xn8",
  eccentricDeficitPushUp: "https://youtube.com/shorts/B7HW6d5K5g8",
  deficitPushUp: "https://youtu.be/B68Foe2DkfI",
  dumbbellReverseLunge: "https://www.youtube.com/watch?v=PFwB_6NWP60",
  bandedTricepsPushDown: "https://youtu.be/HXia-KuaBu4",
  singleLegDumbbellGluteBridge: "https://youtu.be/0UZXLuSQAvc",
  halfKneelingBandRotation: "https://youtu.be/dEy6KCAyH74",
  oneQuarterDumbbellGobletSquat: "https://youtu.be/_9aY_7xQZ2k",
  tallKneelingArnoldPress: "https://youtu.be/Rd3pRGf7fyQ",
  dumbbellBentOverRow: "https://youtu.be/VP_f9V854og",
  threePositionBentOverLateralRaise: "https://youtu.be/hf7jnF45N_I",
  alternatingVUp: "https://youtu.be/0EIDVDbzVNo",
  tallKneelingDumbbellGoodMorning: "https://youtube.com/shorts/FRTpNzZktMg",
  dumbbellWalkingLunge: "https://youtu.be/KdE6b_r7wxA",
  // Conditioning
  burpee: "https://youtu.be/c1M1wjeZOYY",
  row: "https://youtu.be/Y1GhfJoWLko",
  echoAssaultBike: "https://youtube.com/shorts/sGCxySj1VT8",
  farmerCarry: "https://youtu.be/9539aIvAhm4",
  walkingLunge: "https://youtu.be/adn4iQE7psM",
  medicineBallRun: "https://youtu.be/SyY9xrJiGuw",
  burpeeBoxJump: "https://youtu.be/HWkusQYVQAo",
  plankPullThrough: "https://youtu.be/Zko5x2SoQmo",
  jumpRope: "https://youtu.be/hCuXYrTOMxI",
  lateralMedicineBallToss: "https://youtu.be/hP1KEu3UAGM",
  doubleUnder: "https://youtu.be/-tF3hUsPZAI",
  airSquat: "https://www.youtube.com/watch?v=hh2WDbmfwj0",
  russianKettlebellSwing: "https://youtu.be/KkYOW3jDhoM",
  abmatSitUp: "https://youtube.com/shorts/ShrFtX559Tc",
  lowFrontPlank: "https://youtu.be/EPiXN2bkLoQ",
} as const;

const BOX_BREATHING =
  "Box Breathing · 10 cycles: 4-second inhale, 1-second hold, 4-second exhale, 1-second hold";

/** Week-by-week prescription starting at absolute week `start`. */
function weeks(start: number, rows: [string, string][]): Record<number, Prescription> {
  const out: Record<number, Prescription> = {};
  rows.forEach(([sets, reps], i) => {
    out[start + i] = { sets, reps };
  });
  return out;
}

function strength(day: 1 | 3, exercises: StrengthDay["exercises"]): StrengthDay {
  return { kind: "strength", day, exercises, finisher: BOX_BREATHING };
}

const GYM_WALK: WalkDay = {
  kind: "walk",
  day: 4,
  title: "Every week · 45-60 minute Weighted Walk · RPE 5-6",
  body: "Walk with a weight vest or rucksack. No vest or rucksack? Walk on a treadmill at an incline or go for a walk outside.",
};

const HOME_WALK: WalkDay = {
  kind: "walk",
  day: 4,
  title: "Every week · 45-60 min · RPE 5-6",
  body: "Walk with a weight vest or rucksack. No vest or rucksack? Walk on a treadmill at an incline or go for a walk outside.",
};

const HOME_WALKJOG: WalkJogDay = {
  kind: "walkjog",
  day: 2,
  title: "Every week · 20-30 min · RPE 6-7",
  body: "Complete the walk-jog in any format you're able to sustain for the 20-30 minute window.",
  examples: [
    "5 rounds: 1 min jog, 3 min walk",
    "5 rounds: 3 min jog, 3 min walk",
    "5 rounds: 1 min run, 2 min jog, 3 min walk",
    "15 rounds: 30 sec jog, 90 sec walk",
  ],
};

const CINDY_FOOTNOTE = "One round of Cindy = 5 Pull-ups, 10 Push-ups, 15 Air Squats.";
const THREE_HAND_POSITIONS = "3 hand positions: neutral, pronated, supinated";
const TEMPO_PULL_UP_NOTE = "No need to pull up. Climb or jump to the top of each rep.";
const FLOOR_PRESS_NOTE = "Floor press, then go straight into the push-ups";

export const PROGRAM: ProgramVersion[] = [
  // ------------------------- VERSION 1 · FUNCTIONAL FITNESS GYM -------------------------
  {
    id: "functional",
    name: "Functional Fitness Gym",
    short: "Functional Fitness",
    equipment:
      "What you need: Barbells and racks, dumbbells, kettlebells, cables, rings or TRX, medicine balls, plyo box, Echo/Assault Bike, rower, BikeErg, jump rope.",
    summary:
      "The master program. For CrossFit-style gyms with barbells, rings, medicine balls, boxes and an Echo bike, rower and BikeErg.",
    blocks: [
      // Weeks 1-4 (pages 9-10)
      {
        block: 1,
        weeks: [1, 4],
        day1: strength(1, [
          { order: "1A", name: "Dumbbell Goblet Squat", videoUrl: V.dumbbellGobletSquat, byWeek: weeks(1, [["4", "10"], ["4", "8"], ["4", "6"], ["6", "4"]]), tempo: "22X1", rest: "2:00" },
          { order: "2A", name: "Kettlebell RDL", note: "One kettlebell; use two if you need more load", videoUrl: V.kettlebellRdl, byWeek: weeks(1, [["4", "10"], ["4", "8"], ["4", "6"], ["6", "4"]]), tempo: "30X1", rest: "2:00" },
          { order: "3A", name: "Lat Pull-down", videoUrl: V.latPullDown, sets: "3", reps: "8-10", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Half-kneeling Single-arm Dumbbell Shoulder Press", videoUrl: V.halfKneelingSingleArmDumbbellShoulderPress, sets: "3", reps: "8-10e", tempo: "20X1", rest: "" },
          { order: "4A", name: "Incline Dumbbell Biceps Curl", videoUrl: V.inclineDumbbellBicepsCurl, sets: "2", reps: "15-20", tempo: "20X0", rest: ":30" },
          { order: "5A", name: "Hollow Hold", videoUrl: V.hollowHold, sets: "2", reps: "30-45s", rest: "" },
        ]),
        day2: {
          kind: "conditioning",
          day: 2,
          workouts: [
            {
              week: 1,
              title: "Seven rounds",
              movements: [
                { text: "45 sec Burpee", videoUrl: V.burpee },
                { text: "15 sec rest" },
                { text: "45 sec Row", videoUrl: V.row },
                { text: "15 sec rest" },
                { text: "45 sec Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "15 sec rest" },
                { text: "45 sec Farmer Carry", videoUrl: V.farmerCarry },
                { text: "15 sec rest" },
              ],
              rpe: "6-7",
              stimulus: "Move at a steady, manageable pace across all seven rounds.",
              scaling: [
                { movement: "Burpee", text: "modify to Up-down" },
                { movement: "Row", text: "modify to another cardio machine" },
                { movement: "Bike", text: "modify to another cardio machine" },
                { movement: "Farmer Carry", text: "decrease load" },
              ],
            },
            {
              week: 2,
              title: "As many rounds as possible in 40 minutes",
              movements: [
                { text: "40-cal Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "30-cal Row", videoUrl: V.row },
                { text: "20 Walking Lunge", videoUrl: V.walkingLunge },
                { text: "10 Hollow Rock", videoUrl: V.hollowRock },
              ],
              rpe: "6-7",
              stimulus: "Complete 4-5 rounds in the 40-minute window.",
              scaling: [
                { movement: "Bike", text: "decrease calories; modify to another cardio machine" },
                { movement: "Row", text: "decrease calories; modify to another cardio machine" },
                { movement: "Walking Lunge", text: "decrease reps; modify to Air Squat" },
                { movement: "Hollow Rock", text: "decrease reps; modify to Hollow Rock, tuck position, or Low Front Plank" },
              ],
            },
            {
              week: 3,
              title: "Six rounds",
              movements: [
                { text: "Minute one: Medicine Ball Run", videoUrl: V.medicineBallRun },
                { text: "Minute two: Burpee Box Jump", videoUrl: V.burpeeBoxJump },
                { text: "Minute three: Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "Minute four: Plank Pull-through", videoUrl: V.plankPullThrough },
                { text: "Minute five: Jump Rope", videoUrl: V.jumpRope },
              ],
              rpe: "6-7",
              stimulus: "Move at a steady, manageable pace across the six rounds.",
              scaling: [
                { movement: "Medicine Ball Run", text: "decrease load; modify to another cardio machine" },
                { movement: "Burpee Box Jump", text: "decrease height; modify to Burpee Step-up" },
                { movement: "Plank Pull-through", text: "decrease load; decrease time; modify to High Plank" },
                { movement: "Jump Rope", text: "modify to Jumping Jack or Ali Shuffle" },
              ],
            },
            {
              week: 4,
              title: "Every 12 minutes, for 36 minutes",
              movements: [
                { text: "600-meter Run" },
                { text: "600-meter Row", videoUrl: V.row },
                { text: "1200-meter BikeErg" },
              ],
              rpe: "6-7",
              stimulus: "Complete each round in 8:30-9:30.",
              scaling: [
                { movement: "Run", text: "decrease distance" },
                { movement: "Row", text: "decrease distance; modify to Run (600 meters)" },
                { movement: "BikeErg", text: "decrease distance; modify to Echo/Assault Bike" },
              ],
            },
          ],
        },
        day3: strength(3, [
          { order: "1A", name: "Alternating Dumbbell Bench Press", videoUrl: V.alternatingDumbbellBenchPress, byWeek: weeks(1, [["4", "6e"], ["4", "5e"], ["6", "4e"], ["6", "3e"]]), tempo: "20X1", rest: "2:00" },
          { order: "2A", name: "Dumbbell Glute Bridge", videoUrl: V.dumbbellGluteBridge, sets: "4", reps: "8-10", tempo: "20X0", rest: "2:00" },
          { order: "3A", name: "Ring/TRX Row", videoUrl: V.ringTrxRow, sets: "3", reps: "MAX", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Dumbbell Split Squat", videoUrl: V.dumbbellSplitSquat, sets: "3", reps: "6-8e", tempo: "22X1", rest: "" },
          { order: "4A", name: "Band Pull-apart", videoUrl: V.bandPullApart, sets: "2", reps: "20-25", tempo: "10X0", rest: ":30" },
          { order: "5A", name: "Low Side Plank", videoUrl: V.lowSidePlank, sets: "2", reps: "30-45s", rest: "" },
        ]),
        day4: GYM_WALK,
      },
      // Weeks 5-8 (pages 11-12)
      {
        block: 2,
        weeks: [5, 8],
        day1: strength(1, [
          { order: "1A", name: "Front Box Squat", videoUrl: V.frontBoxSquat, byWeek: weeks(5, [["4", "6"], ["4", "5"], ["6", "4"], ["6", "3"]]), tempo: "21X1", rest: "2:00" },
          { order: "2A", name: "Barbell RDL", videoUrl: V.barbellRdl, byWeek: weeks(5, [["4", "8"], ["4", "8"], ["4", "6"], ["4", "6"]]), tempo: "30X1", rest: "2:00" },
          { order: "3A", name: "Half-kneeling Single-arm Cable Row", videoUrl: V.halfKneelingSingleArmCableRow, sets: "3", reps: "8-10e", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Dumbbell Shoulder Press", videoUrl: V.dumbbellShoulderPress, sets: "3", reps: "8-10", tempo: "20X1", rest: "" },
          { order: "4A", name: "Cable Face Pull", videoUrl: V.cableFacePull, sets: "2", reps: "15-20", tempo: "20X0", rest: ":30" },
          { order: "5A", name: "Hollow Rock", videoUrl: V.hollowRock, sets: "2", reps: "40-60s", rest: "" },
        ]),
        day2: {
          kind: "conditioning",
          day: 2,
          workouts: [
            {
              week: 5,
              title: "Six rounds",
              movements: [
                { text: "Minute one: Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "Minute two: Lateral Medicine Ball Toss", videoUrl: V.lateralMedicineBallToss },
                { text: "Minute three: Row", videoUrl: V.row },
                { text: "Minute four: Farmer Carry", videoUrl: V.farmerCarry },
                { text: "Minute five: Jump Rope", videoUrl: V.jumpRope },
                { text: "Minute six: one round of Cindy" },
              ],
              footnote: CINDY_FOOTNOTE,
              rpe: "6-7",
              stimulus: "Move at a steady, manageable pace across the six rounds.",
              scaling: [
                { movement: "Bike", text: "modify to row, run, or ski" },
                { movement: "Lateral Medicine Ball Toss", text: "Side-to-Side Kettlebell Swing or Russian Twist" },
                { movement: "Row", text: "modify to bike, run, or ski" },
                { movement: "Farmer Carry", text: "decrease load" },
                { movement: "Jump Rope", text: "Ali Shuffle or Line Hop" },
                { movement: "Cindy", text: "decrease reps; Ring Row, Elevated Push-up, Air Squat" },
              ],
            },
            {
              week: 6,
              title: "Every 10 minutes, for 30 minutes",
              movements: [
                { text: "100 Double Under", videoUrl: V.doubleUnder },
                { text: "50/40-cal Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "30 Plank Pull-through", videoUrl: V.plankPullThrough },
                { text: "30 Lateral Medicine Ball Toss", videoUrl: V.lateralMedicineBallToss },
              ],
              rpe: "6-7",
              stimulus: "Complete each round in about 7:45-8:15.",
              scaling: [
                { movement: "Double Under", text: "decrease reps; 150 Single Under" },
                { movement: "Bike", text: "decrease calories; modify to Row (50/40 cal) or Run (600 meters)" },
                { movement: "Plank Pull-through", text: "decrease load; decrease reps; Low Front Plank" },
                { movement: "Lateral Medicine Ball Toss", text: "decrease load; decrease reps" },
              ],
            },
            {
              week: 7,
              title: "Eight rounds",
              movements: [
                { text: "Minute one: Row", videoUrl: V.row },
                { text: "Minute two: Farmer Carry", videoUrl: V.farmerCarry },
                { text: "Minute three: Run" },
                { text: "Minute four: Hollow Rock", videoUrl: V.hollowRock },
              ],
              rpe: "6-7",
              stimulus: "Move at a steady, manageable pace across the eight rounds.",
              scaling: [
                { movement: "Row", text: "modify to Bike, Run, or Erg" },
                { movement: "Farmer Carry", text: "decrease load" },
                { movement: "Run", text: "modify to Bike or Erg" },
                { movement: "Hollow Rock", text: "decrease time; Hollow Rock, tuck position; Low Front Plank" },
              ],
            },
            {
              week: 8,
              title: "Every 8 minutes, for 32 minutes",
              movements: [
                { text: "20 Air Squat", videoUrl: V.airSquat },
                { text: "400-meter Run" },
                { text: "20 Russian Kettlebell Swing", videoUrl: V.russianKettlebellSwing },
                { text: "400-meter Run" },
              ],
              rpe: "6-7",
              stimulus: "Complete the prescribed work in about 6:00.",
              scaling: [
                { movement: "Air Squat", text: "decrease reps; modify range of motion" },
                { movement: "Run", text: "decrease distance; modify to Row (500 meters) or Bike (0.70/0.60 mile)" },
                { movement: "Russian Kettlebell Swing", text: "decrease load; decrease reps" },
              ],
            },
          ],
        },
        day3: strength(3, [
          { order: "1A", name: "Eccentric Pull-up", videoUrl: V.eccentricPullUp, sets: "4", reps: "4-6", tempo: "3000", rest: "2:00" },
          { order: "2A", name: "Dumbbell Bench Press", videoUrl: V.dumbbellBenchPress, byWeek: weeks(5, [["4", "10"], ["4", "8"], ["4", "6"], ["6", "4"]]), tempo: "20X1", rest: "2:00" },
          { order: "3A", name: "Front Foot Elevated Dumbbell Split Squat", videoUrl: V.frontFootElevatedDumbbellSplitSquat, sets: "3", reps: "6-8e", tempo: "31X1", rest: "1:30" },
          { order: "3B", name: "Cable Triceps Push-down", videoUrl: V.cableTricepsPushDown, sets: "3", reps: "12-15", tempo: "20X0", rest: "" },
          { order: "4A", name: "B-stance Dumbbell RDL", videoUrl: V.bStanceDumbbellRdl, sets: "2", reps: "8-10e", tempo: "20X1", rest: ":30" },
          { order: "5A", name: "Half-kneeling Cable Rotation", videoUrl: V.halfKneelingCableRotation, sets: "2", reps: "12-15e", tempo: "20X0", rest: "" },
        ]),
        day4: GYM_WALK,
      },
      // Weeks 9-12 (pages 13-14)
      {
        block: 3,
        weeks: [9, 12],
        day1: strength(1, [
          { order: "1A", name: "Back Squat", videoUrl: V.backSquat, byWeek: weeks(9, [["4", "6"], ["4", "5"], ["6", "4"], ["6", "3"]]), tempo: "20X1", rest: "2:00" },
          { order: "2A", name: "Supported Single-leg Dumbbell RDL", videoUrl: V.supportedSingleLegDumbbellRdl, sets: "4", reps: "6-8e", tempo: "20X1", rest: "2:00" },
          { order: "3A", name: "Barbell Shoulder Press", videoUrl: V.barbellShoulderPress, sets: "3", reps: "8-10", tempo: "20X1", rest: "1:30" },
          { order: "3B", name: "Chest-supported Dumbbell Row", videoUrl: V.chestSupportedDumbbellRow, sets: "3", reps: "8-10", tempo: "20X0", rest: "" },
          { order: "4A", name: "Prone Three-position Lateral Raise", note: THREE_HAND_POSITIONS, videoUrl: V.proneThreePositionLateralRaise, sets: "2", reps: "10e", tempo: "10X0", rest: ":30" },
          { order: "5A", name: "Hanging Knee Raise", videoUrl: V.hangingKneeRaise, sets: "2", reps: "MAX", tempo: "20X0", rest: "" },
        ]),
        day2: {
          kind: "conditioning",
          day: 2,
          workouts: [
            {
              week: 9,
              title: "Four rounds",
              movements: [
                { text: "One-minute Jump Rope", videoUrl: V.jumpRope },
                { text: "Two-minute Row", videoUrl: V.row },
                { text: "Three-minute Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "Four-minute Run" },
              ],
              rpe: "6-7",
              stimulus: "Move at a steady, continuous pace across the four rounds.",
              scaling: [
                { movement: "Jump Rope", text: "decrease time; Ali Shuffle; Line Hop" },
                { movement: "Row", text: "modify to another cardio machine" },
                { movement: "Echo/Assault Bike", text: "modify to another cardio machine" },
                { movement: "Run", text: "modify to another form of cardio" },
              ],
            },
            {
              week: 10,
              title: "Pick one machine",
              movements: [
                { text: "Choose one: Treadmill, Echo/Assault Bike, Rower, BikeErg or Ski Erg" },
                { text: "Then complete 10 rounds:" },
                { text: "One minute at RPE 6-7" },
                { text: "Three minutes at RPE 4-5" },
              ],
              rpe: "6-7 / 4-5",
              stimulus: "Hold the RPE targets on every round.",
              scaling: [],
            },
            {
              week: 11,
              title: "Every 10 minutes, for 30 minutes",
              movements: [
                { text: "1000-meter Row", videoUrl: V.row },
                { text: "30 Lateral Medicine Ball Toss", videoUrl: V.lateralMedicineBallToss },
                { text: "50 AbMat Sit-up", videoUrl: V.abmatSitUp },
              ],
              rpe: "6-7",
              stimulus: "Complete the prescribed work in about 7:15-7:45.",
              scaling: [
                { movement: "Row", text: "decrease distance; modify to Bike (2500 meters) or Run (800 meters)" },
                { movement: "Lateral Medicine Ball Toss", text: "decrease weight; decrease reps; Side-to-Side Kettlebell Swing" },
                { movement: "AbMat Sit-up", text: "decrease reps" },
              ],
            },
            {
              week: 12,
              title: "Two rounds, resting 8 minutes between rounds",
              movements: [
                { text: "800-meter Run" },
                { text: "2.0-mile Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "400-ft Farmer Carry", videoUrl: V.farmerCarry },
                { text: "80 sec Low Front Plank", videoUrl: V.lowFrontPlank },
              ],
              rpe: "6-7",
              stimulus: "Complete each round in about 16:00.",
              scaling: [
                { movement: "Run", text: "decrease distance; Row (2000 meters); Bike (2.5 miles)" },
                { movement: "Bike", text: "decrease distance; Row (2000 meters); Run (1.0 mile)" },
                { movement: "Farmer Carry", text: "decrease load; decrease distance" },
                { movement: "Low Front Plank", text: "decrease time" },
              ],
            },
          ],
        },
        day3: strength(3, [
          { order: "1A", name: "Barbell Bench Press", videoUrl: V.barbellBenchPress, byWeek: weeks(9, [["4", "10"], ["4", "8"], ["4", "6"], ["6", "4"]]), tempo: "20X1", rest: "2:00" },
          { order: "2A", name: "Weighted Eccentric Chin-up", videoUrl: V.weightedEccentricChinUp, sets: "4", reps: "4-6", tempo: "3000", rest: "2:00" },
          { order: "3A", name: "Barbell Glute Bridge", videoUrl: V.barbellGluteBridge, sets: "3", reps: "10-12", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Zottman Curl", videoUrl: V.zottmanCurl, sets: "3", reps: "10-12", tempo: "20X0", rest: "" },
          { order: "4A", name: "Dumbbell Drop Lunge", videoUrl: V.dumbbellDropLunge, sets: "2", reps: "10-12e", tempo: "20X1", rest: ":30" },
          { order: "5A", name: "Split Stance Pallof Press", videoUrl: V.splitStancePallofPress, sets: "2", reps: "30-45s", rest: "" },
        ]),
        day4: GYM_WALK,
      },
    ],
  },

  // ------------------------- VERSION 2 · COMMERCIAL GYM -------------------------
  {
    id: "commercial",
    name: "Commercial Gym",
    short: "Commercial",
    equipment:
      "What you need: Barbells and racks, dumbbells, kettlebells, cables, pull-up bar, bench, cardio machines, jump rope. No rings or medicine balls needed.",
    summary:
      "For most big-box gyms with barbells, dumbbells, kettlebells, cables and cardio machines. A handful of swaps from the master.",
    blocks: [
      // Weeks 1-4 (pages 16-17)
      {
        block: 1,
        weeks: [1, 4],
        day1: strength(1, [
          { order: "1A", name: "Dumbbell Goblet Squat", videoUrl: V.dumbbellGobletSquat, byWeek: weeks(1, [["4", "10"], ["4", "8"], ["4", "6"], ["6", "4"]]), tempo: "22X1", rest: "2:00" },
          { order: "2A", name: "Dumbbell RDL", videoUrl: V.dumbbellRdl, byWeek: weeks(1, [["4", "10"], ["4", "8"], ["4", "6"], ["6", "4"]]), tempo: "30X1", rest: "2:00" },
          { order: "3A", name: "Lat Pull-down", videoUrl: V.latPullDown, sets: "3", reps: "8-10", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Half-kneeling Single-arm Dumbbell Shoulder Press", videoUrl: V.halfKneelingSingleArmDumbbellShoulderPress, sets: "3", reps: "8-10e", tempo: "20X1", rest: "" },
          { order: "4A", name: "Incline Dumbbell Biceps Curl", videoUrl: V.inclineDumbbellBicepsCurl, sets: "2", reps: "15-20", tempo: "20X0", rest: ":30" },
          { order: "5A", name: "Hollow Hold", videoUrl: V.hollowHold, sets: "2", reps: "30-45s", rest: "" },
        ]),
        day2: {
          kind: "conditioning",
          day: 2,
          workouts: [
            {
              week: 1,
              title: "Seven rounds",
              movements: [
                { text: "45 sec Burpee", videoUrl: V.burpee },
                { text: "15 sec rest" },
                { text: "45 sec Row", videoUrl: V.row },
                { text: "15 sec rest" },
                { text: "45 sec Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "15 sec rest" },
                { text: "45 sec Farmer March" },
                { text: "15 sec rest" },
              ],
              rpe: "6-7",
              stimulus: "Move at a steady, manageable pace across all seven rounds.",
              scaling: [
                { movement: "Burpee", text: "modify to Up-down" },
                { movement: "Row", text: "modify to another cardio machine" },
                { movement: "Bike", text: "modify to another cardio machine" },
                { movement: "Farmer March", text: "decrease load; decrease time" },
              ],
            },
            {
              week: 2,
              title: "As many rounds as possible in 40 minutes",
              movements: [
                { text: "40-cal Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "30-cal Row", videoUrl: V.row },
                { text: "20 Walking Lunge", videoUrl: V.walkingLunge },
                { text: "10 Hollow Rock", videoUrl: V.hollowRock },
              ],
              rpe: "6-7",
              stimulus: "Complete 4-5 rounds in the 40-minute window.",
              scaling: [
                { movement: "Bike", text: "decrease calories; modify to another cardio machine" },
                { movement: "Row", text: "decrease calories; modify to another cardio machine" },
                { movement: "Walking Lunge", text: "decrease reps; modify to Air Squat" },
                { movement: "Hollow Rock", text: "decrease reps; modify to Hollow Rock, tuck position, or Low Front Plank" },
              ],
            },
            {
              week: 3,
              title: "Six rounds",
              movements: [
                { text: "Minute one: Run" },
                { text: "Minute two: Burpee Box Jump", videoUrl: V.burpeeBoxJump },
                { text: "Minute three: Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "Minute four: Plank Pull-through", videoUrl: V.plankPullThrough },
                { text: "Minute five: Jump Rope", videoUrl: V.jumpRope },
              ],
              rpe: "6-7",
              stimulus: "Move at a steady, manageable pace across the six rounds.",
              scaling: [
                { movement: "Run", text: "decrease time" },
                { movement: "Burpee Box Jump", text: "decrease height; modify to Burpee Step-up" },
                { movement: "Plank Pull-through", text: "decrease load; decrease time; modify to High Plank" },
                { movement: "Jump Rope", text: "modify to Jumping Jack or Ali Shuffle" },
              ],
            },
            {
              week: 4,
              title: "Every 12 minutes, for 36 minutes",
              movements: [
                { text: "600-meter Run" },
                { text: "600-meter Row", videoUrl: V.row },
                { text: "1200-meter BikeErg" },
              ],
              rpe: "6-7",
              stimulus: "Complete each round in 8:30-9:30.",
              scaling: [
                { movement: "Run", text: "decrease distance" },
                { movement: "Row", text: "decrease distance; modify to Run (600 meters)" },
                { movement: "BikeErg", text: "decrease distance; modify to Echo/Assault Bike" },
              ],
            },
          ],
        },
        day3: strength(3, [
          { order: "1A", name: "Alternating Dumbbell Bench Press", videoUrl: V.alternatingDumbbellBenchPress, byWeek: weeks(1, [["4", "6e"], ["4", "5e"], ["6", "4e"], ["6", "3e"]]), tempo: "20X1", rest: "2:00" },
          { order: "2A", name: "Dumbbell Glute Bridge", videoUrl: V.dumbbellGluteBridge, sets: "4", reps: "8-10", tempo: "20X0", rest: "2:00" },
          { order: "3A", name: "Barbell Inverted Row, supinated grip", videoUrl: V.barbellInvertedRowSupinated, sets: "3", reps: "MAX", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Dumbbell Split Squat", videoUrl: V.dumbbellSplitSquat, sets: "3", reps: "6-8e", tempo: "22X1", rest: "" },
          { order: "4A", name: "Band Pull-apart", videoUrl: V.bandPullApart, sets: "2", reps: "20-25", tempo: "10X0", rest: ":30" },
          { order: "5A", name: "Low Side Plank", videoUrl: V.lowSidePlank, sets: "2", reps: "30-45s", rest: "" },
        ]),
        day4: GYM_WALK,
      },
      // Weeks 5-8 (pages 18-19)
      {
        block: 2,
        weeks: [5, 8],
        day1: strength(1, [
          { order: "1A", name: "Front Box Squat", videoUrl: V.frontBoxSquat, byWeek: weeks(5, [["4", "6"], ["4", "5"], ["6", "4"], ["6", "3"]]), tempo: "21X1", rest: "2:00" },
          { order: "2A", name: "Barbell RDL", videoUrl: V.barbellRdl, byWeek: weeks(5, [["4", "8"], ["4", "8"], ["4", "6"], ["4", "6"]]), tempo: "30X1", rest: "2:00" },
          { order: "3A", name: "Half-kneeling Single-arm Cable Row", videoUrl: V.halfKneelingSingleArmCableRow, sets: "3", reps: "8-10e", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Dumbbell Shoulder Press", videoUrl: V.dumbbellShoulderPress, sets: "3", reps: "8-10", tempo: "20X1", rest: "" },
          { order: "4A", name: "Cable Face Pull", videoUrl: V.cableFacePull, sets: "2", reps: "15-20", tempo: "20X0", rest: ":30" },
          { order: "5A", name: "Hollow Rock", videoUrl: V.hollowRock, sets: "2", reps: "40-60s", rest: "" },
        ]),
        day2: {
          kind: "conditioning",
          day: 2,
          workouts: [
            {
              week: 5,
              title: "Six rounds",
              movements: [
                { text: "Minute one: Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "Minute two: Half-kneeling Kettlebell Chop" },
                { text: "Minute three: Row", videoUrl: V.row },
                { text: "Minute four: Farmer March" },
                { text: "Minute five: Jump Rope", videoUrl: V.jumpRope },
                { text: "Minute six: one round of Cindy" },
              ],
              footnote: CINDY_FOOTNOTE,
              rpe: "6-7",
              stimulus: "Move at a steady, manageable pace across the six rounds.",
              scaling: [
                { movement: "Bike", text: "modify to row, run, or ski" },
                { movement: "Half-kneeling Kettlebell Chop", text: "decrease load; Half-kneeling Cable Rotation" },
                { movement: "Row", text: "modify to bike, run, or ski" },
                { movement: "Farmer March", text: "decrease load; decrease time" },
                { movement: "Jump Rope", text: "Ali Shuffle or Line Hop" },
                { movement: "Cindy", text: "decrease reps; Ring Row, Elevated Push-up, Air Squat" },
              ],
            },
            {
              week: 6,
              title: "Every 10 minutes, for 30 minutes",
              movements: [
                { text: "100 Double Under", videoUrl: V.doubleUnder },
                { text: "50/40-cal Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "30 Plank Pull-through", videoUrl: V.plankPullThrough },
                { text: "30 Side-to-Side Kettlebell Swing" },
              ],
              rpe: "6-7",
              stimulus: "Complete each round in about 7:45-8:15.",
              scaling: [
                { movement: "Double Under", text: "decrease reps; 150 Single Under" },
                { movement: "Bike", text: "decrease calories; modify to Row (50/40 cal) or Run (600 meters)" },
                { movement: "Plank Pull-through", text: "decrease load; decrease reps; Low Front Plank" },
                { movement: "Side-to-Side Kettlebell Swing", text: "decrease load" },
              ],
            },
            {
              week: 7,
              title: "Eight rounds",
              movements: [
                { text: "Minute one: Row", videoUrl: V.row },
                { text: "Minute two: Farmer March" },
                { text: "Minute three: Run" },
                { text: "Minute four: Hollow Rock", videoUrl: V.hollowRock },
              ],
              rpe: "6-7",
              stimulus: "Move at a steady, manageable pace across the eight rounds.",
              scaling: [
                { movement: "Row", text: "modify to Bike, Run, or Erg" },
                { movement: "Farmer March", text: "decrease load; decrease time" },
                { movement: "Run", text: "modify to Bike or Erg" },
                { movement: "Hollow Rock", text: "decrease time; Hollow Rock, tuck position; Low Front Plank" },
              ],
            },
            {
              week: 8,
              title: "Every 8 minutes, for 32 minutes",
              movements: [
                { text: "20 Air Squat", videoUrl: V.airSquat },
                { text: "400-meter Run" },
                { text: "20 Russian Kettlebell Swing", videoUrl: V.russianKettlebellSwing },
                { text: "400-meter Run" },
              ],
              rpe: "6-7",
              stimulus: "Complete the prescribed work in about 6:00.",
              scaling: [
                { movement: "Air Squat", text: "decrease reps; modify range of motion" },
                { movement: "Run", text: "decrease distance; modify to Row (500 meters) or Bike (0.70/0.60 mile)" },
                { movement: "Russian Kettlebell Swing", text: "decrease load; decrease reps" },
              ],
            },
          ],
        },
        day3: strength(3, [
          { order: "1A", name: "Eccentric Pull-up", videoUrl: V.eccentricPullUp, sets: "4", reps: "4-6", tempo: "3000", rest: "2:00" },
          { order: "2A", name: "Dumbbell Bench Press", videoUrl: V.dumbbellBenchPress, byWeek: weeks(5, [["4", "10"], ["4", "8"], ["4", "6"], ["6", "4"]]), tempo: "20X1", rest: "2:00" },
          { order: "3A", name: "Front Foot Elevated Dumbbell Split Squat", videoUrl: V.frontFootElevatedDumbbellSplitSquat, sets: "3", reps: "6-8e", tempo: "31X1", rest: "1:30" },
          { order: "3B", name: "Cable Triceps Push-down", videoUrl: V.cableTricepsPushDown, sets: "3", reps: "12-15", tempo: "20X0", rest: "" },
          { order: "4A", name: "B-stance Dumbbell RDL", videoUrl: V.bStanceDumbbellRdl, sets: "2", reps: "8-10e", tempo: "20X1", rest: ":30" },
          { order: "5A", name: "Half-kneeling Cable Rotation", videoUrl: V.halfKneelingCableRotation, sets: "2", reps: "12-15e", tempo: "20X0", rest: "" },
        ]),
        day4: GYM_WALK,
      },
      // Weeks 9-12 (pages 20-21)
      {
        block: 3,
        weeks: [9, 12],
        day1: strength(1, [
          { order: "1A", name: "Back Squat", videoUrl: V.backSquat, byWeek: weeks(9, [["4", "6"], ["4", "5"], ["6", "4"], ["6", "3"]]), tempo: "20X1", rest: "2:00" },
          { order: "2A", name: "Supported Single-leg Dumbbell RDL", videoUrl: V.supportedSingleLegDumbbellRdl, sets: "4", reps: "6-8e", tempo: "20X1", rest: "2:00" },
          { order: "3A", name: "Barbell Shoulder Press", videoUrl: V.barbellShoulderPress, sets: "3", reps: "8-10", tempo: "20X1", rest: "1:30" },
          { order: "3B", name: "Chest-supported Dumbbell Row", videoUrl: V.chestSupportedDumbbellRow, sets: "3", reps: "8-10", tempo: "20X0", rest: "" },
          { order: "4A", name: "Prone Three-position Lateral Raise", note: THREE_HAND_POSITIONS, videoUrl: V.proneThreePositionLateralRaise, sets: "2", reps: "10e", tempo: "10X0", rest: ":30" },
          { order: "5A", name: "Hanging Knee Raise", videoUrl: V.hangingKneeRaise, sets: "2", reps: "MAX", tempo: "20X0", rest: "" },
        ]),
        day2: {
          kind: "conditioning",
          day: 2,
          workouts: [
            {
              week: 9,
              title: "Four rounds",
              movements: [
                { text: "One-minute Jump Rope", videoUrl: V.jumpRope },
                { text: "Two-minute Row", videoUrl: V.row },
                { text: "Three-minute Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "Four-minute Run" },
              ],
              rpe: "6-7",
              stimulus: "Move at a steady, continuous pace across the four rounds.",
              scaling: [
                { movement: "Jump Rope", text: "decrease time; Ali Shuffle; Line Hop" },
                { movement: "Row", text: "modify to another cardio machine" },
                { movement: "Echo/Assault Bike", text: "modify to another cardio machine" },
                { movement: "Run", text: "modify to another form of cardio" },
              ],
            },
            {
              week: 10,
              title: "Pick one machine",
              movements: [
                { text: "Choose one: Treadmill, Echo/Assault Bike, Rower, BikeErg or Ski Erg" },
                { text: "Then complete 10 rounds:" },
                { text: "One minute at RPE 6-7" },
                { text: "Three minutes at RPE 4-5" },
              ],
              rpe: "6-7 / 4-5",
              stimulus: "Hold the RPE targets on every round.",
              scaling: [],
            },
            {
              week: 11,
              title: "Every 10 minutes, for 30 minutes",
              movements: [
                { text: "1000-meter Row", videoUrl: V.row },
                { text: "30 Side-to-Side Kettlebell Swing" },
                { text: "50 AbMat Sit-up", videoUrl: V.abmatSitUp },
              ],
              rpe: "6-7",
              stimulus: "Complete the prescribed work in about 7:15-7:45.",
              scaling: [
                { movement: "Row", text: "decrease distance; modify to Bike (2500 meters) or Run (800 meters)" },
                { movement: "Side-to-Side Kettlebell Swing", text: "decrease load" },
                { movement: "AbMat Sit-up", text: "decrease reps" },
              ],
            },
            {
              week: 12,
              title: "Two rounds, resting 8 minutes between rounds",
              movements: [
                { text: "800-meter Run" },
                { text: "2.0-mile Echo/Assault Bike", videoUrl: V.echoAssaultBike },
                { text: "Farmer March" },
                { text: "80 sec Low Front Plank", videoUrl: V.lowFrontPlank },
              ],
              rpe: "6-7",
              stimulus: "Complete each round in about 16:00.",
              scaling: [
                { movement: "Run", text: "decrease distance; Row (2000 meters); Bike (2.5 miles)" },
                { movement: "Bike", text: "decrease distance; Row (2000 meters); Run (1.0 mile)" },
                { movement: "Farmer March", text: "decrease load; decrease time" },
                { movement: "Low Front Plank", text: "decrease time" },
              ],
            },
          ],
        },
        day3: strength(3, [
          { order: "1A", name: "Barbell Bench Press", videoUrl: V.barbellBenchPress, byWeek: weeks(9, [["4", "10"], ["4", "8"], ["4", "6"], ["6", "4"]]), tempo: "20X1", rest: "2:00" },
          { order: "2A", name: "Tempo Pull-up", note: TEMPO_PULL_UP_NOTE, videoUrl: V.tempoPullUp, sets: "4", reps: "4-6", tempo: "3003", rest: "2:00" },
          { order: "3A", name: "Tall-kneeling Zercher Good Morning", videoUrl: V.tallKneelingZercherGoodMorning, sets: "3", reps: "10-12", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Zottman Curl", videoUrl: V.zottmanCurl, sets: "3", reps: "10-12", tempo: "20X0", rest: "" },
          { order: "4A", name: "Dumbbell Drop Lunge", videoUrl: V.dumbbellDropLunge, sets: "2", reps: "10-12e", tempo: "20X1", rest: ":30" },
          { order: "5A", name: "Split Stance Pallof Press", videoUrl: V.splitStancePallofPress, sets: "2", reps: "30-45s", rest: "" },
        ]),
        day4: GYM_WALK,
      },
    ],
  },

  // ------------------------- VERSION 3 · MINIMALIST HOME GYM -------------------------
  {
    id: "home",
    name: "Minimalist Home Gym",
    short: "Home",
    equipment:
      "What you need: A few pairs of dumbbells, resistance bands, a doorway pull-up bar and a weight vest or backpack. No bench needed.",
    summary:
      "A few pairs of dumbbells, bands, a doorway pull-up bar and a weight vest or backpack. No bench. Day 2 becomes a walk-jog.",
    blocks: [
      // Weeks 1-4 (page 23)
      {
        block: 1,
        weeks: [1, 4],
        day1: strength(1, [
          { order: "1A", name: "Dumbbell Goblet Squat", videoUrl: V.dumbbellGobletSquat, sets: "4", reps: "8-10", tempo: "33X1", rest: "2:00" },
          { order: "2A", name: "Dumbbell RDL", videoUrl: V.dumbbellRdl, sets: "4", reps: "8-10", tempo: "30X1", rest: "2:00" },
          { order: "3A", name: "Banded Lat Pull-down", videoUrl: V.bandedLatPullDown, sets: "3", reps: "8-10", tempo: "30X0", rest: "1:30" },
          { order: "3B", name: "Half-kneeling Single-arm Dumbbell Shoulder Press", videoUrl: V.halfKneelingSingleArmDumbbellShoulderPress, sets: "3", reps: "8-10e", tempo: "20X1", rest: "" },
          { order: "4A", name: "1-1/4 Dumbbell Biceps Curl", videoUrl: V.oneQuarterDumbbellBicepsCurl, sets: "2", reps: "12-15", tempo: "20X0", rest: ":30" },
          { order: "5A", name: "Hollow Hold", videoUrl: V.hollowHold, sets: "2", reps: "30-45s", rest: "" },
        ]),
        day2: HOME_WALKJOG,
        day3: strength(3, [
          { order: "1A", name: "Alternating Dumbbell Floor Press", videoUrl: V.alternatingDumbbellFloorPress, sets: "4", reps: "6e", tempo: "20X1", rest: "2:00" },
          { order: "2A", name: "Dumbbell Glute Bridge", videoUrl: V.dumbbellGluteBridge, sets: "4", reps: "12-15", tempo: "20X0", rest: "2:00" },
          { order: "3A", name: "Three-point Dumbbell Row", videoUrl: V.threePointDumbbellRow, sets: "3", reps: "10-12e", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Dumbbell Split Squat", videoUrl: V.dumbbellSplitSquat, sets: "3", reps: "6-8e", tempo: "22X1", rest: "" },
          { order: "4A", name: "Band Pull-apart", videoUrl: V.bandPullApart, sets: "2", reps: "20-25", tempo: "10X0", rest: ":30" },
          { order: "5A", name: "Low Side Plank", videoUrl: V.lowSidePlank, sets: "2", reps: "30-45s", rest: "" },
        ]),
        day4: HOME_WALK,
      },
      // Weeks 5-8 (page 24)
      {
        block: 2,
        weeks: [5, 8],
        day1: strength(1, [
          { order: "1A", name: "Dumbbell Front Squat", videoUrl: V.dumbbellFrontSquat, sets: "4", reps: "6-8", tempo: "51X1", rest: "2:00" },
          { order: "2A", name: "B-stance Dumbbell Glute Bridge", videoUrl: V.bStanceDumbbellGluteBridge, sets: "4", reps: "8-10e", tempo: "30X1", rest: "2:00" },
          { order: "3A", name: "Half-kneeling Single-arm Band Row", videoUrl: V.halfKneelingSingleArmBandRow, sets: "3", reps: "12-15e", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Dumbbell Shoulder Press", videoUrl: V.dumbbellShoulderPress, sets: "3", reps: "8-10", tempo: "20X1", rest: "" },
          { order: "4A", name: "Band Face Pull", videoUrl: V.bandFacePull, sets: "2", reps: "20-25", tempo: "20X0", rest: ":30" },
          { order: "5A", name: "Hollow Rock", videoUrl: V.hollowRock, sets: "2", reps: "40-60s", rest: "" },
        ]),
        day2: HOME_WALKJOG,
        day3: strength(3, [
          { order: "1A", name: "Half-kneeling Band Lat Pull-down", videoUrl: V.halfKneelingBandLatPullDown, sets: "4", reps: "8-10e", tempo: "30X1", rest: "2:00" },
          {
            order: "2A",
            name: "Dumbbell Floor Press + Eccentric Deficit Push-up",
            note: FLOOR_PRESS_NOTE,
            videoUrl: V.dumbbellFloorPress,
            videoUrls: [
              { name: "Dumbbell Floor Press", url: V.dumbbellFloorPress },
              { name: "Eccentric Deficit Push-up", url: V.eccentricDeficitPushUp },
            ],
            sets: "3",
            reps: "6-8 + 4-6",
            tempo: "20X1",
            rest: "2:00",
          },
          { order: "3A", name: "Dumbbell Reverse Lunge", videoUrl: V.dumbbellReverseLunge, sets: "3", reps: "8-10e", tempo: "20X1", rest: "1:30" },
          { order: "3B", name: "Banded Triceps Push-down", videoUrl: V.bandedTricepsPushDown, sets: "3", reps: "15-20", tempo: "20X0", rest: "" },
          { order: "4A", name: "Single-leg Dumbbell Glute Bridge", videoUrl: V.singleLegDumbbellGluteBridge, sets: "2", reps: "12-15e", tempo: "20X0", rest: ":30" },
          { order: "5A", name: "Half-kneeling Band Rotation", videoUrl: V.halfKneelingBandRotation, sets: "2", reps: "12-15e", tempo: "20X0", rest: "" },
        ]),
        day4: HOME_WALK,
      },
      // Weeks 9-12 (page 25)
      {
        block: 3,
        weeks: [9, 12],
        day1: strength(1, [
          { order: "1A", name: "1-1/4 Dumbbell Goblet Squat", videoUrl: V.oneQuarterDumbbellGobletSquat, sets: "4", reps: "8-10", tempo: "30X1", rest: "2:00" },
          { order: "2A", name: "Supported Single-leg Dumbbell RDL", videoUrl: V.supportedSingleLegDumbbellRdl, sets: "4", reps: "6-8e", tempo: "20X1", rest: "2:00" },
          { order: "3A", name: "Tall-kneeling Arnold Press", videoUrl: V.tallKneelingArnoldPress, sets: "3", reps: "8-10", tempo: "20X1", rest: "1:30" },
          { order: "3B", name: "Dumbbell Bent-over Row", videoUrl: V.dumbbellBentOverRow, sets: "3", reps: "8-10", tempo: "20X0", rest: "" },
          { order: "4A", name: "Three-position Bent-over Lateral Raise", note: THREE_HAND_POSITIONS, videoUrl: V.threePositionBentOverLateralRaise, sets: "2", reps: "10e", tempo: "10X0", rest: ":30" },
          { order: "5A", name: "Alternating V-up", videoUrl: V.alternatingVUp, sets: "2", reps: "MAX", tempo: "20X0", rest: "" },
        ]),
        day2: HOME_WALKJOG,
        day3: strength(3, [
          {
            order: "1A",
            name: "Dumbbell Floor Press + Deficit Push-up",
            note: FLOOR_PRESS_NOTE,
            videoUrl: V.dumbbellFloorPress,
            videoUrls: [
              { name: "Dumbbell Floor Press", url: V.dumbbellFloorPress },
              { name: "Deficit Push-up", url: V.deficitPushUp },
            ],
            sets: "3",
            reps: "6-8 + MAX",
            tempo: "20X1",
            rest: "2:00",
          },
          { order: "2A", name: "Tempo Pull-up", note: TEMPO_PULL_UP_NOTE, videoUrl: V.tempoPullUp, sets: "4", reps: "4-6", tempo: "3003", rest: "2:00" },
          { order: "3A", name: "Tall-kneeling Dumbbell Good Morning", videoUrl: V.tallKneelingDumbbellGoodMorning, sets: "3", reps: "10-12", tempo: "20X0", rest: "1:30" },
          { order: "3B", name: "Zottman Curl", videoUrl: V.zottmanCurl, sets: "3", reps: "10-12", tempo: "20X0", rest: "" },
          { order: "4A", name: "Dumbbell Walking Lunge", videoUrl: V.dumbbellWalkingLunge, sets: "2", reps: "10-12e", tempo: "20X1", rest: ":30" },
          { order: "5A", name: "Split Stance Pallof Press", videoUrl: V.splitStancePallofPress, sets: "2", reps: "30-45s", rest: "" },
        ]),
        day4: HOME_WALK,
      },
    ],
  },
];
