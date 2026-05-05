"use client";

import { useEffect, useState } from "react";

type Model = { slug: string; displayName: string; coinsRef: number };

export function useFeatureModels(slugs: string[]): Model[] {
  const [models, setModels] = useState<Model[]>([]);
  useEffect(() => {
    let live = true;
    fetch("/api/fal/models")
      .then((r) => r.json())
      .then((data: { models: Array<{ slug: string; displayName: string; coinsPerStandardUnit: number }> }) => {
        if (!live) return;
        const map = new Map(data.models.map((m) => [m.slug, m]));
        const out: Model[] = [];
        for (const s of slugs) {
          const m = map.get(s);
          if (m) out.push({ slug: m.slug, displayName: m.displayName, coinsRef: m.coinsPerStandardUnit });
        }
        setModels(out);
      })
      .catch(() => setModels([]));
    return () => {
      live = false;
    };
  }, [slugs]);
  return models;
}
