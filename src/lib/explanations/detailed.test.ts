import { describe, it, expect } from "vitest";
import { CATEGORIES, type Question } from "@/lib/types";
import { CATEGORY_TIPS } from "@/data/explanations/categoryTips";
import { CONCEPT_TIPS, conceptTipFor } from "@/data/explanations/conceptTips";
import { DETAIL_LANGS, getDetailedExplanation, isDetailLang } from "./detailed";

function q(partial: Partial<Question>): Question {
  return {
    id: "x",
    category: "licensing-misc",
    prompt: "p",
    options: ["a", "b", "c"],
    correctIndex: 0,
    origin: "generated",
    ...partial,
  };
}

describe("detailed explanations", () => {
  it("has non-empty category tips in all three languages", () => {
    for (const c of CATEGORIES) {
      for (const lang of DETAIL_LANGS) {
        expect(CATEGORY_TIPS[c.id][lang].trim().length, `${c.id}/${lang}`).toBeGreaterThan(40);
      }
    }
  });

  it("has non-empty concept tips in all three languages", () => {
    for (const c of CONCEPT_TIPS) {
      for (const lang of DETAIL_LANGS) {
        expect(c[lang].trim().length, `${c.id}/${lang}`).toBeGreaterThan(20);
      }
    }
  });

  it("English includes the correct answer, the point, and a topic tip", () => {
    const sample = q({
      prompt: "Which of these is true about your driver license?",
      options: ["Carry it while driving", "Leave it at home", "Only new drivers carry it"],
      explanation: "Always carry your license while driving.",
    });
    const en = getDetailedExplanation("en", sample);
    expect(en).toContain("Carry it while driving");
    expect(en).toContain("Always carry your license");
    // No concept keyword in the prompt → falls back to the category tip.
    expect(en).toContain(CATEGORY_TIPS["licensing-misc"].en);
  });

  it("uses the matching concept tip when the prompt mentions a concept", () => {
    expect(conceptTipFor("What does a red curb mean?")?.id).toBe("curb-colors");
    const curb = CONCEPT_TIPS.find((c) => c.id === "curb-colors")!;
    const sample = q({
      category: "parking",
      prompt: "What does a red curb mean?",
      options: ["No stopping", "Loading", "Disabled parking"],
      explanation: "Red curbs mean no stopping.",
    });
    expect(getDetailedExplanation("bn", sample)).toBe(curb.bn);
    expect(getDetailedExplanation("es", sample)).toBe(curb.es);
    expect(getDetailedExplanation("en", sample)).toContain(curb.en);
  });

  it("recognizes detail languages", () => {
    expect(isDetailLang("bn")).toBe(true);
    expect(isDetailLang("fr")).toBe(false);
  });
});
