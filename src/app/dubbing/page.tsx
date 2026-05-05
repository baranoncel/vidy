import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature/FeatureLayout";
import { FeaturePage } from "@/components/feature/FeaturePage";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata } from "@/lib/seo";

const seo = FEATURE_SEO.dubbing;
export const metadata: Metadata = buildMetadata(seo);

export default function Page() {
  return (
    <FeatureLayout
      seo={seo}
      intro={
        <p className="mt-2 max-w-3xl text-sm text-violet-600 dark:text-violet-400">
          Multi-step pipeline: Speech-to-Text → GPT-5 translation → Kokoro voice → Sync Lipsync 2.0. The full plan is shown before debit.
        </p>
      }
    >
      <FeaturePage feature="dubbing" />
    </FeatureLayout>
  );
}
