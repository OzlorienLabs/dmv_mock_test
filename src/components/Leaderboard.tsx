"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth";
import { useProgress } from "@/lib/progress/provider";
import { leaderboardScore } from "@/lib/progress/store";
import {
  cloudGetLeaderboardRank,
  cloudGetTopLeaderboard,
  type LeaderboardEntry,
} from "@/lib/leaderboard/cloud";

const TOP_N = 10;

type Status = "loading" | "ready" | "error";

/**
 * Global leaderboard: the top 10 players by number of unique questions answered
 * correctly, plus — when the signed-in user ranks below the top 10 — a row
 * showing their own position. The board is PUBLIC (guests see it too, as a
 * sign-in hook); only signed-in users are listed and get a personal rank.
 * Joining is on by default and can be turned off in Settings.
 */
export function Leaderboard() {
  const { enabled, loading: authLoading, user } = useAuth();
  const { attempts, leaderboardOptOut } = useProgress();
  const signedIn = Boolean(user && !user.isAnonymous);
  const uid = user?.uid ?? null;

  const myScore = useMemo(() => leaderboardScore(attempts), [attempts]);

  const [status, setStatus] = useState<Status>("loading");
  const [top, setTop] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);

  const fetchBoard = useCallback(async () => {
    setStatus("loading");
    try {
      // The board is public: anyone (signed in or not) can see the top players.
      const rows = await cloudGetTopLeaderboard(TOP_N);
      setTop(rows);
      // A personal rank only exists for a signed-in, opted-in user.
      if (signedIn && uid && !leaderboardOptOut) {
        const inTop = rows.findIndex((r) => r.uid === uid);
        setMyRank(inTop >= 0 ? inTop + 1 : await cloudGetLeaderboardRank(myScore));
      } else {
        setMyRank(null);
      }
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [signedIn, uid, leaderboardOptOut, myScore]);

  useEffect(() => {
    void fetchBoard();
  }, [fetchBoard]);

  if (!enabled) {
    return (
      <Card>
        Accounts aren&rsquo;t configured on this deployment, so there&rsquo;s no
        shared leaderboard. Your progress is still saved on this device.
      </Card>
    );
  }
  if (authLoading) {
    return <p className="text-sm text-ca-muted">Loading…</p>;
  }

  const showMyRow =
    signedIn &&
    !leaderboardOptOut &&
    myRank !== null &&
    !top.some((r) => r.uid === uid); // Not already in the visible top list.

  return (
    <div className="space-y-3">
      <p className="text-sm text-ca-gray">
        Ranked by <strong>unique questions answered correctly</strong> across the
        whole question bank. Answer a question right once and it counts; miss it
        on your latest try and it drops off.
      </p>

      {!signedIn && (
        <div className="rounded-xl border border-ca-blue bg-ca-blue/5 p-4">
          <p className="text-sm font-semibold text-ca-ink">
            Sign in to join the leaderboard.
          </p>
          <p className="mt-0.5 text-sm text-ca-gray">
            {myScore > 0
              ? `You'd enter with ${myScore} correct — sign in to claim your spot and see where you rank.`
              : "Take a test, then sign in to appear on the board and track your rank across devices."}
          </p>
        </div>
      )}

      {signedIn && leaderboardOptOut && (
        <Card>
          You&rsquo;ve opted out, so you&rsquo;re not listed.{" "}
          <Link href="/settings#leaderboard" className="font-semibold text-ca-blue underline">
            Turn the leaderboard on
          </Link>{" "}
          in Settings to join.
        </Card>
      )}

      {status === "loading" ? (
        <p className="text-sm text-ca-muted">Loading the leaderboard…</p>
      ) : status === "error" ? (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <span>Couldn&rsquo;t load the leaderboard.</span>
            <button
              type="button"
              onClick={() => void fetchBoard()}
              className="rounded-md border border-ca-line bg-white px-3 py-1.5 text-sm font-semibold text-ca-blue hover:bg-ca-bg"
            >
              Retry
            </button>
          </div>
        </Card>
      ) : top.length === 0 ? (
        <Card>
          No one&rsquo;s on the board yet.{" "}
          <Link href="/test?profile=original&mode=exam" className="font-semibold text-ca-blue underline">
            Take a test
          </Link>{" "}
          to be the first!
        </Card>
      ) : (
        <ol className="divide-y divide-ca-line overflow-hidden rounded-xl border border-ca-line bg-white">
          {top.map((row, i) => (
            <Row
              key={row.uid}
              rank={i + 1}
              entry={row}
              isMe={row.uid === uid}
            />
          ))}
        </ol>
      )}

      {status === "ready" && showMyRow && (
        <>
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-ca-muted">
            Your position
          </p>
          <ol className="overflow-hidden rounded-xl border-2 border-ca-blue bg-white">
            <Row
              rank={myRank!}
              entry={{
                uid: uid!,
                name: user?.displayName?.trim() || user?.email?.split("@")[0] || "You",
                photoURL: user?.photoURL ?? null,
                score: myScore,
                updatedAt: 0,
              }}
              isMe
            />
          </ol>
        </>
      )}
    </div>
  );
}

function Row({
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

function LbAvatar({ name, photoURL }: { name: string; photoURL: string | null }) {
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-ca-line bg-white p-4 text-sm text-ca-gray">
      {children}
    </div>
  );
}
