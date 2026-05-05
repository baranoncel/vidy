"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Coins, Loader2, Wand2, CheckCircle2, XCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadToR2 } from "@/lib/hooks/useJob";
import { useAuthGate } from "@/components/auth/AuthGate";

type TemplateInput = { key: string; label: string; kind: string; required?: boolean; options?: { value: string; label: string }[]; default?: string | number; placeholder?: string };
type Template = { id: string; displayName: string; description: string; category: string; expectedInputs: TemplateInput[] };

type Step = { stepKey: string; modelSlug: string; status: string; outputUrl: string | null; errorMessage: string | null };
type RunUpdate = { status: string; finalOutputUrl: string | null; errorMessage: string | null; steps: Step[] };

export function AgentClient() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateId, setTemplateId] = useState<string>("ios-screenshot-to-ugc-promo");
  const [prompt, setPrompt] = useState("");
  const [inputs, setInputs] = useState<Record<string, unknown>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [planTotal, setPlanTotal] = useState<number | null>(null);
  const [update, setUpdate] = useState<RunUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const evtRef = useRef<EventSource | null>(null);

  useEffect(() => {
    fetch("/api/agent/templates")
      .then((r) => r.json())
      .then((data: { templates: Template[] }) => {
        setTemplates(data.templates);
      })
      .catch(() => setTemplates([]));
  }, []);

  const template = useMemo(() => templates.find((t) => t.id === templateId), [templates, templateId]);

  useEffect(() => {
    if (!runId) return;
    const es = new EventSource(`/api/agent/runs/${runId}/stream`);
    evtRef.current = es;
    es.addEventListener("update", (e) => {
      try {
        setUpdate(JSON.parse((e as MessageEvent).data));
      } catch {}
    });
    es.addEventListener("done", () => {
      es.close();
      evtRef.current = null;
    });
    return () => {
      es.close();
      evtRef.current = null;
    };
  }, [runId]);

  async function onPickFile(key: string, file: File | null) {
    if (!file) {
      setInputs((v) => ({ ...v, [key]: "" }));
      return;
    }
    setUploading(key);
    try {
      const { publicUrl } = await uploadToR2(file);
      setInputs((v) => ({ ...v, [key]: publicUrl }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  const { requireAuth, isAuthed } = useAuthGate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await requireAuth(async () => {
      setSubmitting(true);
      setError(null);
      setUpdate(null);
      try {
        const res = await fetch("/api/agent/runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, templateId, inputs }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Submit failed");
        setRunId(data.runId);
        setPlanTotal(data.plan?.totalEstCoins ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Submit failed");
      } finally {
        setSubmitting(false);
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
      <form onSubmit={submit} className="space-y-5 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
        <div>
          <label className="mb-1 block text-sm font-medium">Workflow template</label>
          <select
            value={templateId}
            onChange={(e) => {
              setTemplateId(e.target.value);
              setInputs({});
            }}
            className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
          >
            <option value="">— Free-form (planner picks a model chain) —</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.category}: {t.displayName}
              </option>
            ))}
          </select>
          {template && <p className="mt-1 text-xs text-neutral-500">{template.description}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Prompt (override)</label>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want — e.g. 'Make a 15s UGC promo for our app'"
            className="w-full resize-y rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
          />
        </div>

        {template && (
          <div className="space-y-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
            {template.expectedInputs.map((f) => {
              if (f.kind === "fileImage" || f.kind === "fileVideo" || f.kind === "fileAudio") {
                const accept = f.kind === "fileImage" ? "image/*" : f.kind === "fileVideo" ? "video/*" : "audio/*";
                const url = String(inputs[f.key] ?? "");
                return (
                  <div key={f.key}>
                    <label className="mb-1 block text-sm font-medium">{f.label}</label>
                    {url ? (
                      <p className="rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-500 dark:border-neutral-800">{url.split("/").pop()}</p>
                    ) : (
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-3 text-sm text-neutral-500 hover:border-violet-500 dark:border-neutral-700">
                        {uploading === f.key ? <Loader2 className="h-4 w-4 animate-spin" /> : `Drop ${f.label.toLowerCase()}`}
                        <input
                          type="file"
                          accept={accept}
                          className="hidden"
                          onChange={(e) => onPickFile(f.key, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    )}
                  </div>
                );
              }
              if (f.kind === "select" && f.options) {
                return (
                  <div key={f.key}>
                    <label className="mb-1 block text-sm font-medium">{f.label}</label>
                    <select
                      value={String(inputs[f.key] ?? f.default ?? "")}
                      onChange={(e) => setInputs((v) => ({ ...v, [f.key]: e.target.value }))}
                      className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-800"
                    >
                      {f.options.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (f.kind === "prompt") {
                return (
                  <div key={f.key}>
                    <label className="mb-1 block text-sm font-medium">{f.label}</label>
                    <textarea
                      rows={3}
                      value={String(inputs[f.key] ?? "")}
                      onChange={(e) => setInputs((v) => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full resize-y rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
                    />
                  </div>
                );
              }
              return (
                <div key={f.key}>
                  <label className="mb-1 block text-sm font-medium">{f.label}</label>
                  <input
                    type={f.kind === "number" ? "number" : "text"}
                    value={String(inputs[f.key] ?? f.default ?? "")}
                    onChange={(e) => setInputs((v) => ({ ...v, [f.key]: f.kind === "number" ? Number(e.target.value) : e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus:border-violet-500 dark:border-neutral-800"
                  />
                </div>
              );
            })}
          </div>
        )}

        <Button type="submit" disabled={submitting || !!uploading} className="gap-2">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {submitting ? "Planning…" : isAuthed ? "Plan and run" : "Sign in to run agent"}
        </Button>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      <aside className="space-y-4 rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
        <header className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Bot className="h-4 w-4 text-violet-500" /> Plan
          </h3>
          {planTotal !== null && (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-xs text-violet-600 dark:text-violet-400">
              <Coins className="h-3 w-3" /> ~{planTotal.toLocaleString()}
            </span>
          )}
        </header>

        {!update && !runId && (
          <p className="text-sm text-neutral-500">Pick a template, fill the inputs, and submit. The plan and live progress appear here.</p>
        )}
        {update && (
          <ul className="space-y-2">
            {update.steps.map((s) => (
              <li key={s.stepKey} className="flex items-start gap-2 text-sm">
                <StepIcon status={s.status} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{s.stepKey}</span>
                    <span className="font-mono text-xs text-neutral-500">{s.modelSlug.replace(/^fal-ai\//, "").replace(/\/.*$/, "")}</span>
                  </div>
                  {s.errorMessage && <p className="text-xs text-red-500">{s.errorMessage}</p>}
                  {s.outputUrl && (
                    <a href={s.outputUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 underline dark:text-violet-400">
                      view step output
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {update?.finalOutputUrl && update.status === "completed" && (
          <div className="border-t border-neutral-200 pt-4 dark:border-neutral-800">
            <h4 className="mb-2 text-xs uppercase tracking-wide text-neutral-500">Final output</h4>
            {/(\.mp4|\.webm)$/i.test(update.finalOutputUrl) ? (
              <video src={update.finalOutputUrl} controls className="w-full rounded-lg" />
            ) : /(\.png|\.jpg|\.jpeg|\.webp)$/i.test(update.finalOutputUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={update.finalOutputUrl} alt="result" className="w-full rounded-lg" />
            ) : (
              <a href={update.finalOutputUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-600 underline dark:text-violet-400">
                Open output
              </a>
            )}
          </div>
        )}
        {update?.status === "failed" && <p className="text-sm text-red-500">Run failed. {update.errorMessage}</p>}
      </aside>
    </div>
  );
}

function StepIcon({ status }: { status: string }) {
  if (status === "completed") return <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />;
  if (status === "failed") return <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />;
  if (status === "running") return <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-violet-500" />;
  return <Circle className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />;
}
