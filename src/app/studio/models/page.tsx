import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, SITE, url } from "@/lib/seo";
import { modelPathFromSlug, priceLabel } from "@/lib/studio-helpers";
import { ModelsCatalogClient } from "./client";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const path = "/studio/models";
const title = "All AI models — Vidy Studio";
const description = "Browse every model in Vidy Studio. Search and filter the full catalogue across video, image, audio, voice, lipsync, upscale, 3D, and more.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url(path) },
  openGraph: {
    type: "website",
    url: url(path),
    siteName: SITE.name,
    title,
    description,
    images: [{ url: url("/og/studio.png"), width: 1200, height: 630, alt: "Vidy Studio model catalogue" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [url("/og/studio.png")] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default async function ModelsCatalogPage() {
  const models = await prisma.falModel
    .findMany({
      where: { enabled: true },
      orderBy: [{ category: "asc" }, { sortIndex: "asc" }],
    })
    .catch(() => []);

  const items = models.map((m) => ({
    slug: m.slug,
    href: modelPathFromSlug(m.slug),
    displayName: m.displayName,
    description: m.description,
    badge: m.badge,
    category: m.category,
    features: m.features,
    ...priceLabel(m.unit, m.unitPriceUsd),
  }));

  // Schema.org ItemList — every model becomes a SoftwareApplication entry, indexable.
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vidy Studio model catalogue",
    numberOfItems: items.length,
    itemListElement: items.slice(0, 200).map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: url(m.href),
      item: {
        "@type": "SoftwareApplication",
        name: m.displayName,
        applicationCategory: "MultimediaApplication",
        description: m.description ?? undefined,
      },
    })),
  };

  return (
    <>
      <JsonLd id="models-breadcrumb" data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Studio", path: "/studio" }, { name: "Models", path }])} />
      <JsonLd id="models-itemlist" data={itemList} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <header className="mt-6 mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Sparkles className="h-3 w-3" />
            {items.length} models live
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Model catalogue</h1>
          <p className="mt-2 max-w-xl text-sm text-white/55">Every frontier model, grouped by category. Search, filter, and deep-link.</p>
        </header>
        <ModelsCatalogClient items={items} />
      </main>
    </>
  );
}
