/**
 * Owner-run batch job: pre-generate explanation text in English, Bengali,
 * Hindi, and Spanish for every question, and store it in Firestore at
 * `audio/{questionId}` (public read). The app then serves these for free —
 * users only need their own Gemini key for additional ("other") languages.
 *
 * This runs OUTSIDE the app build (excluded from tsc; run with tsx). It uses
 * the OWNER's Gemini key and a Firebase service account.
 *
 * Usage:
 *   GEMINI_API_KEY=AIza... \
 *   FIREBASE_SERVICE_ACCOUNT="$(cat service-account.json)" \
 *   npx tsx scripts/generate-explanations.ts [--missing]
 *
 *   --missing   Only generate for questions that don't yet have a cached doc.
 *
 * Verify the model id (GEMINI_TEXT_MODEL) against the current Gemini API, and
 * set a billing budget before running across the full bank.
 */
import { GoogleGenAI } from "@google/genai";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { QUESTIONS } from "../src/data/questions/index.ts";

const apiKey = process.env.GEMINI_API_KEY;
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!apiKey || !serviceAccount) {
  console.error("Set GEMINI_API_KEY and FIREBASE_SERVICE_ACCOUNT env vars.");
  process.exit(1);
}

const model = process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";
const ai = new GoogleGenAI({ apiKey });
initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
const db = getFirestore();

const LANGS: Record<string, string> = {
  en: "English",
  bn: "Bengali",
  hi: "Hindi",
  es: "Spanish",
};

async function explain(
  q: (typeof QUESTIONS)[number],
  language: string,
): Promise<string> {
  const res = await ai.models.generateContent({
    model,
    contents:
      `You are a friendly California DMV instructor. Reply ONLY in ${language}. ` +
      `In 2-3 short, simple sentences explain why the correct answer is right and, ` +
      `briefly, why a common wrong choice is wrong. Be encouraging.\n\n` +
      `Question: ${q.prompt}\nCorrect answer: ${q.options[q.correctIndex]}`,
  });
  return (res.text ?? "").trim();
}

async function main() {
  const onlyMissing = process.argv.includes("--missing");
  let done = 0;
  for (const q of QUESTIONS) {
    const ref = db.doc(`audio/${q.id}`);
    if (onlyMissing && (await ref.get()).exists) {
      done++;
      continue;
    }
    const text: Record<string, string> = {};
    for (const [code, label] of Object.entries(LANGS)) {
      try {
        text[code] = await explain(q, label);
      } catch (e) {
        console.warn(`skip ${q.id}/${code}: ${(e as Error).message}`);
      }
    }
    await ref.set({ text, updatedAt: Date.now() }, { merge: true });
    done++;
    if (done % 25 === 0) console.log(`${done}/${QUESTIONS.length}`);
  }
  console.log(`Done: ${done} questions.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
