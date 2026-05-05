"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  slug: string;
  href: string;
  displayName: string;
  description: string | null;
  badge: string | null;
  category: string;
  features: string[];
  coins: number;
  unit: string;
};

const CATS = [
  { id: "all", label: "All" },
  { id: "video", label: "Video" },
  { id: "image", label: "Image" },
  { id: "audio", label: "Audio" },
  { id: "tts", label: "Voice" },
  { id: "stt", label: "Transcribe" },
  { id: "lipsync", label: "Lipsync" },
  { id: "upscale", label: "Upscale" },
  { id: "3d", label: "3D" },
  { id: "effects", label: "Effects" },
  { id: "training", label: "Training" },
  { id: "vision", label: "Vision" },
];

export function ModelsCatalogClient({ items }: { items: Item[] }) {
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return items.filter((m) => {
      if (cat !== "all" && m.category !== cat) return false;
      if (!ql) return true;
      return (
        m.displayName.toLowerCase().includes(ql) ||
        (m.description ?? "").toLowerCase().includes(ql) ||
        m.slug.toLowerCase().includes(ql) ||
        m.features.some((f) => f.toLowerCase().includes(ql))
      );
    });
  }, [items, cat, q]);

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search models, capabilities, slugs…"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/30"
          />
        </div>
        <span className="text-xs text-white/40">{filtered.length} results</span>
      </div>

      <div className="-mx-4 mb-6 flex snap-x snap-mandatory gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "shrink-0 snap-start rounded-full border px-3 py-1.5 text-xs font-medium transition",
              cat === c.id ? "border-white bg-white text-black" : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m) => (
          <li key={m.slug}>
            <Link
              href={m.href}
              className="group relative block rounded-3xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5 transition hover:border-white/30 hover:bg-white/[0.06]"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/55">
                    {m.category}
                  </span>
                  <h3 className="mt-2 text-base font-semibold tracking-tight">{m.displayName}</h3>
                </div>
                {m.badge && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-300 text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    <Sparkles className="h-2.5 w-2.5" />
                    {m.badge}
                  </span>
                )}
              </div>
              {m.description && <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-white/55">{m.description}</p>}
              {m.features.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {m.features.slice(0, 3).map((f) => (
                    <span key={f} className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] text-white/55">
                      {f}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs">
                <span className="text-white/45">{m.unit}</span>
                <span className="font-medium">{m.coins.toLocaleString()} coins</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-white/40">No models match those filters.</p>
      )}
    </>
  );
}
