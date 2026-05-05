import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { buildStudioMetadata, type StudioSeo } from "@/lib/studio-seo";
import { CATEGORY_REELS } from "@/lib/studio-showcase";
import { SimpleToolPage } from "@/components/studio/SimpleToolPage";

const seo: StudioSeo = {
  path: "/studio/train",
  title: "Train a custom model",
  metaTitle: "Train AI LoRA · Vidy Studio",
  description: "Fine-tune FLUX or Hunyuan Video on your subject or style in minutes. Re-use the LoRA across every Vidy feature.",
  keywords: ["AI LoRA training", "fine-tune AI", "FLUX LoRA", "Hunyuan Video LoRA"],
  modelCategory: "training",
  faq: [
    { q: "How many images do I need?", a: "5–20 well-lit images are enough for FLUX LoRA Fast." },
    { q: "Can I train video LoRAs?", a: "Yes — Hunyuan Video LoRA accepts a small video dataset." },
  ],
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildStudioMetadata(seo);

export default async function Page() {
  const models = await prisma.falModel
    .findMany({ where: { enabled: true, category: "training" }, orderBy: { sortIndex: "asc" }, take: 50, select: { slug: true, displayName: true, description: true, unitPriceUsd: true, unit: true, badge: true } })
    .catch(() => []);
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} models={models} />
      <SimpleToolPage
        feature="train"
        category="training"
        title={seo.title}
        description={seo.description}
        placeholder="Describe the trigger word — drop your training images zip…"
        fields={[
          { key: "triggerWord", label: "Trigger word", type: "select", default: "subject", options: [
            { value: "subject", label: "subject" },
            { value: "style", label: "style" },
            { value: "char", label: "char" },
          ] },
        ]}
        defaults={{ triggerWord: "subject" }}
        showcase={CATEGORY_REELS.image}
        resultType="image"
        uploadKey="imagesUrl"
      />
    </>
  );
}
