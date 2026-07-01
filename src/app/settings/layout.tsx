import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  // Private, per-user settings page — no crawl value.
  robots: { index: false, follow: false },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
