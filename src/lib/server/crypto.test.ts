import { describe, it, expect } from "vitest";
import { randomBytes } from "node:crypto";
import { encryptSecret, decryptSecret, maskKey } from "./crypto";
import {
  canMakeCall,
  incrementUsage,
  callsUsed,
  dateKey,
  type UsageDoc,
} from "./usage";

const KEY = randomBytes(32).toString("hex");

describe("key encryption", () => {
  it("round-trips a secret", () => {
    const secret = "AIzaSyExampleGeminiKey_1234567890";
    const enc = encryptSecret(secret, KEY);
    expect(enc).not.toContain(secret);
    expect(decryptSecret(enc, KEY)).toBe(secret);
  });

  it("fails to decrypt with the wrong key", () => {
    const enc = encryptSecret("secret", KEY);
    const otherKey = randomBytes(32).toString("hex");
    expect(() => decryptSecret(enc, otherKey)).toThrow();
  });

  it("detects tampering (GCM auth tag)", () => {
    const enc = encryptSecret("secret", KEY);
    const [iv, tag, ct] = enc.split(":");
    const flipped = Buffer.from(ct, "base64");
    flipped[0] ^= 0xff;
    const tampered = [iv, tag, flipped.toString("base64")].join(":");
    expect(() => decryptSecret(tampered, KEY)).toThrow();
  });

  it("rejects an invalid key length", () => {
    expect(() => encryptSecret("x", "abcd")).toThrow();
  });

  it("masks a key for display", () => {
    expect(maskKey("AIzaSy1234567890")).toBe("AIza••••7890");
    expect(maskKey("short")).toBe("••••");
  });
});

describe("daily usage cap", () => {
  const today = "2026-06-27";

  it("allows calls under the limit and blocks at the limit", () => {
    expect(canMakeCall(null, today, 3)).toBe(true);
    const u: UsageDoc = { dateKey: today, audioCalls: 3 };
    expect(canMakeCall(u, today, 3)).toBe(false);
  });

  it("resets when the day changes", () => {
    const yesterday: UsageDoc = { dateKey: "2026-06-26", audioCalls: 99 };
    expect(callsUsed(yesterday, today)).toBe(0);
    expect(canMakeCall(yesterday, today, 5)).toBe(true);
  });

  it("increments within the same day and starts fresh on a new day", () => {
    expect(incrementUsage(null, today)).toEqual({ dateKey: today, audioCalls: 1 });
    const u: UsageDoc = { dateKey: today, audioCalls: 2 };
    expect(incrementUsage(u, today)).toEqual({ dateKey: today, audioCalls: 3 });
    const old: UsageDoc = { dateKey: "2026-06-26", audioCalls: 9 };
    expect(incrementUsage(old, today)).toEqual({ dateKey: today, audioCalls: 1 });
  });

  it("dateKey returns an ISO date", () => {
    expect(dateKey(new Date("2026-06-27T18:00:00Z"))).toBe("2026-06-27");
  });
});
