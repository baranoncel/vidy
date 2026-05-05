"use client";

import Link from "next/link";
import { Bot, Sparkles, ArrowUpRight, Play } from "lucide-react";
import { AutoplayVideo } from "@/components/studio/AutoplayVideo";
import { TEMPLATE_PREVIEWS } from "@/lib/studio-showcase";

const TEMPLATES = [
  { id: "ios-screenshot-to-ugc-promo", title: "iOS screenshot → UGC promo", body: "Device frame → animated UGC scene → voiceover → music → captions." },
  { id: "trailer-from-script", title: "Script → trailer", body: "Multi-shot keyframes → 4K animation → epic score." },
  { id: "kids-story-animation", title: "Kids story", body: "Warm illustrations → soft narration → cheerful music." },
  { id: "before-after-transformation", title: "Before / after", body: "Two images → smooth morph → reveal copy." },
  { id: "product-360-spin", title: "Product 360°", body: "Single photo → 3D mesh → rotating turntable." },
  { id: "dub-this-video", title: "Dub a video", body: "STT → translate → TTS in target language → lipsync." },
  { id: "podcast-clip-to-shorts", title: "Podcast → Shorts", body: "Long audio + headshot → 9:16 lipsync clip + captions." },
  { id: "music-video-from-lyrics", title: "Lyrics → music video", body: "Instrumental + scene-per-bar visuals." },
];

export default function CanvasPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <header className="mb-10 mt-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
          <Bot className="h-3 w-3" /> {TEMPLATES.length} multi-model templates
        </span>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Canvas</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">
          Pre-built workflow templates that chain 5–10 models into a finished asset. Pick one, fill the inputs, watch the agent work.
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => {
          const preview = TEMPLATE_PREVIEWS[t.id];
          return (
            <li key={t.id}>
              <Link
                href={`/agent?template=${t.id}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 ring-1 ring-white/5 transition hover:border-white/30"
              >
                {preview ? <AutoplayVideo src={preview.src} poster={preview.poster} hoverOnly /> : null}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="pointer-events-none absolute inset-4 flex flex-col">
                  <span className="inline-flex w-max items-center gap-1 rounded-full bg-amber-300 text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    <Sparkles className="h-2.5 w-2.5" /> Template
                  </span>
                  <div className="mt-auto">
                    <h3 className="text-lg font-semibold leading-tight tracking-tight">{t.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/65">{t.body}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white/80">
                      Run <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
                <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/40 p-1.5 backdrop-blur-md opacity-0 transition group-hover:opacity-100">
                  <Play className="h-3 w-3" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
