import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  getToken as appCheckGetToken,
  type AppCheck,
} from "firebase/app-check";

/**
 * Firebase is OPTIONAL. The app is fully usable as a guest with on-device
 * progress when Firebase is not configured (no env vars). When the
 * NEXT_PUBLIC_FIREBASE_* vars are present (or the emulator flag is set), auth
 * and Firestore sync are enabled.
 *
 * This keeps local builds, tests, and e2e green without any secrets.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const useEmulator = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === "true";
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

/** True when auth/Firestore features should be active. */
export const firebaseEnabled = Boolean(
  (config.apiKey && config.projectId) || useEmulator,
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let appCheckInstance: AppCheck | null = null;
let emulatorsWired = false;

function ensureApp(): FirebaseApp | null {
  if (!firebaseEnabled) return null;
  if (!app) {
    app = getApps().length
      ? getApp()
      : initializeApp({
          ...config,
          // The emulator only needs a stable projectId; provide demo fallbacks
          // so emulator-only mode works without real credentials.
          apiKey: config.apiKey ?? "demo-api-key",
          projectId: config.projectId ?? "demo-dmv-mock-test",
        });
  }
  maybeInitAppCheck(app);
  return app;
}

/** Initialize App Check once (client-only) when a reCAPTCHA site key is set. */
function maybeInitAppCheck(a: FirebaseApp): void {
  if (appCheckInstance || !recaptchaSiteKey || useEmulator) return;
  if (typeof window === "undefined") return;
  try {
    appCheckInstance = initializeAppCheck(a, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } catch {
    /* App Check is best-effort; ignore init failures. */
  }
}

/** App Check token to attach to API requests, or null if not enabled. */
export async function getAppCheckToken(): Promise<string | null> {
  if (!appCheckInstance) return null;
  try {
    return (await appCheckGetToken(appCheckInstance, false)).token;
  } catch {
    return null;
  }
}

export function getFirebaseAuth(): Auth | null {
  const a = ensureApp();
  if (!a) return null;
  if (!authInstance) {
    authInstance = getAuth(a);
    if (useEmulator) {
      connectAuthEmulator(authInstance, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
    }
  }
  return authInstance;
}

export function getDb(): Firestore | null {
  const a = ensureApp();
  if (!a) return null;
  if (!dbInstance) {
    dbInstance = getFirestore(a);
    if (useEmulator && !emulatorsWired) {
      connectFirestoreEmulator(dbInstance, "127.0.0.1", 8080);
      emulatorsWired = true;
    }
  }
  return dbInstance;
}
