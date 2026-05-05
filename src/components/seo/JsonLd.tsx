// JSON-LD inlined as a plain server-rendered <script> tag — works in any
// server component without next/script's beforeInteractive restriction.
export function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={`ld-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
