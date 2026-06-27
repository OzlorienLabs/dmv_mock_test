import { describe, it, expect } from "vitest";
import { CATEGORIES, type CategoryId, type Question } from "@/lib/types";
import {
  TEST_PROFILES,
  mulberry32,
  shuffle,
  allocateByWeight,
  buildMockTest,
  scoreAttempt,
} from "./index";

/** Build a synthetic pool with `per` questions in each category. */
function makePool(per: number): Question[] {
  const out: Question[] = [];
  for (const c of CATEGORIES) {
    for (let i = 0; i < per; i++) {
      out.push({
        id: `${c.id}-${i}`,
        category: c.id,
        prompt: `Q ${c.id} ${i}`,
        options: ["a", "b", "c"],
        correctIndex: i % 3,
        origin: "generated",
      });
    }
  }
  return out;
}

describe("test profiles", () => {
  it("encode the real CA pass rules", () => {
    expect(TEST_PROFILES.original.questionCount).toBe(46);
    expect(TEST_PROFILES.original.passCount).toBe(38);
    expect(TEST_PROFILES.renewal.questionCount).toBe(36);
    expect(TEST_PROFILES.renewal.passCount).toBe(30);
  });
});

describe("mulberry32 / shuffle", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it("shuffle preserves all elements", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const out = shuffle(arr, mulberry32(7));
    expect(out).toHaveLength(arr.length);
    expect([...out].sort((x, y) => x - y)).toEqual(arr);
  });
});

describe("allocateByWeight", () => {
  it("sums exactly to the requested total", () => {
    const weights = CATEGORIES.map((c) => ({ id: c.id, weight: c.weight }));
    for (const total of [10, 36, 46, 100]) {
      const alloc = allocateByWeight(total, weights);
      const sum = Object.values(alloc).reduce((s, n) => s + n, 0);
      expect(sum).toBe(total);
    }
  });
});

describe("buildMockTest", () => {
  const pool = makePool(6); // 16 categories * 6 = 96 questions

  it("returns exactly `count` questions with no repeats", () => {
    const test = buildMockTest(pool, 46, mulberry32(1));
    expect(test).toHaveLength(46);
    expect(new Set(test.map((q) => q.id)).size).toBe(46);
  });

  it("is deterministic for the same seed and varies across seeds", () => {
    const t1 = buildMockTest(pool, 46, mulberry32(123)).map((q) => q.id);
    const t2 = buildMockTest(pool, 46, mulberry32(123)).map((q) => q.id);
    const t3 = buildMockTest(pool, 46, mulberry32(999)).map((q) => q.id);
    expect(t1).toEqual(t2);
    expect(t1).not.toEqual(t3);
  });

  it("back-fills when a category is short", () => {
    // Only two small categories have questions; sampler must still hit count.
    const sparse: Question[] = [];
    const cats: CategoryId[] = ["parking", "insurance"];
    for (const cat of cats) {
      for (let i = 0; i < 30; i++) {
        sparse.push({
          id: `${cat}-${i}`,
          category: cat,
          prompt: "q",
          options: ["a", "b", "c"],
          correctIndex: 0,
          origin: "generated",
        });
      }
    }
    const test = buildMockTest(sparse, 46, mulberry32(5));
    expect(test).toHaveLength(46);
    expect(new Set(test.map((q) => q.id)).size).toBe(46);
  });

  it("returns the whole pool (shuffled) when it is smaller than count", () => {
    const small = makePool(1).slice(0, 10);
    const test = buildMockTest(small, 46, mulberry32(2));
    expect(test).toHaveLength(10);
  });
});

describe("scoreAttempt", () => {
  const questions: Question[] = [
    { id: "q1", category: "parking", prompt: "p", options: ["a", "b"], correctIndex: 0, origin: "generated" },
    { id: "q2", category: "parking", prompt: "p", options: ["a", "b"], correctIndex: 1, origin: "generated" },
    { id: "q3", category: "speed-limits", prompt: "p", options: ["a", "b"], correctIndex: 0, origin: "generated" },
  ];

  it("counts correct answers and unanswered as incorrect", () => {
    const result = scoreAttempt(
      questions,
      [
        { questionId: "q1", selectedIndex: 0 }, // correct
        { questionId: "q2", selectedIndex: 0 }, // wrong
        { questionId: "q3", selectedIndex: null }, // unanswered
      ],
      2,
    );
    expect(result.correctCount).toBe(1);
    expect(result.answered).toBe(2);
    expect(result.total).toBe(3);
    expect(result.passed).toBe(false);
  });

  it("passes at exactly the threshold", () => {
    const result = scoreAttempt(
      questions,
      [
        { questionId: "q1", selectedIndex: 0 },
        { questionId: "q2", selectedIndex: 1 },
        { questionId: "q3", selectedIndex: 1 },
      ],
      2,
    );
    expect(result.correctCount).toBe(2);
    expect(result.passed).toBe(true);
  });

  it("aggregates per-category scores", () => {
    const result = scoreAttempt(
      questions,
      [
        { questionId: "q1", selectedIndex: 0 },
        { questionId: "q2", selectedIndex: 1 },
        { questionId: "q3", selectedIndex: 1 },
      ],
      2,
    );
    expect(result.perCategory.parking).toEqual({ correct: 2, total: 2 });
    expect(result.perCategory["speed-limits"]).toEqual({ correct: 0, total: 1 });
  });
});
