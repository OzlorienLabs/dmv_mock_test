import type { CategoryId, Question } from "@/lib/types";

/**
 * Second batch of hand-authored scenario questions (origin: generated),
 * grounded in the California Driver Handbook. Kept separate from the Phase 1
 * scenarios.ts purely for file size; both feed the same bank.
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
    {
      id: "row2-1",
      prompt: "You are entering a road from a private driveway or alley. You must:",
      options: [
        "Yield to vehicles and pedestrians already on the road or sidewalk",
        "Proceed because through traffic must yield to you",
        "Sound your horn and pull out",
      ],
      correctIndex: 0,
      explanation: "When entering traffic from a driveway or alley, yield to road and sidewalk users.",
    },
    {
      id: "row2-2",
      prompt: "A funeral procession is passing through an intersection. You should:",
      options: [
        "Yield and not cut through the procession",
        "Cut through quickly between vehicles",
        "Join the procession to get through faster",
      ],
      correctIndex: 0,
      explanation: "Yield to a funeral procession and do not drive through it.",
    },
    {
      id: "row2-3",
      prompt: "At an intersection, a pedestrian steps off the curb into a crosswalk. You must:",
      options: [
        "Stop and yield, even if the crosswalk is unmarked",
        "Continue if there are no painted lines",
        "Yield only if a signal tells you to",
      ],
      correctIndex: 0,
      explanation: "Yield to pedestrians at marked and unmarked crosswalks.",
    },
    {
      id: "row2-4",
      prompt: "When you exit a roundabout, you should:",
      options: [
        "Signal right as you approach your exit",
        "Stop in the roundabout to let others in",
        "Signal left to show you are leaving",
      ],
      correctIndex: 0,
      explanation: "Signal right just before your exit in a roundabout.",
      diagramId: "roundabout",
    },
  ]),

  ...group("signs-signals", [
    {
      id: "sig2-1",
      prompt: "A steady yellow traffic light means:",
      options: [
        "The light is about to turn red; stop if you can do so safely",
        "Speed up to beat the red light",
        "The light is about to turn green",
      ],
      correctIndex: 0,
      explanation: "Yellow warns the light is about to turn red; stop if it is safe.",
    },
    {
      id: "sig2-2",
      prompt: "A green arrow pointing left means:",
      options: [
        "You may turn left; oncoming traffic is stopped for you",
        "You must yield to oncoming traffic before turning",
        "Left turns are prohibited",
      ],
      correctIndex: 0,
      explanation: "A green arrow is a protected turn; oncoming traffic has a red light.",
    },
    {
      id: "sig2-3",
      prompt: "Yellow lines on the roadway separate:",
      options: [
        "Traffic moving in opposite directions",
        "Traffic moving in the same direction",
        "Bicycle lanes from parking",
      ],
      correctIndex: 0,
      explanation: "Yellow lines divide traffic going opposite directions.",
    },
    {
      id: "sig2-4",
      prompt: "White lines on the roadway separate:",
      options: [
        "Lanes of traffic moving in the same direction",
        "Traffic moving in opposite directions",
        "The road from the shoulder only",
      ],
      correctIndex: 0,
      explanation: "White lines separate lanes traveling in the same direction.",
    },
    {
      id: "sig2-5",
      prompt: "A flashing red arrow at an intersection means:",
      options: [
        "Stop, then turn when it is safe",
        "Turn without stopping",
        "The signal is out of order",
      ],
      correctIndex: 0,
      explanation: "A flashing red arrow is treated like a stop sign for that movement.",
    },
  ]),

  ...group("speed-limits", [
    {
      id: "spd2-1",
      prompt: "Traffic fines are typically doubled:",
      options: [
        "In a construction or work zone when workers are present",
        "On all freeways at night",
        "Only on holidays",
      ],
      correctIndex: 0,
      explanation: "Fines are doubled in active work zones.",
    },
    {
      id: "spd2-2",
      prompt: "As you approach a sharp curve, you should:",
      options: [
        "Slow down before you enter the curve",
        "Brake hard while in the curve",
        "Speed up through the curve",
      ],
      correctIndex: 0,
      explanation: "Reduce speed before the curve, not while turning through it.",
    },
    {
      id: "spd2-3",
      prompt: "On a wet or slippery road, you should:",
      options: [
        "Reduce your speed below the posted limit",
        "Maintain the posted limit exactly",
        "Increase speed to clear the area quickly",
      ],
      correctIndex: 0,
      explanation: "Slow down for conditions; the posted limit is for ideal conditions only.",
    },
  ]),

  ...group("parking", [
    {
      id: "prk2-1",
      prompt: "It is illegal to park:",
      options: [
        "In front of a driveway, on a crosswalk, or in a bike lane",
        "On any residential street",
        "More than 12 inches from the curb only",
      ],
      correctIndex: 0,
      explanation: "Never block driveways, crosswalks, or bike lanes.",
    },
    {
      id: "prk2-2",
      prompt: "You may stop or park on a freeway:",
      options: [
        "Only in an emergency",
        "Whenever you need a rest",
        "To pick up passengers",
      ],
      correctIndex: 0,
      explanation: "Stopping on a freeway is allowed only for emergencies.",
    },
    {
      id: "prk2-3",
      prompt: "Whenever you park your vehicle, you should:",
      options: [
        "Set the parking brake and leave it in park or in gear",
        "Leave it in neutral with the brake off",
        "Leave the engine running",
      ],
      correctIndex: 0,
      explanation: "Always set the parking brake and put the car in park (or in gear).",
    },
  ]),

  ...group("lanes-passing", [
    {
      id: "lan2-1",
      prompt: "A center lane bordered by two sets of yellow lines (one solid, one dashed) is:",
      options: [
        "A two-way left turn lane used only for left turns",
        "A passing lane for faster traffic",
        "A carpool lane",
      ],
      correctIndex: 0,
      explanation: "The center two-way left turn lane is for making left turns from either direction.",
    },
    {
      id: "lan2-2",
      prompt: "You should not change lanes:",
      options: [
        "While in an intersection",
        "On any multi-lane road",
        "When traffic is light",
      ],
      correctIndex: 0,
      explanation: "Avoid lane changes within an intersection.",
    },
    {
      id: "lan2-3",
      prompt: "You may cross a single broken white line:",
      options: [
        "To change lanes when it is safe",
        "Only to turn left",
        "Never",
      ],
      correctIndex: 0,
      explanation: "A broken white line allows lane changes when safe.",
    },
    {
      id: "lan2-4",
      prompt: "The hand signal for a left turn is:",
      options: [
        "Arm and hand pointed straight out",
        "Arm bent upward at the elbow",
        "Arm bent downward at the elbow",
      ],
      correctIndex: 0,
      explanation: "Left turn: arm extended straight out.",
    },
    {
      id: "lan2-5",
      prompt: "The hand signal for a right turn is:",
      options: [
        "Arm bent upward at the elbow",
        "Arm pointed straight out",
        "Arm bent downward at the elbow",
      ],
      correctIndex: 0,
      explanation: "Right turn: arm bent upward at the elbow.",
    },
    {
      id: "lan2-6",
      prompt: "The hand signal for slowing or stopping is:",
      options: [
        "Arm bent downward at the elbow",
        "Arm bent upward at the elbow",
        "Arm pointed straight out",
      ],
      correctIndex: 0,
      explanation: "Slow/stop: arm bent downward.",
    },
  ]),

  ...group("dui-alcohol", [
    {
      id: "dui2-1",
      prompt: "If you refuse to take a chemical test when arrested for DUI, you:",
      options: [
        "Will have your license suspended",
        "Face no consequence",
        "Only pay a small fee",
      ],
      correctIndex: 0,
      explanation: "Refusing a chemical test triggers a license suspension under implied consent.",
    },
    {
      id: "dui2-2",
      prompt: "Combining alcohol with medication can:",
      options: [
        "Increase impairment more than either alone",
        "Cancel out the effects of alcohol",
        "Make you a safer driver",
      ],
      correctIndex: 0,
      explanation: "Alcohol and medications can multiply impairment.",
    },
    {
      id: "dui2-3",
      prompt: "A first DUI conviction can result in:",
      options: [
        "Fines, license suspension, and possible jail time",
        "A warning only",
        "Extra driving privileges",
      ],
      correctIndex: 0,
      explanation: "DUI penalties include fines, suspension, and possible jail.",
    },
  ]),

  ...group("restraints", [
    {
      id: "res2-1",
      prompt: "A rear-facing car seat should never be placed:",
      options: [
        "In front of an active passenger airbag",
        "In the back seat",
        "In a vehicle with airbags at all",
      ],
      correctIndex: 0,
      explanation: "An active front airbag can seriously injure a rear-facing child.",
    },
    {
      id: "res2-2",
      prompt: "Airbags are most effective when:",
      options: [
        "You wear your seat belt and sit back from the wheel",
        "You sit as close to the wheel as possible",
        "You turn the airbag off",
      ],
      correctIndex: 0,
      explanation: "Airbags supplement seat belts; wear your belt and keep some distance.",
    },
    {
      id: "res2-3",
      prompt: "Riding in the cargo bed of a pickup truck on a highway is:",
      options: [
        "Generally illegal",
        "Allowed for adults",
        "Allowed at low speeds",
      ],
      correctIndex: 0,
      explanation: "Riding unrestrained in a truck bed on a highway is generally prohibited.",
    },
  ]),

  ...group("sharing-road", [
    {
      id: "shr2-1",
      prompt: "Bicyclists on the roadway should ride:",
      options: [
        "In the same direction as traffic",
        "Against the flow of traffic",
        "Only on sidewalks",
      ],
      correctIndex: 0,
      explanation: "Bicyclists must ride with traffic, in the same direction.",
    },
    {
      id: "shr2-2",
      prompt: "An orange or red triangular emblem on the back of a vehicle means it:",
      options: [
        "Travels slower than 25 mph",
        "Is an emergency vehicle",
        "Is carrying hazardous materials",
      ],
      correctIndex: 0,
      explanation: "The slow-moving vehicle emblem marks vehicles that travel under 25 mph.",
    },
    {
      id: "shr2-3",
      prompt: "A transit bus has signaled to pull back into traffic ahead of you. You should:",
      options: [
        "Yield and allow the bus to merge",
        "Speed up to pass it",
        "Honk and continue",
      ],
      correctIndex: 0,
      explanation: "Yield to a bus signaling to re-enter the flow of traffic.",
    },
    {
      id: "shr2-4",
      prompt: "When driving near light-rail or streetcars, you should:",
      options: [
        "Never turn in front of one and yield the right-of-way",
        "Assume they will stop for you",
        "Cross the tracks whenever convenient",
      ],
      correctIndex: 0,
      explanation: "Yield to rail vehicles; they cannot stop quickly.",
    },
  ]),

  ...group("freeway", [
    {
      id: "fwy2-1",
      prompt: "If you must stop on a freeway because of an emergency, you should:",
      options: [
        "Pull onto the right shoulder and turn on your hazard lights",
        "Stop in the right lane",
        "Stop in the median",
      ],
      correctIndex: 0,
      explanation: "Get onto the shoulder and use hazard lights.",
    },
    {
      id: "fwy2-2",
      prompt: "Ramp meter (metering) lights at a freeway on-ramp tell you to:",
      options: [
        "Proceed one vehicle per green light",
        "Stop and park",
        "Ignore them at rush hour",
      ],
      correctIndex: 0,
      explanation: "Metering lights release one vehicle per green to smooth merging.",
    },
    {
      id: "fwy2-3",
      prompt: "On a multi-lane freeway, the far-left lane is generally for:",
      options: [
        "Passing and faster-moving traffic",
        "Slow vehicles and trucks",
        "Exiting the freeway",
      ],
      correctIndex: 0,
      explanation: "Keep right except to pass; the left lane is for faster traffic and passing.",
    },
  ]),

  ...group("railroad", [
    {
      id: "rr2-1",
      prompt: "Before you start to cross railroad tracks, you must make sure:",
      options: [
        "There is room for your entire vehicle on the far side",
        "The car ahead has started moving",
        "The signal has been off for at least 5 seconds",
      ],
      correctIndex: 0,
      explanation: "Only cross when you can clear the tracks completely.",
      diagramId: "railroad-crossing",
    },
    {
      id: "rr2-2",
      prompt: "When the crossing gates are coming down, you should:",
      options: [
        "Stop and wait; never drive around the gates",
        "Hurry across before they close",
        "Drive around if you don't see a train",
      ],
      correctIndex: 0,
      explanation: "Never go around lowering or lowered gates.",
    },
  ]),

  ...group("emergencies", [
    {
      id: "emg2-1",
      prompt: "If your headlights suddenly fail at night, you should:",
      options: [
        "Turn on your emergency flashers and pull off the road",
        "Keep driving at the same speed",
        "Follow another car closely for light",
      ],
      correctIndex: 0,
      explanation: "Use hazard lights and get safely off the road.",
    },
    {
      id: "emg2-2",
      prompt: "If your vehicle catches fire while driving, you should:",
      options: [
        "Pull over, turn off the engine, and get everyone out",
        "Keep driving to a fire station",
        "Open the hood immediately to look",
      ],
      correctIndex: 0,
      explanation: "Stop, shut off the engine, and move away from the vehicle.",
    },
    {
      id: "emg2-3",
      prompt: "After an emergency vehicle passes you, you should:",
      options: [
        "Stay at least 300 feet behind it",
        "Follow closely to get through traffic",
        "Speed up to pass it again",
      ],
      correctIndex: 0,
      explanation: "Do not follow an emergency vehicle closer than 300 feet.",
    },
  ]),

  ...group("distracted", [
    {
      id: "dst2-1",
      prompt: "For drivers 18 and older, using a phone in hands-free mode is:",
      options: [
        "Allowed",
        "Always illegal",
        "Only allowed on freeways",
      ],
      correctIndex: 0,
      explanation: "Adults may use a phone hands-free; holding it is illegal.",
    },
    {
      id: "dst2-2",
      prompt: "Which combination describes driving distractions?",
      options: [
        "Eating, texting, and adjusting the GPS",
        "Scanning mirrors and checking blind spots",
        "Keeping both hands on the wheel",
      ],
      correctIndex: 0,
      explanation: "Distractions take your eyes, hands, or attention off driving.",
    },
  ]),

  ...group("vehicle-equipment", [
    {
      id: "veq2-1",
      prompt: "Your turn signals stop working. You should:",
      options: [
        "Use hand signals and get them repaired",
        "Keep driving and ignore it",
        "Turn without signaling",
      ],
      correctIndex: 0,
      explanation: "Use hand signals until the lights are fixed.",
    },
    {
      id: "veq2-2",
      prompt: "Smooth or bald tires increase the risk of:",
      options: [
        "Hydroplaning and skidding",
        "Better fuel economy",
        "Shorter stopping distance",
      ],
      correctIndex: 0,
      explanation: "Worn tires lose traction and can hydroplane on wet roads.",
    },
    {
      id: "veq2-3",
      prompt: "You must keep your windshield and windows:",
      options: [
        "Clear enough to see clearly in all directions",
        "Tinted as dark as possible",
        "Covered with decorations",
      ],
      correctIndex: 0,
      explanation: "Maintain clear visibility through your windshield and windows.",
    },
  ]),

  ...group("insurance", [
    {
      id: "ins2-1",
      prompt: "Proof of insurance must be:",
      options: [
        "Carried in the vehicle and shown when requested",
        "Kept only at home",
        "Memorized but not carried",
      ],
      correctIndex: 0,
      explanation: "Keep proof of insurance in the vehicle and present it on request.",
    },
    {
      id: "ins2-2",
      prompt: "If you cannot show proof of insurance when stopped by an officer, you:",
      options: [
        "May be cited",
        "Will receive a reward",
        "Have nothing to worry about",
      ],
      correctIndex: 0,
      explanation: "Failing to show proof of insurance can result in a citation.",
    },
  ]),

  ...group("weather", [
    {
      id: "wea2-1",
      prompt: "In freezing conditions, the first surfaces to ice over are usually:",
      options: [
        "Bridges and overpasses",
        "Downhill straightaways",
        "Tunnels",
      ],
      correctIndex: 0,
      explanation: "Bridges and overpasses freeze before regular roads.",
    },
    {
      id: "wea2-2",
      prompt: "If fog becomes so thick you cannot see, you should:",
      options: [
        "Pull completely off the road and turn on your hazard lights",
        "Turn on your high beams and continue",
        "Stop in your lane and wait",
      ],
      correctIndex: 0,
      explanation: "Get off the road and use hazard lights when fog is too thick to drive.",
    },
    {
      id: "wea2-3",
      prompt: "When you drive out of heavy rain into bright sun, you should:",
      options: [
        "Be aware your brakes may be wet and less effective",
        "Brake hard to test them",
        "Assume nothing has changed",
      ],
      correctIndex: 0,
      explanation: "Wet brakes can grab less; dry them by braking gently.",
    },
  ]),

  ...group("licensing-misc", [
    {
      id: "lic2-1",
      prompt:
        "During the first 12 months, a provisional driver under 18 may NOT drive between:",
      options: [
        "11 p.m. and 5 a.m. (with limited exceptions)",
        "9 p.m. and 9 a.m.",
        "Midnight and 4 a.m.",
      ],
      correctIndex: 0,
      explanation: "Provisional drivers face an 11 p.m.–5 a.m. nighttime restriction at first.",
    },
    {
      id: "lic2-2",
      prompt: "You do NOT need to stop for a school bus with flashing red lights when:",
      options: [
        "It is on the opposite side of a divided or multilane highway",
        "You are in a hurry",
        "No children are visible",
      ],
      correctIndex: 0,
      explanation: "On a divided/multilane highway, oncoming traffic on the far side need not stop.",
      diagramId: "school-bus",
    },
    {
      id: "lic2-3",
      prompt: "At a stop sign, you must come to a complete stop and stop behind:",
      options: [
        "The limit line or crosswalk, or before entering the intersection",
        "Only if a car is coming",
        "The middle of the intersection",
      ],
      correctIndex: 0,
      explanation: "Stop behind the limit line/crosswalk, before entering the intersection.",
    },
  ]),
];

export const SCENARIO2_QUESTIONS: Question[] = seeds.map((q) => ({
  origin: "generated" as const,
  sourceName: "Based on the California Driver Handbook",
  sourceUrl: HANDBOOK_URL,
  ...q,
}));
