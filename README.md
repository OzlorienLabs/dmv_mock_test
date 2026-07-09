# [Driver License Test Practice](https://dltest.stocktimelines.com/)

Release v2.1.1

A free, mobile-first web app to study and take **mock California DMV Class C
Driver's License knowledge tests** — styled after the real DMV experience, with
exam-accurate pass rules, progress tracking, per-question explanations, diagrams,
and AI audio explanations in multiple languages.

## Web App Live ~ 🚘 [The Ultimate Driving Knowledge Test](https://dltest.stocktimelines.com/) 🚦

> **Unofficial study tool — not affiliated with, endorsed by, or created by the
> California DMV.** Practice questions are for study only and may differ from the
> actual exam. Always verify rules in the
> [official California Driver Handbook](https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/).

## Status — Phases 1–6 (production-ready)

- **Mock-test engine** with the real pass rules — Original (46 questions, 38 to
  pass) and Renewal (36 questions, 30 to pass) — plus a Quick Practice mode.
- **1,000+ questions** across all 16 topics (38 verbatim official DMV sample
  questions + ~970 generated/authored), provenance-tagged, behind a validation
  gate. Curated inline-SVG diagrams. Results & review with per-topic breakdown.
- **Adaptive question selection** — each test **prioritizes questions you've
  never tried** (weighted above every already-seen question), then never-correct
  and recently-missed ones, based on your attempt history (on-device or synced),
  while keeping exam-like topic coverage. A seed-deterministic ±25% weight jitter
  keeps repeated tests varied. Every answer's correctness is recorded per
  question. The first question renders instantly from a small bundled starter set
  while the full 1,000-question bank loads in the background.
- **Accounts & cross-device sync** — optional Firebase Auth (Google +
  email/password); guest progress migrates to Firestore on sign-in. Works fully
  as a guest with no Firebase configured. **Local-first**: the UI reads
  on-device history synchronously and syncs to Firestore in the background (with
  a persistent IndexedDB cache), so signed-in load/response is as fast as guest
  and a just-finished test never disappears from history behind a slow sync.
- **Test history & gamified progress** — every completed test is saved with full per-question
  answer data. The Progress section features a gamified dashboard that tracks daily learning streaks,
  computes a test readiness meter, displays your score trend, and highlights "trouble questions" you
  frequently miss (with in-place review). It also lists all past tests; tap "Review" to revisit
  entire exams. Works for both guests (localStorage) and signed-in users (Firestore).
- **Global leaderboard** — signed-in drivers are ranked by the number of
  **unique questions they've answered correctly** across the whole bank (answer
  one right and it counts; miss it on your latest try and it drops off). Scores
  are computed on-device and published to a public, owner-written
  `leaderboard/{uid}` collection (no server aggregation), so the board is shared
  without exposing anyone's private history. The board is **publicly viewable**
  (guests see the top 10 too — a hook to sign in and join), and a signed-in user
  also sees **their own rank** when they're below the top 10. The **home page
  embeds a live top-5 preview**. You're listed by default; a toggle in
  **Settings** opts out (and removes your entry), synced across devices.
- **Detailed multilingual explanations + offline audio** — every question has a
  detailed explanation in **English, Bengali, and Spanish**, bundled in the app
  and read aloud **entirely on-device** (Web Speech API, no server, no keys,
  works offline). English is per-question; BN/ES are topic-level and can be
  upgraded to per-question with an optional owner-run build-time script.
- **Road-test (DL-80) module** — interactive coaching with self-assessment.
- **Installable PWA** (offline support), optional **App Check**, GitHub Actions
  **CI**, and **push-to-deploy** (Firebase App Hosting or Cloud Run).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Firebase Auth + Firestore (optional) · firebase-admin ·
Vitest · Playwright · Firebase Emulator Suite.
(`@google/genai` is used only by owner-run content scripts, not at runtime.)

## Develop

```bash
npm install
npm run dev            # http://localhost:3000  (guest mode, no setup needed)
```

Optionally run against the Firebase emulator:

```bash
npm run emulators                          # terminal 1
echo "NEXT_PUBLIC_FIREBASE_EMULATOR=true" > .env.local && npm run dev   # terminal 2
```

## Quality gates

```bash
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
npm test               # Vitest unit tests
npm run build          # Next production build
npm run e2e            # Playwright end-to-end
npm run test:rules     # Firestore security-rules tests (uses the emulator)
```

CI runs all of these on every push/PR to `main` (`.github/workflows/ci.yml`).

---

# Production setup — step by step

The app runs as a guest with zero setup. The steps below add **accounts +
cloud sync**, and **deployment**. Companion docs:
[FIREBASE_SETUP.md](FIREBASE_SETUP.md) · [PRODUCTION.md](PRODUCTION.md).

### What you'll provision

| System | Purpose |
|---|---|
| Firebase project (= a Google Cloud project) | Auth, Firestore, hosting |
| Cloud Firestore (Native) | User progress (attempts) |
| Firebase Authentication | Google + Email/Password sign-in |
| App Check *(optional)* | Abuse protection for `/api/feedback` |
| Firebase App Hosting **or** Cloud Run | Serve the Next.js app |

### Tools

```bash
node -v        # 20+
npm i -g firebase-tools         # Firebase CLI
# Google Cloud CLI: https://cloud.google.com/sdk/docs/install
gcloud --version
gcloud auth login
firebase login
```

## Step 1 — Create the Firebase / Google Cloud project

1. Go to <https://console.firebase.google.com> → **Add project** → name it
   (e.g. `dmv-mock-test`). This creates the underlying Google Cloud project.
2. Set the project for the CLIs (replace `PROJECT_ID`):

```bash
gcloud config set project PROJECT_ID
firebase use --add        # alias it "default"
```

## Step 2 — Enable the Google Cloud APIs

```bash
gcloud services enable \
  firestore.googleapis.com \
  firebase.googleapis.com \
  identitytoolkit.googleapis.com \
  secretmanager.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  generativelanguage.googleapis.com \
  texttospeech.googleapis.com \
  firebaseapphosting.googleapis.com \
  firebaseappcheck.googleapis.com
```

## Step 3 — Create Cloud Firestore (Native mode)

Firebase Console → **Build → Firestore Database → Create database** →
**Native mode** → pick a region (e.g. `us-west2`) → start in **production mode**
(our rules will lock it down). Region can't be changed later.

## Step 4 — Enable Authentication

Console → **Build → Authentication → Get started**, then under **Sign-in
method** enable:

- **Email/Password**
- **Google** (set a project support email)

Under **Settings → Authorized domains**, add your production domain
(localhost is allowed by default).

## Step 5 — Register the web app & collect config

Console → **Project settings (gear) → Your apps → Web (`</>`)**. Copy the config
into `.env.local` (copy `.env.local.example` first):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000
NEXT_PUBLIC_FIREBASE_APP_ID=1:000000000000:web:abc123
```

`npm run dev` now shows a **Sign in** button and syncs progress to Firestore.

## Step 6 — Explanations & audio (no keys needed)

Every question ships with a bundled explanation, and **"Explain in Audio"** reads
it aloud on-device with the browser's Web Speech API — **no Gemini key, no API
routes, no server calls, works offline**. English is per-question; Bengali and
Spanish are topic-level.

To regenerate or expand the bundled text, an owner can run the build-time scripts
with a Gemini key ([aistudio.google.com/apikey](https://aistudio.google.com/apikey)).
This is optional and never runs in production:

```bash
GEMINI_API_KEY=AIza... npx tsx scripts/generate-detailed.ts       # per-question English
GEMINI_API_KEY=AIza... npx tsx scripts/translate-explanations.ts  # Bengali / Spanish
```

They only write the committed JSON in `src/data/explanations/`; the app reads it
offline at runtime.

## Step 7 — App Check (optional, recommended before public launch)

1. Console → **Build → App Check** → register the web app with **reCAPTCHA
   Enterprise**; copy the **site key**.
2. Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (the client auto-attaches a token).
3. Set `APP_CHECK_REQUIRED=true` to enforce it on `/api/feedback`.
4. In App Check settings, set Firestore/Auth to **Enforced** when ready.

## Step 8 — Publish the Firestore security rules (REQUIRED)

Without this, a new database denies all reads/writes, so **signed-in progress
silently fails to save**. Re-publish whenever [`firestore.rules`](firestore.rules)
changes — e.g. the `leaderboard/{uid}` collection (public-read, owner-write)
needs the current rules or the leaderboard can't load or save. Either:

- **Console:** Firestore Database → **Rules** tab → paste
  [`firestore.rules`](firestore.rules) → **Publish** (no CLI needed).
- **CLI:** `firebase deploy --only firestore:rules --project YOUR_PROJECT_ID`
  — pass `--project` because `.firebaserc`'s default is the emulator id
  `demo-dmv-mock-test`, not your project.

```bash
npm run test:rules      # optional: verify the rules locally first
```

## Step 9 — Deploy the app

### Option A — Firebase App Hosting (recommended, push-to-deploy)

Builds and deploys on every push to `main`; runs on Cloud Run for you.

1. Console → **Build → App Hosting → Get started** → connect this GitHub repo →
   choose the **`main`** branch.
2. It reads [`apphosting.yaml`](apphosting.yaml). Set real values there or as
   backend secrets. App Hosting runs with Application Default Credentials, so
   `firebase-admin` needs no key file — just set `FIREBASE_ADMIN_ENABLED=true`.
3. Grant the App Hosting service account `roles/secretmanager.secretAccessor`.

### Option B — Cloud Run (explicit, with the included `Dockerfile`)

```bash
REGION=us-west1
REPO=us-west1-docker.pkg.dev/PROJECT_ID/dmv

# 1. Artifact Registry repo + Docker auth
gcloud artifacts repositories create dmv --repository-format=docker --location=$REGION
gcloud auth configure-docker $REGION-docker.pkg.dev

# 2. Build the image (NEXT_PUBLIC_* are inlined at build time → pass as build args)
docker build -t $REPO/app:latest \
  --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=AIza... \
  --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com \
  --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project \
  --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com \
  --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=000000000000 \
  --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=1:000:web:abc \
  --build-arg NEXT_PUBLIC_RECAPTCHA_SITE_KEY=optional-site-key .
docker push $REPO/app:latest

# 3. A runtime service account with Firestore access
gcloud iam service-accounts create dmv-run
SA=dmv-run@PROJECT_ID.iam.gserviceaccount.com
gcloud projects add-iam-policy-binding PROJECT_ID --member="serviceAccount:$SA" --role="roles/datastore.user"

# 4. Deploy
gcloud run deploy dmv-app \
  --image $REPO/app:latest --region $REGION --allow-unauthenticated \
  --service-account $SA \
  --set-env-vars FIREBASE_ADMIN_ENABLED=true
```

Then add the Cloud Run URL to **Authentication → Authorized domains**.

### Option B (CI/CD) — keyless GitHub Actions deploy to Cloud Run

For a Vercel-like push-to-deploy without storing JSON keys, use **Workload
Identity Federation**. One-time setup, then add this workflow:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run
on:
  push: { branches: [main] }
permissions: { contents: read, id-token: write }   # id-token = keyless auth
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: projects/NUM/locations/global/workloadIdentityPools/github/providers/gh
          service_account: deployer@PROJECT_ID.iam.gserviceaccount.com
      - uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: dmv-app
          region: us-west1
          source: .          # builds with Cloud Build using the Dockerfile
```

Gate it behind CI by requiring the `test` and `rules` checks in branch
protection (GitHub → Settings → Branches).

## Step 10 — Budgets, branch protection, smoke test

- **Budget alerts:** Google Cloud Console → **Billing → Budgets & alerts** →
  create a budget with 50/90/100% email alerts.
- **Branch protection:** require the `test` and `rules` CI checks before merging
  to `main` so only green code deploys.
- **Smoke test:** open the deployed URL → take a test as a guest → sign in →
  confirm progress syncs across devices → use "Explain in Audio" (offline, no
  key needed).

## Environment variables reference

| Variable | Scope | Required for |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` (6) | build + runtime | Accounts & sync |
| `NEXT_PUBLIC_SITE_URL` | build + runtime | Canonical/OG/sitemap URLs (SEO) |
| `NEXT_PUBLIC_FIREBASE_EMULATOR` | build + runtime | Local emulator dev (`true`) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | build + runtime | App Check (client, optional) |
| `FIREBASE_ADMIN_ENABLED` / `FIREBASE_SERVICE_ACCOUNT` / `GOOGLE_APPLICATION_CREDENTIALS` | runtime (server) | `/api/feedback` (Admin SDK) |
| `APP_CHECK_REQUIRED` | runtime (server) | Enforce App Check on `/api/feedback` |
| `RESEND_API_KEY` / `FEEDBACK_TO` / `FEEDBACK_FROM` | runtime (server) | Feedback emails |
| `GEMINI_API_KEY` | script only | `generate-detailed.ts` / `translate-explanations.ts` |

`NEXT_PUBLIC_*` values are inlined into the client bundle at build time; all
others are server-only and must never be `NEXT_PUBLIC_`.

---

## Project layout

```
src/
  app/                 # routes: / · /test · /test/review · /road-test · /settings · /api/feedback
  components/          # SiteHeader, TestRunner, Diagram, AudioExplain, AccountMenu, ...
  data/
    questions/         # provenance-tagged bank (official + generated + authored) + validate
    explanations/      # bundled en/bn/es explanation text + per-question JSON overrides
    roadTest.ts        # DL-80 road-test content
  lib/
    engine/            # profiles, sampler, scoring, seedable RNG (+ tests)
    progress/          # local store + cloud sync provider + analytics engine (gamification) + test history
    firebase/          # config (env-driven), auth context, App Check
    server/            # admin (Firebase Admin for /api/feedback)
    roadtest/          # self-assessment store (+ tests)
e2e/                   # Playwright specs
firebase-test/         # Firestore rules tests (emulator)
scripts/               # generate-detailed.ts / translate-explanations.ts (owner-run) · generate-icons.mjs
android/               # Trusted Web Activity config (twa-manifest.json) + build/deploy guide
Dockerfile, apphosting.yaml, firestore.rules, firebase.json
```

## Android app (Google Play)

The Android app is a **Trusted Web Activity** — a ~1 MB shell that runs this same
deployed site in Chrome, so it reuses 100% of the code and shares the web app's
Firebase sign-in and Firestore progress (sign in once → same account, same data).
It's served the Digital Asset Links file at `/.well-known/assetlinks.json`
(env-driven: `ANDROID_PACKAGE_NAME`, `ANDROID_CERT_FINGERPRINTS`). Build and
publish steps are in **[android/README.md](android/README.md)**; PNG launcher/store
icons are generated by `npm run icons`.

## License

This project is **dual-licensed** — code and content separately:

- **Code** — [GNU AGPL-3.0](LICENSE). You're free to use, modify, and
  self-host it, but if you run a modified version as a network service you must
  make your source available under the same license.
- **Content** (question bank, explanations, diagrams) —
  [CC BY-NC-SA 4.0](CONTENT_LICENSE.md): share/adapt for non-commercial use with
  attribution and share-alike.

The content license covers only this project's **own** material. Third-party
`sourced` questions and official/government (`official_dmv`) material keep their
original terms (see each item's `sourceUrl`), and "California DMV" trademarks
belong to the State of California — this is an unofficial tool. See
[CONTENT_LICENSE.md](CONTENT_LICENSE.md) for details.

© 2026 Subhasis Dutta / Ozlorien Labs.
