/**
 * Shared Android/TWA config. The Android app is a Trusted Web Activity that
 * loads this same web app, so the only coupling is the Digital Asset Links
 * statement served at /.well-known/assetlinks.json (see the route handler),
 * which verifies the app ↔ domain relationship and removes the URL bar.
 */

/** Reverse-DNS Play Store application id. Keep in sync with android/twa-manifest.json. */
export const ANDROID_PACKAGE_NAME =
  process.env.ANDROID_PACKAGE_NAME || "com.ozlorienlabs.dmvpractice";

/**
 * SHA-256 signing-cert fingerprints allowed to open links for this domain.
 * Set ANDROID_CERT_FINGERPRINTS to a comma-separated list — include BOTH your
 * upload key and (with Play App Signing) Google's app-signing key, from
 * Play Console → Test and release → App integrity. Empty until configured.
 */
export function androidCertFingerprints(): string[] {
  return (process.env.ANDROID_CERT_FINGERPRINTS || "")
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
}

/** The Digital Asset Links statement list served to Android for TWA verification. */
export function assetLinks(): unknown[] {
  const fingerprints = androidCertFingerprints();
  if (fingerprints.length === 0) return [];
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: ANDROID_PACKAGE_NAME,
        sha256_cert_fingerprints: fingerprints,
      },
    },
  ];
}
