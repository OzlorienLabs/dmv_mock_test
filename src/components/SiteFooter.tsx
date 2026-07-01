import { FeedbackLink } from "./FeedbackLink";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-ca-line bg-white">
      <div className="mx-auto w-full max-w-2xl px-4 py-5 text-xs leading-relaxed text-ca-muted">
        <p className="font-semibold text-ca-gray">
          Unofficial study tool — not affiliated with, endorsed by, or created by
          the California DMV.
        </p>
        <p className="mt-1">
          Practice questions are for study only and may differ from the actual
          exam. Always verify rules in the{" "}
          <a
            className="text-ca-blue underline"
            href="https://www.dmv.ca.gov/portal/handbook/california-driver-handbook/"
            target="_blank"
            rel="noopener noreferrer"
          >
            official California Driver Handbook
          </a>
          .
        </p>

        <div className="mt-4 border-t border-ca-line pt-4 text-center text-ca-gray">
          <p>Built with curiosity and care</p>
          <p className="mt-0.5">
            by <FeedbackLink />
          </p>
        </div>
      </div>
    </footer>
  );
}
