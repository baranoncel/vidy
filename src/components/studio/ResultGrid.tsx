"use client";

import { Loader2, Play, Download, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export type ResultItem = {
  id: string;
  prompt: string;
  status: "queued" | "running" | "completed" | "failed";
  url?: string | null;
  type: "image" | "video" | "audio";
  createdAt: number;
  errorMessage?: string | null;
};

export function ResultGrid({ items, onRetry }: { items: ResultItem[]; onRetry?: (id: string) => void }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((it) => (
        <li
          key={it.id}
          className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] ring-1 ring-white/5"
        >
          {/* Loading state */}
          {(it.status === "queued" || it.status === "running") && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-violet-500/10 via-transparent to-blue-500/10">
              <Loader2 className="h-6 w-6 animate-spin text-white/60" />
              <p className="px-4 text-center text-xs text-white/50 line-clamp-2">{it.prompt}</p>
            </div>
          )}

          {/* Failed */}
          {it.status === "failed" && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
              <p className="text-xs text-red-400">{it.errorMessage || "Failed"}</p>
              {onRetry && (
                <button
                  onClick={() => onRetry(it.id)}
                  className="mt-2 flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                >
                  <RotateCw className="h-3 w-3" />
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Completed */}
          {it.status === "completed" && it.url && (
            <>
              {it.type === "video" ? (
                <video src={it.url} className="h-full w-full object-cover" muted playsInline loop autoPlay />
              ) : it.type === "audio" ? (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6">
                  <Play className="h-8 w-8 text-white/40" />
                  <audio src={it.url} controls className="w-full" />
                </div>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={it.url} alt={it.prompt} className="h-full w-full object-cover" />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 opacity-0 transition group-hover:opacity-100">
                <p className="line-clamp-2 text-[11px] leading-relaxed text-white/80">{it.prompt}</p>
              </div>
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="pointer-events-auto absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white/80 opacity-0 backdrop-blur-md transition hover:bg-black/80 hover:text-white group-hover:opacity-100"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
