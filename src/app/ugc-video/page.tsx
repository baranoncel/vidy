import type { Metadata } from "next";
import { FeatureLayout } from "@/components/feature/FeatureLayout";
import { FeaturePage } from "@/components/feature/FeaturePage";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata } from "@/lib/seo";

const seo = FEATURE_SEO["ugc-video"];
export const metadata: Metadata = buildMetadata(seo);

export default function Page() {
  return (
    <FeatureLayout
      seo={seo}
      intro={
        <p className="mt-2 max-w-3xl text-sm text-violet-600 dark:text-violet-400">
          This feature delegates to the agent. Upload your screenshot below; Vidy plans the full pipeline (vision → device frame → animation → voice → lipsync → music → captions) and runs it end-to-end.
        </p>
      }
    >
      <FeaturePage feature="ugc-video" />
    </FeatureLayout>
  );
}
