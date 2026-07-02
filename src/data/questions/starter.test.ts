import { describe, it, expect } from "vitest";
import { STARTER_QUESTIONS } from "./starter";

describe("starter questions", () => {
  it("resolves a small, non-empty set of real questions", () => {
    // Enough to front-load the first couple of questions from a bit of variety.
    expect(STARTER_QUESTIONS.length).toBeGreaterThanOrEqual(4);
  });

  it("are well-formed and cover several categories", () => {
    for (const q of STARTER_QUESTIONS) {
      expect(typeof q.id).toBe("string");
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(q.options.length);
    }
    const categories = new Set(STARTER_QUESTIONS.map((q) => q.category));
    expect(categories.size).toBeGreaterThanOrEqual(3);
  });

  it("has unique ids (so they dedupe cleanly against the full build)", () => {
    const ids = STARTER_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
