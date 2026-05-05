"use client";

import { useState } from "react";
import { PromptBar, type StudioField } from "@/components/studio/PromptBar";
import { ResultGrid, type ResultItem } from "@/components/studio/ResultGrid";
import { useStudioModels } from "@/lib/hooks/useStudioModels";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

const FIELDS: StudioField[] = [
  { key: "languageCode", label: "Language", type: "select", options: [
    { value: "", label: "Auto" },
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "ja", label: "Japanese" },
    { value: "zh", label: "Mandarin" },
    { value: "hi", label: "Hindi" },
  ], default: "" },
];

export function StudioVoicePageClient() {
  const { models } = useStudioModels("tts");
  const [selected, setSelected] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string | number>>({ languageCode: "" });
  const [items, setItems] = useState<ResultItem[]>([]);
  const fr = useFeatureRun("tts");

  if (!selected && models.length > 0) setSelected(models[0].slug);

  async function submit(prompt: string) {
    const tempId = `local-${Date.now()}`;
    setItems((prev) => [{ id: tempId, prompt, status: "queued", type: "audio", createdAt: Date.now() }, ...prev]);
    try {
      const result = await fr.run({ text: prompt, languageCode: values.languageCode || undefined }, { modelSlug: selected ?? undefined });
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
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Voice</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">Type the script, pick the voice, get a clean voiceover in 30+ languages.</p>
      </header>
      <PromptBar
        models={models}
        selectedSlug={selected}
        onSelect={setSelected}
        onSubmit={submit}
        busy={fr.status === "running" || fr.status === "queued" || fr.status === "uploading"}
        placeholder="Hello and welcome to my channel today…"
        fields={FIELDS}
        values={values}
        onValuesChange={setValues}
      />
      <div className="mt-8">
        <ResultGrid items={items} />
      </div>
    </main>
  );
}
