import type { CategoryId, Question } from "@/lib/types";

/**
 * Fifth batch of authored scenario questions (origin: generated), grounded in
 * the California Driver Handbook. Correct answer first; engine shuffles options.
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
    { id: "row5-1", prompt: "You and an oncoming car both reach an intersection to turn left at the same time. You should:", options: ["Turn to the left of each other, passing on the left", "Turn in front of the other car", "Stop and wait for the other to leave"], correctIndex: 0, explanation: "Left-turning drivers normally pass to the left of each other." },
    { id: "row5-2", prompt: "A car is backing out of a driveway into the street as you approach. The backing car:", options: ["Must yield to you", "Has the right-of-way", "May proceed first"], correctIndex: 0, explanation: "A vehicle entering the road must yield to traffic already on it." },
    { id: "row5-3", prompt: "At a yield sign with no cross traffic, you may:", options: ["Proceed without stopping", "Must always stop fully", "Reverse to look"], correctIndex: 0, explanation: "Yield means stop only if needed; you may proceed when clear." },
    { id: "row5-4", prompt: "You want to enter a roundabout, and a pedestrian is in the crosswalk at the entrance. You should:", options: ["Stop and let the pedestrian cross", "Enter before the pedestrian", "Honk and proceed"], correctIndex: 0, explanation: "Yield to pedestrians at roundabout crosswalks." },
    { id: "row5-5", prompt: "Two vehicles arrive at a four-way stop facing each other; one goes straight and one turns left. Who goes first?", options: ["The vehicle going straight", "The vehicle turning left", "The larger vehicle"], correctIndex: 0, explanation: "Through traffic generally has priority over a left-turning vehicle." },
    { id: "row5-6", prompt: "A pedestrian using a white cane is at the corner with the cane held up, then lowers it and steps back. You may:", options: ["Proceed cautiously, but be ready to yield if they step out", "Speed past quickly", "Honk repeatedly"], correctIndex: 0, explanation: "Watch blind pedestrians carefully and be ready to yield." },
    { id: "row5-7", prompt: "When you are part of, or meeting, a funeral procession, you should:", options: ["Yield to the procession and not cut through it", "Drive through gaps in it", "Pass it on the shoulder"], correctIndex: 0, explanation: "Let a funeral procession proceed together." },
    { id: "row5-8", prompt: "You reach a T-intersection from the road that ends. You must:", options: ["Yield to traffic on the through road", "Proceed first", "Expect cross traffic to stop"], correctIndex: 0, explanation: "Traffic on the through road has the right-of-way." },
  ]),

  ...group("lanes-passing", [
    { id: "lan5-1", prompt: "You want to pass a slow car on a two-lane road. You may do so when:", options: ["A broken yellow line is on your side and the way ahead is clear", "A solid yellow line is on your side", "You are approaching a curve"], correctIndex: 0, explanation: "Pass only with a broken line on your side and a clear path." },
    { id: "lan5-2", prompt: "After you pass a vehicle, you should return to your lane when:", options: ["You can see the passed vehicle in your rear-view mirror", "You are even with its front bumper", "You are halfway past it"], correctIndex: 0, explanation: "Re-enter the lane when you can see the whole vehicle behind you." },
    { id: "lan5-3", prompt: "When you want to turn left from a two-way street, you should be in:", options: ["The lane just to the right of the center line", "The far-right lane", "Any lane"], correctIndex: 0, explanation: "Turn left from the lane nearest the center line." },
    { id: "lan5-4", prompt: "On a road with a center left-turn lane, you should enter it:", options: ["Shortly before your turn, not far in advance", "A block early and drive in it", "Never"], correctIndex: 0, explanation: "Use the two-way left-turn lane only just before turning." },
    { id: "lan5-5", prompt: "If you miss your turn or exit, you should:", options: ["Continue and turn around safely later", "Stop and back up", "Make a sudden turn"], correctIndex: 0, explanation: "Never stop or reverse; go on and turn around safely." },
    { id: "lan5-6", prompt: "When several lanes go the same direction and one is much slower, you should:", options: ["Pass only on the left when it is safe", "Pass on the right shoulder", "Tailgate to push through"], correctIndex: 0, explanation: "Pass on the left where it is safe and legal." },
    { id: "lan5-7", prompt: "A solid line next to a broken line means:", options: ["Passing is allowed only from the side with the broken line", "No passing for anyone", "Passing allowed for both"], correctIndex: 0, explanation: "You may pass only if the broken line is on your side." },
    { id: "lan5-8", prompt: "Weaving in and out of traffic to get ahead is:", options: ["Dangerous and increases your crash risk", "An efficient driving technique", "Required in heavy traffic"], correctIndex: 0, explanation: "Frequent lane changes raise the risk of collisions." },
  ]),

  ...group("parking", [
    { id: "prk5-1", prompt: "When you finish parallel parking, your wheels should be:", options: ["Within 18 inches of the curb", "About three feet from the curb", "Touching the curb hard"], correctIndex: 0, explanation: "Park within 18 inches of the curb." },
    { id: "prk5-2", prompt: "You may not park within how many feet of a stop sign or signal at the corner?", options: ["Where it would block the view of the sign or signal", "100 feet always", "5 feet"], correctIndex: 0, explanation: "Don't park where you block others' view of a sign or signal." },
    { id: "prk5-3", prompt: "Parking in a bicycle lane is:", options: ["Generally not allowed unless signs permit it", "Always allowed", "Allowed at night"], correctIndex: 0, explanation: "Don't park in a bike lane unless signs allow it." },
    { id: "prk5-4", prompt: "Before opening your door into the street after parking, you should:", options: ["Check for traffic and bicyclists approaching from behind", "Open it quickly", "Assume the lane is clear"], correctIndex: 0, explanation: "Check mirrors and over your shoulder before opening the door." },
    { id: "prk5-5", prompt: "You may stop briefly in a white-painted curb zone to:", options: ["Load or unload passengers or mail", "Park for an hour", "Leave the car unattended"], correctIndex: 0, explanation: "White curbs are for quick passenger or mail loading.", diagramId: "curb-colors" },
    { id: "prk5-6", prompt: "Parking within an intersection is:", options: ["Not allowed", "Allowed if brief", "Allowed when traffic is light"], correctIndex: 0, explanation: "Never park within an intersection." },
    { id: "prk5-7", prompt: "When parking parallel on the right side of a two-way street, your car should face:", options: ["The same direction as traffic", "Against traffic", "Either direction"], correctIndex: 0, explanation: "Park in the direction of traffic flow." },
    { id: "prk5-8", prompt: "You must not stop or park where a sign says 'No Stopping' because:", options: ["Stopping there is prohibited at any time", "It only applies at night", "It only applies to trucks"], correctIndex: 0, explanation: "A No Stopping sign forbids stopping there at any time." },
  ]),

  ...group("speed-limits", [
    { id: "spd5-1", prompt: "When you leave a high-speed freeway, you should:", options: ["Check your speedometer because you may be going faster than you think", "Keep your freeway speed", "Speed up on the ramp"], correctIndex: 0, explanation: "After high speeds, your sense of speed is distorted—check the gauge." },
    { id: "spd5-2", prompt: "In heavy traffic, the safest speed is usually:", options: ["About the same as the traffic around you, within the limit", "Much faster than traffic", "Much slower than traffic"], correctIndex: 0, explanation: "Match the flow of traffic, but never exceed the limit." },
    { id: "spd5-3", prompt: "Near a senior center, hospital, or where people may be slow to cross, you should:", options: ["Slow down and stay alert", "Maintain your speed", "Use your horn"], correctIndex: 0, explanation: "Reduce speed where vulnerable pedestrians may be present." },
    { id: "spd5-4", prompt: "A speed limit sign tells you the:", options: ["Maximum legal speed under ideal conditions", "Recommended minimum speed", "Speed to drive in any weather"], correctIndex: 0, explanation: "Posted limits are maximums for ideal conditions." },
    { id: "spd5-5", prompt: "When entering a sharp curve, your speed should be:", options: ["Reduced before the curve, then steady through it", "Increased through the curve", "Highest at the apex"], correctIndex: 0, explanation: "Slow before, then maintain a steady speed through the curve." },
    { id: "spd5-6", prompt: "On a slippery road, your stopping distance is:", options: ["Longer than on a dry road", "Shorter than on a dry road", "The same"], correctIndex: 0, explanation: "Wet or icy roads greatly increase stopping distance." },
  ]),

  ...group("freeway", [
    { id: "fwy5-1", prompt: "When you want to exit a freeway, you should move into the exit lane:", options: ["Well before the exit and slow down in that lane", "At the last second", "While braking in the through lane"], correctIndex: 0, explanation: "Move over early and slow in the deceleration lane." },
    { id: "fwy5-2", prompt: "If traffic on the freeway is stopped, you should:", options: ["Slow early and turn on your hazard lights to warn others", "Stop suddenly", "Change lanes repeatedly"], correctIndex: 0, explanation: "Brake early and flash hazards to warn drivers behind you." },
    { id: "fwy5-3", prompt: "When merging, the gap you need in traffic should be:", options: ["Large enough to enter at traffic speed without forcing others to brake", "Just one car length", "Any size if you signal"], correctIndex: 0, explanation: "Merge into a gap that lets you keep pace safely." },
    { id: "fwy5-4", prompt: "Driving for long periods on a straight freeway can cause:", options: ["Highway hypnosis or drowsiness", "Better attention", "Sharper vision"], correctIndex: 0, explanation: "Monotonous driving can make you drowsy; take breaks." },
    { id: "fwy5-5", prompt: "When another driver is trying to merge onto the freeway ahead of you, you should:", options: ["Adjust your speed or move over to make room", "Speed up to close the gap", "Flash your lights to stop them"], correctIndex: 0, explanation: "Help merging traffic by making space." },
    { id: "fwy5-6", prompt: "You should use the left freeway lane mainly for:", options: ["Passing slower vehicles", "Cruising at any speed", "Exiting the freeway"], correctIndex: 0, explanation: "Keep right except to pass." },
  ]),

  ...group("sharing-road", [
    { id: "shr5-1", prompt: "When you want to turn right and a bicyclist is going straight in a bike lane beside you, you should:", options: ["Yield to the bicyclist and turn behind them", "Turn quickly in front of them", "Speed up to beat them"], correctIndex: 0, explanation: "Yield to a through bicyclist before turning across the bike lane." },
    { id: "shr5-2", prompt: "A pedestrian is crossing slowly against a 'DON'T WALK' signal as your light turns green. You should:", options: ["Wait for them to finish crossing", "Proceed because you have the green", "Edge forward to hurry them"], correctIndex: 0, explanation: "Let pedestrians finish crossing before you go." },
    { id: "shr5-3", prompt: "When you follow a motorcycle, you should:", options: ["Allow more following distance than for a car", "Follow closer since it is small", "Drive beside it in the same lane"], correctIndex: 0, explanation: "Motorcycles stop quickly; leave extra space." },
    { id: "shr5-4", prompt: "If you see a stopped emergency vehicle with flashing lights on the roadside, you should:", options: ["Move over a lane if safe, or slow down", "Maintain speed in the same lane", "Speed up to pass"], correctIndex: 0, explanation: "California's Move Over law requires moving over or slowing down." },
    { id: "shr5-5", prompt: "Children waiting at a bus stop or playing near the road require you to:", options: ["Slow down and be ready to stop", "Maintain speed", "Honk loudly"], correctIndex: 0, explanation: "Children can be unpredictable; reduce speed and stay alert." },
    { id: "shr5-6", prompt: "A truck driver signals and begins a wide right turn. You should:", options: ["Stay back and never pass on the right", "Pass quickly on the right", "Pull alongside the cab"], correctIndex: 0, explanation: "Trucks swing wide; don't get between the truck and the curb." },
  ]),

  ...group("signs-signals", [
    { id: "sig5-1", prompt: "A green light at an intersection means:", options: ["Go, if the intersection is clear and it is safe", "Speed up to clear it", "Go even if traffic is blocking it"], correctIndex: 0, explanation: "Green means go only when the way is clear." },
    { id: "sig5-2", prompt: "A red traffic signal means:", options: ["Stop, and remain stopped until it turns green", "Slow down", "Stop only if cars are coming"], correctIndex: 0, explanation: "A red light means a full stop until green." },
    { id: "sig5-3", prompt: "A lane-use signal showing a red X over your lane means:", options: ["Do not drive in that lane", "Drive faster in that lane", "The lane is a carpool lane"], correctIndex: 0, explanation: "A red X means the lane is closed to you." },
    { id: "sig5-4", prompt: "Flashing yellow lights on a sign or barricade mean:", options: ["Proceed with caution", "Stop and wait", "Speed up"], correctIndex: 0, explanation: "Flashing yellow warns you to slow and proceed carefully." },
    { id: "sig5-5", prompt: "A pedestrian signal showing a steady 'DON'T WALK' or red hand means:", options: ["Pedestrians should not begin to cross", "Pedestrians may start crossing", "Cars must stop"], correctIndex: 0, explanation: "A steady red hand tells pedestrians not to start crossing." },
    { id: "sig5-6", prompt: "Reflective raised pavement markers (dots) help you:", options: ["See the lane lines, especially at night or in rain", "Measure your speed", "Find parking"], correctIndex: 0, explanation: "Raised markers make lane lines easier to see at night." },
  ]),

  ...group("weather", [
    { id: "wea5-1", prompt: "Driving in heavy rain, if your car begins to hydroplane you should:", options: ["Ease off the gas and keep the steering straight", "Brake hard", "Turn sharply"], correctIndex: 0, explanation: "Ease off the accelerator and steer straight until traction returns." },
    { id: "wea5-2", prompt: "In foggy conditions, it is best to:", options: ["Slow down, use low beams, and increase following distance", "Use high beams", "Follow the car ahead closely"], correctIndex: 0, explanation: "Low beams and slower speeds improve safety in fog." },
    { id: "wea5-3", prompt: "When the road is covered with snow or ice, you should:", options: ["Drive slowly and brake gently", "Brake hard to test traction", "Maintain normal speed"], correctIndex: 0, explanation: "Use gentle inputs and low speed on snow or ice." },
    { id: "wea5-4", prompt: "Strong winds are most dangerous when:", options: ["You pass or are near large, high-profile vehicles", "The road is straight", "You drive slowly"], correctIndex: 0, explanation: "Wind gusts around big vehicles can push you; grip firmly." },
  ]),

  ...group("vehicle-equipment", [
    { id: "veq5-1", prompt: "If your headlights suddenly go dim or out at night, first try:", options: ["The high beams, then pull off the road safely", "Speeding up", "Closing your eyes"], correctIndex: 0, explanation: "High beams may still work; then get off the road." },
    { id: "veq5-2", prompt: "Properly working brake lights are important because they:", options: ["Tell drivers behind you that you are slowing or stopping", "Make your car look nicer", "Improve fuel economy"], correctIndex: 0, explanation: "Brake lights warn following drivers." },
    { id: "veq5-3", prompt: "A windshield washer and wipers that work well are important for:", options: ["Keeping a clear view in rain and dirt", "Saving fuel", "Engine cooling"], correctIndex: 0, explanation: "Clear glass is essential for safe visibility." },
    { id: "veq5-4", prompt: "If your vehicle pulls to one side when braking, it may mean:", options: ["A brake or tire problem that needs service", "The road is fine", "You are driving too slowly"], correctIndex: 0, explanation: "Pulling while braking signals a brake or tire issue." },
  ]),

  ...group("distracted", [
    { id: "dst5-1", prompt: "The best time to adjust mirrors, climate, and audio is:", options: ["Before you start driving", "While merging", "At highway speed"], correctIndex: 0, explanation: "Set up controls before you drive." },
    { id: "dst5-2", prompt: "If you are lost and need to check directions, you should:", options: ["Pull over to a safe place to look", "Read the map while driving", "Slow down in the lane and look down"], correctIndex: 0, explanation: "Stop safely before checking directions." },
    { id: "dst5-3", prompt: "Talking with passengers becomes dangerous when it:", options: ["Takes your attention away from driving", "Keeps you awake", "Is about the road"], correctIndex: 0, explanation: "Any conversation that distracts you raises risk." },
    { id: "dst5-4", prompt: "A hands-free phone call is allowed for adults, but you should still:", options: ["Keep your attention on driving", "Look at the screen often", "Take notes while driving"], correctIndex: 0, explanation: "Even legal calls can distract; stay focused on driving." },
  ]),
];

export const SCENARIO5_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
