/**
 * Renders a schema.org JSON-LD block. Server component — the structured data is
 * present in the initial HTML so crawlers and AI agents can read it without JS.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const graph = Array.isArray(data) ? data : [data];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe; escape "<" defensively so the payload
      // can never break out of the <script> element.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
