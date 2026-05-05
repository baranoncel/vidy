"use client";

import { JobConsole } from "@/components/feature/JobConsole";
import { useFeatureModels } from "@/components/feature/ModelOptionsLoader";
import { FEATURE_UI, type UserFeatureKey } from "@/lib/feature-ui";

export function FeaturePage({ feature }: { feature: UserFeatureKey }) {
  const ui = FEATURE_UI[feature];
  const models = useFeatureModels(ui.modelSlugs);
  return (
    <JobConsole
      feature={feature}
      fields={ui.fields}
      resultKind={ui.resultKind}
      defaultModel={ui.modelSlugs[0]}
      modelOptions={models}
    />
  );
}
