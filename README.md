# CA DMV Knowledge Test Practice

A free, mobile-first web app to study and take **mock California DMV Class C
Driver's License knowledge tests** — styled after the real DMV experience, with
exam-accurate pass rules, progress tracking, per-question explanations, diagrams,
and (coming soon) AI audio explanations in multiple languages.

> **Unofficial study tool — not affiliated with, endorsed by, or created by the
> California DMV.** Practice questions are for study only and may differ from the
> actual exam. Always verify rules in the
> [official California Driver Handbook](https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/).

## Status — Phases 1–6 (production-ready)

Implemented:

- **Mock-test engine** with the real pass rules — Original (46 questions, 38 to
  pass) and Renewal (36 questions, 30 to pass) — plus a Quick Practice mode with
  instant feedback.
- **Exam-like category sampling** so each test mirrors the real topic mix, with a
  seedable RNG for deterministic/curated tests.
- **1,000+ questions** across all 16 topics (38 verbatim official DMV sample
  questions + ~970 generated/authored), each carrying provenance (`origin` +
  source link) so the UI shows whether a question is a practice item, a sourced
  item, or an official DMV sample. A validation gate (unit test) blocks duplicate
  ids, duplicate questions, out-of-range answers, and missing explanations.
- **Curated inline-SVG diagrams** for visual concepts (4-way stops, roundabouts,
  curb parking, sign shapes, etc.).
- **Results & review** with pass/fail banner, per-topic breakdown, and a full
  answer review with explanations.
- **Accounts & cross-device sync** — optional Firebase Auth (Google +
  email/password); guest progress is stored on-device and **migrated to
  Firestore** on sign-in. The app works fully as a guest with **no Firebase
  configured**. Firestore security rules are owner-only and verified by an
  emulator test (`npm run test:rules`). See [FIREBASE_SETUP.md](FIREBASE_SETUP.md).
- **"Explain in Audio"** — cached multilingual explanations (English, Bengali,
  Hindi, Spanish) served free + spoken in-browser, **bring-your-own Gemini key**
  for any other language (key encrypted server-side, per-user daily cap), and a
  browser-speech fallback that always works. See [AUDIO_SETUP.md](AUDIO_SETUP.md).
- **Road-test (DL-80) module** — interactive coaching guide: vehicle pre-check,
  per-maneuver "what the examiner looks for" vs "common mistakes", automatic-fail
  list, and a self-assessment with a readiness meter (saved on-device).
- **California design-system styling** (Public Sans, CA blue/gold) and a clear
  non-affiliation disclaimer.
- **Installable PWA with offline support** (manifest + service worker — the
  static question bank works offline after the first visit), optional **App
  Check**, GitHub Actions **CI** (lint/typecheck/unit/build/e2e + rules), and
  **Firebase App Hosting** push-to-deploy. See [PRODUCTION.md](PRODUCTION.md).

The full multi-phase plan (content build-out to 1000+, Firebase Auth/Firestore,
AI audio pipeline, bring-your-own Gemini key, Firebase App Hosting CI/CD) lives in
the project plan file.

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Firebase Auth + Firestore (optional) · Vitest + Testing Library · Playwright ·
Firebase Emulator Suite (rules tests).

## Develop

```bash
npm install
npm run dev            # http://localhost:3000
```

## Quality gates

```bash
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # Vitest unit tests (engine + progress store)
npm run build          # Next production build
npm run e2e            # Playwright end-to-end (run `npm run build` first)
```

CI runs all of the above on every push/PR to `main`
(`.github/workflows/ci.yml`). Branch protection should require this check before
merge, which gates deployment.

## Project layout

```
src/
  app/                 # routes: / (home), /test, /road-test
  components/          # SiteHeader, TestRunner, Diagram, AudioExplain, ...
  data/questions.ts    # seed question bank (provenance-tagged)
  lib/
    engine/            # profiles, sampler, scoring, seedable RNG (+ tests)
    progress/          # guest progress store (+ tests)
    types.ts           # Question, categories, provenance types
e2e/                   # Playwright specs
```
