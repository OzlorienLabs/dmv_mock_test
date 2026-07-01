"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "@/data/questions";
import {
  buildAdaptiveMockTest,
  mulberry32,
  randomSeed,
  scoreAttempt,
  type AttemptResult,
} from "@/lib/engine";
import { getProfile, type TestProfileId } from "@/lib/engine/profiles";
import { useProgress } from "@/lib/progress/provider";
import { questionStats } from "@/lib/progress/store";
import { getDetailedExplanation } from "@/lib/explanations/detailed";
import { CATEGORY_MAP, type Question } from "@/lib/types";
import { Diagram, resolveDiagramId } from "./Diagram";
import { AudioExplain } from "./AudioExplain";
import { OriginBadge } from "./OriginBadge";
import { QuestionReview } from "./QuestionReview";

export type RunMode = "exam" | "practice";

export function TestRunner({
  profileId,
  mode,
  practiceCount = 10,
}: {
  profileId: TestProfileId;
  mode: RunMode;
  practiceCount?: number;
}) {
  const profile = getProfile(profileId);
  const targetCount = mode === "practice" ? practiceCount : profile.questionCount;
  const passCount =
    mode === "practice" ? Math.ceil(targetCount * 0.83) : profile.passCount;

  const { recordAttempt, attempts, loading } = useProgress();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const builtRef = useRef(false);
  const adaptive = attempts.length > 0;

  const buildTest = useCallback(
    () =>
      buildAdaptiveMockTest(
        QUESTIONS,
        targetCount,
        mulberry32(randomSeed()),
        questionStats(attempts),
      ),
    [targetCount, attempts],
  );

  // Build once the learner's history has loaded (client-only) so selection can
  // focus on questions they haven't mastered yet. Avoids SSR/CSR mismatch.
  useEffect(() => {
    if (builtRef.current || loading) return;
    builtRef.current = true;
    setQuestions(buildTest());
  }, [loading, buildTest]);

  const result: AttemptResult | null = useMemo(() => {
    if (!finished || questions.length === 0) return null;
    const answerItems = questions.map((q) => ({
      questionId: q.id,
      selectedIndex: answers[q.id] ?? null,
    }));
    return scoreAttempt(questions, answerItems, passCount);
  }, [finished, questions, answers, passCount]);

  // Persist the attempt once when finished (local always; cloud if signed in).
  useEffect(() => {
    if (!finished || !result) return;
    void recordAttempt({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      profileId,
      dateISO: new Date().toISOString(),
      total: result.total,
      correctCount: result.correctCount,
      passCount: result.passCount,
      passed: result.passed,
      perCategory: result.perCategory,
      answers: result.items.map((it) => ({
        questionId: it.questionId,
        selectedIndex: it.selectedIndex,
        correct: it.correct,
      })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  function reset() {
    setAnswers({});
    setCurrent(0);
    setFinished(false);
    setQuestions(buildTest());
    window.scrollTo({ top: 0 });
  }

  if (questions.length === 0) {
    return <p className="py-16 text-center text-ca-muted">Preparing your test…</p>;
  }

  if (finished && result) {
    return <Results result={result} questions={questions} answers={answers} onRetake={reset} />;
  }

  const q = questions[current];
  const selected = answers[q.id] ?? null;
  const revealed = mode === "practice" && selected !== null;
  const answeredCount = questions.filter((x) => answers[x.id] != null).length;
  const isLast = current === questions.length - 1;

  function choose(i: number) {
    if (revealed) return; // locked after answering in practice mode
    setAnswers((a) => ({ ...a, [q.id]: i }));
  }

  function go(delta: number) {
    setCurrent((c) => Math.min(questions.length - 1, Math.max(0, c + delta)));
    window.scrollTo({ top: 0 });
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-3" data-testid="test-progress">
        <div className="flex items-center justify-between text-sm text-ca-gray">
          <span className="font-semibold">
            Question {current + 1} of {questions.length}
          </span>
          <span>
            {answeredCount} answered · {mode === "exam" ? `pass ${passCount}/${questions.length}` : "practice"}
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ca-line">
          <div
            className="h-full bg-ca-blue transition-all"
            style={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
        {adaptive && (
          <p className="mt-1.5 text-xs text-ca-blue">
            ★ Focusing on questions you haven’t mastered yet.
          </p>
        )}
      </div>

      {/* Question card */}
      <div className="rounded-xl border border-ca-line bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-ca-blue">
          {CATEGORY_MAP[q.category].label}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-ca-ink">{q.prompt}</h2>

        {(() => {
          const diagramId = resolveDiagramId(q);
          return diagramId ? (
            <div className="mt-3 max-w-xs">
              <Diagram id={diagramId} />
            </div>
          ) : null;
        })()}

        <ul className="mt-4 space-y-2">
          {q.options.map((opt, i) => {
            const isSelected = i === selected;
            const isCorrect = i === q.correctIndex;
            let cls =
              "border-ca-line bg-white hover:border-ca-blue hover:bg-ca-bg/50";
            if (revealed) {
              if (isCorrect) cls = "border-ca-green bg-ca-green-bg text-ca-green";
              else if (isSelected) cls = "border-ca-red bg-ca-red-bg text-ca-red";
              else cls = "border-ca-line bg-white text-ca-gray";
            } else if (isSelected) {
              cls = "border-ca-blue bg-ca-blue/10 text-ca-ink";
            }
            return (
              <li key={i}>
                <button
                  type="button"
                  data-testid="option"
                  onClick={() => choose(i)}
                  aria-pressed={isSelected}
                  className={`flex w-full items-center gap-3 rounded-lg border-2 px-3 py-3 text-left text-[15px] transition ${cls}`}
                >
                  <span
                    aria-hidden
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-current text-sm font-bold"
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{opt}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {revealed && (
          <div className="mt-4">
            <p className="whitespace-pre-line text-sm text-ca-gray">
              <span className="font-semibold">
                {selected === q.correctIndex ? "Correct. " : "Not quite. "}
              </span>
              {getDetailedExplanation("en", q)}
            </p>
            <AudioExplain question={q} />
          </div>
        )}

        <div className="mt-4 border-t border-ca-line pt-3">
          <OriginBadge q={q} />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={current === 0}
          className="rounded-lg border border-ca-line bg-white px-4 py-2 text-sm font-semibold text-ca-gray disabled:opacity-40"
        >
          ← Previous
        </button>

        {isLast ? (
          <button
            type="button"
            data-testid="submit-test"
            onClick={() => {
              setFinished(true);
              window.scrollTo({ top: 0 });
            }}
            className="rounded-lg bg-ca-green px-5 py-2 text-sm font-bold text-white hover:opacity-90"
          >
            Submit test
          </button>
        ) : (
          <button
            type="button"
            data-testid="nav-next"
            onClick={() => go(1)}
            className="rounded-lg bg-ca-blue px-5 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark"
          >
            {selected === null ? "Skip" : "Next"} →
          </button>
        )}
      </div>

      {/* Question palette */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ca-muted">
          Jump to question
        </p>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((qq, i) => {
            const done = answers[qq.id] != null;
            return (
              <button
                key={qq.id}
                type="button"
                onClick={() => {
                  setCurrent(i);
                  window.scrollTo({ top: 0 });
                }}
                aria-label={`Go to question ${i + 1}`}
                className={`h-8 w-8 rounded text-xs font-bold ${
                  i === current
                    ? "bg-ca-blue text-white"
                    : done
                      ? "bg-ca-green-bg text-ca-green"
                      : "bg-white text-ca-gray border border-ca-line"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {mode === "exam" && (
        <button
          type="button"
          onClick={() => {
            setFinished(true);
            window.scrollTo({ top: 0 });
          }}
          className="mt-5 w-full rounded-lg border border-ca-line bg-white py-2 text-sm font-semibold text-ca-blue"
        >
          Finish &amp; submit ({answeredCount}/{questions.length} answered)
        </button>
      )}
    </div>
  );
}

function Results({
  result,
  questions,
  answers,
  onRetake,
}: {
  result: AttemptResult;
  questions: Question[];
  answers: Record<string, number | null>;
  onRetake: () => void;
}) {
  const pct = Math.round((result.correctCount / result.total) * 100);
  return (
    <div data-testid="results">
      <div
        className={`rounded-xl border p-5 text-center ${
          result.passed
            ? "border-ca-green bg-ca-green-bg"
            : "border-ca-red bg-ca-red-bg"
        }`}
      >
        <p
          className={`text-sm font-bold uppercase tracking-wide ${
            result.passed ? "text-ca-green" : "text-ca-red"
          }`}
          data-testid="pass-banner"
        >
          {result.passed ? "You passed" : "Not passed"}
        </p>
        <p className="mt-1 text-4xl font-extrabold text-ca-ink" data-testid="score">
          {result.correctCount}
          <span className="text-2xl text-ca-muted">/{result.total}</span>
        </p>
        <p className="mt-1 text-sm text-ca-gray">
          {pct}% · needed {result.passCount} correct to pass
        </p>
      </div>

      {/* Per-category breakdown */}
      <div className="mt-5">
        <h3 className="mb-2 text-sm font-bold text-ca-ink">By topic</h3>
        <ul className="space-y-2">
          {Object.entries(result.perCategory).map(([cat, score]) => {
            const s = score as { correct: number; total: number };
            const ratio = s.total ? (s.correct / s.total) * 100 : 0;
            return (
              <li key={cat} className="text-sm">
                <div className="flex justify-between text-ca-gray">
                  <span>{CATEGORY_MAP[cat as keyof typeof CATEGORY_MAP]?.label ?? cat}</span>
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

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onRetake}
          className="flex-1 rounded-lg bg-ca-blue py-2.5 text-sm font-bold text-white hover:bg-ca-blue-dark"
        >
          New test
        </button>
        <Link
          href="/"
          className="flex-1 rounded-lg border border-ca-line bg-white py-2.5 text-center text-sm font-bold text-ca-blue"
        >
          Home
        </Link>
      </div>

      {/* Review */}
      <h3 className="mb-2 mt-7 text-sm font-bold text-ca-ink">Review answers</h3>
      <ol className="space-y-3">
        {questions.map((q, i) => (
          <QuestionReview
            key={q.id}
            question={q}
            selectedIndex={answers[q.id] ?? null}
            number={i + 1}
          />
        ))}
      </ol>
    </div>
  );
}
