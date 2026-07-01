import { CATEGORIES, type CategoryId, type Question } from "@/lib/types";
import { shuffle, type RNG } from "./rng";

/**
 * Return a copy of the question with its answer options shuffled (and
 * `correctIndex` updated). Used at test-build time so the correct answer isn't
 * biased toward a fixed position regardless of how a question was authored.
 */
export function shuffleOptions(q: Question, rng: RNG): Question {
  const order = shuffle(
    q.options.map((_, i) => i),
    rng,
  );
  return {
    ...q,
    options: order.map((i) => q.options[i]),
    correctIndex: order.indexOf(q.correctIndex),
  };
}

/**
 * Allocate `total` slots across categories proportional to their weights using
 * the largest-remainder method, so the per-category counts sum to exactly
 * `total`. Only categories present in `weights` receive slots.
 */
export function allocateByWeight(
  total: number,
  weights: { id: CategoryId; weight: number }[],
): Record<CategoryId, number> {
  const sumW = weights.reduce((s, w) => s + w.weight, 0);
  const result = {} as Record<CategoryId, number>;
  if (sumW <= 0 || total <= 0) {
    for (const w of weights) result[w.id] = 0;
    return result;
  }

  const raw = weights.map((w) => ({
    id: w.id,
    exact: (w.weight / sumW) * total,
  }));
  let assigned = 0;
  for (const r of raw) {
    const floor = Math.floor(r.exact);
    result[r.id] = floor;
    assigned += floor;
  }
  // Distribute the remaining slots to the largest fractional remainders.
  let remaining = total - assigned;
  const byRemainder = raw
    .map((r) => ({ id: r.id, frac: r.exact - Math.floor(r.exact) }))
    .sort((a, b) => b.frac - a.frac);
  let i = 0;
  while (remaining > 0 && byRemainder.length > 0) {
    result[byRemainder[i % byRemainder.length].id] += 1;
    remaining -= 1;
    i += 1;
  }
  return result;
}

/**
 * Build a mock test: pick `count` questions from `pool` using exam-like
 * category weighting, with no repeats. If a category is short, the shortfall is
 * back-filled from the remaining pool. Returns fewer than `count` only when the
 * pool itself is smaller than `count`.
 */
export function buildMockTest(
  pool: readonly Question[],
  count: number,
  rng: RNG,
): Question[] {
  if (pool.length <= count) return shuffle(pool, rng);

  const byCategory = new Map<CategoryId, Question[]>();
  for (const q of pool) {
    const list = byCategory.get(q.category) ?? [];
    list.push(q);
    byCategory.set(q.category, list);
  }

  // Only weight categories that actually have questions in the pool.
  const presentWeights = CATEGORIES.filter((c) => byCategory.has(c.id)).map(
    (c) => ({ id: c.id, weight: c.weight }),
  );
  const targets = allocateByWeight(count, presentWeights);

  const chosen: Question[] = [];
  const chosenIds = new Set<string>();
  for (const { id } of presentWeights) {
    const picks = shuffle(byCategory.get(id) ?? [], rng).slice(0, targets[id]);
    for (const q of picks) {
      chosen.push(q);
      chosenIds.add(q.id);
    }
  }

  // Back-fill any shortfall (categories that had fewer questions than targeted).
  if (chosen.length < count) {
    const remainder = shuffle(
      pool.filter((q) => !chosenIds.has(q.id)),
      rng,
    );
    for (const q of remainder) {
      if (chosen.length >= count) break;
      chosen.push(q);
      chosenIds.add(q.id);
    }
  }

  return shuffle(chosen, rng).map((q) => shuffleOptions(q, rng));
}

/** Per-question performance summary used for adaptive selection. */
export interface QuestionStat {
  seen: number;
  correct: number;
  lastCorrect: boolean;
}

/** A question is considered "mastered" once answered correctly this many times. */
export const MASTERY_TARGET = 2;

/**
 * Selection weight for a question given the learner's history. Higher = more
 * likely to be asked. Unseen and never-correct questions are prioritized;
 * mastered questions are rarely repeated (a little more if recently missed).
 */
export function questionWeight(stat: QuestionStat | undefined): number {
  if (!stat || stat.seen === 0) return 4; // unseen
  if (stat.correct === 0) return 6; // seen but never correct
  if (stat.correct < MASTERY_TARGET) return stat.lastCorrect ? 3 : 4; // still learning
  return stat.lastCorrect ? 1 : 2.5; // mastered (slipped recently → revisit a little)
}

/** Sample up to `n` distinct items by weight, without replacement. */
function weightedSampleN<T>(
  items: readonly T[],
  n: number,
  rng: RNG,
  weightOf: (item: T) => number,
): T[] {
  const pool = items.slice();
  const weights = pool.map((it) => Math.max(0.0001, weightOf(it)));
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const total = weights.reduce((s, w) => s + w, 0);
    let r = rng() * total;
    let idx = 0;
    while (idx < pool.length - 1 && (r -= weights[idx]) > 0) idx += 1;
    out.push(pool[idx]);
    pool.splice(idx, 1);
    weights.splice(idx, 1);
  }
  return out;
}

/**
 * Like {@link buildMockTest}, but biases selection toward questions the learner
 * has not yet mastered (never seen, never answered correctly, or recently
 * missed) based on their history, while keeping exam-like category coverage.
 */
export function buildAdaptiveMockTest(
  pool: readonly Question[],
  count: number,
  rng: RNG,
  stats: Record<string, QuestionStat>,
): Question[] {
  const weightOf = (q: Question) => questionWeight(stats[q.id]);
  if (pool.length <= count) {
    return shuffle(pool, rng).map((q) => shuffleOptions(q, rng));
  }

  const byCategory = new Map<CategoryId, Question[]>();
  for (const q of pool) {
    const list = byCategory.get(q.category) ?? [];
    list.push(q);
    byCategory.set(q.category, list);
  }

  const presentWeights = CATEGORIES.filter((c) => byCategory.has(c.id)).map(
    (c) => ({ id: c.id, weight: c.weight }),
  );
  const targets = allocateByWeight(count, presentWeights);

  const chosen: Question[] = [];
  const chosenIds = new Set<string>();
  for (const { id } of presentWeights) {
    const picks = weightedSampleN(byCategory.get(id) ?? [], targets[id], rng, weightOf);
    for (const q of picks) {
      chosen.push(q);
      chosenIds.add(q.id);
    }
  }

  if (chosen.length < count) {
    const remainder = pool.filter((q) => !chosenIds.has(q.id));
    const fill = weightedSampleN(remainder, count - chosen.length, rng, weightOf);
    for (const q of fill) {
      chosen.push(q);
      chosenIds.add(q.id);
    }
  }

  return shuffle(chosen, rng).map((q) => shuffleOptions(q, rng));
}
