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
