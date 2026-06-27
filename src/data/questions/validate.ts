import type { Question } from "@/lib/types";

export interface ValidationIssue {
  id: string;
  problem: string;
}

/**
 * Structural quality gate for the question bank. Run by a unit test so a bad
 * question (duplicate id, out-of-range answer, etc.) fails CI before shipping.
 */
export function validateQuestions(questions: Question[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const seenPrompts = new Set<string>();

  for (const q of questions) {
    if (seenIds.has(q.id)) issues.push({ id: q.id, problem: "duplicate id" });
    seenIds.add(q.id);

    const promptKey = q.prompt?.trim().toLowerCase();
    // Key on prompt + options: the same stem with different options is a
    // legitimate variant (the DMV reuses some stems across sample tests), but an
    // identical prompt AND options is a true duplicate.
    const dupKey = `${promptKey}||${(q.options ?? []).join("|").toLowerCase()}`;
    if (!promptKey) {
      issues.push({ id: q.id, problem: "empty prompt" });
    } else if (seenPrompts.has(dupKey)) {
      issues.push({ id: q.id, problem: `duplicate question: "${q.prompt.slice(0, 40)}…"` });
    } else {
      seenPrompts.add(dupKey);
    }

    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4) {
      issues.push({ id: q.id, problem: `option count ${q.options?.length ?? 0}` });
      continue;
    }
    if (q.options.some((o) => !o?.trim())) {
      issues.push({ id: q.id, problem: "empty option" });
    }
    if (new Set(q.options).size !== q.options.length) {
      issues.push({ id: q.id, problem: "duplicate options" });
    }
    if (
      !Number.isInteger(q.correctIndex) ||
      q.correctIndex < 0 ||
      q.correctIndex >= q.options.length
    ) {
      issues.push({ id: q.id, problem: `correctIndex out of range (${q.correctIndex})` });
    }
    if ((q.origin === "official_dmv" || q.origin === "sourced") && !q.sourceUrl) {
      issues.push({ id: q.id, problem: `${q.origin} question missing sourceUrl` });
    }
  }

  return issues;
}
