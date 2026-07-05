"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth";
import { useProgress } from "@/lib/progress/provider";

/**
 * Settings section to opt in/out of the public leaderboard. Signed-in users are
 * listed by default; turning this off removes their entry and stops publishing
 * their score. The preference syncs across devices (stored on the user's doc).
 */
export function LeaderboardSettings() {
  const { user } = useAuth();
  const { leaderboardOptOut, setLeaderboardOptOut } = useProgress();
  const [busy, setBusy] = useState(false);

  const listed = !leaderboardOptOut;
  const displayName =
    user?.displayName?.trim() || user?.email?.split("@")[0] || "Anonymous driver";

  async function toggle() {
    setBusy(true);
    try {
      await setLeaderboardOptOut(!leaderboardOptOut);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="leaderboard" className="scroll-mt-20 space-y-3">
      <h2 className="text-sm font-bold uppercase tracking-wide text-ca-muted">
        Leaderboard
      </h2>

      <div className="rounded-xl border border-ca-line bg-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ca-ink">
              Show me on the leaderboard
            </p>
            <p className="mt-0.5 text-xs text-ca-gray">
              {listed ? (
                <>
                  You&rsquo;re listed as{" "}
                  <span className="font-semibold text-ca-ink">{displayName}</span>{" "}
                  with your profile photo.{" "}
                  <Link href="/leaderboard" className="text-ca-blue underline">
                    View the leaderboard
                  </Link>
                  .
                </>
              ) : (
                <>You&rsquo;re hidden from the leaderboard and your score isn&rsquo;t published.</>
              )}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={listed}
            aria-label="Show me on the leaderboard"
            disabled={busy}
            onClick={toggle}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-50 ${
              listed ? "bg-ca-blue" : "bg-ca-line"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                listed ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}
