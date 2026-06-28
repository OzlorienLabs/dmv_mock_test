"use client";

import { useProgress } from "@/lib/progress/provider";
import { CATEGORY_MAP, type CategoryId } from "@/lib/types";

export function ProgressPanel() {
  const { summary, loading, cloudActive } = useProgress();

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
          ? "It’s synced to your account."
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
