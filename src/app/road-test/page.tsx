"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BEFORE_YOU_GO,
  CRITICAL_ERRORS,
  MANEUVERS,
  PRE_DRIVE_CONTROLS,
} from "@/data/roadTest";
import {
  emptyState,
  loadState,
  readiness,
  saveState,
  type Rating,
  type RoadTestState,
} from "@/lib/roadtest/store";

export default function RoadTestPage() {
  const [state, setState] = useState<RoadTestState>(emptyState());

  // Load saved self-assessment on the client (avoids SSR/CSR mismatch).
  useEffect(() => {
    setState(loadState());
  }, []);

  function update(next: RoadTestState) {
    setState(next);
    saveState(next);
  }
  function rate(id: string, rating: Rating) {
    const ratings = { ...state.ratings };
    if (ratings[id] === rating) delete ratings[id];
    else ratings[id] = rating;
    update({ ...state, ratings });
  }
  function toggleCheck(key: string) {
    update({ ...state, checks: { ...state.checks, [key]: !state.checks[key] } });
  }

  const r = readiness(state.ratings, MANEUVERS.map((m) => m.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-ca-ink">Road test (DL-80) guide</h1>
        <Link
          href="/"
          className="rounded-lg border border-ca-line bg-white px-3 py-1.5 text-sm font-semibold text-ca-gray"
        >
          Home
        </Link>
      </div>

      <p className="text-sm text-ca-gray">
        The behind-the-wheel test is scored by a DMV examiner on the DL-80 sheet —
        it can’t be a quiz, so this is a coaching guide and a self-assessment.
        Rate each maneuver to track what to practice.
      </p>

      {/* Readiness */}
      <section className="rounded-xl border border-ca-line bg-white p-4">
        <div className="flex items-end justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-ca-muted">
            Your readiness
          </h2>
          <span className="text-sm font-semibold text-ca-gray">
            {r.confident}/{r.total} confident
          </span>
        </div>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-ca-line">
          <div className="h-full bg-ca-green transition-all" style={{ width: `${r.pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-ca-muted">
          {r.practice > 0
            ? `${r.practice} marked “needs practice”. Keep going!`
            : "Mark each maneuver below as you build confidence."}
        </p>
      </section>

      {/* Before you go */}
      <Section title="Before you go" subtitle="Check each item before your appointment">
        <ul className="space-y-2">
          {BEFORE_YOU_GO.map((item, i) => {
            const key = `byg:${i}`;
            return (
              <li key={key}>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-ca-gray">
                  <input
                    type="checkbox"
                    checked={!!state.checks[key]}
                    onChange={() => toggleCheck(key)}
                    className="mt-0.5 h-4 w-4 accent-ca-blue"
                  />
                  <span className={state.checks[key] ? "line-through text-ca-muted" : ""}>
                    {item}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Pre-drive controls */}
      <Section
        title="Pre-drive vehicle check"
        subtitle="The examiner may ask you to identify and operate these"
      >
        <ul className="grid gap-2 sm:grid-cols-2">
          {PRE_DRIVE_CONTROLS.map((c) => (
            <li key={c.control} className="rounded-lg bg-ca-bg p-2.5 text-sm">
              <span className="font-semibold text-ca-ink">{c.control}</span>
              <span className="block text-xs text-ca-muted">{c.note}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Maneuvers with self-rating */}
      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ca-muted">
          Scored maneuvers
        </h2>
        <div className="space-y-3">
          {MANEUVERS.map((m) => {
            const rating = state.ratings[m.id];
            return (
              <div key={m.id} className="rounded-xl border border-ca-line bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-ca-ink">{m.title}</h3>
                  <div className="flex gap-1.5">
                    <RateButton
                      active={rating === "confident"}
                      tone="green"
                      onClick={() => rate(m.id, "confident")}
                    >
                      Confident
                    </RateButton>
                    <RateButton
                      active={rating === "practice"}
                      tone="gold"
                      onClick={() => rate(m.id, "practice")}
                    >
                      Practice
                    </RateButton>
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ca-blue">
                  What the examiner looks for
                </p>
                <ul className="mt-1 space-y-1 text-sm text-ca-gray">
                  {m.lookFor.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="text-ca-green">✓</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-ca-red">
                  Common mistakes
                </p>
                <ul className="mt-1 space-y-1 text-sm text-ca-gray">
                  {m.commonErrors.map((x) => (
                    <li key={x} className="flex gap-2">
                      <span aria-hidden className="text-ca-red">✗</span>
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Critical errors */}
      <section className="rounded-xl border border-ca-red bg-ca-red-bg p-4">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ca-red">
          Automatic fail (critical errors)
        </h2>
        <ul className="mt-2 space-y-1.5 text-sm text-ca-ink">
          {CRITICAL_ERRORS.map((x) => (
            <li key={x} className="flex gap-2">
              <span aria-hidden className="text-ca-red">!</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-ca-muted">
        Based on the public DL-80 Driving Performance Evaluation. Self-assessment
        is saved on this device only. Verify details on{" "}
        <a
          className="text-ca-blue underline"
          href="https://www.dmv.ca.gov/portal/file/dl80-pdf/"
          target="_blank"
          rel="noopener noreferrer"
        >
          dmv.ca.gov
        </a>
        .
      </p>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-ca-line bg-white p-4">
      <h2 className="text-sm font-bold text-ca-ink">{title}</h2>
      <p className="mb-3 text-xs text-ca-muted">{subtitle}</p>
      {children}
    </section>
  );
}

function RateButton({
  active,
  tone,
  onClick,
  children,
}: {
  active: boolean;
  tone: "green" | "gold";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const toneCls = active
    ? tone === "green"
      ? "bg-ca-green text-white border-ca-green"
      : "bg-ca-gold text-ca-ink border-ca-gold"
    : "bg-white text-ca-gray border-ca-line";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${toneCls}`}
    >
      {children}
    </button>
  );
}
