/**
 * Small seedable PRNG so mock tests can be deterministic when a seed is given
 * (used by curated tests and by unit tests) and random otherwise.
 */
export type RNG = () => number;

/** mulberry32: fast, good-enough 32-bit seeded generator. */
export function mulberry32(seed: number): RNG {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}

/** Fisher–Yates shuffle returning a new array. */
export function shuffle<T>(items: readonly T[], rng: RNG): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Pick up to `n` distinct items (by reference) from `items`. */
export function pickN<T>(items: readonly T[], n: number, rng: RNG): T[] {
  return shuffle(items, rng).slice(0, Math.max(0, n));
}
