import type { Question } from "@/lib/types";
import { OFFICIAL_QUESTIONS } from "./official";
import { SCENARIO_QUESTIONS } from "./scenarios";
import { SCENARIO2_QUESTIONS } from "./scenarios2";
import { SCENARIO3_QUESTIONS } from "./scenarios3";
import { SCENARIO4_QUESTIONS } from "./scenarios4";
import { SCENARIO5_QUESTIONS } from "./scenarios5";
import { SCENARIO6_QUESTIONS } from "./scenarios6";
import { SCENARIO7_QUESTIONS } from "./scenarios7";
import { SCENARIO8_QUESTIONS } from "./scenarios8";
import { SCENARIO9_QUESTIONS } from "./scenarios9";
import { SCENARIO10_QUESTIONS } from "./scenarios10";
import { SCENARIO11_QUESTIONS } from "./scenarios11";
import { SCENARIO12_QUESTIONS } from "./scenarios12";
import { SCENARIO13_QUESTIONS } from "./scenarios13";
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
  ...SCENARIO5_QUESTIONS,
  ...SCENARIO6_QUESTIONS,
  ...SCENARIO7_QUESTIONS,
  ...SCENARIO8_QUESTIONS,
  ...SCENARIO9_QUESTIONS,
  ...SCENARIO10_QUESTIONS,
  ...SCENARIO11_QUESTIONS,
  ...SCENARIO12_QUESTIONS,
  ...SCENARIO13_QUESTIONS,
];

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export { validateQuestions } from "./validate";
