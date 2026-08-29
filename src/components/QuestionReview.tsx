import type { Question } from "@/lib/types";
import type { ReviewOutcome } from "@/lib/progress/review";
import { getDetailedExplanation } from "@/lib/explanations/detailed";
import { Diagram, resolveDiagramId } from "./Diagram";
import { AudioExplain } from "./AudioExplain";
import { OriginBadge } from "./OriginBadge";

const STATUS_LABEL: Record<ReviewOutcome, string> = {
  correct: "Correct",
  wrong: "Wrong",
  skipped: "Skipped",
};

/**
 * A single question shown in the results review, with the correct answer
 * revealed.
 *
 * `question` must carry its options in the order the learner actually saw them
 * and `selectedIndex` must index into THAT order — a test shuffles options per
 * attempt, so passing the raw bank question with a stored index reports correct
 * answers as wrong. See `resolveReviewItems`.
 */
export function QuestionReview({
  question,
  selectedIndex,
  number,
  outcome,
}: {
  question: Question;
  selectedIndex: number | null;
  number: number;
  /**
   * Overrides the outcome derived from `selectedIndex`. Used for attempts saved
   * before the option order was recorded, where we know whether the answer was
   * right but not which option was chosen.
   */
  outcome?: ReviewOutcome;
}) {
  const status: ReviewOutcome =
    outcome ??
    (selectedIndex === null
      ? "skipped"
      : selectedIndex === question.correctIndex
        ? "correct"
        : "wrong");
  const correct = status === "correct";
  const diagramId = resolveDiagramId(question);
  return (
    <li className="rounded-lg border border-ca-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-ca-ink">
          {number}. {question.prompt}
        </p>
        <span
          data-testid="review-status"
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
            correct ? "bg-ca-green-bg text-ca-green" : "bg-ca-red-bg text-ca-red"
          }`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>

      {diagramId && (
        <div className="mt-3 max-w-xs">
          <Diagram id={diagramId} />
        </div>
      )}

      <ul className="mt-3 space-y-1.5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isChosen = i === selectedIndex;
          return (
            <li
              key={i}
              data-testid="review-option"
              data-correct={isCorrect}
              data-chosen={isChosen}
              className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                isCorrect
                  ? "border-ca-green bg-ca-green-bg text-ca-green"
                  : isChosen
                    ? "border-ca-red bg-ca-red-bg text-ca-red"
                    : "border-ca-line text-ca-gray"
              }`}
            >
              <span aria-hidden className="w-4 text-center">
                {isCorrect ? "✓" : isChosen ? "✗" : ""}
              </span>
              <span>{opt}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 whitespace-pre-line text-sm text-ca-gray">
        <span className="font-semibold">Why: </span>
        {getDetailedExplanation("en", question)}
      </p>

      <AudioExplain question={question} />

      <div className="mt-3">
        <OriginBadge q={question} />
      </div>
    </li>
  );
}
