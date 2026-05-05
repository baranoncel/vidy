import type { Metadata } from "next";
import { StudioPageHead } from "@/components/studio/StudioPageHead";
import { STUDIO_SEO, buildStudioMetadata } from "@/lib/studio-seo";
import { StudioRealtimePageClient } from "./client";

export const dynamic = "force-dynamic";
const seo = STUDIO_SEO.realtime;
export const metadata: Metadata = buildStudioMetadata(seo);

export default function Page() {
  return (
    <>
      <StudioPageHead path={seo.path} title={seo.title} faq={seo.faq} />
      <StudioRealtimePageClient />
    </>
  );
}
