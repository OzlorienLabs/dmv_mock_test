# Firebase / Google Cloud setup

The app works fully as a **guest** with on-device progress and needs no setup.
To enable **accounts and cross-device progress sync**, configure Firebase.

You can develop entirely against the **Local Emulator Suite** (no cloud project,
no cost) and only create a real project when you're ready to deploy.

---

## A. Local development with the emulator (no cloud account)

Prereqs: Node 20+ and Java 21+ (firebase-tools requires JDK 21+ for the
Firestore/Auth emulators).

```bash
# 1. Start the emulators (Auth on :9099, Firestore on :8080, UI on :4000)
npm run emulators

# 2. In another terminal, point the app at the emulator and run it
echo "NEXT_PUBLIC_FIREBASE_EMULATOR=true" > .env.local
npm run dev
```

Run the security-rules tests (starts a throwaway emulator automatically):

```bash
npm run test:rules
```

---

## B. Create a real Firebase project (when ready to deploy)

1. **Create the project** — go to <https://console.firebase.google.com>, click
   **Add project**, name it (e.g. `dmv-mock-test`), and finish. This also
   creates the underlying Google Cloud project.

2. **Enable Authentication** — Build → **Authentication** → **Get started**.
   Under **Sign-in method**, enable:
   - **Email/Password**
   - **Google** (set a support email)
   - *(optional)* **Anonymous**, if you later want guest accounts in the cloud.

3. **Create Firestore** — Build → **Firestore Database** → **Create database** →
   **Native mode** → choose a region (e.g. `us-west2`). Start in **production
   mode** (our `firestore.rules` will lock it down).

4. **Register a Web App** — Project settings (gear icon) → **Your apps** →
   **Web** (`</>`). Copy the config values into `.env.local`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
   (Leave `NEXT_PUBLIC_FIREBASE_EMULATOR` unset for real cloud use.)

5. **Publish the Firestore security rules — REQUIRED.** A new database denies
   all reads/writes (production mode) or expires (test mode), so **signed-in
   progress will silently fail to save until you publish the app's rules.** Two
   ways — either works:

   **A. In the Firebase console (no CLI needed — recommended if you deploy via
   App Hosting/GitHub):** Firestore Database → **Rules** tab → replace the
   contents with the app's [`firestore.rules`](firestore.rules) → **Publish**.

   **B. Via the CLI:** point it at your *real* project, then deploy:
   ```bash
   npx firebase use --add   # pick your project (alias it, e.g. "prod")
   npx firebase deploy --only firestore:rules --project YOUR_PROJECT_ID
   ```
   > ⚠️ `.firebaserc`'s `default` is the emulator id `demo-dmv-mock-test`, so a
   > plain `firebase deploy` goes to the demo project, **not** yours. Always pass
   > `--project YOUR_PROJECT_ID` (or `firebase use` your project first).

   Verify: Firestore → **Rules** shows the owner-scoped rules; then sign in,
   finish a test, and a `users/{uid}/attempts/{id}` document appears.

6. **Authorize your domain** — Authentication → Settings → **Authorized
   domains** → add your production domain (localhost is allowed by default).

---

## C. Hardening before launch (later phases)

- **App Check** (reCAPTCHA Enterprise) to reject non-app traffic — Build → App
  Check. Optional; protects Firestore and the `/api/feedback` route from abuse.
- **Budget alerts** — Google Cloud Console → Billing → Budgets & alerts.
- **App Hosting CI/CD** — Build → App Hosting → connect this GitHub repo for
  push-to-deploy (Phase 6). Set the `NEXT_PUBLIC_FIREBASE_*` values as App
  Hosting environment variables.

---

## How the app uses this

- No env vars → **guest mode**: progress in `localStorage`, no sign-in UI.
- Configured → a **Sign in** button appears (Google + email/password). On
  sign-in, any on-device attempts are **migrated to Firestore** once, and
  progress reads/writes go to `users/{uid}/attempts`.
- Security: `firestore.rules` makes user data **owner-only** and content
  **read-only**; verified by `npm run test:rules`.
