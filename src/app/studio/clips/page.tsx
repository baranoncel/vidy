import type { Metadata } from "next";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { buildStudioMetadata, type StudioSeo } from "@/lib/studio-seo";
import { CATEGORY_REELS } from "@/lib/studio-showcase";
import { SimpleToolPage } from "@/components/studio/SimpleToolPage";

const seo: StudioSeo = {
  path: "/studio/clips",
  title: "Long-form to shorts",
  metaTitle: "AI Long-Form to Shorts · Vidy Studio",
  description: "Extract viral 30–60 s clips from any long-form video — STT + GPT-5 highlight detection + 9:16 reframe.",
  keywords: ["AI clip finder", "long to short", "podcast clips", "shorts maker"],
  faq: [
    { q: "How does it pick clips?", a: "STT transcribes the audio, GPT-5 ranks moments by hook + completeness + emotional arc, then we cut + reframe to 9:16." },
  ],
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildStudioMetadata(seo);

export default function Page() {
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} />
      <SimpleToolPage
        feature="clips"
        category="stt"
        title={seo.title}
        description={seo.description}
        placeholder="Drop a long video — we'll find the most viral 60 s and reframe to 9:16…"
        showcase={CATEGORY_REELS.video}
        resultType="video"
        uploadKey="videoUrl"
      />
    </>
  );
}
