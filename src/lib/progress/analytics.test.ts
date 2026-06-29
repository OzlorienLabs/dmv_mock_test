import { describe, expect, it } from "vitest";
import {
  computeStreaks,
  computeScoreTrend,
  computeReadiness,
  computeTroubleQuestions,
  getStreakMessage,
  getTrendMessage,
} from "./analytics";
import type { StoredAttempt } from "./store";

/* ── Helpers ─────────────────────────────────────────────────── */

function makeAttempt(overrides: Partial<StoredAttempt> = {}): StoredAttempt {
  return {
    id: `test-${Math.random().toString(36).slice(2)}`,
    profileId: "original",
    dateISO: new Date().toISOString(),
    total: 46,
    correctCount: 40,
    passCount: 38,
    passed: true,
    perCategory: {},
    answers: [],
    ...overrides,
  };
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/* ── Streaks ─────────────────────────────────────────────────── */

describe("computeStreaks", () => {
  it("returns zeros for no attempts", () => {
    const result = computeStreaks([]);
    expect(result.currentStreak).toBe(0);
    expect(result.longestStreak).toBe(0);
    expect(result.passStreak).toBe(0);
    expect(result.practicedToday).toBe(false);
  });

  it("counts a single day as streak of 1", () => {
    const result = computeStreaks([makeAttempt({ dateISO: daysAgo(0) })]);
    expect(result.currentStreak).toBe(1);
    expect(result.practicedToday).toBe(true);
  });

  it("counts consecutive days", () => {
    const attempts = [
      makeAttempt({ dateISO: daysAgo(0) }),
      makeAttempt({ dateISO: daysAgo(1) }),
      makeAttempt({ dateISO: daysAgo(2) }),
    ];
    const result = computeStreaks(attempts);
    expect(result.currentStreak).toBe(3);
  });

  it("streak breaks on gap", () => {
    const attempts = [
      makeAttempt({ dateISO: daysAgo(0) }),
      // day 1 missing
      makeAttempt({ dateISO: daysAgo(2) }),
    ];
    const result = computeStreaks(attempts);
    expect(result.currentStreak).toBe(1);
  });

  it("yesterday start still counts if no practice today", () => {
    const attempts = [
      makeAttempt({ dateISO: daysAgo(1) }),
      makeAttempt({ dateISO: daysAgo(2) }),
    ];
    const result = computeStreaks(attempts);
    expect(result.currentStreak).toBe(2);
    expect(result.practicedToday).toBe(false);
  });

  it("pass streak counts consecutive passes", () => {
    const attempts = [
      makeAttempt({ passed: true }),
      makeAttempt({ passed: true }),
      makeAttempt({ passed: false }),
      makeAttempt({ passed: true }),
    ];
    const result = computeStreaks(attempts);
    expect(result.passStreak).toBe(2);
  });

  it("pass streak is 0 if most recent failed", () => {
    const attempts = [
      makeAttempt({ passed: false }),
      makeAttempt({ passed: true }),
    ];
    const result = computeStreaks(attempts);
    expect(result.passStreak).toBe(0);
  });
});

/* ── Score trend ─────────────────────────────────────────────── */

describe("computeScoreTrend", () => {
  it("returns steady for too few tests", () => {
    const result = computeScoreTrend([makeAttempt()]);
    expect(result.direction).toBe("steady");
    expect(result.recentScores.length).toBe(1);
  });

  it("detects improving trend", () => {
    const attempts = [
      // newest first in the input array
      makeAttempt({ correctCount: 44, total: 46 }), // 96%
      makeAttempt({ correctCount: 42, total: 46 }), // 91%
      makeAttempt({ correctCount: 40, total: 46 }), // 87%
      makeAttempt({ correctCount: 30, total: 46 }), // 65%
      makeAttempt({ correctCount: 28, total: 46 }), // 61%
      makeAttempt({ correctCount: 26, total: 46 }), // 57%
    ];
    const result = computeScoreTrend(attempts);
    expect(result.direction).toBe("improving");
  });

  it("detects declining trend", () => {
    const attempts = [
      makeAttempt({ correctCount: 26, total: 46 }), // 57%
      makeAttempt({ correctCount: 28, total: 46 }), // 61%
      makeAttempt({ correctCount: 30, total: 46 }), // 65%
      makeAttempt({ correctCount: 44, total: 46 }), // 96%
      makeAttempt({ correctCount: 42, total: 46 }), // 91%
      makeAttempt({ correctCount: 40, total: 46 }), // 87%
    ];
    const result = computeScoreTrend(attempts);
    expect(result.direction).toBe("declining");
  });
});

/* ── Readiness ───────────────────────────────────────────────── */

describe("computeReadiness", () => {
  it("returns not-started with no attempts", () => {
    expect(computeReadiness([], 0).level).toBe("not-started");
  });

  it("returns learning with 3+ attempts", () => {
    const attempts = [makeAttempt({ passed: false }), makeAttempt({ passed: false }), makeAttempt({ passed: false })];
    expect(computeReadiness(attempts, 70).level).toBe("learning");
  });

  it("returns almost-ready when last 2 passed", () => {
    const attempts = [
      makeAttempt({ passed: true }),
      makeAttempt({ passed: true }),
      makeAttempt({ passed: false }),
    ];
    expect(computeReadiness(attempts, 80).level).toBe("almost-ready");
  });

  it("returns almost-ready with best score >= 90", () => {
    const attempts = [makeAttempt({ passed: false }), makeAttempt({ passed: false })];
    expect(computeReadiness(attempts, 92).level).toBe("almost-ready");
  });

  it("returns test-ready with 3 mock passes + 2 practice passes", () => {
    const attempts = [
      makeAttempt({ total: 46, passed: true }),
      makeAttempt({ total: 46, passed: true }),
      makeAttempt({ total: 46, passed: true }),
      makeAttempt({ total: 10, passed: true }),
      makeAttempt({ total: 10, passed: true }),
    ];
    expect(computeReadiness(attempts, 95).level).toBe("test-ready");
  });
});

/* ── Trouble questions ───────────────────────────────────────── */

describe("computeTroubleQuestions", () => {
  it("returns empty for no attempts", () => {
    expect(computeTroubleQuestions([], new Map())).toEqual([]);
  });

  it("identifies questions wrong >= 2 times", () => {
    const qLookup = new Map([
      ["q1", { prompt: "Q1", category: "parking" as const, correctIndex: 0, options: ["A", "B"] }],
      ["q2", { prompt: "Q2", category: "parking" as const, correctIndex: 1, options: ["A", "B"] }],
    ]);
    const attempts: StoredAttempt[] = [
      makeAttempt({
        answers: [
          { questionId: "q1", selectedIndex: 1 }, // wrong
          { questionId: "q2", selectedIndex: 1 }, // correct
        ],
      }),
      makeAttempt({
        answers: [
          { questionId: "q1", selectedIndex: 2 }, // wrong
          { questionId: "q2", selectedIndex: 0 }, // wrong
        ],
      }),
      makeAttempt({
        answers: [
          { questionId: "q1", selectedIndex: 1 }, // wrong (3rd time)
        ],
      }),
    ];

    const result = computeTroubleQuestions(attempts, qLookup);
    expect(result.length).toBe(1); // Only q1 has 2+ wrongs; q2 only 1 wrong
    expect(result[0].questionId).toBe("q1");
    expect(result[0].wrongCount).toBe(3);
    expect(result[0].seenCount).toBe(3);
  });
});

/* ── Messages ────────────────────────────────────────────────── */

describe("getStreakMessage", () => {
  it("handles zero", () => expect(getStreakMessage(0)).toContain("Start"));
  it("handles high streak", () => expect(getStreakMessage(14)).toContain("legendary"));
});

describe("getTrendMessage", () => {
  it("handles improving", () => expect(getTrendMessage("improving")).toContain("improving"));
  it("handles declining", () => expect(getTrendMessage("declining")).toContain("bounce back"));
});
