"use client";

import { useState } from "react";
import type { LeaderboardEntry } from "@/lib/leaderboard/cloud";

/** A single leaderboard row (rank badge, avatar, name, score). Shared by the
 * full leaderboard and the home-page preview. */
export function LeaderboardRow({
  rank,
  entry,
  isMe,
}: {
  rank: number;
  entry: LeaderboardEntry;
  isMe: boolean;
}) {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
  return (
    <li
      className={`flex items-center gap-3 px-3 py-2.5 ${isMe ? "bg-ca-blue/5" : ""}`}
    >
      <span
        className="w-8 shrink-0 text-center text-base font-extrabold tabular-nums text-ca-gray"
        aria-label={`Rank ${rank}`}
      >
        {medal ?? rank}
      </span>
      <LbAvatar name={entry.name} photoURL={entry.photoURL} />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ca-ink">
        {entry.name}
        {isMe && <span className="ml-1.5 text-xs font-bold text-ca-blue">(You)</span>}
      </span>
      <span className="shrink-0 text-right">
        <span className="text-base font-extrabold tabular-nums text-ca-ink">
          {entry.score}
        </span>
        <span className="ml-1 text-xs text-ca-muted">correct</span>
      </span>
    </li>
  );
}

export function LbAvatar({ name, photoURL }: { name: string; photoURL: string | null }) {
  const [imgError, setImgError] = useState(false);
  const dim = { width: 32, height: 32 };
  if (photoURL && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoURL}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        style={dim}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <span
      aria-hidden
      style={{ ...dim, fontSize: 13 }}
      className="grid shrink-0 place-items-center rounded-full bg-ca-gold font-bold text-ca-blue"
    >
      {initial}
    </span>
  );
}
