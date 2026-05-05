import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/seo/FaqSection";
import { breadcrumbLd, faqLd, howToLd, type FeatureSeo } from "@/lib/seo";

export function FeatureLayout({
  seo,
  intro,
  children,
}: {
  seo: FeatureSeo;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <JsonLd id={`breadcrumb-${seo.path}`} data={breadcrumbLd([{ name: "Home", path: "/" }, { name: seo.title, path: seo.path }])} />
      {seo.faq.length > 0 && <JsonLd id={`faq-${seo.path}`} data={faqLd(seo.faq)} />}
      {seo.howTo && seo.howTo.length > 0 && <JsonLd id={`howto-${seo.path}`} data={howToLd(seo.title, seo.description, seo.howTo)} />}

      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{seo.title}</h1>
          <p className="mt-2 max-w-3xl text-neutral-500">{seo.description}</p>
          {intro}
        </header>
        {children}
      </main>
      <FaqSection items={seo.faq} />
    </>
  );
}
