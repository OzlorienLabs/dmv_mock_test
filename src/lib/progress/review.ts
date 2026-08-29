import { applyOptionOrder } from "@/lib/engine";
import type { Question } from "@/lib/types";
import type { StoredAnswer } from "./store";

/**
 * Turning a saved attempt back into a reviewable question list.
 *
 * The catch: a test shuffles each question's options per attempt, so the
 * recorded `selectedIndex` is an index into the SHUFFLED options — not into the
 * canonical question in the bank. Handing that raw index to the review UI marks
 * correct answers wrong and highlights the wrong option. Everything here exists
 * to translate back into the exact view the learner saw.
 */

export type ReviewOutcome = "correct" | "wrong" | "skipped";

export interface ReviewItem {
  /** The question with its options in the order the learner actually saw them. */
  question: Question;
  /**
   * Index into `question.options` of the learner's choice, or null when they
   * skipped it — or when the attempt predates `optionOrder` and the choice
   * can't be recovered (we know it was wrong, not which one they picked).
   */
  selectedIndex: number | null;
  outcome: ReviewOutcome;
}

export interface ResolvedReview {
  items: ReviewItem[];
  /** Answers whose question is no longer in the bank, and so can't be shown. */
  missing: number;
}

function resolveOne(ans: StoredAnswer, bankQuestion: Question): ReviewItem {
  if (ans.selectedIndex === null) {
    return { question: bankQuestion, selectedIndex: null, outcome: "skipped" };
  }

  // Recorded with its shuffle: replay it and the stored index lines up exactly.
  if (ans.optionOrder) {
    const question = applyOptionOrder(bankQuestion, ans.optionOrder);
    const selectedIndex =
      ans.selectedIndex < question.options.length ? ans.selectedIndex : null;
    return {
      question,
      selectedIndex,
      outcome:
        selectedIndex === null
          ? "skipped"
          : selectedIndex === question.correctIndex
            ? "correct"
            : "wrong",
    };
  }

  // Legacy attempt (no recorded shuffle). The stored `correct` flag was
  // computed at test time against the shuffled options, so it is authoritative
  // where the raw index is not.
  if (ans.correct !== undefined) {
    return {
      question: bankQuestion,
      // If they were right, the option they picked IS the correct one, so we can
      // still point at it. If they were wrong, we can't tell which one — better
      // to highlight nothing than to accuse them of picking the right answer.
      selectedIndex: ans.correct ? bankQuestion.correctIndex : null,
      outcome: ans.correct ? "correct" : "wrong",
    };
  }

  // Oldest attempts: no shuffle, no flag. The raw index is the only signal.
  return {
    question: bankQuestion,
    selectedIndex: ans.selectedIndex,
    outcome:
      ans.selectedIndex === bankQuestion.correctIndex ? "correct" : "wrong",
  };
}

/**
 * Map a saved attempt's answers back onto the question bank for review,
 * preserving the recorded order. Answers whose question has since left the bank
 * are dropped and counted in `missing`.
 */
export function resolveReviewItems(
  answers: readonly StoredAnswer[],
  questionMap: ReadonlyMap<string, Question>,
): ResolvedReview {
  const items: ReviewItem[] = [];
  let missing = 0;
  for (const ans of answers) {
    const bankQuestion = questionMap.get(ans.questionId);
    if (!bankQuestion) {
      missing += 1;
      continue;
    }
    items.push(resolveOne(ans, bankQuestion));
  }
  return { items, missing };
}
