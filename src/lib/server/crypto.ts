import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/**
 * AES-256-GCM encryption for the user's Gemini API key.
 *
 * The key is encrypted server-side with a 32-byte master key (from the
 * GEMINI_KEY_ENCRYPTION_KEY env var, ideally sourced from Secret Manager in
 * production) and only the ciphertext is stored. The raw key is never sent to
 * the client and never logged.
 */
const ALGO = "aes-256-gcm";

function toKey(keyHex: string): Buffer {
  const key = Buffer.from(keyHex, "hex");
  if (key.length !== 32) {
    throw new Error("Encryption key must be 32 bytes (64 hex characters).");
  }
  return key;
}

/** Returns "iv:tag:ciphertext", each base64. */
export function encryptSecret(plaintext: string, keyHex: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, toKey(keyHex), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), ct.toString("base64")].join(":");
}

export function decryptSecret(payload: string, keyHex: string): string {
  const [ivB, tagB, ctB] = payload.split(":");
  if (!ivB || !tagB || !ctB) throw new Error("Malformed ciphertext.");
  const decipher = createDecipheriv(ALGO, toKey(keyHex), Buffer.from(ivB, "base64"));
  decipher.setAuthTag(Buffer.from(tagB, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(ctB, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

/** Masks a key for display, e.g. "AIza…publicSuffix" → "AIza••••4f2a". */
export function maskKey(key: string): string {
  if (key.length <= 8) return "••••";
  return `${key.slice(0, 4)}••••${key.slice(-4)}`;
}
