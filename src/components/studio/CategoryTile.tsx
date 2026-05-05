"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Image as ImageIcon,
  Video,
  Music,
  Box,
  Wand2,
  Zap,
  Layers,
  MicVocal,
  Sparkles,
} from "lucide-react";
import { AutoplayVideo } from "./AutoplayVideo";
import type { ShowcaseClip } from "@/lib/studio-showcase";

export type CategoryIconKey = "image" | "video" | "music" | "box" | "wand" | "zap" | "layers" | "voice" | "sparkles";

const ICONS = {
  image: ImageIcon,
  video: Video,
  music: Music,
  box: Box,
  wand: Wand2,
  zap: Zap,
  layers: Layers,
  voice: MicVocal,
  sparkles: Sparkles,
} as const;

export function CategoryTile({
  href,
  title,
  body,
  icon,
  showcase,
  large = false,
  modelCount,
}: {
  href: string;
  title: string;
  body: string;
  icon: CategoryIconKey;
  showcase?: ShowcaseClip;
  large?: boolean;
  modelCount?: number;
}) {
  const Icon = ICONS[icon];
  return (
    <Link
      href={href}
      className={
        "group relative block overflow-hidden rounded-3xl border border-white/10 ring-1 ring-white/5 transition hover:border-white/30 " +
        (large ? "aspect-[5/4] sm:aspect-[16/9]" : "aspect-[5/4]")
      }
    >
      {showcase ? (
        <AutoplayVideo src={showcase.src} poster={showcase.poster} />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-blue-500/15" />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
      <div className="pointer-events-none absolute inset-0 flex flex-col p-5">
        <div className="flex items-center justify-between">
          <Icon className="h-5 w-5 text-white/85" />
          {modelCount !== undefined && (
            <span className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/70 backdrop-blur-md">
              {modelCount} models
            </span>
          )}
        </div>
        <div className="mt-auto">
          <h3 className={"font-semibold tracking-tight " + (large ? "text-3xl" : "text-xl")}>{title}</h3>
          <p className={"mt-1 text-white/65 " + (large ? "text-sm" : "text-xs")}>{body}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/80">
            Open studio
            <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
