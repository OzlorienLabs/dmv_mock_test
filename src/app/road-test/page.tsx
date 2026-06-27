import Link from "next/link";

/**
 * Phase 1 starter for the road-test (DL-80) study module. Phase 5 expands this
 * into full maneuver checklists, scoring criteria, common errors, and a
 * self-assessment. Content here is grounded in the public DL-80 score sheet.
 */
const SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Before you drive",
    items: [
      "Bring a safe, registered, and insured vehicle with working lights, signals, horn, brakes, and tires.",
      "Demonstrate hand signals and that you can find the controls (wipers, defroster, lights, emergency flashers).",
    ],
  },
  {
    title: "What the examiner scores (DL-80)",
    items: [
      "Vehicle control — smooth steering, accelerating, and braking.",
      "Observation — scanning, checking mirrors, and looking over your shoulder before lane changes and turns.",
      "Signaling — signaling early for every turn and lane change.",
      "Lane positioning — staying centered and choosing the correct lane.",
      "Speed — obeying limits and adjusting to conditions and traffic.",
      "Turns and intersections — proper approach, stopping behind limit lines, and yielding right-of-way.",
    ],
  },
  {
    title: "Common reasons people fail",
    items: [
      "Rolling stops instead of full stops at stop signs and limit lines.",
      "Not checking blind spots over the shoulder before changing lanes.",
      "Following too closely (use a 3-second gap).",
      "Failing to yield to pedestrians or oncoming traffic when turning.",
    ],
  },
];

export default function RoadTestPage() {
  return (
    <div className="space-y-5">
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
        The behind-the-wheel test is scored by an examiner on the DL-80 sheet —
        it can&apos;t be a multiple-choice quiz, so this is a study checklist.
        Full maneuver-by-maneuver coaching is coming in a later update.
      </p>

      {SECTIONS.map((s) => (
        <section key={s.title} className="rounded-xl border border-ca-line bg-white p-4">
          <h2 className="font-bold text-ca-ink">{s.title}</h2>
          <ul className="mt-2 space-y-2 text-sm text-ca-gray">
            {s.items.map((it) => (
              <li key={it} className="flex gap-2">
                <span aria-hidden className="text-ca-blue">
                  ✓
                </span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-xs text-ca-muted">
        Based on the public DL-80 Driving Performance Evaluation score sheet.
        Verify details on{" "}
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
