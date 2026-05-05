"use client";

import { useState } from "react";
import { PromptBar, type StudioField } from "@/components/studio/PromptBar";
import { ResultGrid, type ResultItem } from "@/components/studio/ResultGrid";
import { PageShowcase } from "@/components/studio/PageShowcase";
import { useStudioModels } from "@/lib/hooks/useStudioModels";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";
import type { ShowcaseClip } from "@/lib/studio-showcase";

/**
 * Generic tool page renderer for the simpler /studio/* routes.
 * Wires the prompt bar to a feature key + R2 file upload + SSE polling.
 */
export function SimpleToolPage({
  feature,
  category,
  title,
  description,
  placeholder,
  fields = [],
  defaults = {},
  examples = [],
  showcase = [],
  resultType = "video",
  uploadKey,
}: {
  feature: string;
  category: string;
  title: string;
  description: string;
  placeholder: string;
  fields?: StudioField[];
  defaults?: Record<string, string | number>;
  examples?: string[];
  showcase?: ShowcaseClip[];
  resultType?: "video" | "image" | "audio";
  uploadKey?: string; // input key the file should be sent under (e.g. "videoUrl", "imageUrl")
}) {
  const { models } = useStudioModels(category);
  const [selected, setSelected] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string | number>>(defaults);
  const [items, setItems] = useState<ResultItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fr = useFeatureRun(feature);

  if (!selected && models.length > 0) setSelected(models[0].slug);

  async function submit(prompt: string) {
    const tempId = `local-${Date.now()}`;
    setItems((prev) => [{ id: tempId, prompt, status: "queued", type: resultType, createdAt: Date.now() }, ...prev]);
    try {
      const input: Record<string, unknown> = { prompt, ...values };
      if (uploadKey && file) input[uploadKey] = file;
      const result = await fr.run(input, { modelSlug: selected ?? undefined });
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
      <header className="mb-6 mt-6 flex items-end justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            {models.length} models live
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/55">{description}</p>
        </div>
      </header>

      {showcase.length > 0 && <PageShowcase clips={showcase} />}

      <PromptBar
        models={models}
        selectedSlug={selected}
        onSelect={setSelected}
        onSubmit={submit}
        onUpload={uploadKey ? (f) => {
          setFile(f);
          setPreviewUrl(URL.createObjectURL(f));
        } : undefined}
        busy={fr.status === "running" || fr.status === "queued" || fr.status === "uploading"}
        placeholder={placeholder}
        fields={fields}
        values={values}
        onValuesChange={setValues}
        examples={examples}
        attachments={file ? [{ id: "f", name: file.name, previewUrl: previewUrl ?? undefined }] : []}
        onRemoveAttachment={() => {
          setFile(null);
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
