import type { CategoryId } from "@/lib/types";
import type { TestProfileId } from "@/lib/engine/profiles";
import type { CategoryScore } from "@/lib/engine/scoring";

/**
 * Guest progress persistence.
 *
 * Phase 1 stores attempts in localStorage behind a small async-friendly API so
 * that later phases can swap the backend to IndexedDB and then sync to
 * Firestore on sign-in without changing call sites.
 */

export interface StoredAttempt {
  id: string;
  profileId: TestProfileId;
  dateISO: string;
  total: number;
  correctCount: number;
  passCount: number;
  passed: boolean;
  perCategory: Partial<Record<CategoryId, CategoryScore>>;
}

export interface ProgressSummary {
  attempts: number;
  passes: number;
  lastAttempt: StoredAttempt | null;
  bestScorePct: number;
  perCategory: Partial<Record<CategoryId, CategoryScore>>;
}

const KEY = "dmv:attempts:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getAttempts(): StoredAttempt[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredAttempt[]) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(attempt: StoredAttempt): void {
  if (!isBrowser()) return;
  const all = getAttempts();
  all.unshift(attempt);
  // Keep the most recent 100 attempts.
  window.localStorage.setItem(KEY, JSON.stringify(all.slice(0, 100)));
}

export function clearAttempts(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
}

export function summarize(attempts: StoredAttempt[]): ProgressSummary {
  const perCategory: Partial<Record<CategoryId, CategoryScore>> = {};
  let bestScorePct = 0;

  for (const a of attempts) {
    if (a.total > 0) {
      bestScorePct = Math.max(bestScorePct, (a.correctCount / a.total) * 100);
    }
    for (const [catKey, score] of Object.entries(a.perCategory)) {
      const cat = catKey as CategoryId;
      const s = score as CategoryScore;
      const bucket = perCategory[cat] ?? { correct: 0, total: 0 };
      bucket.correct += s.correct;
      bucket.total += s.total;
      perCategory[cat] = bucket;
    }
  }

  return {
    attempts: attempts.length,
    passes: attempts.filter((a) => a.passed).length,
    lastAttempt: attempts[0] ?? null,
    bestScorePct: Math.round(bestScorePct),
    perCategory,
  };
}

export function getSummary(): ProgressSummary {
  return summarize(getAttempts());
}
