"use client";

import { useEffect, useState } from "react";
import type { StudioModel } from "@/components/studio/PromptBar";

export function useStudioModels(category: string): { models: StudioModel[]; loading: boolean } {
  const [models, setModels] = useState<StudioModel[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    setLoading(true);
    fetch(`/api/fal/models?category=${encodeURIComponent(category)}`)
      .then((r) => r.json())
      .then((d: { models?: Array<{ slug: string; displayName: string; description: string | null; badge: string | null; thumbnailUrl?: string | null }> }) => {
        if (!live) return;
        setModels(
          (d.models || []).map((m) => ({
            slug: m.slug,
            displayName: m.displayName,
            description: m.description,
            badge: m.badge,
            thumb: m.thumbnailUrl ?? null,
          })),
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      live = false;
    };
  }, [category]);
  return { models, loading };
}
