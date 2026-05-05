"use client";

import { useState } from "react";
import { PromptBar } from "@/components/studio/PromptBar";
import { ResultGrid, type ResultItem } from "@/components/studio/ResultGrid";
import { useStudioModels } from "@/lib/hooks/useStudioModels";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

export function Studio3DPageClient() {
  const { models } = useStudioModels("3d");
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems] = useState<ResultItem[]>([]);
  const [ref, setRef] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fr = useFeatureRun("3d");

  if (!selected && models.length > 0) setSelected(models[0].slug);

  async function submit(prompt: string) {
    const tempId = `local-${Date.now()}`;
    setItems((prev) => [{ id: tempId, prompt, status: "queued", type: "video", createdAt: Date.now() }, ...prev]);
    try {
      const result = await fr.run({ prompt, imageUrl: ref ?? undefined }, { modelSlug: selected ?? undefined });
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
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">3D</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">Drop a photo, get a 3D mesh + 360° turntable mp4.</p>
      </header>
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
        placeholder="An object photo (drop above) — describe additional detail…"
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
