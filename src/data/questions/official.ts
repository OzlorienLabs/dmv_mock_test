import type { CategoryId, Question } from "@/lib/types";

/**
 * VERBATIM questions from the official California DMV sample Class C knowledge
 * tests (public government materials). Tagged `origin: "official_dmv"` with a
 * link to the exact source test. Wording and answer options are transcribed
 * as published; short explanations are our own study aid.
 *
 * Source index:
 *   https://www.dmv.ca.gov/portal/driver-education-and-safety/educational-materials/sample-driver-license-dl-knowledge-tests/
 */

const BASE =
  "https://www.dmv.ca.gov/portal/driver-education-and-safety/educational-materials/sample-driver-license-dl-knowledge-tests";

const TESTS = {
  t1: { name: "Official DMV sample test 1", url: `${BASE}/sample-class-c-drivers-written-test-1/` },
  t2: { name: "Official DMV sample test 2", url: `${BASE}/sample-class-c-written-test-2/` },
  t3: { name: "Official DMV sample test 3", url: `${BASE}/sample-class-c-drivers-written-test-3/` },
  t4: { name: "Official DMV sample test 4", url: `${BASE}/sample-class-c-written-test-4/` },
} as const;

type OfficialSeed = Pick<
  Question,
  "id" | "category" | "prompt" | "options" | "correctIndex"
> &
  Partial<Pick<Question, "explanation" | "diagramId">> & { test: keyof typeof TESTS };

const seeds: OfficialSeed[] = [
  // ---- Test 1 ----
  {
    test: "t1",
    id: "dmv-t1-1",
    category: "lanes-passing",
    prompt: "When is it legal to drive off the road to pass another vehicle?",
    options: [
      "If the vehicle ahead is turning left",
      "It is not legal under any conditions",
      "If there are two or more one-way lanes",
    ],
    correctIndex: 1,
    explanation: "You may never drive off the paved or main-traveled part of the road to pass.",
  },
  {
    test: "t1",
    id: "dmv-t1-2",
    category: "railroad",
    prompt:
      "When a railroad crossing is not controlled, what is the speed limit when you are within 100 feet and cannot see for 400 feet in both directions?",
    options: ["15 mph", "10 mph", "25 mph"],
    correctIndex: 0,
    explanation: "15 mph applies near an uncontrolled crossing with limited visibility.",
    diagramId: "railroad-crossing",
  },
  {
    test: "t1",
    id: "dmv-t1-3",
    category: "parking",
    prompt: "Which of the following is the proper procedure for parallel parking?",
    options: [
      "Drive forward into the space without stopping",
      "Stop next to the vehicle behind the open space, and then drive forward into the space",
      "Stop next to the vehicle in front of the open space, and then back into the space",
    ],
    correctIndex: 2,
    explanation: "Pull alongside the car ahead of the space, then back in.",
  },
  {
    test: "t1",
    id: "dmv-t1-4",
    category: "freeway",
    prompt: "What speed should you be driving when entering onto a highway?",
    options: [
      "At or near the speed of traffic",
      "Faster than the speed of traffic",
      "Slower than the speed of traffic",
    ],
    correctIndex: 0,
    explanation: "Match the speed of highway traffic so you can merge smoothly.",
    diagramId: "freeway-merge",
  },
  {
    test: "t1",
    id: "dmv-t1-5",
    category: "vehicle-equipment",
    prompt:
      "How many feet away should you switch from high beam to low beam headlights when approaching a vehicle coming towards you?",
    options: ["900 feet", "700 feet", "500 feet"],
    correctIndex: 2,
    explanation: "Dim your high beams within 500 feet of an oncoming vehicle.",
  },
  {
    test: "t1",
    id: "dmv-t1-6",
    category: "parking",
    prompt: "Who can legally park next to curb painted blue?",
    options: [
      "Someone picking up or dropping off passengers",
      "A disabled person with special placard or plate",
      "A person parked for less than 15 minutes",
    ],
    correctIndex: 1,
    explanation: "Blue curbs are reserved for disabled-person placards or plates.",
    diagramId: "curb-colors",
  },
  {
    test: "t1",
    id: "dmv-t1-7",
    category: "sharing-road",
    prompt:
      "What should you do when there is a school bus ahead that starts flashing yellow warning lights?",
    options: [
      "Slow down and prepare to stop",
      "Stop immediately and remain stopped",
      "Cautiously pass the school bus on the left",
    ],
    correctIndex: 0,
    explanation: "Flashing yellow lights mean the bus is about to stop; prepare to stop.",
    diagramId: "school-bus",
  },
  {
    test: "t1",
    id: "dmv-t1-8",
    category: "speed-limits",
    prompt: "Which of the following is a requirement of California's Basic Speed Law?",
    options: [
      "Always drive the speed limit, regardless of conditions",
      "Match your speed to that of your surrounding traffic",
      "Never drive faster than is safe for current conditions",
    ],
    correctIndex: 2,
    explanation: "The Basic Speed Law forbids driving faster than is safe for conditions.",
  },
  {
    test: "t1",
    id: "dmv-t1-9",
    category: "licensing-misc",
    prompt: "You must notify the DMV within 5 days, if you:",
    options: [
      "Paint your vehicle a different color",
      "Sell or transfer ownership of your vehicle",
      "Receive a traffic violation",
    ],
    correctIndex: 1,
    explanation: "Notify DMV within 5 days when you sell or transfer your vehicle.",
  },
  {
    test: "t1",
    id: "dmv-t1-10",
    category: "distracted",
    prompt: "Which of the following is an example of a safe driving practice?",
    options: [
      "Staring only at the middle of the road",
      "Always keep your eyes moving to scan the surroundings",
      "Using your high-beam headlights in the fog",
    ],
    correctIndex: 1,
    explanation: "Keep scanning the whole scene rather than fixating on one point.",
  },

  // ---- Test 2 ----
  {
    test: "t2",
    id: "dmv-t2-1",
    category: "sharing-road",
    prompt:
      "What should you do when reaching an intersection where a person operating a motorized wheelchair has entered the crosswalk?",
    options: [
      "Remain stopped behind the crosswalk line until the motorized wheelchair has safely finished crossing.",
      "Remain stopped behind the nearest crosswalk line until the motorized wheelchair is beyond the range of your vehicle.",
      "Assume right-of-way if the motorized wheelchair stops in the crosswalk.",
    ],
    correctIndex: 0,
    explanation: "Wait until the person has safely finished crossing.",
  },
  {
    test: "t2",
    id: "dmv-t2-2",
    category: "sharing-road",
    prompt: "Which of the following is true about large trucks?",
    options: [
      "They are made of many trailers, which make them more maneuverable than passenger vehicles.",
      "They have large blind spots, which makes it difficult for the truck driver to see other vehicles.",
      "They have large and powerful emergency brakes, which gives them the capability to stop quickly.",
    ],
    correctIndex: 1,
    explanation: "Large trucks have big blind spots and need more room to stop.",
  },
  {
    test: "t2",
    id: "dmv-t2-3",
    category: "distracted",
    prompt: "What is one of the most common causes of traffic collisions?",
    options: ["Paying attention to your surroundings.", "Better traffic flow.", "Driver distractions."],
    correctIndex: 2,
    explanation: "Driver distraction is a leading cause of collisions.",
  },
  {
    test: "t2",
    id: "dmv-t2-4",
    category: "licensing-misc",
    prompt:
      "Any driver who willfully flees or attempts to evade law enforcement, during which a person is seriously injured, is subject to:",
    options: [
      "Imprisonment in a state prison for up to seven years.",
      "A fine of less than $1,000.",
      "Attending an anger-management class.",
    ],
    correctIndex: 0,
    explanation: "Fleeing police causing serious injury can mean up to seven years in state prison.",
  },
  {
    test: "t2",
    id: "dmv-t2-5",
    category: "right-of-way",
    prompt: "What should a driver do who is stopped at an intersection and wants to make a left turn?",
    options: [
      "Turn immediately if there are no pedestrians.",
      "Take the right-of-way turn before oncoming traffic.",
      "Give the right-of-way to any approaching vehicle that is close enough to be dangerous.",
    ],
    correctIndex: 2,
    explanation: "A left-turning driver must yield to oncoming traffic that is close enough to be a hazard.",
  },
  {
    test: "t2",
    id: "dmv-t2-6",
    category: "parking",
    prompt: "In addition to setting your parking brake, what should you do when parking on a hill?",
    options: [
      'Make sure the front vehicle wheels are parallel to the road.',
      'Make sure your vehicle is left in the "neutral" position.',
      'Make sure your vehicle is in the "park" position or in gear.',
    ],
    correctIndex: 2,
    explanation: "Leave the vehicle in park (or in gear for a manual) in addition to the parking brake.",
    diagramId: "curb-parking",
  },
  {
    test: "t2",
    id: "dmv-t2-7",
    category: "licensing-misc",
    prompt:
      "You are under 18 years of age and have had your license for eight months. You may drive:",
    options: ["At any time.", "Between 5 a.m. and 11 p.m.", "Between 7 a.m. and 8 p.m."],
    correctIndex: 1,
    explanation: "During the first 12 months, provisional drivers may not drive between 11 p.m. and 5 a.m. (with exceptions).",
  },
  {
    test: "t2",
    id: "dmv-t2-8",
    category: "lanes-passing",
    prompt: "Where should you begin a left turn from a one-way street onto a one-way street?",
    options: ["The lane closest to the center of the street.", "The far-left lane.", "You can turn from any lane."],
    correctIndex: 1,
    explanation: "From a one-way street, start a left turn from the far-left lane.",
  },
  {
    test: "t2",
    id: "dmv-t2-9",
    category: "insurance",
    prompt:
      "You are required to notify DMV by filing a Report of Traffic Accident Occurring in California (SR-1) form if:",
    options: [
      "You allowed a licensed driver from another state to drive your vehicle.",
      "You were involved in a collision with more than $1,000 in damages.",
      "You failed to pay your registration fees.",
    ],
    correctIndex: 1,
    explanation: "An SR-1 is required for collisions causing injury, death, or property damage over $1,000.",
  },
  {
    test: "t2",
    id: "dmv-t2-10",
    category: "weather",
    prompt: "At what point during a rainfall are roads slippery on a hot day?",
    options: [
      "Immediately after it has stopped raining.",
      "For the first several minutes.",
      "When it has been raining for a few hours.",
    ],
    correctIndex: 1,
    explanation: "Roads are most slippery during the first several minutes as rain mixes with oil.",
  },

  // ---- Test 3 ----
  {
    test: "t3",
    id: "dmv-t3-1",
    category: "parking",
    prompt: "What color curb does not allow vehicles to stop or park?",
    options: ["Yellow", "Red", "White"],
    correctIndex: 1,
    explanation: "Red curbs mean no stopping or parking at any time.",
    diagramId: "curb-colors",
  },
  {
    test: "t3",
    id: "dmv-t3-2",
    category: "insurance",
    prompt:
      "You are required to notify DMV by filing a Report of Traffic Accident Occurring in California (SR-1) form if:",
    options: [
      "You change your insurance company",
      "You were involved in a collision with an injury",
      "Your vehicle fails a smog test",
    ],
    correctIndex: 1,
    explanation: "File an SR-1 for any collision involving an injury (or death, or over $1,000 damage).",
  },
  {
    test: "t3",
    id: "dmv-t3-3",
    category: "lanes-passing",
    prompt: "What is indicated by two sets of double yellow lines spaced 2 feet or more apart?",
    options: [
      "Lanes of traffic moving in the same direction",
      "Barrier",
      "Carpool/High-Occupancy (HOV) lane",
    ],
    correctIndex: 1,
    explanation: "Two sets of double yellow lines 2 feet apart act as a barrier you must not cross.",
  },
  {
    test: "t3",
    id: "dmv-t3-4",
    category: "sharing-road",
    prompt: "What should you do to make a right turn at an upcoming intersection?",
    options: [
      "Merge into the bicycle lane before making the turn",
      "Wait until the bicycle lane ends, then make the turn",
      "Make the turn from your current lane and do not enter the bicycle lane",
    ],
    correctIndex: 2,
    explanation: "Turn from your lane without driving in the bike lane (check for cyclists first).",
  },
  {
    test: "t3",
    id: "dmv-t3-5",
    category: "speed-limits",
    prompt: "A highway has a posted speed limit of 65 mph. What does this mean?",
    options: [
      "You must always drive 65 mph on that highway",
      "You may drive faster only if there are no other vehicles",
      "You must drive 65 mph only if driving conditions are ideal",
    ],
    correctIndex: 2,
    explanation: "A posted limit is the maximum for ideal conditions; slow down when conditions are poor.",
  },
  {
    test: "t3",
    id: "dmv-t3-6",
    category: "parking",
    prompt: "When is parking in a crosshatched (diagonal lines) area allowed?",
    options: [
      "It is never allowed to park in a crosshatched area",
      "If the area is at least twenty feet away from a railroad track",
      "If the area is labeled as a bicycle lane, unless otherwise posted",
    ],
    correctIndex: 0,
    explanation: "Crosshatched areas are never available for parking.",
  },
  {
    test: "t3",
    id: "dmv-t3-7",
    category: "distracted",
    prompt: "What should you do if your cell phone rings and you do not have a hands-free device?",
    options: [
      "Answer the call and keep the conversation short",
      "Do not answer the phone and let it go to voice mail",
      "Answer the call if you are stopped at a red light",
    ],
    correctIndex: 1,
    explanation: "Let it go to voicemail; holding a phone while driving is illegal.",
  },
  {
    test: "t3",
    id: "dmv-t3-8",
    category: "right-of-way",
    prompt: "If a traffic signal is green, but traffic is blocking the intersection, what should you do?",
    options: [
      "Partially enter the intersection, as allowed by traffic",
      "Wait and do not enter the intersection until your vehicle can get completely across",
      "Drive around the traffic on the shoulder to help ease the congestion",
    ],
    correctIndex: 1,
    explanation: "Don't enter an intersection unless you can clear it completely.",
  },
  {
    test: "t3",
    id: "dmv-t3-9",
    category: "lanes-passing",
    prompt: "In which lane should you end your turn when making a right turn?",
    options: [
      "Any lane free of traffic",
      "The lane closest to the left edge of the road",
      "The lane closest to the right edge of the road",
    ],
    correctIndex: 2,
    explanation: "End a right turn in the lane nearest the right edge of the road.",
  },
  {
    test: "t3",
    id: "dmv-t3-10",
    category: "sharing-road",
    prompt: "When is it required for you to obey directions from a crossing guard?",
    options: [
      "At all times",
      "During school hours only",
      "Only when children are present in front of a school",
    ],
    correctIndex: 0,
    explanation: "You must obey a crossing guard's directions at all times.",
  },

  // ---- Test 4 (duplicates of earlier prompts omitted) ----
  {
    test: "t4",
    id: "dmv-t4-2",
    category: "distracted",
    prompt: "Which of the following is illegal while driving?",
    options: [
      "Wearing a headset or ear plugs that covers both ears.",
      "Wearing a headset or ear plugs that covers one ear.",
      "Using cruise control on residential streets.",
    ],
    correctIndex: 0,
    explanation: "It is illegal to wear headphones or earplugs covering both ears while driving.",
  },
  {
    test: "t4",
    id: "dmv-t4-3",
    category: "railroad",
    prompt:
      "What should you do when traffic is slow and heavy, and you must cross railroad tracks before reaching the upcoming intersection?",
    options: [
      "Begin crossing when the vehicle in front of you is crossing the tracks.",
      "Wait on the tracks until the stoplight at the intersection turns green.",
      "Wait until you can completely cross the tracks before proceeding.",
    ],
    correctIndex: 2,
    explanation: "Never stop on the tracks; wait until you can fully clear them.",
  },
  {
    test: "t4",
    id: "dmv-t4-4",
    category: "lanes-passing",
    prompt: "Which of the following should you do if you are being followed by a tailgater?",
    options: [
      "Change lanes and allow the tailgater to pass.",
      "Tap the brakes to signal you are moving at a slower pace.",
      "Increase your speed to match the speed of the vehicle.",
    ],
    correctIndex: 0,
    explanation: "Let a tailgater pass by changing lanes when it is safe.",
  },
  {
    test: "t4",
    id: "dmv-t4-5",
    category: "speed-limits",
    prompt: "When you are driving the speed limit, you can be given a speeding ticket:",
    options: [
      "If road or weather conditions require a slower speed.",
      "Under no circumstances because it is always legal.",
      "Only if you are approaching a sharp curve in the road.",
    ],
    correctIndex: 0,
    explanation: "Driving too fast for conditions is illegal even at the posted limit (Basic Speed Law).",
  },
  {
    test: "t4",
    id: "dmv-t4-6",
    category: "weather",
    prompt:
      "Which lights should be used if a driver is having trouble seeing other vehicles because of dust or smoke blowing across the roadway?",
    options: ["Parking lights.", "Emergency lights.", "Headlights."],
    correctIndex: 2,
    explanation: "Turn on your headlights to see and be seen in dust or smoke.",
  },
  {
    test: "t4",
    id: "dmv-t4-8",
    category: "signs-signals",
    prompt: "What does a flashing yellow traffic signal light direct a driver to do?",
    options: [
      "Stop and proceed when the traffic allows you to proceed safely.",
      "Slow down and proceed with caution.",
      "Stop and wait for a flashing green signal.",
    ],
    correctIndex: 1,
    explanation: "A flashing yellow light means slow down and proceed with caution.",
  },
  {
    test: "t4",
    id: "dmv-t4-9",
    category: "sharing-road",
    prompt:
      "What should you do if a pedestrian is still in the crosswalk after the “DON'T WALK” sign begins to flash and your light has turned green?",
    options: [
      "Wait until the pedestrian is out of your path before proceeding.",
      "Wait until the pedestrian signals that it is okay for you to proceed.",
      "Wait until the pedestrian has crossed the street completely before proceeding.",
    ],
    correctIndex: 2,
    explanation: "Let the pedestrian finish crossing completely before you proceed.",
  },
  {
    test: "t4",
    id: "dmv-t4-10",
    category: "dui-alcohol",
    prompt: "When is it legal for a person to drive with an alcoholic beverage container that has been opened?",
    options: [
      "If the container is under the front seat.",
      "If the container is in the trunk of the vehicle.",
      "If the container is in the glove compartment.",
    ],
    correctIndex: 1,
    explanation: "An opened container must be kept in the trunk, away from the passenger area.",
  },
];

export const OFFICIAL_QUESTIONS: Question[] = seeds.map(({ test, ...q }) => ({
  origin: "official_dmv" as const,
  sourceName: TESTS[test].name,
  sourceUrl: TESTS[test].url,
  ...q,
}));
