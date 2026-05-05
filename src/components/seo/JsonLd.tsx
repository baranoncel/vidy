import Script from "next/script";

export function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <Script
      id={`ld-${id}`}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
