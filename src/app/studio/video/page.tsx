import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { STUDIO_SEO, buildStudioMetadata } from "@/lib/studio-seo";
import { StudioVideoPageClient } from "./client";

export const dynamic = "force-dynamic";
const seo = STUDIO_SEO.video;
export const metadata: Metadata = buildStudioMetadata(seo);

export default async function Page() {
  const models = await prisma.falModel
    .findMany({ where: { enabled: true, category: "video" }, orderBy: { sortIndex: "asc" }, take: 50, select: { slug: true, displayName: true, description: true, unitPriceUsd: true, unit: true, badge: true } })
    .catch(() => []);
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} models={models} />
      <StudioVideoPageClient />
    </>
  );
}
