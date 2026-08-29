import { describe, it, expect } from "vitest";
import {
  buildAdaptiveMockTest,
  mulberry32,
  scoreAttempt,
  shuffleOptions,
} from "@/lib/engine";
import type { Question } from "@/lib/types";
import { resolveReviewItems } from "./review";
import type { StoredAttempt } from "./store";

/**
 * The bug these tests lock down: a test shuffles each question's options per
 * attempt, so the recorded `selectedIndex` points into the SHUFFLED option
 * list. The review screen re-resolves the question from the canonical bank, so
 * it must un-shuffle before interpreting that index — otherwise a correct
 * answer is reported as wrong.
 */

const BANK: Question[] = [
  {
    id: "q1",
    category: "parking",
    prompt: "Where may you park?",
    options: ["RIGHT", "wrong-a", "wrong-b"],
    correctIndex: 0,
    origin: "generated",
  },
  {
    id: "q2",
    category: "freeway",
    prompt: "Merging speed?",
    options: ["wrong-a", "RIGHT", "wrong-b"],
    correctIndex: 1,
    origin: "generated",
  },
];

const BANK_MAP = new Map(BANK.map((q) => [q.id, q]));

function answersFrom(
  shown: Question[],
  pick: (q: Question) => number | null,
): NonNullable<StoredAttempt["answers"]> {
  const result = scoreAttempt(
    shown,
    shown.map((q) => ({ questionId: q.id, selectedIndex: pick(q) })),
    shown.length,
  );
  return result.items.map((it) => ({
    questionId: it.questionId,
    selectedIndex: it.selectedIndex,
    correct: it.correct,
    ...(it.optionOrder ? { optionOrder: it.optionOrder } : {}),
  }));
}

describe("resolveReviewItems", () => {
  it("reports an answer scored correct at test time as correct in review", () => {
    // Every seed, so a lucky identity shuffle can't hide the bug.
    for (let seed = 1; seed <= 50; seed++) {
      const shown = buildAdaptiveMockTest(BANK, BANK.length, mulberry32(seed), {});
      const answers = answersFrom(shown, (q) => q.options.indexOf("RIGHT"));

      const { items } = resolveReviewItems(answers, BANK_MAP);

      expect(items).toHaveLength(BANK.length);
      for (const item of items) {
        expect(item.outcome).toBe("correct");
        // The highlighted "your answer" must be the option they actually chose.
        expect(item.selectedIndex).not.toBeNull();
        expect(item.question.options[item.selectedIndex!]).toBe("RIGHT");
        expect(item.question.correctIndex).toBe(item.selectedIndex);
      }
    }
  });

  it("reports a wrong answer as wrong, pointing at the option actually chosen", () => {
    for (let seed = 1; seed <= 50; seed++) {
      const shown = buildAdaptiveMockTest(BANK, BANK.length, mulberry32(seed), {});
      const answers = answersFrom(shown, (q) => q.options.indexOf("wrong-b"));

      const { items } = resolveReviewItems(answers, BANK_MAP);

      for (const item of items) {
        expect(item.outcome).toBe("wrong");
        expect(item.question.options[item.selectedIndex!]).toBe("wrong-b");
        expect(item.question.options[item.question.correctIndex]).toBe("RIGHT");
      }
    }
  });

  it("shows the options in the same order the learner saw them", () => {
    const shown = buildAdaptiveMockTest(BANK, BANK.length, mulberry32(3), {});
    const answers = answersFrom(shown, (q) => q.options.indexOf("RIGHT"));

    const { items } = resolveReviewItems(answers, BANK_MAP);

    for (const item of items) {
      const asShown = shown.find((q) => q.id === item.question.id)!;
      expect(item.question.options).toEqual(asShown.options);
      expect(item.question.correctIndex).toBe(asShown.correctIndex);
    }
  });

  it("preserves the recorded answer order and question identity", () => {
    const shown = buildAdaptiveMockTest(BANK, BANK.length, mulberry32(11), {});
    const answers = answersFrom(shown, (q) => q.options.indexOf("RIGHT"));

    const { items } = resolveReviewItems(answers, BANK_MAP);

    expect(items.map((i) => i.question.id)).toEqual(answers.map((a) => a.questionId));
  });

  it("marks an unanswered question as skipped", () => {
    const shown = buildAdaptiveMockTest(BANK, BANK.length, mulberry32(5), {});
    const answers = answersFrom(shown, () => null);

    const { items } = resolveReviewItems(answers, BANK_MAP);

    for (const item of items) {
      expect(item.outcome).toBe("skipped");
      expect(item.selectedIndex).toBeNull();
    }
  });

  it("counts questions that are no longer in the bank as skipped-over", () => {
    const shown = buildAdaptiveMockTest(BANK, BANK.length, mulberry32(9), {});
    const answers = [
      ...answersFrom(shown, (q) => q.options.indexOf("RIGHT")),
      { questionId: "retired-question", selectedIndex: 0, correct: false },
    ];

    const { items, missing } = resolveReviewItems(answers, BANK_MAP);

    expect(missing).toBe(1);
    expect(items).toHaveLength(BANK.length);
  });

  describe("legacy attempts recorded before the option order was saved", () => {
    const legacy = (
      selectedIndex: number | null,
      correct?: boolean,
    ): NonNullable<StoredAttempt["answers"]> => [
      { questionId: "q1", selectedIndex, ...(correct === undefined ? {} : { correct }) },
    ];

    it("trusts the recorded `correct` flag over the raw index", () => {
      // selectedIndex 2 is wrong against the canonical bank, but the attempt
      // recorded it as correct (it was index 2 of the shuffled list).
      const { items } = resolveReviewItems(legacy(2, true), BANK_MAP);

      expect(items[0].outcome).toBe("correct");
      // We can recover WHICH option: the correct one.
      expect(items[0].question.options[items[0].selectedIndex!]).toBe("RIGHT");
    });

    it("reports a wrong legacy answer as wrong without inventing a choice", () => {
      const { items } = resolveReviewItems(legacy(0, false), BANK_MAP);

      expect(items[0].outcome).toBe("wrong");
      // index 0 is "RIGHT" in the bank — we must NOT highlight it as their pick.
      expect(items[0].selectedIndex).toBeNull();
    });

    it("still reports a skipped legacy answer as skipped", () => {
      const { items } = resolveReviewItems(legacy(null, false), BANK_MAP);

      expect(items[0].outcome).toBe("skipped");
      expect(items[0].selectedIndex).toBeNull();
    });

    it("falls back to the raw index when no `correct` flag was recorded", () => {
      expect(resolveReviewItems(legacy(0), BANK_MAP).items[0].outcome).toBe("correct");
      expect(resolveReviewItems(legacy(1), BANK_MAP).items[0].outcome).toBe("wrong");
    });
  });

  it("ignores a corrupt option order rather than rendering garbage", () => {
    const answers = [
      { questionId: "q1", selectedIndex: 0, correct: true, optionOrder: [0, 1] },
    ];

    const { items } = resolveReviewItems(answers, BANK_MAP);

    expect(items[0].question.options).toEqual(BANK[0].options);
    expect(items[0].outcome).toBe("correct");
  });

  it("agrees with the score the attempt was saved with", () => {
    const shown = buildAdaptiveMockTest(BANK, BANK.length, mulberry32(21), {});
    // First right, second wrong.
    const answers = answersFrom(shown, (q) =>
      q.id === "q1" ? q.options.indexOf("RIGHT") : q.options.indexOf("wrong-a"),
    );

    const { items } = resolveReviewItems(answers, BANK_MAP);

    const reviewCorrect = items.filter((i) => i.outcome === "correct").length;
    const storedCorrect = answers.filter((a) => a.correct).length;
    expect(reviewCorrect).toBe(storedCorrect);
    expect(reviewCorrect).toBe(1);
  });

  it("handles a question whose options were not shuffled at all", () => {
    // Defensive: a question shown straight from the bank (no optionOrder).
    const answers = [{ questionId: "q2", selectedIndex: 1, correct: true }];

    const { items } = resolveReviewItems(answers, BANK_MAP);

    expect(items[0].outcome).toBe("correct");
    expect(items[0].question.options).toEqual(BANK[1].options);
  });

  it("round-trips a hand-built shuffled question", () => {
    const shownQ = shuffleOptions(BANK[0], mulberry32(42));
    const chosen = shownQ.options.indexOf("wrong-a");
    const answers = [
      {
        questionId: "q1",
        selectedIndex: chosen,
        correct: false,
        optionOrder: shownQ.optionOrder,
      },
    ];

    const { items } = resolveReviewItems(answers, BANK_MAP);

    expect(items[0].question.options).toEqual(shownQ.options);
    expect(items[0].selectedIndex).toBe(chosen);
    expect(items[0].outcome).toBe("wrong");
  });
});
