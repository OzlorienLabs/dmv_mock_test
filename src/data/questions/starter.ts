import type { Question } from "@/lib/types";
import { OFFICIAL_QUESTIONS } from "./official";

/**
 * A tiny, diverse set of real questions shipped in the initial `/test` bundle
 * so the first question renders instantly, while the full 1000+ question bank
 * (`@/data/questions`) loads lazily in the background.
 *
 * It imports only `./official` (a few dozen questions, type-only otherwise), so
 * pulling this into the initial bundle does NOT pull the whole bank. These are
 * real bank questions (same ids), so the background build dedupes them cleanly
 * and progress tracking stays consistent.
 */
const STARTER_IDS = [
  "dmv-t1-8", // speed limits — Basic Speed Law
  "dmv-t2-5", // right-of-way — left turn yields to oncoming
  "dmv-t3-1", // parking — red curb
  "dmv-t1-4", // freeway — merge at traffic speed
  "dmv-t3-8", // right-of-way — don't block the intersection
  "dmv-t2-2", // sharing the road — large-truck blind spots
  "dmv-t4-8", // signs & signals — flashing yellow
  "dmv-t1-7", // sharing the road — school bus yellow lights
];

export const STARTER_QUESTIONS: Question[] = STARTER_IDS.map((id) =>
  OFFICIAL_QUESTIONS.find((q) => q.id === id),
).filter((q): q is Question => Boolean(q));
