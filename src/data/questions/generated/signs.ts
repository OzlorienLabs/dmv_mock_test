import type { Question } from "@/lib/types";
import { toQuestion, URLS } from "./util";

/**
 * Sign questions generated from verified shape/color/meaning tables derived from
 * the California road sign chart (DL-37). Distractors are drawn from sibling
 * entries in the same table, so every option is plausible and in-domain.
 */

const shapeFacts = [
  { shape: "an eight-sided (octagon)", meaning: "Stop" },
  { shape: "a downward-pointing triangle", meaning: "Yield the right-of-way" },
  {
    shape: "a pennant (sideways triangle) on the left of the road",
    meaning: "The start of a no-passing zone",
  },
  { shape: "a five-sided (pentagon)", meaning: "A school zone or school crossing" },
  { shape: "a round", meaning: "A railroad crossing ahead" },
  { shape: "a diamond", meaning: "A warning about conditions ahead" },
];

const colorFacts = [
  { color: "a red", meaning: "Stop, yield, or a prohibited action" },
  { color: "a yellow", meaning: "A general warning" },
  { color: "an orange", meaning: "Construction or maintenance ahead" },
  { color: "a green", meaning: "Guide or directional information" },
  { color: "a blue", meaning: "Motorist services such as gas, food, or lodging" },
  { color: "a brown", meaning: "A recreational or scenic area" },
];

const namedSigns = [
  { name: "Do Not Enter", meaning: "You must not enter the roadway ahead" },
  { name: "Wrong Way", meaning: "You are traveling against traffic and must turn around" },
  { name: "No U-Turn", meaning: "U-turns are not allowed at that location" },
  { name: "One Way", meaning: "Traffic moves only in the direction of the arrow" },
  { name: "Keep Right", meaning: "Stay to the right of a divider or island" },
  { name: "Divided Highway", meaning: "The road ahead is divided into two one-way roadways" },
  { name: "Slippery When Wet", meaning: "The road may be slippery when wet, so slow down" },
  { name: "Merging Traffic", meaning: "Traffic may merge onto your roadway ahead" },
];

function distractors<T extends { meaning: string }>(arr: T[], i: number): string[] {
  return [arr[(i + 1) % arr.length].meaning, arr[(i + 2) % arr.length].meaning];
}

export const SIGN_QUESTIONS: Question[] = [
  ...shapeFacts.map((f, i) =>
    toQuestion({
      id: `gen-shape-${i + 1}`,
      category: "signs-signals",
      prompt: `What does ${f.shape} sign mean?`,
      correct: f.meaning,
      distractors: distractors(shapeFacts, i),
      explanation: `That shape indicates: ${f.meaning.toLowerCase()}.`,
      sourceName: "Based on the CA road sign chart (DL-37)",
      sourceUrl: URLS.SIGNCHART,
      diagramId: i === 0 ? "sign-shapes" : undefined,
      rotateBy: i,
    }),
  ),
  ...colorFacts.map((f, i) =>
    toQuestion({
      id: `gen-color-${i + 1}`,
      category: "signs-signals",
      prompt: `On a road sign, what does ${f.color} background usually indicate?`,
      correct: f.meaning,
      distractors: distractors(colorFacts, i),
      explanation: `That color usually means: ${f.meaning.toLowerCase()}.`,
      sourceName: "Based on the CA road sign chart (DL-37)",
      sourceUrl: URLS.SIGNCHART,
      rotateBy: i + 1,
    }),
  ),
  ...namedSigns.map((f, i) =>
    toQuestion({
      id: `gen-named-${i + 1}`,
      category: "signs-signals",
      prompt: `What does a “${f.name}” sign mean?`,
      correct: f.meaning,
      distractors: distractors(namedSigns, i),
      explanation: `A “${f.name}” sign means ${f.meaning.toLowerCase()}.`,
      sourceName: "Based on the CA road sign chart (DL-37)",
      sourceUrl: URLS.SIGNCHART,
      rotateBy: i + 2,
    }),
  ),
];
