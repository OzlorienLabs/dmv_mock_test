import type { CategoryId, Question } from "@/lib/types";

/**
 * High-frequency & recent-law batch.
 *
 * These ORIGINAL questions cover topics widely reported as recurring on the
 * current California knowledge test (speed/BAC/parking "gotchas", the test
 * process) plus 2025–2026 law updates the DMV says may now be tested (expanded
 * Move Over law, DUI penalties, school-zone changes, CARS Act). Wording is our
 * own — we do not copy copyrighted third-party practice questions. Facts are
 * grounded in the CA Driver Handbook and the DMV "new laws" notices.
 */

const HANDBOOK = "https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/";
const NEW_LAWS_2026 = "https://www.dmv.ca.gov/portal/news-and-media/dmv-highlights-new-laws-in-2026/";

type Seed = Pick<Question, "id" | "category" | "prompt" | "options" | "correctIndex"> &
  Partial<Pick<Question, "explanation" | "diagramId" | "sourceName" | "sourceUrl">>;

function group(category: CategoryId, items: Omit<Seed, "category">[]): Seed[] {
  return items.map((it) => ({ ...it, category }));
}

const seeds: Seed[] = [
  ...group("speed-limits", [
    { id: "hf-spd-1", prompt: "You are driving 45 mph in a 55 mph zone during dense fog. You:", options: ["Can still be cited for driving too fast for conditions", "Are always safe because you are under the limit", "Must speed up to the posted limit"], correctIndex: 0, explanation: "The Basic Speed Law bans driving faster than is safe for conditions, even below the posted limit." },
    { id: "hf-spd-2", prompt: "You can be ticketed for speeding even at the posted limit when:", options: ["Rain, fog, or traffic make that speed unsafe", "Traffic is light", "It is the middle of the day"], correctIndex: 0, explanation: "Conditions can make even the posted limit unsafe (Basic Speed Law)." },
    { id: "hf-spd-3", prompt: "Beginning January 1, 2031, California's statewide school-zone speed limit will be lowered to:", options: ["20 mph", "15 mph", "30 mph"], correctIndex: 0, explanation: "A recent law lowers school-zone limits to 20 mph starting in 2031.", sourceName: "Based on California's 2026 new driving laws", sourceUrl: NEW_LAWS_2026 },
    { id: "hf-spd-4", prompt: "When workers are present in a construction zone, speeding fines are:", options: ["Doubled", "Waived", "Reduced by half"], correctIndex: 0, explanation: "Fines are doubled in active work zones." },
  ]),

  ...group("dui-alcohol", [
    { id: "hf-dui-1", prompt: "A first DUI conviction can result in:", options: ["Up to 6 months in jail and a fine of $390 to $1,000", "Only a written warning", "A short online class and nothing else"], correctIndex: 0, explanation: "A first DUI can bring up to 6 months jail and a $390–$1,000 fine, plus other penalties." },
    { id: "hf-dui-2", prompt: "After a DUI arrest, your vehicle may be:", options: ["Impounded and subject to storage fees", "Returned to you immediately", "Exempt from any action"], correctIndex: 0, explanation: "A DUI can lead to your vehicle being impounded." },
    { id: "hf-dui-3", prompt: "If you are on DUI probation, it is illegal to drive with a blood alcohol level of:", options: ["0.01% or higher", "0.05% or higher", "0.08% or higher"], correctIndex: 0, explanation: "On DUI probation, any measurable alcohol (0.01%) is illegal." },
    { id: "hf-dui-4", prompt: "A DUI conviction typically:", options: ["Stays on your driving record for years and raises insurance costs", "Disappears after a week", "Has no effect on insurance"], correctIndex: 0, explanation: "A DUI remains on your record for years and increases insurance premiums." },
    { id: "hf-dui-5", prompt: "Increased penalties (3–5 years of probation) now apply to:", options: ["Vehicular manslaughter while intoxicated", "A first parking ticket", "Driving 5 mph over the limit"], correctIndex: 0, explanation: "A 2026 law raised probation to 3–5 years for vehicular manslaughter while intoxicated.", sourceName: "Based on California's 2026 new driving laws", sourceUrl: NEW_LAWS_2026 },
  ]),

  ...group("emergencies", [
    { id: "hf-emg-1", prompt: "California's expanded 'Move Over' law requires you to change lanes or slow down for:", options: ["Any stopped vehicle showing hazard lights or warning devices", "Only police vehicles", "Only tow trucks"], correctIndex: 0, explanation: "The 2026 expansion covers any stationary vehicle with hazard lights or warning devices.", sourceName: "Based on California's 2026 new driving laws", sourceUrl: NEW_LAWS_2026 },
    { id: "hf-emg-2", prompt: "If you cannot safely change lanes near a stopped vehicle with its hazard lights on, you must:", options: ["Slow to a safe speed as you pass", "Keep your speed", "Speed up to get past quickly"], correctIndex: 0, explanation: "If you can't move over, slow down." },
    { id: "hf-emg-3", prompt: "An emergency vehicle approaches while you are stopped in an intersection. You should:", options: ["Clear the intersection, then pull to the right and stop", "Stop immediately in the intersection", "Speed away in any direction"], correctIndex: 0, explanation: "Clear the intersection first, then pull right and stop." },
  ]),

  ...group("licensing-misc", [
    { id: "hf-lic-1", prompt: "How many times may you take the knowledge test within 12 months of your application?", options: ["Three times", "Once", "An unlimited number of times"], correctIndex: 0, explanation: "You get three attempts within 12 months." },
    { id: "hf-lic-2", prompt: "If you fail the knowledge test three times, you must:", options: ["Reapply and pay the application fee again", "Automatically wait one year", "Skip to the driving test"], correctIndex: 0, explanation: "After three failures you restart the application and pay again." },
    { id: "hf-lic-3", prompt: "There is a required waiting period between knowledge-test attempts of about:", options: ["7 days", "1 hour", "30 days"], correctIndex: 0, explanation: "You must wait about a week before retaking the test." },
    { id: "hf-lic-4", prompt: "When you change your address, you can now request a duplicate license showing it for:", options: ["The standard duplicate license fee", "Free with no paperwork", "$200"], correctIndex: 0, explanation: "A 2026 law lets you get a reprinted license with the new address for the standard duplicate fee.", sourceName: "Based on California's 2026 new driving laws", sourceUrl: NEW_LAWS_2026 },
    { id: "hf-lic-5", prompt: "Under a 2026 consumer-protection law, buying or leasing a vehicle under $50,000 may include:", options: ["A 3-day right to cancel the purchase", "No cancellation rights at all", "A one-year return window"], correctIndex: 0, explanation: "The CARS Act adds a 3-day right to cancel for vehicles under $50,000.", sourceName: "Based on California's 2026 new driving laws", sourceUrl: NEW_LAWS_2026 },
  ]),

  ...group("parking", [
    { id: "hf-prk-1", prompt: "When you park next to a curb on a level street, your wheels must be within:", options: ["18 inches of the curb", "3 feet of the curb", "5 feet of the curb"], correctIndex: 0, explanation: "Park within 18 inches of the curb." },
    { id: "hf-prk-2", prompt: "You may not stop or park within how many feet of a fire hydrant?", options: ["15 feet", "10 feet", "30 feet"], correctIndex: 0, explanation: "Keep at least 15 feet from a fire hydrant." },
    { id: "hf-prk-3", prompt: "When parking uphill where there is no curb, turn your front wheels:", options: ["Toward the edge of the road (to the right)", "Toward the center of the road", "Straight ahead"], correctIndex: 0, explanation: "With no curb, point the wheels toward the road's edge so a rolling car leaves the roadway." },
  ]),

  ...group("lanes-passing", [
    { id: "hf-lan-1", prompt: "Two sets of solid double yellow lines two feet or more apart mean:", options: ["A barrier you must not cross", "A carpool lane", "Traffic moving the same direction"], correctIndex: 0, explanation: "Widely-spaced double-double yellow lines act as a barrier." },
    { id: "hf-lan-2", prompt: "A single solid yellow line on your side of the center means you:", options: ["May not pass", "May pass whenever clear", "May pass only at night"], correctIndex: 0, explanation: "A solid yellow line on your side means no passing." },
    { id: "hf-lan-3", prompt: "To drive in most carpool (HOV) lanes, your vehicle must carry at least:", options: ["The number of people posted on the sign (often 2 or more)", "Only the driver", "Commercial cargo"], correctIndex: 0, explanation: "HOV lanes require the posted minimum occupancy (motorcycles are allowed)." },
  ]),

  ...group("distracted", [
    { id: "hf-dst-1", prompt: "Holding and using a cell phone in your hand while driving is:", options: ["Illegal; adults may use it only hands-free", "Legal while stopped at a light", "Legal for quick texts"], correctIndex: 0, explanation: "You may not hold a phone while driving; adults may use hands-free only." },
    { id: "hf-dst-2", prompt: "Drivers under 18 may use a wireless phone while driving:", options: ["Never, even hands-free", "Hands-free only", "For navigation only"], correctIndex: 0, explanation: "Under-18 drivers may not use a phone at all." },
    { id: "hf-dst-3", prompt: "Reading or sending a text message while driving is:", options: ["Against the law for all drivers", "Allowed when stopped in traffic", "Allowed for adults"], correctIndex: 0, explanation: "Texting while driving is illegal for everyone." },
  ]),

  ...group("vehicle-equipment", [
    { id: "hf-veq-1", prompt: "You must switch from high beams to low beams when an oncoming vehicle is within:", options: ["500 feet", "100 feet", "50 feet"], correctIndex: 0, explanation: "Dim high beams within 500 feet of oncoming traffic." },
    { id: "hf-veq-2", prompt: "The recommended minimum following distance in good conditions is:", options: ["3 seconds", "1 second", "Half a second"], correctIndex: 0, explanation: "Use at least a 3-second following distance.", diagramId: "following-distance" },
  ]),

  ...group("sharing-road", [
    { id: "hf-shr-1", prompt: "The law requires you to pass a bicyclist with a clearance of at least:", options: ["3 feet", "1 foot", "6 inches"], correctIndex: 0, explanation: "Give bicyclists at least 3 feet when passing." },
    { id: "hf-shr-2", prompt: "A school bus stops and extends its stop-arm with red lights flashing. You must:", options: ["Stop until the red lights and stop-arm turn off", "Pass slowly on the left", "Continue if you see no children"], correctIndex: 0, explanation: "Stop for a school bus's flashing red lights and stop-arm.", diagramId: "school-bus" },
  ]),

  ...group("right-of-way", [
    { id: "hf-row-1", prompt: "At a four-way stop, if two vehicles arrive at the same time, the driver on the left should:", options: ["Yield to the driver on the right", "Go first", "Wait for a signal"], correctIndex: 0, explanation: "When simultaneous, yield to the vehicle on your right.", diagramId: "four-way-stop" },
    { id: "hf-row-2", prompt: "When turning left at a green light with no green arrow, you must:", options: ["Yield to oncoming traffic and pedestrians", "Turn ahead of oncoming traffic", "Proceed without looking"], correctIndex: 0, explanation: "A left turn on a green ball is unprotected — yield first." },
  ]),

  ...group("railroad", [
    { id: "hf-rr-1", prompt: "At a railroad crossing, flashing red lights mean:", options: ["Stop and wait for the train to pass", "Slow down and cross", "Proceed if no train is visible"], correctIndex: 0, explanation: "Flashing red lights require a full stop.", diagramId: "railroad-crossing" },
  ]),

  ...group("weather", [
    { id: "hf-wea-1", prompt: "Roads are usually most slippery:", options: ["During the first few minutes of rain", "After several hours of rain", "Only when it snows"], correctIndex: 0, explanation: "Oil and water mix when rain begins, making roads slickest early." },
  ]),

  ...group("restraints", [
    { id: "hf-res-1", prompt: "A child must ride in a booster or car seat until they are:", options: ["8 years old or 4 feet 9 inches tall", "6 years old", "5 feet tall"], correctIndex: 0, explanation: "Children use a car seat/booster until age 8 or 4 ft 9 in." },
  ]),

  ...group("insurance", [
    { id: "hf-ins-1", prompt: "California's minimum liability coverage for injury to one person is:", options: ["$30,000", "$15,000", "$5,000"], correctIndex: 0, explanation: "The minimum is $30,000 per person (as of 2025)." },
  ]),
];

export const SCENARIO13_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: q.sourceName ?? "Based on the California Driver Handbook",
  sourceUrl: q.sourceUrl ?? HANDBOOK,
  ...q,
}));
