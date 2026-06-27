import type { CategoryId, Question } from "@/lib/types";

/**
 * Ninth batch: DUI consequences, licensing, pedestrian/bicycle law, and more
 * (origin: generated), grounded in the California Driver Handbook. Correct
 * answer first; engine shuffles options.
 */

const HANDBOOK_URL =
  "https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/";

type Seed = Pick<Question, "id" | "category" | "prompt" | "options" | "correctIndex"> &
  Partial<Pick<Question, "explanation" | "diagramId">>;

function group(category: CategoryId, items: Omit<Seed, "category">[]): Seed[] {
  return items.map((it) => ({ ...it, category }));
}

const seeds: Seed[] = [
  ...group("dui-alcohol", [
    { id: "dn9-1", prompt: "For a driver under 21, having any measurable alcohol in their system can result in:", options: ["License suspension under the zero-tolerance law", "A warning only", "No penalty"], correctIndex: 0, explanation: "Under-21 drivers face suspension for any measurable alcohol." },
    { id: "dn9-2", prompt: "A DUI that causes injury to another person is:", options: ["A more serious offense with harsher penalties", "Treated the same as a parking ticket", "Not a crime"], correctIndex: 0, explanation: "Injury DUIs carry much more serious consequences." },
    { id: "dn9-3", prompt: "Penalties for DUI typically:", options: ["Increase with each repeat offense", "Decrease over time", "Stay the same no matter what"], correctIndex: 0, explanation: "Repeat DUIs bring progressively harsher penalties." },
    { id: "dn9-4", prompt: "A driver under 21 who refuses a preliminary alcohol screening (PAS) test:", options: ["Can have their license suspended", "Faces no consequence", "Gets a discount"], correctIndex: 0, explanation: "Refusing the PAS test under 21 leads to suspension." },
    { id: "dn9-5", prompt: "Feeling 'a little buzzed' means your ability to drive is:", options: ["Already impaired", "Better than normal", "Unaffected"], correctIndex: 0, explanation: "Even mild intoxication impairs driving." },
  ]),

  ...group("licensing-misc", [
    { id: "dn9-6", prompt: "To get or renew a driver license, you must usually pass:", options: ["A vision (eyesight) test", "A swimming test", "A typing test"], correctIndex: 0, explanation: "A vision screening is part of getting or renewing a license." },
    { id: "dn9-7", prompt: "Driving a large semi-truck or a bus requires:", options: ["A commercial driver license (Class A or B)", "A Class C license", "No special license"], correctIndex: 0, explanation: "Big rigs and buses require a commercial license." },
    { id: "dn9-8", prompt: "Ignoring a traffic ticket and failing to appear in court can:", options: ["Lead to a suspended license", "Cancel the ticket", "Lower your insurance"], correctIndex: 0, explanation: "Failure to appear can suspend your driving privilege." },
    { id: "dn9-9", prompt: "A learner's permit holder must always drive with:", options: ["A licensed adult supervising in the front seat", "Friends in the car", "No one"], correctIndex: 0, explanation: "Permit holders must be supervised by a licensed adult." },
    { id: "dn9-10", prompt: "Your driving privilege can be suspended if you:", options: ["Accumulate too many points for violations", "Drive under the limit", "Renew your license"], correctIndex: 0, explanation: "Too many points lead to suspension." },
  ]),

  ...group("sharing-road", [
    { id: "dn9-11", prompt: "At night, a bicyclist riding on the road must have:", options: ["A front light and a rear reflector", "Only dark clothing", "No equipment"], correctIndex: 0, explanation: "Bicyclists need a front lamp and rear reflector at night." },
    { id: "dn9-12", prompt: "When a pedestrian is in a crosswalk, you must:", options: ["Stop and let them cross safely", "Slow down but keep moving", "Drive around them"], correctIndex: 0, explanation: "Yield fully to pedestrians in a crosswalk." },
    { id: "dn9-13", prompt: "When you approach a blind pedestrian who has stepped into the crosswalk, you must:", options: ["Stop and let them cross", "Honk to warn them back", "Edge around them"], correctIndex: 0, explanation: "Always yield to a blind pedestrian who is crossing." },
    { id: "dn9-14", prompt: "Riders of electric scooters and skateboards near the road:", options: ["Should be watched for, as they can be hard to see", "Never use the road", "Always yield to no one"], correctIndex: 0, explanation: "Watch carefully for small, hard-to-see road users." },
    { id: "dn9-15", prompt: "A school bus extends a stop-arm with flashing red lights. You must:", options: ["Stop until the lights stop and the arm folds in", "Pass slowly", "Continue if no children are seen"], correctIndex: 0, explanation: "Stop for a school bus's red lights and stop-arm.", diagramId: "school-bus" },
    { id: "dn9-16", prompt: "When sharing the road with a large truck, remember it:", options: ["Needs much more distance to stop", "Stops faster than a car", "Has no blind spots"], correctIndex: 0, explanation: "Trucks need extra stopping distance and have big blind spots." },
  ]),

  ...group("freeway", [
    { id: "dn9-17", prompt: "Motorcycles in a carpool (HOV) lane:", options: ["Are allowed, even with one rider", "Are never allowed", "Need three riders"], correctIndex: 0, explanation: "Motorcycles may use HOV lanes regardless of occupancy." },
    { id: "dn9-18", prompt: "Driving on the freeway shoulder to get around traffic is:", options: ["Illegal except in an emergency", "Allowed during rush hour", "Encouraged"], correctIndex: 0, explanation: "The shoulder is for emergencies, not driving around traffic." },
    { id: "dn9-19", prompt: "When following a large truck on the freeway, you should:", options: ["Leave extra following distance", "Tailgate to draft", "Stay in its blind spot"], correctIndex: 0, explanation: "Trucks block your view and need more room; stay back." },
    { id: "dn9-20", prompt: "If you need to slow down on the freeway, you should:", options: ["Slow gradually and signal if changing lanes", "Brake suddenly", "Stop in the lane"], correctIndex: 0, explanation: "Slow smoothly to avoid surprising drivers behind you." },
  ]),

  ...group("lanes-passing", [
    { id: "dn9-21", prompt: "When you change lanes across several lanes, you should:", options: ["Move over one lane at a time", "Cross all lanes at once", "Change lanes in the intersection"], correctIndex: 0, explanation: "Change one lane at a time, checking each move." },
    { id: "dn9-22", prompt: "Where a lane ends and traffic must merge, the courteous and safe method is to:", options: ["Take turns merging (zipper merge)", "Force your way in", "Block the merging lane"], correctIndex: 0, explanation: "Alternate merging keeps traffic flowing safely." },
    { id: "dn9-23", prompt: "You should use your turn signal:", options: ["Even when you don't see other vehicles nearby", "Only in heavy traffic", "Only on freeways"], correctIndex: 0, explanation: "Always signal; unseen road users may be present." },
    { id: "dn9-24", prompt: "Making a sudden lane change right in front of a large truck is dangerous because:", options: ["The truck needs much more distance to stop", "Trucks accelerate quickly", "Trucks have no brakes"], correctIndex: 0, explanation: "Cutting in front of a truck leaves it too little stopping room." },
  ]),

  ...group("parking", [
    { id: "dn9-25", prompt: "You should not park within how far of a disabled-access (curb) ramp?", options: ["Close enough to block it", "100 feet", "It's always fine"], correctIndex: 0, explanation: "Keep access ramps clear for wheelchair users." },
    { id: "dn9-26", prompt: "Parking on a sidewalk is:", options: ["Not allowed", "Allowed for short stops", "Allowed if two wheels are off"], correctIndex: 0, explanation: "Don't park on sidewalks; they are for pedestrians." },
    { id: "dn9-27", prompt: "Parking in a marked bus loading zone is:", options: ["Not allowed", "Allowed when no bus is present", "Allowed for cars only"], correctIndex: 0, explanation: "Keep bus zones clear for transit." },
  ]),

  ...group("speed-limits", [
    { id: "dn9-28", prompt: "On a local road with no posted limit in a residential area, the limit is usually:", options: ["25 mph", "45 mph", "55 mph"], correctIndex: 0, explanation: "Residential areas default to 25 mph unless posted." },
    { id: "dn9-29", prompt: "On rural roads at night, you should watch for and slow down for:", options: ["Animals that may enter the road", "Extra wide lanes", "Faster speed limits"], correctIndex: 0, explanation: "Animals are common hazards on rural roads at night." },
    { id: "dn9-30", prompt: "When you tow a trailer, you should:", options: ["Drive slower and allow more stopping distance", "Drive faster to keep momentum", "Brake later"], correctIndex: 0, explanation: "Trailers add weight and length; slow down and leave room." },
  ]),

  ...group("emergencies", [
    { id: "dn9-31", prompt: "After a collision, you should turn on your:", options: ["Hazard (emergency) lights", "High beams", "Cruise control"], correctIndex: 0, explanation: "Hazard lights warn other drivers of the situation." },
    { id: "dn9-32", prompt: "If you smell exhaust fumes inside your vehicle, you should:", options: ["Open windows for fresh air and have it checked", "Ignore it", "Turn up the heat"], correctIndex: 0, explanation: "Exhaust in the cabin can be deadly carbon monoxide; ventilate and inspect." },
    { id: "dn9-33", prompt: "If your windshield wipers fail in heavy rain, you should:", options: ["Slow down and pull off the road safely", "Speed up to get home", "Drive with your head out the window"], correctIndex: 0, explanation: "Without wipers you can't see; get off the road." },
    { id: "dn9-34", prompt: "A useful item to carry for emergencies is:", options: ["Jumper cables and a flashlight", "Extra license plates", "A second steering wheel"], correctIndex: 0, explanation: "Basic emergency gear helps you handle breakdowns." },
  ]),

  ...group("weather", [
    { id: "dn9-35", prompt: "In rain, a safe following distance is often:", options: ["Four or more seconds", "Less than two seconds", "One car length"], correctIndex: 0, explanation: "Increase following distance in the rain." },
    { id: "dn9-36", prompt: "On a wet road, you should brake:", options: ["Gently and earlier than usual", "Hard at the last moment", "Only with the parking brake"], correctIndex: 0, explanation: "Gentle, early braking avoids skids on wet roads." },
    { id: "dn9-37", prompt: "Low spots on the road during a storm may:", options: ["Be flooded—avoid driving through them", "Be the safest place", "Improve traction"], correctIndex: 0, explanation: "Avoid flooded low spots; water depth is hard to judge." },
  ]),

  ...group("vehicle-equipment", [
    { id: "dn9-38", prompt: "Your vehicle must have a rear-view mirror that gives a view of the road at least:", options: ["200 feet behind you", "20 feet behind you", "1 mile behind you"], correctIndex: 0, explanation: "A mirror must show at least 200 feet to the rear." },
    { id: "dn9-39", prompt: "Keeping your headlights and tail lights clean:", options: ["Improves how well you see and are seen", "Wastes time", "Drains the battery"], correctIndex: 0, explanation: "Clean lights are brighter and safer." },
    { id: "dn9-40", prompt: "Your brakes must be able to:", options: ["Stop the vehicle within the required distance", "Work only downhill", "Be used once per trip"], correctIndex: 0, explanation: "Brakes must meet stopping-distance standards." },
  ]),

  ...group("restraints", [
    { id: "dn9-41", prompt: "A pregnant driver should wear the lap belt:", options: ["Low, below the belly across the hips", "Across the belly", "Behind the back"], correctIndex: 0, explanation: "Keep the lap belt low under the belly for safety." },
    { id: "dn9-42", prompt: "Putting the shoulder belt behind your back is:", options: ["Unsafe and reduces protection", "Recommended for comfort", "Required"], correctIndex: 0, explanation: "Wear the shoulder belt across your chest, never behind you." },
    { id: "dn9-43", prompt: "Two children sharing one seat belt is:", options: ["Unsafe and not allowed", "Fine for short trips", "Safer than separate belts"], correctIndex: 0, explanation: "Each person needs their own restraint." },
  ]),

  ...group("right-of-way", [
    { id: "dn9-44", prompt: "At a four-way stop, the first vehicle to come to a complete stop:", options: ["Has the right to go first", "Must wait for everyone", "Yields to all others"], correctIndex: 0, explanation: "First to fully stop goes first at an all-way stop." },
    { id: "dn9-45", prompt: "When you merge into a lane of moving traffic, you must:", options: ["Yield to vehicles already in that lane", "Make them slow for you", "Stop in the lane"], correctIndex: 0, explanation: "Merging drivers yield to traffic already in the lane." },
    { id: "dn9-46", prompt: "At an uncontrolled crosswalk where a pedestrian waits to cross, you should:", options: ["Stop and yield to the pedestrian", "Continue, since there is no signal", "Wave them off"], correctIndex: 0, explanation: "Yield to pedestrians at any crosswalk, even unmarked." },
  ]),

  ...group("insurance", [
    { id: "dn9-47", prompt: "Before you drive a newly purchased car, you should:", options: ["Make sure it is insured", "Wait a week", "Remove the plates"], correctIndex: 0, explanation: "A vehicle must be insured before you drive it." },
    { id: "dn9-48", prompt: "After certain serious violations, you may be required to file:", options: ["An SR-22 certificate of insurance", "A new driving test", "A vehicle inspection"], correctIndex: 0, explanation: "An SR-22 proves you carry the required insurance." },
  ]),
];

export const SCENARIO9_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
