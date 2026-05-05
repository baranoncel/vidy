import type { Metadata } from "next";
import Link from "next/link";
import { Image as ImageIcon, Video, Music, Box, Wand2, Zap, Layers, MicVocal, ArrowUpRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { estimateCoins, type FalUnit } from "@/lib/pricing";
import { CategoryTile } from "@/components/studio/CategoryTile";
import { HeroReel } from "@/components/studio/HeroReel";
import { ModelShowcaseRow, type ShowcaseModelEntry } from "@/components/studio/ModelShowcaseRow";
import { CATEGORY_REELS, HERO_REEL, TEMPLATE_PREVIEWS } from "@/lib/studio-showcase";
import { AutoplayVideo } from "@/components/studio/AutoplayVideo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, faqLd, SITE, url } from "@/lib/seo";

// Talk to the DB at request time, not at build time.
export const dynamic = "force-dynamic";

const STUDIO_FAQ = [
  { q: "What is Vidy Studio?", a: "Vidy Studio is one workspace for image, video, audio, voice, effects, 3D, and multi-step agent workflows. Pick a sub-studio, write a prompt, choose any frontier model — outputs are streamed back live." },
  { q: "Do I need to pick a specific model?", a: "No. Each sub-studio defaults to the best model for the job. Open the picker for the full list — it's a search modal once a category has more than 10 models so you never scroll a 70-row dropdown." },
  { q: "How does pricing work?", a: "Coin-based. Each model lists its coin price per unit (per second, per image, per character). Subscriptions ship monthly coin allowances; one-shot top-ups are available for active subscribers." },
  { q: "Can I generate without signing up?", a: "Browsing is free. Submitting a generation requires sign-in (Google or email). New accounts get 500 free coins automatically." },
  { q: "Where do my generations go?", a: "Outputs are stored in our private object storage and served from cdn.vidy.ai. They're listed in your Profile and Settings." },
];

export const metadata: Metadata = {
  title: "Vidy Studio — generate, edit, animate anything",
  description: "One workspace for image, video, audio, voice, effects, 3D, and agentic multi-model workflows. Frontier models, transparent coin pricing.",
  alternates: { canonical: url("/studio") },
  openGraph: {
    type: "website",
    url: url("/studio"),
    siteName: SITE.name,
    title: "Vidy Studio",
    description: "Image, video, audio, voice, effects, 3D — every frontier model in one place.",
    images: [{ url: url("/og/studio.png"), width: 1200, height: 630, alt: "Vidy Studio" }],
  },
  twitter: { card: "summary_large_image", title: "Vidy Studio", description: "Generate, edit, animate anything visual.", images: [url("/og/studio.png")] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const TILES = [
  { href: "/studio/video", title: "Video", body: "Veo 3.1 · Kling v3 · Seedance · Wan", Icon: Video, large: true, reelKey: "video" },
  { href: "/studio/image", title: "Image", body: "FLUX 1.1 Ultra · Ideogram V3 · Nano Banana · Seedream", Icon: ImageIcon, reelKey: "image" },
  { href: "/studio/effects", title: "Effects", body: "Pikaffects · Wan FX · Kling FX · PixVerse", Icon: Zap, reelKey: "effects" },
  { href: "/studio/audio", title: "Audio", body: "Music · Sound effects · MMAudio v2", Icon: Music, reelKey: "audio" },
  { href: "/studio/voice", title: "Voice", body: "ElevenLabs · Kokoro · Voice cloning", Icon: MicVocal, reelKey: "voice" },
  { href: "/studio/3d", title: "3D", body: "Hunyuan3D · TRELLIS · Multi-view", Icon: Box, reelKey: "3d" },
  { href: "/studio/canvas", title: "Canvas", body: "Multi-step templates", Icon: Layers, reelKey: "video" },
  { href: "/studio/realtime", title: "Realtime", body: "Sub-second image gen", Icon: Wand2, reelKey: "image" },
] as const;

const FEATURED_TEMPLATES = [
  "ios-screenshot-to-ugc-promo",
  "trailer-from-script",
  "before-after-transformation",
  "dub-this-video",
  "podcast-clip-to-shorts",
  "music-video-from-lyrics",
] as const;

export default async function StudioOverview() {
  const [featured, perCat] = await Promise.all([
    prisma.falModel
      .findMany({
        where: { enabled: true, badge: { in: ["premium", "hot", "new"] } },
        orderBy: [{ sortIndex: "asc" }],
        take: 12,
      })
      .catch(() => []),
    prisma.falModel
      .groupBy({
        by: ["category"],
        where: { enabled: true },
        _count: { _all: true },
      })
      .catch(() => [] as Array<{ category: string; _count: { _all: number } }>),
  ]);

  const counts: Record<string, number> = {};
  for (const r of perCat) counts[r.category] = r._count._all;

  function unitLabel(unit: string) {
    return unit
      .replace(/^per_/, "per ")
      .replace(/_/g, " ");
  }

  const featuredEntries: ShowcaseModelEntry[] = featured.map((m, i) => {
    const reel = CATEGORY_REELS[m.category];
    return {
      slug: m.slug,
      displayName: m.displayName,
      description: m.description,
      badge: m.badge,
      category: m.category,
      showcase: reel ? reel[i % reel.length] : undefined,
      coinsRef: estimateCoins(m.unit as FalUnit, m.unitPriceUsd, {}),
      unitLabel: unitLabel(m.unit),
    };
  });

  // ItemList schema for the category tiles — SEO + LLM ingestion
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vidy Studio sub-studios",
    itemListElement: TILES.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.title,
      url: url(t.href),
      description: t.body,
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <JsonLd id="studio-breadcrumb" data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Studio", path: "/studio" }])} />
      <JsonLd id="studio-faq" data={faqLd(STUDIO_FAQ)} />
      <JsonLd id="studio-itemlist" data={itemList} />
      {/* Hero */}
      <header className="mt-4 mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Vidy Studio · {(counts.video ?? 0) + (counts.image ?? 0) + (counts.effects ?? 0)}+ models
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl font-semibold tracking-tight leading-[1.05] sm:text-6xl">
          Generate, edit, and animate{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            anything visual
          </span>
          .
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
          One workspace for image, video, audio, voice, effects, and 3D. Auto-modal model picker. Real-time previews. Transparent coin pricing.
        </p>
      </header>

      {/* Hero reel — 5 autoplay tiles */}
      <HeroReel clips={HERO_REEL} />

      {/* Category grid (visual: each tile autoplays a reel) */}
      <section className="mb-16">
        <header className="mb-5 flex items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">Pick a studio</h2>
          <p className="text-sm text-white/50">{counts.video ?? 0} video · {counts.image ?? 0} image · {counts.tts ?? 0} voice · {counts["3d"] ?? 0} 3D</p>
        </header>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((t, i) => {
            const reel = CATEGORY_REELS[t.reelKey];
            const showcase = reel ? reel[i % reel.length] : undefined;
            const cat = t.href.split("/")[2] || "";
            return (
              <CategoryTile
                key={t.href}
                href={t.href}
                title={t.title}
                body={t.body}
                Icon={t.Icon}
                showcase={showcase}
                large={i === 0}
                modelCount={counts[cat]}
              />
            );
          })}
        </div>
      </section>

      {/* Featured models (autoplay tiles, horizontal scroll) */}
      {featuredEntries.length > 0 && (
        <ModelShowcaseRow
          title="Featured models"
          subtitle="Frontier models, fresh this week — from premium to fast"
          href="/pricing"
          items={featuredEntries}
        />
      )}

      {/* Templates band */}
      <section className="mb-14">
        <header className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Workflow templates</h2>
            <p className="mt-1 text-sm text-white/55">Pre-built multi-model pipelines from the Canvas board.</p>
          </div>
          <Link href="/studio/canvas" className="hidden items-center gap-1 text-sm text-white/60 hover:text-white sm:inline-flex">
            All templates <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </header>
        <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {FEATURED_TEMPLATES.map((id) => {
            const p = TEMPLATE_PREVIEWS[id];
            return (
              <li key={id}>
                <Link
                  href={`/agent?template=${id}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 ring-1 ring-white/5 transition hover:border-white/30"
                >
                  <AutoplayVideo src={p.src} poster={p.poster} />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="pointer-events-none absolute inset-3 flex flex-col">
                    <span className="inline-flex w-max items-center gap-1 rounded-full bg-amber-300 text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                      <Sparkles className="h-2.5 w-2.5" /> Template
                    </span>
                    <div className="mt-auto">
                      <p className="text-base font-semibold tracking-tight">{p.label}</p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-wider text-white/60">{p.meta}</p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Bottom CTA */}
      <section className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10 p-10 text-center ring-1 ring-white/5">
        <h2 className="text-3xl font-semibold tracking-tight">Make something today.</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/60">500 free coins on signup. No card required.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/studio/video" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-medium text-black hover:opacity-90">
            <Video className="h-4 w-4" /> Generate video
          </Link>
          <Link href="/studio/image" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 text-sm font-medium hover:bg-white/10">
            <ImageIcon className="h-4 w-4" /> Generate image
          </Link>
        </div>
      </section>
    </main>
  );
}
