<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Codebase Architecture & Guidelines

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Backend/Services**: Firebase (Auth + Firestore Native mode). Owner-run content scripts use the Gemini API (`@google/genai`) at build time only.
- **Testing**: Vitest (Unit), Playwright (E2E), Firebase Emulator (Firestore Rules)

### Project Structure
- `src/app/`: Next.js App Router pages and API routes (`/api/feedback`). Follow Next.js App Router conventions (e.g., `page.tsx`, `layout.tsx`, `route.ts`).
- `src/components/`: Reusable React UI components (e.g., `SiteHeader`, `TestRunner`, `ProgressPanel`). Use Tailwind CSS for styling.
- `src/data/`: Static data including the question bank (`questions/`) and road test content (`roadTest.ts`).
- `src/lib/engine/`: Core logic for test sampling, scoring, and RNG. Should remain pure and framework-agnostic.
- `src/lib/progress/`: State management for user progress. Handles both local storage (guests) and Firestore sync (authenticated users).
- `src/lib/firebase/`: Client-side Firebase configuration, Auth context, and App Check.
- `src/lib/server/`: Server-side logic (Firebase Admin, used by `/api/feedback`). Used exclusively in API routes or Server Actions.
- `src/lib/roadtest/`: State for the road-test self-assessment module.
- `e2e/`: Playwright end-to-end tests.
- `firebase-test/`: Tests for Firestore security rules (requires emulator).
- `scripts/`: Owner-run standalone scripts like `generate-detailed.ts` (regenerate bundled explanations) and `generate-icons.mjs`.

### Key Technical Decisions & Patterns
- **Authentication & Data Sync**: The app supports both guest mode (localStorage) and authenticated mode (Firebase Auth + Firestore). Progress data (e.g., `StoredAttempt`) migrates seamlessly upon sign-in. Use hooks from `src/lib/progress` and `src/lib/firebase` for data access.
- **Local-first, never block the UI on Firestore**: The UI reads locally-cached attempts synchronously (`getAttempts()`); cloud reads/writes run in the **background** and results are merged in (`mergeAttempts` de-dupes by id, local wins), so a signed-in user is as fast as a guest and a just-saved attempt is never dropped by a lagging cloud read. The Firestore client uses a **persistent IndexedDB cache** + auto-detected long-polling (`src/lib/firebase/config.ts`). When adding progress features, keep this pattern: optimistic local update first, `void`-fire the cloud sync, reconcile by merging local.
- **Adaptive question selection** (`src/lib/engine/sampler.ts`): `questionWeight` ranks **never-tried questions highest** (above every already-seen state), then never-correct → learning → mastered; `jitteredWeight` adds a seed-deterministic ±25% jitter so repeated tests stay varied. Keep `questionWeight` pure/deterministic and put randomness in the sampler via the passed-in RNG.
- **Explanations & Audio**: Every question has a detailed explanation bundled in the app (English per-question; Bengali/Spanish topic-level, in `src/data/explanations/` + `*.json` overrides). "Explain in Audio" reads them aloud with the browser Web Speech API — fully offline, no server, no keys. Owner-run scripts (`scripts/generate-detailed.ts`, `scripts/translate-explanations.ts`) can regenerate the bundled JSON with a Gemini key at build time. 
- **Styling**: Tailwind CSS v4 is used extensively. Ensure responsive design ("mobile-first") and adhere to the existing color/theming choices.
- **Server vs Client Components**: Next.js 16 App Router separates Server and Client components. Ensure appropriate use of `"use client"` directives for components requiring interactivity or browser APIs (like `localStorage`). Server components should handle data fetching and secret management.
- **Testing**: Write unit tests for pure logic in `src/lib/` using Vitest. Ensure UI and critical flows are covered by E2E tests using Playwright.
