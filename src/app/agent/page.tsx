import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature/FeatureLayout";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata } from "@/lib/seo";
import { AgentClient } from "./agent-client";

const seo = FEATURE_SEO.agent;
export const metadata: Metadata = buildMetadata(seo);

export default function Page() {
  return (
    <FeatureLayout seo={seo}>
      <AgentClient />
    </FeatureLayout>
  );
}
