import type { Metadata } from "next";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { buildStudioMetadata, type StudioSeo } from "@/lib/studio-seo";
import { CATEGORY_REELS } from "@/lib/studio-showcase";
import { SimpleToolPage } from "@/components/studio/SimpleToolPage";

const seo: StudioSeo = {
  path: "/studio/dubbing",
  title: "Dubbing",
  metaTitle: "AI Video Dubbing · Vidy Studio",
  description: "Translate and dub any video into 30+ languages. Speech-to-text → GPT-5 translation → cloned voice → lipsync.",
  keywords: ["AI video dubbing", "translate video AI", "multilingual lipsync", "voice translation"],
  faq: [
    { q: "Is the original speaker's voice preserved?", a: "Optional — clone the voice once and re-use it across every language." },
    { q: "How many languages?", a: "30+ via Kokoro and ElevenLabs Multilingual." },
  ],
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildStudioMetadata(seo);

export default function Page() {
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} />
      <SimpleToolPage
        feature="dubbing"
        category="lipsync"
        title={seo.title}
        description={seo.description}
        placeholder="Drop the source video and pick the target language…"
        fields={[
          { key: "targetLanguage", label: "Target", type: "select", default: "es", options: [
            { value: "es", label: "Spanish" },
            { value: "fr", label: "French" },
            { value: "de", label: "German" },
            { value: "ja", label: "Japanese" },
            { value: "hi", label: "Hindi" },
            { value: "pt", label: "Portuguese" },
            { value: "zh", label: "Mandarin" },
          ] },
        ]}
        defaults={{ targetLanguage: "es" }}
        showcase={CATEGORY_REELS.voice}
        resultType="video"
        uploadKey="videoUrl"
      />
    </>
  );
}
