import type { MetadataRoute } from "next";
import { FEATURE_SEO } from "@/lib/seo-config";
import { SITE } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return Object.values(FEATURE_SEO).map((f) => ({
    url: `${SITE.domain.replace(/\/$/, "")}${f.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: f.path === "/" ? 1 : 0.7,
  }));
}
