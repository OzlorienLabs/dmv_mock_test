import type { CategoryId, Question } from "@/lib/types";

/**
 * Fourth batch of authored scenario questions (origin: generated), grounded in
 * the California Driver Handbook. Correct answer is listed first; the engine
 * shuffles option order at test-build time.
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
    { id: "row4-1", prompt: "At a four-way stop, a pedestrian and a car arrive at the same time. Who goes first?", options: ["The pedestrian", "The car", "Whoever moves first"], correctIndex: 0, explanation: "Pedestrians always have priority over vehicles.", diagramId: "four-way-stop" },
    { id: "row4-2", prompt: "Turning right at a red light, you must first:", options: ["Stop, then yield to pedestrians and cross traffic", "Turn without stopping", "Yield only to cars"], correctIndex: 0, explanation: "A right on red requires a full stop and yielding to pedestrians and traffic." },
    { id: "row4-3", prompt: "A vehicle is already in the intersection when your light turns green. You should:", options: ["Wait for it to clear before proceeding", "Proceed immediately", "Honk and go"], correctIndex: 0, explanation: "Let vehicles already in the intersection clear first." },
    { id: "row4-4", prompt: "At a yield sign, you must:", options: ["Slow down, and stop if necessary, to let cross traffic pass", "Always come to a full stop", "Speed up to merge"], correctIndex: 0, explanation: "Yield means give the right-of-way, stopping if needed." },
    { id: "row4-5", prompt: "A flashing yellow left-turn arrow means you may:", options: ["Turn left after yielding to oncoming traffic and pedestrians", "Turn without yielding", "Not turn at all"], correctIndex: 0, explanation: "A flashing yellow arrow is an unprotected turn; yield first." },
  ]),

  ...group("signs-signals", [
    { id: "sig4-1", prompt: "A diamond symbol painted in a lane indicates:", options: ["A carpool (HOV) lane", "A bike lane", "A bus-only lane"], correctIndex: 0, explanation: "The diamond marks a high-occupancy vehicle lane." },
    { id: "sig4-2", prompt: "The word 'ONLY' with an arrow painted in a lane means:", options: ["Vehicles in that lane must go in the arrow's direction", "You may go any direction", "The lane is closed"], correctIndex: 0, explanation: "A lane marked ONLY with an arrow is a mandatory-direction lane." },
    { id: "sig4-3", prompt: "Rumble strips along the edge or center of a road warn you that:", options: ["You may be drifting out of your lane", "There is a toll ahead", "You should speed up"], correctIndex: 0, explanation: "Rumble strips alert you to drifting or an upcoming stop." },
    { id: "sig4-4", prompt: "A bicycle symbol painted in a lane indicates:", options: ["A bike lane", "A pedestrian-only path", "A parking area"], correctIndex: 0, explanation: "The bike symbol marks a designated bicycle lane." },
  ]),

  ...group("speed-limits", [
    { id: "spd4-1", prompt: "When towing a trailer in California, the maximum speed limit is generally:", options: ["55 mph", "65 mph", "70 mph"], correctIndex: 0, explanation: "Vehicles towing trailers are limited to 55 mph." },
    { id: "spd4-2", prompt: "The posted speed limit applies:", options: ["Even when traffic is light or the road looks empty", "Only during rush hour", "Only when police are present"], correctIndex: 0, explanation: "Speed limits apply at all times." },
    { id: "spd4-3", prompt: "In a construction zone with workers present, you should:", options: ["Slow down and be prepared to stop; fines may be doubled", "Maintain freeway speed", "Speed up to clear it"], correctIndex: 0, explanation: "Reduce speed in active work zones where fines are doubled." },
  ]),

  ...group("parking", [
    { id: "prk4-1", prompt: "Parking your vehicle facing against the flow of traffic is:", options: ["Illegal", "Allowed on quiet streets", "Recommended"], correctIndex: 0, explanation: "Park in the direction of traffic, not against it." },
    { id: "prk4-2", prompt: "You may not park:", options: ["On a bridge or in a tunnel", "On any side street", "In a shopping center"], correctIndex: 0, explanation: "Parking on bridges and in tunnels is prohibited." },
    { id: "prk4-3", prompt: "Parking in a disabled space without a placard or plate is:", options: ["Illegal and subject to a large fine", "Allowed briefly", "Allowed if no disabled drivers are nearby"], correctIndex: 0, explanation: "Only vehicles with a valid placard/plate may use disabled spaces." },
    { id: "prk4-4", prompt: "'Double parking' (stopping alongside a parked car) is:", options: ["Illegal", "Allowed for quick errands", "Allowed if you stay in the car"], correctIndex: 0, explanation: "Double parking blocks traffic and is illegal." },
  ]),

  ...group("lanes-passing", [
    { id: "lan4-1", prompt: "The '3-second rule' is used to judge:", options: ["A safe following distance", "Your speed", "How long to signal"], correctIndex: 0, explanation: "Pick a fixed point and count 3 seconds behind the car ahead.", diagramId: "following-distance" },
    { id: "lan4-2", prompt: "You should avoid driving:", options: ["In another driver's blind spot", "In the right lane", "At the speed limit"], correctIndex: 0, explanation: "Don't linger in others' blind spots; speed up or drop back." },
    { id: "lan4-3", prompt: "When you make a turn, you should generally end up in:", options: ["The lane nearest the one you turned from", "Any open lane", "The far lane"], correctIndex: 0, explanation: "Turn into the nearest legal lane to keep traffic orderly." },
    { id: "lan4-4", prompt: "The center lane marked on both sides with a solid and a broken yellow line is for:", options: ["Left turns by traffic from either direction", "Passing", "Through traffic"], correctIndex: 0, explanation: "It's a shared two-way left-turn lane." },
  ]),

  ...group("dui-alcohol", [
    { id: "dui4-1", prompt: "An ignition interlock device (IID):", options: ["Requires a breath sample before the engine will start", "Tracks your location", "Limits your top speed"], correctIndex: 0, explanation: "An IID prevents starting the car if alcohol is detected." },
    { id: "dui4-2", prompt: "A first DUI conviction commonly requires:", options: ["Attending a DUI program", "Nothing further", "A larger vehicle"], correctIndex: 0, explanation: "DUI offenders are typically ordered to complete a DUI program." },
    { id: "dui4-3", prompt: "It is illegal to have an open container of alcohol:", options: ["In the passenger area of the vehicle", "In the trunk", "Anywhere in the car at all times"], correctIndex: 0, explanation: "Open containers must be kept out of the passenger area." },
  ]),

  ...group("restraints", [
    { id: "res4-1", prompt: "Unsecured pets in a vehicle:", options: ["Can distract the driver and become a hazard in a crash", "Improve your driving", "Are required by law to be loose"], correctIndex: 0, explanation: "Restrain pets so they don't distract you or get hurt." },
    { id: "res4-2", prompt: "A loose, heavy object in your car:", options: ["Can become a dangerous projectile in a crash", "Helps balance the car", "Has no effect"], correctIndex: 0, explanation: "Secure heavy items; they can fly forward in a collision." },
  ]),

  ...group("sharing-road", [
    { id: "shr4-1", prompt: "When driving past parked cars, you should watch for:", options: ["Doors opening and people stepping out", "Nothing in particular", "Only the car ahead"], correctIndex: 0, explanation: "People may open doors or step into the street from parked cars." },
    { id: "shr4-2", prompt: "When you approach a horse and rider on or near the road, you should:", options: ["Slow down and give them plenty of room", "Honk to move them", "Rev your engine"], correctIndex: 0, explanation: "Pass animals slowly and quietly with extra space." },
    { id: "shr4-3", prompt: "A pedestrian steps into the roadway mid-block, not at a crosswalk. You should:", options: ["Slow down and avoid hitting them", "Maintain speed since they're jaywalking", "Speed up"], correctIndex: 0, explanation: "Always try to avoid a collision, even if the pedestrian is at fault." },
  ]),

  ...group("freeway", [
    { id: "fwy4-1", prompt: "A yellow advisory speed sign on a freeway exit ramp shows:", options: ["The recommended safe speed for the ramp", "The minimum speed", "The fine amount"], correctIndex: 0, explanation: "Yellow ramp speeds are advisory maximums for that curve." },
    { id: "fwy4-2", prompt: "If you miss your freeway exit, you should never:", options: ["Stop or back up on the freeway", "Continue to the next exit", "Signal early next time"], correctIndex: 0, explanation: "Never stop or reverse on a freeway; go to the next exit." },
    { id: "fwy4-3", prompt: "The acceleration lane (on-ramp) is used to:", options: ["Build up to the speed of freeway traffic", "Stop and wait for a gap", "Park temporarily"], correctIndex: 0, explanation: "Use the on-ramp to match traffic speed before merging.", diagramId: "freeway-merge" },
  ]),

  ...group("emergencies", [
    { id: "emg4-1", prompt: "If your brake pedal feels spongy and sinks, you should:", options: ["Pump the pedal to build pressure and slow down", "Press once and hold", "Turn off the engine"], correctIndex: 0, explanation: "Pumping can restore some braking; slow down and get it checked." },
    { id: "emg4-2", prompt: "Warning triangles or flares should be placed:", options: ["Behind your disabled vehicle to warn approaching traffic", "Inside your vehicle", "On the roof"], correctIndex: 0, explanation: "Set warning devices behind a disabled vehicle." },
    { id: "emg4-3", prompt: "If you smell gasoline or smoke while driving, you should:", options: ["Pull over safely, turn off the engine, and check it out", "Keep driving and hope it stops", "Open the hood at speed"], correctIndex: 0, explanation: "Stop and shut off the engine if you suspect a leak or fire." },
  ]),

  ...group("distracted", [
    { id: "dst4-1", prompt: "Even hands-free phone use while driving:", options: ["Still takes some attention off the road", "Is risk-free", "Improves reaction time"], correctIndex: 0, explanation: "Conversations can still distract you mentally." },
    { id: "dst4-2", prompt: "A navigation device should be:", options: ["Mounted and set before driving, not held", "Held in your hand", "Programmed while moving"], correctIndex: 0, explanation: "Mount the device and set the route before you drive." },
    { id: "dst4-3", prompt: "Eating or drinking while driving is:", options: ["A distraction that should be avoided", "Always safe", "Required on long trips"], correctIndex: 0, explanation: "Eating takes hands and attention off driving." },
  ]),

  ...group("vehicle-equipment", [
    { id: "veq4-1", prompt: "In a vehicle with anti-lock brakes (ABS), during a hard stop you should:", options: ["Keep firm, steady pressure on the brake", "Pump the brakes rapidly", "Release the brake"], correctIndex: 0, explanation: "With ABS, press and hold firmly; the system prevents lock-up." },
    { id: "veq4-2", prompt: "Worn or poorly adjusted brakes:", options: ["Increase your stopping distance", "Shorten stopping distance", "Have no effect"], correctIndex: 0, explanation: "Bad brakes mean it takes longer to stop." },
    { id: "veq4-3", prompt: "Before driving at night, you should make sure:", options: ["All your lights work", "Your radio works", "The trunk is empty"], correctIndex: 0, explanation: "Check headlights, tail lights, and signals before night driving." },
  ]),

  ...group("weather", [
    { id: "wea4-1", prompt: "After driving through deep water, you should:", options: ["Test your brakes gently to dry them", "Brake hard once", "Speed up to dry the engine"], correctIndex: 0, explanation: "Wet brakes work poorly; dry them with light braking." },
    { id: "wea4-2", prompt: "On snow or ice, you should:", options: ["Greatly increase your following distance", "Follow closely to draft", "Brake hard to test traction"], correctIndex: 0, explanation: "Leave much more space on slick surfaces." },
    { id: "wea4-3", prompt: "On loose gravel, you should:", options: ["Slow down because traction is reduced", "Speed up for control", "Brake suddenly"], correctIndex: 0, explanation: "Gravel reduces traction; slow down and steer gently." },
  ]),

  ...group("licensing-misc", [
    { id: "lic4-1", prompt: "A California Class C license generally allows you to drive:", options: ["A passenger car or small truck", "A large semi-truck", "A motorcycle"], correctIndex: 0, explanation: "Class C covers ordinary cars and light trucks." },
    { id: "lic4-2", prompt: "You should keep your vehicle registration:", options: ["In the vehicle, available to show when asked", "At home", "Memorized only"], correctIndex: 0, explanation: "Carry your registration in the vehicle." },
    { id: "lic4-3", prompt: "Drivers under 18 with a provisional license may use a cell phone:", options: ["Not at all while driving, even hands-free", "Hands-free only", "For texting at lights"], correctIndex: 0, explanation: "Provisional drivers may not use a phone at all while driving." },
  ]),

  ...group("insurance", [
    { id: "ins4-1", prompt: "After a collision that causes injury, death, or major property damage, you must file an SR-1 with DMV within:", options: ["10 days", "30 days", "90 days"], correctIndex: 0, explanation: "File the SR-1 accident report within 10 days." },
  ]),

  ...group("railroad", [
    { id: "rr4-1", prompt: "At a railroad crossing, you should look:", options: ["Both ways and listen for a train before crossing", "Only to the left", "Only at the car ahead"], correctIndex: 0, explanation: "Look and listen both directions before crossing tracks." },
  ]),
];

export const SCENARIO4_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
