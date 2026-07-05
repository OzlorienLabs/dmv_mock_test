/**
 * On-device mirror of leaderboard state:
 *  - the opt-out preference, so the toggle reflects instantly and the publish
 *    path can check it synchronously (the authoritative copy is the cloud
 *    users/{uid}.leaderboardOptOut field, reconciled on load);
 *  - a signature of the last-published entry, so we only write to Firestore
 *    when the score / name / photo actually changed.
 */

const OPTOUT_KEY = "dmv:lb-optout:v1";
const PUBLISHED_KEY = "dmv:lb-pub:v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getLeaderboardOptOut(): boolean {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(OPTOUT_KEY) === "1";
}

export function setLeaderboardOptOutLocal(optOut: boolean): void {
  if (!isBrowser()) return;
  if (optOut) window.localStorage.setItem(OPTOUT_KEY, "1");
  else window.localStorage.removeItem(OPTOUT_KEY);
}

export function getPublishedSignature(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(PUBLISHED_KEY);
}

export function setPublishedSignature(sig: string | null): void {
  if (!isBrowser()) return;
  if (sig === null) window.localStorage.removeItem(PUBLISHED_KEY);
  else window.localStorage.setItem(PUBLISHED_KEY, sig);
}
