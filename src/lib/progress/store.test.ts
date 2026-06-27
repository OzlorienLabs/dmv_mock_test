import { describe, it, expect, beforeEach } from "vitest";
import {
  saveAttempt,
  getAttempts,
  clearAttempts,
  summarize,
  getSummary,
  type StoredAttempt,
} from "./store";

function attempt(partial: Partial<StoredAttempt> = {}): StoredAttempt {
  return {
    id: Math.random().toString(36).slice(2),
    profileId: "original",
    dateISO: new Date().toISOString(),
    total: 46,
    correctCount: 40,
    passCount: 38,
    passed: true,
    perCategory: { parking: { correct: 3, total: 4 } },
    ...partial,
  };
}

describe("progress store", () => {
  beforeEach(() => clearAttempts());

  it("saves and reads attempts (most recent first)", () => {
    saveAttempt(attempt({ id: "a" }));
    saveAttempt(attempt({ id: "b" }));
    const all = getAttempts();
    expect(all.map((a) => a.id)).toEqual(["b", "a"]);
  });

  it("summarizes passes, best score, and per-category totals", () => {
    const summary = summarize([
      attempt({ correctCount: 40, total: 46, passed: true, perCategory: { parking: { correct: 3, total: 4 } } }),
      attempt({ correctCount: 30, total: 46, passed: false, perCategory: { parking: { correct: 1, total: 2 } } }),
    ]);
    expect(summary.attempts).toBe(2);
    expect(summary.passes).toBe(1);
    expect(summary.bestScorePct).toBe(Math.round((40 / 46) * 100));
    expect(summary.perCategory.parking).toEqual({ correct: 4, total: 6 });
  });

  it("getSummary reflects saved attempts", () => {
    saveAttempt(attempt({ passed: false, correctCount: 20 }));
    expect(getSummary().attempts).toBe(1);
    expect(getSummary().passes).toBe(0);
  });
});
