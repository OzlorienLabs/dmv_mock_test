import type { Question } from "@/lib/types";
import { SIGN_QUESTIONS } from "./signs";
import { SIGN_CATALOG_QUESTIONS } from "./signs-catalog";
import { NUMBER_QUESTIONS } from "./numbers";
import { RULE_QUESTIONS } from "./rules";

/** Questions produced from verified fact tables (origin: generated). */
export const GENERATED_QUESTIONS: Question[] = [
  ...SIGN_QUESTIONS,
  ...SIGN_CATALOG_QUESTIONS,
  ...NUMBER_QUESTIONS,
  ...RULE_QUESTIONS,
];
