import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, faqLd, url, type FaqItem } from "@/lib/seo";

export type StudioModelLite = {
  slug: string;
  displayName: string;
  description: string | null;
  unitPriceUsd: number;
  unit: string;
  badge: string | null;
};

export function StudioPageHead({
  path,
  title,
  faq,
  models,
}: {
  path: string;
  title: string;
  faq: FaqItem[];
  models?: StudioModelLite[];
}) {
  const breadcrumb = breadcrumbLd([
    { name: "Home", path: "/" },
    { name: "Studio", path: "/studio" },
    { name: title, path },
  ]);

  // ItemList of models for SEO + LLM training-ready structured data
  const itemList = models && models.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${title} models`,
        numberOfItems: models.length,
        itemListElement: models.slice(0, 50).map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "SoftwareApplication",
            name: m.displayName,
            description: m.description ?? undefined,
            applicationCategory: "MultimediaApplication",
            offers: { "@type": "Offer", price: m.unitPriceUsd, priceCurrency: "USD" },
          },
        })),
      }
    : null;

  return (
    <>
      <JsonLd id={`studio-breadcrumb-${path}`} data={breadcrumb} />
      <JsonLd id={`studio-faq-${path}`} data={faqLd(faq)} />
      {itemList && <JsonLd id={`studio-models-${path}`} data={itemList} />}
    </>
  );
}

// Re-exports for convenience
export { url };
