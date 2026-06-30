/**
 * OPTIONAL owner-run upgrade (build-time, not runtime).
 *
 * Translates each question's detailed English explanation into per-question
 * Bengali and Spanish and writes them to src/data/explanations/{bn,es}.json.
 * Those files are bundled into the app and read fully offline — the app speaks
 * them with the browser, so there is no server call at runtime.
 *
 * Without running this, the app already shows detailed English per question and
 * accurate topic-level Bengali/Spanish; this just makes BN/ES per-question.
 *
 * Usage:
 *   GEMINI_API_KEY=AIza... npx tsx scripts/translate-explanations.ts [--missing] [--limit N]
 *     --missing   only translate questions not already present
 *     --limit N   stop after N questions per language (for a quick trial)
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { GoogleGenAI } from "@google/genai";
import { QUESTIONS } from "../src/data/questions/index.ts";
import { CATEGORY_TIPS } from "../src/data/explanations/categoryTips.ts";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Set GEMINI_API_KEY.");
  process.exit(1);
}
const model = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
const ai = new GoogleGenAI({ apiKey });

const TARGETS: Record<string, string> = { bn: "Bengali", es: "Spanish" };
const onlyMissing = process.argv.includes("--missing");
const limIdx = process.argv.indexOf("--limit");
const limit = limIdx > -1 ? Number(process.argv[limIdx + 1]) : Infinity;

function englishDetailed(q: (typeof QUESTIONS)[number]): string {
  const correct = q.options[q.correctIndex];
  const base = q.explanation ? ` ${q.explanation}` : "";
  return `The correct answer is "${correct}."${base}\n\n${CATEGORY_TIPS[q.category].en}`;
}

function load(path: string): Record<string, string> {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
}

async function translate(text: string, language: string): Promise<string> {
  const res = await ai.models.generateContent({
    model,
    contents:
      `Translate this California DMV study explanation into ${language}. ` +
      `Keep it clear, natural, and accurate for a learner. Output only the translation.\n\n${text}`,
  });
  return (res.text ?? "").trim();
}

async function main() {
  for (const [code, language] of Object.entries(TARGETS)) {
    const path = `src/data/explanations/${code}.json`;
    const out = load(path);
    let translated = 0;
    for (const q of QUESTIONS) {
      if (translated >= limit) break;
      if (onlyMissing && out[q.id]) continue;
      try {
        out[q.id] = await translate(englishDetailed(q), language);
        translated += 1;
      } catch (e) {
        console.warn(`skip ${q.id}/${code}: ${(e as Error).message}`);
      }
      if (translated % 25 === 0) {
        writeFileSync(path, JSON.stringify(out));
        console.log(`${code}: ${translated} translated`);
      }
    }
    writeFileSync(path, `${JSON.stringify(out, null, 2)}\n`);
    console.log(`Wrote ${path} (${Object.keys(out).length} entries).`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
