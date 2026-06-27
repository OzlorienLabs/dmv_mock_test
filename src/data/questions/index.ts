import type { Question } from "@/lib/types";
import { OFFICIAL_QUESTIONS } from "./official";
import { SCENARIO_QUESTIONS } from "./scenarios";
import { SCENARIO2_QUESTIONS } from "./scenarios2";
import { SCENARIO3_QUESTIONS } from "./scenarios3";
import { SCENARIO4_QUESTIONS } from "./scenarios4";
import { GENERATED_QUESTIONS } from "./generated";

/**
 * The full question bank, aggregated from:
 *   - OFFICIAL_QUESTIONS: verbatim official DMV sample questions (origin: official_dmv)
 *   - GENERATED_QUESTIONS: fact-table generated questions (origin: generated)
 *   - SCENARIO_QUESTIONS: hand-authored scenario questions (origin: generated)
 *
 * Structural integrity is enforced by validateQuestions() in index.test.ts.
 */
export const QUESTIONS: Question[] = [
  ...OFFICIAL_QUESTIONS,
  ...GENERATED_QUESTIONS,
  ...SCENARIO_QUESTIONS,
  ...SCENARIO2_QUESTIONS,
  ...SCENARIO3_QUESTIONS,
  ...SCENARIO4_QUESTIONS,
];

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export { validateQuestions } from "./validate";
