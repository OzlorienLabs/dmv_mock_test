import type { CategoryId, Question } from "@/lib/types";

/**
 * Eighth batch: turning, intersection, signaling, and pedestrian/bicycle
 * specifics (origin: generated), grounded in the California Driver Handbook.
 * Correct answer first; engine shuffles options.
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
    { id: "ro8-1", prompt: "At a green light with no arrow, a driver turning left must:", options: ["Yield to oncoming traffic and pedestrians", "Turn before oncoming traffic", "Proceed without looking"], correctIndex: 0, explanation: "A left turn on a green ball is unprotected; yield first." },
    { id: "ro8-2", prompt: "When making a legal U-turn at an intersection, you must yield to:", options: ["Oncoming vehicles and pedestrians", "No one", "Only trucks"], correctIndex: 0, explanation: "Yield to oncoming traffic and pedestrians before a U-turn." },
    { id: "ro8-3", prompt: "An emergency vehicle is stopped in the intersection ahead with lights on. You should:", options: ["Wait until it clears and you can proceed safely", "Drive around it through the intersection", "Honk and push through"], correctIndex: 0, explanation: "Let emergency vehicles clear before proceeding." },
    { id: "ro8-4", prompt: "At an all-way stop with several cars waiting, vehicles should proceed:", options: ["In the order they arrived", "By vehicle size", "All at once"], correctIndex: 0, explanation: "Take turns in arrival order at an all-way stop." },
    { id: "ro8-5", prompt: "A crossing guard signals you to stop at a school crosswalk. You must:", options: ["Stop as directed", "Proceed if no children are visible", "Slow but keep rolling"], correctIndex: 0, explanation: "Obey crossing guards at all times." },
    { id: "ro8-6", prompt: "When you turn at an intersection, you must yield to:", options: ["Bicyclists and pedestrians going straight", "No one if you signal", "Only cars"], correctIndex: 0, explanation: "Turning traffic yields to through cyclists and pedestrians." },
    { id: "ro8-7", prompt: "In a multi-lane roundabout, you should choose your lane based on:", options: ["The exit you plan to take", "The color of your car", "Whoever is behind you"], correctIndex: 0, explanation: "Pick the correct lane for your exit before entering.", diagramId: "roundabout" },
  ]),

  ...group("lanes-passing", [
    { id: "ro8-8", prompt: "To make a right turn, you should approach the corner:", options: ["In the right-hand lane, close to the right curb", "From the center lane", "From the left lane"], correctIndex: 0, explanation: "Turn right from the rightmost lane, ending in the right lane." },
    { id: "ro8-9", prompt: "To make a left turn from a two-way street, you should be:", options: ["In the lane just right of the center line", "In the far-right lane", "On the shoulder"], correctIndex: 0, explanation: "Approach a left turn near the center line." },
    { id: "ro8-10", prompt: "Before you back up your vehicle, you should:", options: ["Check behind the vehicle for people and objects", "Rely only on the rear-view mirror", "Honk and reverse"], correctIndex: 0, explanation: "Look behind your car before backing up." },
    { id: "ro8-11", prompt: "When backing straight, the best way to see behind you is to:", options: ["Turn and look over your right shoulder", "Use only the side mirror", "Watch the dashboard"], correctIndex: 0, explanation: "Look over your shoulder for the clearest rear view." },
    { id: "ro8-12", prompt: "A three-point turn is used to:", options: ["Turn the vehicle around on a narrow road", "Park uphill", "Merge onto a freeway"], correctIndex: 0, explanation: "A three-point turn reverses direction where space is limited." },
    { id: "ro8-13", prompt: "You should not make a U-turn:", options: ["Near a curve or hill where you cannot be seen", "At a wide intersection", "Where a sign allows it"], correctIndex: 0, explanation: "Avoid U-turns where other drivers can't see you." },
    { id: "ro8-14", prompt: "When two left-turn lanes are available, you should:", options: ["Stay within your lane throughout the turn", "Drift into the other lane", "Switch lanes mid-turn"], correctIndex: 0, explanation: "Hold your lane through a double left turn." },
    { id: "ro8-15", prompt: "After completing a turn, if your turn signal did not cancel, you should:", options: ["Turn it off manually", "Leave it on", "Speed up"], correctIndex: 0, explanation: "Cancel your signal so others aren't confused." },
  ]),

  ...group("signs-signals", [
    { id: "ro8-16", prompt: "You approach a 'Yield' sign and a vehicle is coming on the cross road. You should:", options: ["Slow or stop and let it pass", "Speed up to merge ahead of it", "Ignore the sign"], correctIndex: 0, explanation: "Yield means give the right-of-way to cross traffic." },
    { id: "ro8-17", prompt: "A 'Stop Ahead' sign warns you that:", options: ["A stop sign is coming up", "You may not stop", "The road ends"], correctIndex: 0, explanation: "Prepare to stop for an upcoming stop sign." },
    { id: "ro8-18", prompt: "A 'Signal Ahead' sign means:", options: ["A traffic signal you may not yet see is ahead", "You must signal now", "The signal is broken"], correctIndex: 0, explanation: "Be ready for a traffic light ahead." },
    { id: "ro8-19", prompt: "A school-zone sign with a flashing yellow beacon means:", options: ["Obey the reduced school speed limit while it flashes", "Speed up", "The school is closed"], correctIndex: 0, explanation: "The flashing beacon indicates the school speed limit is in effect." },
    { id: "ro8-20", prompt: "Arrows painted in your lane tell you:", options: ["Which direction you must travel from that lane", "How fast to drive", "Where to park"], correctIndex: 0, explanation: "Lane arrows show the required direction of travel." },
    { id: "ro8-21", prompt: "At a stop sign with no painted limit line, you must stop:", options: ["Before the crosswalk or the edge of the intersection", "In the middle of the intersection", "Only if cars are coming"], correctIndex: 0, explanation: "Stop before the crosswalk or intersection if there is no limit line." },
  ]),

  ...group("sharing-road", [
    { id: "ro8-22", prompt: "When you are stopped at a red light, you should:", options: ["Not block the crosswalk", "Stop in the middle of the crosswalk", "Pull into the intersection"], correctIndex: 0, explanation: "Stop behind the crosswalk so pedestrians can cross." },
    { id: "ro8-23", prompt: "A bicyclist signals and moves into a left-turn lane. You should:", options: ["Treat the bicyclist like any other vehicle and give room", "Force them back to the right", "Pass on the left closely"], correctIndex: 0, explanation: "Cyclists turning left may use the turn lane." },
    { id: "ro8-24", prompt: "When passing a horse and rider, you should:", options: ["Slow down, give wide space, and avoid loud noises", "Honk to move them", "Rev the engine"], correctIndex: 0, explanation: "Pass animals slowly, quietly, and with room." },
    { id: "ro8-25", prompt: "In bad weather, pedestrians may:", options: ["Need extra time to cross, so be patient", "Move faster", "Not be present"], correctIndex: 0, explanation: "Give pedestrians extra time in rain or poor visibility." },
    { id: "ro8-26", prompt: "Near a stopped ice cream truck or transit stop, you should:", options: ["Slow down and watch for people, especially children", "Maintain speed", "Pass quickly on the right"], correctIndex: 0, explanation: "People may cross near stopped vehicles; slow down." },
    { id: "ro8-27", prompt: "A pedestrian who is crossing slowly should be given:", options: ["Enough time to finish crossing safely", "Two seconds only", "A warning honk"], correctIndex: 0, explanation: "Allow pedestrians to complete their crossing." },
  ]),

  ...group("freeway", [
    { id: "ro8-28", prompt: "The on-ramp acceleration lane should be used to:", options: ["Reach the speed of freeway traffic before merging", "Stop and check the map", "Park briefly"], correctIndex: 0, explanation: "Build up speed in the acceleration lane before you merge.", diagramId: "freeway-merge" },
    { id: "ro8-29", prompt: "You may enter or leave a carpool lane:", options: ["Only where the boundary line is broken", "Anywhere", "By crossing the double line"], correctIndex: 0, explanation: "Cross only at the dashed sections of an HOV lane." },
    { id: "ro8-30", prompt: "On a freeway, you should slow down for your exit:", options: ["In the exit (deceleration) lane", "In the through lane", "On the shoulder"], correctIndex: 0, explanation: "Decelerate in the exit lane, not the travel lane." },
    { id: "ro8-31", prompt: "As you drive on the freeway, you should watch for vehicles:", options: ["Entering from on-ramps and adjust your speed or lane", "Only behind you", "Only far ahead"], correctIndex: 0, explanation: "Anticipate and accommodate merging traffic." },
    { id: "ro8-32", prompt: "On the freeway you should avoid:", options: ["Weaving quickly across several lanes", "Keeping a steady speed", "Signaling lane changes"], correctIndex: 0, explanation: "Frequent weaving is dangerous; move smoothly and signal." },
  ]),

  ...group("speed-limits", [
    { id: "ro8-33", prompt: "When a school-zone beacon is flashing, you must:", options: ["Slow to the posted school-zone speed", "Keep your normal speed", "Speed up to clear the zone"], correctIndex: 0, explanation: "Obey the reduced limit while the beacon flashes." },
    { id: "ro8-34", prompt: "In a parking lot, you should:", options: ["Drive slowly and watch for pedestrians and backing cars", "Drive at street speed", "Cut across empty spaces fast"], correctIndex: 0, explanation: "Parking lots are full of pedestrians and moving cars." },
    { id: "ro8-35", prompt: "On a narrow, winding mountain road, you should:", options: ["Slow down and keep to the right", "Drive in the center", "Speed through the curves"], correctIndex: 0, explanation: "Reduce speed and stay right on narrow roads." },
    { id: "ro8-36", prompt: "When you see a warning sign for a sharp curve with an advisory speed, you should:", options: ["Slow to about that speed before the curve", "Keep the posted limit through it", "Ignore the advisory"], correctIndex: 0, explanation: "Advisory speeds suggest a safe speed for the curve." },
  ]),

  ...group("parking", [
    { id: "ro8-37", prompt: "When backing into a parking space, you should:", options: ["Go slowly and check mirrors and over your shoulder", "Reverse quickly", "Rely only on sound"], correctIndex: 0, explanation: "Back slowly and keep checking around the vehicle." },
    { id: "ro8-38", prompt: "You should not stop your vehicle where it:", options: ["Blocks a marked crosswalk", "Is within 18 inches of the curb", "Faces traffic in a lot"], correctIndex: 0, explanation: "Never stop in a way that blocks a crosswalk." },
    { id: "ro8-39", prompt: "After parallel parking, you should:", options: ["Straighten the wheels and pull close to the curb", "Leave the car angled out", "Leave the wheels turned out"], correctIndex: 0, explanation: "Finish within 18 inches of the curb with wheels appropriate to the slope." },
  ]),

  ...group("weather", [
    { id: "ro8-40", prompt: "When you drive through a tunnel, you should:", options: ["Turn on your headlights", "Turn off all lights", "Use only parking lights"], correctIndex: 0, explanation: "Headlights help you see and be seen in a tunnel." },
    { id: "ro8-41", prompt: "At dawn and dusk, using your headlights:", options: ["Helps other drivers see you", "Wastes the battery", "Is illegal"], correctIndex: 0, explanation: "Low-light periods make you harder to see; use headlights." },
    { id: "ro8-42", prompt: "If a downpour makes it impossible to see, you should:", options: ["Pull off the road and turn on your hazard lights", "Drive faster to get through", "Stop in the lane"], correctIndex: 0, explanation: "Get off the road safely when you can't see." },
    { id: "ro8-43", prompt: "You should never drive through:", options: ["Moving floodwater across the road", "A light rain", "A dry tunnel"], correctIndex: 0, explanation: "Moving water can sweep your vehicle away." },
  ]),

  ...group("vehicle-equipment", [
    { id: "ro8-44", prompt: "Your head restraint should be adjusted so it is:", options: ["Behind the back of your head", "Below your shoulders", "Removed"], correctIndex: 0, explanation: "A properly set head restraint reduces whiplash." },
    { id: "ro8-45", prompt: "Before a trip, your windshield washer fluid should be:", options: ["Filled so you can clean the windshield", "Empty to save weight", "Replaced with water only in winter"], correctIndex: 0, explanation: "Keep washer fluid filled for clear visibility." },
    { id: "ro8-46", prompt: "Tires with very low tread should be:", options: ["Replaced, because they lose grip", "Kept until they go flat", "Inflated higher to compensate"], correctIndex: 0, explanation: "Low-tread tires lose traction and must be replaced." },
    { id: "ro8-47", prompt: "Before driving, you should make sure your turn signals:", options: ["Work properly", "Are disconnected", "Are covered"], correctIndex: 0, explanation: "Working signals let you communicate your intentions." },
  ]),

  ...group("emergencies", [
    { id: "ro8-48", prompt: "If a rear tire blows out, the back of the car may sway. You should:", options: ["Hold the wheel firmly, ease off the gas, and slow gradually", "Brake hard at once", "Accelerate"], correctIndex: 0, explanation: "Keep control by steering straight and slowing gently." },
    { id: "ro8-49", prompt: "If your vehicle breaks down, the safest place to wait is usually:", options: ["Off the road, away from traffic", "In the traffic lane", "On the center line"], correctIndex: 0, explanation: "Get the vehicle and yourself away from moving traffic." },
    { id: "ro8-50", prompt: "When you see a crash ahead, you should:", options: ["Slow down, stay alert, and avoid distractions like staring at it", "Speed up to pass", "Stop in the lane to watch"], correctIndex: 0, explanation: "Don't rubberneck; keep moving safely past a crash scene." },
  ]),
];

export const SCENARIO8_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
