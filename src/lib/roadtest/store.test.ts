import { describe, it, expect, beforeEach } from "vitest";
import { loadState, saveState, readiness, emptyState } from "./store";

describe("road-test self-assessment", () => {
  beforeEach(() => window.localStorage.clear());

  it("computes readiness from ratings", () => {
    const ids = ["a", "b", "c", "d"];
    const r = readiness({ a: "confident", b: "confident", c: "practice" }, ids);
    expect(r).toEqual({ confident: 2, practice: 1, total: 4, pct: 50 });
  });

  it("returns zero readiness with no maneuvers", () => {
    expect(readiness({}, [])).toEqual({
      confident: 0,
      practice: 0,
      total: 0,
      pct: 0,
    });
  });

  it("round-trips state through storage", () => {
    expect(loadState()).toEqual(emptyState());
    saveState({ ratings: { turns: "confident" }, checks: { "byg:0": true } });
    expect(loadState()).toEqual({
      ratings: { turns: "confident" },
      checks: { "byg:0": true },
    });
  });
});
