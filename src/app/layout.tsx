import type { Metadata, Viewport } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CA DMV Knowledge Test Practice",
  description:
    "Free mobile-friendly practice for the California Class C Driver's License knowledge test. Unofficial study tool — not affiliated with the California DMV.",
};

export const viewport: Viewport = {
  themeColor: "#046b99",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-5">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
