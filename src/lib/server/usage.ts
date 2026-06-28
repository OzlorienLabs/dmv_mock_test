/**
 * Per-user daily cap for AI calls made with the user's own Gemini key. Pure
 * logic so it can be unit-tested; the route handler reads/writes the usage doc
 * in Firestore around these functions.
 */
export interface UsageDoc {
  dateKey: string;
  audioCalls: number;
}

/** Default ceiling; the user is also advised to set a quota in Google AI Studio. */
export const DEFAULT_DAILY_AUDIO_CALLS = 50;

/** Day bucket (UTC date). Usage resets when the date rolls over. */
export function dateKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function callsUsed(usage: UsageDoc | null, today: string): number {
  if (!usage || usage.dateKey !== today) return 0;
  return usage.audioCalls;
}

export function canMakeCall(
  usage: UsageDoc | null,
  today: string,
  limit: number,
): boolean {
  return callsUsed(usage, today) < limit;
}

export function incrementUsage(usage: UsageDoc | null, today: string): UsageDoc {
  return { dateKey: today, audioCalls: callsUsed(usage, today) + 1 };
}
