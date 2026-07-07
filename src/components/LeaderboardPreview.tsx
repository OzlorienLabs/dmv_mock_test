"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth";
import {
  cloudGetTopLeaderboard,
  type LeaderboardEntry,
} from "@/lib/leaderboard/cloud";
import { LeaderboardRow } from "./LeaderboardRow";

const PREVIEW_N = 5;

/**
 * Compact top-5 leaderboard for the home page — shown to everyone (guests and
 * signed-in users) as a public hook that links through to the full board.
 * Degrades to a plain linking card while loading fails, when the board is empty,
 * or on deployments without Firebase, so the home entry point never disappears.
 */
export function LeaderboardPreview() {
  const { enabled, user } = useAuth();
  const uid = user?.uid ?? null;
  const signedIn = Boolean(user && !user.isAnonymous);

  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    void (async () => {
      try {
        const top = await cloudGetTopLeaderboard(PREVIEW_N);
        if (!cancelled) setRows(top);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  // Fallback (no Firebase, an error, or an empty board): a simple linking card.
  if (!enabled || failed || (rows !== null && rows.length === 0)) {
    return (
      <Link
        href="/leaderboard"
        className="block rounded-xl border border-ca-line bg-white p-4 transition hover:shadow-md"
      >
        <div className="font-bold text-ca-ink">🏆 Leaderboard</div>
        <div className="mt-1 text-sm text-ca-gray">
          See the top drivers ranked by unique questions answered correctly.
          {signedIn ? " View where you rank." : " Sign in to join and track your rank."}
        </div>
      </Link>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ca-line bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-ca-line px-3 py-2">
        <span className="text-sm font-bold text-ca-ink">🏆 Leaderboard</span>
        <Link
          href="/leaderboard"
          className="text-xs font-semibold text-ca-blue hover:underline"
        >
          View all →
        </Link>
      </div>

      {rows === null ? (
        <div className="space-y-2 p-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-ca-bg" />
          ))}
        </div>
      ) : (
        <ol className="divide-y divide-ca-line">
          {rows.map((row, i) => (
            <LeaderboardRow
              key={row.uid}
              rank={i + 1}
              entry={row}
              isMe={row.uid === uid}
            />
          ))}
        </ol>
      )}

      {!signedIn && (
        <p className="border-t border-ca-line px-3 py-2 text-xs text-ca-gray">
          Sign in (top right) to join and track your rank.
        </p>
      )}
    </div>
  );
}
