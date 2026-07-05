import Link from "next/link";
import { TEST_PROFILES } from "@/lib/engine/profiles";
import { QUESTIONS } from "@/data/questions";
import { ProgressPanel } from "@/components/ProgressPanel";
import { JsonLd } from "@/components/JsonLd";
import { FAQ, faqJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <div className="space-y-6">
      <JsonLd data={faqJsonLd()} />
      <section>
        <h1 className="text-2xl font-extrabold tracking-tight text-ca-ink">
          🚘 The Ultimate Driving Knowledge Test 🚦
        </h1>
        <p className="mt-1 text-sm text-ca-gray">
          Free, mobile-friendly practice for the California Class C driver&rsquo;s
          license knowledge test — mirrors the real exam format and pass rules.{" "}
          {QUESTIONS.length} practice questions across every topic.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ca-muted">
          Study
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <ModeCard
            href="/test?profile=original&mode=practice"
            title="Quick practice (10)"
            desc="Instant feedback and explanations after each question."
          />
          <ModeCard
            href="/road-test"
            title="Road test (DL-80) guide"
            desc="What the examiner scores on the behind-the-wheel test."
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ca-muted">
          Take a mock test
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <ModeCard
            href="/test?profile=original&mode=exam"
            title={TEST_PROFILES.original.label}
            desc={TEST_PROFILES.original.description}
            accent
          />
          <ModeCard
            href="/test?profile=renewal&mode=exam"
            title={TEST_PROFILES.renewal.label}
            desc={TEST_PROFILES.renewal.description}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ca-muted">
          Compete
        </h2>
        <ModeCard
          href="/leaderboard"
          title="🏆 Leaderboard"
          desc="See how you rank against other drivers by unique questions answered correctly. Sign in to join."
        />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-ca-muted">
          Your progress
        </h2>
        <ProgressPanel />
      </section>

      <section aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="mb-2 text-sm font-bold uppercase tracking-wide text-ca-muted"
        >
          California DMV test — frequently asked questions
        </h2>
        <dl className="divide-y divide-ca-line rounded-xl border border-ca-line bg-white">
          {FAQ.map((f) => (
            <div key={f.question} className="p-4">
              <dt className="font-semibold text-ca-ink">{f.question}</dt>
              <dd className="mt-1 text-sm text-ca-gray">{f.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function ModeCard({
  href,
  title,
  desc,
  accent = false,
}: {
  href: string;
  title: string;
  desc: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-xl border p-4 transition hover:shadow-md ${
        accent
          ? "border-ca-blue bg-ca-blue text-white"
          : "border-ca-line bg-white"
      }`}
    >
      <div className={`font-bold ${accent ? "text-white" : "text-ca-ink"}`}>
        {title}
      </div>
      <div className={`mt-1 text-sm ${accent ? "text-white/85" : "text-ca-gray"}`}>
        {desc}
      </div>
    </Link>
  );
}
