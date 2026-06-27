import type { CategoryId, Question } from "@/lib/types";

/**
 * Sixth batch of authored scenario questions (origin: generated), grounded in
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
  ...group("dui-alcohol", [
    { id: "dui6-1", prompt: "A passenger drinking from an open alcoholic beverage in a moving car is:", options: ["Illegal", "Legal if the driver is sober", "Legal in the back seat"], correctIndex: 0, explanation: "Open containers are illegal in the passenger area, even for passengers." },
    { id: "dui6-2", prompt: "If you let someone who is impaired drive your vehicle, you:", options: ["Can be held responsible for what happens", "Have no responsibility", "Are protected by law"], correctIndex: 0, explanation: "You can be liable for letting an impaired person drive your car." },
    { id: "dui6-3", prompt: "Drinking coffee or an energy drink after alcohol will:", options: ["Not lower your blood alcohol level", "Make you sober", "Reverse the effects"], correctIndex: 0, explanation: "Only time reduces blood alcohol; caffeine does not." },
    { id: "dui6-4", prompt: "The more alcohol you drink, the:", options: ["More your driving ability is impaired", "Better you concentrate", "Quicker your reactions"], correctIndex: 0, explanation: "Impairment increases with the amount of alcohol consumed." },
    { id: "dui6-5", prompt: "It is illegal to drive while impaired by:", options: ["Any drug, whether legal or illegal", "Only illegal drugs", "Only alcohol"], correctIndex: 0, explanation: "Driving impaired by any substance is illegal." },
  ]),

  ...group("restraints", [
    { id: "res6-1", prompt: "You should replace a child car seat:", options: ["After a moderate or severe crash", "Only when it looks dirty", "Never"], correctIndex: 0, explanation: "Crash forces can weaken a car seat; replace it after a significant crash." },
    { id: "res6-2", prompt: "Holding a baby in your arms while riding in a car is:", options: ["Very dangerous and not allowed", "Safe at low speeds", "Better than a car seat"], correctIndex: 0, explanation: "An infant must be in an approved car seat, never held." },
    { id: "res6-3", prompt: "A child's car-seat harness straps should be:", options: ["Snug, with no slack", "Loose for comfort", "Removed on short trips"], correctIndex: 0, explanation: "Harness straps must be snug to protect the child." },
    { id: "res6-4", prompt: "Children should stay in each type of restraint:", options: ["Until they outgrow its height or weight limit", "Only until their next birthday", "Just for the first month"], correctIndex: 0, explanation: "Keep a child in each stage until they reach its limits." },
    { id: "res6-5", prompt: "The lap portion of a seat belt should rest:", options: ["Low and snug across the hips", "Across the soft belly", "Across the chest only"], correctIndex: 0, explanation: "The lap belt belongs low across the hips, not the abdomen." },
  ]),

  ...group("railroad", [
    { id: "rr6-1", prompt: "A crossbuck sign at a railroad crossing means:", options: ["Yield to any train", "Stop and park", "The crossing is closed"], correctIndex: 0, explanation: "A crossbuck means yield; a train always has the right-of-way." },
    { id: "rr6-2", prompt: "When you must stop for a train, you should stop:", options: ["Between 15 and 50 feet from the nearest rail", "On the tracks", "Right against the rail"], correctIndex: 0, explanation: "Stop 15–50 feet from the nearest rail." },
    { id: "rr6-3", prompt: "If a flagger is directing traffic at a railroad crossing, you must:", options: ["Obey the flagger's directions", "Ignore them if you see no train", "Proceed at your own pace"], correctIndex: 0, explanation: "Always obey a railroad flagger." },
    { id: "rr6-4", prompt: "If traffic is backed up beyond a railroad crossing, you should:", options: ["Wait on your side until there is room to fully clear the tracks", "Stop on the tracks and wait", "Cross and stop between the rails"], correctIndex: 0, explanation: "Never stop on tracks; wait until you can clear them." },
  ]),

  ...group("insurance", [
    { id: "ins6-1", prompt: "California's minimum bodily injury liability coverage per person is:", options: ["$30,000", "$5,000", "$100,000"], correctIndex: 0, explanation: "The minimum is $30,000 per person (as of 2025)." },
    { id: "ins6-2", prompt: "California's minimum property damage liability coverage is:", options: ["$15,000", "$5,000", "$1,000"], correctIndex: 0, explanation: "The minimum property damage coverage is $15,000 (as of 2025)." },
    { id: "ins6-3", prompt: "Driving without the required insurance can lead to:", options: ["Suspension and possible impound of your vehicle", "A discount", "Extra driving privileges"], correctIndex: 0, explanation: "Uninsured driving risks suspension and impound." },
    { id: "ins6-4", prompt: "Besides buying insurance, you can meet financial responsibility with:", options: ["A surety bond or DMV cash deposit", "A driver license only", "A clean record"], correctIndex: 0, explanation: "A bond or cash deposit with DMV is an alternative." },
  ]),

  ...group("emergencies", [
    { id: "emg6-1", prompt: "If your gas pedal sticks while driving, you should:", options: ["Shift to neutral and brake to a safe stop", "Turn off the engine at speed", "Pump the gas pedal"], correctIndex: 0, explanation: "Neutral disconnects power; then brake and pull over." },
    { id: "emg6-2", prompt: "If a front tire blows out, your vehicle may:", options: ["Pull toward the side of the blowout; hold the wheel firmly", "Stop instantly", "Speed up"], correctIndex: 0, explanation: "Grip the wheel and ease off the gas after a blowout." },
    { id: "emg6-3", prompt: "If your vehicle plunges into deep water, you should:", options: ["Get out through a window before it sinks", "Wait for it to fill with water", "Try to drive out"], correctIndex: 0, explanation: "Escape quickly through a window while you can." },
    { id: "emg6-4", prompt: "If your engine stalls while driving, be aware that:", options: ["Steering and braking become much harder", "Nothing changes", "The car will stop immediately"], correctIndex: 0, explanation: "Power steering and brakes lose assist; steer firmly to the side." },
    { id: "emg6-5", prompt: "At a crash where someone is seriously injured, you should:", options: ["Call 911 and avoid moving them unless there is danger", "Move them right away", "Leave the scene"], correctIndex: 0, explanation: "Call for help; move the injured only to avoid further harm." },
  ]),

  ...group("licensing-misc", [
    { id: "lic6-1", prompt: "To practice driving with an instruction permit, you must be accompanied by:", options: ["A licensed driver 25 or older", "Any licensed driver", "No one"], correctIndex: 0, explanation: "A permit requires a supervising driver 25 or older." },
    { id: "lic6-2", prompt: "Driving without a valid driver license is:", options: ["Illegal", "Allowed near home", "Allowed for short trips"], correctIndex: 0, explanation: "You must have a valid license to drive." },
    { id: "lic6-3", prompt: "If a medical condition begins to affect your driving, you should:", options: ["Report it and consult your doctor and DMV", "Keep it secret", "Drive only at night"], correctIndex: 0, explanation: "Conditions that affect driving should be reported." },
    { id: "lic6-4", prompt: "If your license is suspended and you are ordered to surrender it, you must:", options: ["Give it up as required", "Keep driving", "Make a copy first"], correctIndex: 0, explanation: "Comply with a suspension order and surrender the license." },
  ]),

  ...group("distracted", [
    { id: "dst6-1", prompt: "Applying makeup or shaving while driving is:", options: ["A dangerous distraction", "An efficient use of time", "Required grooming"], correctIndex: 0, explanation: "Grooming takes your attention off the road." },
    { id: "dst6-2", prompt: "Even a brief glance at your phone at highway speed:", options: ["Can lead to a serious crash", "Is completely safe", "Improves navigation"], correctIndex: 0, explanation: "A two-second glance covers a long distance blind." },
    { id: "dst6-3", prompt: "If you must read a message or make a call, you should:", options: ["Pull over to a safe place first", "Do it at a red light", "Hold the phone low"], correctIndex: 0, explanation: "Stop safely before using your phone." },
  ]),

  ...group("vehicle-equipment", [
    { id: "veq6-1", prompt: "Your vehicle's horn must:", options: ["Be in good working order", "Play a custom song", "Be disconnected"], correctIndex: 0, explanation: "A working horn is required equipment." },
    { id: "veq6-2", prompt: "Excessively dark window tint on the windshield is:", options: ["Illegal because it limits visibility", "Recommended", "Required"], correctIndex: 0, explanation: "Tint that blocks the driver's view is illegal." },
    { id: "veq6-3", prompt: "A loud or missing muffler is:", options: ["A violation; the exhaust must limit noise", "Allowed on any car", "Good for performance"], correctIndex: 0, explanation: "Vehicles must have a proper muffler." },
    { id: "veq6-4", prompt: "Before a long trip, you should check:", options: ["Tires, lights, brakes, and fluids", "Only the radio", "Nothing"], correctIndex: 0, explanation: "Inspect key systems before a long drive." },
  ]),

  ...group("weather", [
    { id: "wea6-1", prompt: "To clear fog from the inside of your windshield, use the:", options: ["Defroster or air conditioner", "Windshield wipers", "High beams"], correctIndex: 0, explanation: "The defroster clears interior condensation." },
    { id: "wea6-2", prompt: "When you see standing water on the road, you should:", options: ["Slow down to avoid hydroplaning", "Drive through it fast", "Brake hard in the water"], correctIndex: 0, explanation: "Reduce speed to keep your tires in contact with the road." },
    { id: "wea6-3", prompt: "Behind a snowplow or sander, you should:", options: ["Stay well back and allow extra distance", "Pass immediately", "Follow closely"], correctIndex: 0, explanation: "Keep extra distance; the road behind is being treated." },
  ]),

  ...group("right-of-way", [
    { id: "row6-1", prompt: "At a two-way stop, the driver facing the stop sign must:", options: ["Yield to traffic on the road without stop signs", "Go first", "Expect cross traffic to stop"], correctIndex: 0, explanation: "Traffic on the through road has the right-of-way." },
    { id: "row6-2", prompt: "When turning left into a driveway across oncoming traffic, you must yield to:", options: ["Oncoming vehicles and any pedestrians", "No one", "Only large vehicles"], correctIndex: 0, explanation: "Yield to oncoming traffic and pedestrians before crossing." },
    { id: "row6-3", prompt: "When a streetcar or light-rail vehicle is stopped to let passengers on or off, you should:", options: ["Stop behind it and not pass on the boarding side", "Pass quickly", "Honk to hurry it"], correctIndex: 0, explanation: "Do not pass a stopped transit vehicle where people board." },
    { id: "row6-4", prompt: "At an intersection where you and another car arrive about the same time and it is on your right, you should:", options: ["Yield to the car on your right", "Take the right-of-way", "Wait for a signal"], correctIndex: 0, explanation: "Yield to the vehicle on your right when arrival is simultaneous." },
  ]),

  ...group("parking", [
    { id: "prk6-1", prompt: "You may not park in front of:", options: ["A driveway or a fire station entrance", "A retail store", "A public park"], correctIndex: 0, explanation: "Never block driveways or fire station entrances." },
    { id: "prk6-2", prompt: "Parking so that you block a wheelchair access ramp is:", options: ["Illegal", "Allowed briefly", "Allowed at night"], correctIndex: 0, explanation: "Keep curb ramps clear for wheelchair access." },
    { id: "prk6-3", prompt: "When using angle (diagonal) parking, you should:", options: ["Enter slowly and watch for pedestrians and cars", "Swing in quickly", "Back in at speed"], correctIndex: 0, explanation: "Pull into angle parking slowly and carefully." },
  ]),

  ...group("sharing-road", [
    { id: "shr6-1", prompt: "When the lane is too narrow to share with a bicyclist, you should:", options: ["Wait and change lanes to pass when it is safe", "Squeeze by closely", "Honk and push past"], correctIndex: 0, explanation: "Change lanes to pass a cyclist with at least 3 feet of space." },
    { id: "shr6-2", prompt: "Near workers at the roadside, you should:", options: ["Slow down and give them extra room", "Maintain your speed", "Move closer to watch"], correctIndex: 0, explanation: "Give roadside workers space and slow down." },
  ]),
];

export const SCENARIO6_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
