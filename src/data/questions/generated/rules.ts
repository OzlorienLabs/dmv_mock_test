import type { Question } from "@/lib/types";
import { gq, rotate, URLS } from "./util";

/**
 * Rule-based generated questions: curb colors and signal states (from fact
 * tables, two framings) plus a set of additional direct fact questions. Answer
 * options are shuffled at test-build time by the engine, so authoring the
 * correct answer first here is fine.
 */

function cap(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

// ---- Curb colors (forward + reverse) ----
const curb = [
  { color: "red", meaning: "no stopping, standing, or parking" },
  { color: "yellow", meaning: "stop only to load or unload within the posted time" },
  { color: "white", meaning: "a brief stop to load or unload passengers or mail" },
  { color: "green", meaning: "parking for a limited time" },
  { color: "blue", meaning: "parking for disabled persons with a placard or plate" },
];

const curbQuestions: Question[] = curb.flatMap((c, i) => {
  const meaningOpts = rotate(
    [c.meaning, curb[(i + 1) % curb.length].meaning, curb[(i + 2) % curb.length].meaning],
    i,
  );
  const colorOpts = rotate(
    [cap(c.color), cap(curb[(i + 1) % curb.length].color), cap(curb[(i + 2) % curb.length].color)],
    i + 1,
  );
  return [
    {
      id: `rule-curb-mean-${i + 1}`,
      category: "parking" as const,
      prompt: `What does a ${c.color} painted curb mean?`,
      options: meaningOpts.map(cap),
      correctIndex: meaningOpts.indexOf(c.meaning),
      explanation: `A ${c.color} curb means ${c.meaning}.`,
      origin: "generated" as const,
      sourceName: "Based on the California Driver Handbook",
      sourceUrl: URLS.HANDBOOK,
      diagramId: "curb-colors",
    },
    {
      id: `rule-curb-color-${i + 1}`,
      category: "parking" as const,
      prompt: `Which curb color means: ${cap(c.meaning)}?`,
      options: colorOpts,
      correctIndex: colorOpts.indexOf(cap(c.color)),
      explanation: `A ${c.color} curb means ${c.meaning}.`,
      origin: "generated" as const,
      sourceName: "Based on the California Driver Handbook",
      sourceUrl: URLS.HANDBOOK,
      diagramId: "curb-colors",
    },
  ];
});

// ---- Signal states (forward) ----
const signals = [
  { state: "steady red light", meaning: "stop and remain stopped" },
  { state: "steady yellow light", meaning: "the light is about to turn red — stop if you can do so safely" },
  { state: "steady green light", meaning: "go, if the intersection is clear" },
  { state: "flashing red light", meaning: "stop, then go when it is safe" },
  { state: "flashing yellow light", meaning: "slow down and proceed with caution" },
  { state: "red arrow", meaning: "do not turn; wait for a green light or arrow" },
  { state: "green arrow", meaning: "you may go in the direction of the arrow" },
  { state: "dark, non-working signal", meaning: "treat the intersection as a four-way stop" },
];

const signalQuestions: Question[] = signals.map((s, i) => {
  const opts = rotate(
    [s.meaning, signals[(i + 1) % signals.length].meaning, signals[(i + 3) % signals.length].meaning],
    i,
  );
  return {
    id: `rule-signal-${i + 1}`,
    category: "signs-signals" as const,
    prompt: `What does a ${s.state} mean?`,
    options: opts.map(cap),
    correctIndex: opts.indexOf(s.meaning),
    explanation: `A ${s.state} means: ${s.meaning}.`,
    origin: "generated" as const,
    sourceName: "Based on the California Driver Handbook",
    sourceUrl: URLS.HANDBOOK,
  };
});

// ---- Additional direct fact questions (correct answer listed first) ----
const direct: Question[] = [
  gq("rule-row-1", "right-of-way", "At an uncontrolled intersection where two roads of equal size meet, you should:", ["Yield to the vehicle that arrives first, or to the one on your right if you arrive together", "Always go first", "Wait for a signal to appear"], 0, "First to arrive proceeds; if simultaneous, yield to the right."),
  gq("rule-row-2", "right-of-way", "You are turning left at a green light with no arrow. You must:", ["Yield to oncoming traffic and pedestrians, then turn when it is safe", "Turn immediately", "Wait until the light turns red"], 0, "A left turn on a green ball must yield to oncoming traffic."),
  gq("rule-row-3", "right-of-way", "A vehicle on a freeway on-ramp merging into traffic must:", ["Yield to traffic already on the freeway", "Force its way in", "Stop and wait for an opening"], 0, "Merging traffic yields to vehicles already on the freeway."),
  gq("rule-row-4", "right-of-way", "When entering the road from a parking space at the curb, you must:", ["Yield to traffic already on the road", "Pull out and let others slow down", "Sound your horn and go"], 0, "Yield to passing traffic before pulling out."),
  gq("rule-spd-1", "speed-limits", "When it is raining or foggy, the safest choice is to:", ["Drive slower than the posted limit", "Drive exactly the posted limit", "Drive faster to leave sooner"], 0, "Reduce speed for conditions, regardless of the posted limit."),
  gq("rule-spd-2", "speed-limits", "Unless otherwise posted, the maximum speed on most California freeways is:", ["65 mph", "55 mph", "75 mph"], 0, "Most freeways have a 65 mph limit unless posted otherwise."),
  gq("rule-spd-3", "speed-limits", "Driving much slower than surrounding traffic is:", ["Dangerous and can block the flow of traffic", "Always the safest option", "Required in the left lane"], 0, "Going too slow can be as hazardous as speeding."),
  gq("rule-prk-1", "parking", "Parking your car more than 18 inches from the curb is:", ["A parking violation", "Recommended for safety", "Required by law"], 0, "Park within 18 inches of the curb."),
  gq("rule-prk-2", "parking", "When you park on a level street with no curb, turn your wheels so the car would:", ["Roll away from traffic if it moves", "Roll toward the center of the road", "Stay perfectly straight"], 0, "Point wheels so a rolling car leaves the roadway."),
  gq("rule-lan-1", "lanes-passing", "On a multi-lane road, slower drivers should:", ["Keep to the right", "Stay in the left lane", "Use the center lane only"], 0, "Slower traffic keeps right; the left lane is for passing."),
  gq("rule-lan-2", "lanes-passing", "When another vehicle is passing you, you should:", ["Keep to the right and maintain your speed", "Speed up to prevent the pass", "Move toward the passing vehicle"], 0, "Help the pass by holding your lane and speed."),
  gq("rule-lan-3", "lanes-passing", "You may NOT cross which of these to pass?", ["Double solid yellow lines", "A broken yellow line", "A broken white line"], 0, "Double solid yellow lines mean no passing."),
  gq("rule-shr-1", "sharing-road", "When a large truck is making a right turn, you should:", ["Never try to pass between the truck and the curb", "Squeeze past on the right", "Honk and go around"], 0, "Trucks swing wide; never pass on the right of a turning truck."),
  gq("rule-shr-2", "sharing-road", "A vehicle displaying a slow-moving vehicle emblem travels:", ["Slower than 25 mph", "Faster than other traffic", "Only on freeways"], 0, "The orange triangle marks vehicles under 25 mph."),
  gq("rule-fwy-1", "freeway", "If you cannot merge smoothly because of traffic, you should:", ["Adjust your speed to fit into a gap", "Stop on the on-ramp and wait", "Force your way into the lane"], 0, "Match speed and merge into a gap; avoid stopping on the ramp."),
  gq("rule-fwy-2", "freeway", "If your vehicle breaks down on a freeway, you should:", ["Pull onto the right shoulder and turn on your hazard lights", "Stop in the lane and call for help", "Reverse to the last exit"], 0, "Get onto the shoulder and use hazard lights."),
  gq("rule-rr-1", "railroad", "You should expect a train at a crossing:", ["At any time, on any track, from either direction", "Only during daytime hours", "Only on weekdays"], 0, "Trains can come anytime from either direction."),
  gq("rule-emg-1", "emergencies", "If you are first at the scene of a collision, you should:", ["Stop, help the injured, and warn approaching traffic", "Leave so you are not blamed", "Move every injured person right away"], 0, "Stop and render aid; don't move the seriously injured unnecessarily."),
  gq("rule-emg-2", "emergencies", "If your right wheels drift onto the dirt shoulder, you should:", ["Ease off the gas and steer back gently when it is safe", "Brake hard immediately", "Jerk the steering wheel back quickly"], 0, "Slow gradually and steer back smoothly to avoid losing control."),
  gq("rule-dst-1", "distracted", "The safest way to use a navigation app is to:", ["Set your route before you start driving", "Hold the phone and tap as you drive", "Enter the address at red lights"], 0, "Program navigation before driving; holding a phone is illegal."),
  gq("rule-veq-1", "vehicle-equipment", "Your brake lights must:", ["Work and be visible to drivers behind you", "Be tinted dark", "Be turned off in daytime"], 0, "Functioning brake lights warn drivers behind you."),
  gq("rule-veq-2", "vehicle-equipment", "If your vehicle begins to overheat in traffic, you should:", ["Turn off the air conditioner and pull over if it continues", "Speed up to cool the engine", "Ignore the temperature gauge"], 0, "Reduce engine load and stop safely if it keeps rising."),
  gq("rule-ins-1", "insurance", "You must carry evidence of financial responsibility (insurance):", ["In your vehicle whenever you drive", "Only on long trips", "Only after a collision"], 0, "Always carry proof of insurance in the vehicle."),
  gq("rule-lic-1", "licensing-misc", "If a peace officer signals you to pull over, you should:", ["Pull to the right as soon as it is safe and stop", "Speed up to find a police station", "Stop immediately in your lane"], 0, "Move right and stop safely when signaled to pull over."),
  gq("rule-lic-2", "licensing-misc", "Driving while your license is suspended is:", ["Illegal", "Allowed to get to work", "Allowed in emergencies only"], 0, "It is illegal to drive on a suspended license."),
  gq("rule-wea-1", "weather", "On a cold, wet day, which surfaces are most likely to be icy?", ["Bridges and overpasses", "Long flat stretches", "Tunnels"], 0, "Bridges and overpasses freeze before other surfaces."),
];

export const RULE_QUESTIONS: Question[] = [...curbQuestions, ...signalQuestions, ...direct];
