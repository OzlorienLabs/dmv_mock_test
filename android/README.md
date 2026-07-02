# Android app (Trusted Web Activity)

The Android app is a **Trusted Web Activity (TWA)**: a tiny native shell that
opens the already-deployed web app full-screen inside the device's Chrome
engine — no browser URL bar. It is generated with
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap).

**Why TWA**

- **Light** — the app is ~1 MB; it ships no bundled web content or web view.
- **Maximum reuse** — it runs the exact same deployed site, so every feature,
  fix, and question update ships to Android automatically the moment you deploy
  the web app. No second codebase.
- **Shared login** — the TWA runs inside the user's Chrome, so it shares
  Chrome's storage for your domain. On the same device, a session started in
  Chrome is already signed in. Across devices, the user signs in once in the
  app (Google or email/password) and lands in the **same Firebase account with
  the same synced progress** — because auth + Firestore sync already back the
  web app. Guest progress migrates on sign-in, exactly as on the web.

Only one file couples the app to the site: the Digital Asset Links statement at
`/.well-known/assetlinks.json` (served by the Next.js route
`src/app/.well-known/assetlinks.json/route.ts`), which verifies the app↔domain
relationship and removes the URL bar.

---

## Source of truth

- [`twa-manifest.json`](./twa-manifest.json) — the committed Bubblewrap config.
  Edit this, then regenerate the native project. Everything else Bubblewrap
  generates here (`app/`, Gradle files, keystore, `.aab`/`.apk`) is a **build
  artifact and is git-ignored** — never commit the keystore.

Before your first build, edit `twa-manifest.json` and replace
`dmv-practice.example.com` with your real production domain in **all** of
`host`, `iconUrl`, `maskableIconUrl`, `webManifestUrl`, `fullScopeUrl`, and the
shortcut `chosenIconUrl`s. Confirm `packageId` (default
`com.ozlorienlabs.dmvpractice`) — this is permanent once published.

---

## Prerequisites

1. **Deploy the web app first** and confirm the PWA manifest and icons are live:
   - `https://YOUR_DOMAIN/manifest.webmanifest`
   - `https://YOUR_DOMAIN/icons/icon-512.png` and `/icons/maskable-512.png`
2. **JDK 17** and the **Android SDK**. The easiest path is to let Bubblewrap
   install and manage its own copies:
   ```bash
   npx @bubblewrap/cli doctor        # checks/install JDK + Android SDK
   ```
   (Alternatively install Android Studio and point `JAVA_HOME`/`ANDROID_HOME`
   at its JDK 17 and SDK.)

All commands below are run from this `android/` directory unless noted.

---

## 1. Generate a signing key (one time)

```bash
keytool -genkeypair -v \
  -keystore android.keystore \
  -alias dmvpractice \
  -keyalg RSA -keysize 2048 -validity 10000
```

Keep `android.keystore` and its passwords **safe and backed up** — you cannot
update the app later without them. The path/alias already match
`twa-manifest.json`.

## 2. Generate the native project and build

```bash
# From repo root you can also use: npm run android:build
npx @bubblewrap/cli update    # (re)generate the Gradle project from twa-manifest.json
npx @bubblewrap/cli build     # produces app-release-bundle.aab (for Play) + app-release-signed.apk
```

First run only, if the project has never been generated here, use `init`
instead of `update`:

```bash
npx @bubblewrap/cli init --manifest https://YOUR_DOMAIN/manifest.webmanifest
```

`build` prints the **SHA-256 fingerprint** of your signing key — copy it; you
need it for step 3. (Re-print any time with
`keytool -list -v -keystore android.keystore -alias dmvpractice`.)

## 3. Wire up Digital Asset Links (removes the URL bar)

The site must serve your app's fingerprint at `/.well-known/assetlinks.json`.
This repo generates that file from env — no code change needed:

1. Set env on the deployed web app (Firebase App Hosting → backend env, or
   `.env`):
   ```
   ANDROID_PACKAGE_NAME=com.ozlorienlabs.dmvpractice
   ANDROID_CERT_FINGERPRINTS=AA:BB:CC:...   # your upload-key SHA-256 from step 2
   ```
2. Redeploy the web app and verify:
   ```bash
   curl https://YOUR_DOMAIN/.well-known/assetlinks.json
   ```
   It must return your package + fingerprint.

> After you enable **Play App Signing** (step 5), Google re-signs the app with
> its own key. Add **both** fingerprints (comma-separated) to
> `ANDROID_CERT_FINGERPRINTS`: your upload key **and** Google's app-signing key
> (Play Console → Test and release → App integrity → App signing key
> certificate). Otherwise the URL bar will show in the published app.

## 4. Test on a device or emulator

```bash
# Enable USB debugging on an Android phone, plug it in, then:
npx @bubblewrap/cli install       # installs app-release-signed.apk
# or: adb install -r app-release-signed.apk
```

Verify:
- The app opens full-screen with **no browser URL bar** (this confirms
  assetlinks is correct; if you see a URL bar, re-check step 3, then reinstall).
- Take a test as a guest → progress saves.
- Sign in with Google or email → you land in your existing account and your
  synced progress appears. Sign in on the web with the same account → same data.

## 5. Publish to Google Play

1. Create a Google **Play Console** account (one-time US$25) and a new app
   (Class C DMV practice; category *Education*; free).
2. **Play App Signing**: keep it enabled (default). Upload the
   **`app-release-bundle.aab`** from step 2 to a track.
3. Start with the **Internal testing** track: add tester emails, upload the AAB,
   share the opt-in link, install from Play on a test device, and re-verify
   no URL bar + login continuity.
4. Grab **Google's app-signing SHA-256** from *App integrity* and add it to
   `ANDROID_CERT_FINGERPRINTS` (step 3), redeploy, and re-test.
5. Complete the store listing: app name, short/full description, 512×512 icon
   (`public/icons/icon-512.png`), feature graphic (1024×500), 2+ phone
   screenshots, privacy policy URL, Data safety form, and content rating.
6. Promote **Internal → Closed → Open/Production** when you're satisfied. First
   production review typically takes a few days.

## 6. Shipping updates

- **Web content / questions / fixes:** just deploy the web app — the TWA picks
  them up automatically. No Play release needed.
- **App shell changes (name, icon, package config):** bump `appVersionCode`
  (and `appVersionName`) in `twa-manifest.json`, then
  `npx @bubblewrap/cli update && npx @bubblewrap/cli build`, and upload the new
  AAB to Play.

## Troubleshooting

- **URL bar still shows** → assetlinks fingerprint mismatch. Confirm
  `/.well-known/assetlinks.json` lists the fingerprint that actually signed the
  installed build (upload key for local installs; Google's app-signing key for
  Play installs), then reinstall.
- **Google sign-in doesn't complete in the app** → in the very rare case the
  popup flow misbehaves inside the TWA, switch the web app's Google sign-in to
  `signInWithRedirect` (see `src/lib/firebase/auth.tsx`); email/password is
  unaffected.
- **`bubblewrap` can't find JDK/SDK** → run `npx @bubblewrap/cli doctor` and let
  it install them, or set `JAVA_HOME` (JDK 17) and `ANDROID_HOME`.
