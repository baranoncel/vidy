import type { Metadata } from "next";

export const SITE = {
  name: "Vidy",
  domain: process.env.NEXT_PUBLIC_APP_URL || "https://vidy.app",
  title: "Vidy — Agentic AI Video Studio",
  description:
    "Generate, edit, dub, lipsync, upscale and animate video with 200+ AI models, billed in transparent Computational Coins. One agent that orchestrates the right models for the job.",
  twitter: "@vidyai",
  defaultLocale: "en",
} as const;

export const url = (path: string) => {
  const base = SITE.domain.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
};

export type FeatureSeo = {
  path: string; // "/generate"
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string; // absolute URL or path under /
  faq: FaqItem[];
  howTo?: HowToStep[];
};

export type FaqItem = { q: string; a: string };
export type HowToStep = { name: string; text: string };

/**
 * Build a Next.js Metadata object for a feature page. Merges defaults +
 * per-feature overrides + canonical + OpenGraph + Twitter card.
 */
export function buildMetadata(feature: FeatureSeo): Metadata {
  const canonical = url(feature.path);
  const ogImage = feature.ogImage ? url(feature.ogImage) : url(`/og/${feature.path.replace(/\//g, "") || "home"}.png`);
  const titleFull = `${feature.title} | ${SITE.name}`;
  return {
    metadataBase: new URL(SITE.domain),
    title: titleFull,
    description: feature.description,
    keywords: feature.keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE.name,
      title: titleFull,
      description: feature.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: feature.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleFull,
      description: feature.description,
      images: [ogImage],
      site: SITE.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

/* ---------- JSON-LD helpers ---------- */

export function softwareApplicationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    url: SITE.domain,
    description: SITE.description,
    offers: { "@type": "Offer", priceCurrency: "USD", price: "5" },
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.domain,
    sameAs: ["https://twitter.com/vidyai"],
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: url(it.path),
    })),
  };
}

export function faqLd(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function howToLd(name: string, description: string, steps: HowToStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** Inline-script JSON-LD; embed via <Script type="application/ld+json"> or a server-side script tag. */
export function jsonLd(obj: object): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}
