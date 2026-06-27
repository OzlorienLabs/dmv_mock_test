import type { Question } from "@/lib/types";
import { gq, toQuestion } from "./util";

/** Speed-limit questions generated from a verified zone → limit table. */
const speedFacts = [
  { zone: "a blind intersection", mph: "15 mph" },
  { zone: "an alley", mph: "15 mph" },
  { zone: "a business or residential district (unless posted)", mph: "25 mph" },
  { zone: "a school zone when children are present (unless posted)", mph: "25 mph" },
  { zone: "a two-lane undivided highway (unless posted)", mph: "55 mph" },
];

const SPEED_POOL = ["15 mph", "20 mph", "25 mph", "55 mph", "65 mph"];

const speedQuestions: Question[] = speedFacts.map((f, i) => {
  const wrong = SPEED_POOL.filter((s) => s !== f.mph);
  return toQuestion({
    id: `gen-speed-${i + 1}`,
    category: "speed-limits",
    prompt: `Unless otherwise posted, what is the maximum speed limit for ${f.zone}?`,
    correct: f.mph,
    distractors: [wrong[i % wrong.length], wrong[(i + 1) % wrong.length]],
    explanation: `The limit for ${f.zone} is ${f.mph}.`,
    rotateBy: i,
  });
});

/** Common "number" facts as direct questions. */
const directQuestions: Question[] = [
  gq(
    "gen-num-highbeam-on",
    "vehicle-equipment",
    "Within how many feet of an oncoming vehicle must you dim your high-beam headlights?",
    ["300 feet", "500 feet", "1,000 feet"],
    1,
    "Dim your high beams within 500 feet of an oncoming vehicle.",
  ),
  gq(
    "gen-num-highbeam-follow",
    "vehicle-equipment",
    "Within how many feet of a vehicle you are following must you dim your high beams?",
    ["100 feet", "300 feet", "500 feet"],
    1,
    "Dim your high beams within 300 feet when following another vehicle.",
  ),
  gq(
    "gen-num-follow",
    "freeway",
    "A safe following distance under good conditions is at least how many seconds?",
    ["1 second", "2 seconds", "3 seconds"],
    2,
    "Use at least a 3-second following distance, and more in poor conditions.",
    { diagramId: "following-distance" },
  ),
  gq(
    "gen-num-sell",
    "licensing-misc",
    "Within how many days must you notify DMV after selling or transferring your vehicle?",
    ["5 days", "10 days", "30 days"],
    0,
    "Report a sale or transfer to DMV within 5 days.",
  ),
  gq(
    "gen-num-helmet",
    "sharing-road",
    "Bicyclists and their passengers under what age must wear a helmet in California?",
    ["14", "16", "18"],
    2,
    "Anyone under 18 must wear a bicycle helmet.",
  ),
  gq(
    "gen-num-signal",
    "lanes-passing",
    "How far before a turn should you normally signal in city driving?",
    ["50 feet", "100 feet", "250 feet"],
    1,
    "Signal at least 100 feet before turning.",
  ),
];

export const NUMBER_QUESTIONS: Question[] = [...speedQuestions, ...directQuestions];
