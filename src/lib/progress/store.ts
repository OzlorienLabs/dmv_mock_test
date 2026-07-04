import type { CategoryId } from "@/lib/types";
import type { TestProfileId } from "@/lib/engine/profiles";
import type { CategoryScore } from "@/lib/engine/scoring";
import type { QuestionStat } from "@/lib/engine/sampler";

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
  /** Per-question answers recorded for review and adaptive selection. */
  answers?: {
    questionId: string;
    selectedIndex: number | null;
    /** Whether this answer was correct (recorded since the adaptive update). */
    correct?: boolean;
  }[];
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

/** Remove a single attempt from on-device history and tombstone its id. */
export function deleteAttempt(id: string): void {
  if (!isBrowser()) return;
  const remaining = getAttempts().filter((a) => a.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(remaining));
  addDeletedIds([id]);
}

/**
 * Tombstones — ids of attempts the user has deleted. Persisted (and synced to
 * the cloud) so a deletion propagates across devices and a deleted attempt is
 * never re-added by a merge/re-push from another device that still has it.
 */
const DELETED_KEY = "dmv:deleted:v1";
const DELETED_CAP = 1000;

export function getDeletedIds(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(DELETED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

/** Union `ids` into the on-device tombstone set; returns the full set. */
export function addDeletedIds(ids: string[]): string[] {
  const merged = setDeletedIds([...getDeletedIds(), ...ids]);
  return merged;
}

/** Replace the on-device tombstone set (de-duped, capped); returns it. */
export function setDeletedIds(ids: string[]): string[] {
  const unique = [...new Set(ids)].slice(-DELETED_CAP);
  if (isBrowser()) {
    window.localStorage.setItem(DELETED_KEY, JSON.stringify(unique));
  }
  return unique;
}

/** Drop any attempts whose id has been tombstoned. */
export function withoutDeleted(
  attempts: StoredAttempt[],
  deletedIds: Iterable<string>,
): StoredAttempt[] {
  const gone = new Set(deletedIds);
  return attempts.filter((a) => !gone.has(a.id));
}

/**
 * Merge attempt lists, de-duplicating by id (earlier lists win, so pass the
 * most-authoritative/most-recent source first) and sorting most-recent first.
 * Used so an optimistic local update is never dropped by a lagging cloud read.
 */
export function mergeAttempts(...lists: StoredAttempt[][]): StoredAttempt[] {
  const byId = new Map<string, StoredAttempt>();
  for (const list of lists) {
    for (const a of list) {
      if (!byId.has(a.id)) byId.set(a.id, a);
    }
  }
  return [...byId.values()].sort((x, y) =>
    x.dateISO < y.dateISO ? 1 : x.dateISO > y.dateISO ? -1 : 0,
  );
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

/**
 * Aggregate per-question performance from attempt history, used to drive
 * adaptive question selection (focus on questions not yet mastered). Attempts
 * are stored most-recent-first; we iterate oldest→newest so `lastCorrect`
 * reflects the most recent result.
 */
export function questionStats(
  attempts: StoredAttempt[],
): Record<string, QuestionStat> {
  const stats: Record<string, QuestionStat> = {};
  for (let i = attempts.length - 1; i >= 0; i--) {
    const answers = attempts[i].answers;
    if (!answers) continue;
    for (const ans of answers) {
      if (ans.selectedIndex === null || ans.correct === undefined) continue;
      const s = stats[ans.questionId] ?? { seen: 0, correct: 0, lastCorrect: false };
      s.seen += 1;
      if (ans.correct) s.correct += 1;
      s.lastCorrect = ans.correct === true;
      stats[ans.questionId] = s;
    }
  }
  return stats;
}
