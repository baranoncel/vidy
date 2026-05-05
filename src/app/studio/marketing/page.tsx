import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, faqLd, SITE, url } from "@/lib/seo";
import { AutoplayVideo } from "@/components/studio/AutoplayVideo";
import { TEMPLATE_PREVIEWS, CATEGORY_REELS } from "@/lib/studio-showcase";

export const dynamic = "force-dynamic";

const path = "/studio/marketing";
const title = "Marketing studio — Vidy";
const description = "Turn product photos and screenshots into UGC promos, ad reels, and App Store preview videos. Templates that chain 5–10 frontier models.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url(path) },
  openGraph: { type: "website", url: url(path), siteName: SITE.name, title, description, images: [{ url: url("/og/studio.png"), width: 1200, height: 630, alt: "Marketing Studio" }] },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const FAQ = [
  { q: "What can the marketing studio do?", a: "UGC ads, product launch teasers, App Store preview videos, before/after transformations, real-estate walkthroughs, brand stingers, and more." },
  { q: "How long does it take?", a: "Most templates run in 1–4 minutes including upload, multi-model orchestration, and final stitching." },
  { q: "Do I need a subscription?", a: "No — top-up bundles work too. New accounts get 500 free coins to try a short template." },
];

const TEMPLATES = [
  { id: "ios-screenshot-to-ugc-promo", title: "iOS UGC promo", desc: "Phone-in-hand mockup, animated UGC scene, voiceover, music, captions." },
  { id: "trailer-from-script", title: "Script → trailer", desc: "Multi-shot keyframes, 4K animation, epic score." },
  { id: "before-after-transformation", title: "Before / after", desc: "Two stills morph cleanly with reveal copy." },
  { id: "product-360-spin", title: "Product 360°", desc: "One photo → 3D mesh → rotating turntable." },
];

export default function MarketingPage() {
  return (
    <>
      <JsonLd id="mkt-breadcrumb" data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Studio", path: "/studio" }, { name: "Marketing", path }])} />
      <JsonLd id="mkt-faq" data={faqLd(FAQ)} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <section className="relative mt-4 mb-12 overflow-hidden rounded-[28px] border border-white/10 ring-1 ring-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,1fr]">
            <div className="relative aspect-[5/4] lg:aspect-auto">
              <AutoplayVideo src={CATEGORY_REELS.video[0].src} poster={CATEGORY_REELS.video[0].poster} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent lg:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <span className="inline-flex w-max items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-white/70">
                <Sparkles className="h-3 w-3" /> Marketing studio
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight leading-tight sm:text-5xl">Ship the ad.<br /><span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">Skip the agency.</span></h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">Drop a product photo or app screenshot. The agent picks the right multi-step template and ships a finished asset in minutes.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/agent?template=ios-screenshot-to-ugc-promo" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-medium text-black hover:opacity-90">
                  <Sparkles className="h-4 w-4" /> Make a UGC promo
                </Link>
                <Link href="/studio/canvas" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-sm font-medium hover:bg-white/10">
                  All templates <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-14">
          <header className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Marketing templates</h2>
              <p className="mt-1 text-sm text-white/55">Each template chains 5–10 models into a finished asset.</p>
            </div>
            <Link href="/studio/canvas" className="hidden text-sm text-white/60 hover:text-white sm:inline-flex">All →</Link>
          </header>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((t) => {
              const p = TEMPLATE_PREVIEWS[t.id];
              return (
                <li key={t.id}>
                  <Link href={`/agent?template=${t.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 ring-1 ring-white/5 transition hover:border-white/30">
                    {p && <AutoplayVideo src={p.src} poster={p.poster} hoverOnly />}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="pointer-events-none absolute inset-3 flex flex-col">
                      <span className="inline-flex w-max items-center gap-1 rounded-full bg-amber-300 text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                        <Sparkles className="h-2.5 w-2.5" /> Template
                      </span>
                      <div className="mt-auto">
                        <p className="text-base font-semibold">{t.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-white/65">{t.desc}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.03] p-7 ring-1 ring-white/5">
          <h2 className="text-xl font-semibold tracking-tight">Frequently asked</h2>
          <ul className="mt-4 divide-y divide-white/5">
            {FAQ.map((f, i) => (
              <li key={i} className="py-3.5">
                <p className="text-sm font-medium">{f.q}</p>
                <p className="mt-1 text-sm text-white/60">{f.a}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
