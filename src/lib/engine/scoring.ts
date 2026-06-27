import type { AnswerItem, CategoryId, Question } from "@/lib/types";

export interface ScoredItem {
  questionId: string;
  category: CategoryId;
  selectedIndex: number | null;
  correctIndex: number;
  correct: boolean;
}

export interface CategoryScore {
  correct: number;
  total: number;
}

export interface AttemptResult {
  total: number;
  answered: number;
  correctCount: number;
  passCount: number;
  passed: boolean;
  items: ScoredItem[];
  perCategory: Partial<Record<CategoryId, CategoryScore>>;
}

/**
 * Score a set of answers against the questions shown. An unanswered question
 * (selectedIndex === null) counts as incorrect, matching the real test where
 * only correct answers earn credit.
 */
export function scoreAttempt(
  questions: readonly Question[],
  answers: readonly AnswerItem[],
  passCount: number,
): AttemptResult {
  const selectedById = new Map<string, number | null>();
  for (const a of answers) selectedById.set(a.questionId, a.selectedIndex);

  const items: ScoredItem[] = [];
  const perCategory: Partial<Record<CategoryId, CategoryScore>> = {};
  let correctCount = 0;
  let answered = 0;

  for (const q of questions) {
    const selectedIndex = selectedById.has(q.id)
      ? (selectedById.get(q.id) as number | null)
      : null;
    const correct = selectedIndex === q.correctIndex;
    if (selectedIndex !== null) answered += 1;
    if (correct) correctCount += 1;

    items.push({
      questionId: q.id,
      category: q.category,
      selectedIndex,
      correctIndex: q.correctIndex,
      correct,
    });

    const bucket = perCategory[q.category] ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (correct) bucket.correct += 1;
    perCategory[q.category] = bucket;
  }

  return {
    total: questions.length,
    answered,
    correctCount,
    passCount,
    passed: correctCount >= passCount,
    items,
    perCategory,
  };
}
