import { doc, getDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/config";

/** Pre-generated explanation text per language, keyed by question id. */
export type CachedText = Partial<Record<"en" | "bn" | "hi" | "es", string>>;

/**
 * Reads pre-generated multilingual explanation text from Firestore (public
 * read). Returns null when Firebase isn't configured or nothing is cached, so
 * the UI can fall back to the on-device English explanation.
 */
export async function getCachedExplanations(
  questionId: string,
): Promise<CachedText | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "audio", questionId));
    if (!snap.exists()) return null;
    return ((snap.data().text as CachedText) ?? null) || null;
  } catch {
    return null;
  }
}
