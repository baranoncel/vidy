"use client";

import { useEffect, useMemo, useState } from "react";
import { Coins, Loader2, RotateCcw, Wand2, Upload, X } from "lucide-react";
import { useJob, uploadToR2 } from "@/lib/hooks/useJob";
import type { FeatureKey } from "@/lib/feature-models";
import { Button } from "@/components/ui/button";

export type FieldKind =
  | "prompt"
  | "shortText"
  | "negativePrompt"
  | "select"
  | "number"
  | "fileImage"
  | "fileVideo"
  | "fileAudio"
  | "url";

export type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  required?: boolean;
  default?: string | number;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  help?: string;
};

export type ResultKind = "video" | "image" | "audio" | "3d" | "json" | "text";

type ModelOption = { slug: string; displayName: string; coinsRef: number };

export function JobConsole({
  feature,
  fields,
  resultKind = "video",
  defaultModel,
  modelOptions,
}: {
  feature: FeatureKey;
  fields: FieldDef[];
  resultKind?: ResultKind;
  defaultModel?: string;
  modelOptions?: ModelOption[];
}) {
  const { submit, jobId, update, error, isSubmitting, reset } = useJob();
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    Object.fromEntries(fields.map((f) => [f.key, f.default ?? ""])),
  );
  const [uploading, setUploading] = useState<string | null>(null);
  const [chosenModel, setChosenModel] = useState<string | undefined>(defaultModel);

  useEffect(() => {
    setChosenModel(defaultModel);
  }, [defaultModel]);

  const status = update?.status;
  const isWorking = status === "running" || status === "queued" || isSubmitting;
  const finalCoins = update?.finalCoins ?? update?.estCoins;

  async function onPickFile(field: FieldDef, file: File | null) {
    if (!file) {
      setValues((v) => ({ ...v, [field.key]: "" }));
      return;
    }
    setUploading(field.key);
    try {
      const { publicUrl } = await uploadToR2(file);
      setValues((v) => ({ ...v, [field.key]: publicUrl }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  function setValue(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    for (const f of fields) {
      if (f.required && !values[f.key]) {
        alert(`${f.label} is required`);
        return;
      }
    }
    await submit({
      feature,
      modelSlug: chosenModel,
      input: values,
    }).catch((err) => {
      console.error(err);
    });
  }

  const showResult = update?.outputUrl && status === "completed";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr,360px]">
      <section className="space-y-4 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
        {fields.map((f) => (
          <FieldInput
            key={f.key}
            field={f}
            value={values[f.key]}
            onChange={(v) => setValue(f.key, v)}
            onFile={(file) => onPickFile(f, file)}
            uploading={uploading === f.key}
          />
        ))}

        {modelOptions && modelOptions.length > 1 && (
          <ModelPicker options={modelOptions} value={chosenModel} onChange={setChosenModel} />
        )}

        <div className="flex items-center justify-between gap-3">
          <Button type="submit" disabled={isWorking || !!uploading} className="gap-2">
            {isWorking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {isWorking ? "Generating…" : "Generate"}
          </Button>
          {jobId && (
            <Button type="button" variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </section>

      <aside className="space-y-4 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
        <header className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Result</h3>
          {finalCoins != null && (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-xs text-violet-600 dark:text-violet-400">
              <Coins className="h-3 w-3" /> {finalCoins.toLocaleString()}
            </span>
          )}
        </header>

        {!update && <p className="text-sm text-neutral-500">Submit to start. Live progress streams here.</p>}
        {update && status !== "completed" && status !== "failed" && (
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Status: {status}</span>
          </div>
        )}
        {status === "failed" && (
          <p className="text-sm text-red-500">{update?.errorMessage || "Failed. Coins refunded."}</p>
        )}
        {showResult && (
          <ResultViewer kind={resultKind} url={update!.outputUrl!} />
        )}
      </aside>
    </form>
  );
}

function FieldInput({
  field,
  value,
  onChange,
  onFile,
  uploading,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  onFile: (file: File | null) => void;
  uploading: boolean;
}) {
  if (field.kind === "prompt" || field.kind === "negativePrompt") {
    return (
      <Field label={field.label} help={field.help}>
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={field.kind === "prompt" ? 5 : 2}
          className="w-full resize-y rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
        />
      </Field>
    );
  }
  if (field.kind === "shortText" || field.kind === "url") {
    return (
      <Field label={field.label} help={field.help}>
        <input
          type={field.kind === "url" ? "url" : "text"}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
        />
      </Field>
    );
  }
  if (field.kind === "select") {
    return (
      <Field label={field.label} help={field.help}>
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>
    );
  }
  if (field.kind === "number") {
    return (
      <Field label={field.label} help={field.help}>
        <input
          type="number"
          value={Number(value ?? 0)}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
        />
      </Field>
    );
  }
  if (field.kind === "fileImage" || field.kind === "fileVideo" || field.kind === "fileAudio") {
    const accept = field.kind === "fileImage" ? "image/*" : field.kind === "fileVideo" ? "video/*" : "audio/*";
    const url = String(value ?? "");
    return (
      <Field label={field.label} help={field.help}>
        {url ? (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-800">
            <span className="truncate text-neutral-500">{url.split("/").pop()}</span>
            <button type="button" onClick={() => onFile(null)} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3 py-4 text-sm text-neutral-500 transition hover:border-violet-500 dark:border-neutral-700">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Drop {field.label.toLowerCase()} here or click to browse
              </>
            )}
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </label>
        )}
      </Field>
    );
  }
  return null;
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {help && <p className="mt-1 text-xs text-neutral-500">{help}</p>}
    </div>
  );
}

function ModelPicker({ options, value, onChange }: { options: ModelOption[]; value?: string; onChange: (v: string) => void }) {
  return (
    <Field label="Model">
      <select
        value={value ?? options[0]?.slug}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
      >
        {options.map((m) => (
          <option key={m.slug} value={m.slug}>
            {m.displayName} · ~{m.coinsRef.toLocaleString()} coins
          </option>
        ))}
      </select>
    </Field>
  );
}

function ResultViewer({ kind, url }: { kind: ResultKind; url: string }) {
  if (kind === "video") {
    return <video src={url} controls className="w-full rounded-lg" />;
  }
  if (kind === "image") {
    // Use a plain img to avoid Next.js image optimisation domain config for arbitrary R2 hostnames.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={url} alt="result" className="w-full rounded-lg" />;
  }
  if (kind === "audio") {
    return <audio src={url} controls className="w-full" />;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-600 underline dark:text-violet-400">
      Open output
    </a>
  );
}

export const _useMemo = useMemo; // pin import; satisfies linter when JobConsole is tree-shaken
