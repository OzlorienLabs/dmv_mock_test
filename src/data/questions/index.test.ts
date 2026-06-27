import { describe, it, expect } from "vitest";
import { QUESTIONS, validateQuestions } from "./index";

describe("question bank", () => {
  it("has no structural issues (quality gate)", () => {
    const issues = validateQuestions(QUESTIONS);
    // Print details if anything is wrong, then assert none.
    expect(issues, JSON.stringify(issues, null, 2)).toEqual([]);
  });

  it("aggregates official + generated questions with a healthy total", () => {
    expect(QUESTIONS.length).toBeGreaterThan(150);
    const official = QUESTIONS.filter((q) => q.origin === "official_dmv");
    expect(official.length).toBeGreaterThanOrEqual(30);
    expect(QUESTIONS.some((q) => q.origin === "generated")).toBe(true);
  });

  it("every official or sourced question carries a source link", () => {
    for (const q of QUESTIONS.filter((q) => q.origin !== "generated")) {
      expect(q.sourceUrl, `${q.id} missing sourceUrl`).toBeTruthy();
    }
  });

  it("covers every category", () => {
    const cats = new Set(QUESTIONS.map((q) => q.category));
    expect(cats.size).toBe(16);
  });

  it("every question has an explanation (powers audio explanations)", () => {
    const missing = QUESTIONS.filter((q) => !q.explanation?.trim()).map((q) => q.id);
    expect(missing, `missing explanation: ${missing.join(", ")}`).toEqual([]);
  });
});
