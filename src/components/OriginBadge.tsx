import type { Question } from "@/lib/types";

/** Small attribution line showing where a question came from (provenance). */
export function OriginBadge({ q }: { q: Question }) {
  if (q.origin === "official_dmv" || q.origin === "sourced") {
    return (
      <p className="text-xs text-ca-muted">
        {q.origin === "official_dmv" ? "Official DMV sample" : "Source"}:{" "}
        {q.sourceUrl ? (
          <a
            href={q.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ca-blue underline"
          >
            {q.sourceName ?? q.sourceUrl}
          </a>
        ) : (
          (q.sourceName ?? "—")
        )}
      </p>
    );
  }
  return (
    <p className="text-xs text-ca-muted">
      <span className="mr-1 rounded bg-ca-bg px-1.5 py-0.5 font-medium text-ca-gray">
        Practice question
      </span>
      {q.sourceUrl ? (
        <a
          href={q.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ca-blue underline"
        >
          {q.sourceName ?? "based on the CA Driver Handbook"}
        </a>
      ) : (
        (q.sourceName ?? null)
      )}
    </p>
  );
}
