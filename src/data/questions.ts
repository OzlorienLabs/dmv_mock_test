import type { CategoryId, Question } from "@/lib/types";

/**
 * Phase 1 seed question bank.
 *
 * Every item is an ORIGINAL practice question grounded in well-established
 * California driving rules from the official Driver Handbook. They are tagged
 * `origin: "generated"` and badged as practice questions in the UI. In Phase 2
 * we harvest real verbatim questions from the official DMV sample tests and tag
 * them `origin: "official_dmv"` with a source link (see implementation plan).
 *
 * Facts (especially recent law changes) must be re-verified against the live
 * handbook before any item is promoted to `published`.
 */

const HANDBOOK_URL =
  "https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/";

type Seed = Pick<
  Question,
  "id" | "category" | "prompt" | "options" | "correctIndex"
> &
  Partial<Pick<Question, "explanation" | "diagramId" | "handbookRef" | "subtopic">>;

function group(category: CategoryId, items: Omit<Seed, "category">[]): Seed[] {
  return items.map((it) => ({ ...it, category }));
}

const seeds: Seed[] = [
  ...group("right-of-way", [
    {
      id: "row-1",
      prompt:
        "At a four-way stop, two cars reach the intersection at the same time. Who should go first?",
      options: ["The car on your left", "The car on your right", "The car going straight"],
      correctIndex: 1,
      explanation:
        "When two vehicles arrive at the same time, the driver on the left yields to the driver on the right.",
      diagramId: "four-way-stop",
    },
    {
      id: "row-2",
      prompt: "When turning left at an intersection, you must:",
      options: [
        "Yield to oncoming traffic and pedestrians",
        "Proceed first because you are turning",
        "Go whenever you signal first",
      ],
      correctIndex: 0,
      explanation:
        "A left-turning driver must yield to oncoming vehicles and to pedestrians in the crosswalk.",
    },
    {
      id: "row-3",
      prompt:
        "A pedestrian is crossing at a corner that has no painted crosswalk lines. You should:",
      options: [
        "Yield — crosswalks exist at intersections even without painted lines",
        "Continue, because there is no marked crosswalk",
        "Honk and drive around them",
      ],
      correctIndex: 0,
      explanation:
        "Unmarked crosswalks exist at most intersections. You must yield to pedestrians crossing there.",
    },
    {
      id: "row-4",
      prompt: "When entering a roundabout, you must yield to:",
      options: [
        "Traffic that is about to enter",
        "Traffic already in the roundabout",
        "No one — you have the right-of-way",
      ],
      correctIndex: 1,
      explanation:
        "Vehicles entering a roundabout yield to traffic already circulating, which moves counter-clockwise.",
      diagramId: "roundabout",
    },
    {
      id: "row-5",
      prompt:
        "At an intersection with no signs or signals, who has the right-of-way?",
      options: [
        "The vehicle that arrived first",
        "The larger vehicle",
        "The vehicle on the left",
      ],
      correctIndex: 0,
      explanation:
        "Without signs or signals, the first vehicle to arrive proceeds first; if simultaneous, yield to the right.",
    },
    {
      id: "row-6",
      prompt:
        "You are on a road that ends at a T-intersection. Traffic on the through road:",
      options: [
        "Has the right-of-way; you must yield",
        "Must stop for you",
        "Must yield because you are turning",
      ],
      correctIndex: 0,
      explanation:
        "At a T-intersection, traffic on the through (continuing) road has the right-of-way.",
    },
    {
      id: "row-7",
      prompt:
        "Two vehicles meet on a steep, narrow mountain road where neither can pass. Who must back up?",
      options: [
        "The vehicle facing downhill",
        "The vehicle facing uphill",
        "Whichever vehicle is larger",
      ],
      correctIndex: 0,
      explanation:
        "The vehicle facing downhill must yield by backing up, since it has greater control reversing uphill.",
    },
  ]),

  ...group("signs-signals", [
    {
      id: "sig-1",
      prompt: "An eight-sided (octagon) sign always means:",
      options: ["Stop", "Yield", "Warning"],
      correctIndex: 0,
      explanation: "Only stop signs are octagonal, so the shape alone tells you to stop.",
      diagramId: "sign-shapes",
    },
    {
      id: "sig-2",
      prompt: "A yellow, diamond-shaped sign tells you:",
      options: [
        "There is a general warning about conditions ahead",
        "A law you must obey",
        "Tourist information is nearby",
      ],
      correctIndex: 0,
      explanation: "Yellow diamond signs warn of hazards or changing conditions ahead.",
      diagramId: "sign-shapes",
    },
    {
      id: "sig-3",
      prompt: "At a steady red traffic light, you may:",
      options: [
        "Turn right after a full stop, unless a sign prohibits it",
        "Proceed slowly without stopping",
        "Go only if no other cars are present",
      ],
      correctIndex: 0,
      explanation:
        "After coming to a complete stop, a right turn on red is allowed unless a sign says otherwise.",
    },
    {
      id: "sig-4",
      prompt: "A flashing red traffic light means:",
      options: [
        "Stop, then proceed when it is safe",
        "Slow down without stopping",
        "The signal is broken — proceed",
      ],
      correctIndex: 0,
      explanation: "A flashing red light is treated exactly like a stop sign.",
    },
    {
      id: "sig-5",
      prompt: "A flashing yellow traffic light means:",
      options: [
        "Slow down and proceed with caution",
        "Stop and wait for green",
        "Speed up to clear the intersection",
      ],
      correctIndex: 0,
      explanation: "A flashing yellow light means proceed carefully.",
    },
    {
      id: "sig-6",
      prompt:
        "There is a solid yellow line on your side of the center line. You may:",
      options: [
        "Not pass",
        "Pass when the way is clear",
        "Pass only at night",
      ],
      correctIndex: 0,
      explanation: "A solid yellow line on your side means passing is not allowed.",
      diagramId: "no-passing-lines",
    },
    {
      id: "sig-7",
      prompt: "Road construction and maintenance signs are what color?",
      options: ["Orange", "Yellow", "Blue"],
      correctIndex: 0,
      explanation: "Orange signs mark construction and maintenance zones.",
    },
    {
      id: "sig-8",
      prompt: "A triangular (pennant) sign on the left side of the road marks:",
      options: ["A no-passing zone", "A school zone", "A dead end"],
      correctIndex: 0,
      explanation: "The yellow pennant-shaped sign warns of the start of a no-passing zone.",
    },
  ]),

  ...group("speed-limits", [
    {
      id: "spd-1",
      prompt: "At a blind intersection, the speed limit is:",
      options: ["15 mph", "25 mph", "35 mph"],
      correctIndex: 0,
      explanation: "15 mph is the limit at a blind intersection (one where you can't see 100 feet).",
    },
    {
      id: "spd-2",
      prompt:
        "Unless otherwise posted, the speed limit in a residential or business district is:",
      options: ["25 mph", "35 mph", "45 mph"],
      correctIndex: 0,
      explanation: "The default limit in business and residential districts is 25 mph.",
    },
    {
      id: "spd-3",
      prompt:
        "When passing a school while children are outside or crossing, the speed limit is usually:",
      options: ["25 mph", "40 mph", "15 mph"],
      correctIndex: 0,
      explanation: "School-zone speed limits are typically 25 mph when children are present.",
    },
    {
      id: "spd-4",
      prompt:
        "Within 100 feet of a railroad crossing where you cannot see the tracks for 400 feet, the limit is:",
      options: ["15 mph", "20 mph", "30 mph"],
      correctIndex: 0,
      explanation: "15 mph applies near a railroad crossing with limited visibility.",
    },
    {
      id: "spd-5",
      prompt:
        "Unless posted otherwise, the maximum speed on a two-lane undivided highway is:",
      options: ["55 mph", "65 mph", "45 mph"],
      correctIndex: 0,
      explanation: "The default maximum on two-lane undivided highways is 55 mph.",
    },
    {
      id: "spd-6",
      prompt: "California's 'Basic Speed Law' says you must:",
      options: [
        "Never drive faster than is safe for current conditions",
        "Always drive exactly the posted limit",
        "Drive 5 mph below the limit at all times",
      ],
      correctIndex: 0,
      explanation:
        "You may never drive faster than is safe for current conditions, even at or below the posted limit.",
    },
    {
      id: "spd-7",
      prompt: "In an alley, the speed limit is:",
      options: ["15 mph", "25 mph", "10 mph"],
      correctIndex: 0,
      explanation: "The speed limit in any alley is 15 mph.",
    },
  ]),

  ...group("parking", [
    {
      id: "prk-1",
      prompt: "A red painted curb means:",
      options: [
        "No stopping, standing, or parking",
        "Loading passengers only",
        "Disabled parking",
      ],
      correctIndex: 0,
      explanation: "Red curbs mean no stopping, standing, or parking at any time.",
      diagramId: "curb-colors",
    },
    {
      id: "prk-2",
      prompt: "A blue painted curb means:",
      options: [
        "Parking for disabled persons with a placard or plate",
        "A general loading zone",
        "Brief passenger loading",
      ],
      correctIndex: 0,
      explanation: "Blue curbs are reserved for vehicles displaying a disabled placard or plate.",
      diagramId: "curb-colors",
    },
    {
      id: "prk-3",
      prompt: "A white painted curb means:",
      options: [
        "Stop only briefly to load or unload passengers or mail",
        "No parking at any time",
        "Freight loading only",
      ],
      correctIndex: 0,
      explanation: "White curbs are for brief stops to pick up or drop off passengers or mail.",
      diagramId: "curb-colors",
    },
    {
      id: "prk-4",
      prompt: "You may not park within how many feet of a fire hydrant?",
      options: ["15 feet", "10 feet", "25 feet"],
      correctIndex: 0,
      explanation: "Never park within 15 feet of a fire hydrant.",
    },
    {
      id: "prk-5",
      prompt:
        "When you park facing uphill next to a curb, turn your front wheels:",
      options: [
        "Away from the curb",
        "Toward the curb",
        "Straight ahead",
      ],
      correctIndex: 0,
      explanation:
        "Facing uphill with a curb, turn wheels away from the curb so the car rolls back into the curb.",
      diagramId: "curb-parking",
    },
    {
      id: "prk-6",
      prompt:
        "When you park facing downhill next to a curb, turn your front wheels:",
      options: [
        "Toward the curb",
        "Away from the curb",
        "Straight, with the brake on",
      ],
      correctIndex: 0,
      explanation:
        "Facing downhill, turn wheels toward the curb so the car rolls into the curb if it moves.",
      diagramId: "curb-parking",
    },
    {
      id: "prk-7",
      prompt:
        "When you park on a hill with NO curb, turn your front wheels:",
      options: [
        "Toward the edge of the road",
        "Toward the center of the road",
        "Straight ahead",
      ],
      correctIndex: 0,
      explanation:
        "With no curb, point the wheels toward the road's edge so a rolling car leaves the roadway.",
    },
    {
      id: "prk-8",
      prompt: "A yellow painted curb means:",
      options: [
        "Stop only to load or unload within the posted time limit",
        "No stopping at any time",
        "Disabled parking only",
      ],
      correctIndex: 0,
      explanation: "Yellow curbs are for loading/unloading within the posted time limit.",
      diagramId: "curb-colors",
    },
  ]),

  ...group("lanes-passing", [
    {
      id: "lan-1",
      prompt: "Double solid yellow lines in the center of the road mean:",
      options: [
        "You may not pass; cross only to turn left into a driveway",
        "You may pass when the way is clear",
        "There is no restriction",
      ],
      correctIndex: 0,
      explanation:
        "Double solid yellow lines mean no passing; you may cross only to turn left into/out of a driveway.",
      diagramId: "no-passing-lines",
    },
    {
      id: "lan-2",
      prompt: "A broken (dashed) yellow center line means:",
      options: [
        "You may pass when it is safe",
        "Passing is never allowed",
        "You may pass only at night",
      ],
      correctIndex: 0,
      explanation: "A dashed yellow line on your side means you may pass when it is safe.",
      diagramId: "no-passing-lines",
    },
    {
      id: "lan-3",
      prompt: "To drive in a carpool/HOV lane you must have:",
      options: [
        "At least the number of people posted on the sign",
        "A commercial vehicle",
        "An urgent reason to hurry",
      ],
      correctIndex: 0,
      explanation: "HOV lanes require the minimum number of occupants posted on the sign (motorcycles are allowed).",
    },
    {
      id: "lan-4",
      prompt: "If you drive slower than surrounding traffic, you should:",
      options: [
        "Use the right lane or drive as far right as practical",
        "Stay in the left lane",
        "Drive in the center lane",
      ],
      correctIndex: 0,
      explanation: "Slower traffic must keep right so faster traffic can pass on the left.",
    },
    {
      id: "lan-5",
      prompt: "A solid white line between lanes going the same direction means:",
      options: [
        "Lane changes are discouraged or prohibited",
        "You may change lanes freely",
        "It marks the center of the road",
      ],
      correctIndex: 0,
      explanation: "Solid white lines discourage or prohibit lane changes.",
    },
    {
      id: "lan-6",
      prompt: "Before changing lanes you should:",
      options: [
        "Signal, check mirrors, and look over your shoulder for blind spots",
        "Only glance at your rear-view mirror",
        "Just turn on your signal",
      ],
      correctIndex: 0,
      explanation: "Mirrors have blind spots, so check over your shoulder before moving over.",
    },
    {
      id: "lan-7",
      prompt: "You may pass another vehicle on the right:",
      options: [
        "When it is turning left and there is room to pass safely on a paved surface",
        "Never under any circumstances",
        "Only on a freeway",
      ],
      correctIndex: 0,
      explanation: "Passing on the right is allowed only in limited cases, such as when a vehicle is turning left.",
    },
    {
      id: "lan-8",
      prompt: "Double parallel solid white lines marking a carpool lane mean:",
      options: [
        "Do not cross them to enter or exit",
        "You may cross when carpool hours end",
        "You may cross if you signal",
      ],
      correctIndex: 0,
      explanation: "You may not cross double solid white lines; enter/exit only where the line is broken.",
    },
  ]),

  ...group("dui-alcohol", [
    {
      id: "dui-1",
      prompt: "For a driver 21 or older, it is illegal to drive with a BAC of:",
      options: ["0.08% or higher", "0.05% or higher", "0.10% or higher"],
      correctIndex: 0,
      explanation: "The legal limit for drivers 21 and older is 0.08%.",
    },
    {
      id: "dui-2",
      prompt: "For a driver under 21, it is illegal to drive with a BAC of:",
      options: ["0.01% or higher", "0.05% or higher", "0.08% or higher"],
      correctIndex: 0,
      explanation: "California has a zero-tolerance law: 0.01% for drivers under 21.",
    },
    {
      id: "dui-3",
      prompt: "For a driver of a commercial vehicle, the BAC limit is:",
      options: ["0.04%", "0.08%", "0.02%"],
      correctIndex: 0,
      explanation: "Commercial drivers may not drive with a BAC of 0.04% or higher.",
    },
    {
      id: "dui-4",
      prompt: "California's 'implied consent' law means that, by driving, you:",
      options: [
        "Agree to take a chemical test if lawfully arrested for DUI",
        "Can always refuse testing with no penalty",
        "Cannot be tested without a warrant",
      ],
      correctIndex: 0,
      explanation: "Holding a license means you consent to chemical testing if arrested for DUI; refusal carries penalties.",
    },
    {
      id: "dui-5",
      prompt: "An open container of alcohol in a vehicle must be kept:",
      options: [
        "In the trunk or an area not occupied by passengers",
        "In the glove box",
        "Anywhere inside the car",
      ],
      correctIndex: 0,
      explanation: "Open containers are illegal in the passenger area; carry them in the trunk.",
    },
    {
      id: "dui-6",
      prompt: "Alcohol affects your driving by:",
      options: [
        "Slowing reaction time and impairing judgment",
        "Improving your focus",
        "Having no effect if you stay under the limit",
      ],
      correctIndex: 0,
      explanation: "Even small amounts of alcohol slow reactions and impair judgment.",
    },
    {
      id: "dui-7",
      prompt: "The only sure way to avoid driving under the influence is to:",
      options: [
        "Not drive after drinking — arrange another ride",
        "Drink coffee before driving",
        "Drive more slowly",
      ],
      correctIndex: 0,
      explanation: "Coffee and time do not reliably sober you; the safe choice is not to drive after drinking.",
    },
    {
      id: "dui-8",
      prompt: "Driving while impaired by drugs — including prescriptions or cannabis — is:",
      options: [
        "Illegal, just like driving under the influence of alcohol",
        "Legal if the drug was prescribed",
        "Legal if it is cannabis",
      ],
      correctIndex: 0,
      explanation: "It is illegal to drive impaired by any drug, including legal prescriptions and cannabis.",
    },
  ]),

  ...group("restraints", [
    {
      id: "res-1",
      prompt: "A child under 2 years old must ride:",
      options: [
        "In a rear-facing car seat, unless they weigh 40+ lb or are 40+ inches tall",
        "In a forward-facing seat",
        "In a regular seat belt",
      ],
      correctIndex: 0,
      explanation: "Children under 2 must be rear-facing unless they reach the weight/height exception.",
    },
    {
      id: "res-2",
      prompt: "Children under 8 years old must generally be secured:",
      options: [
        "In a car seat or booster in the back seat",
        "By a regular lap/shoulder belt",
        "In the front seat",
      ],
      correctIndex: 0,
      explanation: "Children under 8 must use a car seat or booster in the back seat (unless 4 ft 9 in or taller).",
    },
    {
      id: "res-3",
      prompt: "A child may stop using a booster and use a regular seat belt when they are:",
      options: [
        "At least 8 years old or 4 feet 9 inches tall",
        "At least 6 years old",
        "At least 50 pounds",
      ],
      correctIndex: 0,
      explanation: "A regular belt may be used at age 8 or a height of 4 ft 9 in.",
    },
    {
      id: "res-4",
      prompt: "Seat belts are required for:",
      options: [
        "The driver and every passenger",
        "Front-seat occupants only",
        "The driver only",
      ],
      correctIndex: 0,
      explanation: "California law requires the driver and all passengers to be belted.",
    },
    {
      id: "res-5",
      prompt: "The safest place for a child under 8 to ride is:",
      options: ["The back seat", "The front passenger seat", "It does not matter"],
      correctIndex: 0,
      explanation: "The back seat is safest for young children, away from front airbags.",
    },
    {
      id: "res-6",
      prompt: "If your vehicle has airbags, you should:",
      options: [
        "Still always wear your seat belt — airbags only supplement belts",
        "Skip the seat belt since the airbag protects you",
        "Disable the airbag",
      ],
      correctIndex: 0,
      explanation: "Airbags work with seat belts, not instead of them.",
    },
    {
      id: "res-7",
      prompt: "Leaving a child 6 or younger unattended in a vehicle is:",
      options: [
        "Illegal",
        "Fine for short trips",
        "Only illegal at night",
      ],
      correctIndex: 0,
      explanation: "It is illegal to leave a child 6 or younger alone in a vehicle without supervision.",
    },
  ]),

  ...group("sharing-road", [
    {
      id: "shr-1",
      prompt: "When passing a bicyclist, you must give at least:",
      options: ["3 feet of clearance", "1 foot of clearance", "No specific distance"],
      correctIndex: 0,
      explanation: "California's '3 feet for safety' law requires at least 3 feet when passing a bicyclist.",
    },
    {
      id: "shr-2",
      prompt: "A school bus ahead has its red lights flashing. You must:",
      options: [
        "Stop until the red lights stop flashing",
        "Slow to 15 mph and pass",
        "Pass carefully if no children are visible",
      ],
      correctIndex: 0,
      explanation: "Flashing red lights mean stop in both directions until they stop (unless divided by a barrier).",
      diagramId: "school-bus",
    },
    {
      id: "shr-3",
      prompt: "Large trucks and buses:",
      options: [
        "Have large blind spots; avoid lingering beside or close behind them",
        "Have no blind spots",
        "Can see better than cars in all directions",
      ],
      correctIndex: 0,
      explanation: "Big rigs have large blind spots ('No-Zones'); if you can't see the driver's mirrors, they can't see you.",
    },
    {
      id: "shr-4",
      prompt: "A motorcycle on the road:",
      options: [
        "Is entitled to use a full lane",
        "Must ride on the shoulder",
        "Must share a lane with cars",
      ],
      correctIndex: 0,
      explanation: "Motorcyclists are entitled to the same full lane as any other vehicle.",
    },
    {
      id: "shr-5",
      prompt: "A pedestrian using a white cane or guide dog is crossing. You must:",
      options: [
        "Always yield the right-of-way",
        "Honk to alert them",
        "Proceed if they are not moving",
      ],
      correctIndex: 0,
      explanation: "Always yield to a blind pedestrian; do not honk, which can be confusing.",
    },
    {
      id: "shr-6",
      prompt: "Pedestrians are in a crosswalk ahead of you. You should:",
      options: [
        "Stop and let them finish crossing",
        "Edge forward to hurry them",
        "Drive around them",
      ],
      correctIndex: 0,
      explanation: "Yield and allow pedestrians to finish crossing safely.",
    },
    {
      id: "shr-7",
      prompt: "When following a motorcycle, you should:",
      options: [
        "Allow a greater following distance (3-4 seconds)",
        "Follow closer because they are small",
        "Tailgate so you can pass quickly",
      ],
      correctIndex: 0,
      explanation: "Motorcycles can stop quickly; allow extra following distance.",
    },
    {
      id: "shr-8",
      prompt: "A school bus ahead has its yellow lights flashing. This means:",
      options: [
        "Prepare to stop — the bus is about to load or unload",
        "Speed up to pass before it stops",
        "Ignore them; only red matters",
      ],
      correctIndex: 0,
      explanation: "Flashing yellow lights warn that the bus is about to stop; prepare to stop.",
      diagramId: "school-bus",
    },
  ]),

  ...group("freeway", [
    {
      id: "fwy-1",
      prompt: "When entering a freeway, you should:",
      options: [
        "Use the on-ramp to reach traffic speed, then merge into a gap",
        "Stop at the end of the ramp and wait for an opening",
        "Merge slowly and let freeway traffic adjust to you",
      ],
      correctIndex: 0,
      explanation: "Match the speed of freeway traffic on the on-ramp, then merge into a gap.",
      diagramId: "freeway-merge",
    },
    {
      id: "fwy-2",
      prompt: "To exit a freeway, you should:",
      options: [
        "Signal early and move into the exit (deceleration) lane",
        "Brake hard in the through lane",
        "Slow down across all the lanes",
      ],
      correctIndex: 0,
      explanation: "Slow down in the exit lane, not the through lane.",
    },
    {
      id: "fwy-3",
      prompt: "On the freeway, you should signal before changing lanes for at least:",
      options: ["5 seconds", "1 second", "No signal is needed at speed"],
      correctIndex: 0,
      explanation: "Signal at least 5 seconds before changing lanes at freeway speeds.",
    },
    {
      id: "fwy-4",
      prompt: "If you miss your freeway exit, you should:",
      options: [
        "Continue to the next exit",
        "Back up on the shoulder to the exit",
        "Stop and wait for a gap to reverse",
      ],
      correctIndex: 0,
      explanation: "Never back up on a freeway; go on to the next exit.",
    },
    {
      id: "fwy-5",
      prompt: "On the freeway, a safe following distance is at least:",
      options: ["3 seconds, and more at higher speeds", "One car length", "Half a second"],
      correctIndex: 0,
      explanation: "Use at least a 3-second following distance, increasing it at higher speeds.",
      diagramId: "following-distance",
    },
    {
      id: "fwy-6",
      prompt: "While merging onto a freeway, you should:",
      options: [
        "Avoid stopping on the ramp unless traffic forces you to",
        "Always come to a stop before merging",
        "Merge at a speed well below traffic",
      ],
      correctIndex: 0,
      explanation: "Stopping on a ramp makes it hard to merge safely; keep moving and match speed.",
    },
    {
      id: "fwy-7",
      prompt: "You may enter or leave a carpool lane:",
      options: [
        "Only where the lane line is broken (dashed)",
        "Anywhere along the lane",
        "By crossing the double solid lines",
      ],
      correctIndex: 0,
      explanation: "Enter and exit HOV lanes only where the line is broken.",
    },
  ]),

  ...group("railroad", [
    {
      id: "rr-1",
      prompt: "Flashing red lights at a railroad crossing mean:",
      options: [
        "Stop and wait until the lights stop and it is safe to cross",
        "Proceed if you do not see a train",
        "Slow down and cross",
      ],
      correctIndex: 0,
      explanation: "Flashing red lights require a full stop until they stop and crossing is safe.",
      diagramId: "railroad-crossing",
    },
    {
      id: "rr-2",
      prompt: "You should never:",
      options: [
        "Stop your vehicle on railroad tracks",
        "Cross when the gates are up and it is clear",
        "Obey the crossing signals",
      ],
      correctIndex: 0,
      explanation: "Never stop on the tracks — only cross when there is room on the far side for your vehicle.",
    },
    {
      id: "rr-3",
      prompt: "Your vehicle stalls on the tracks and a train is coming. You should:",
      options: [
        "Get everyone out and move away from the tracks at an angle",
        "Stay inside and try to restart it",
        "Try to push the car off the tracks",
      ],
      correctIndex: 0,
      explanation: "Get out immediately and move away toward the train at an angle so debris won't hit you.",
    },
    {
      id: "rr-4",
      prompt: "At a crossing marked only by a crossbuck with a limited view of the tracks, you should:",
      options: [
        "Slow down, look both ways, and be ready to stop",
        "Maintain your speed",
        "Speed up to cross quickly",
      ],
      correctIndex: 0,
      explanation: "Slow down and be prepared to stop when your view of the tracks is limited.",
    },
    {
      id: "rr-5",
      prompt: "You should begin to cross railroad tracks only when:",
      options: [
        "There is room for your whole vehicle on the other side",
        "The car ahead starts to move",
        "You think you can beat the train",
      ],
      correctIndex: 0,
      explanation: "Don't enter the crossing unless you can clear it completely.",
    },
    {
      id: "rr-6",
      prompt: "When crossing gates are lowered, you should:",
      options: [
        "Never drive around them",
        "Drive around if no train is visible",
        "Wait about 10 seconds, then go",
      ],
      correctIndex: 0,
      explanation: "Never drive around lowered gates; wait until they rise.",
    },
  ]),

  ...group("emergencies", [
    {
      id: "emg-1",
      prompt:
        "An emergency vehicle is approaching with its siren and lights on. You should:",
      options: [
        "Pull to the right edge of the road and stop until it passes",
        "Stop immediately wherever you are",
        "Speed up to get out of its way",
      ],
      correctIndex: 0,
      explanation: "Pull over to the right and stop to let emergency vehicles pass.",
    },
    {
      id: "emg-2",
      prompt:
        "California's 'Move Over' law requires that, when approaching a stopped emergency, tow, or maintenance vehicle with flashing lights, you:",
      options: [
        "Move over a lane if safe, or slow down",
        "Keep your speed in the same lane",
        "Speed past as quickly as possible",
      ],
      correctIndex: 0,
      explanation: "Move over a lane when safe, or slow down, to protect roadside workers and responders.",
    },
    {
      id: "emg-3",
      prompt: "If your brakes suddenly fail, you should:",
      options: [
        "Pump the pedal, shift to a lower gear, and apply the parking brake slowly",
        "Turn off the engine immediately",
        "Steer into oncoming traffic to stop",
      ],
      correctIndex: 0,
      explanation: "Pump the brakes, downshift, and use the parking brake gradually to slow down.",
    },
    {
      id: "emg-4",
      prompt: "If a front tire suddenly blows out, you should:",
      options: [
        "Hold the wheel firmly and slowly ease off the gas",
        "Brake hard right away",
        "Accelerate to keep control",
      ],
      correctIndex: 0,
      explanation: "Grip the wheel, ease off the accelerator, and slow gradually after a blowout.",
    },
    {
      id: "emg-5",
      prompt: "After a collision, the law requires you to:",
      options: [
        "Stop, exchange information, and help anyone who is injured",
        "Leave if the damage looks minor",
        "Stop only if police are present",
      ],
      correctIndex: 0,
      explanation: "You must stop, give your information, and render aid to the injured.",
    },
    {
      id: "emg-6",
      prompt: "You hit a legally parked car and cannot find the owner. You must:",
      options: [
        "Leave a note with your name and contact information",
        "Drive away if no one saw you",
        "Wait only if the damage is major",
      ],
      correctIndex: 0,
      explanation: "Leave a note with your details on any unattended property or vehicle you damage.",
    },
    {
      id: "emg-7",
      prompt: "If your accelerator sticks while driving, you should:",
      options: [
        "Shift to neutral and brake to a safe stop",
        "Turn the ignition fully off at high speed",
        "Keep driving and hope it releases",
      ],
      correctIndex: 0,
      explanation: "Shift to neutral, brake, and steer to a safe spot; don't switch off the key at speed (you can lose steering).",
    },
  ]),

  ...group("distracted", [
    {
      id: "dst-1",
      prompt: "Using a handheld cell phone while driving is:",
      options: [
        "Illegal — adults may only use a phone hands-free",
        "Legal while stopped at a red light",
        "Legal if you hold it low",
      ],
      correctIndex: 0,
      explanation: "Holding a phone while driving is illegal; adults may use hands-free only.",
    },
    {
      id: "dst-2",
      prompt: "Drivers under 18 may use a cell phone while driving:",
      options: [
        "Not at all, even hands-free",
        "Hands-free only",
        "For texting at red lights",
      ],
      correctIndex: 0,
      explanation: "Drivers under 18 may not use a cell phone at all while driving, even hands-free.",
    },
    {
      id: "dst-3",
      prompt: "Texting while driving is:",
      options: [
        "Illegal for all drivers",
        "Legal when stopped in traffic",
        "Legal for adults",
      ],
      correctIndex: 0,
      explanation: "Writing, sending, or reading texts while driving is illegal for everyone.",
    },
    {
      id: "dst-4",
      prompt: "If you must make a phone call while driving, the safest choice is to:",
      options: [
        "Pull over to a safe place first",
        "Hold the phone in your lap",
        "Answer quickly and keep driving",
      ],
      correctIndex: 0,
      explanation: "Pull over to a safe location before using a phone in a way that distracts you.",
    },
    {
      id: "dst-5",
      prompt: "Which of these is a driving distraction?",
      options: [
        "Eating, grooming, or adjusting the radio",
        "Only cell phones",
        "Only passengers",
      ],
      correctIndex: 0,
      explanation: "Anything that takes your eyes, hands, or mind off driving is a distraction.",
    },
    {
      id: "dst-6",
      prompt: "While driving, your eyes should be:",
      options: [
        "Constantly scanning the road ahead, to the sides, and your mirrors",
        "Fixed only on the car directly ahead",
        "On your phone's GPS screen",
      ],
      correctIndex: 0,
      explanation: "Keep scanning the whole scene; don't fixate on one point.",
    },
    {
      id: "dst-7",
      prompt: "If you become drowsy while driving, you should:",
      options: [
        "Pull over to rest",
        "Open the window and keep driving",
        "Drive faster to arrive sooner",
      ],
      correctIndex: 0,
      explanation: "Drowsy driving is dangerous; stop and rest.",
    },
  ]),

  ...group("vehicle-equipment", [
    {
      id: "veq-1",
      prompt: "You must turn on your headlights:",
      options: [
        "From 30 minutes after sunset to 30 minutes before sunrise",
        "Only after midnight",
        "Only when it is raining",
      ],
      correctIndex: 0,
      explanation: "Headlights are required from 30 minutes after sunset until 30 minutes before sunrise (and when visibility is low).",
    },
    {
      id: "veq-2",
      prompt: "You must dim your high beams within:",
      options: [
        "500 feet of an oncoming vehicle and 300 feet when following one",
        "100 feet at all times",
        "Only inside cities",
      ],
      correctIndex: 0,
      explanation: "Dim high beams within 500 ft of oncoming traffic and 300 ft when following another vehicle.",
    },
    {
      id: "veq-3",
      prompt: "Worn or bald tires:",
      options: [
        "Reduce traction and increase stopping distance",
        "Improve grip in the rain",
        "Are fine as long as they hold air",
      ],
      correctIndex: 0,
      explanation: "Bald tires lose traction, especially on wet roads, and lengthen stopping distance.",
    },
    {
      id: "veq-4",
      prompt: "If your brake pedal feels soft or sinks to the floor, you should:",
      options: [
        "Have the brakes inspected before driving",
        "Keep driving — it will correct itself",
        "Pump harder and ignore it",
      ],
      correctIndex: 0,
      explanation: "A soft or sinking brake pedal signals a brake problem that needs inspection.",
    },
    {
      id: "veq-5",
      prompt: "You should adjust your mirrors:",
      options: [
        "Before you begin driving",
        "While driving on the freeway",
        "Only at night",
      ],
      correctIndex: 0,
      explanation: "Set mirrors before you start so you don't have to adjust them while moving.",
    },
    {
      id: "veq-6",
      prompt: "You should use your horn:",
      options: [
        "Briefly, to warn others and help avoid a collision",
        "To express anger at other drivers",
        "Continuously while stuck in traffic",
      ],
      correctIndex: 0,
      explanation: "The horn is a safety device to alert others, not to vent frustration.",
    },
    {
      id: "veq-7",
      prompt: "In fog or heavy rain, you should use:",
      options: ["Low-beam headlights", "High-beam headlights", "Parking lights only"],
      correctIndex: 0,
      explanation: "High beams reflect off fog and rain; use low beams for better visibility.",
    },
  ]),

  ...group("insurance", [
    {
      id: "ins-1",
      prompt: "California's minimum liability insurance limits are:",
      options: [
        "$30,000 / $60,000 / $15,000",
        "$15,000 / $30,000 / $5,000",
        "$5,000 / $10,000 / $5,000",
      ],
      correctIndex: 0,
      explanation: "As of 2025 the minimums are $30,000 per person, $60,000 per accident, and $15,000 property damage.",
    },
    {
      id: "ins-2",
      prompt: "You must show proof of insurance:",
      options: [
        "When an officer asks, after a collision, and to register your vehicle",
        "Only once a year",
        "Only if you cause a crash",
      ],
      correctIndex: 0,
      explanation: "Carry proof of insurance and show it on request, after a crash, and at registration.",
    },
    {
      id: "ins-3",
      prompt: "Driving without the required insurance can result in:",
      options: [
        "Suspension of your license and vehicle registration",
        "No penalty",
        "A free warning for new drivers",
      ],
      correctIndex: 0,
      explanation: "Driving uninsured can lead to suspension of your driving and registration privileges.",
    },
    {
      id: "ins-4",
      prompt: "'Financial responsibility' means that you:",
      options: [
        "Can pay for injury or damage you cause while driving",
        "Simply hold a driver license",
        "Own your vehicle outright",
      ],
      correctIndex: 0,
      explanation: "Financial responsibility (usually insurance) shows you can pay for harm you cause.",
    },
    {
      id: "ins-5",
      prompt:
        "After a crash that injures someone or causes property damage over the limit, you must report it to DMV within:",
      options: ["10 days", "60 days", "You never have to report it"],
      correctIndex: 0,
      explanation: "File an SR-1 report with DMV within 10 days of a qualifying crash.",
    },
    {
      id: "ins-6",
      prompt: "Minimum liability insurance pays for:",
      options: [
        "Injury and damage you cause to others",
        "All repairs to your own car",
        "Nothing — it is optional",
      ],
      correctIndex: 0,
      explanation: "Liability coverage pays others for harm you cause; it doesn't repair your own car.",
    },
  ]),

  ...group("weather", [
    {
      id: "wea-1",
      prompt: "A road is usually most slippery:",
      options: [
        "Just after it begins to rain",
        "After several hours of steady rain",
        "Only when ice forms",
      ],
      correctIndex: 0,
      explanation: "Oil and water mix when rain begins, making roads most slippery in the first minutes.",
    },
    {
      id: "wea-2",
      prompt: "If your vehicle begins to hydroplane, you should:",
      options: [
        "Ease off the accelerator and avoid braking hard",
        "Brake firmly to slow down",
        "Accelerate to push through the water",
      ],
      correctIndex: 0,
      explanation: "Gently ease off the gas and steer straight until the tires regain contact.",
    },
    {
      id: "wea-3",
      prompt: "In fog you should:",
      options: [
        "Slow down and use low-beam headlights",
        "Use high beams for more light",
        "Speed up to get through it",
      ],
      correctIndex: 0,
      explanation: "Slow down and use low beams; high beams reflect back and reduce visibility.",
    },
    {
      id: "wea-4",
      prompt: "If your car starts to skid, you should:",
      options: [
        "Steer in the direction you want the front of the car to go",
        "Brake hard and hold the wheel still",
        "Steer in the opposite direction of the skid",
      ],
      correctIndex: 0,
      explanation: "Steer where you want to go and ease off the brake/gas to recover from a skid.",
    },
    {
      id: "wea-5",
      prompt: "In heavy rain or snow, your following distance should be:",
      options: [
        "Greater than the usual 3 seconds",
        "Shorter, so you can keep up",
        "Exactly 1 second",
      ],
      correctIndex: 0,
      explanation: "Increase following distance well beyond 3 seconds in poor conditions.",
    },
    {
      id: "wea-6",
      prompt: "When driving at night, you should:",
      options: [
        "Slow down so you can stop within the distance your headlights light up",
        "Use high beams even in heavy traffic",
        "Speed up to spend less time on the road",
      ],
      correctIndex: 0,
      explanation: "Don't overdrive your headlights; you must be able to stop within the lit distance.",
    },
    {
      id: "wea-7",
      prompt:
        "Heavy rain or fog makes it impossible to see and you must stop. You should:",
      options: [
        "Pull completely off the road and turn on your emergency flashers",
        "Stop in your lane and wait",
        "Keep driving slowly even though you can't see",
      ],
      correctIndex: 0,
      explanation: "Get completely off the roadway and use hazard lights so others can see you.",
    },
  ]),

  ...group("licensing-misc", [
    {
      id: "lic-1",
      prompt: "After you move, you must notify DMV of your new address within:",
      options: ["10 days", "30 days", "60 days"],
      correctIndex: 0,
      explanation: "Report an address change to DMV within 10 days.",
    },
    {
      id: "lic-2",
      prompt: "In a business district, a U-turn is allowed:",
      options: [
        "Only at an intersection, or where a sign permits it",
        "Anywhere when no traffic is near",
        "Never under any circumstance",
      ],
      correctIndex: 0,
      explanation: "In business districts, make U-turns only at intersections or where signs allow.",
    },
    {
      id: "lic-3",
      prompt: "If you accumulate too many points on your driving record, your license may be:",
      options: ["Suspended or revoked", "Automatically upgraded", "Unaffected"],
      correctIndex: 0,
      explanation: "Too many points within a set period can lead to suspension or revocation.",
    },
    {
      id: "lic-4",
      prompt: "Your driver license must be:",
      options: [
        "Carried with you and shown to an officer on request",
        "Kept safely at home",
        "Needed only by new drivers",
      ],
      correctIndex: 0,
      explanation: "Always carry your license while driving and present it when an officer asks.",
    },
    {
      id: "lic-5",
      prompt: "A right turn on a red light is:",
      options: [
        "Allowed after a complete stop, unless a sign prohibits it",
        "Never allowed",
        "Allowed without stopping",
      ],
      correctIndex: 0,
      explanation: "You may turn right on red after stopping fully, unless a sign forbids it.",
    },
    {
      id: "lic-6",
      prompt: "At a stop sign with a limit line or crosswalk, you must:",
      options: [
        "Make a complete stop behind the limit line or crosswalk",
        "Slow to a rolling stop",
        "Stop only if other cars are coming",
      ],
      correctIndex: 0,
      explanation: "Always make a full stop behind the limit line or crosswalk.",
    },
    {
      id: "lic-7",
      prompt: "If a traffic signal is completely dark (not working), you should:",
      options: [
        "Treat the intersection as an all-way stop",
        "Proceed without stopping",
        "Assume the larger road always goes first",
      ],
      correctIndex: 0,
      explanation: "A dark signal is treated as a four-way stop.",
    },
  ]),
];

export const QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
