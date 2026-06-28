/**
 * On-device self-assessment for the road-test module: per-maneuver confidence
 * ratings and checklist state. Kept local (study aid); not synced to the cloud.
 */
export type Rating = "confident" | "practice";

export interface RoadTestState {
  ratings: Record<string, Rating>;
  checks: Record<string, boolean>;
}

export interface Readiness {
  confident: number;
  practice: number;
  total: number;
  pct: number;
}

const KEY = "dmv:roadtest:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function emptyState(): RoadTestState {
  return { ratings: {}, checks: {} };
}

export function loadState(): RoadTestState {
  if (!isBrowser()) return emptyState();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyState();
    const p = JSON.parse(raw);
    return { ratings: p.ratings ?? {}, checks: p.checks ?? {} };
  } catch {
    return emptyState();
  }
}

export function saveState(state: RoadTestState): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function readiness(
  ratings: Record<string, Rating>,
  maneuverIds: string[],
): Readiness {
  let confident = 0;
  let practice = 0;
  for (const id of maneuverIds) {
    if (ratings[id] === "confident") confident += 1;
    else if (ratings[id] === "practice") practice += 1;
  }
  const total = maneuverIds.length;
  return {
    confident,
    practice,
    total,
    pct: total ? Math.round((confident / total) * 100) : 0,
  };
}
