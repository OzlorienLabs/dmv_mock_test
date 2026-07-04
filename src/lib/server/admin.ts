import {
  getApps,
  initializeApp,
  cert,
  applicationDefault,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAppCheck } from "firebase-admin/app-check";

/**
 * Server-side Firebase Admin. Used by the /api/feedback route to store
 * submissions and (optionally) verify App Check. Initialized only when
 * credentials are configured; otherwise callers degrade to a clear
 * "not configured" response.
 *
 * Credentials, in order of preference:
 *   - FIREBASE_SERVICE_ACCOUNT  (full service-account JSON, e.g. from Secret Manager)
 *   - GOOGLE_APPLICATION_CREDENTIALS  (path to a key file)
 *   - Application Default Credentials  (when running on GCP; set FIREBASE_ADMIN_ENABLED=true)
 */
export function adminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.FIREBASE_ADMIN_ENABLED === "true",
  );
}

let app: App | null = null;

export function getAdminApp(): App | null {
  if (!adminConfigured()) return null;
  if (app) return app;
  if (getApps().length) {
    app = getApps()[0];
    return app;
  }
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  app = initializeApp(
    sa
      ? { credential: cert(JSON.parse(sa)) }
      : { credential: applicationDefault() },
  );
  return app;
}

export function getAdminDb(): Firestore | null {
  const a = getAdminApp();
  return a ? getFirestore(a) : null;
}

/**
 * Verify the App Check token. Enforced only when APP_CHECK_REQUIRED=true (so the
 * app works without App Check in dev). Returns true when not enforced.
 */
export async function appCheckOk(token: string | null): Promise<boolean> {
  if (process.env.APP_CHECK_REQUIRED !== "true") return true;
  const a = getAdminApp();
  if (!a || !token) return false;
  try {
    await getAppCheck(a).verifyToken(token);
    return true;
  } catch {
    return false;
  }
}
