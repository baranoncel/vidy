import type { MetadataRoute } from "next";
import { FEATURE_SEO } from "@/lib/seo-config";
import { STUDIO_SEO } from "@/lib/studio-seo";
import { SITE } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { modelPathFromSlug } from "@/lib/studio-helpers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    ...["/studio/upscale", "/studio/edit", "/studio/lipsync", "/studio/dubbing", "/studio/captions", "/studio/clips", "/studio/train", "/studio/explore", "/studio/marketing", "/studio/cinema", "/studio/character", "/studio/models"].map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  // Per-model deep-dive pages — index every public model
  const models = await prisma.falModel.findMany({ where: { enabled: true }, select: { slug: true, updatedAt: true } }).catch(() => []);
  const modelEntries = models.map((m) => ({
    url: `${base}${modelPathFromSlug(m.slug)}`,
    lastModified: m.updatedAt ?? now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const legal = ["/terms", "/privacy", "/refund"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [...features, ...studio, ...modelEntries, ...legal];
}
