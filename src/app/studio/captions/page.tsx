import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { buildStudioMetadata, type StudioSeo } from "@/lib/studio-seo";
import { CATEGORY_REELS } from "@/lib/studio-showcase";
import { SimpleToolPage } from "@/components/studio/SimpleToolPage";

const seo: StudioSeo = {
  path: "/studio/captions",
  title: "Captions & subtitles",
  metaTitle: "AI Captions · Vidy Studio",
  description: "Auto-generate burned-in captions or .srt subtitles from any video — word-level timing via ElevenLabs Speech-to-Text.",
  keywords: ["AI captions", "auto subtitles", "speech to text", "video transcription"],
  modelCategory: "stt",
  faq: [
    { q: "Word-level or line-level captions?", a: "Both — pick line-level for YouTube, word-level for TikTok-style highlights." },
    { q: "Multiple languages?", a: "Yes — ElevenLabs STT supports 30+ languages with automatic detection." },
  ],
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildStudioMetadata(seo);

export default async function Page() {
  const models = await prisma.falModel
    .findMany({ where: { enabled: true, category: "stt" }, orderBy: { sortIndex: "asc" }, take: 50, select: { slug: true, displayName: true, description: true, unitPriceUsd: true, unit: true, badge: true } })
    .catch(() => []);
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} models={models} />
      <SimpleToolPage
        feature="captions"
        category="stt"
        title={seo.title}
        description={seo.description}
        placeholder="Drop a video — captions auto-generate with timing…"
        showcase={CATEGORY_REELS.voice}
        resultType="video"
        uploadKey="videoUrl"
      />
    </>
  );
}
