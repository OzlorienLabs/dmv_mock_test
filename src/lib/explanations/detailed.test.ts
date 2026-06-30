import { describe, it, expect } from "vitest";
import { CATEGORIES, type Question } from "@/lib/types";
import { CATEGORY_TIPS } from "@/data/explanations/categoryTips";
import {
  DETAIL_LANGS,
  getDetailedExplanation,
  isDetailLang,
} from "./detailed";

const sample: Question = {
  id: "x",
  category: "parking",
  prompt: "A red curb means?",
  options: ["No stopping", "Loading", "Disabled"],
  correctIndex: 0,
  explanation: "Red curbs mean no stopping at any time.",
  origin: "generated",
};

describe("detailed explanations", () => {
  it("has a non-empty tip for every category in all three languages", () => {
    for (const c of CATEGORIES) {
      const tip = CATEGORY_TIPS[c.id];
      expect(tip, `missing tips for ${c.id}`).toBeTruthy();
      for (const lang of DETAIL_LANGS) {
        expect(tip[lang].trim().length, `${c.id}/${lang}`).toBeGreaterThan(40);
      }
    }
  });

  it("English includes the correct answer and the question's point", () => {
    const en = getDetailedExplanation("en", sample);
    expect(en).toContain("No stopping");
    expect(en).toContain("Red curbs mean no stopping");
    expect(en).toContain(CATEGORY_TIPS.parking.en);
  });

  it("Bengali and Spanish return the localized topic explanation", () => {
    expect(getDetailedExplanation("bn", sample)).toBe(CATEGORY_TIPS.parking.bn);
    expect(getDetailedExplanation("es", sample)).toBe(CATEGORY_TIPS.parking.es);
  });

  it("recognizes detail languages", () => {
    expect(isDetailLang("bn")).toBe(true);
    expect(isDetailLang("fr")).toBe(false);
  });
});
