"use client";

import { Play, Sparkles } from "lucide-react";
import { AutoplayVideo } from "./AutoplayVideo";
import { cn } from "@/lib/utils";
import type { ShowcaseClip } from "@/lib/studio-showcase";

export type EffectEntry = ShowcaseClip & { selected?: boolean; onSelect?: () => void };

export function EffectGallery({ effects, selectedId, onSelect }: { effects: EffectEntry[]; selectedId?: string; onSelect?: (id: string) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {effects.map((e) => {
        const active = e.id === selectedId;
        return (
          <li key={e.id}>
            <button
              onClick={() => onSelect?.(e.id)}
              className={cn(
                "group relative aspect-[3/4] w-full overflow-hidden rounded-2xl border ring-1 transition",
                active ? "border-white ring-white/30" : "border-white/10 ring-white/5 hover:border-white/30",
              )}
            >
              <AutoplayVideo src={e.src} poster={e.poster} hoverOnly={!active} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                <div className="text-left">
                  <p className="text-sm font-semibold leading-tight">{e.label}</p>
                  {e.meta && <p className="text-[10px] uppercase tracking-wider text-white/55">{e.meta}</p>}
                </div>
                {active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    <Sparkles className="h-2.5 w-2.5" />
                    Picked
                  </span>
                )}
              </div>
              <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/40 p-1.5 backdrop-blur-md opacity-0 transition group-hover:opacity-100">
                <Play className="h-3 w-3" />
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
