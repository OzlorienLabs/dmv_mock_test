import { GoogleGenAI } from "@google/genai";

/**
 * Text generation with the *user's* Gemini Developer API key (Google Gen AI
 * SDK). Used for on-demand explanations in custom ("other") languages. Default
 * languages are served from pre-generated cached text instead (see the
 * generate-explanations script), so most users never need a key.
 *
 * NOTE: verify the model id against the current Gemini API when you deploy; it
 * is overridable via GEMINI_TEXT_MODEL.
 */
export const GEMINI_TEXT_MODEL =
  process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash";

export async function generateExplanation(
  apiKey: string,
  opts: { prompt: string; answer: string; language: string },
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey });
  const instructions =
    `You are a friendly California DMV instructor. Reply ONLY in ${opts.language}. ` +
    `In 2-3 short, simple sentences, explain why the correct answer is right and, ` +
    `briefly, why a common wrong choice is wrong. Be encouraging.`;
  const res = await ai.models.generateContent({
    model: GEMINI_TEXT_MODEL,
    contents: `${instructions}\n\nQuestion: ${opts.prompt}\nCorrect answer: ${opts.answer}`,
  });
  return (res.text ?? "").trim();
}
