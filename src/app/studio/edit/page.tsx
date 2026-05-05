import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { buildStudioMetadata, type StudioSeo } from "@/lib/studio-seo";
import { CATEGORY_REELS } from "@/lib/studio-showcase";
import { SimpleToolPage } from "@/components/studio/SimpleToolPage";

const seo: StudioSeo = {
  path: "/studio/edit",
  title: "Generative editor",
  metaTitle: "AI Generative Editor · Vidy Studio",
  description: "Edit images and video with natural-language prompts. Object removal, background replace, inpainting, and re-styling.",
  keywords: ["AI image editor", "AI video editor", "object removal", "inpainting", "background replace"],
  faq: [
    { q: "Can I remove an object from a video?", a: "Yes — drop the video, describe the object, and the editor re-renders frames without it." },
    { q: "Is editing destructive?", a: "No — your original is kept; outputs are saved as new assets in your Profile." },
  ],
};

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildStudioMetadata(seo);

export default async function Page() {
  const models = await prisma.falModel
    .findMany({ where: { enabled: true, OR: [{ slug: { contains: "kontext" } }, { slug: { contains: "edit" } }, { slug: { contains: "framepack" } }] }, take: 50, select: { slug: true, displayName: true, description: true, unitPriceUsd: true, unit: true, badge: true } })
    .catch(() => []);
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} models={models} />
      <SimpleToolPage
        feature="edit"
        category="image"
        title={seo.title}
        description={seo.description}
        placeholder="Describe the edit — 'remove the bystander', 'replace the sky with sunset'…"
        showcase={CATEGORY_REELS.video.slice(0, 4)}
        resultType="video"
        uploadKey="videoUrl"
      />
    </>
  );
}
