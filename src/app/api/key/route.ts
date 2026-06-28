import { NextResponse, type NextRequest } from "next/server";
import {
  adminConfigured,
  appCheckOk,
  encryptionKey,
  getAdminDb,
  verifyRequestUid,
} from "@/lib/server/admin";
import { encryptSecret, maskKey } from "@/lib/server/crypto";

export const runtime = "nodejs";

/** Returns whether the backend is configured and whether the user has a key. */
export async function GET(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ configured: false, hasKey: false });
  }
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const snap = await getAdminDb()!.doc(`userSecrets/${uid}`).get();
  return NextResponse.json({
    configured: true,
    hasKey: snap.exists,
    masked: (snap.get("masked") as string) ?? null,
  });
}

/** Stores the user's Gemini key, encrypted. The raw key is never returned. */
export async function POST(req: NextRequest) {
  if (!adminConfigured() || !encryptionKey()) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!(await appCheckOk(req.headers.get("x-firebase-appcheck")))) {
    return NextResponse.json({ error: "app_check" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { key?: unknown };
  const key = typeof body.key === "string" ? body.key.trim() : "";
  if (key.length < 20) {
    return NextResponse.json({ error: "invalid_key" }, { status: 400 });
  }

  await getAdminDb()!.doc(`userSecrets/${uid}`).set({
    keyCiphertext: encryptSecret(key, encryptionKey()!),
    masked: maskKey(key),
    updatedAt: Date.now(),
  });
  return NextResponse.json({ ok: true, masked: maskKey(key) });
}

/** Deletes the user's stored key. */
export async function DELETE(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 501 });
  }
  const uid = await verifyRequestUid(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!(await appCheckOk(req.headers.get("x-firebase-appcheck")))) {
    return NextResponse.json({ error: "app_check" }, { status: 401 });
  }
  await getAdminDb()!.doc(`userSecrets/${uid}`).delete();
  return NextResponse.json({ ok: true });
}
