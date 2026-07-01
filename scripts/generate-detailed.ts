/**
 * OPTIONAL owner-run (build-time): generate a detailed, question-specific English
 * explanation for each question with Gemini and write
 * src/data/explanations/en.json. That file is bundled and read fully offline at
 * runtime (the app prefers it over the composed explanation).
 *
 * Usage:
 *   GEMINI_API_KEY=AIza... npx tsx scripts/generate-detailed.ts [--scenarios-only] [--missing] [--limit N]
 *     --scenarios-only   only the hand-authored scenarios*.ts questions
 *     --missing          skip questions already present in en.json
 *     --limit N          stop after N questions (quick trial)
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { GoogleGenAI } from "@google/genai";
import { QUESTIONS } from "../src/data/questions/index.ts";
import { SCENARIO_QUESTIONS } from "../src/data/questions/scenarios.ts";
import { SCENARIO2_QUESTIONS } from "../src/data/questions/scenarios2.ts";
import { SCENARIO3_QUESTIONS } from "../src/data/questions/scenarios3.ts";
import { SCENARIO4_QUESTIONS } from "../src/data/questions/scenarios4.ts";
import { SCENARIO5_QUESTIONS } from "../src/data/questions/scenarios5.ts";
import { SCENARIO6_QUESTIONS } from "../src/data/questions/scenarios6.ts";
import { SCENARIO7_QUESTIONS } from "../src/data/questions/scenarios7.ts";
import { SCENARIO8_QUESTIONS } from "../src/data/questions/scenarios8.ts";
import { SCENARIO9_QUESTIONS } from "../src/data/questions/scenarios9.ts";
import { SCENARIO10_QUESTIONS } from "../src/data/questions/scenarios10.ts";
import { SCENARIO11_QUESTIONS } from "../src/data/questions/scenarios11.ts";
import { SCENARIO12_QUESTIONS } from "../src/data/questions/scenarios12.ts";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Set GEMINI_API_KEY.");
  process.exit(1);
}
const model = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
const ai = new GoogleGenAI({ apiKey });

const scenariosOnly = process.argv.includes("--scenarios-only");
const onlyMissing = process.argv.includes("--missing");
const limIdx = process.argv.indexOf("--limit");
const limit = limIdx > -1 ? Number(process.argv[limIdx + 1]) : Infinity;

const scenarioIds = new Set(
  [
    SCENARIO_QUESTIONS, SCENARIO2_QUESTIONS, SCENARIO3_QUESTIONS,
    SCENARIO4_QUESTIONS, SCENARIO5_QUESTIONS, SCENARIO6_QUESTIONS,
    SCENARIO7_QUESTIONS, SCENARIO8_QUESTIONS, SCENARIO9_QUESTIONS,
    SCENARIO10_QUESTIONS, SCENARIO11_QUESTIONS, SCENARIO12_QUESTIONS,
  ].flat().map((q) => q.id),
);

const path = "src/data/explanations/en.json";
const out: Record<string, string> = existsSync(path)
  ? JSON.parse(readFileSync(path, "utf8"))
  : {};

async function explain(q: (typeof QUESTIONS)[number]): Promise<string> {
  const options = q.options
    .map((o, i) => `- ${o}${i === q.correctIndex ? "  (correct)" : ""}`)
    .join("\n");
  const res = await ai.models.generateContent({
    model,
    contents:
      `You are a friendly California DMV instructor. In 3-4 clear sentences, ` +
      `explain why the correct answer is right and briefly why each other ` +
      `option is wrong. Be accurate, simple, and encouraging.\n\n` +
      `Question: ${q.prompt}\nOptions:\n${options}`,
  });
  return (res.text ?? "").trim();
}

async function main() {
  let done = 0;
  for (const q of QUESTIONS) {
    if (done >= limit) break;
    if (scenariosOnly && !scenarioIds.has(q.id)) continue;
    if (onlyMissing && out[q.id]) continue;
    try {
      out[q.id] = await explain(q);
      done += 1;
    } catch (e) {
      console.warn(`skip ${q.id}: ${(e as Error).message}`);
    }
    if (done % 25 === 0) {
      writeFileSync(path, JSON.stringify(out));
      console.log(`${done} generated`);
    }
  }
  writeFileSync(path, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`Wrote ${path} (${Object.keys(out).length} entries).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
