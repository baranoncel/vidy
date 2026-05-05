"use client";

import { AutoplayVideo } from "./AutoplayVideo";
import type { ShowcaseClip } from "@/lib/studio-showcase";

/**
 * Compact reel band shown above the prompt bar on category pages.
 * 4 tiles in a row, autoplay, click-to-prefill prompt.
 */
export function PageShowcase({
  clips,
  onPick,
}: {
  clips: ShowcaseClip[];
  onPick?: (clip: ShowcaseClip) => void;
}) {
  if (!clips.length) return null;
  return (
    <ul className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {clips.slice(0, 4).map((c) => (
        <li key={c.id}>
          <button
            type="button"
            onClick={() => onPick?.(c)}
            className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 transition hover:border-white/30"
          >
            <AutoplayVideo src={c.src} poster={c.poster} hoverOnly />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />
            <div className="pointer-events-none absolute inset-x-2.5 bottom-2.5">
              <p className="text-[11px] font-semibold leading-tight">{c.label}</p>
              {c.meta && <p className="text-[10px] uppercase tracking-wider text-white/55">{c.meta}</p>}
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
