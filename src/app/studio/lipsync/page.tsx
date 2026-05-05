import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { buildStudioMetadata, type StudioSeo } from "@/lib/studio-seo";
import { CATEGORY_REELS } from "@/lib/studio-showcase";
import { SimpleToolPage } from "@/components/studio/SimpleToolPage";

const seo: StudioSeo = {
  path: "/studio/lipsync",
  title: "Lipsync",
  metaTitle: "AI Lipsync · Vidy Studio",
  description: "Sync any voice track to any face — Sync Lipsync 2.0, Kling Lipsync, and Tavus Hummingbird.",
  keywords: ["AI lipsync", "Sync Lipsync 2.0", "Kling lipsync", "talking avatar AI", "Tavus"],
  modelCategory: "lipsync",
  faq: [
    { q: "Best lipsync model for facial detail?", a: "Sync Lipsync 2.0 leads on facial detail. Kling Lipsync is faster and cheaper." },
    { q: "What audio formats?", a: "WAV, MP3, M4A. We auto-convert if needed." },
  ],
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildStudioMetadata(seo);

export default async function Page() {
  const models = await prisma.falModel
    .findMany({ where: { enabled: true, category: "lipsync" }, orderBy: { sortIndex: "asc" }, take: 50, select: { slug: true, displayName: true, description: true, unitPriceUsd: true, unit: true, badge: true } })
    .catch(() => []);
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} models={models} />
      <SimpleToolPage
        feature="lipsync"
        category="lipsync"
        title={seo.title}
        description={seo.description}
        placeholder="Drop the face video, then upload audio in the Settings drawer…"
        showcase={CATEGORY_REELS.voice}
        resultType="video"
        uploadKey="videoUrl"
      />
    </>
  );
}
