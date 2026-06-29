# CA DMV Knowledge Test Practice

A free, mobile-first web app to study and take **mock California DMV Class C
Driver's License knowledge tests** — styled after the real DMV experience, with
exam-accurate pass rules, progress tracking, per-question explanations, diagrams,
and AI audio explanations in multiple languages.

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
- **Accounts & cross-device sync** — optional Firebase Auth (Google +
  email/password); guest progress migrates to Firestore on sign-in. Works fully
  as a guest with no Firebase configured.
- **Test history & gamified progress** — every completed test is saved with full per-question
  answer data. The Progress section features a gamified dashboard that tracks daily learning streaks,
  computes a test readiness meter, displays your score trend, and highlights "trouble questions" you
  frequently miss (with in-place review). It also lists all past tests; tap "Review" to revisit
  entire exams. Works for both guests (localStorage) and signed-in users (Firestore).
- **"Explain in Audio"** — cached multilingual explanations (English, Bengali,
  Hindi, Spanish) + **bring-your-own Gemini key** for any other language
  (encrypted server-side, per-user daily cap) + a browser-speech fallback.
- **Road-test (DL-80) module** — interactive coaching with self-assessment.
- **Installable PWA** (offline support), optional **App Check**, GitHub Actions
  **CI**, and **push-to-deploy** (Firebase App Hosting or Cloud Run).

## Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Firebase Auth + Firestore (optional) · `@google/genai` · firebase-admin ·
Vitest · Playwright · Firebase Emulator Suite.

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
cloud sync**, **AI explanations/audio**, and **deployment**. Companion docs:
[FIREBASE_SETUP.md](FIREBASE_SETUP.md) · [AUDIO_SETUP.md](AUDIO_SETUP.md) ·
[PRODUCTION.md](PRODUCTION.md).

### What you'll provision

| System | Purpose |
|---|---|
| Firebase project (= a Google Cloud project) | Auth, Firestore, hosting |
| Cloud Firestore (Native) | User progress, cached explanations, encrypted keys |
| Firebase Authentication | Google + Email/Password sign-in |
| Gemini API | AI explanations (text) and on-demand audio |
| Google Cloud Text-to-Speech *(optional)* | High-quality cached audio files |
| Secret Manager | Encryption key + private config |
| App Check *(optional)* | Abuse protection for the API routes |
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

## Step 6 — Gemini API & recommended models

The app uses Gemini for **text explanations**; audio is either pre-generated
(owner) or generated on demand with the **user's own key**.

**Get a key** at <https://aistudio.google.com/apikey> (Gemini Developer API —
simplest). For enterprise scale, use Vertex AI instead. End users paste their
own key in **Settings**; you also need an owner key for the pre-generation step.

**Best models** (set with `GEMINI_TEXT_MODEL`; verify current ids at
<https://ai.google.dev/gemini-api/docs/models>):

| Use | Recommended | Why |
|---|---|---|
| **Explaining questions (text)** | `gemini-2.5-flash` | Best balance of quality, speed, and cost for short 2–3 sentence explanations. Multilingual. |
| Maximum-quality explanations | `gemini-2.5-pro` | Higher reasoning quality; slower and pricier. |
| **On-demand audio (BYO key)** | `gemini-2.5-flash-preview-tts` | Native multilingual text-to-speech that works with a Gemini Developer API key. |
| **Best cached audio (owner)** | **Google Cloud TTS — Chirp 3: HD voices** | Most natural neural voices; strong `en-US`, `hi-IN`, `bn-IN`, `es-US/es-ES` support. |

How audio works today: the app speaks the cached/AI **text** via the browser's
speech engine. For **high-fidelity neural audio files**, generate them in the
pre-generation step with Cloud TTS (Chirp 3 HD) and store the URLs — see Step 10
and [AUDIO_SETUP.md](AUDIO_SETUP.md). Verify Cloud TTS voices at
<https://cloud.google.com/text-to-speech/docs/chirp3-hd>.

## Step 7 — Encryption key & secrets

Each user's Gemini key is stored **AES-256-GCM-encrypted**. Generate a 32-byte
master key and put it (and your owner Gemini key) in Secret Manager:

```bash
# 32-byte hex master key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

printf '%s' 'PASTE_THE_HEX' | gcloud secrets create gemini-key-encryption-key --data-file=-
printf '%s' 'AIza_OWNER_KEY' | gcloud secrets create gemini-owner-key       --data-file=-
```

## Step 8 — App Check (recommended before public launch)

1. Console → **Build → App Check** → register the web app with **reCAPTCHA
   Enterprise**; copy the **site key**.
2. Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (the client auto-attaches a token).
3. Set `APP_CHECK_REQUIRED=true` to enforce it on `/api/key` and `/api/explain`.
4. In App Check settings, set Firestore/Auth to **Enforced** when ready.

## Step 9 — Deploy the Firestore security rules

```bash
firebase deploy --only firestore:rules
npm run test:rules      # optional: verify the rules locally first
```

## Step 10 — Pre-generate cached explanations (owner, one-time)

Fills `audio/{id}` so default-language explanations are free for everyone:

```bash
GEMINI_API_KEY=AIza_OWNER_KEY \
GEMINI_TEXT_MODEL=gemini-2.5-flash \
FIREBASE_SERVICE_ACCOUNT="$(cat service-account.json)" \
npx tsx scripts/generate-explanations.ts          # add --missing on re-runs
```

> ~1,000 questions × 4 languages ≈ 4,000 model calls — **set a billing budget
> first** (Step 12). To also produce neural **audio files**, extend the script
> to call Cloud TTS (Chirp 3 HD) and store the audio URLs alongside the text.

## Step 11 — Deploy the app

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

# 3. A runtime service account with Firestore + Secret access
gcloud iam service-accounts create dmv-run
SA=dmv-run@PROJECT_ID.iam.gserviceaccount.com
gcloud projects add-iam-policy-binding PROJECT_ID --member="serviceAccount:$SA" --role="roles/datastore.user"
gcloud secrets add-iam-policy-binding gemini-key-encryption-key --member="serviceAccount:$SA" --role="roles/secretmanager.secretAccessor"

# 4. Deploy
gcloud run deploy dmv-app \
  --image $REPO/app:latest --region $REGION --allow-unauthenticated \
  --service-account $SA \
  --set-env-vars FIREBASE_ADMIN_ENABLED=true,GEMINI_TEXT_MODEL=gemini-2.5-flash,APP_CHECK_REQUIRED=true \
  --set-secrets GEMINI_KEY_ENCRYPTION_KEY=gemini-key-encryption-key:latest
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

## Step 12 — Budgets, branch protection, smoke test

- **Budget alerts:** Google Cloud Console → **Billing → Budgets & alerts** →
  create a budget with 50/90/100% email alerts.
- **Branch protection:** require the `test` and `rules` CI checks before merging
  to `main` so only green code deploys.
- **Smoke test:** open the deployed URL → take a test as a guest → sign in →
  confirm progress syncs → in Settings, add a Gemini key → use "Explain in
  Audio" with the "Other…" language.

## Environment variables reference

| Variable | Scope | Required for |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` (6) | build + runtime | Accounts & sync |
| `NEXT_PUBLIC_FIREBASE_EMULATOR` | build + runtime | Local emulator dev (`true`) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | build + runtime | App Check (client) |
| `FIREBASE_ADMIN_ENABLED` / `FIREBASE_SERVICE_ACCOUNT` / `GOOGLE_APPLICATION_CREDENTIALS` | runtime (server) | AI routes (Admin SDK) |
| `GEMINI_KEY_ENCRYPTION_KEY` | runtime (server) | Encrypting users' Gemini keys |
| `GEMINI_TEXT_MODEL` | runtime (server) | Override the Gemini model |
| `APP_CHECK_REQUIRED` | runtime (server) | Enforce App Check on API routes |
| `GEMINI_API_KEY` / `FIREBASE_SERVICE_ACCOUNT` | script only | `generate-explanations.ts` |

`NEXT_PUBLIC_*` values are inlined into the client bundle at build time; all
others are server-only and must never be `NEXT_PUBLIC_`.

---

## Project layout

```
src/
  app/                 # routes: / · /test · /test/review · /road-test · /settings · /api/{key,explain}
  components/          # SiteHeader, TestRunner, Diagram, AudioExplain, AccountMenu, ...
  data/
    questions/         # provenance-tagged bank (official + generated + authored) + validate
    roadTest.ts        # DL-80 road-test content
  lib/
    engine/            # profiles, sampler, scoring, seedable RNG (+ tests)
    progress/          # local store + cloud sync provider + analytics engine (gamification) + test history
    firebase/          # config (env-driven), auth context, App Check
    server/            # crypto, usage caps, admin, genai (route helpers, + tests)
    roadtest/          # self-assessment store (+ tests)
e2e/                   # Playwright specs
firebase-test/         # Firestore rules tests (emulator)
scripts/               # generate-explanations.ts (owner-run)
Dockerfile, apphosting.yaml, firestore.rules, firebase.json
```
