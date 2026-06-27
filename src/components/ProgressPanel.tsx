"use client";

import { useEffect, useState } from "react";
import { getSummary, type ProgressSummary } from "@/lib/progress/store";
import { CATEGORY_MAP, type CategoryId } from "@/lib/types";

export function ProgressPanel() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    setSummary(getSummary());
  }, []);

  if (!summary || summary.attempts === 0) {
    return (
      <div className="rounded-xl border border-dashed border-ca-line bg-white p-4 text-sm text-ca-muted">
        Your progress will appear here after your first test. Nothing is sent
        anywhere — results are saved on this device.
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
