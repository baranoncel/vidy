import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { buildStudioMetadata, type StudioSeo } from "@/lib/studio-seo";
import { CATEGORY_REELS } from "@/lib/studio-showcase";
import { SimpleToolPage } from "@/components/studio/SimpleToolPage";

const seo: StudioSeo = {
  path: "/studio/upscale",
  title: "Upscale image & video",
  metaTitle: "AI Upscaler · Vidy Studio",
  description: "Upscale images and video to 4K with Topaz Video Upscale, DRCT, Creative Upscaler, and Swin2SR.",
  keywords: ["AI upscaler", "Topaz video", "DRCT", "Creative Upscaler", "image upscaler", "video upscaler"],
  modelCategory: "upscale",
  faq: [
    { q: "Does Topaz preserve faces?", a: "Yes — Topaz Video Upscale is the production standard for face-preserving upscaling." },
    { q: "What's the largest output supported?", a: "Up to 4K for video, up to 22K pixels on the long edge for stills with DRCT." },
  ],
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildStudioMetadata(seo);

export default async function Page() {
  const models = await prisma.falModel
    .findMany({ where: { enabled: true, category: "upscale" }, orderBy: { sortIndex: "asc" }, take: 50, select: { slug: true, displayName: true, description: true, unitPriceUsd: true, unit: true, badge: true } })
    .catch(() => []);
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} models={models} />
      <SimpleToolPage
        feature="upscale"
        category="upscale"
        title={seo.title}
        description={seo.description}
        placeholder="Drop an image or video, then describe the output (optional)…"
        fields={[
          { key: "targetResolution", label: "Target", type: "select", options: [{ value: "1080p", label: "1080p" }, { value: "4K", label: "4K" }], default: "4K" },
          { key: "upscaleFactor", label: "Factor", type: "number", default: 2, min: 2, max: 4, step: 1 },
        ]}
        defaults={{ targetResolution: "4K", upscaleFactor: 2 }}
        showcase={CATEGORY_REELS.video.slice(0, 4)}
        resultType="video"
        uploadKey="videoUrl"
      />
    </>
  );
}
