# AI "Explain in Audio" setup

## Detailed explanations & offline audio (no setup, no server)

Every question has a **detailed explanation in English, Bengali, and Spanish**
bundled into the app, and **"Explain in Audio" reads them aloud entirely on the
device** with the browser's Speech API — **no network or server call**. This
works offline and for guests.

- **English** is per-question: the correct answer + the question's specific point
  + localized topic guidance.
- **Bengali / Spanish** use accurate, fully-translated **topic-level** guidance
  (`src/data/explanations/categoryTips.ts`) for every question.
- Audio quality depends on the voices installed on the device/OS (English and
  Spanish are widely available; Bengali varies). The text always displays even if
  no matching voice exists.

### Optional: upgrade Bengali/Spanish to per-question (build-time)

Translate each question's English explanation into per-question BN/ES, written to
`src/data/explanations/{bn,es}.json` (bundled, still read offline at runtime):

```bash
GEMINI_API_KEY=AIza... npx tsx scripts/translate-explanations.ts        # add --missing / --limit N
```

The app prefers a per-question translation when present, else the topic-level one.

---

## "Other" languages — bring-your-own Gemini key (server)

Beyond English/Bengali/Spanish, the **"Other…"** option generates an explanation
in any language with the **user's own Gemini key** (server-side). This is the
only path that calls the server. Setup below.

---

## 1. Enable the bring-your-own-key backend

Set these **server-side** env vars (in `.env.local` for dev, or as Cloud
Run / App Hosting secrets in prod — never `NEXT_PUBLIC_`):

```bash
# Firebase Admin (verifies ID tokens, reads/writes user data). One of:
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account", ...}'   # full JSON, one line
# or GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
# or FIREBASE_ADMIN_ENABLED=true   (on GCP with Application Default Credentials)

# Master key that encrypts each user's Gemini key at rest:
GEMINI_KEY_ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

In production, store `GEMINI_KEY_ENCRYPTION_KEY` and the service-account JSON in
**Secret Manager** and mount them as env vars. Enable **App Check** before going
public so only your app can call `/api/explain`.

**How keys are handled:** a signed-in user pastes their Gemini key in
**Settings**. The server encrypts it (AES-256-GCM) and stores only the
ciphertext in `userSecrets/{uid}` — a collection the security rules make
**unreadable by any client**. `/api/explain` decrypts it server-side, calls
Gemini, and enforces a **per-user daily cap** (`users/{uid}/usage/ai`). Users are
told in Settings to set a low daily quota on their key in Google AI Studio.

Get a key at <https://aistudio.google.com/apikey>.

---

## 2. Pre-generate the cached default-language explanations (owner, one-time)

Uses the **owner's** Gemini key and a service account to write `audio/{id}`:

```bash
GEMINI_API_KEY=AIza... \
FIREBASE_SERVICE_ACCOUNT="$(cat service-account.json)" \
npx tsx scripts/generate-explanations.ts          # full bank
# add --missing to only fill gaps on re-runs
```

Then deploy the rules so the cached docs are publicly readable and protected:

```bash
npx firebase deploy --only firestore:rules
```

> **Costs:** generating four languages × ~1,000 questions is ~4,000 model
> calls. Set a billing budget first and verify the model id
> (`GEMINI_TEXT_MODEL`) against the current Gemini API.

---

## Verified vs. needs-your-keys

- **Verified locally:** key encryption/round-trip + daily-cap logic
  (`npm test`), and the Firestore rules that lock down `userSecrets` and
  `usage` and make `audio` read-only (`npm run test:rules`). The app builds and
  runs in guest mode with none of this configured.
- **Needs your keys to verify live:** the actual Gemini text generation in
  `/api/explain` and the `generate-explanations.ts` batch — these call the real
  API and can only be exercised with a Gemini key + service account.

> Note: high-fidelity neural **audio files** (vs. browser text-to-speech) are a
> straightforward future enhancement — generate audio with Cloud TTS / Gemini
> TTS in the batch script and store URLs alongside the text.
