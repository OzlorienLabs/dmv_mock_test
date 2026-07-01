import { TEST_PROFILES } from "@/lib/engine/profiles";

/**
 * Central SEO / discoverability config.
 *
 * Set `NEXT_PUBLIC_SITE_URL` to your production origin (e.g.
 * https://your-domain.com) so canonical URLs, Open Graph tags, the sitemap and
 * JSON-LD all point at the right place. Without it we fall back to a clearly
 * marked placeholder — everything still renders, but update the env var before
 * you rely on search ranking.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://dmv-practice.example.com"
).replace(/\/$/, "");

export const SITE_NAME = "DMV Practice";

export const SITE_TITLE =
  "California DMV Practice Test — Free Class C Knowledge Test Prep";

export const SITE_DESCRIPTION =
  "Free, mobile-friendly practice for the California Class C driver's license knowledge test: 1,000+ questions with detailed explanations, diagrams, and audio in English, Bengali and Spanish. Unofficial study tool — not affiliated with the California DMV.";

export const SITE_KEYWORDS = [
  "California DMV practice test",
  "DMV knowledge test",
  "DMV written test practice",
  "Class C license test",
  "California driver license test",
  "free DMV practice test",
  "CA DMV test questions",
  "California driver handbook practice",
  "DMV permit test",
  "road test DL-80 practice",
];

/** Absolute URL for a site-relative path. */
export function abs(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const orig = TEST_PROFILES.original;
const renew = TEST_PROFILES.renewal;

/**
 * Structured data (schema.org) so search engines and AI agents can read the
 * app's purpose, that it's free, and answer common questions directly.
 */
export function siteJsonLd(): Record<string, unknown>[] {
  const organization = {
    "@type": "Organization",
    "@id": abs("/#organization"),
    name: "Ozlorien Labs",
    url: SITE_URL,
  };

  const website = {
    "@type": "WebSite",
    "@id": abs("/#website"),
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: ["en", "bn", "es"],
    publisher: { "@id": abs("/#organization") },
  };

  const webApp = {
    "@type": ["WebApplication", "LearningResource"],
    "@id": abs("/#webapp"),
    name: SITE_TITLE,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web browser",
    inLanguage: ["en", "bn", "es"],
    isAccessibleForFree: true,
    educationalUse: "practice, self-assessment",
    learningResourceType: "practice test",
    about: "California DMV Class C driver's license knowledge test",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: [
      "1,000+ practice questions across every handbook topic",
      "Full-length mock exams that mirror the real pass rules",
      "Detailed explanations with diagrams",
      "Audio explanations in English, Bengali and Spanish",
      "Adaptive practice that focuses on your weak areas",
      "Behind-the-wheel (DL-80) road-test study guide",
    ],
    publisher: { "@id": abs("/#organization") },
  };

  return [organization, website, webApp];
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** High-value, handbook-grounded Q&A used both for on-page FAQ and FAQPage JSON-LD. */
export const FAQ: FaqItem[] = [
  {
    question: "How many questions are on the California DMV knowledge test?",
    answer: `The first-time (original) Class C knowledge test has ${orig.questionCount} questions, and the renewal test has ${renew.questionCount}. This app lets you practice both formats.`,
  },
  {
    question: "What score do I need to pass the California DMV written test?",
    answer: `You must answer at least ${orig.passCount} of ${orig.questionCount} questions correctly on the original test (about 83%), or ${renew.passCount} of ${renew.questionCount} on the renewal test.`,
  },
  {
    question: "How many times can I retake the DMV knowledge test?",
    answer:
      "You get three attempts per application. Practice tests here are unlimited, so you can keep studying until you consistently pass.",
  },
  {
    question: "Is this the official California DMV test?",
    answer:
      "No. This is a free, unofficial study tool and is not affiliated with, endorsed by, or created by the California DMV. All questions are based on the California Driver Handbook.",
  },
  {
    question: "What topics does the California DMV test cover?",
    answer:
      "Traffic signs and signals, right-of-way and intersections, speed limits, parking, lane use and passing, sharing the road with pedestrians, cyclists and motorcycles, alcohol and drug (DUI) laws, seat belts and child restraints, freeway driving, railroad crossings, and more.",
  },
  {
    question: "Is the practice test free and do I need an account?",
    answer:
      "Yes, it is completely free and works instantly as a guest with no account required. Optional sign-in syncs your progress across devices.",
  },
  {
    question: "What languages are available for explanations and audio?",
    answer:
      "Detailed explanations and spoken audio are available in English, Bengali and Spanish, with additional languages available on demand.",
  },
];

export function faqJsonLd(): Record<string, unknown> {
  return {
    "@type": "FAQPage",
    "@id": abs("/#faq"),
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
