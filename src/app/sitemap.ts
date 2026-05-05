import type { MetadataRoute } from "next";
import { FEATURE_SEO } from "@/lib/seo-config";
import { STUDIO_SEO } from "@/lib/studio-seo";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = SITE.domain.replace(/\/$/, "");

  const features = Object.values(FEATURE_SEO).map((f) => ({
    url: `${base}${f.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: f.path === "/" ? 1 : 0.7,
  }));

  const studio = [
    { url: `${base}/studio`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.9 },
    ...Object.values(STUDIO_SEO).map((s) => ({
      url: `${base}${s.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
  ];

  return [...features, ...studio];
}
