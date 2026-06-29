"use client";

import { useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/progress/provider";
import { CATEGORY_MAP, type CategoryId } from "@/lib/types";
import { TEST_PROFILES } from "@/lib/engine/profiles";

export function ProgressPanel() {
  const { summary, attempts, loading, cloudActive } = useProgress();

  if (loading && !summary) {
    return (
      <div className="rounded-xl border border-ca-line bg-white p-4 text-sm text-ca-muted">
        Loading your progress…
      </div>
    );
  }

  if (!summary || summary.attempts === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ca-line bg-white p-4 text-sm text-ca-muted">
        Your progress will appear here after your first test.{" "}
        {cloudActive
          ? "It's synced to your account."
          : "Results are saved on this device; sign in to sync across devices."}
      </div>
    );
  }

  // Weakest topics (lowest correct ratio, min 1 question seen).
  const weak = Object.entries(summary.perCategory)
    .map(([cat, s]) => ({
      cat: cat as CategoryId,
      ratio: s!.total ? s!.correct / s!.total : 1,
      ...s!,
    }))
    .filter((x) => x.total >= 1)
    .sort((a, b) => a.ratio - b.ratio)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-ca-line bg-white p-4">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat label="Tests" value={String(summary.attempts)} />
          <Stat label="Passed" value={String(summary.passes)} />
          <Stat label="Best" value={`${summary.bestScorePct}%`} />
        </div>
        <p className="mt-2 text-center text-[11px] text-ca-muted">
          {cloudActive ? "✓ Synced to your account" : "Saved on this device"}
        </p>
        {weak.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ca-muted">
              Focus areas
            </p>
            <ul className="mt-1 space-y-1 text-sm text-ca-gray">
              {weak.map((w) => (
                <li key={w.cat} className="flex justify-between">
                  <span>{CATEGORY_MAP[w.cat].label}</span>
                  <span className="font-semibold">
                    {w.correct}/{w.total}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Test History */}
      {attempts.length > 0 && <TestHistory attempts={attempts} />}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-ca-bg p-3">
      <div className="text-2xl font-extrabold text-ca-blue">{value}</div>
      <div className="text-xs text-ca-muted">{label}</div>
    </div>
  );
}

/* ── Test History Section ───────────────────────────────────── */

import type { StoredAttempt } from "@/lib/progress/store";

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
