import { defineConfig } from "vitest/config";

// Firestore security-rules tests. These require the Firestore emulator running,
// so they are launched via `npm run test:rules` (which wraps them in
// `firebase emulators:exec`). Kept separate from the default Vitest run.
export default defineConfig({
  test: {
    environment: "node",
    include: ["firebase-test/**/*.test.ts"],
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
