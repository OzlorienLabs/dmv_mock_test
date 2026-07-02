import { describe, it, expect, beforeEach } from "vitest";
import {
  saveAttempt,
  getAttempts,
  clearAttempts,
  deleteAttempt,
  mergeAttempts,
  summarize,
  getSummary,
  questionStats,
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
    answers: [
      { questionId: "q1", selectedIndex: 0 },
      { questionId: "q2", selectedIndex: 1 },
    ],
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

  it("persists the answers array in localStorage round-trip", () => {
    const answers = [
      { questionId: "q1", selectedIndex: 0 },
      { questionId: "q2", selectedIndex: null },
      { questionId: "q3", selectedIndex: 2 },
    ];
    saveAttempt(attempt({ id: "with-answers", answers }));
    const [stored] = getAttempts();
    expect(stored.answers).toEqual(answers);
  });

  it("handles legacy attempts without an answers field", () => {
    // Simulate a pre-answers-era attempt by omitting the field
    const legacy = attempt({ id: "legacy" });
    delete (legacy as unknown as Record<string, unknown>).answers;
    saveAttempt(legacy);
    const [stored] = getAttempts();
    expect(stored.answers).toBeUndefined();
    // Summary still works
    expect(getSummary().attempts).toBe(1);
  });

  it("deletes a single attempt by id, leaving the rest", () => {
    saveAttempt(attempt({ id: "a" }));
    saveAttempt(attempt({ id: "b" }));
    saveAttempt(attempt({ id: "c" }));
    deleteAttempt("b");
    expect(getAttempts().map((a) => a.id)).toEqual(["c", "a"]);
  });

  it("deleting a non-existent id is a no-op", () => {
    saveAttempt(attempt({ id: "a" }));
    deleteAttempt("nope");
    expect(getAttempts().map((a) => a.id)).toEqual(["a"]);
  });

  it("caps stored attempts at 100", () => {
    for (let i = 0; i < 105; i++) {
      saveAttempt(attempt({ id: `a-${i}` }));
    }
    const all = getAttempts();
    expect(all.length).toBe(100);
    // Most recent should be first
    expect(all[0].id).toBe("a-104");
  });
});

describe("mergeAttempts", () => {
  it("de-duplicates by id (first list wins) and sorts most-recent first", () => {
    const local = [
      attempt({ id: "new", dateISO: "2026-03-03T00:00:00.000Z" }),
      attempt({ id: "shared", dateISO: "2026-01-01T00:00:00.000Z", correctCount: 10 }),
    ];
    const cloud = [
      attempt({ id: "shared", dateISO: "2026-01-01T00:00:00.000Z", correctCount: 99 }),
      attempt({ id: "other-device", dateISO: "2026-02-02T00:00:00.000Z" }),
    ];
    const merged = mergeAttempts(local, cloud);
    // Union of ids, no dupes.
    expect(merged.map((a) => a.id)).toEqual(["new", "other-device", "shared"]);
    // First list wins for the shared id (local copy kept).
    expect(merged.find((a) => a.id === "shared")?.correctCount).toBe(10);
  });

  it("never drops a just-saved local attempt behind a lagging cloud list", () => {
    const justSaved = attempt({ id: "just-saved", dateISO: new Date().toISOString() });
    const staleCloud = [attempt({ id: "old", dateISO: "2020-01-01T00:00:00.000Z" })];
    const merged = mergeAttempts([justSaved], staleCloud);
    expect(merged.some((a) => a.id === "just-saved")).toBe(true);
  });
});

describe("questionStats (adaptive history)", () => {
  it("aggregates per-question history with the latest result winning", () => {
    const attempts: StoredAttempt[] = [
      // stored most-recent-first
      attempt({ id: "b", answers: [{ questionId: "q1", selectedIndex: 0, correct: true }] }),
      attempt({
        id: "a",
        answers: [
          { questionId: "q1", selectedIndex: 1, correct: false },
          { questionId: "q2", selectedIndex: 0, correct: true },
        ],
      }),
    ];
    const stats = questionStats(attempts);
    expect(stats.q1).toEqual({ seen: 2, correct: 1, lastCorrect: true });
    expect(stats.q2).toEqual({ seen: 1, correct: 1, lastCorrect: true });
  });

  it("ignores answers without recorded correctness (legacy attempts)", () => {
    const stats = questionStats([
      attempt({ id: "x", answers: [{ questionId: "q9", selectedIndex: 0 }] }),
    ]);
    expect(stats.q9).toBeUndefined();
  });
});
