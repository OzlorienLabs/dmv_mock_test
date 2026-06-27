import type { CategoryId, Question } from "@/lib/types";

/**
 * Third batch of authored scenario questions (origin: generated), grounded in
 * the California Driver Handbook. Targets categories that were thinner after the
 * official + generated batches. Correct answer is listed first; the engine
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
  ...group("restraints", [
    { id: "res3-1", prompt: "A booster seat is designed to be used with:", options: ["The vehicle's lap and shoulder belt", "No seat belt at all", "Only a lap belt"], correctIndex: 0, explanation: "A booster raises the child so the adult belt fits correctly." },
    { id: "res3-2", prompt: "Where is the safest place for children to ride?", options: ["In the back seat, properly restrained", "In the front seat", "On an adult's lap"], correctIndex: 0, explanation: "Children are safest restrained in the back seat." },
    { id: "res3-3", prompt: "A seat belt should be worn:", options: ["Low and snug across the hips, with the shoulder strap across the chest", "Across the stomach", "Under the arm"], correctIndex: 0, explanation: "The lap belt rides low on the hips; the shoulder belt crosses the chest." },
    { id: "res3-4", prompt: "Who is responsible for making sure passengers under 16 are buckled up?", options: ["The driver", "The youngest passenger", "No one"], correctIndex: 0, explanation: "The driver is responsible for restraining passengers under 16." },
    { id: "res3-5", prompt: "A child who has outgrown a forward-facing harness should:", options: ["Use a booster seat until the seat belt fits properly", "Use the adult belt right away", "Ride without a restraint"], correctIndex: 0, explanation: "Use a booster until the lap/shoulder belt fits correctly." },
    { id: "res3-6", prompt: "An infant in a rear-facing car seat must never be placed:", options: ["In front of an active airbag", "In the back seat", "In a car with airbags"], correctIndex: 0, explanation: "A deploying airbag can seriously injure a rear-facing infant." },
  ]),

  ...group("insurance", [
    { id: "ins3-1", prompt: "The main purpose of auto insurance is to:", options: ["Pay for injuries or damage you cause to others", "Pay your traffic tickets", "Lower your fuel costs"], correctIndex: 0, explanation: "Liability insurance covers harm you cause to others." },
    { id: "ins3-2", prompt: "If you cannot afford standard insurance, California offers:", options: ["A low-cost automobile insurance program for eligible drivers", "Free insurance for everyone", "No options"], correctIndex: 0, explanation: "California's low-cost auto insurance program helps eligible drivers." },
    { id: "ins3-3", prompt: "You must show proof of insurance when you:", options: ["Register your vehicle, are stopped by police, or have a collision", "Buy fuel", "Wash your car"], correctIndex: 0, explanation: "Proof is required at registration, traffic stops, and collisions." },
    { id: "ins3-4", prompt: "Letting your auto insurance lapse can result in:", options: ["Suspension of your vehicle registration", "A lower insurance rate", "No consequences"], correctIndex: 0, explanation: "DMV can suspend registration if insurance lapses." },
    { id: "ins3-5", prompt: "Which coverage is required by California law?", options: ["Liability coverage", "Collision coverage", "Roadside assistance"], correctIndex: 0, explanation: "Liability is required; collision and others are optional." },
    { id: "ins3-6", prompt: "Borrowing a car that has no insurance and driving it is:", options: ["Still illegal", "Legal if it's not yours", "Legal for short trips"], correctIndex: 0, explanation: "Every vehicle on the road must be insured." },
  ]),

  ...group("railroad", [
    { id: "rr3-1", prompt: "Flashing red lights with lowered gates at a crossing mean:", options: ["A train is coming; stop and wait", "You may cross slowly", "The gates are broken"], correctIndex: 0, explanation: "Stop and wait until the gates rise and lights stop." },
    { id: "rr3-2", prompt: "After a train passes a multi-track crossing, you should:", options: ["Watch for a second train on another track before crossing", "Cross immediately", "Assume no more trains are coming"], correctIndex: 0, explanation: "A second train may be approaching on another track." },
    { id: "rr3-3", prompt: "Certain vehicles, such as buses and tank trucks, must:", options: ["Stop at railroad crossings even when no train is visible", "Speed across the tracks", "Ignore crossing signals"], correctIndex: 0, explanation: "Buses and hazardous-load trucks must stop at crossings." },
    { id: "rr3-4", prompt: "You should never try to:", options: ["Beat a train to the crossing", "Stop for flashing red lights", "Slow down near tracks"], correctIndex: 0, explanation: "Never race a train; you cannot judge its speed accurately." },
    { id: "rr3-5", prompt: "While your vehicle is crossing railroad tracks, you should:", options: ["Avoid changing gears", "Stop to look both ways", "Shift into neutral"], correctIndex: 0, explanation: "Don't shift gears on the tracks; you could stall." },
    { id: "rr3-6", prompt: "Modern light-rail trains:", options: ["Can be quieter and faster than you expect", "Always sound a loud horn", "Only run at night"], correctIndex: 0, explanation: "Light-rail vehicles can be surprisingly quiet and quick." },
  ]),

  ...group("dui-alcohol", [
    { id: "dui3-1", prompt: "The only thing that reduces the alcohol level in your body is:", options: ["Time", "Coffee", "A cold shower"], correctIndex: 0, explanation: "Only time lets your body remove alcohol; coffee won't sober you." },
    { id: "dui3-2", prompt: "Driving after just a couple of drinks ('buzzed driving') is:", options: ["Still driving under the influence", "Perfectly safe", "Legal if you feel fine"], correctIndex: 0, explanation: "Even small amounts of alcohol impair driving." },
    { id: "dui3-3", prompt: "A DUI conviction will usually:", options: ["Increase your insurance costs significantly", "Lower your insurance costs", "Have no effect on insurance"], correctIndex: 0, explanation: "A DUI typically raises insurance premiums sharply." },
    { id: "dui3-4", prompt: "Driving while impaired by marijuana is:", options: ["Illegal, because it slows reactions and impairs judgment", "Legal because it is legal to buy", "Safe in small amounts"], correctIndex: 0, explanation: "Cannabis impairs driving and DUI laws apply." },
    { id: "dui3-5", prompt: "A designated driver should:", options: ["Not drink any alcohol", "Have one or two drinks", "Drink only beer"], correctIndex: 0, explanation: "A designated driver should stay completely sober." },
    { id: "dui3-6", prompt: "Mixing alcohol with prescription or over-the-counter drugs can:", options: ["Greatly increase impairment", "Make you drive better", "Have no effect"], correctIndex: 0, explanation: "Drug and alcohol effects can multiply." },
  ]),

  ...group("emergencies", [
    { id: "emg3-1", prompt: "If your vehicle stalls on railroad tracks and no train is in sight, you should:", options: ["Get everyone out, then call the posted emergency number", "Stay inside and keep trying to start it", "Wait for a train to push it"], correctIndex: 0, explanation: "Exit first, then call the emergency number on the crossing sign." },
    { id: "emg3-2", prompt: "If you are in a skid, you should:", options: ["Look and steer in the direction you want to go", "Brake hard and hold the wheel straight", "Close your eyes and brake"], correctIndex: 0, explanation: "Steer where you want to go and ease off the controls." },
    { id: "emg3-3", prompt: "A good emergency kit for your car includes:", options: ["Warning triangles or flares and a flashlight", "Only a phone charger", "Nothing is needed"], correctIndex: 0, explanation: "Carry items to warn traffic and help you see at night." },
    { id: "emg3-4", prompt: "If a large animal is in your path and you can't stop in time, you should:", options: ["Brake firmly and try not to swerve into traffic", "Swerve sharply at high speed", "Speed up to pass it"], correctIndex: 0, explanation: "Braking straight is safer than swerving into oncoming traffic." },
    { id: "emg3-5", prompt: "After a minor collision that is blocking traffic, you should:", options: ["Move the vehicles out of the lane if it is safe and they can be driven", "Leave them and walk away", "Stand in the lane to direct traffic"], correctIndex: 0, explanation: "Clear the lane when safe to prevent further crashes." },
    { id: "emg3-6", prompt: "If your hood suddenly flies up and blocks your view, you should:", options: ["Slow down, look through the gap or out the side window, and pull over", "Brake hard immediately", "Speed up to a stop"], correctIndex: 0, explanation: "Stay calm, find any view available, and pull off safely." },
  ]),

  ...group("weather", [
    { id: "wea3-1", prompt: "In California, when you use your windshield wipers in rain, you must also:", options: ["Turn on your headlights", "Turn on your high beams", "Turn off your lights"], correctIndex: 0, explanation: "Headlights are required whenever wipers are in continuous use." },
    { id: "wea3-2", prompt: "On wet roads, you should reduce your speed by about:", options: ["One third", "Nothing", "Then double it"], correctIndex: 0, explanation: "Cut speed roughly a third on wet roads (more on snow/ice)." },
    { id: "wea3-3", prompt: "In strong crosswinds, you should:", options: ["Keep a firm grip and watch for high-profile vehicles", "Let go of the wheel", "Speed up"], correctIndex: 0, explanation: "Hold the wheel firmly; trucks and buses are pushed by wind." },
    { id: "wea3-4", prompt: "When sun glare makes it hard to see, you should:", options: ["Use your visor and sunglasses and keep your windshield clean", "Speed up to get past it", "Close one eye"], correctIndex: 0, explanation: "Reduce glare with a visor and a clean windshield." },
    { id: "wea3-5", prompt: "Driving in fog, the line you can use as a guide is:", options: ["The right edge line of the road", "The center line", "Other cars' tail lights far ahead"], correctIndex: 0, explanation: "Follow the right edge line so you don't drift into oncoming traffic." },
    { id: "wea3-6", prompt: "'Black ice' is dangerous because it:", options: ["Is hard to see and forms first on bridges and overpasses", "Is brightly colored", "Only forms on dirt roads"], correctIndex: 0, explanation: "Black ice is nearly invisible and forms on bridges first." },
  ]),

  ...group("distracted", [
    { id: "dst3-1", prompt: "Glancing away from the road for even two seconds at highway speed:", options: ["Lets your car travel a long distance blind", "Is completely safe", "Improves your focus"], correctIndex: 0, explanation: "At 55 mph, two seconds covers about half a football field." },
    { id: "dst3-2", prompt: "If your child or pet needs attention while driving, you should:", options: ["Pull over to a safe place first", "Turn around to handle it", "Reach back while driving"], correctIndex: 0, explanation: "Stop safely before dealing with passengers or pets." },
    { id: "dst3-3", prompt: "Drowsy driving is dangerous because it:", options: ["Slows reactions much like alcohol does", "Makes you a better driver", "Has no real effect"], correctIndex: 0, explanation: "Fatigue impairs reaction time similar to being drunk." },
    { id: "dst3-4", prompt: "Playing music very loudly while driving can:", options: ["Hide the sound of sirens and horns", "Improve your reaction time", "Help you concentrate"], correctIndex: 0, explanation: "Loud audio can mask important warning sounds." },
    { id: "dst3-5", prompt: "If you drop an object while driving, you should:", options: ["Leave it until you can stop safely", "Reach down for it immediately", "Look down and search for it"], correctIndex: 0, explanation: "Reaching for objects takes your eyes and attention off the road." },
  ]),

  ...group("freeway", [
    { id: "fwy3-1", prompt: "On a multi-lane freeway, you should generally:", options: ["Keep to the right except when passing", "Stay in the left lane", "Drift between lanes"], correctIndex: 0, explanation: "Keep right; use the left lanes to pass." },
    { id: "fwy3-2", prompt: "On a long, steep downgrade, you should:", options: ["Shift to a lower gear to help control your speed", "Ride the brakes the whole way", "Shift into neutral"], correctIndex: 0, explanation: "Lower gears use engine braking and save your brakes." },
    { id: "fwy3-3", prompt: "As you approach a freeway on-ramp where others are entering, you should:", options: ["Adjust your speed or change lanes to let them merge", "Speed up to block them", "Stop in your lane"], correctIndex: 0, explanation: "Cooperate with merging traffic for a smooth flow." },
    { id: "fwy3-4", prompt: "A carpool (HOV) lane sign that says '2+' means you need:", options: ["At least two people in the vehicle", "At least two vehicles", "A commercial plate"], correctIndex: 0, explanation: "'2+' means two or more occupants are required." },
    { id: "fwy3-5", prompt: "Before changing lanes on the freeway, you should look:", options: ["In your mirrors and over your shoulder to check blind spots", "Only at the car ahead", "Straight down at the road"], correctIndex: 0, explanation: "Mirrors plus a shoulder check cover your blind spots." },
  ]),

  ...group("vehicle-equipment", [
    { id: "veq3-1", prompt: "Tire pressure should be checked when the tires are:", options: ["Cold (before driving far)", "Hot after a long drive", "It doesn't matter"], correctIndex: 0, explanation: "Check pressure cold for an accurate reading." },
    { id: "veq3-2", prompt: "Windshield wiper blades that streak and smear should be:", options: ["Replaced", "Ignored", "Bent back into shape"], correctIndex: 0, explanation: "Worn blades reduce visibility and should be replaced." },
    { id: "veq3-3", prompt: "A crack or chip directly in the driver's line of sight should be:", options: ["Repaired so it doesn't block your view", "Left alone", "Covered with tape permanently"], correctIndex: 0, explanation: "Damage in your sightline must be fixed for clear vision." },
    { id: "veq3-4", prompt: "To reduce blind spots, your side mirrors should be:", options: ["Adjusted outward so you can just see the side of your car", "Pointed at the sky", "Folded in"], correctIndex: 0, explanation: "Set mirrors outward to widen your view and shrink blind spots." },
    { id: "veq3-5", prompt: "Letting your fuel run very low can:", options: ["Leave you stranded and is unsafe on the freeway", "Improve fuel economy", "Clean the engine"], correctIndex: 0, explanation: "Running out of fuel can strand you in traffic." },
  ]),

  ...group("licensing-misc", [
    { id: "lic3-1", prompt: "You must carry your driver license:", options: ["Whenever you drive", "Only on long trips", "Only when driving at night"], correctIndex: 0, explanation: "Always have your license with you while driving." },
    { id: "lic3-2", prompt: "If your driver license is lost or stolen, you should:", options: ["Apply for a replacement from DMV", "Keep driving without one", "Make a copy yourself"], correctIndex: 0, explanation: "Get a duplicate license from DMV." },
    { id: "lic3-3", prompt: "A provisional driver's restrictions generally end when they:", options: ["Turn 18", "Turn 16", "Pass the written test"], correctIndex: 0, explanation: "Provisional restrictions lift at age 18." },
    { id: "lic3-4", prompt: "When an officer asks for your license and registration, you should:", options: ["Provide them calmly when requested", "Refuse", "Drive away"], correctIndex: 0, explanation: "Cooperate and present your documents when asked." },
    { id: "lic3-5", prompt: "Points on your driving record from violations:", options: ["Can lead to a suspended license if too many add up", "Improve your record", "Expire the next day"], correctIndex: 0, explanation: "Accumulating too many points can suspend your license." },
  ]),

  ...group("right-of-way", [
    { id: "row3-1", prompt: "An emergency vehicle is approaching with lights and siren on a two-way street. You should:", options: ["Pull to the right edge and stop until it passes", "Continue at your speed", "Stop in the middle of the lane"], correctIndex: 0, explanation: "Pull right and stop for emergency vehicles." },
    { id: "row3-2", prompt: "When you are turning and a pedestrian is already in the crosswalk, you must:", options: ["Wait for them to finish crossing", "Turn around them quickly", "Honk so they hurry"], correctIndex: 0, explanation: "Yield to pedestrians who are crossing." },
    { id: "row3-3", prompt: "Two vehicles arrive at an all-way stop at the same time, side by side. The vehicle on the:", options: ["Left yields to the vehicle on the right", "Right yields to the vehicle on the left", "Larger size goes first"], correctIndex: 0, explanation: "When simultaneous, yield to the driver on your right." },
    { id: "row3-4", prompt: "Before entering a roundabout you must:", options: ["Yield to vehicles already circulating", "Stop even if it is empty", "Enter before circulating traffic"], correctIndex: 0, explanation: "Yield to traffic already in the roundabout.", diagramId: "roundabout" },
    { id: "row3-5", prompt: "At a green light, before going straight you should:", options: ["Make sure the intersection is clear and yield to any pedestrians", "Accelerate hard without looking", "Assume cross traffic will stop"], correctIndex: 0, explanation: "Green means go only if it is safe and the way is clear." },
  ]),

  ...group("lanes-passing", [
    { id: "lan3-1", prompt: "You should not change lanes:", options: ["While you are within an intersection", "On any highway", "When traffic is heavy"], correctIndex: 0, explanation: "Avoid lane changes inside intersections." },
    { id: "lan3-2", prompt: "Before every lane change you should:", options: ["Signal, check mirrors, and look over your shoulder", "Only honk", "Just move over"], correctIndex: 0, explanation: "Signal and check blind spots before moving over." },
  ]),

  ...group("sharing-road", [
    { id: "shr3-1", prompt: "When a bus has signaled and is pulling back into traffic, you should:", options: ["Slow down or change lanes to let it merge", "Speed up to pass it", "Block it from entering"], correctIndex: 0, explanation: "Yield to a bus re-entering the flow of traffic." },
    { id: "shr3-2", prompt: "Motorcycles are easy to miss, so before changing lanes you should:", options: ["Check your blind spots carefully for motorcycles", "Assume there are none", "Only check mirrors"], correctIndex: 0, explanation: "Motorcycles can hide in blind spots; check carefully." },
    { id: "shr3-3", prompt: "A bicyclist may legally use the full traffic lane when:", options: ["The lane is too narrow to share safely", "Never", "Only on freeways"], correctIndex: 0, explanation: "Cyclists may take the lane when it's too narrow to share." },
  ]),

  ...group("speed-limits", [
    { id: "spd3-1", prompt: "At night, you should:", options: ["Reduce your speed because you can see less far", "Drive faster to get home", "Keep high beams on in traffic"], correctIndex: 0, explanation: "Slow down at night so you can stop within your headlight range." },
    { id: "spd3-2", prompt: "You should slow down for a curve:", options: ["Before you enter it", "Only after you start sliding", "Halfway through it"], correctIndex: 0, explanation: "Brake before the curve, then steer through smoothly." },
  ]),
];

export const SCENARIO3_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
