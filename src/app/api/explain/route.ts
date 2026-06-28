import { NextResponse, type NextRequest } from "next/server";
import {
  adminConfigured,
  appCheckOk,
  encryptionKey,
  getAdminDb,
  verifyRequestUid,
} from "@/lib/server/admin";
import { decryptSecret } from "@/lib/server/crypto";
import {
  DEFAULT_DAILY_AUDIO_CALLS,
  canMakeCall,
  dateKey,
  incrementUsage,
  type UsageDoc,
} from "@/lib/server/usage";
import { generateExplanation } from "@/lib/server/genai";
import { getQuestionById } from "@/data/questions";

export const runtime = "nodejs";

/**
 * Generates an explanation for a question in a requested language using the
 * user's own Gemini key (server-side). Enforces a per-user daily cap. Default
 * languages are normally served from cached text instead; this powers custom
 * ("other") languages and regeneration.
 */
export async function POST(req: NextRequest) {
  if (!adminConfigured() || !encryptionKey()) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!(await appCheckOk(req.headers.get("x-firebase-appcheck")))) {
    return NextResponse.json({ error: "app_check" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    questionId?: unknown;
    language?: unknown;
  };
  const question =
    typeof body.questionId === "string" ? getQuestionById(body.questionId) : undefined;
  const language =
    (typeof body.language === "string" && body.language.trim()) || "English";
  if (!question) {
    return NextResponse.json({ error: "unknown_question" }, { status: 400 });
  }

  const db = getAdminDb()!;
  const secretSnap = await db.doc(`userSecrets/${uid}`).get();
  if (!secretSnap.exists) {
    return NextResponse.json({ error: "no_key" }, { status: 400 });
  }

  // Enforce the per-user daily cap.
  const today = dateKey();
  const usageRef = db.doc(`users/${uid}/usage/ai`);
  const usageSnap = await usageRef.get();
  const usage = usageSnap.exists ? (usageSnap.data() as UsageDoc) : null;
  if (!canMakeCall(usage, today, DEFAULT_DAILY_AUDIO_CALLS)) {
    return NextResponse.json(
      { error: "daily_limit", limit: DEFAULT_DAILY_AUDIO_CALLS },
      { status: 429 },
    );
  }

  let apiKey: string;
  try {
    apiKey = decryptSecret(secretSnap.get("keyCiphertext"), encryptionKey()!);
  } catch {
    return NextResponse.json({ error: "key_error" }, { status: 500 });
  }

  let text: string;
  try {
    text = await generateExplanation(apiKey, {
      prompt: question.prompt,
      answer: question.options[question.correctIndex],
      language,
    });
  } catch (e) {
    return NextResponse.json(
      { error: "ai_error", detail: e instanceof Error ? e.message : "failed" },
      { status: 502 },
    );
  }

  const next = incrementUsage(usage, today);
  await usageRef.set(next);
  return NextResponse.json({
    text,
    used: next.audioCalls,
    limit: DEFAULT_DAILY_AUDIO_CALLS,
  });
}
