"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress/provider";
import { CATEGORY_MAP, type CategoryId, type Question } from "@/lib/types";
import { TEST_PROFILES } from "@/lib/engine/profiles";
import { QUESTIONS, getQuestionById } from "@/data/questions";
import {
  computeStreaks,
  computeScoreTrend,
  computeReadiness,
  computeTroubleQuestions,
  getStreakMessage,
  getTrendMessage,
  type TroubleQuestion,
} from "@/lib/progress/analytics";

import type { StoredAttempt } from "@/lib/progress/store";

export function ProgressPanel() {
  const { summary, attempts, loading, cloudActive } = useProgress();

  // Build question lookup once (client only)
  const [qMap, setQMap] = useState<Map<string, Question> | null>(null);
  useEffect(() => {
    const m = new Map<string, Question>();
    for (const q of QUESTIONS) m.set(q.id, q);
    setQMap(m);
  }, []);

  // Compute analytics
  const streaks = useMemo(() => computeStreaks(attempts), [attempts]);
  const trend = useMemo(() => computeScoreTrend(attempts), [attempts]);
  const readiness = useMemo(
    () => computeReadiness(attempts, summary?.bestScorePct ?? 0),
    [attempts, summary?.bestScorePct],
  );
  const troubleQs = useMemo(
    () => (qMap ? computeTroubleQuestions(attempts, qMap) : []),
    [attempts, qMap],
  );

  if (loading && !summary) {
    return (
      <div className="rounded-xl border border-ca-line bg-white p-4 text-sm text-ca-muted">
        Loading your progress…
      </div>
    );
  }

  if (!summary || summary.attempts === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ca-line bg-white p-6 text-center">
        <p className="text-3xl">🎯</p>
        <p className="mt-2 text-sm font-semibold text-ca-ink">
          Your progress will appear here
        </p>
        <p className="mt-1 text-xs text-ca-muted">
          Take your first test to start tracking streaks, readiness, and more.
        </p>
        <Link
          href="/test?profile=original&mode=practice"
          className="mt-3 inline-block rounded-lg bg-ca-blue px-4 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark"
        >
          Start practicing
        </Link>
        <p className="mt-3 text-[11px] text-ca-muted">
          {cloudActive
            ? "✓ Progress synced to your account"
            : "Results saved on this device · sign in to sync"}
        </p>
      </div>
    );
  }

  // Weakest topics
  const weak = Object.entries(summary.perCategory)
    .map(([cat, s]) => ({
      cat: cat as CategoryId,
      ratio: s!.total ? s!.correct / s!.total : 1,
      ...s!,
    }))
    .filter((x) => x.total >= 1)
    .sort((a, b) => a.ratio - b.ratio)
    .slice(0, 3);

  const avgScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce(
            (sum, a) =>
              sum + (a.total > 0 ? (a.correctCount / a.total) * 100 : 0),
            0,
          ) / attempts.length,
        )
      : 0;

  return (
    <div className="space-y-3">
      {/* ── Readiness Meter ───────────────────────────────── */}
      <ReadinessCard readiness={readiness} />

      {/* ── Streak & Motivation ───────────────────────────── */}
      <StreakCard streaks={streaks} />

      {/* ── Score Trend ───────────────────────────────────── */}
      {trend.recentScores.length >= 2 && <TrendCard trend={trend} />}

      {/* ── Stats Grid ────────────────────────────────────── */}
      <div className="rounded-xl border border-ca-line bg-white p-4">
        <div className="grid grid-cols-4 gap-2 text-center">
          <Stat label="Tests" value={String(summary.attempts)} />
          <Stat label="Passed" value={String(summary.passes)} />
          <Stat label="Best" value={`${summary.bestScorePct}%`} />
          <Stat label="Avg" value={`${avgScore}%`} />
        </div>
        <p className="mt-2 text-center text-[11px] text-ca-muted">
          {cloudActive ? "✓ Synced to your account" : "Saved on this device"}
        </p>
      </div>

      {/* ── Trouble Questions ─────────────────────────────── */}
      {troubleQs.length > 0 && <TroubleQuestionsCard troubleQs={troubleQs} />}

      {/* ── Focus Areas ───────────────────────────────────── */}
      {weak.length > 0 && (
        <div className="rounded-xl border border-ca-line bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ca-muted">
            Focus areas
          </p>
          <ul className="mt-2 space-y-2">
            {weak.map((w) => {
              const pct = Math.round(w.ratio * 100);
              return (
                <li key={w.cat}>
                  <div className="flex justify-between text-sm text-ca-gray">
                    <span>{CATEGORY_MAP[w.cat].label}</span>
                    <span className="font-semibold">
                      {w.correct}/{w.total}{" "}
                      <span className="text-xs text-ca-muted">({pct}%)</span>
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ca-line">
                    <div
                      className={`h-full transition-all ${pct >= 80 ? "bg-ca-green" : pct >= 50 ? "bg-ca-gold" : "bg-ca-red"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Test History ──────────────────────────────────── */}
      {attempts.length > 0 && <TestHistory attempts={attempts} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
 * Sub-components
 * ═══════════════════════════════════════════════════════════════ */

/* ── Readiness Card ──────────────────────────────────────────── */

function ReadinessCard({
  readiness,
}: {
  readiness: ReturnType<typeof computeReadiness>;
}) {
  const levels: { key: string; label: string; color: string; emoji: string }[] =
    [
      { key: "not-started", label: "Start", color: "bg-ca-line", emoji: "🟡" },
      { key: "learning", label: "Learning", color: "bg-ca-orange", emoji: "🟠" },
      { key: "almost-ready", label: "Almost", color: "bg-ca-blue", emoji: "🔵" },
      { key: "test-ready", label: "Ready!", color: "bg-ca-green", emoji: "🟢" },
    ];

  const activeIdx = levels.findIndex((l) => l.key === readiness.level);
  const isReady = readiness.level === "test-ready";

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        isReady
          ? "border-ca-green bg-ca-green-bg"
          : "border-ca-line bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ca-muted">
          Test readiness
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
            isReady
              ? "bg-ca-green text-white"
              : readiness.level === "almost-ready"
                ? "bg-ca-blue text-white"
                : "bg-ca-bg text-ca-muted"
          }`}
        >
          {readiness.label}
        </span>
      </div>

      {/* Progress steps */}
      <div className="mt-3 flex gap-1">
        {levels.map((l, i) => (
          <div key={l.key} className="flex-1">
            <div
              className={`h-2 rounded-full transition-all ${
                i <= activeIdx ? l.color : "bg-ca-line"
              }`}
            />
            <p className="mt-1 text-center text-[9px] text-ca-muted">
              {l.emoji}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-2 text-sm text-ca-gray">{readiness.message}</p>

      {isReady ? (
        <Link
          href="/test?profile=original&mode=exam"
          className="mt-3 block rounded-lg bg-ca-green py-2.5 text-center text-sm font-bold text-white hover:opacity-90"
        >
          Take the real mock test →
        </Link>
      ) : (
        <Link
          href="/test?profile=original&mode=practice"
          className="mt-3 block rounded-lg border border-ca-blue bg-white py-2 text-center text-xs font-semibold text-ca-blue hover:bg-ca-bg"
        >
          Keep practicing →
        </Link>
      )}
    </div>
  );
}

/* ── Streak Card ─────────────────────────────────────────────── */

function StreakCard({
  streaks,
}: {
  streaks: ReturnType<typeof computeStreaks>;
}) {
  return (
    <div className="rounded-xl border border-ca-line bg-white p-4">
      <div className="flex items-start gap-3">
        {/* Fire icon with pulse animation when streak active */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
            streaks.currentStreak > 0
              ? "bg-ca-orange-bg animate-pulse"
              : "bg-ca-bg"
          }`}
          style={
            streaks.currentStreak > 0
              ? { animationDuration: "2s" }
              : undefined
          }
        >
          {streaks.currentStreak > 0 ? "🔥" : "💤"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-ca-ink">
              {streaks.currentStreak}
            </span>
            <span className="text-sm text-ca-muted">
              day{streaks.currentStreak !== 1 ? "s" : ""} streak
            </span>
          </div>
          <p className="text-sm text-ca-gray">
            {getStreakMessage(streaks.currentStreak)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-3 border-t border-ca-line pt-3">
        <MiniStat
          emoji="🏅"
          label="Longest streak"
          value={`${streaks.longestStreak} day${streaks.longestStreak !== 1 ? "s" : ""}`}
        />
        <MiniStat
          emoji="✅"
          label="Pass streak"
          value={`${streaks.passStreak} in a row`}
        />
        <MiniStat
          emoji={streaks.practicedToday ? "📗" : "📕"}
          label="Today"
          value={streaks.practicedToday ? "Done!" : "Not yet"}
        />
      </div>
    </div>
  );
}

function MiniStat({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex-1 text-center">
      <p className="text-lg">{emoji}</p>
      <p className="text-xs font-semibold text-ca-ink">{value}</p>
      <p className="text-[10px] text-ca-muted">{label}</p>
    </div>
  );
}

/* ── Trend Card ──────────────────────────────────────────────── */

function TrendCard({
  trend,
}: {
  trend: ReturnType<typeof computeScoreTrend>;
}) {
  const max = Math.max(...trend.recentScores, 100);
  const trendArrow =
    trend.direction === "improving"
      ? "↑"
      : trend.direction === "declining"
        ? "↓"
        : "→";
  const trendColor =
    trend.direction === "improving"
      ? "text-ca-green"
      : trend.direction === "declining"
        ? "text-ca-red"
        : "text-ca-muted";

  return (
    <div className="rounded-xl border border-ca-line bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ca-muted">
          Score trend
        </p>
        <span className={`text-sm font-bold ${trendColor}`}>
          {trendArrow} {getTrendMessage(trend.direction)}
        </span>
      </div>

      {/* Sparkline chart */}
      <div className="mt-3 flex items-end gap-1" style={{ height: 48 }}>
        {trend.recentScores.map((score, i) => {
          const h = max > 0 ? (score / max) * 100 : 0;
          const isLast = i === trend.recentScores.length - 1;
          return (
            <div
              key={i}
              className="group relative flex-1"
              style={{ height: "100%" }}
            >
              <div
                className={`absolute bottom-0 w-full rounded-t transition-all ${
                  score >= 83
                    ? "bg-ca-green"
                    : score >= 60
                      ? "bg-ca-gold"
                      : "bg-ca-red"
                } ${isLast ? "opacity-100" : "opacity-60"}`}
                style={{ height: `${h}%`, minHeight: 4 }}
              />
              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-ca-ink px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">
                {score}%
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-ca-muted">
        <span>Oldest</span>
        <span>Latest</span>
      </div>

      {/* Pass line indicator */}
      <p className="mt-2 text-center text-[11px] text-ca-muted">
        Avg last 3: <span className="font-semibold text-ca-ink">{trend.recentAvg}%</span>
        {trend.previousAvg > 0 && (
          <>
            {" "}· Previous 3: <span className="font-semibold text-ca-ink">{trend.previousAvg}%</span>
          </>
        )}
      </p>
    </div>
  );
}

/* ── Stat (kept from original) ───────────────────────────────── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ca-bg p-3">
      <div className="text-2xl font-extrabold text-ca-blue">{value}</div>
      <div className="text-xs text-ca-muted">{label}</div>
    </div>
  );
}

/* ── Trouble Questions Card ──────────────────────────────────── */

function TroubleQuestionsCard({
  troubleQs,
}: {
  troubleQs: TroubleQuestion[];
}) {
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const visible = showAll ? troubleQs : troubleQs.slice(0, 5);

  return (
    <div className="rounded-xl border border-ca-red/30 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="text-base">❌</span>
        <p className="text-xs font-semibold uppercase tracking-wide text-ca-red">
          Questions you keep getting wrong
        </p>
      </div>
      <p className="mt-1 text-[11px] text-ca-muted">
        These questions tripped you up multiple times. Review them to lock in
        the correct answers.
      </p>

      <ul className="mt-3 space-y-2">
        {visible.map((tq) => {
          const q = getQuestionById(tq.questionId);
          if (!q) return null;
          const expanded = expandedId === tq.questionId;
          const missPct = Math.round(tq.missRatio * 100);

          return (
            <li key={tq.questionId}>
              <button
                type="button"
                onClick={() =>
                  setExpandedId(expanded ? null : tq.questionId)
                }
                className="w-full rounded-lg border border-ca-line bg-white p-3 text-left transition hover:border-ca-red/40 hover:shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-ca-ink">
                      {q.prompt}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-ca-bg px-1.5 py-0.5 text-[10px] font-semibold text-ca-muted">
                        {CATEGORY_MAP[q.category]?.label ?? q.category}
                      </span>
                      <span className="text-[11px] text-ca-red font-semibold">
                        Missed {tq.wrongCount} of {tq.seenCount} times
                      </span>
                    </div>
                    {/* Miss ratio bar */}
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ca-line">
                      <div
                        className="h-full bg-ca-red transition-all"
                        style={{ width: `${missPct}%` }}
                      />
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-ca-muted">
                    {expanded ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {/* Expanded in-place review */}
              {expanded && (
                <div className="mt-1 rounded-lg border border-ca-line bg-ca-bg p-3">
                  <p className="text-sm font-medium text-ca-ink">{q.prompt}</p>
                  <ul className="mt-2 space-y-1">
                    {q.options.map((opt, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${
                          i === q.correctIndex
                            ? "bg-ca-green-bg font-semibold text-ca-green"
                            : "text-ca-gray"
                        }`}
                      >
                        <span className="font-bold">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        <span>{opt}</span>
                        {i === q.correctIndex && (
                          <span className="ml-auto text-[10px] font-bold uppercase">
                            ✓ Correct
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  {q.explanation && (
                    <p className="mt-2 text-sm text-ca-gray">
                      <span className="font-semibold">Why: </span>
                      {q.explanation}
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {troubleQs.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 w-full rounded-lg border border-ca-line bg-white py-2 text-center text-xs font-semibold text-ca-red transition hover:bg-ca-red-bg"
        >
          {showAll
            ? "Show less"
            : `Show all ${troubleQs.length} trouble questions`}
        </button>
      )}

      <Link
        href="/test?profile=original&mode=practice"
        className="mt-3 block rounded-lg border border-ca-red bg-white py-2 text-center text-xs font-semibold text-ca-red transition hover:bg-ca-red-bg"
      >
        Practice these topics →
      </Link>
    </div>
  );
}

/* ── Test History Section ───────────────────────────────────── */

function TestHistory({ attempts }: { attempts: StoredAttempt[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? attempts : attempts.slice(0, 5);

  return (
    <div className="rounded-xl border border-ca-line bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-ca-muted">
        Test history
      </p>
      <ul className="mt-3 space-y-2">
        {visible.map((a) => {
          const pct = a.total > 0 ? Math.round((a.correctCount / a.total) * 100) : 0;
          const profileLabel =
            TEST_PROFILES[a.profileId]?.label ?? a.profileId;
          const dateStr = formatDate(a.dateISO);
          const hasReview = Boolean(a.answers && a.answers.length > 0);

          return (
            <li key={a.id}>
              <div className="group relative flex items-center gap-3 rounded-lg border border-ca-line bg-white px-3 py-2.5 transition hover:border-ca-blue/40 hover:shadow-sm">
                {/* Pass/fail indicator dot */}
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                    a.passed ? "bg-ca-green" : "bg-ca-red"
                  }`}
                  aria-label={a.passed ? "Passed" : "Not passed"}
                />

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ca-ink">
                      {a.correctCount}/{a.total}
                    </span>
                    <span className="text-xs text-ca-muted">({pct}%)</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                        a.passed
                          ? "bg-ca-green-bg text-ca-green"
                          : "bg-ca-red-bg text-ca-red"
                      }`}
                    >
                      {a.passed ? "Pass" : "Fail"}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-ca-muted">
                    <span>{profileLabel}</span>
                    <span>·</span>
                    <span>{dateStr}</span>
                  </div>
                </div>

                {/* Review link */}
                {hasReview ? (
                  <Link
                    href={`/test/review?id=${encodeURIComponent(a.id)}`}
                    className="shrink-0 rounded-md border border-ca-line bg-white px-2.5 py-1 text-xs font-semibold text-ca-blue transition hover:border-ca-blue hover:bg-ca-bg"
                  >
                    Review
                  </Link>
                ) : (
                  <span className="shrink-0 text-[10px] text-ca-muted">
                    No review data
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {attempts.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="mt-3 w-full rounded-lg border border-ca-line bg-white py-2 text-center text-xs font-semibold text-ca-blue transition hover:bg-ca-bg"
        >
          {showAll ? "Show less" : `Show all ${attempts.length} tests`}
        </button>
      )}
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
