import type { CategoryId, Question } from "@/lib/types";

/**
 * Twelfth batch: review questions in third-person framing (origin: generated),
 * grounded in the California Driver Handbook. Correct answer first; engine
 * shuffles options. This batch brings the bank past 1,000 questions.
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
    { id: "tp12-1", prompt: "A driver should yield to a vehicle that is:", options: ["Already in the intersection", "Waiting behind them", "Parked at the curb"], correctIndex: 0, explanation: "Let vehicles already in the intersection clear first." },
    { id: "tp12-2", prompt: "When two vehicles reach an open intersection at the same time, a driver should yield to:", options: ["The vehicle on the right", "The vehicle on the left", "The larger vehicle"], correctIndex: 0, explanation: "Yield to the right when arrival is simultaneous." },
    { id: "tp12-3", prompt: "Before turning left across traffic into a parking lot, a driver should:", options: ["Yield to oncoming vehicles and pedestrians", "Turn quickly", "Expect oncoming traffic to stop"], correctIndex: 0, explanation: "A left turn across traffic must yield." },
    { id: "tp12-4", prompt: "At a yield sign with cross traffic approaching, a driver should:", options: ["Slow or stop and let it pass", "Speed up to merge first", "Ignore the sign"], correctIndex: 0, explanation: "Yield means give the right-of-way." },
    { id: "tp12-5", prompt: "When an emergency vehicle approaches with siren and lights, drivers should:", options: ["Pull to the right and stop", "Continue normally", "Stop in their lane"], correctIndex: 0, explanation: "Pull right and stop for emergency vehicles." },
  ]),
  ...group("signs-signals", [
    { id: "tp12-6", prompt: "An octagonal (eight-sided) sign always means:", options: ["Stop", "Yield", "Warning"], correctIndex: 0, explanation: "Only stop signs are octagonal." },
    { id: "tp12-7", prompt: "Orange-colored signs usually indicate:", options: ["Construction or maintenance zones", "Hospitals", "Speed limits"], correctIndex: 0, explanation: "Orange marks work zones." },
    { id: "tp12-8", prompt: "Blue-colored signs usually indicate:", options: ["Motorist services such as gas and food", "Warnings", "Stop conditions"], correctIndex: 0, explanation: "Blue signs guide you to services." },
    { id: "tp12-9", prompt: "A steady yellow light tells a driver to:", options: ["Stop if it is safe to do so", "Speed up", "Turn around"], correctIndex: 0, explanation: "Yellow means the light is about to turn red." },
    { id: "tp12-10", prompt: "A red arrow signal tells a driver to:", options: ["Not turn and wait", "Turn without stopping", "Yield then turn"], correctIndex: 0, explanation: "A red arrow prohibits the turn until it changes." },
  ]),
  ...group("speed-limits", [
    { id: "tp12-11", prompt: "Unless posted otherwise, the limit in a business or residential district is:", options: ["25 mph", "35 mph", "45 mph"], correctIndex: 0, explanation: "Default is 25 mph in those districts." },
    { id: "tp12-12", prompt: "At a blind intersection, a driver must not exceed:", options: ["15 mph", "25 mph", "35 mph"], correctIndex: 0, explanation: "15 mph applies at blind intersections." },
    { id: "tp12-13", prompt: "When conditions are poor, a driver should:", options: ["Drive below the posted limit", "Keep the posted limit", "Drive faster"], correctIndex: 0, explanation: "Slow down for conditions." },
    { id: "tp12-14", prompt: "Driving much slower than the flow of traffic is:", options: ["Dangerous and can be illegal", "Always safest", "Required in all lanes"], correctIndex: 0, explanation: "Going too slow can be hazardous and unlawful." },
    { id: "tp12-15", prompt: "When passing a school with children present, a driver should slow to about:", options: ["25 mph", "40 mph", "50 mph"], correctIndex: 0, explanation: "School-zone speeds are usually 25 mph." },
  ]),
  ...group("parking", [
    { id: "tp12-16", prompt: "Parking is never allowed:", options: ["In a crosswalk or intersection", "On a residential street", "In a parking lot"], correctIndex: 0, explanation: "Never block crosswalks or intersections." },
    { id: "tp12-17", prompt: "A driver must not park within 15 feet of:", options: ["A fire hydrant", "A bus stop sign", "A driveway"], correctIndex: 0, explanation: "Keep 15 feet from a hydrant." },
    { id: "tp12-18", prompt: "When parking downhill next to a curb, the front wheels should point:", options: ["Toward the curb", "Away from the curb", "Straight ahead"], correctIndex: 0, explanation: "Downhill: wheels toward the curb.", diagramId: "curb-parking" },
    { id: "tp12-19", prompt: "When parking uphill next to a curb, the front wheels should point:", options: ["Away from the curb", "Toward the curb", "Straight ahead"], correctIndex: 0, explanation: "Uphill with a curb: wheels away from the curb.", diagramId: "curb-parking" },
    { id: "tp12-20", prompt: "Before leaving a parked vehicle, a driver should:", options: ["Set the parking brake", "Leave it in neutral", "Leave the engine running"], correctIndex: 0, explanation: "Always set the parking brake." },
  ]),
  ...group("lanes-passing", [
    { id: "tp12-21", prompt: "A broken white line between same-direction lanes means a driver may:", options: ["Change lanes when it is safe", "Never change lanes", "Pass only at night"], correctIndex: 0, explanation: "A broken white line allows lane changes when safe." },
    { id: "tp12-22", prompt: "A driver should not pass when:", options: ["A solid line is on their side", "A broken line is on their side", "The road is straight and clear"], correctIndex: 0, explanation: "A solid line on your side means no passing." },
    { id: "tp12-23", prompt: "To make a right turn, a driver should be in:", options: ["The right-hand lane", "The center lane", "The left lane"], correctIndex: 0, explanation: "Turn right from the right lane." },
    { id: "tp12-24", prompt: "A center lane bordered by solid and dashed yellow lines is used for:", options: ["Left turns by traffic from both directions", "Passing", "Through traffic"], correctIndex: 0, explanation: "It is a two-way left-turn lane." },
    { id: "tp12-25", prompt: "Before changing lanes, a driver should check:", options: ["Mirrors and the blind spot over the shoulder", "Only the speedometer", "Only the road ahead"], correctIndex: 0, explanation: "Check mirrors and blind spots." },
  ]),
  ...group("dui-alcohol", [
    { id: "tp12-26", prompt: "For a driver under 21, the BAC limit is:", options: ["0.01%", "0.05%", "0.08%"], correctIndex: 0, explanation: "Zero-tolerance: 0.01% under 21." },
    { id: "tp12-27", prompt: "A DUI conviction can result in:", options: ["Fines, license suspension, and possible jail", "A warning only", "Extra privileges"], correctIndex: 0, explanation: "DUI penalties are serious." },
    { id: "tp12-28", prompt: "Driving while impaired by any drug is:", options: ["Illegal", "Legal if prescribed", "Legal if it is cannabis"], correctIndex: 0, explanation: "Driving impaired by any drug is illegal." },
    { id: "tp12-29", prompt: "After drinking, the safest choice is to:", options: ["Not drive at all", "Drive slowly", "Wait ten minutes"], correctIndex: 0, explanation: "Do not drive after drinking." },
    { id: "tp12-30", prompt: "Refusing a chemical test after a DUI arrest results in:", options: ["License suspension", "A small fine only", "No penalty"], correctIndex: 0, explanation: "Refusal triggers suspension under implied consent." },
  ]),
  ...group("restraints", [
    { id: "tp12-31", prompt: "A child under 2 years old must ride:", options: ["Rear-facing, unless they meet the size exception", "Forward-facing", "In a regular belt"], correctIndex: 0, explanation: "Under 2 ride rear-facing unless 40 lb/40 in." },
    { id: "tp12-32", prompt: "The safest place for a young child to ride is:", options: ["The back seat", "The front seat", "Either, it doesn't matter"], correctIndex: 0, explanation: "Back seat is safest for children." },
    { id: "tp12-33", prompt: "A booster seat is used together with:", options: ["The vehicle's lap and shoulder belt", "No belt", "A separate harness"], correctIndex: 0, explanation: "A booster positions the adult belt correctly." },
    { id: "tp12-34", prompt: "A driver is responsible for buckling passengers who are:", options: ["Under 16 years old", "Over 65", "In the back seat only"], correctIndex: 0, explanation: "The driver must restrain passengers under 16." },
    { id: "tp12-35", prompt: "The lap belt should rest:", options: ["Low and snug across the hips", "Across the stomach", "Across the chest"], correctIndex: 0, explanation: "Lap belt low on the hips." },
  ]),
  ...group("sharing-road", [
    { id: "tp12-36", prompt: "When children are playing near the road, a driver should:", options: ["Slow down and be ready to stop", "Maintain speed", "Honk continuously"], correctIndex: 0, explanation: "Children can be unpredictable; slow down." },
    { id: "tp12-37", prompt: "A driver passing a horse and rider should:", options: ["Slow down and give plenty of room", "Honk to move them", "Rev the engine"], correctIndex: 0, explanation: "Pass animals slowly and quietly." },
    { id: "tp12-38", prompt: "When a bus signals to re-enter traffic, drivers should:", options: ["Yield to let it merge", "Speed up to pass", "Block it"], correctIndex: 0, explanation: "Yield to a bus re-entering traffic." },
    { id: "tp12-39", prompt: "A bicyclist may use the full lane when:", options: ["The lane is too narrow to share safely", "Never", "Only on freeways"], correctIndex: 0, explanation: "Cyclists may take the lane when it's too narrow to share." },
    { id: "tp12-40", prompt: "Around a stopped school bus, drivers should watch for:", options: ["Children crossing the road", "Empty lanes", "Faster traffic"], correctIndex: 0, explanation: "Children may cross near a stopped bus.", diagramId: "school-bus" },
  ]),
  ...group("freeway", [
    { id: "tp12-41", prompt: "On a multi-lane freeway, drivers should generally keep:", options: ["To the right except when passing", "In the left lane", "In the center divider"], correctIndex: 0, explanation: "Keep right except to pass." },
    { id: "tp12-42", prompt: "The on-ramp acceleration lane is used to:", options: ["Reach the speed of freeway traffic", "Stop and wait", "Park briefly"], correctIndex: 0, explanation: "Build speed before merging.", diagramId: "freeway-merge" },
    { id: "tp12-43", prompt: "A driver should not stop on the freeway except:", options: ["In an emergency", "To rest", "To make a call"], correctIndex: 0, explanation: "Stopping on a freeway is for emergencies only." },
    { id: "tp12-44", prompt: "Before merging onto a freeway, a driver should check:", options: ["Mirrors and blind spots", "Only the radio", "Only the speedometer"], correctIndex: 0, explanation: "Check blind spots before merging." },
    { id: "tp12-45", prompt: "On a long downgrade, a driver should:", options: ["Shift to a lower gear to control speed", "Ride the brakes", "Shift to neutral"], correctIndex: 0, explanation: "Lower gears use engine braking." },
  ]),
  ...group("railroad", [
    { id: "tp12-46", prompt: "A railroad crossbuck sign tells a driver to:", options: ["Yield to any train", "Stop and park", "Expect the crossing to be closed"], correctIndex: 0, explanation: "A crossbuck means yield to trains." },
    { id: "tp12-47", prompt: "After one train passes at a multi-track crossing, a driver should:", options: ["Watch for a second train", "Cross immediately", "Assume it is clear"], correctIndex: 0, explanation: "A second train may be coming." },
    { id: "tp12-48", prompt: "Certain vehicles, such as buses and tank trucks, must:", options: ["Stop at railroad crossings even with no train in sight", "Cross at full speed", "Ignore crossing signals"], correctIndex: 0, explanation: "Buses and hazardous-load trucks must stop." },
    { id: "tp12-49", prompt: "When a flagger directs traffic at a crossing, drivers must:", options: ["Obey the flagger", "Ignore them if no train is seen", "Proceed at their own pace"], correctIndex: 0, explanation: "Always obey a railroad flagger." },
    { id: "tp12-50", prompt: "A driver should never:", options: ["Race a train to a crossing", "Stop for flashing lights", "Slow down near tracks"], correctIndex: 0, explanation: "Never try to beat a train." },
  ]),
  ...group("emergencies", [
    { id: "tp12-51", prompt: "If the accelerator sticks, a driver should:", options: ["Shift to neutral and brake", "Switch off the key at speed", "Keep driving"], correctIndex: 0, explanation: "Neutral cuts power; then brake safely." },
    { id: "tp12-52", prompt: "If a vehicle catches fire, a driver should:", options: ["Pull over, shut off the engine, and get out", "Drive to a station", "Open the hood at speed"], correctIndex: 0, explanation: "Stop, shut off, and move away." },
    { id: "tp12-53", prompt: "If the engine stalls while driving, a driver should expect:", options: ["Harder steering and braking", "Nothing to change", "The car to stop instantly"], correctIndex: 0, explanation: "Power assist is lost; steer firmly to the side." },
    { id: "tp12-54", prompt: "A disabled vehicle should be:", options: ["Moved off the road when possible", "Left in the traffic lane", "Parked on the center line"], correctIndex: 0, explanation: "Get a disabled vehicle off the roadway." },
    { id: "tp12-55", prompt: "If headlights fail at night, a driver should:", options: ["Use hazard lights and pull off the road", "Keep the same speed", "Follow another car closely"], correctIndex: 0, explanation: "Use hazards and get off the road." },
  ]),
  ...group("distracted", [
    { id: "tp12-56", prompt: "The safest way to handle a phone call while driving is to:", options: ["Pull over to a safe place", "Hold the phone low", "Answer quickly and keep driving"], correctIndex: 0, explanation: "Pull over before using the phone." },
    { id: "tp12-57", prompt: "Setting a GPS destination should be done:", options: ["Before you start driving", "While merging", "At highway speed"], correctIndex: 0, explanation: "Program navigation before driving." },
    { id: "tp12-58", prompt: "Eating while driving is:", options: ["A distraction that should be avoided", "Always safe", "Required on trips"], correctIndex: 0, explanation: "Eating takes attention off driving." },
    { id: "tp12-59", prompt: "Talking with passengers becomes dangerous when it:", options: ["Distracts the driver from the road", "Keeps the driver awake", "Is about directions"], correctIndex: 0, explanation: "Any distracting conversation raises risk." },
    { id: "tp12-60", prompt: "A driver who feels drowsy should:", options: ["Stop and rest", "Drive faster", "Turn up the radio and continue"], correctIndex: 0, explanation: "Stop and rest when drowsy." },
  ]),
  ...group("vehicle-equipment", [
    { id: "tp12-61", prompt: "Wiper blades that streak and smear should be:", options: ["Replaced", "Ignored", "Bent back"], correctIndex: 0, explanation: "Replace worn blades for clear vision." },
    { id: "tp12-62", prompt: "Brake lights are important because they:", options: ["Warn drivers behind that you are slowing", "Improve fuel economy", "Look nice"], correctIndex: 0, explanation: "Brake lights warn following drivers." },
    { id: "tp12-63", prompt: "Tire pressure should be checked when the tires are:", options: ["Cold", "Hot", "It doesn't matter"], correctIndex: 0, explanation: "Check pressure cold for accuracy." },
    { id: "tp12-64", prompt: "A vehicle's horn must:", options: ["Be in working order", "Be disconnected", "Play a tune"], correctIndex: 0, explanation: "A working horn is required." },
    { id: "tp12-65", prompt: "A head restraint should be set:", options: ["Behind the back of the head", "Below the shoulders", "Removed"], correctIndex: 0, explanation: "A proper head restraint reduces whiplash." },
  ]),
  ...group("insurance", [
    { id: "tp12-66", prompt: "Financial responsibility means a driver can:", options: ["Pay for harm they cause while driving", "Drive any vehicle", "Skip registration"], correctIndex: 0, explanation: "It shows you can pay for damage you cause." },
    { id: "tp12-67", prompt: "In California, liability coverage is:", options: ["Required by law", "Optional", "Only for new drivers"], correctIndex: 0, explanation: "Liability insurance is mandatory." },
    { id: "tp12-68", prompt: "Proof of insurance must be shown:", options: ["When an officer requests it", "Only once a year", "Never"], correctIndex: 0, explanation: "Show proof of insurance on request." },
    { id: "tp12-69", prompt: "Letting auto insurance lapse can cause:", options: ["Suspension of your vehicle registration", "A discount", "Nothing"], correctIndex: 0, explanation: "A lapse can suspend registration." },
    { id: "tp12-70", prompt: "California's required minimum coverage for property damage is:", options: ["$15,000", "$5,000", "$1,000"], correctIndex: 0, explanation: "Minimum property damage is $15,000 (2025)." },
  ]),
  ...group("weather", [
    { id: "tp12-71", prompt: "In fog, a driver should:", options: ["Slow down and use low beams", "Use high beams", "Speed up"], correctIndex: 0, explanation: "Low beams and slower speed help in fog." },
    { id: "tp12-72", prompt: "On icy roads, a driver should:", options: ["Slow down and brake gently", "Brake hard to test grip", "Maintain normal speed"], correctIndex: 0, explanation: "Gentle inputs on ice prevent skids." },
    { id: "tp12-73", prompt: "After driving through deep water, a driver should:", options: ["Test the brakes gently to dry them", "Brake hard once", "Speed up"], correctIndex: 0, explanation: "Dry wet brakes with light braking." },
    { id: "tp12-74", prompt: "When sun glare makes it hard to see, a driver should:", options: ["Use the visor, sunglasses, and slow down", "Speed up to pass it", "Close one eye"], correctIndex: 0, explanation: "Reduce glare and slow down." },
    { id: "tp12-75", prompt: "In freezing weather, which surfaces ice over first?", options: ["Bridges and overpasses", "Flat straightaways", "Tunnels"], correctIndex: 0, explanation: "Bridges and overpasses freeze first." },
  ]),
  ...group("licensing-misc", [
    { id: "tp12-76", prompt: "To get or renew a driver license, a person must pass:", options: ["A vision test", "A swimming test", "A history test"], correctIndex: 0, explanation: "A vision screening is required." },
    { id: "tp12-77", prompt: "A learner's permit holder must drive with:", options: ["A licensed adult 25 or older", "Any passenger", "No one"], correctIndex: 0, explanation: "A supervising driver 25+ is required." },
    { id: "tp12-78", prompt: "Accumulating too many points on a record can lead to:", options: ["License suspension", "A reward", "Lower insurance"], correctIndex: 0, explanation: "Too many points can suspend your license." },
    { id: "tp12-79", prompt: "Driving on a suspended license is:", options: ["Illegal", "Allowed to get to work", "Allowed in emergencies"], correctIndex: 0, explanation: "It is illegal to drive on a suspended license." },
    { id: "tp12-80", prompt: "A California Class C license allows a person to drive:", options: ["A car or light truck", "A large semi-truck", "A bus"], correctIndex: 0, explanation: "Class C covers ordinary cars and light trucks." },
  ]),
];

export const SCENARIO12_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
