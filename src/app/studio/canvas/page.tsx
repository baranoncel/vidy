"use client";

import Link from "next/link";
import { Bot, Sparkles, ArrowRight } from "lucide-react";

const TEMPLATES = [
  { id: "ios-screenshot-to-ugc-promo", title: "iOS screenshot → UGC promo", body: "Phone-in-hand mockup → animated → voiceover → music → captions." },
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
          <Bot className="h-3 w-3" /> Multi-model templates
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Canvas</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">Pre-built workflow templates that chain multiple models into a finished asset.</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <li key={t.id}>
            <Link
              href={`/agent?template=${t.id}`}
              className="group block rounded-3xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <Sparkles className="h-4 w-4 text-amber-300/80" />
              <h3 className="mt-3 text-base font-semibold tracking-tight">{t.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-white/55">{t.body}</p>
              <ArrowRight className="mt-4 h-4 w-4 -translate-x-1 opacity-50 transition group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
