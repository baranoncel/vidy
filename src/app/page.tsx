import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Wand2 } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqSection } from "@/components/seo/FaqSection";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata, faqLd, organizationLd, softwareApplicationLd } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { estimateCoins, type FalUnit } from "@/lib/pricing";
import { HomeHero } from "./home-hero";

const seo = FEATURE_SEO.home;
export const metadata: Metadata = buildMetadata(seo);

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

      <HomeHero modelCount={allModels} carouselItems={FEATURE_CAROUSEL_ITEMS} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        {featured.length > 0 && (
          <section className="mb-20">
            <header className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Featured models</h2>
                <p className="mt-2 text-sm text-gray-500">
                  {allModels.toLocaleString()} models live across video, image, audio, lipsync, upscale, 3D and more.
                </p>
              </div>
              <Link
                href="/pricing"
                className="hidden items-center gap-1 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm font-medium text-gray-900 backdrop-blur-md transition hover:bg-white sm:inline-flex"
              >
                Full catalog <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </header>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((m) => (
                <li
                  key={m.slug}
                  className="group relative overflow-hidden rounded-3xl border border-black/[0.06] bg-white/60 p-5 ring-1 ring-black/5 backdrop-blur-md transition hover:border-black/15 hover:shadow-xl hover:shadow-black/5"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">{m.displayName}</h3>
                    {m.badge && (
                      <span className="shrink-0 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  {m.description && <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-500">{m.description}</p>}
                  <div className="flex items-center justify-between border-t border-black/5 pt-3">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">{m.category}</span>
                    <span className="text-xs font-medium text-gray-900">
                      {estimateCoins(m.unit as FalUnit, m.unitPriceUsd, {}).toLocaleString()} coins
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {bundles.length > 0 && (
          <section className="mb-20">
            <header className="mb-8">
              <h2 className="text-3xl font-semibold tracking-tight">Plans</h2>
              <p className="mt-2 text-sm text-gray-500">Each subscription ships with monthly Computational Coins. Top-ups available any time.</p>
            </header>
            <ul className="grid gap-4 sm:grid-cols-3">
              {bundles.map((b) => (
                <li
                  key={b.id}
                  className={[
                    "relative overflow-hidden rounded-3xl border p-7 ring-1 backdrop-blur-md transition hover:shadow-xl hover:shadow-black/5",
                    b.badge === "popular"
                      ? "border-gray-900/20 bg-white/80 ring-gray-900/10"
                      : "border-black/[0.06] bg-white/60 ring-black/5 hover:border-black/15",
                  ].join(" ")}
                >
                  {b.badge && (
                    <span className="absolute right-5 top-5 rounded-full bg-gray-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                      {b.badge.replace("_", " ")}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold tracking-tight text-gray-900">{b.displayName}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">${(b.priceUsdCents / 100).toFixed(0)}</span>
                    <span className="text-sm text-gray-500">/mo</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700">{b.coinAmount.toLocaleString()} coins · monthly</p>
                  {b.marketingBlurb && <p className="mt-4 text-xs leading-relaxed text-gray-500">{b.marketingBlurb}</p>}
                  <Link
                    href="/pricing"
                    className="mt-6 inline-flex h-10 w-full items-center justify-center gap-1 rounded-2xl bg-gray-900 text-sm font-medium text-white transition hover:bg-black"
                  >
                    Choose {b.displayName}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white/60 p-12 text-center ring-1 ring-black/5 backdrop-blur-md">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Ready to ship a video today?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            New accounts get 500 coins (~50¢) free. No card required to try.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/agent"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 text-sm font-medium text-white transition hover:bg-black"
            >
              <Wand2 className="h-4 w-4" /> Try the agent
            </Link>
            <Link
              href="/ai-video-tools"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-black/10 bg-white/60 px-6 text-sm font-medium text-gray-900 backdrop-blur-md transition hover:bg-white"
            >
              Browse all tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <FaqSection items={seo.faq} />
    </>
  );
}
