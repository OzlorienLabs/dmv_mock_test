import type { CategoryId, Question } from "@/lib/types";

/**
 * Eleventh batch: "which statement is true" review questions (origin:
 * generated), grounded in the California Driver Handbook. Correct answer first;
 * engine shuffles options.
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
    { id: "wt11-1", prompt: "Which statement about right-of-way is correct?", options: ["You should yield to avoid a crash even when you have the right-of-way", "You must always take the right-of-way", "Right-of-way means others must stop for you no matter what"], correctIndex: 0, explanation: "Never insist on the right-of-way if it risks a collision." },
    { id: "wt11-2", prompt: "Which statement about roundabouts is true?", options: ["You yield to traffic already circulating and travel counter-clockwise", "You stop inside the roundabout to let others enter", "Entering traffic has the right-of-way"], correctIndex: 0, explanation: "Yield on entry; circulate counter-clockwise.", diagramId: "roundabout" },
    { id: "wt11-3", prompt: "On a narrow mountain road where two vehicles meet, which is true?", options: ["The vehicle facing downhill should yield and back up", "The vehicle facing uphill must back up", "The faster vehicle goes first"], correctIndex: 0, explanation: "Downhill yields, since reversing uphill is easier to control." },
    { id: "wt11-4", prompt: "Which statement about pedestrians is true?", options: ["They have the right-of-way at marked and unmarked crosswalks", "They must always wait for every car", "They have no rights outside painted crosswalks"], correctIndex: 0, explanation: "Yield to pedestrians at any crosswalk." },
    { id: "wt11-5", prompt: "When merging into a lane of traffic, which is true?", options: ["You must yield to vehicles already in that lane", "Traffic must slow down for you", "You may stop in the lane to wait"], correctIndex: 0, explanation: "Merging traffic yields to vehicles already there." },
  ]),
  ...group("signs-signals", [
    { id: "wt11-6", prompt: "Which sign shape is used only for a yield sign?", options: ["A downward-pointing triangle", "An octagon", "A circle"], correctIndex: 0, explanation: "A downward triangle is the yield sign." },
    { id: "wt11-7", prompt: "Which is true about sign colors?", options: ["Warning signs are usually yellow and construction signs orange", "All signs are red", "Green signs warn of hazards"], correctIndex: 0, explanation: "Yellow warns; orange marks construction; green guides." },
    { id: "wt11-8", prompt: "Which statement about a flashing red light is true?", options: ["It means stop, then proceed when safe", "It means slow down only", "It means the signal is broken—go"], correctIndex: 0, explanation: "Treat a flashing red like a stop sign." },
    { id: "wt11-9", prompt: "Which is true about a green arrow signal?", options: ["It is a protected turn; oncoming traffic is stopped", "You must yield to oncoming traffic", "Turns are prohibited"], correctIndex: 0, explanation: "A green arrow gives you a protected turn." },
    { id: "wt11-10", prompt: "Which statement about pavement lines is true?", options: ["Yellow lines separate opposite directions; white lines separate same direction", "All lines separate opposite directions", "White lines mark the center of the road"], correctIndex: 0, explanation: "Yellow = opposite directions; white = same direction." },
  ]),
  ...group("speed-limits", [
    { id: "wt11-11", prompt: "Which statement about the Basic Speed Law is true?", options: ["You may never drive faster than is safe for conditions", "You must always drive the posted limit", "It only applies on freeways"], correctIndex: 0, explanation: "Never exceed a safe speed for conditions." },
    { id: "wt11-12", prompt: "Which is the correct speed limit in an alley?", options: ["15 mph", "25 mph", "35 mph"], correctIndex: 0, explanation: "Alleys have a 15 mph limit." },
    { id: "wt11-13", prompt: "Near a railroad crossing where you cannot see 400 feet, the limit is:", options: ["15 mph", "30 mph", "45 mph"], correctIndex: 0, explanation: "15 mph applies with limited visibility at a crossing." },
    { id: "wt11-14", prompt: "On a two-lane undivided highway (unless posted), the maximum is:", options: ["55 mph", "65 mph", "45 mph"], correctIndex: 0, explanation: "Default maximum on two-lane undivided highways is 55 mph." },
    { id: "wt11-15", prompt: "Most California freeways are posted at a maximum of:", options: ["65 mph", "55 mph", "75 mph"], correctIndex: 0, explanation: "Most freeways are 65 mph unless posted otherwise." },
  ]),
  ...group("parking", [
    { id: "wt11-16", prompt: "Which is true about a red painted curb?", options: ["No stopping, standing, or parking", "Disabled parking only", "Brief passenger loading"], correctIndex: 0, explanation: "Red curbs allow no stopping or parking.", diagramId: "curb-colors" },
    { id: "wt11-17", prompt: "Which is true about a blue painted curb?", options: ["It is for disabled persons with a placard or plate", "It is for loading freight", "It is timed parking"], correctIndex: 0, explanation: "Blue curbs require a disabled placard or plate." },
    { id: "wt11-18", prompt: "Which is true about a white painted curb?", options: ["It is for a brief stop to load passengers or mail", "It means no parking ever", "It is for trucks only"], correctIndex: 0, explanation: "White curbs are for quick passenger/mail stops." },
    { id: "wt11-19", prompt: "Which is true about a yellow painted curb?", options: ["You may stop to load or unload within the posted time", "Parking is unlimited", "It is disabled parking"], correctIndex: 0, explanation: "Yellow curbs are for timed loading." },
    { id: "wt11-20", prompt: "When should you set the parking brake?", options: ["Every time you park", "Only on hills", "Only with a manual transmission"], correctIndex: 0, explanation: "Always set the parking brake when you park." },
  ]),
  ...group("lanes-passing", [
    { id: "wt11-21", prompt: "Which statement about double yellow lines is true?", options: ["You may not pass across them in either direction", "You may pass when clear", "They mean same-direction traffic"], correctIndex: 0, explanation: "Double yellow lines prohibit passing." },
    { id: "wt11-22", prompt: "In city driving, you should signal before a turn at least:", options: ["100 feet ahead", "10 feet ahead", "At the turn"], correctIndex: 0, explanation: "Signal about 100 feet before a turn." },
    { id: "wt11-23", prompt: "On the freeway, signal before a lane change at least:", options: ["5 seconds ahead", "1 second ahead", "After you move over"], correctIndex: 0, explanation: "Signal 5 seconds before a freeway lane change." },
    { id: "wt11-24", prompt: "Which statement about slow drivers is true?", options: ["They should keep to the right", "They should use the left lane", "They should drive in the center"], correctIndex: 0, explanation: "Slower traffic keeps right." },
    { id: "wt11-25", prompt: "Passing on the right is allowed:", options: ["When a vehicle ahead is turning left and there is room", "Anytime you wish", "Only on the freeway"], correctIndex: 0, explanation: "Passing on the right is limited to specific cases." },
  ]),
  ...group("dui-alcohol", [
    { id: "wt11-26", prompt: "The legal BAC limit for a driver 21 or older is:", options: ["0.08%", "0.05%", "0.10%"], correctIndex: 0, explanation: "0.08% is the adult limit." },
    { id: "wt11-27", prompt: "The BAC limit for a commercial driver is:", options: ["0.04%", "0.08%", "0.02%"], correctIndex: 0, explanation: "Commercial drivers: 0.04%." },
    { id: "wt11-28", prompt: "Which statement about implied consent is true?", options: ["By driving, you agree to chemical testing if arrested for DUI", "You can always refuse with no penalty", "It only applies to commercial drivers"], correctIndex: 0, explanation: "Refusing a test carries penalties under implied consent." },
    { id: "wt11-29", prompt: "Which statement about sobering up is true?", options: ["Only time lowers your blood alcohol level", "Coffee sobers you", "A cold shower sobers you"], correctIndex: 0, explanation: "Only time removes alcohol from your body." },
    { id: "wt11-30", prompt: "An open container of alcohol must be kept:", options: ["In the trunk", "In the glove box", "Under the seat"], correctIndex: 0, explanation: "Keep open containers in the trunk." },
  ]),
  ...group("restraints", [
    { id: "wt11-31", prompt: "Which statement about seat belts is true?", options: ["The driver and all passengers must wear them", "Only front-seat riders must wear them", "Only the driver must wear one"], correctIndex: 0, explanation: "Everyone must buckle up." },
    { id: "wt11-32", prompt: "Children under 8 years old must generally ride:", options: ["In a car seat or booster in the back seat", "In a regular seat belt", "In the front seat"], correctIndex: 0, explanation: "Under 8 requires a car seat/booster in back (unless 4 ft 9 in)." },
    { id: "wt11-33", prompt: "Which statement about airbags is true?", options: ["They work best when you also wear a seat belt", "They replace the need for a seat belt", "They should be disabled"], correctIndex: 0, explanation: "Airbags supplement seat belts." },
    { id: "wt11-34", prompt: "A child may use a regular seat belt when they are:", options: ["At least 8 years old or 4 feet 9 inches tall", "At least 5 years old", "At least 50 pounds"], correctIndex: 0, explanation: "Age 8 or 4 ft 9 in allows a regular belt." },
    { id: "wt11-35", prompt: "Leaving a child 6 or younger alone in a vehicle is:", options: ["Illegal", "Allowed briefly", "Allowed at night"], correctIndex: 0, explanation: "It is illegal to leave a young child unattended in a car." },
  ]),
  ...group("sharing-road", [
    { id: "wt11-36", prompt: "When passing a bicyclist, you must allow at least:", options: ["3 feet of space", "1 foot of space", "No set distance"], correctIndex: 0, explanation: "Give cyclists 3 feet when passing." },
    { id: "wt11-37", prompt: "Yellow flashing lights on a school bus mean:", options: ["Prepare to stop", "Pass quickly", "Ignore them"], correctIndex: 0, explanation: "Yellow flashers warn the bus is about to stop.", diagramId: "school-bus" },
    { id: "wt11-38", prompt: "Which statement about large trucks is true?", options: ["They have large blind spots and need more room to stop", "They stop faster than cars", "They have no blind spots"], correctIndex: 0, explanation: "Trucks have big blind spots and long stopping distances." },
    { id: "wt11-39", prompt: "Which statement about motorcycles is true?", options: ["They are entitled to a full lane", "They must ride on the shoulder", "They must share a lane with cars"], correctIndex: 0, explanation: "Motorcyclists may use a full lane." },
    { id: "wt11-40", prompt: "You must yield to a blind pedestrian:", options: ["At all times", "Only at signals", "Only in crosswalks"], correctIndex: 0, explanation: "Always yield to a blind pedestrian." },
  ]),
  ...group("freeway", [
    { id: "wt11-41", prompt: "When entering a freeway, you should:", options: ["Match the speed of traffic and merge into a gap", "Stop and wait at the ramp end", "Merge below traffic speed"], correctIndex: 0, explanation: "Match speed and merge smoothly." },
    { id: "wt11-42", prompt: "To exit a freeway, you should slow down:", options: ["In the exit lane", "In the through lane", "On the shoulder"], correctIndex: 0, explanation: "Decelerate in the exit lane." },
    { id: "wt11-43", prompt: "If you miss your freeway exit, you should:", options: ["Go on to the next exit", "Back up to it", "Stop and reverse"], correctIndex: 0, explanation: "Never back up on a freeway." },
    { id: "wt11-44", prompt: "A safe freeway following distance is at least:", options: ["3 seconds", "1 second", "Half a second"], correctIndex: 0, explanation: "Use at least 3 seconds, more at high speed.", diagramId: "following-distance" },
    { id: "wt11-45", prompt: "You may enter or exit a carpool lane:", options: ["Only where the line is broken", "Anywhere", "By crossing the double line"], correctIndex: 0, explanation: "Cross HOV lines only at dashed sections." },
  ]),
  ...group("railroad", [
    { id: "wt11-46", prompt: "Flashing red lights at a railroad crossing mean:", options: ["Stop and wait", "Slow and cross", "Proceed if no train"], correctIndex: 0, explanation: "Flashing red requires a full stop." },
    { id: "wt11-47", prompt: "Which is true about railroad tracks?", options: ["You should never stop your vehicle on them", "It is fine to stop briefly", "You may park on them"], correctIndex: 0, explanation: "Never stop on the tracks." },
    { id: "wt11-48", prompt: "If your car stalls on the tracks with a train coming, you should:", options: ["Get out and move away from the tracks", "Stay and try to restart it", "Push it off"], correctIndex: 0, explanation: "Leave the vehicle and move clear." },
    { id: "wt11-49", prompt: "Lowered crossing gates mean you should:", options: ["Never drive around them", "Drive around if no train is seen", "Wait 10 seconds then go"], correctIndex: 0, explanation: "Never drive around lowered gates." },
    { id: "wt11-50", prompt: "You should begin crossing tracks only when:", options: ["There is room for your whole vehicle on the other side", "The car ahead moves", "You can beat the train"], correctIndex: 0, explanation: "Cross only if you can clear the tracks completely." },
  ]),
  ...group("emergencies", [
    { id: "wt11-51", prompt: "If your brakes fail, you should:", options: ["Downshift and apply the parking brake gradually", "Turn off the engine", "Steer into oncoming traffic"], correctIndex: 0, explanation: "Use engine braking and the parking brake." },
    { id: "wt11-52", prompt: "If a tire blows out, you should:", options: ["Hold the wheel firmly and ease off the gas", "Brake hard", "Speed up"], correctIndex: 0, explanation: "Keep control and slow gradually." },
    { id: "wt11-53", prompt: "After a collision, the law requires you to:", options: ["Stop and help anyone injured", "Leave if damage seems minor", "Wait for police only"], correctIndex: 0, explanation: "Stop, exchange info, and render aid." },
    { id: "wt11-54", prompt: "The Move Over law requires you to:", options: ["Move over a lane if safe, or slow down, for stopped emergency vehicles", "Maintain speed in the same lane", "Speed past quickly"], correctIndex: 0, explanation: "Move over or slow down for roadside responders." },
    { id: "wt11-55", prompt: "If you damage a parked car and can't find the owner, you should:", options: ["Leave a note with your contact information", "Drive away", "Wait only for major damage"], correctIndex: 0, explanation: "Leave your information for property you damage." },
  ]),
  ...group("distracted", [
    { id: "wt11-56", prompt: "Which statement about handheld phones is true?", options: ["Holding a phone while driving is illegal", "It is legal at red lights", "It is legal if held low"], correctIndex: 0, explanation: "Adults may use phones hands-free only." },
    { id: "wt11-57", prompt: "Drivers under 18 may use a cell phone while driving:", options: ["Not at all", "Hands-free only", "For texting"], correctIndex: 0, explanation: "Under-18 drivers may not use a phone at all." },
    { id: "wt11-58", prompt: "Sending or reading text messages while driving is:", options: ["Illegal for all drivers", "Legal when stopped in traffic", "Legal for adults"], correctIndex: 0, explanation: "Texting is illegal for everyone." },
    { id: "wt11-59", prompt: "Which of these is a driving distraction?", options: ["Eating, grooming, or adjusting controls", "Checking mirrors", "Watching the road"], correctIndex: 0, explanation: "Anything that takes attention from driving is a distraction." },
    { id: "wt11-60", prompt: "If you become drowsy while driving, you should:", options: ["Pull over and rest", "Drive faster", "Open the window and keep going"], correctIndex: 0, explanation: "Stop and rest when drowsy." },
  ]),
  ...group("vehicle-equipment", [
    { id: "wt11-61", prompt: "Headlights are required:", options: ["From 30 minutes after sunset to 30 minutes before sunrise", "Only after midnight", "Only in rain"], correctIndex: 0, explanation: "Use headlights during the dark hours and low visibility." },
    { id: "wt11-62", prompt: "You must dim your high beams within:", options: ["500 feet of an oncoming vehicle", "100 feet always", "Only in cities"], correctIndex: 0, explanation: "Dim within 500 ft oncoming and 300 ft following." },
    { id: "wt11-63", prompt: "In fog or heavy rain you should use:", options: ["Low-beam headlights", "High beams", "Parking lights"], correctIndex: 0, explanation: "Low beams reduce glare in fog and rain." },
    { id: "wt11-64", prompt: "Which statement about bald tires is true?", options: ["They reduce traction and stopping ability", "They grip better in rain", "They are fine if inflated"], correctIndex: 0, explanation: "Worn tires lose traction." },
    { id: "wt11-65", prompt: "Your rear-view mirror must give a view of the road behind for at least:", options: ["200 feet", "20 feet", "1 mile"], correctIndex: 0, explanation: "A mirror must show at least 200 feet to the rear." },
  ]),
  ...group("insurance", [
    { id: "wt11-66", prompt: "What are California's minimum required liability insurance limits?", options: ["$30,000 / $60,000 / $15,000", "$15,000 / $30,000 / $5,000", "$5,000 / $10,000 / $5,000"], correctIndex: 0, explanation: "Minimums are $30k/$60k/$15k (2025)." },
    { id: "wt11-67", prompt: "Which statement about proof of insurance is true?", options: ["You must carry it and show it when requested", "You only need it once a year", "It is optional"], correctIndex: 0, explanation: "Carry proof and present it on request." },
    { id: "wt11-68", prompt: "Driving without required insurance can result in:", options: ["Suspension of your license and registration", "A reward", "Lower fees"], correctIndex: 0, explanation: "Uninsured driving risks suspension." },
    { id: "wt11-69", prompt: "You must file an SR-1 with DMV after a qualifying crash within:", options: ["10 days", "30 days", "1 year"], correctIndex: 0, explanation: "Report within 10 days." },
    { id: "wt11-70", prompt: "Liability insurance pays for:", options: ["Injury or damage you cause to others", "All repairs to your own car", "Nothing"], correctIndex: 0, explanation: "Liability covers others' losses you cause." },
  ]),
  ...group("weather", [
    { id: "wt11-71", prompt: "A road is usually most slippery:", options: ["Just after it begins to rain", "After hours of rain", "Only when frozen"], correctIndex: 0, explanation: "Oil and water mix when rain starts." },
    { id: "wt11-72", prompt: "If your vehicle hydroplanes, you should:", options: ["Ease off the gas and avoid hard braking", "Brake firmly", "Accelerate"], correctIndex: 0, explanation: "Ease off and steer straight until traction returns." },
    { id: "wt11-73", prompt: "If your car begins to skid, you should:", options: ["Steer in the direction you want to go", "Brake hard and hold the wheel", "Steer opposite the skid"], correctIndex: 0, explanation: "Steer where you want to go." },
    { id: "wt11-74", prompt: "At night, you should drive slowly enough to:", options: ["Stop within the distance lit by your headlights", "Keep up with the fastest car", "Save time"], correctIndex: 0, explanation: "Don't overdrive your headlights." },
    { id: "wt11-75", prompt: "In heavy rain, your following distance should be:", options: ["Increased beyond 3 seconds", "Reduced", "One car length"], correctIndex: 0, explanation: "Add space in the rain." },
  ]),
  ...group("licensing-misc", [
    { id: "wt11-76", prompt: "You must report an address change to DMV within:", options: ["10 days", "30 days", "60 days"], correctIndex: 0, explanation: "Report within 10 days." },
    { id: "wt11-77", prompt: "A traffic signal that is completely dark should be treated as:", options: ["A four-way stop", "A green light", "A yield"], correctIndex: 0, explanation: "Treat a dark signal as an all-way stop." },
    { id: "wt11-78", prompt: "Turning right on a red light is:", options: ["Allowed after a complete stop, unless a sign prohibits it", "Never allowed", "Allowed without stopping"], correctIndex: 0, explanation: "Right on red is allowed after stopping unless posted otherwise." },
    { id: "wt11-79", prompt: "At a stop sign with a limit line, you must:", options: ["Stop completely behind the limit line", "Roll through slowly", "Stop only if cars are coming"], correctIndex: 0, explanation: "Make a full stop behind the limit line." },
    { id: "wt11-80", prompt: "Which statement about your driver license is true?", options: ["You must carry it whenever you drive", "It can stay at home", "Only new drivers must carry it"], correctIndex: 0, explanation: "Always carry your license while driving." },
  ]),
];

export const SCENARIO11_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
