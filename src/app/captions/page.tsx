import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature/FeatureLayout";
import { FeaturePage } from "@/components/feature/FeaturePage";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata } from "@/lib/seo";

const seo = FEATURE_SEO.captions;
export const metadata: Metadata = buildMetadata(seo);

export default function Page() {
  return (
    <FeatureLayout seo={seo}>
      <FeaturePage feature="captions" />
    </FeatureLayout>
  );
}
