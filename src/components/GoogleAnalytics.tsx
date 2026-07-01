import Script from "next/script";

/**
 * Optional Google Analytics 4. Renders nothing unless a measurement id is
 * provided, so the app ships with zero tracking by default and only measures
 * once you opt in. The id is read server-side in the root layout (see
 * `gaMeasurementId`) so either `NEXT_PUBLIC_GA_ID` or the server-only
 * `GOOGLE_ANALYTICS_ID` works.
 */
export function GoogleAnalytics({ gaId }: { gaId?: string }) {
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}

/**
 * Resolve the GA4 measurement id from env (server-side). Prefers the
 * client-safe var, then falls back to the server-only one that already exists
 * in this project's config.
 */
export function gaMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_ID || process.env.GOOGLE_ANALYTICS_ID || undefined;
}
