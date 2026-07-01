import { describe, it, expect } from "vitest";
import { abs, siteJsonLd, faqJsonLd, FAQ, SITE_URL } from "./seo";

describe("seo", () => {
  it("builds absolute URLs from site-relative paths", () => {
    expect(abs("/road-test")).toBe(`${SITE_URL}/road-test`);
    expect(abs("road-test")).toBe(`${SITE_URL}/road-test`);
    expect(abs()).toBe(`${SITE_URL}/`);
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("emits Organization, WebSite and WebApplication structured data", () => {
    const graph = siteJsonLd();
    const types = graph.map((n) => n["@type"]);
    expect(types).toContainEqual("Organization");
    expect(types).toContainEqual("WebSite");
    const webapp = graph.find((n) =>
      Array.isArray(n["@type"]) && (n["@type"] as string[]).includes("WebApplication"),
    );
    expect(webapp).toBeTruthy();
    // Advertised as a free educational app.
    expect(webapp?.offers).toMatchObject({ price: "0" });
    expect(webapp?.isAccessibleForFree).toBe(true);
  });

  it("builds a FAQPage whose questions all have answers", () => {
    const faq = faqJsonLd();
    expect(faq["@type"]).toBe("FAQPage");
    const entities = faq.mainEntity as Array<Record<string, unknown>>;
    expect(entities.length).toBe(FAQ.length);
    expect(entities.length).toBeGreaterThanOrEqual(5);
    for (const q of entities) {
      expect(q["@type"]).toBe("Question");
      expect(typeof q.name).toBe("string");
      const answer = q.acceptedAnswer as Record<string, unknown>;
      expect(answer["@type"]).toBe("Answer");
      expect((answer.text as string).length).toBeGreaterThan(0);
    }
  });
});
