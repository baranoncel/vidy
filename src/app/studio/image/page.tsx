"use client";

import { useState } from "react";
import { PromptBar, type StudioField } from "@/components/studio/PromptBar";
import { ResultGrid, type ResultItem } from "@/components/studio/ResultGrid";
import { useStudioModels } from "@/lib/hooks/useStudioModels";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

const FIELDS: StudioField[] = [
  { key: "aspectRatio", label: "Aspect", type: "select", options: [
    { value: "1:1", label: "1:1 square" },
    { value: "16:9", label: "16:9 wide" },
    { value: "9:16", label: "9:16 portrait" },
    { value: "4:5", label: "4:5 portrait" },
    { value: "3:2", label: "3:2 photo" },
  ], default: "1:1" },
  { key: "numImages", label: "Variations", type: "number", default: 1, min: 1, max: 4, step: 1 },
];

const EXAMPLES = [
  "Cinematic photo of a woman in a linen jacket, golden hour, 35mm",
  "Neon-lit Tokyo alleyway at midnight, photoreal",
  "Minimalist Bauhaus poster of a mountain at sunrise",
  "Macro studio shot of a ceramic coffee mug, soft daylight",
];

export default function StudioImagePage() {
  const { models } = useStudioModels("image");
  const [selected, setSelected] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string | number>>({ aspectRatio: "1:1", numImages: 1 });
  const [items, setItems] = useState<ResultItem[]>([]);
  const fr = useFeatureRun("image");

  // Pick a default once models load
  if (!selected && models.length > 0) setSelected(models[0].slug);

  async function submit(prompt: string) {
    const tempId = `local-${Date.now()}`;
    const draft: ResultItem = { id: tempId, prompt, status: "queued", type: "image", createdAt: Date.now() };
    setItems((prev) => [draft, ...prev]);

    try {
      const result = await fr.run(
        { prompt, aspectRatio: values.aspectRatio, numImages: values.numImages },
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
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Image</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">
          Describe the image. Pick a model. Hit ↑.
        </p>
      </header>

      <PromptBar
        models={models}
        selectedSlug={selected}
        onSelect={setSelected}
        onSubmit={submit}
        busy={fr.status === "running" || fr.status === "queued" || fr.status === "uploading"}
        placeholder="A cinematic photo of…"
        fields={FIELDS}
        values={values}
        onValuesChange={setValues}
        examples={EXAMPLES}
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
