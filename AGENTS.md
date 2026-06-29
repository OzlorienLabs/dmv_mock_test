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
- **Backend/Services**: Firebase (Auth + Firestore Native mode), Google Gemini API (`@google/genai`)
- **Testing**: Vitest (Unit), Playwright (E2E), Firebase Emulator (Firestore Rules)

### Project Structure
- `src/app/`: Next.js App Router pages and API routes (`/api/key`, `/api/explain`). Follow Next.js App Router conventions (e.g., `page.tsx`, `layout.tsx`, `route.ts`).
- `src/components/`: Reusable React UI components (e.g., `SiteHeader`, `TestRunner`, `ProgressPanel`). Use Tailwind CSS for styling.
- `src/data/`: Static data including the question bank (`questions/`) and road test content (`roadTest.ts`).
- `src/lib/engine/`: Core logic for test sampling, scoring, and RNG. Should remain pure and framework-agnostic.
- `src/lib/progress/`: State management for user progress. Handles both local storage (guests) and Firestore sync (authenticated users).
- `src/lib/firebase/`: Client-side Firebase configuration, Auth context, and App Check.
- `src/lib/server/`: Server-side logic including encryption (crypto), Gemini API interaction, and Firebase Admin. Used exclusively in API routes or Server Actions.
- `src/lib/roadtest/`: State for the road-test self-assessment module.
- `e2e/`: Playwright end-to-end tests.
- `firebase-test/`: Tests for Firestore security rules (requires emulator).
- `scripts/`: Standalone scripts like `generate-explanations.ts`.

### Key Technical Decisions & Patterns
- **Authentication & Data Sync**: The app supports both guest mode (localStorage) and authenticated mode (Firebase Auth + Firestore). Progress data (e.g., `StoredAttempt`) migrates seamlessly upon sign-in. Use hooks from `src/lib/progress` and `src/lib/firebase` for data access.
- **AI Explanations & Audio**: Explanations are either pre-generated and cached or fetched on-demand using the user's Gemini key (encrypted server-side). 
- **Styling**: Tailwind CSS v4 is used extensively. Ensure responsive design ("mobile-first") and adhere to the existing color/theming choices.
- **Server vs Client Components**: Next.js 16 App Router separates Server and Client components. Ensure appropriate use of `"use client"` directives for components requiring interactivity or browser APIs (like `localStorage`). Server components should handle data fetching and secret management.
- **Testing**: Write unit tests for pure logic in `src/lib/` using Vitest. Ensure UI and critical flows are covered by E2E tests using Playwright.
