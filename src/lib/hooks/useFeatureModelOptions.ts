"use client";

import { useEffect, useState } from "react";
import type { ModelOption } from "@/components/ui/claude-style-ai-input";

/**
 * Fetch the live FalModel catalog filtered by category, mapped to the
 * ModelOption shape ClaudeChatInput expects. Hides the underlying provider
 * by stripping any "fal-ai/" prefix from slugs in user-facing strings.
 */
export function useFeatureModelOptions(
  categories: string | string[],
  opts: { limit?: number; selectedSlug?: string } = {},
): { options: ModelOption[]; loading: boolean; defaultId: string | null } {
  const [options, setOptions] = useState<ModelOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cats = Array.isArray(categories) ? categories : [categories];
    let cancelled = false;
    setLoading(true);
    Promise.all(
      cats.map((c) =>
        fetch(`/api/fal/models?category=${encodeURIComponent(c)}`)
          .then((r) => r.json())
          .then((d: { models?: Array<{ slug: string; displayName: string; description: string | null; badge: string | null; coinsPerStandardUnit: number }> }) => d.models ?? [])
          .catch(() => []),
      ),
    )
      .then((arrs) => {
        if (cancelled) return;
        const merged = arrs.flat();
        const seen = new Set<string>();
        const uniq = merged.filter((m) => (seen.has(m.slug) ? false : (seen.add(m.slug), true)));
        const limited = opts.limit ? uniq.slice(0, opts.limit) : uniq;
        const mapped: ModelOption[] = limited.map((m) => ({
          id: m.slug,
          name: m.displayName,
          description: m.description ?? `${m.coinsPerStandardUnit.toLocaleString()} coins ref`,
          badge: m.badge || undefined,
        }));
        setOptions(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(categories), opts.limit]);

  const defaultId = opts.selectedSlug && options.some((o) => o.id === opts.selectedSlug) ? opts.selectedSlug : options[0]?.id ?? null;
  return { options, loading, defaultId };
}
