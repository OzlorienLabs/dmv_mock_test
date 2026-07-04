# Production deployment (Firebase App Hosting)

Push-to-deploy on Cloud Run via **Firebase App Hosting**, gated by CI.

## 1. Connect the repo (push-to-deploy)

1. Firebase Console → **Build → App Hosting → Get started**.
2. Connect this GitHub repository and pick the **`main`** branch as the live
   branch. App Hosting auto-builds and deploys on every push to `main`.
3. App Hosting reads [`apphosting.yaml`](apphosting.yaml) for run config and env.

## 2. CI gates the deploy

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs lint, typecheck,
unit tests, build, Playwright e2e, and the Firestore rules tests on every PR/push.

In GitHub → Settings → **Branches → Branch protection** for `main`, require the
**`test`** and **`rules`** status checks to pass before merging. Combined with
App Hosting deploying `main`, this means **only green code ships**.

## 3. Secrets & env

Set these as App Hosting env / Secret Manager (see `apphosting.yaml`):

- Public web config: `NEXT_PUBLIC_FIREBASE_*` (BUILD + RUNTIME). Put the API key
  in Secret Manager (`firebase-web-api-key`).
- `FIREBASE_ADMIN_ENABLED=true` — App Hosting runs on Cloud Run with Application
  Default Credentials, so `firebase-admin` (used by `/api/feedback`) needs no
  key file.
- Feedback email (optional): `RESEND_API_KEY`, `FEEDBACK_TO`, `FEEDBACK_FROM`.

If you reference any Secret Manager secrets, grant the App Hosting service
account `roles/secretmanager.secretAccessor`.

Then deploy the Firestore rules once:

```bash
npx firebase deploy --only firestore:rules
```

## 4. App Check (optional)

Protects Auth/Firestore and the `/api/feedback` route from abuse.

1. Firebase Console → **Build → App Check** → register the web app with
   **reCAPTCHA Enterprise**; create a key and copy the **site key**.
2. Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (BUILD + RUNTIME) — the client then
   initializes App Check automatically and attaches a token to API calls.
3. Set `APP_CHECK_REQUIRED=true` (RUNTIME) to **enforce** App Check on
   `/api/feedback` (it returns 401 without a valid token).
4. In App Check settings, set Firestore/Auth to **Enforced** when ready.

## 5. Budget alerts

Google Cloud Console → **Billing → Budgets & alerts** → create a budget with
email alerts (e.g. 50/90/100%).

## 6. PWA / offline

The app ships a web manifest and a service worker
([`public/sw.js`](public/sw.js)), so it is **installable** and the static
question bank works **offline** after the first visit. The service worker only
registers in production builds.

## Pre-launch checklist

- [ ] `npm run build` and full CI green.
- [ ] Firestore rules deployed; `npm run test:rules` green.
- [ ] Auth providers (Google, Email/Password) enabled; authorized domains set.
- [ ] Secrets set; App Hosting service account can read them.
- [ ] App Check registered and enforced.
- [ ] Billing budget + alerts configured.
- [ ] Non-affiliation disclaimer visible (it is, in the footer).
