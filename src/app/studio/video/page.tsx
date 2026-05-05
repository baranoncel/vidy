"use client";

import { useState } from "react";
import { PromptBar, type StudioField } from "@/components/studio/PromptBar";
import { ResultGrid, type ResultItem } from "@/components/studio/ResultGrid";
import { useStudioModels } from "@/lib/hooks/useStudioModels";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

const FIELDS: StudioField[] = [
  { key: "durationSeconds", label: "Duration", type: "select", options: [
    { value: "4", label: "4 s" },
    { value: "5", label: "5 s" },
    { value: "6", label: "6 s" },
    { value: "8", label: "8 s" },
    { value: "10", label: "10 s" },
  ], default: "5" },
  { key: "aspectRatio", label: "Aspect", type: "select", options: [
    { value: "16:9", label: "16:9 wide" },
    { value: "9:16", label: "9:16 vertical" },
    { value: "1:1", label: "1:1 square" },
  ], default: "16:9" },
];

const EXAMPLES = [
  "Cinematic shot of a fox running through a snowy forest, golden hour",
  "Slow-motion close-up of espresso pouring into a cup",
  "Drone flyover of a futuristic city at dawn, neon reflections",
  "A samurai walks slowly through a bamboo forest, fog drifting",
];

export default function StudioVideoPage() {
  const { models } = useStudioModels("video");
  const [selected, setSelected] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string | number>>({ durationSeconds: "5", aspectRatio: "16:9" });
  const [items, setItems] = useState<ResultItem[]>([]);
  const [reference, setReference] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fr = useFeatureRun("video");

  if (!selected && models.length > 0) setSelected(models[0].slug);

  function onUpload(file: File) {
    setReference(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function submit(prompt: string) {
    const tempId = `local-${Date.now()}`;
    const draft: ResultItem = { id: tempId, prompt, status: "queued", type: "video", createdAt: Date.now() };
    setItems((prev) => [draft, ...prev]);

    try {
      const result = await fr.run(
        {
          prompt,
          imageUrl: reference ?? undefined,
          durationSeconds: Number(values.durationSeconds) || 5,
          aspectRatio: values.aspectRatio,
        },
        { modelSlug: selected ?? undefined },
      );
      setItems((prev) =>
        prev.map((it) =>
          it.id === tempId
            ? { ...it, status: result?.status === "completed" ? "completed" : "failed", url: result?.outputUrl ?? null, errorMessage: result?.errorMessage }
            : it,
        ),
      );
    } catch (err) {
      setItems((prev) => prev.map((it) => (it.id === tempId ? { ...it, status: "failed" as const, errorMessage: err instanceof Error ? err.message : "Failed" } : it)));
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <header className="mb-7 mt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Video</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">
          Describe a scene or drop a reference image. The picker has every video model live.
        </p>
      </header>

      <PromptBar
        models={models}
        selectedSlug={selected}
        onSelect={setSelected}
        onSubmit={submit}
        onUpload={onUpload}
        busy={fr.status === "running" || fr.status === "queued" || fr.status === "uploading"}
        placeholder="A cinematic drone shot of…"
        fields={FIELDS}
        values={values}
        onValuesChange={setValues}
        examples={EXAMPLES}
        attachments={reference ? [{ id: "ref", name: reference.name, previewUrl: previewUrl ?? undefined }] : []}
        onRemoveAttachment={() => {
          setReference(null);
          if (previewUrl) URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }}
      />

      <div className="mt-8">
        <ResultGrid items={items} onRetry={(id) => {
          const it = items.find((x) => x.id === id);
          if (it) submit(it.prompt);
        }} />
      </div>
    </main>
  );
}
