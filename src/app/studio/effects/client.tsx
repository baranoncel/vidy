"use client";

import { useState } from "react";
import { PromptBar } from "@/components/studio/PromptBar";
import { ResultGrid, type ResultItem } from "@/components/studio/ResultGrid";
import { EffectGallery } from "@/components/studio/EffectGallery";
import { useStudioModels } from "@/lib/hooks/useStudioModels";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";
import { CATEGORY_REELS } from "@/lib/studio-showcase";

const EFFECT_PRESETS = CATEGORY_REELS.effects;

export function StudioEffectsPageClient() {
  const { models } = useStudioModels("effects");
  const [selected, setSelected] = useState<string | null>(null);
  const [presetId, setPresetId] = useState<string>(EFFECT_PRESETS[0].id);
  const [items, setItems] = useState<ResultItem[]>([]);
  const [ref, setRef] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fr = useFeatureRun("effects");

  if (!selected && models.length > 0) setSelected(models[0].slug);
  const preset = EFFECT_PRESETS.find((e) => e.id === presetId)!;

  async function submit(prompt: string) {
    const tempId = `local-${Date.now()}`;
    setItems((prev) => [{ id: tempId, prompt, status: "queued", type: "video", createdAt: Date.now() }, ...prev]);
    try {
      const result = await fr.run({ prompt, effect: preset.label.toLowerCase(), imageUrl: ref ?? undefined }, { modelSlug: selected ?? undefined });
      setItems((prev) =>
        prev.map((it) =>
          it.id === tempId ? { ...it, status: result?.status === "completed" ? "completed" : "failed", url: result?.outputUrl ?? null, errorMessage: result?.errorMessage } : it,
        ),
      );
    } catch (err) {
      setItems((prev) => prev.map((it) => (it.id === tempId ? { ...it, status: "failed" as const, errorMessage: err instanceof Error ? err.message : "Failed" } : it)));
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <header className="mb-7 mt-6 flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            {EFFECT_PRESETS.length} presets
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Effects</h1>
          <p className="mt-2 max-w-xl text-sm text-white/55">Pick an effect, drop your source, hit ↑.</p>
        </div>
      </header>

      {/* Visual effect gallery (autoplay video tiles) */}
      <section className="mb-6">
        <EffectGallery effects={EFFECT_PRESETS} selectedId={presetId} onSelect={setPresetId} />
      </section>

      <PromptBar
        models={models}
        selectedSlug={selected}
        onSelect={setSelected}
        onSubmit={submit}
        onUpload={(f) => {
          setRef(f);
          setPreviewUrl(URL.createObjectURL(f));
        }}
        busy={fr.status === "running" || fr.status === "queued" || fr.status === "uploading"}
        placeholder={`Describe how you want “${preset.label}” to look on your source…`}
        values={{}}
        onValuesChange={() => {}}
        attachments={ref ? [{ id: "ref", name: ref.name, previewUrl: previewUrl ?? undefined }] : []}
        onRemoveAttachment={() => {
          setRef(null);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }}
      />
      <div className="mt-8">
        <ResultGrid items={items} />
      </div>
    </main>
  );
}
