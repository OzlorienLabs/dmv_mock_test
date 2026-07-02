"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { STARTER_QUESTIONS } from "@/data/questions/starter";
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
  // True until the full bank has loaded and the remaining questions are in.
  const [assembling, setAssembling] = useState(true);
  const startedRef = useRef(false);
  const assembledRef = useRef(false);
  const adaptive = attempts.length > 0;
  const seedCount = Math.min(2, targetCount);

  // A couple of questions from the tiny starter set (bundled), so we can render
  // the first question instantly without waiting on the full bank or history.
  const seedStarter = useCallback(
    () => buildAdaptiveMockTest(STARTER_QUESTIONS, seedCount, mulberry32(randomSeed()), {}),
    [seedCount],
  );

  // Lazy-load the full 1000+ question bank and build the real adaptive test,
  // keeping the already-shown starter questions (and their answers) at the front
  // so nothing the learner sees shifts under them.
  const assembleFull = useCallback(async () => {
    const { QUESTIONS } = await import("@/data/questions");
    const full = buildAdaptiveMockTest(
      QUESTIONS,
      targetCount,
      mulberry32(randomSeed()),
      questionStats(attempts),
    );
    setQuestions((prev) => {
      const lead = prev.slice(0, seedCount);
      const leadIds = new Set(lead.map((q) => q.id));
      return [...lead, ...full.filter((q) => !leadIds.has(q.id))].slice(0, targetCount);
    });
    setAssembling(false);
  }, [targetCount, attempts, seedCount]);

  // Phase 1 (instant, client-only — avoids SSR/CSR mismatch): show the starter
  // questions. Phase 2: once history has loaded, background-build the full test.
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    setQuestions(seedStarter());
  }, [seedStarter]);

  useEffect(() => {
    if (assembledRef.current || loading) return;
    assembledRef.current = true;
    void assembleFull();
  }, [loading, assembleFull]);

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
    setAssembling(true);
    setQuestions(seedStarter());
    void assembleFull(); // bank module is cached after the first load — near-instant
    window.scrollTo({ top: 0 });
  }

  if (questions.length === 0) {
    return <p className="py-16 text-center text-ca-muted">Preparing your test…</p>;
  }

  if (finished && result) {
    return <Results result={result} questions={questions} answers={answers} onRetake={reset} />;
  }

  const idx = Math.min(current, questions.length - 1);
  const q = questions[idx];
  const selected = answers[q.id] ?? null;
  const revealed = mode === "practice" && selected !== null;
  const answeredCount = questions.filter((x) => answers[x.id] != null).length;
  // Show the intended test size from the start so the count doesn't jump as the
  // remaining questions stream in.
  const total = targetCount;
  const atLoadedEnd = idx >= questions.length - 1;
  const isLast = !assembling && atLoadedEnd;

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
            Question {idx + 1} of {total}
          </span>
          <span>
            {answeredCount} answered · {mode === "exam" ? `pass ${passCount}/${total}` : "practice"}
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ca-line">
          <div
            className="h-full bg-ca-blue transition-all"
            style={{ width: `${((idx + 1) / total) * 100}%` }}
          />
        </div>
        {assembling ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ca-muted">
            <span
              aria-hidden
              className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-ca-line border-t-ca-blue"
            />
            Loading your full {total}-question test…
          </p>
        ) : adaptive ? (
          <p className="mt-1.5 text-xs text-ca-blue">
            ★ Focusing on questions you haven’t mastered yet.
          </p>
        ) : null}
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
          disabled={idx === 0}
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
            disabled={assembling && atLoadedEnd}
            className="rounded-lg bg-ca-blue px-5 py-2 text-sm font-bold text-white hover:bg-ca-blue-dark disabled:opacity-50"
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
          {Array.from({ length: total }, (_, i) => {
            const qq = questions[i];
            if (!qq) {
              // Not assembled yet — a pending placeholder so the size is clear.
              return (
                <span
                  key={`pending-${i}`}
                  aria-hidden
                  className="grid h-8 w-8 place-items-center rounded border border-dashed border-ca-line text-xs font-bold text-ca-line"
                >
                  {i + 1}
                </span>
              );
            }
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
                  i === idx
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
          disabled={assembling}
          onClick={() => {
            setFinished(true);
            window.scrollTo({ top: 0 });
          }}
          className="mt-5 w-full rounded-lg border border-ca-line bg-white py-2 text-sm font-semibold text-ca-blue disabled:opacity-50"
        >
          Finish &amp; submit ({answeredCount}/{total} answered)
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
