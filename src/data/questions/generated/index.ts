import type { Question } from "@/lib/types";
import { SIGN_QUESTIONS } from "./signs";
import { NUMBER_QUESTIONS } from "./numbers";

/** Questions produced from verified fact tables (origin: generated). */
export const GENERATED_QUESTIONS: Question[] = [
  ...SIGN_QUESTIONS,
  ...NUMBER_QUESTIONS,
];
