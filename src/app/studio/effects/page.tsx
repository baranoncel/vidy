"use client";

import { useState } from "react";
import { PromptBar } from "@/components/studio/PromptBar";
import { ResultGrid, type ResultItem } from "@/components/studio/ResultGrid";
import { useStudioModels } from "@/lib/hooks/useStudioModels";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

const PRESETS = [
  { id: "explode", label: "Explode" },
  { id: "melt", label: "Melt" },
  { id: "dissolve", label: "Dissolve" },
  { id: "ageing", label: "Ageing" },
  { id: "freeze", label: "Freeze" },
  { id: "transform", label: "Transform" },
  { id: "zoom-glitch", label: "Zoom-glitch" },
  { id: "ripple", label: "Ripple" },
];

export default function StudioEffectsPage() {
  const { models } = useStudioModels("effects");
  const [selected, setSelected] = useState<string | null>(null);
  const [preset, setPreset] = useState("explode");
  const [items, setItems] = useState<ResultItem[]>([]);
  const [ref, setRef] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fr = useFeatureRun("effects");

  if (!selected && models.length > 0) setSelected(models[0].slug);

  async function submit(prompt: string) {
    const tempId = `local-${Date.now()}`;
    setItems((prev) => [{ id: tempId, prompt, status: "queued", type: "video", createdAt: Date.now() }, ...prev]);
    try {
      const result = await fr.run({ prompt, effect: preset, imageUrl: ref ?? undefined }, { modelSlug: selected ?? undefined });
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
      <header className="mb-7 mt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Effects</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">One-click cinematic effects on any image or video.</p>
      </header>

      {/* Preset chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPreset(p.id)}
            className={
              "rounded-full border px-3 py-1.5 text-xs font-medium transition " +
              (preset === p.id
                ? "border-white bg-white text-black"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white")
            }
          >
            {p.label}
          </button>
        ))}
      </div>

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
        placeholder="Describe the scene — drop the source image/video"
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
