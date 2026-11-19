// Reference content from the program guide, kept in the guide's own words.

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "list"; items: string[] }
  | { t: "steps"; items: { title: string; text: string }[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "callout"; text: string; tone?: "blue" | "red"; title?: string }
  | { t: "cards"; items: { title: string; text: string }[] };

export interface Article {
  slug: string;
  group: "Start here" | "Training" | "Nutrition";
  title: string;
  dek: string;
  body: Block[];
}

export const LIBRARY: Article[] = [
  {
    slug: "welcome",
    group: "Start here",
    title: "Welcome to Ballistic",
    dek: "You know what to do. Life with little kids keeps getting in the way.",
    body: [
      { t: "p", text: "We're Derrick and Ash Ball. We met in 2015 as Graduate Assistants at the University of Pittsburgh, spent the next few years coaching in gyms, and by 2019 we were running a CrossFit affiliate in Florida. On paper, we had it all. In reality, we were handcuffed to the four walls of the facility: split shifts, 60-80 hour weeks, and being \"on\" from open to close." },
      { t: "p", text: "So, after months of prayer, we built Ballistic. Coaching that happens online, around real life. Our first try cost nearly $10,000 and made ZERO dollars (great logo, no sales process). We learned, and in 2021 we went all in." },
      { t: "p", text: "Then we became parents. Today we're raising three kids under five, and almost everything we used to believe about training didn't survive a toddler and a newborn. Six-day weeks, 90-minute sessions, high intensity everything. So we changed how we train, how we eat and how we coach." },
      { t: "callout", text: "We coach parents as parents.", tone: "red" },
      { t: "p", text: "The no sleep, the no time, the kids' leftover mac and cheese at 8pm. Those aren't problems we read about. They're our week. So everything in this guide is built for your worst week, because the best weeks take care of themselves." },
      { t: "p", text: "12 weeks. 4 days a week. Real food. No hacks. We train to outlast our kids in tag, and that's exactly what this program is for." },
      { t: "p", text: "Derrick and Ash" },
      { t: "callout", text: "This program is general education, not medical advice. Talk to your provider before you start a new exercise or nutrition plan, especially if you're pregnant, postpartum, breastfeeding or managing a medical condition. Had a baby recently? Get cleared first, and if you're working with a pelvic floor PT, follow their lead. Stop any exercise that causes sharp or unusual pain." },
    ],
  },
  {
    slug: "how-it-works",
    group: "Start here",
    title: "How this program works",
    dek: "12 weeks, split into 3 blocks of 4 weeks. 4 training days a week, about an hour each. For most parents, that's plenty.",
    body: [
      { t: "table", head: ["Day", "Session", "Effort"], rows: [
        ["Day 1", "Full-body strength", "1-2 RIR"],
        ["Day 2", "Conditioning", "RPE 6-7"],
        ["Day 3", "Full-body strength", "1-2 RIR"],
        ["Day 4", "Weighted walk, 45-60 min", "RPE 5-6"],
      ] },
      { t: "p", text: "Put at least 1 day between the 2 strength days. A week that works for a lot of parents: Monday, Tuesday, Thursday, Saturday. Move it around nap times, shifts and practices however you need to." },
      { t: "h", text: "Why it's built this way" },
      { t: "list", items: [
        "2 full-body strength days train every major muscle twice a week. That's enough to build strength and hold onto muscle while you lose fat.",
        "Supersets pair exercises that don't compete with each other, so you get more work done in less time.",
        "Day 2 conditioning lives at RPE 6-7 on purpose. You should leave feeling invigorated, not exhausted.",
        "The weighted walk is the most underrated thing in this program. Low stress, great for recovery, and easy to do with a kid in the stroller.",
      ] },
      { t: "h", text: "Pick your version" },
      { t: "p", text: "Every version follows the same structure. Only the exercises change, to match your equipment. Pick the one that matches where you train and stay with it for all 12 weeks." },
      { t: "h", text: "How you'll progress" },
      { t: "list", items: [
        "Inside each block, your main lifts drop reps and add weight week to week, and some add sets in week 4. Each week gets its own line, so you always know what today looks like.",
        "Between blocks, the exercises change every 4 weeks, from simpler versions to harder ones. New block, new exercises, same structure.",
        "No deloads. Most people aren't training consistently enough to need a planned easy week, and life with little kids hands you one anyway (teething, a stomach bug, a work trip).",
      ] },
      { t: "callout", title: "Missed a day?", text: "Never miss twice. Pick up with the next session on your list. Don't double up, and don't restart the week. Trained twice during a sick week? That counts. That's the win." },
    ],
  },
  {
    slug: "reading-your-program",
    group: "Training",
    title: "How to read your program",
    dek: "Every strength day is written the same way. Learn it once and you can read every session.",
    body: [
      { t: "table", head: ["Column", "What it means"], rows: [
        ["1A, 2A", "The order you do things. A letter on its own means straight sets: do all your sets of 1A, then move to 2A."],
        ["3A / 3B", "A superset. Do one set of 3A, go straight into 3B, then rest. Repeat until all sets are done. The same goes for any group with a blank Rest cell: keep moving until you hit a rest."],
        ["Sets", "Working sets, not counting your warm-up sets. When a lift changes week to week, each week gets its own line. Find your week, then read across."],
        ["Reps", "When reps drop each week, the weight goes up. \"8-10\" is a range: pick a weight that lands you in it. \"e\" means each side. \"30-45s\" is a hold in seconds. \"6-8 + 4-6\" is a combo: do the first exercise, then go straight into the second. MAX means as many good reps as you can."],
        ["Tempo", "How fast each rep moves, in seconds. See Tempo."],
        ["Rest", "Minutes:seconds of rest after the set, or after the last exercise in a superset. Blank means go straight to the next exercise."],
      ] },
    ],
  },
  {
    slug: "rir",
    group: "Training",
    title: "Choosing your weights with RIR",
    dek: "RIR stands for reps in reserve: how many more good reps you could have done when you stopped the set.",
    body: [
      { t: "p", text: "It's how you pick a weight without a coach standing next to you." },
      { t: "table", head: ["RIR", "What it feels like"], rows: [
        ["4+", "Warm-up weight. Easy."],
        ["3", "Working, but you had plenty left."],
        ["2", "Hard. Two more good reps, tops."],
        ["1", "Very hard. One more good rep."],
        ["0", "Nothing left with good form. Only for MAX sets."],
      ] },
      { t: "p", text: "Take every lift to 1-2 RIR. MAX sets go to 0 RIR, as many good reps as you can." },
      { t: "p", text: "Hit the target reps with 4 or more left in the tank? Go heavier next set. Couldn't hit the reps? Go lighter. Form breaks down before you reach the number? That set is over." },
      { t: "p", text: "Most people guess they're closer to failure than they really are, especially in the first couple of weeks. Expect your weights to climb fast early on." },
    ],
  },
  {
    slug: "tempo",
    group: "Training",
    title: "Tempo",
    dek: "Tempo is written as four numbers. Each one is a number of seconds for one part of the rep, always in the same order.",
    body: [
      { t: "table", head: ["Digit", "Phase", "Squat example: 31X1"], rows: [
        ["1st", "Lowering the weight", "3 seconds down"],
        ["2nd", "Pause at the bottom", "1-second pause in the bottom"],
        ["3rd", "Lifting the weight", "X = stand up as fast as you can with control"],
        ["4th", "Pause at the top", "1 second at the top before the next rep"],
      ] },
      { t: "p", text: "On pulling exercises, \"lowering\" means letting yourself down. An Eccentric Pull-up at 3000 is a 3-second lower from the top of the bar. A Tempo Pull-up at 3003 adds a 3-second hold with your chin over the bar. Slower tempos make a weight feel a lot heavier, so pick weights that let you own the tempo." },
    ],
  },
  {
    slug: "rpe-and-conditioning",
    group: "Training",
    title: "Effort with RPE and reading Day 2",
    dek: "RPE stands for rate of perceived exertion. It's how hard the whole effort feels on a 1-10 scale.",
    body: [
      { t: "p", text: "We use it for conditioning and walking, where RIR doesn't apply." },
      { t: "table", head: ["RPE", "Talk test", "Where you'll use it"], rows: [
        ["3-4", "Easy. Full conversation.", "Recovery pieces"],
        ["5-6", "Comfortable. You can talk in full sentences.", "Day 4 weighted walk"],
        ["6-7", "Working. Short sentences, steady breathing.", "Day 2 conditioning, walk-jog"],
        ["8-9", "Hard. A few words at a time.", "Not in this program"],
        ["10", "All out.", "Not in this program"],
      ] },
      { t: "h", text: "Reading Day 2 conditioning" },
      { t: "table", head: ["Format", "How to do it"], rows: [
        ["Rounds", "Complete the list in order, then repeat for the number of rounds."],
        ["As many rounds as possible", "Keep cycling through the list until the clock runs out. Count your rounds."],
        ["Every 10 min, for 30 min", "Start a round every 10 minutes. Whatever time is left over is rest."],
        ["Minute one, two...", "One station per minute on a running clock. Move to the next station when the minute ends."],
      ] },
      { t: "p", text: "Stimulus is the target. It tells you how the session should feel or how long each round should take. If you're way off, adjust." },
      { t: "p", text: "Scaling lists the ways to make a movement fit you: less load, fewer reps, shorter distance or a different machine. Scaling is how you get the right stimulus, so use it." },
      { t: "p", text: "Two numbers, like 50/40 cal, are two standard targets. The higher one is the typical men's target, the lower one the typical women's target. Pick the one that fits your size and fitness." },
      { t: "h", text: "Day 4 and box breathing" },
      { t: "p", text: "Weighted walk. Walk 45-60 minutes at RPE 5-6 with a weight vest or a backpack. No vest? Walk on an inclined treadmill or outside. If you use a heart rate monitor, 180 minus your age is a rough ceiling for this pace." },
      { t: "p", text: "Box breathing. Every strength day ends with 10 cycles: 4-second inhale, 1-second hold, 4-second exhale, 1-second hold. It brings your heart rate down before you head back to work, the kids or the pickup line." },
    ],
  },
  {
    slug: "swaps",
    group: "Training",
    title: "Equipment swaps",
    dek: "Same movement, same muscles, different equipment. Keep the sets, reps, tempo and rest the same as the exercise you're replacing.",
    body: [
      { t: "table", head: ["Movement", "Functional fitness gym", "Commercial gym", "Minimalist home gym"], rows: [
        ["Squat", "Back Squat, Front Box Squat", "Same as master", "Dumbbell Front Squat, 1-1/4 Dumbbell Goblet Squat"],
        ["Hinge", "Kettlebell RDL, Barbell RDL", "Dumbbell RDL", "Dumbbell RDL, B-stance Dumbbell Glute Bridge"],
        ["Vertical pull", "Lat Pull-down, Eccentric Pull-up, Weighted Eccentric Chin-up", "Tempo Pull-up", "Banded Lat Pull-down, Half-kneeling Band Lat Pull-down, Tempo Pull-up"],
        ["Horizontal pull", "Ring/TRX Row, Half-kneeling Single-arm Cable Row, Chest-supported Dumbbell Row", "Barbell Inverted Row, supinated grip", "Three-point Dumbbell Row, Half-kneeling Single-arm Band Row, Dumbbell Bent-over Row"],
        ["Horizontal push", "Alternating Dumbbell Bench Press, Dumbbell Bench Press, Barbell Bench Press", "Same as master", "Alternating Dumbbell Floor Press, Dumbbell Floor Press + Push-up combos"],
        ["Vertical push", "Barbell Shoulder Press", "Same as master", "Tall-kneeling Arnold Press"],
        ["Glutes", "Barbell Glute Bridge", "Tall-kneeling Zercher Good Morning", "Tall-kneeling Dumbbell Good Morning, Single-leg Dumbbell Glute Bridge"],
        ["Single leg", "Front Foot Elevated Dumbbell Split Squat, Dumbbell Drop Lunge", "Same as master", "Dumbbell Reverse Lunge, Dumbbell Walking Lunge"],
        ["Arms", "Incline Dumbbell Biceps Curl, Cable Triceps Push-down", "Same as master", "1-1/4 Dumbbell Biceps Curl, Banded Triceps Push-down"],
        ["Shoulders", "Cable Face Pull, Prone Three-position Lateral Raise", "Same as master", "Band Face Pull, Three-position Bent-over Lateral Raise"],
        ["Core", "Hanging Knee Raise, Half-kneeling Cable Rotation", "Same as master", "Alternating V-up, Half-kneeling Band Rotation"],
      ] },
      { t: "h", text: "Conditioning swaps" },
      { t: "table", head: ["Distance", "Equals"], rows: [
        ["400 m run", "500 m row or 0.70/0.60 mile bike"],
        ["600 m run", "600 m row"],
        ["1000 m row", "800 m run or 2500 m bike"],
        ["2000 m row", "1.0 mile run or 2.5 mile bike"],
        ["100 double unders", "150 single unders"],
      ] },
      { t: "table", head: ["Movement", "Swap"], rows: [
        ["Any cardio machine", "Any other cardio machine, or a run"],
        ["Burpee", "Up-down"],
        ["Burpee Box Jump", "Burpee Step-up"],
        ["Medicine ball toss", "Side-to-Side Kettlebell Swing, Russian Twist"],
        ["Jump rope", "Jumping Jack, Ali Shuffle, Line Hop"],
        ["Hollow Rock", "Hollow Rock, tuck position; Low Front Plank"],
        ["Plank Pull-through", "High Plank"],
      ] },
    ],
  },
  {
    slug: "when-it-doesnt-feel-right",
    group: "Training",
    title: "When something doesn't feel right",
    dek: "Sore muscles are normal. Sharp, pinching or joint pain is not.",
    body: [
      { t: "p", text: "When a movement doesn't feel right, work down this list in order and stop at the first fix that works." },
      { t: "steps", items: [
        { title: "Lighten the load", text: "Drop the weight 10-20% and keep the same sets and reps." },
        { title: "Shorten the range", text: "Squat to a box or bench, press from a slight deficit instead of a deep one, pull to a higher target." },
        { title: "Slow it down", text: "A slower lowering phase lets you use less weight and own the position." },
        { title: "Add support", text: "Chest-supported rows, supported single-leg RDLs, half-kneeling or tall-kneeling presses." },
        { title: "Swap the exercise", text: "Use a swap from the equipment swaps table that trains the same movement." },
        { title: "Skip it and get checked", text: "If it still hurts, leave it out and see a doctor or physical therapist." },
      ] },
      { t: "h", text: "Too easy or too hard?" },
      { t: "cards", items: [
        { title: "Too easy", text: "Add weight before you add reps. Make sure you're honest about RIR: two good reps left means two. Hit the tempo exactly; most people rush the lowering phase. On Day 2, pick the higher target or the harder version." },
        { title: "Too hard", text: "Use the low end of the rep range. Use the scaling options on Day 2: cut reps, distance or calories. Take the full rest; don't rush back in. Missed a week? Repeat the last week you finished before you move on." },
      ] },
      { t: "h", text: "Short on time?" },
      { t: "p", text: "Do 1A and 2A as written and cut one set from everything after that. Still short? Do the 2 strength days and the walk, and drop Day 2 for that week. 2 lifts and a walk beats skipping the week every time." },
    ],
  },
  {
    slug: "quality-vs-quantity",
    group: "Nutrition",
    title: "Quality vs. quantity",
    dek: "Food quality decides your body composition. Food quantity decides your body weight. You need both.",
    body: [
      { t: "p", text: "Here's the problem. Most parents we work with already \"eat pretty healthy.\" Smoothies, granola, salads, peanut butter. Then they can't figure out why the scale won't move." },
      { t: "p", text: "Healthy and low calorie are not the same thing. A cup of granola is about 500 calories. Two tablespoons of peanut butter is about 190, and most people's scoop is a lot bigger than two tablespoons. None of those are bad foods. They just add up fast." },
      { t: "cards", items: [
        { title: "Quality", text: "What you eat. Protein, fruits, vegetables, whole grains and potatoes, healthy fats. Mostly foods that look like they came from nature. Quality decides how you feel, how you recover, and how much muscle you keep." },
        { title: "Quantity", text: "How much you eat. Calories, measured over days and weeks. Quantity decides whether you lose, gain or maintain weight. \"Healthy\" food still has calories." },
      ] },
      { t: "h", text: "Build every plate in this order" },
      { t: "steps", items: [
        { title: "Lean protein", text: "The most filling thing on your plate, and it helps you hold onto muscle while you lose fat. Chicken, lean beef, turkey, fish, eggs, Greek yogurt, cottage cheese." },
        { title: "Fruits and vegetables", text: "Fiber and volume. More food on your plate, fewer calories. Frozen and canned count." },
        { title: "Starch", text: "Rice, potatoes, pasta, oats, bread, tortillas. Carbs fuel your training. They're not the enemy." },
        { title: "The extras", text: "Oils, butter, cheese, dressing, nut butter, granola. Keep them. Just measure them." },
      ] },
      { t: "callout", title: "Measure for one week.", text: "You're not signing up to weigh food forever. You're recalibrating your eyes. After a week you'll know what a real serving of peanut butter looks like, and you'll never unsee it." },
      { t: "h", text: "The habits that do most of the work" },
      { t: "list", items: [
        "Protein at breakfast. Roughly 25-30 grams. Greek yogurt with berries, eggs with toast and fruit, or a protein shake and a banana.",
        "Eat the same few meals on repeat. Two breakfasts, two lunches, four or five dinners. Boring on a Tuesday is the point.",
        "Never miss twice. Pizza at a birthday party doesn't blow your week. The next meal is the fix.",
      ] },
    ],
  },
  {
    slug: "800-grams",
    group: "Nutrition",
    title: "800 grams",
    dek: "Eat at least 800 grams of fruits and vegetables a day, by weight. That's it. That's the rule.",
    body: [
      { t: "p", text: "We borrowed this one from EC Synkowski and her 800 gram challenge, because it's the simplest nutrition rule we've ever seen work. You don't cut anything out. You add fruits and vegetables until you hit 800 grams, and then you eat whatever else you want." },
      { t: "p", text: "Now, here's what happens when you actually do it. More fruits and vegetables means more fiber and more food on your plate. More food on your plate means you get full on fewer calories. Getting full on fewer calories means less snacking at night. And less snacking at night is what moves the scale." },
      { t: "h", text: "What counts" },
      { t: "list", items: [
        "Any fruit or vegetable, weighed the way you eat it.",
        "Fresh, frozen and canned all count. Organic doesn't matter.",
        "Weigh it with a cheap food scale for a week or two, then you'll be able to eyeball it.",
      ] },
      { t: "h", text: "What 800 grams looks like" },
      { t: "table", head: ["Food", "About"], rows: [
        ["1 medium apple", "180 g"], ["1 medium banana, peeled", "120 g"], ["1 cup strawberries", "150 g"],
        ["1 cup blueberries", "150 g"], ["1 clementine", "75 g"], ["1 cup chopped broccoli", "90 g"],
        ["10 baby carrots", "100 g"], ["1 medium bell pepper", "120 g"], ["1 cup raw spinach", "30 g"],
        ["1 steam bag of frozen veggies, 10-12 oz", "280-340 g"],
      ] },
      { t: "h", text: "One easy 800-gram day" },
      { t: "table", head: ["Meal", "Fruits and vegetables", "Grams"], rows: [
        ["Breakfast", "1 cup berries in Greek yogurt", "150"],
        ["Lunch", "10 baby carrots and a medium apple", "280"],
        ["Snack", "1 banana", "120"],
        ["Dinner", "Most of a steam bag of veggies", "250"],
        ["", "Total", "800"],
      ] },
      { t: "callout", text: "Not even close yet? Start with one serving at lunch and one at dinner. Once that feels automatic, add fruit to breakfast." },
    ],
  },
  {
    slug: "macros",
    group: "Nutrition",
    title: "Macros and lazy macros",
    dek: "Macros are the three nutrients that carry calories: protein, carbohydrates and fat.",
    body: [
      { t: "table", head: ["Macro", "Calories per gram", "What it does", "Where you find it"], rows: [
        ["Protein", "4", "Builds and keeps muscle. Most filling of the three.", "Meat, fish, eggs, Greek yogurt, cottage cheese, protein powder"],
        ["Carbohydrate", "4", "Your main fuel for training and daily life.", "Fruit, vegetables, rice, potatoes, oats, bread, pasta"],
        ["Fat", "9", "Hormones, absorbing vitamins, flavor. Easy to overdo.", "Oils, butter, nuts, nut butter, avocado, cheese, fattier meats"],
      ] },
      { t: "p", text: "Alcohol has 7 calories per gram and none of the benefits. It counts too." },
      { t: "h", text: "Three levels of tracking" },
      { t: "p", text: "You don't have to track everything to get results. Pick the lowest level that's working, and only move up when you stop making progress." },
      { t: "cards", items: [
        { title: "Level 1: No tracking", text: "Build plates in the order on the quality page, hit 800 grams, get protein at every meal, eat the same meals on repeat. Plenty of people never need more than this." },
        { title: "Level 2: Lazy macros", text: "Track 2 numbers: protein and calories. Hit your protein, stay at or under your calories, and let carbs and fat land wherever they land. It's about 90% of the result for a fraction of the effort." },
        { title: "Level 3: Full macros", text: "Track protein, carbs and fat. Useful when you want more precision for a set period, or when your progress has stalled at Level 2." },
      ] },
      { t: "h", text: "Why lazy macros work for parents" },
      { t: "p", text: "Protein and calories are the 2 numbers that matter most for fat loss. Calories decide whether you lose weight. Protein decides how much of that weight comes from fat instead of muscle, and it keeps you full while you do it." },
      { t: "p", text: "Everything else is fine-tuning. When you're juggling work, kids and practice schedules, 2 numbers you actually hit beat 5 numbers you give up on by Wednesday." },
      { t: "callout", title: "How to track:", text: "use any free food-tracking app. Log as you go, not at the end of the day. Save your repeat meals so logging takes seconds." },
    ],
  },
  {
    slug: "deficit-maintenance-reverse",
    group: "Nutrition",
    title: "Deficit, maintenance and reverse",
    dek: "Fat loss is a phase, not a lifestyle. You go into it on purpose, and you come out of it on purpose.",
    body: [
      { t: "table", head: ["Phase", "What it is", "How long", "You'll know it's working when"], rows: [
        ["Deficit", "Eating fewer calories than you burn, about 20% below maintenance, so your body uses stored fat.", "Usually 12-16 weeks at a time", "Your weekly average drops 0.5-1% of bodyweight a week and your lifts hold steady."],
        ["Reverse", "Adding calories back slowly after a deficit until you reach maintenance.", "Usually 8-12 weeks", "Calories climb, energy and training improve, and your weight settles."],
        ["Maintenance", "Eating about what you burn. Weight stays roughly the same.", "As long as you want", "Your weekly average stays within about 2 pounds."],
      ] },
      { t: "h", text: "Why the reverse matters" },
      { t: "p", text: "Here's the real kicker. Most people who lose weight gain it back, and it's not because they're weak. It's because the plan ended the day they hit their goal, so they went from a deficit straight back to eating whatever, all at once." },
      { t: "p", text: "Think of a rubber band. The harder and longer you pull it, the harder it snaps back. The reverse lets the band down slowly." },
      { t: "h", text: "How to reverse" },
      { t: "list", items: [
        "Add 50-100 calories a day each week, mostly from carbs.",
        "Keep protein the same.",
        "Expect the scale to go up a pound or two at first. That's mostly water and the extra food in your system, not fat.",
        "Stop adding when your weekly average starts to climb for two weeks in a row. That's about where maintenance is.",
      ] },
      { t: "h", text: "Living at maintenance" },
      { t: "list", items: [
        "Keep the habits that got you here: protein at every meal, 800 grams, repeat meals.",
        "Track for a week every now and then to check you haven't drifted.",
        "Plan the fun stuff. Birthday parties, holidays and date nights are part of maintenance, so plan for them instead of white-knuckling through them.",
      ] },
      { t: "callout", text: "Never dieted before, or coming off a run of under-eating? You might not need a deficit at all yet. Spend these 12 weeks at maintenance, nail the habits and the training, and let your body composition change from there." },
    ],
  },
  {
    slug: "grocery-list",
    group: "Nutrition",
    title: "Grocery list",
    dek: "Healthy eating isn't about where you shop. You can do this at Aldi, Walmart or anywhere else.",
    body: [
      { t: "cards", items: [
        { title: "Protein", text: "Chicken breasts or thighs · 90/10 or leaner ground beef · Ground turkey · Rotisserie chicken · Eggs and liquid egg whites · Plain Greek yogurt · Cottage cheese · Canned tuna or chicken · Frozen shrimp or fish · Deli turkey or chicken · Protein powder · String cheese" },
        { title: "Fruits and vegetables", text: "Steam bag veggies · Frozen broccoli, green beans, peppers · Bagged salad kits · Baby carrots, snap peas, cucumbers · Bell peppers and onions · Frozen spinach · Bananas, apples, clementines, grapes · Frozen berries · Fresh berries in season · Fruit cups or pouches" },
        { title: "Starches", text: "Microwave rice cups or a bag of rice · Potatoes and sweet potatoes · Oats · Whole-grain bread · Tortillas and wraps · Pasta · Beans · Rice cakes" },
        { title: "Fats and extras", text: "Olive oil and cooking spray · Avocados · Almonds, cashews · Peanut butter · Shredded cheese · Light dressings" },
        { title: "Flavor", text: "Salsa · Hot sauce · Mustard · Low-sugar BBQ sauce · Seasoning blends · Soy sauce or teriyaki" },
        { title: "Car and desk stash", text: "Protein bars · Ready-to-drink protein shakes · Beef or turkey jerky · Single-serve nuts · Fruit that doesn't need cutting" },
      ] },
      { t: "h", text: "Where to save and where to spend" },
      { t: "p", text: "Save: frozen fruits and vegetables, store-brand everything, and cheap staples like eggs, oats, rice, potatoes, bananas and beans." },
      { t: "p", text: "Spend a little: protein, bought in bulk and frozen, and anything that saves you on hard nights, like rotisserie chicken. Skip: superfood powders, wellness drinks, and anything that promises to detox you." },
    ],
  },
  {
    slug: "component-prep",
    group: "Nutrition",
    title: "Component prep",
    dek: "Stop meal prepping on Sundays. Prep ingredients, not meals.",
    body: [
      { t: "p", text: "Full meal prep takes hours. When your Sunday gets eaten by a birthday party, it doesn't happen, and the whole week falls apart with it. Component prep takes about 30-45 minutes, most of it hands-off, and it fits around a nap." },
      { t: "p", text: "You cook a few building blocks, then build meals in minutes all week. Open the fridge, grab protein and a starch, heat the veggies, add a fat, eat. 15 minutes tops, and 5 or 6 if you use steam bags." },
      { t: "h", text: "The four pillars" },
      { t: "steps", items: [
        { title: "Protein", text: "A few pounds of 90/10 ground beef on the stovetop, chicken breasts in the crockpot on low for about 6 hours (no water needed), sheet pan chicken thighs, or a couple of rotisserie chickens pulled apart." },
        { title: "Fruits and veggies", text: "Chop 3-4 days' worth and store them in containers with a paper towel. Or skip the chopping and use frozen and steam bags." },
        { title: "Starch", text: "A big pot of rice, a tray of roasted potatoes, or pasta. Cook in bulk, store, done." },
        { title: "Fats", text: "Nothing to prep. Avocado cut fresh, a drizzle of olive oil, a small handful of nuts." },
      ] },
      { t: "h", text: "Prep twice a week" },
      { t: "p", text: "Cooked chicken and most leftovers are good for about 3-4 days in the fridge, according to USDA food safety guidance. So prep twice: once on the weekend for Monday through Wednesday, and a quick round Wednesday night for the rest of the week. Or cook a double batch and freeze half." },
      { t: "h", text: "Same chicken, three different meals" },
      { t: "cards", items: [
        { title: "Rice bowl", text: "Chicken, rice, steam bag veggies, salsa." },
        { title: "Wrap", text: "Chicken in a tortilla with a bagged salad kit and fruit on the side." },
        { title: "Big salad", text: "Chicken over greens with peppers, cucumbers, a little cheese and dressing." },
      ] },
      { t: "callout", title: "Kid-friendly tip:", text: "serve dinner build-your-own. Everyone gets the same components and picky eaters pick what they want. You're cooking 1 meal for the whole table." },
    ],
  },
  {
    slug: "takeout",
    group: "Nutrition",
    title: "Go-to takeout orders",
    dek: "Takeout happens. Practice, late meetings, nobody wants to cook. Here's how to stay semi on track without making it a whole thing.",
    body: [
      { t: "h", text: "The rules for any menu" },
      { t: "list", items: [
        "Protein first. Build the order around grilled chicken, steak, fish, eggs or a double portion of meat.",
        "Add a fruit or vegetable. Side salad, fruit cup, extra veggies, fajita peppers.",
        "Pick 1 extra. The fries, the drink, the dessert or the chips. Just 1.",
        "Sauce and dressing on the side. Dip, don't pour.",
        "Check the app. Most chains post nutrition info online. Look it up once and save your order.",
      ] },
      { t: "h", text: "Orders that work" },
      { t: "table", head: ["Where", "Order"], rows: [
        ["Chipotle", "Bowl with chicken or steak (double the protein if you're hungry), fajita veggies, lettuce, salsa, half rice or no rice. Cheese or sour cream, pick one."],
        ["Chick-fil-A", "Grilled nuggets with a fruit cup or side salad. Grilled chicken sandwich if you want the bun."],
        ["Starbucks", "Egg white bites or a protein box, plus a banana. Unsweetened coffee or cold brew."],
        ["Sub shops", "Any sub as a bowl or salad with double meat and all the veggies. Mustard or vinegar instead of mayo."],
        ["Mexican restaurant", "Chicken or steak fajitas with corn tortillas. Count your chips before you start."],
        ["Burger spot", "Single patty burger with a side salad, or the fries if that's your one extra."],
        ["Pizza night", "Two slices of thin crust, a side salad, and something with protein, like wings or a rotisserie chicken from the store."],
        ["Chinese", "Chicken and broccoli or shrimp with vegetables, sauce on the side, half the rice."],
        ["Sushi", "Sashimi or a poke bowl with half rice and extra fish. Go easy on the fried and creamy rolls."],
      ] },
      { t: "callout", text: "One takeout meal never ruined anyone's progress. The \"screw it\" afterward does. Next meal, back to normal." },
    ],
  },
];

export const getArticle = (slug: string) => LIBRARY.find((a) => a.slug === slug);
