"use client";

import { useState } from "react";
import { PromptBar, type StudioField } from "@/components/studio/PromptBar";
import { ResultGrid, type ResultItem } from "@/components/studio/ResultGrid";
import { useStudioModels } from "@/lib/hooks/useStudioModels";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

const FIELDS: StudioField[] = [
  { key: "durationSeconds", label: "Duration", type: "number", default: 10, min: 1, max: 120, step: 1, unit: "sec" },
];

const EXAMPLES = [
  "Lo-fi beat with rain and vinyl crackle",
  "Cinematic orchestral trailer hit",
  "8-bit chiptune adventure theme",
  "Ambient pad with subtle synth arpeggios",
];

export default function StudioAudioPage() {
  const { models } = useStudioModels("audio");
  const [selected, setSelected] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string | number>>({ durationSeconds: 10 });
  const [items, setItems] = useState<ResultItem[]>([]);
  const fr = useFeatureRun("audio");

  if (!selected && models.length > 0) setSelected(models[0].slug);

  async function submit(prompt: string) {
    const tempId = `local-${Date.now()}`;
    const draft: ResultItem = { id: tempId, prompt, status: "queued", type: "audio", createdAt: Date.now() };
    setItems((prev) => [draft, ...prev]);
    try {
      const result = await fr.run({ prompt, durationSeconds: Number(values.durationSeconds) || 10 }, { modelSlug: selected ?? undefined });
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
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Audio</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">Music, sound effects, ambience — described in words.</p>
      </header>
      <PromptBar
        models={models}
        selectedSlug={selected}
        onSelect={setSelected}
        onSubmit={submit}
        busy={fr.status === "running" || fr.status === "queued" || fr.status === "uploading"}
        placeholder="A lo-fi beat with rain…"
        fields={FIELDS}
        values={values}
        onValuesChange={setValues}
        examples={EXAMPLES}
      />
      <div className="mt-8">
        <ResultGrid items={items} />
      </div>
    </main>
  );
}
