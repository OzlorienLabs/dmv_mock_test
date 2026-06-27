import type { CategoryId, Question } from "@/lib/types";

/**
 * Tenth batch: concrete "what should you do" situations that re-test core rules
 * in applied form (origin: generated). Correct answer first; engine shuffles.
 */

const HANDBOOK_URL =
  "https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/";

type Seed = Pick<Question, "id" | "category" | "prompt" | "options" | "correctIndex"> &
  Partial<Pick<Question, "explanation" | "diagramId">>;

function group(category: CategoryId, items: Omit<Seed, "category">[]): Seed[] {
  return items.map((it) => ({ ...it, category }));
}

const seeds: Seed[] = [
  ...group("right-of-way", [
    { id: "sx10-1", prompt: "You arrive at a four-way stop just after a car on your left. You should:", options: ["Let the car that arrived first go", "Go first because you are on the right", "Go at the same time"], correctIndex: 0, explanation: "The first vehicle to stop proceeds first." },
    { id: "sx10-2", prompt: "You are turning left and a pedestrian starts crossing the street you are turning into. You should:", options: ["Wait for the pedestrian to cross", "Turn in front of them", "Honk and turn"], correctIndex: 0, explanation: "Yield to pedestrians in your path when turning." },
    { id: "sx10-3", prompt: "Your light is green, but traffic is backed up past the intersection. You should:", options: ["Wait until you can clear the intersection", "Enter and block it", "Drive on the shoulder"], correctIndex: 0, explanation: "Don't enter unless you can get all the way through." },
    { id: "sx10-4", prompt: "An ambulance with its siren on approaches from behind. You should:", options: ["Pull to the right and stop", "Speed up", "Stop in your lane"], correctIndex: 0, explanation: "Pull right and stop for emergency vehicles." },
    { id: "sx10-5", prompt: "You want to pull onto a busy street from a driveway. You should:", options: ["Yield to traffic and pedestrians first", "Pull out and make them slow", "Honk and go"], correctIndex: 0, explanation: "Yield when entering the road from a driveway." },
  ]),
  ...group("signs-signals", [
    { id: "sx10-6", prompt: "You see a yellow diamond sign with a curved arrow. It warns that:", options: ["The road curves ahead", "You must stop", "There is a gas station"], correctIndex: 0, explanation: "Yellow diamond = warning; the arrow shows a curve." },
    { id: "sx10-7", prompt: "The light turns yellow as you approach the intersection. You should:", options: ["Stop if you can do so safely", "Always speed through", "Stop suddenly no matter what"], correctIndex: 0, explanation: "Stop for yellow if you can stop safely." },
    { id: "sx10-8", prompt: "You see a red circle with a slash over a right-turn arrow. It means:", options: ["No right turn here", "Right turn only", "Yield before turning right"], correctIndex: 0, explanation: "A red circle and slash means the action is prohibited." },
    { id: "sx10-9", prompt: "A five-sided (pentagon) sign ahead indicates:", options: ["A school zone or crossing", "A hospital", "A rest area"], correctIndex: 0, explanation: "Pentagon signs mark schools and school crossings." },
    { id: "sx10-10", prompt: "A round, yellow sign with an 'X' and 'RR' warns of:", options: ["A railroad crossing ahead", "A rest stop", "A right turn"], correctIndex: 0, explanation: "The round RR sign warns of railroad tracks ahead." },
  ]),
  ...group("speed-limits", [
    { id: "sx10-11", prompt: "You are driving 65 mph on the freeway when thick fog rolls in. You should:", options: ["Slow down well below 65 mph", "Maintain 65 mph", "Speed up to leave the fog"], correctIndex: 0, explanation: "Reduce speed for conditions, regardless of the posted limit." },
    { id: "sx10-12", prompt: "You turn onto a residential street with no posted limit. You should not exceed:", options: ["25 mph", "40 mph", "55 mph"], correctIndex: 0, explanation: "Residential default is 25 mph." },
    { id: "sx10-13", prompt: "Children are crossing near a school as you pass. A safe speed is about:", options: ["25 mph or slower", "40 mph", "Whatever the freeway limit is"], correctIndex: 0, explanation: "School zones are typically 25 mph when children are present." },
    { id: "sx10-14", prompt: "A curve ahead has a 35 mph advisory and you are going 55. You should:", options: ["Slow to about 35 before the curve", "Keep 55 through it", "Brake hard in the curve"], correctIndex: 0, explanation: "Slow to the advisory speed before entering the curve." },
    { id: "sx10-15", prompt: "You are towing a trailer on the freeway. Your speed should not exceed:", options: ["55 mph", "65 mph", "70 mph"], correctIndex: 0, explanation: "Towing is limited to 55 mph in California." },
  ]),
  ...group("parking", [
    { id: "sx10-16", prompt: "You park facing downhill next to a curb. You should turn your wheels:", options: ["Toward the curb", "Away from the curb", "Straight ahead"], correctIndex: 0, explanation: "Downhill: wheels toward the curb.", diagramId: "curb-parking" },
    { id: "sx10-17", prompt: "You park facing uphill next to a curb. You should turn your wheels:", options: ["Away from the curb", "Toward the curb", "Straight ahead"], correctIndex: 0, explanation: "Uphill with a curb: wheels away from the curb.", diagramId: "curb-parking" },
    { id: "sx10-18", prompt: "You see a green-painted curb. It means:", options: ["Parking is allowed for a limited time", "No parking ever", "Disabled parking only"], correctIndex: 0, explanation: "Green curbs allow limited-time parking.", diagramId: "curb-colors" },
    { id: "sx10-19", prompt: "There is a fire hydrant near where you want to park. You must stay at least:", options: ["15 feet away", "5 feet away", "30 feet away"], correctIndex: 0, explanation: "Keep at least 15 feet from a fire hydrant." },
    { id: "sx10-20", prompt: "You park on a steep hill with no curb. You should turn your wheels:", options: ["Toward the edge of the road", "Toward the center", "Straight"], correctIndex: 0, explanation: "No curb: point wheels toward the road's edge." },
  ]),
  ...group("lanes-passing", [
    { id: "sx10-21", prompt: "There is a broken yellow line on your side of the road. You may:", options: ["Pass when it is safe", "Never pass", "Pass only at night"], correctIndex: 0, explanation: "A broken yellow line on your side allows passing when clear." },
    { id: "sx10-22", prompt: "You want to turn left from a two-way street. You should be in:", options: ["The lane next to the center line", "The far-right lane", "The shoulder"], correctIndex: 0, explanation: "Approach a left turn near the center line." },
    { id: "sx10-23", prompt: "A solid white line separates your lane from the next. You should:", options: ["Avoid changing lanes", "Change lanes freely", "Treat it like a center line"], correctIndex: 0, explanation: "Solid white discourages or prohibits lane changes." },
    { id: "sx10-24", prompt: "You have signaled and checked your mirrors to change lanes. You should also:", options: ["Look over your shoulder for blind spots", "Just move over", "Close your eyes and merge"], correctIndex: 0, explanation: "A shoulder check covers your blind spot." },
    { id: "sx10-25", prompt: "You want to enter the carpool lane. You may cross into it:", options: ["Only where the line is broken", "Anywhere", "Across the double line"], correctIndex: 0, explanation: "Enter HOV lanes only at the dashed sections." },
  ]),
  ...group("dui-alcohol", [
    { id: "sx10-26", prompt: "You are 22 and your blood alcohol level is 0.08%. Driving is:", options: ["Illegal", "Legal if you feel fine", "Legal on side streets"], correctIndex: 0, explanation: "0.08% is the legal limit for drivers 21 and older." },
    { id: "sx10-27", prompt: "You are 19 and have had one beer. Driving is:", options: ["Illegal under the zero-tolerance law", "Legal", "Legal during the day"], correctIndex: 0, explanation: "Under 21, any measurable alcohol is illegal." },
    { id: "sx10-28", prompt: "An impaired friend wants to borrow your car to drive home. You should:", options: ["Not let them drive", "Let them, it's their choice", "Follow behind them"], correctIndex: 0, explanation: "You can be liable for letting an impaired person drive." },
    { id: "sx10-29", prompt: "You took medication that makes you drowsy. You should:", options: ["Not drive", "Drive slowly", "Drive with the windows down"], correctIndex: 0, explanation: "Don't drive while impaired by medication." },
    { id: "sx10-30", prompt: "You plan to drink at a celebration. The best plan is to:", options: ["Arrange a sober ride in advance", "Drive home slowly", "Drink coffee before leaving"], correctIndex: 0, explanation: "Plan a sober ride before drinking." },
  ]),
  ...group("restraints", [
    { id: "sx10-31", prompt: "Your 18-month-old child rides with you. They should be in:", options: ["A rear-facing car seat", "A forward-facing seat", "A booster"], correctIndex: 0, explanation: "Children under 2 ride rear-facing (unless they meet the size exception)." },
    { id: "sx10-32", prompt: "Your 6-year-old rides with you. They should be:", options: ["In a booster or car seat in the back seat", "In a regular belt up front", "Unrestrained"], correctIndex: 0, explanation: "Children under 8 use a car seat or booster in the back." },
    { id: "sx10-33", prompt: "Your 10-year-old is 5 feet tall. They may:", options: ["Use the adult seat belt", "Ride unrestrained", "Sit on a lap"], correctIndex: 0, explanation: "At 8 years old or 4 ft 9 in, the seat belt may be used." },
    { id: "sx10-34", prompt: "Before you drive off with passengers, you should:", options: ["Make sure everyone is buckled", "Turn on music", "Roll down the windows"], correctIndex: 0, explanation: "Everyone must be belted before you drive." },
    { id: "sx10-35", prompt: "A passenger puts the shoulder belt behind their back. You should:", options: ["Ask them to wear it across the chest", "Allow it", "Remove their belt"], correctIndex: 0, explanation: "The shoulder belt must cross the chest to protect you." },
  ]),
  ...group("sharing-road", [
    { id: "sx10-36", prompt: "You are about to pass a bicyclist. You must leave at least:", options: ["3 feet of space", "1 foot of space", "No particular distance"], correctIndex: 0, explanation: "Give bicyclists at least 3 feet when passing." },
    { id: "sx10-37", prompt: "A school bus ahead has flashing red lights and a stop-arm out. You should:", options: ["Stop until the lights stop flashing", "Pass slowly", "Continue if clear"], correctIndex: 0, explanation: "Stop for a school bus's flashing red lights.", diagramId: "school-bus" },
    { id: "sx10-38", prompt: "A truck ahead begins a wide right turn. You should:", options: ["Stay back and not pass on the right", "Squeeze past on the right", "Pull beside the cab"], correctIndex: 0, explanation: "Don't get between a turning truck and the curb." },
    { id: "sx10-39", prompt: "A pedestrian with a white cane is crossing ahead. You should:", options: ["Stop and let them cross", "Honk to warn them", "Drive around them"], correctIndex: 0, explanation: "Always yield to a blind pedestrian." },
    { id: "sx10-40", prompt: "A motorcycle is traveling ahead of you in your lane. You should:", options: ["Give it a full lane and extra following distance", "Share the lane", "Tailgate it"], correctIndex: 0, explanation: "Motorcycles get a full lane; allow more space." },
  ]),
  ...group("freeway", [
    { id: "sx10-41", prompt: "You are entering the freeway from an on-ramp. You should:", options: ["Match traffic speed and merge into a gap", "Stop at the end of the ramp", "Merge slowly and let others adjust"], correctIndex: 0, explanation: "Build speed and merge into a gap.", diagramId: "freeway-merge" },
    { id: "sx10-42", prompt: "Your freeway exit is coming up. You should move into the exit lane:", options: ["Well before the exit", "Right at the exit", "After you pass it"], correctIndex: 0, explanation: "Move over early for your exit." },
    { id: "sx10-43", prompt: "You realize you missed your freeway exit. You should:", options: ["Continue to the next exit", "Back up to the exit", "Stop on the shoulder"], correctIndex: 0, explanation: "Never back up; take the next exit." },
    { id: "sx10-44", prompt: "Traffic ahead on the freeway is stopping quickly. You should:", options: ["Brake early and turn on your hazard lights", "Brake at the last second", "Change lanes repeatedly"], correctIndex: 0, explanation: "Slow early and warn drivers behind you." },
    { id: "sx10-45", prompt: "You are driving slower than other freeway traffic. You should be in:", options: ["The right-hand lane", "The left lane", "The center divider"], correctIndex: 0, explanation: "Slower traffic keeps right." },
  ]),
  ...group("railroad", [
    { id: "sx10-46", prompt: "The lights at a railroad crossing begin to flash. You should:", options: ["Stop and wait", "Hurry across", "Slow down and cross"], correctIndex: 0, explanation: "Flashing lights require a full stop.", diagramId: "railroad-crossing" },
    { id: "sx10-47", prompt: "Your car stalls on the tracks and a train is approaching. You should:", options: ["Get out and move away from the tracks", "Stay and restart it", "Push the car off"], correctIndex: 0, explanation: "Exit immediately and move away." },
    { id: "sx10-48", prompt: "Traffic is backed up just past a railroad crossing. You should:", options: ["Wait on your side until you can fully clear the tracks", "Stop on the tracks", "Squeeze onto the tracks"], correctIndex: 0, explanation: "Never stop on the tracks." },
    { id: "sx10-49", prompt: "The crossing gates begin to come down. You should:", options: ["Stop and not drive around them", "Drive around quickly", "Wait 5 seconds then go"], correctIndex: 0, explanation: "Never go around lowering gates." },
    { id: "sx10-50", prompt: "You approach a railroad crossing marked only by a crossbuck. It means:", options: ["Yield to any approaching train", "The crossing is closed", "Stop and park"], correctIndex: 0, explanation: "A crossbuck means yield to trains." },
  ]),
  ...group("emergencies", [
    { id: "sx10-51", prompt: "Your brakes suddenly fail while driving. You should:", options: ["Downshift and apply the parking brake gradually", "Turn off the engine", "Steer into traffic"], correctIndex: 0, explanation: "Use engine braking and the parking brake to slow." },
    { id: "sx10-52", prompt: "A front tire blows out. You should:", options: ["Hold the wheel firmly and ease off the gas", "Brake hard", "Accelerate"], correctIndex: 0, explanation: "Keep control and slow gradually." },
    { id: "sx10-53", prompt: "Your gas pedal sticks to the floor. You should:", options: ["Shift to neutral and brake", "Turn the key off at speed", "Keep driving"], correctIndex: 0, explanation: "Neutral cuts power; then brake safely." },
    { id: "sx10-54", prompt: "You are involved in a minor collision. You should first:", options: ["Stop and check for injuries", "Drive away", "Argue with the other driver"], correctIndex: 0, explanation: "Stop, check for injuries, and exchange information." },
    { id: "sx10-55", prompt: "Your vehicle breaks down on a busy road. You should wait:", options: ["Off the road, away from traffic", "In the driver's seat in a lane", "On the center line"], correctIndex: 0, explanation: "Stay away from moving traffic." },
  ]),
  ...group("distracted", [
    { id: "sx10-56", prompt: "Your phone rings and you have no hands-free device. You should:", options: ["Let it go to voicemail", "Answer briefly", "Answer at the next red light"], correctIndex: 0, explanation: "Don't handle the phone while driving." },
    { id: "sx10-57", prompt: "You are 17 with a provisional license. You may use a cell phone while driving:", options: ["Not at all", "Hands-free only", "For navigation only"], correctIndex: 0, explanation: "Under-18 drivers may not use a phone at all." },
    { id: "sx10-58", prompt: "You need to send a text message. You should:", options: ["Pull over to a safe place first", "Text at a red light", "Text quickly"], correctIndex: 0, explanation: "Texting while driving is illegal; pull over." },
    { id: "sx10-59", prompt: "You want to enter a destination in your GPS. You should:", options: ["Set it before you start driving", "Type while driving", "Hold the phone and tap"], correctIndex: 0, explanation: "Program navigation before you drive." },
    { id: "sx10-60", prompt: "You feel drowsy during a long drive. You should:", options: ["Pull over and rest", "Drive faster", "Turn up the radio and continue"], correctIndex: 0, explanation: "Drowsy driving is dangerous; stop and rest." },
  ]),
  ...group("vehicle-equipment", [
    { id: "sx10-61", prompt: "It is 20 minutes after sunset. Your headlights should be:", options: ["On", "Off", "On only if it rains"], correctIndex: 0, explanation: "Headlights are required from 30 minutes after sunset." },
    { id: "sx10-62", prompt: "An oncoming car is about 500 feet away and your high beams are on. You should:", options: ["Switch to low beams", "Keep high beams on", "Flash your brights"], correctIndex: 0, explanation: "Dim high beams within 500 feet of oncoming traffic." },
    { id: "sx10-63", prompt: "Your tires are worn smooth. They:", options: ["Have reduced traction and should be replaced", "Grip better in rain", "Are fine if inflated"], correctIndex: 0, explanation: "Bald tires lose traction; replace them." },
    { id: "sx10-64", prompt: "Your brake pedal sinks toward the floor. You should:", options: ["Have the brakes inspected before driving far", "Keep driving normally", "Pump it forever"], correctIndex: 0, explanation: "A sinking pedal signals a brake problem." },
    { id: "sx10-65", prompt: "Before you start driving, you should adjust your:", options: ["Mirrors and seat", "Radio station only", "Trunk"], correctIndex: 0, explanation: "Set mirrors and seat before moving." },
  ]),
  ...group("insurance", [
    { id: "sx10-66", prompt: "An officer asks you for proof of insurance. You should:", options: ["Provide it", "Refuse", "Drive away"], correctIndex: 0, explanation: "Carry and present proof of insurance when asked." },
    { id: "sx10-67", prompt: "You were in a crash that injured someone. You must file an SR-1 within:", options: ["10 days", "30 days", "90 days"], correctIndex: 0, explanation: "Report a qualifying crash to DMV within 10 days." },
    { id: "sx10-68", prompt: "You let your auto insurance lapse. Your registration may be:", options: ["Suspended", "Upgraded", "Unaffected"], correctIndex: 0, explanation: "An insurance lapse can suspend your registration." },
    { id: "sx10-69", prompt: "California's minimum coverage for injury to one person is:", options: ["$30,000", "$5,000", "$100,000"], correctIndex: 0, explanation: "The minimum is $30,000 per person (2025)." },
    { id: "sx10-70", prompt: "Required liability insurance pays for:", options: ["Injury or damage you cause to others", "Your own car repairs", "Your traffic tickets"], correctIndex: 0, explanation: "Liability covers harm you cause to others." },
  ]),
  ...group("weather", [
    { id: "sx10-71", prompt: "It has just started to rain after a dry spell. The road is:", options: ["Most slippery right now", "Safest right now", "Unaffected"], correctIndex: 0, explanation: "Roads are slickest when rain first mixes with oil." },
    { id: "sx10-72", prompt: "Your car begins to hydroplane on a wet road. You should:", options: ["Ease off the gas and steer straight", "Brake hard", "Turn sharply"], correctIndex: 0, explanation: "Ease off and keep straight until traction returns." },
    { id: "sx10-73", prompt: "You are driving in fog. You should use:", options: ["Low-beam headlights", "High beams", "No lights"], correctIndex: 0, explanation: "Low beams cut glare in fog." },
    { id: "sx10-74", prompt: "Your car starts to skid. You should:", options: ["Steer in the direction you want to go", "Brake hard and hold still", "Steer opposite the skid"], correctIndex: 0, explanation: "Look and steer where you want to go." },
    { id: "sx10-75", prompt: "It is raining hard. Your following distance should be:", options: ["Increased beyond the usual 3 seconds", "Reduced", "Kept at one car length"], correctIndex: 0, explanation: "Add space in the rain." },
  ]),
  ...group("licensing-misc", [
    { id: "sx10-76", prompt: "You move to a new home. You must tell DMV your new address within:", options: ["10 days", "30 days", "60 days"], correctIndex: 0, explanation: "Report an address change within 10 days." },
    { id: "sx10-77", prompt: "A police officer signals you to pull over. You should:", options: ["Pull to the right when safe and stop", "Speed up", "Stop in your lane immediately"], correctIndex: 0, explanation: "Move right and stop safely." },
    { id: "sx10-78", prompt: "You want to make a U-turn in a business district. It is allowed:", options: ["At an intersection or where a sign permits", "Anywhere when clear", "Never"], correctIndex: 0, explanation: "U-turns in business districts are limited to intersections or where signs allow." },
    { id: "sx10-79", prompt: "A traffic signal is completely dark (not working). You should treat it as:", options: ["A four-way stop", "A green light", "A yield"], correctIndex: 0, explanation: "Treat a dark signal as an all-way stop." },
    { id: "sx10-80", prompt: "While driving, you must:", options: ["Carry your driver license with you", "Leave it at home", "Carry only a photo of it"], correctIndex: 0, explanation: "Always carry your license while driving." },
  ]),
];

export const SCENARIO10_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
