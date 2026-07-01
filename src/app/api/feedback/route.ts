import { NextResponse, type NextRequest } from "next/server";
import { adminConfigured, appCheckOk, getAdminDb } from "@/lib/server/admin";

export const runtime = "nodejs";

const TO = process.env.FEEDBACK_TO || "ozlorienlabs@gmail.com";
const FROM = process.env.FEEDBACK_FROM || "Ozlorien Labs <onboarding@resend.dev>";
const MAX_LEN = 5000;

// Best-effort per-instance rate limit: max 5 submissions per IP per 10 minutes.
const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function isEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

async function sendViaResend(message: string, email?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: "New feedback — DMV Practice",
      ...(email && isEmail(email) ? { reply_to: email } : {}),
      text: `${message}\n\n— from: ${email && isEmail(email) ? email : "(no email provided)"}`,
    }),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  if (!(await appCheckOk(req.headers.get("x-firebase-appcheck")))) {
    return NextResponse.json({ ok: false, error: "app_check" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    message?: unknown;
    email?: unknown;
    website?: unknown; // honeypot
  };

  // Honeypot: bots fill hidden fields. Pretend success and drop.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, dropped: true });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (message.length < 2) {
    return NextResponse.json({ ok: false, error: "empty_message" }, { status: 400 });
  }
  if (message.length > MAX_LEN) {
    return NextResponse.json({ ok: false, error: "too_long" }, { status: 400 });
  }
  if (email && !isEmail(email)) {
    return NextResponse.json({ ok: false, error: "bad_email" }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let stored = false;
  const db = adminConfigured() ? getAdminDb() : null;
  if (db) {
    try {
      await db.collection("feedback").add({
        message,
        email: email || null,
        createdAt: Date.now(),
        userAgent: req.headers.get("user-agent") ?? null,
      });
      stored = true;
    } catch {
      // fall through — email may still succeed
    }
  }

  let emailed = false;
  try {
    emailed = await sendViaResend(message, email);
  } catch {
    emailed = false;
  }

  // Nothing configured to receive it → let the client fall back to mailto.
  if (!stored && !emailed) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 200 });
  }
  return NextResponse.json({ ok: true, stored, emailed });
}
