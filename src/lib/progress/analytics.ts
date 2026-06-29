/**
 * Progress analytics engine.
 *
 * All functions are pure — they derive gamification metrics from the existing
 * StoredAttempt[] array without touching storage. This keeps the module easy
 * to test and lets the UI recompute on every render without side effects.
 */

import type { CategoryId } from "@/lib/types";
import type { StoredAttempt } from "./store";

/* ── Streak tracking ─────────────────────────────────────────── */

/** Extract the local calendar date string (YYYY-MM-DD) from an ISO timestamp. */
function toDateKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Subtract `days` from a date key. */
function subtractDays(dateKey: string, days: number): string {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() - days);
  return toDateKey(d.toISOString());
}

export interface StreakInfo {
  /** Current consecutive calendar-day streak (from today backwards). */
  currentStreak: number;
  /** Longest consecutive calendar-day streak ever recorded. */
  longestStreak: number;
  /** Current consecutive-pass streak (most-recent tests, resets on any fail). */
  passStreak: number;
  /** Did the user practice today? */
  practicedToday: boolean;
}

/**
 * Compute streak data from attempts. Attempts are expected newest-first (as
 * stored). The current streak counts today and goes backwards; if the user
 * hasn't practiced today, a streak starting yesterday still counts (so they
 * don't lose their streak at 00:01).
 */
export function computeStreaks(attempts: StoredAttempt[]): StreakInfo {
  if (attempts.length === 0) {
    return { currentStreak: 0, longestStreak: 0, passStreak: 0, practicedToday: false };
  }

  // Unique practice days
  const daySet = new Set<string>();
  for (const a of attempts) daySet.add(toDateKey(a.dateISO));

  const todayKey = toDateKey(new Date().toISOString());
  const practicedToday = daySet.has(todayKey);

  // Current streak: walk back from today (or yesterday if not practiced today)
  let currentStreak = 0;
  let cursor = practicedToday ? todayKey : subtractDays(todayKey, 1);
  while (daySet.has(cursor)) {
    currentStreak++;
    cursor = subtractDays(cursor, 1);
  }

  // Longest streak: walk all unique days sorted ascending
  const sortedDays = Array.from(daySet).sort();
  let longestStreak = 1;
  let run = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const expected = subtractDays(sortedDays[i], 1);
    if (expected === sortedDays[i - 1]) {
      run++;
      longestStreak = Math.max(longestStreak, run);
    } else {
      run = 1;
    }
  }
  // Edge: if there's only one day, longest is max(1, currentStreak)
  longestStreak = Math.max(longestStreak, currentStreak);

  // Pass streak: consecutive passes from most recent test backwards
  let passStreak = 0;
  for (const a of attempts) {
    if (a.passed) passStreak++;
    else break;
  }

  return { currentStreak, longestStreak, passStreak, practicedToday };
}

/* ── Score trend ──────────────────────────────────────────────── */

export type TrendDirection = "improving" | "steady" | "declining";

export interface ScoreTrend {
  /** Direction of recent score movement. */
  direction: TrendDirection;
  /** Recent test score percentages (oldest first), up to 10 entries. */
  recentScores: number[];
  /** Average of the last 3 tests. */
  recentAvg: number;
  /** Average of the 3 tests before the last 3. */
  previousAvg: number;
}

export function computeScoreTrend(attempts: StoredAttempt[]): ScoreTrend {
  // Reverse so oldest first for the sparkline chart
  const all = [...attempts].reverse();
  const scores = all
    .filter((a) => a.total > 0)
    .map((a) => Math.round((a.correctCount / a.total) * 100));

  const recentScores = scores.slice(-10);
  const last3 = scores.slice(-3);
  const prev3 = scores.slice(-6, -3);

  const avg = (arr: number[]) =>
    arr.length > 0 ? arr.reduce((s, n) => s + n, 0) / arr.length : 0;

  const recentAvg = Math.round(avg(last3));
  const previousAvg = Math.round(avg(prev3));

  let direction: TrendDirection = "steady";
  if (prev3.length > 0 && last3.length > 0) {
    const diff = recentAvg - previousAvg;
    if (diff >= 5) direction = "improving";
    else if (diff <= -5) direction = "declining";
  } else if (last3.length >= 2) {
    // Not enough "previous" batch — compare first vs last in recent
    const diff = last3[last3.length - 1] - last3[0];
    if (diff >= 5) direction = "improving";
    else if (diff <= -5) direction = "declining";
  }

  return { direction, recentScores, recentAvg, previousAvg };
}

/* ── Readiness level ──────────────────────────────────────────── */

export type ReadinessLevel = "not-started" | "learning" | "almost-ready" | "test-ready";

export interface ReadinessInfo {
  level: ReadinessLevel;
  label: string;
  message: string;
}

/**
 * Determine how ready the user is for the real DMV test.
 *
 * Tiers:
 * - test-ready:    Last 3+ full mock tests all passed AND last 2+ practices passed
 * - almost-ready:  Last 2 tests passed OR best score ≥ 90%
 * - learning:      ≥ 3 attempts taken
 * - not-started:   Default
 */
export function computeReadiness(
  attempts: StoredAttempt[],
  bestScorePct: number,
): ReadinessInfo {
  if (attempts.length === 0) {
    return {
      level: "not-started",
      label: "Not Started",
      message: "Take your first practice test to begin tracking your readiness!",
    };
  }

  // Split into mock exams (46 or 36 questions) and quick practices
  const mocks = attempts.filter((a) => a.total >= 36);
  const practices = attempts.filter((a) => a.total < 36 && a.total > 0);

  // Check test-ready: last 3 mocks all passed AND last 2 practices passed
  const lastMocks = mocks.slice(0, 3);
  const lastPractices = practices.slice(0, 2);
  const allMocksPassed = lastMocks.length >= 3 && lastMocks.every((a) => a.passed);
  const practicesPassed =
    lastPractices.length >= 2 && lastPractices.every((a) => a.passed);

  if (allMocksPassed && practicesPassed) {
    return {
      level: "test-ready",
      label: "Test Ready",
      message: "You're consistently acing both practice and mock tests — you're ready for the real DMV test! 🎉",
    };
  }

  // Check almost-ready
  const last2 = attempts.slice(0, 2);
  const last2Passed = last2.length >= 2 && last2.every((a) => a.passed);
  if (last2Passed || bestScorePct >= 90) {
    return {
      level: "almost-ready",
      label: "Almost Ready",
      message: "You're so close! A few more passing tests and you'll be fully prepared.",
    };
  }

  // Learning
  if (attempts.length >= 3) {
    return {
      level: "learning",
      label: "Keep Going",
      message: "You're building knowledge — keep practicing and watch your scores climb!",
    };
  }

  return {
    level: "learning",
    label: "Getting Started",
    message: "Great start! Take a few more tests to build your confidence.",
  };
}

/* ── Trouble questions ────────────────────────────────────────── */

export interface TroubleQuestion {
  questionId: string;
  /** How many times the user got this question wrong. */
  wrongCount: number;
  /** How many times the question was seen in total. */
  seenCount: number;
  /** The ratio of wrong answers (0–1). */
  missRatio: number;
}

/**
 * Find questions the user repeatedly gets wrong. A question is "trouble" if
 * it was answered incorrectly ≥ 2 times across all attempts. Results are
 * sorted by wrongCount descending (worst first).
 */
export function computeTroubleQuestions(
  attempts: StoredAttempt[],
  questionsLookup: Map<string, { prompt: string; category: CategoryId; correctIndex: number; explanation?: string; options: string[] }>,
): TroubleQuestion[] {
  const stats = new Map<string, { wrong: number; seen: number }>();

  for (const attempt of attempts) {
    if (!attempt.answers) continue;
    for (const ans of attempt.answers) {
      const q = questionsLookup.get(ans.questionId);
      if (!q) continue;
      const entry = stats.get(ans.questionId) ?? { wrong: 0, seen: 0 };
      entry.seen++;
      if (ans.selectedIndex !== q.correctIndex) {
        entry.wrong++;
      }
      stats.set(ans.questionId, entry);
    }
  }

  const trouble: TroubleQuestion[] = [];
  for (const [questionId, { wrong, seen }] of stats) {
    if (wrong >= 2) {
      trouble.push({
        questionId,
        wrongCount: wrong,
        seenCount: seen,
        missRatio: wrong / seen,
      });
    }
  }

  return trouble.sort((a, b) => b.wrongCount - a.wrongCount);
}

/* ── Motivation messages ──────────────────────────────────────── */

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start a streak today!";
  if (streak === 1) return "Day 1 — great start!";
  if (streak <= 2) return "Nice momentum! Keep it up!";
  if (streak <= 6) return "You're on fire! 🔥";
  if (streak <= 13) return "Unstoppable! 🏆";
  return `${streak} days — legendary! 👑`;
}

export function getTrendMessage(direction: TrendDirection): string {
  switch (direction) {
    case "improving":
      return "Your scores are improving! 📈";
    case "steady":
      return "Steady progress — stay consistent!";
    case "declining":
      return "Review your weak areas to bounce back! 💪";
  }
}
