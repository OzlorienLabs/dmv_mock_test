"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useProgress } from "@/lib/progress/provider";
import { getAttempts } from "@/lib/progress/store";
import { TEST_PROFILES } from "@/lib/engine/profiles";
import { CATEGORY_MAP, type Question } from "@/lib/types";
import { QuestionReview } from "@/components/QuestionReview";
import { ConfirmDialog } from "@/components/ConfirmDialog";

/**
 * Client component that reads the attempt ID from search params and renders
 * the full question-by-question review of a past test.
 */
export default function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("id");
  const { attempts, loading, cloudActive, removeAttempt } = useProgress();
  const [questionMap, setQuestionMap] = useState<Map<string, Question> | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Locally-cached history, read synchronously — instant even for signed-in
  // users, so the review renders immediately instead of waiting on the Firestore
  // fetch. Falls back to the provider list (cloud) for tests taken on another
  // device.
  const localAttempts = useMemo(() => getAttempts(), []);
  const attempt = attemptId
    ? (localAttempts.find((a) => a.id === attemptId) ??
      attempts.find((a) => a.id === attemptId))
    : undefined;

  // Lazy-load the full question bank (keeps this route's initial JS small) to
  // map each recorded answer back to its question.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { QUESTIONS } = await import("@/data/questions");
      if (cancelled) return;
      const map = new Map<string, Question>();
      for (const q of QUESTIONS) map.set(q.id, q);
      setQuestionMap(map);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRemove() {
    if (!attempt) return;
    setDeleting(true);
    try {
      await removeAttempt(attempt.id);
      router.replace("/");
    } catch {
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (!attemptId) {
    return (
      <div className="py-16 text-center">
        <p className="text-ca-muted">No test ID specified.</p>
        <Link
          href="/"
          className="mt-3 inline-block rounded-lg bg-ca-blue px-4 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Not found in local history: keep waiting only while the cloud list is still
  // loading (an attempt from another device may still be arriving).
  if (!attempt) {
    if (loading) {
      return (
        <div className="py-16 text-center text-ca-muted">Loading review…</div>
      );
    }
    return (
      <div className="py-16 text-center">
        <p className="text-ca-muted">
          Test not found. It may have been removed or is on another device.
        </p>
        <Link
          href="/"
          className="mt-3 inline-block rounded-lg bg-ca-blue px-4 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Attempt found; the question-bank chunk may still be downloading.
  if (!questionMap) {
    return (
      <div className="py-16 text-center text-ca-muted">Loading review…</div>
    );
  }

  if (!attempt.answers || attempt.answers.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-ca-muted">
          This test was taken before review data was saved. Only newer tests can
          be reviewed question-by-question.
        </p>
        <Link
          href="/"
          className="mt-3 inline-block rounded-lg bg-ca-blue px-4 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Resolve questions — skip any that are no longer in the bank
  const resolved: { question: Question; selectedIndex: number | null }[] = [];
  let skipped = 0;
  for (const ans of attempt.answers) {
    const q = questionMap.get(ans.questionId);
    if (q) {
      resolved.push({ question: q, selectedIndex: ans.selectedIndex });
    } else {
      skipped++;
    }
  }

  const pct =
    attempt.total > 0
      ? Math.round((attempt.correctCount / attempt.total) * 100)
      : 0;
  const profileLabel =
    TEST_PROFILES[attempt.profileId]?.label ?? attempt.profileId;
  const dateStr = formatDate(attempt.dateISO);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-ca-ink">Test Review</h1>
          <p className="text-xs text-ca-muted">
            {profileLabel} · {dateStr}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg border border-ca-red bg-white px-3 py-1.5 text-sm font-semibold text-ca-red hover:bg-ca-red-bg"
          >
            Remove
          </button>
          <Link
            href="/"
            className="rounded-lg border border-ca-line bg-white px-3 py-1.5 text-sm font-semibold text-ca-gray"
          >
            ← Home
          </Link>
        </div>
      </div>

      {/* Score banner */}
      <div
        className={`rounded-xl border p-5 text-center ${
          attempt.passed
            ? "border-ca-green bg-ca-green-bg"
            : "border-ca-red bg-ca-red-bg"
        }`}
      >
        <p
          className={`text-sm font-bold uppercase tracking-wide ${
            attempt.passed ? "text-ca-green" : "text-ca-red"
          }`}
        >
          {attempt.passed ? "You passed" : "Not passed"}
        </p>
        <p className="mt-1 text-4xl font-extrabold text-ca-ink">
          {attempt.correctCount}
          <span className="text-2xl text-ca-muted">/{attempt.total}</span>
        </p>
        <p className="mt-1 text-sm text-ca-gray">
          {pct}% · needed {attempt.passCount} correct to pass
        </p>
      </div>

      {/* Per-category breakdown */}
      <div className="mt-5">
        <h3 className="mb-2 text-sm font-bold text-ca-ink">By topic</h3>
        <ul className="space-y-2">
          {Object.entries(attempt.perCategory).map(([cat, score]) => {
            const s = score as { correct: number; total: number };
            const ratio = s.total ? (s.correct / s.total) * 100 : 0;
            return (
              <li key={cat} className="text-sm">
                <div className="flex justify-between text-ca-gray">
                  <span>
                    {CATEGORY_MAP[cat as keyof typeof CATEGORY_MAP]?.label ??
                      cat}
                  </span>
                  <span className="font-semibold">
                    {s.correct}/{s.total}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-ca-line">
                  <div
                    className={`h-full ${ratio >= 80 ? "bg-ca-green" : ratio >= 50 ? "bg-ca-gold" : "bg-ca-red"}`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Skipped question note */}
      {skipped > 0 && (
        <p className="mt-4 text-xs text-ca-muted">
          {skipped} question{skipped > 1 ? "s" : ""} from this test{" "}
          {skipped > 1 ? "are" : "is"} no longer in the question bank and{" "}
          {skipped > 1 ? "have" : "has"} been omitted.
        </p>
      )}

      {/* Question-by-question review */}
      <h3 className="mb-2 mt-7 text-sm font-bold text-ca-ink">
        Review answers
      </h3>
      <ol className="space-y-3">
        {resolved.map(({ question, selectedIndex }, i) => (
          <QuestionReview
            key={question.id}
            question={question}
            selectedIndex={selectedIndex}
            number={i + 1}
          />
        ))}
      </ol>

      {/* Bottom nav */}
      <div className="mt-6 flex gap-2">
        <Link
          href="/test?profile=original&mode=exam"
          className="flex-1 rounded-lg bg-ca-blue py-2.5 text-center text-sm font-bold text-white hover:bg-ca-blue-dark"
        >
          New test
        </Link>
        <Link
          href="/"
          className="flex-1 rounded-lg border border-ca-line bg-white py-2.5 text-center text-sm font-bold text-ca-blue"
        >
          Home
        </Link>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Remove this test?"
        message={
          cloudActive
            ? "This removes it from your history on all your devices. This can't be undone."
            : "This removes it from your history on this device. This can't be undone."
        }
        confirmLabel="Remove"
        destructive
        busy={deleting}
        onConfirm={handleRemove}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}

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
