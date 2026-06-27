import type { CategoryId, Question } from "@/lib/types";

export const URLS = {
  HANDBOOK: "https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/",
  SIGNCHART: "https://www.dmv.ca.gov/portal/file/road-sign-chart-dl-37-pdf/",
};

/** Rotate an array right by `by`, so the correct answer isn't always option A. */
export function rotate<T>(arr: T[], by: number): T[] {
  const n = arr.length;
  if (n === 0) return arr;
  const k = ((by % n) + n) % n;
  return [...arr.slice(n - k), ...arr.slice(0, n - k)];
}

export interface GenSpec {
  id: string;
  category: CategoryId;
  prompt: string;
  correct: string;
  distractors: string[];
  explanation?: string;
  diagramId?: string;
  sourceName?: string;
  sourceUrl?: string;
  rotateBy?: number;
}

/** Build a Question from a correct answer + distractors (deterministic order). */
export function toQuestion(spec: GenSpec): Question {
  const opts = [spec.correct, ...spec.distractors.slice(0, 2)];
  const rotated = rotate(opts, spec.rotateBy ?? 0);
  return {
    id: spec.id,
    category: spec.category,
    prompt: spec.prompt,
    options: rotated,
    correctIndex: rotated.indexOf(spec.correct),
    explanation: spec.explanation,
    diagramId: spec.diagramId,
    origin: "generated",
    sourceName: spec.sourceName ?? "Based on the California Driver Handbook",
    sourceUrl: spec.sourceUrl ?? URLS.HANDBOOK,
  };
}

/** Shorthand for a fully-specified generated question. */
export function gq(
  id: string,
  category: CategoryId,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation?: string,
  extra?: Partial<Question>,
): Question {
  return {
    id,
    category,
    prompt,
    options,
    correctIndex,
    explanation,
    origin: "generated",
    sourceName: "Based on the California Driver Handbook",
    sourceUrl: URLS.HANDBOOK,
    ...extra,
  };
}
