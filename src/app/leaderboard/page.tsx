import Link from "next/link";
import type { Metadata } from "next";
import { Leaderboard } from "@/components/Leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See how you rank against other drivers preparing for the California DMV knowledge test, scored by the number of unique questions you've answered correctly.",
  alternates: { canonical: "/leaderboard" },
};

export default function LeaderboardPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-ca-ink">🏆 Leaderboard</h1>
        <Link
          href="/"
          className="rounded-lg border border-ca-line bg-white px-3 py-1.5 text-sm font-semibold text-ca-gray"
        >
          Home
        </Link>
      </div>

      <Leaderboard />
    </div>
  );
}
