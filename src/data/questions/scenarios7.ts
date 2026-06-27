import type { CategoryId, Question } from "@/lib/types";

/**
 * Seventh batch: defensive-driving, visibility, night, and vehicle-handling
 * scenarios (origin: generated), grounded in the California Driver Handbook.
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
  ...group("distracted", [
    { id: "sd7-1", prompt: "Good drivers scan the road ahead about:", options: ["10 to 15 seconds ahead of the vehicle", "Just past the hood", "Only at the car ahead"], correctIndex: 0, explanation: "Looking well ahead helps you spot hazards early." },
    { id: "sd7-2", prompt: "How often should you check your mirrors?", options: ["Every few seconds and before changing speed or lanes", "Once when you start", "Only when turning"], correctIndex: 0, explanation: "Frequent mirror checks keep you aware of traffic around you." },
    { id: "sd7-3", prompt: "A 'space cushion' means:", options: ["Keeping open space around your vehicle when possible", "Driving in a tight group", "Filling every gap in traffic"], correctIndex: 0, explanation: "Space around you gives room to react to hazards." },
    { id: "sd7-4", prompt: "When a hazard might develop, a good driver will:", options: ["Cover the brake and be ready to stop", "Speed up to pass it", "Look away"], correctIndex: 0, explanation: "Covering the brake shortens your reaction time." },
    { id: "sd7-5", prompt: "Defensive driving means you should:", options: ["Anticipate the mistakes of other drivers", "Assume others will never err", "Insist on your right-of-way"], correctIndex: 0, explanation: "Expect and plan for others' errors." },
    { id: "sd7-6", prompt: "When approaching a pedestrian who may cross, it helps to:", options: ["Make eye contact and be ready to stop", "Honk and keep going", "Look away"], correctIndex: 0, explanation: "Eye contact and readiness reduce pedestrian crashes." },
  ]),

  ...group("lanes-passing", [
    { id: "sd7-7", prompt: "If a tailgater is behind you, the safest response is to:", options: ["Increase your following distance ahead and let them pass", "Brake to warn them", "Speed up to escape"], correctIndex: 0, explanation: "More space ahead lets you brake gently; let the tailgater go by." },
    { id: "sd7-8", prompt: "When you pass another vehicle, you should:", options: ["Complete the pass briskly and return to your lane safely", "Linger beside it", "Slow down while alongside"], correctIndex: 0, explanation: "Spend as little time as possible alongside the vehicle." },
    { id: "sd7-9", prompt: "You should avoid driving in tight groups or 'packs' because:", options: ["A single mistake can cause a chain collision", "It saves fuel", "It is faster"], correctIndex: 0, explanation: "Find open space; packs leave little room to react." },
    { id: "sd7-10", prompt: "You should not attempt to pass:", options: ["On a hill or curve where you cannot see far enough ahead", "On a straight, clear road", "When a broken line is on your side"], correctIndex: 0, explanation: "Only pass where you can see the road is clear." },
    { id: "sd7-11", prompt: "To avoid a hazard in your lane, it is often best to:", options: ["Adjust your position slightly within your lane if possible", "Swerve hard into another lane", "Brake suddenly without looking"], correctIndex: 0, explanation: "Small adjustments are safer than sudden swerves." },
  ]),

  ...group("freeway", [
    { id: "sd7-12", prompt: "On the freeway, you should plan to be in your exit lane:", options: ["Well before the exit", "Right at the exit", "After you pass it"], correctIndex: 0, explanation: "Move over early so you don't make last-second lane changes." },
    { id: "sd7-13", prompt: "At higher speeds, your following distance should be:", options: ["Increased beyond the usual 3 seconds", "Decreased to keep up", "Kept at one car length"], correctIndex: 0, explanation: "Faster speeds need more space to stop.", diagramId: "following-distance" },
    { id: "sd7-14", prompt: "Watching brake lights several vehicles ahead helps you:", options: ["Anticipate slowing traffic early", "Drive faster", "Ignore the car directly ahead"], correctIndex: 0, explanation: "Looking far ahead warns you of slowdowns sooner." },
    { id: "sd7-15", prompt: "If you drive slower than other freeway traffic, you should use:", options: ["The right-hand lane", "The left lane", "The center divider"], correctIndex: 0, explanation: "Slower vehicles keep right." },
    { id: "sd7-16", prompt: "Before merging onto or off a freeway, you should:", options: ["Check mirrors and your blind spot", "Only glance ahead", "Close your eyes and merge"], correctIndex: 0, explanation: "Always check blind spots when merging." },
  ]),

  ...group("right-of-way", [
    { id: "sd7-17", prompt: "Even when you legally have the right-of-way, you should:", options: ["Make sure others actually yield before you proceed", "Proceed no matter what", "Close your eyes and go"], correctIndex: 0, explanation: "Never insist on the right-of-way if it risks a crash." },
    { id: "sd7-18", prompt: "If another driver wrongly takes the right-of-way, you should:", options: ["Yield to avoid a collision", "Refuse to yield", "Speed up to beat them"], correctIndex: 0, explanation: "Giving way prevents crashes, even when you're 'right.'" },
    { id: "sd7-19", prompt: "At a crosswalk, pedestrians:", options: ["Have priority and you must let them cross", "Must wait for all cars", "Only matter at red lights"], correctIndex: 0, explanation: "Yield to pedestrians at crosswalks, marked or not." },
    { id: "sd7-20", prompt: "When a vehicle is already in the intersection as you arrive, you should:", options: ["Let it clear before you enter", "Enter beside it", "Force it to back up"], correctIndex: 0, explanation: "Allow vehicles in the intersection to clear first." },
  ]),

  ...group("speed-limits", [
    { id: "sd7-21", prompt: "You should adjust your speed for:", options: ["Traffic, weather, road conditions, and visibility", "Only the posted limit", "Only your schedule"], correctIndex: 0, explanation: "Safe speed depends on conditions, not just the sign." },
    { id: "sd7-22", prompt: "In a neighborhood where children may be playing, you should:", options: ["Slow down and stay alert", "Keep your normal speed", "Use your horn constantly"], correctIndex: 0, explanation: "Reduce speed where children may dart into the street." },
    { id: "sd7-23", prompt: "At night you should drive:", options: ["Slowly enough to stop within the range of your headlights", "Faster to spend less time driving", "At the daytime speed"], correctIndex: 0, explanation: "Don't overdrive your headlights at night." },
    { id: "sd7-24", prompt: "Driving far below the speed of traffic can:", options: ["Be dangerous and obstruct other vehicles", "Always be safest", "Earn you a reward"], correctIndex: 0, explanation: "Going too slow can be hazardous and is sometimes illegal." },
  ]),

  ...group("weather", [
    { id: "sd7-25", prompt: "On an open road at night with no oncoming traffic, you may use:", options: ["High-beam headlights", "Parking lights only", "No lights"], correctIndex: 0, explanation: "Use high beams on open road, but dim them for other vehicles." },
    { id: "sd7-26", prompt: "When an oncoming vehicle's high beams blind you, you should:", options: ["Look toward the right edge of your lane", "Stare at the lights", "Turn on your high beams too"], correctIndex: 0, explanation: "Glance to the right edge to keep your lane until they pass." },
    { id: "sd7-27", prompt: "Dirty or cloudy headlights:", options: ["Reduce how well you can see at night", "Improve night vision", "Have no effect"], correctIndex: 0, explanation: "Keep headlights clean for good night visibility." },
    { id: "sd7-28", prompt: "Wet leaves or gravel on the road can:", options: ["Reduce traction, so slow down", "Improve grip", "Be safely ignored"], correctIndex: 0, explanation: "Slick surfaces reduce traction; slow down." },
    { id: "sd7-29", prompt: "When rain reduces visibility, you should:", options: ["Turn on your low beams and increase following distance", "Use high beams", "Follow closely to see better"], correctIndex: 0, explanation: "Low beams and extra space help in rain." },
  ]),

  ...group("emergencies", [
    { id: "sd7-30", prompt: "To recover from a skid, you should:", options: ["Ease off the gas and steer in the direction you want to go", "Brake hard and hold the wheel", "Accelerate"], correctIndex: 0, explanation: "Look and steer where you want to go; ease off the controls." },
    { id: "sd7-31", prompt: "On a slick road, you should avoid:", options: ["Braking hard and steering sharply at the same time", "Gentle steering", "Smooth braking"], correctIndex: 0, explanation: "Combining hard braking and sharp steering can cause a skid." },
    { id: "sd7-32", prompt: "If your right wheels leave the pavement onto the shoulder, you should:", options: ["Slow down, then ease back onto the pavement gently", "Steer back sharply at speed", "Brake hard immediately"], correctIndex: 0, explanation: "Slow first, then steer back smoothly to avoid losing control." },
    { id: "sd7-33", prompt: "In a vehicle without anti-lock brakes, to stop on a slippery road you should:", options: ["Pump the brakes to avoid locking the wheels", "Press the brake to the floor and hold", "Pull the parking brake hard"], correctIndex: 0, explanation: "Pumping helps prevent wheel lockup without ABS." },
    { id: "sd7-34", prompt: "When avoiding a hazard, you should look:", options: ["Where you want the car to go", "Directly at the hazard", "Down at the dashboard"], correctIndex: 0, explanation: "Your hands follow your eyes; look toward your escape path." },
  ]),

  ...group("sharing-road", [
    { id: "sd7-35", prompt: "Motorcycles are most often overlooked:", options: ["At intersections, where drivers fail to see them", "On open freeways", "In parking lots"], correctIndex: 0, explanation: "Look twice for motorcycles, especially at intersections." },
    { id: "sd7-36", prompt: "A bicyclist may move toward the center of the lane to:", options: ["Avoid road hazards or parked-car doors", "Slow down traffic for fun", "Break the law"], correctIndex: 0, explanation: "Cyclists may take the lane to avoid hazards." },
    { id: "sd7-37", prompt: "Behind a slow-moving vehicle, you should:", options: ["Be patient and pass only when it is safe and legal", "Tailgate to hurry it", "Pass on a curve"], correctIndex: 0, explanation: "Wait for a safe, legal place to pass." },
    { id: "sd7-38", prompt: "Around a school bus stopped with children getting off, you should:", options: ["Watch for children crossing in front of or behind the bus", "Assume the area is clear", "Speed past"], correctIndex: 0, explanation: "Children may cross unexpectedly near a school bus.", diagramId: "school-bus" },
  ]),

  ...group("parking", [
    { id: "sd7-39", prompt: "Leaving your keys in an unattended vehicle with the engine running is:", options: ["Illegal", "Recommended in winter", "Allowed for quick stops"], correctIndex: 0, explanation: "Don't leave a running car unattended with the keys in it." },
    { id: "sd7-40", prompt: "Before you leave a parking space at the curb, you should:", options: ["Signal and check for traffic and bicyclists", "Pull out quickly", "Assume the lane is clear"], correctIndex: 0, explanation: "Check mirrors and blind spots before pulling out." },
    { id: "sd7-41", prompt: "When you leave your parked car, you should:", options: ["Set the parking brake and lock the vehicle", "Leave it in neutral", "Leave the doors open"], correctIndex: 0, explanation: "Secure the vehicle with the brake set and doors locked." },
  ]),

  ...group("dui-alcohol", [
    { id: "sd7-42", prompt: "If you plan to drink, the responsible choice is to:", options: ["Arrange a sober ride before you go out", "Drive carefully afterward", "Drink slowly"], correctIndex: 0, explanation: "Plan a sober ride in advance." },
    { id: "sd7-43", prompt: "Alcohol affects which driving ability first?", options: ["Judgment and decision-making", "Your grip on the wheel", "Your tire pressure"], correctIndex: 0, explanation: "Judgment is impaired even at low alcohol levels." },
  ]),

  ...group("restraints", [
    { id: "sd7-44", prompt: "A seat belt protects you in a crash by:", options: ["Keeping you in the vehicle and in control area", "Slowing the car", "Inflating like an airbag"], correctIndex: 0, explanation: "Belts keep you from being thrown from the vehicle." },
    { id: "sd7-45", prompt: "The driver should not start moving until:", options: ["Everyone is wearing a seat belt", "The radio is set", "The windows are down"], correctIndex: 0, explanation: "Make sure all occupants are buckled before driving." },
  ]),

  ...group("railroad", [
    { id: "sd7-46", prompt: "A good practice when approaching a railroad crossing is to:", options: ["Lower noise inside so you can listen for a train", "Turn up the radio", "Speed up to cross faster"], correctIndex: 0, explanation: "Reduce interior noise to hear an approaching train." },
  ]),

  ...group("insurance", [
    { id: "sd7-47", prompt: "Keeping your auto insurance current helps you:", options: ["Avoid penalties and cover costs after a crash", "Drive faster legally", "Skip registration"], correctIndex: 0, explanation: "Current insurance is required and protects you financially." },
  ]),

  ...group("licensing-misc", [
    { id: "sd7-48", prompt: "Maintaining a clean driving record can:", options: ["Help keep your insurance costs lower", "Raise your costs", "Has no benefit"], correctIndex: 0, explanation: "Safe driving and few violations can lower insurance costs." },
  ]),
];

export const SCENARIO7_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
