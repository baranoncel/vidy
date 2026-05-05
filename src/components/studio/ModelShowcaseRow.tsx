"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { AutoplayVideo } from "./AutoplayVideo";
import type { ShowcaseClip } from "@/lib/studio-showcase";

export type ShowcaseModelEntry = {
  slug: string;
  displayName: string;
  description?: string | null;
  badge?: string | null;
  category: string;
  showcase?: ShowcaseClip;
  coinsRef: number;
  unitLabel: string;
};

export function ModelShowcaseRow({
  title,
  subtitle,
  href,
  items,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  items: ShowcaseModelEntry[];
}) {
  if (!items.length) return null;
  return (
    <section className="mb-14">
      <header className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-white/55">{subtitle}</p>}
        </div>
        {href && (
          <Link href={href} className="hidden items-center gap-1 text-sm text-white/60 hover:text-white sm:inline-flex">
            See all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </header>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((m) => (
          <li
            key={m.slug}
            className="group relative aspect-[4/5] w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] ring-1 ring-white/5"
          >
            {m.showcase ? (
              <AutoplayVideo src={m.showcase.src} poster={m.showcase.poster} />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/15 via-transparent to-blue-500/10" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="pointer-events-none absolute inset-3 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/70 backdrop-blur-md">
                  {m.category}
                </span>
                {m.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    <Sparkles className="h-2.5 w-2.5" />
                    {m.badge}
                  </span>
                )}
              </div>
              <div className="mt-auto">
                <h3 className="text-lg font-semibold leading-tight tracking-tight">{m.displayName}</h3>
                {m.description && <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/65">{m.description}</p>}
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                  <span className="text-white/50">{m.unitLabel}</span>
                  <span className="font-medium">{m.coinsRef.toLocaleString()} coins</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
