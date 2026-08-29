import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import type { Question } from "@/lib/types";
import { QuestionReview } from "./QuestionReview";

const Q: Question = {
  id: "q1",
  category: "parking",
  prompt: "Where may you park?",
  options: ["RIGHT", "wrong-a", "wrong-b"],
  correctIndex: 0,
  origin: "generated",
  explanation: "Because.",
};

/** The option rows, in display order. */
function optionRows(): HTMLElement[] {
  return screen.getAllByTestId("review-option");
}

describe("QuestionReview", () => {
  it("says Correct and flags only the chosen answer when the learner was right", () => {
    render(<QuestionReview question={Q} selectedIndex={0} number={1} />);

    expect(screen.getByTestId("review-status")).toHaveTextContent("Correct");
    const rows = optionRows();
    expect(within(rows[0]).getByText("RIGHT")).toBeInTheDocument();
    expect(rows[0]).toHaveAttribute("data-correct", "true");
    expect(rows[0]).toHaveAttribute("data-chosen", "true");
    expect(rows[1]).toHaveAttribute("data-chosen", "false");
    expect(rows[2]).toHaveAttribute("data-chosen", "false");
  });

  it("says Wrong and marks both the chosen and the correct option", () => {
    render(<QuestionReview question={Q} selectedIndex={2} number={1} />);

    expect(screen.getByTestId("review-status")).toHaveTextContent("Wrong");
    const rows = optionRows();
    expect(rows[0]).toHaveAttribute("data-correct", "true");
    expect(rows[0]).toHaveAttribute("data-chosen", "false");
    expect(rows[2]).toHaveAttribute("data-chosen", "true");
  });

  it("says Skipped when nothing was chosen", () => {
    render(<QuestionReview question={Q} selectedIndex={null} number={1} />);

    expect(screen.getByTestId("review-status")).toHaveTextContent("Skipped");
    for (const row of optionRows()) {
      expect(row).toHaveAttribute("data-chosen", "false");
    }
  });

  it("honors an explicit outcome over the derived one", () => {
    // A legacy attempt: we know it was wrong but not which option was picked.
    render(
      <QuestionReview question={Q} selectedIndex={null} number={1} outcome="wrong" />,
    );

    expect(screen.getByTestId("review-status")).toHaveTextContent("Wrong");
    expect(screen.getByTestId("review-status")).not.toHaveTextContent("Skipped");
    for (const row of optionRows()) {
      expect(row).toHaveAttribute("data-chosen", "false");
    }
    // The correct answer is still shown so the review is useful.
    expect(optionRows()[0]).toHaveAttribute("data-correct", "true");
  });

  it("renders the options in the order given, not the bank order", () => {
    const reordered: Question = {
      ...Q,
      options: ["wrong-b", "RIGHT", "wrong-a"],
      correctIndex: 1,
    };
    render(<QuestionReview question={reordered} selectedIndex={1} number={3} />);

    expect(optionRows().map((r) => r.textContent)).toEqual([
      expect.stringContaining("wrong-b"),
      expect.stringContaining("RIGHT"),
      expect.stringContaining("wrong-a"),
    ]);
    expect(screen.getByTestId("review-status")).toHaveTextContent("Correct");
  });
});
