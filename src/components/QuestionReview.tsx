import type { Question } from "@/lib/types";
import { getDetailedExplanation } from "@/lib/explanations/detailed";
import { Diagram, hasDiagram } from "./Diagram";
import { AudioExplain } from "./AudioExplain";
import { OriginBadge } from "./OriginBadge";

/** A single question shown in the results review, with the correct answer revealed. */
export function QuestionReview({
  question,
  selectedIndex,
  number,
}: {
  question: Question;
  selectedIndex: number | null;
  number: number;
}) {
  const correct = selectedIndex === question.correctIndex;
  return (
    <li className="rounded-lg border border-ca-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-ca-ink">
          {number}. {question.prompt}
        </p>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
            correct ? "bg-ca-green-bg text-ca-green" : "bg-ca-red-bg text-ca-red"
          }`}
        >
          {correct ? "Correct" : selectedIndex === null ? "Skipped" : "Wrong"}
        </span>
      </div>

      {hasDiagram(question.diagramId) && (
        <div className="mt-3 max-w-xs">
          <Diagram id={question.diagramId as string} />
        </div>
      )}

      <ul className="mt-3 space-y-1.5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isChosen = i === selectedIndex;
          return (
            <li
              key={i}
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
