import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { STUDIO_SEO, buildStudioMetadata } from "@/lib/studio-seo";
import { Studio3DPageClient } from "./client";

export const dynamic = "force-dynamic";
const seo = STUDIO_SEO["3d"];
export const metadata: Metadata = buildStudioMetadata(seo);

export default async function Page() {
  const models = await prisma.falModel
    .findMany({ where: { enabled: true, category: "3d" }, orderBy: { sortIndex: "asc" }, take: 50, select: { slug: true, displayName: true, description: true, unitPriceUsd: true, unit: true, badge: true } })
    .catch(() => []);
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} models={models} />
      <Studio3DPageClient />
    </>
  );
}
