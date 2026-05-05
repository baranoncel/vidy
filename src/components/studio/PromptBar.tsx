"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ChevronDown, Image as ImageIcon, Loader2, Paperclip, Settings2, Sparkles, X, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type StudioModel = {
  slug: string;
  displayName: string;
  description?: string | null;
  badge?: string | null;
  thumb?: string | null;
};

export type StudioField = {
  key: string;
  label: string;
  type: "select" | "number";
  options?: { value: string; label: string }[];
  default?: string | number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

export function PromptBar({
  models,
  selectedSlug,
  onSelect,
  onSubmit,
  onUpload,
  busy,
  placeholder = "Describe your idea — drop files, hit ↑",
  fields = [],
  values,
  onValuesChange,
  examples = [],
  attachments = [],
  onRemoveAttachment,
}: {
  models: StudioModel[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  onSubmit: (prompt: string) => void;
  onUpload?: (file: File) => void;
  busy: boolean;
  placeholder?: string;
  fields?: StudioField[];
  values: Record<string, string | number>;
  onValuesChange: (next: Record<string, string | number>) => void;
  examples?: string[];
  attachments?: { id: string; name: string; previewUrl?: string }[];
  onRemoveAttachment?: (id: string) => void;
}) {
  const [text, setText] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showModels, setShowModels] = useState(false);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = models.find((m) => m.slug === selectedSlug) ?? models[0];
  const useModelModal = models.length > 10;
  const filteredModels = useModelModal
    ? models.filter((m) => {
        const q = search.toLowerCase();
        return !q || m.displayName.toLowerCase().includes(q) || (m.description || "").toLowerCase().includes(q);
      })
    : models;

  // Close modal on Escape
  useEffect(() => {
    if (!showModels && !showSettings) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowModels(false);
        setShowSettings(false);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [showModels, showSettings]);

  function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    if (!text.trim() || busy) return;
    onSubmit(text.trim());
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] ring-1 ring-white/5 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(124,58,237,0.25)]">
        {/* Attachments strip */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-white/5 p-3">
            {attachments.map((a) => (
              <div
                key={a.id}
                className="group relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs"
              >
                {a.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.previewUrl} alt={a.name} className="h-6 w-6 rounded object-cover" />
                ) : (
                  <Paperclip className="h-3.5 w-3.5 text-white/50" />
                )}
                <span className="max-w-[180px] truncate text-white/70">{a.name}</span>
                {onRemoveAttachment && (
                  <button
                    onClick={() => onRemoveAttachment(a.id)}
                    className="ml-1 rounded-full p-0.5 text-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleEnter}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none bg-transparent px-5 py-4 text-[15px] text-white placeholder:text-white/30 focus:outline-none"
        />

        {/* Bottom toolbar */}
        <div className="flex items-center gap-2 border-t border-white/5 bg-white/[0.02] px-3 py-2.5">
          {/* Upload */}
          {onUpload && (
            <>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onUpload(f);
                  e.currentTarget.value = "";
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                title="Attach file"
                className="rounded-full p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                <Paperclip className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Model picker */}
          {models.length > 0 && (
            <button
              onClick={() => setShowModels((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {selected?.badge ? <Sparkles className="h-3 w-3 text-amber-400" /> : <ImageIcon className="h-3 w-3" />}
              <span className="max-w-[140px] truncate">{selected?.displayName ?? "Model"}</span>
              <ChevronDown className={cn("h-3 w-3 transition-transform", showModels && "rotate-180")} />
            </button>
          )}

          {/* Settings */}
          {fields.length > 0 && (
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Settings2 className="h-3 w-3" />
              Settings
              <ChevronDown className={cn("h-3 w-3 transition-transform", showSettings && "rotate-180")} />
            </button>
          )}

          <div className="ml-auto flex items-center gap-2">
            {examples.length > 0 && !text && (
              <button
                onClick={() => onSubmit(examples[Math.floor(Math.random() * examples.length)])}
                className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 transition hover:bg-white/10 hover:text-white sm:inline-flex"
              >
                Surprise me
              </button>
            )}
            <button
              onClick={submit}
              disabled={!text.trim() || busy}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition",
                text.trim() && !busy ? "bg-white text-black hover:opacity-90" : "bg-white/10 text-white/40",
              )}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Settings dropdown — opens BELOW */}
        {showSettings && fields.length > 0 && (
          <div className="border-t border-white/5 bg-black/40 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="mb-1 block text-[10px] uppercase tracking-wider text-white/40">{f.label}</label>
                  {f.type === "select" ? (
                    <select
                      value={String(values[f.key] ?? f.default ?? "")}
                      onChange={(e) => onValuesChange({ ...values, [f.key]: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                    >
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value} className="bg-neutral-900">
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <input
                        type="number"
                        value={Number(values[f.key] ?? f.default ?? 0)}
                        min={f.min}
                        max={f.max}
                        step={f.step}
                        onChange={(e) => onValuesChange({ ...values, [f.key]: Number(e.target.value) })}
                        className="w-full bg-transparent text-sm text-white focus:outline-none"
                      />
                      {f.unit && <span className="text-xs text-white/40">{f.unit}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Model picker — modal for >10 models, dropdown otherwise (BELOW the bar) */}
      {showModels && !useModelModal && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] ring-1 ring-white/5 shadow-2xl shadow-black/50">
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {models.map((m) => (
              <button
                key={m.slug}
                onClick={() => {
                  onSelect(m.slug);
                  setShowModels(false);
                }}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition hover:bg-white/5",
                  selectedSlug === m.slug && "bg-white/5",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{m.displayName}</span>
                    {m.badge && (
                      <span className="rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-400">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  {m.description && <p className="mt-0.5 line-clamp-1 text-xs text-white/50">{m.description}</p>}
                </div>
                {selectedSlug === m.slug && <Check className="h-4 w-4 shrink-0 text-white" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {showModels && useModelModal && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setShowModels(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d10] ring-1 ring-white/5 shadow-2xl shadow-black/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-white/5 p-4">
              <Search className="h-4 w-4 text-white/40" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${models.length} models…`}
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <button onClick={() => setShowModels(false)} className="rounded-full p-1.5 text-white/50 hover:bg-white/5 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredModels.length === 0 && (
                <p className="py-10 text-center text-sm text-white/40">No models match &quot;{search}&quot;.</p>
              )}
              {filteredModels.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => {
                    onSelect(m.slug);
                    setShowModels(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-2xl p-3 text-left transition hover:bg-white/5",
                    selectedSlug === m.slug && "bg-white/5",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-white">{m.displayName}</span>
                      {m.badge && (
                        <span className="rounded-full bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-400">
                          {m.badge}
                        </span>
                      )}
                    </div>
                    {m.description && <p className="mt-0.5 line-clamp-2 text-xs text-white/50">{m.description}</p>}
                  </div>
                  {selectedSlug === m.slug && <Check className="h-4 w-4 shrink-0 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
