import type { Metadata } from "next";
import Link from "next/link";
import { TestRunner, type RunMode } from "@/components/TestRunner";
import { TEST_PROFILES, type TestProfileId } from "@/lib/engine/profiles";

export const metadata: Metadata = {
  title: "Practice Test",
  description:
    "Take a full-length California DMV Class C knowledge practice test with instant scoring and per-question explanations.",
  // Each run is a randomized, session-specific quiz — nothing stable to index.
  robots: { index: false, follow: true },
};

export default async function TestPage({
  searchParams,
}: {
  searchParams: Promise<{ profile?: string; mode?: string }>;
}) {
  const params = await searchParams;
  const profileId: TestProfileId =
    params.profile === "renewal" ? "renewal" : "original";
  const mode: RunMode = params.mode === "practice" ? "practice" : "exam";
  const profile = TEST_PROFILES[profileId];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-ca-ink">
            {mode === "practice" ? "Quick practice" : profile.label}
          </h1>
          <p className="text-xs text-ca-muted">
            {mode === "practice"
              ? "Instant feedback after each question"
              : profile.description}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-ca-line bg-white px-3 py-1.5 text-sm font-semibold text-ca-gray"
        >
          Exit
        </Link>
      </div>
      <TestRunner profileId={profileId} mode={mode} />
    </div>
  );
}
