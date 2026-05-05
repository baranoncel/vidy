import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, Coins, Layers, Sparkles, Wand2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/seo/FaqSection";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata, faqLd, organizationLd, softwareApplicationLd } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { estimateCoins, type FalUnit } from "@/lib/pricing";
import { HomeHero } from "./home-hero";

const seo = FEATURE_SEO.home;
export const metadata: Metadata = buildMetadata(seo);

const PILLARS = [
  { icon: Bot, title: "One agent, many models", body: "Tell Vidy what you want — it picks the right models and chains them in a transparent DAG you approve before debit." },
  { icon: Layers, title: "200+ models", body: "Veo 3.1, Kling v3 & 4K, Seedance 2, Wan, Pika, Luma, Flux, Ideogram, ElevenLabs, Topaz, Sync Lipsync — all behind one wallet." },
  { icon: Coins, title: "Computational Coins", body: "1 coin = $0.001. Provider cost × 3 markup, ceiled. No tool subscriptions, no surprises." },
  { icon: Zap, title: "Live progress", body: "SSE streams every step. R2 stores every output. Failed jobs auto-refund." },
];

const FEATURE_CAROUSEL_ITEMS = [
  { id: "agent", title: "Agentic UGC promos", description: "Upload an iOS screenshot — get a 15s UGC ad with voiceover, lipsync, music and captions.", image: "/vidy.svg", buttonText: "Try the agent" },
  { id: "veo", title: "Veo 3.1 cinematic", description: "Cinematic text-to-video with native audio. The premium baseline.", image: "/vidy.svg", buttonText: "Generate" },
  { id: "kling", title: "Kling v3 4K", description: "Native 4K image-to-video without an upscale pass.", image: "/vidy.svg", buttonText: "Animate" },
  { id: "lipsync", title: "Sync Lipsync 2.0", description: "Frame-accurate lipsync for any voice + face combination.", image: "/vidy.svg", buttonText: "Lipsync" },
  { id: "topaz", title: "Topaz video upscale", description: "Bring 480p clips to 4K with Topaz's broadcast-grade engine.", image: "/vidy.svg", buttonText: "Upscale" },
  { id: "voice", title: "ElevenLabs + Kokoro", description: "Pro voiceover in 30+ languages. Voice cloning included.", image: "/vidy.svg", buttonText: "Generate voice" },
];

export default async function Home() {
  const [featured, allModels, bundles] = await Promise.all([
    prisma.falModel.findMany({
      where: { enabled: true, badge: { in: ["premium", "hot", "new"] } },
      orderBy: [{ sortIndex: "asc" }],
      take: 6,
    }).catch(() => []),
    prisma.falModel.count({ where: { enabled: true } }).catch(() => 0),
    prisma.bundle.findMany({ where: { enabled: true, isSubscription: true }, orderBy: { sortIndex: "asc" } }).catch(() => []),
  ]);

  return (
    <>
      <JsonLd id="home-software" data={softwareApplicationLd()} />
      <JsonLd id="home-org" data={organizationLd()} />
      <JsonLd id="home-faq" data={faqLd(seo.faq)} />

      {/* HERO with ClaudeChatInput-driven prompt */}
      <HomeHero modelCount={allModels} carouselItems={FEATURE_CAROUSEL_ITEMS} />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-4">
        {/* Pillars */}
        <section className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-neutral-200 bg-white/40 p-5 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/40">
              <p.icon className="mb-3 h-5 w-5 text-violet-500" />
              <h3 className="mb-1 text-sm font-semibold">{p.title}</h3>
              <p className="text-sm text-neutral-500">{p.body}</p>
            </div>
          ))}
        </section>

        {/* Featured models from DB */}
        {featured.length > 0 && (
          <section className="mb-16">
            <header className="mb-6 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Featured models</h2>
                <p className="mt-1 text-sm text-neutral-500">{allModels.toLocaleString()} models live across video, image, audio, lipsync, upscale, 3D and more.</p>
              </div>
              <Link href="/pricing" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400">
                See full catalog →
              </Link>
            </header>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((m) => (
                <li key={m.slug} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{m.displayName}</h3>
                    {m.badge && (
                      <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-violet-600 dark:text-violet-400">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <p className="mb-3 line-clamp-2 text-xs text-neutral-500">{m.description}</p>
                  <p className="font-mono text-xs text-neutral-400">{m.slug.replace(/^fal-ai\//, "")}</p>
                  <p className="mt-2 text-sm">
                    {estimateCoins(m.unit as FalUnit, m.unitPriceUsd, {}).toLocaleString()} coins ref
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Subscription tiers preview */}
        {bundles.length > 0 && (
          <section className="mb-16">
            <header className="mb-6 flex items-end justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Subscriptions</h2>
                <p className="mt-1 text-sm text-neutral-500">Each plan ships with monthly Computational Coins. Top up any time.</p>
              </div>
              <Link href="/pricing" className="text-sm font-medium text-violet-600 hover:underline dark:text-violet-400">
                Compare plans →
              </Link>
            </header>
            <ul className="grid gap-4 sm:grid-cols-3">
              {bundles.map((b) => (
                <li key={b.id} className={`relative rounded-2xl border p-6 ${b.badge === "popular" ? "border-violet-500/40 bg-gradient-to-b from-violet-500/5 to-transparent" : "border-neutral-200 dark:border-neutral-800"}`}>
                  {b.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white dark:bg-white dark:text-neutral-900">
                      {b.badge.replace("_", " ")}
                    </span>
                  )}
                  <h3 className="mb-1 text-xl font-semibold">{b.displayName}</h3>
                  <div className="mb-3 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${(b.priceUsdCents / 100).toFixed(0)}</span>
                    <span className="text-sm text-neutral-500">/mo</span>
                  </div>
                  <p className="mb-3 text-sm text-neutral-500">{b.coinAmount.toLocaleString()} coins / month</p>
                  {b.marketingBlurb && <p className="text-xs text-neutral-500">{b.marketingBlurb}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Big CTA */}
        <section className="rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-500/5 to-transparent p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready to ship a video today?</h2>
          <p className="mx-auto mt-2 max-w-xl text-neutral-500">
            New accounts get 500 coins (~50¢) free. No card required to try.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/agent" className="gap-2">
                <Wand2 className="h-4 w-4" /> Try the agent
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/ai-video-tools" className="gap-2">
                Browse all tools <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <FaqSection items={seo.faq} />
    </>
  );
}
