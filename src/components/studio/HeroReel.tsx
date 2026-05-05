"use client";

import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { AutoplayVideo } from "./AutoplayVideo";
import type { ShowcaseClip } from "@/lib/studio-showcase";

export function HeroReel({ clips }: { clips: ShowcaseClip[] }) {
  return (
    <section className="relative -mt-2 mb-14">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 ring-1 ring-white/5">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-5">
          {clips.slice(0, 5).map((c, i) => (
            <Link
              key={c.id}
              href={`/studio/${c.category}`}
              className={
                "group relative aspect-[3/4] overflow-hidden " +
                (i === 0 ? "col-span-2 row-span-2 sm:col-span-1 sm:row-span-1" : "")
              }
            >
              <AutoplayVideo src={c.src} poster={c.poster} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/55">{c.meta}</p>
                  <p className="mt-0.5 text-sm font-semibold leading-tight">{c.label}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 -translate-x-1 translate-y-1 opacity-0 transition group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
              </div>
              <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/40 p-1.5 backdrop-blur-md opacity-0 transition group-hover:opacity-100">
                <Play className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
