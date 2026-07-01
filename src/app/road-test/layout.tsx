import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "California Road Test (DL-80) Study Guide",
  description:
    "Free study guide for the California behind-the-wheel driving (road) test: the maneuvers examiners score on the DL-80, common mistakes, and a pre-drive checklist. Unofficial — not affiliated with the California DMV.",
  alternates: { canonical: "/road-test" },
  openGraph: {
    title: "California Road Test (DL-80) Study Guide",
    description:
      "The maneuvers examiners score on the California behind-the-wheel driving test, common mistakes, and a pre-drive checklist.",
    url: "/road-test",
  },
};

export default function RoadTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
