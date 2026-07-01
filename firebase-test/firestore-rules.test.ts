import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

let env: RulesTestEnvironment;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-dmv-mock-test",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
});

describe("firestore security rules", () => {
  it("lets a user read and write their own attempts", async () => {
    const alice = env.authenticatedContext("alice").firestore();
    const ref = doc(alice, "users/alice/attempts/a1");
    await assertSucceeds(setDoc(ref, { id: "a1", passed: true }));
    await assertSucceeds(getDoc(ref));
  });

  it("blocks reading another user's attempts", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users/alice/attempts/a1"), { id: "a1" });
    });
    const bob = env.authenticatedContext("bob").firestore();
    await assertFails(getDoc(doc(bob, "users/alice/attempts/a1")));
  });

  it("blocks unauthenticated writes to user data", async () => {
    const anon = env.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(anon, "users/alice/attempts/a1"), { id: "a1" }));
  });

  it("denies client writes to public content", async () => {
    const alice = env.authenticatedContext("alice").firestore();
    await assertFails(setDoc(doc(alice, "questions/q1"), { prompt: "x" }));
  });

  it("allows anyone to read public content", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "questions/q1"), { prompt: "x" });
    });
    const anon = env.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(anon, "questions/q1")));
  });

  it("allows anyone to read cached audio but not write it", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "audio/q1"), { text: { en: "x" } });
    });
    const anon = env.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(anon, "audio/q1")));
    const alice = env.authenticatedContext("alice").firestore();
    await assertFails(setDoc(doc(alice, "audio/q1"), { text: { en: "y" } }));
  });

  it("never lets a client read or write encrypted keys (userSecrets)", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "userSecrets/alice"), { keyCiphertext: "x" });
    });
    const alice = env.authenticatedContext("alice").firestore();
    await assertFails(getDoc(doc(alice, "userSecrets/alice")));
    await assertFails(setDoc(doc(alice, "userSecrets/alice"), { keyCiphertext: "y" }));
  });

  it("lets the owner read usage counters but blocks client writes", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "users/alice/usage/ai"), {
        dateKey: "2026-06-27",
        audioCalls: 3,
      });
    });
    const alice = env.authenticatedContext("alice").firestore();
    await assertSucceeds(getDoc(doc(alice, "users/alice/usage/ai")));
    await assertFails(
      setDoc(doc(alice, "users/alice/usage/ai"), { audioCalls: 0 }),
    );
  });

  it("never lets a client read or write feedback submissions", async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "feedback/f1"), { message: "hi" });
    });
    const anon = env.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(anon, "feedback/f1")));
    await assertFails(setDoc(doc(anon, "feedback/f2"), { message: "spam" }));
    const alice = env.authenticatedContext("alice").firestore();
    await assertFails(getDoc(doc(alice, "feedback/f1")));
  });
});
