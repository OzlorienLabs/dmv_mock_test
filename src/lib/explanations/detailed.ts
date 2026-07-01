import type { Question } from "@/lib/types";
import { CATEGORY_TIPS } from "@/data/explanations/categoryTips";
import enOverrides from "@/data/explanations/en.json";
import bnOverrides from "@/data/explanations/bn.json";
import esOverrides from "@/data/explanations/es.json";

// Optional per-question explanations. Empty by default; fill them by running
// `scripts/generate-detailed.ts` (English) and `scripts/translate-explanations.ts`
// (Bengali/Spanish) — both build-time with an owner Gemini key. When an entry
// exists it overrides the composed/topic-level text.
const OVERRIDES: Record<DetailLang, Record<string, string>> = {
  en: enOverrides as Record<string, string>,
  bn: bnOverrides as Record<string, string>,
  es: esOverrides as Record<string, string>,
};

/**
 * Detailed explanations available fully offline (no server, no network).
 *
 * - English is question-specific: the correct answer + the question's point +
 *   localized topic guidance.
 * - Bengali / Spanish use the localized topic-level guidance (the same accurate,
 *   fully-translated explanation for every question in that topic). Run
 *   `scripts/translate-explanations.ts` to upgrade these to per-question
 *   translations.
 */
export type DetailLang = "en" | "bn" | "es";

export const DETAIL_LANGS: readonly DetailLang[] = ["en", "bn", "es"] as const;

export const DETAIL_LANG_LABEL: Record<DetailLang, string> = {
  en: "English",
  bn: "Bengali",
  es: "Spanish",
};

export const DETAIL_LANG_BCP47: Record<DetailLang, string> = {
  en: "en-US",
  bn: "bn-IN",
  es: "es-ES",
};

export function isDetailLang(value: string): value is DetailLang {
  return (DETAIL_LANGS as readonly string[]).includes(value);
}

export function getDetailedExplanation(lang: DetailLang, q: Question): string {
  const tip = CATEGORY_TIPS[q.category]?.[lang] ?? "";
  if (lang === "en") {
    const override = OVERRIDES.en[q.id];
    if (override) return override;
    const correct = q.options[q.correctIndex];
    const base = q.explanation?.trim() ? ` ${q.explanation.trim()}` : "";
    return `The correct answer is “${correct}.”${base}\n\n${tip}`.trim();
  }
  // bn/es: per-question translation if generated, else localized topic guidance.
  return OVERRIDES[lang][q.id] ?? tip;
}
