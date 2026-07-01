import { describe, it, expect } from "vitest";
import { QUESTIONS } from "@/data/questions";
import { DIAGRAM_IDS, hasDiagram, resolveDiagramId } from "./Diagram";

describe("diagram resolver", () => {
  it("resolves a diagram for at least 80% of the question bank", () => {
    const withDiagram = QUESTIONS.filter((q) => resolveDiagramId(q)).length;
    const coverage = withDiagram / QUESTIONS.length;
    // Guard the user-requested floor (currently well above it via category
    // defaults + keyword rules).
    expect(coverage).toBeGreaterThanOrEqual(0.8);
  });

  it("only ever returns ids that exist in the library", () => {
    for (const q of QUESTIONS) {
      const id = resolveDiagramId(q);
      if (id) expect(DIAGRAM_IDS.has(id)).toBe(true);
    }
  });

  it("honors an explicit diagramId when the library has it", () => {
    expect(
      resolveDiagramId({
        diagramId: "roundabout",
        category: "parking",
        prompt: "totally unrelated prompt about curbs",
      }),
    ).toBe("roundabout");
  });

  it("falls back to keyword matching, then category default", () => {
    // Keyword match beats the category default.
    expect(
      resolveDiagramId({
        category: "licensing-misc",
        prompt: "When you approach a railroad crossing with a train coming...",
      }),
    ).toBe("railroad-crossing");
    // No keyword hit -> category default.
    expect(
      resolveDiagramId({
        category: "dui-alcohol",
        prompt: "A question with no matchable keyword whatsoever xyzzy",
      }),
    ).toBe("bac-limits");
  });

  it("ignores an explicit diagramId that is not in the library", () => {
    const id = resolveDiagramId({
      diagramId: "does-not-exist",
      category: "right-of-way",
      prompt: "generic prompt",
    });
    expect(id).toBe("yield-intersection");
    expect(hasDiagram("does-not-exist")).toBe(false);
  });
});
