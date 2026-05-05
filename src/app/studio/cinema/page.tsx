import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Film, Sparkles } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, faqLd, SITE, url } from "@/lib/seo";
import { AutoplayVideo } from "@/components/studio/AutoplayVideo";
import { CATEGORY_REELS, TEMPLATE_PREVIEWS } from "@/lib/studio-showcase";

export const dynamic = "force-dynamic";

const path = "/studio/cinema";
const title = "Cinema studio — Vidy";
const description = "Cinematic AI video — trailers, scene breakdowns, multi-shot stories. Veo 3.1 native audio, Kling v3 4K, Seedance 2 director controls.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url(path) },
  openGraph: { type: "website", url: url(path), siteName: SITE.name, title, description },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const FAQ = [
  { q: "Which model is best for cinematic 4K?", a: "Kling v3 4K outputs native 4K without an upscale pass. For 1080p with native audio, Veo 3.1 is the leader." },
  { q: "Can I do multi-shot stories?", a: "Yes — Seedance 2 supports multi-shot natively, or use the trailer-from-script Canvas template." },
];

export default function CinemaPage() {
  return (
    <>
      <JsonLd id="cinema-breadcrumb" data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Studio", path: "/studio" }, { name: "Cinema", path }])} />
      <JsonLd id="cinema-faq" data={faqLd(FAQ)} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <section className="relative mt-4 mb-12 overflow-hidden rounded-[28px] border border-white/10 ring-1 ring-white/5">
          <div className="absolute inset-0">
            <AutoplayVideo src={CATEGORY_REELS.video[0].src} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/95 via-black/60 to-black/30" />
          </div>
          <div className="relative grid grid-cols-1 p-8 sm:p-12 lg:p-16">
            <span className="inline-flex w-max items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-white/70">
              <Film className="h-3 w-3" /> Cinema studio
            </span>
            <h1 className="mt-4 max-w-2xl text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">Direct your scene with the world's best video models.</h1>
            <p className="mt-4 max-w-xl text-sm text-white/70">Veo 3.1, Kling v3 4K, Seedance 2 director, Wan Pro, Luma Ray 2 — every cinematic AI model at your fingertips.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/studio/video" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-medium text-black hover:opacity-90">
                Start a scene <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href="/agent?template=trailer-from-script" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-sm font-medium hover:bg-white/10">
                <Sparkles className="h-4 w-4" /> Script → trailer
              </Link>
            </div>
          </div>
        </section>

        {/* Featured cinematic templates */}
        <section className="mb-14">
          <header className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight">Cinematic templates</h2>
            <p className="mt-1 text-sm text-white/55">Multi-step pipelines tuned for narrative content.</p>
          </header>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(["trailer-from-script", "kids-story-animation", "music-video-from-lyrics"] as const).map((id) => {
              const p = TEMPLATE_PREVIEWS[id];
              return (
                <li key={id}>
                  <Link href={`/agent?template=${id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 ring-1 ring-white/5 transition hover:border-white/30">
                    {p && <AutoplayVideo src={p.src} poster={p.poster} hoverOnly />}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="pointer-events-none absolute inset-3 flex flex-col">
                      <span className="inline-flex w-max items-center gap-1 rounded-full bg-amber-300 text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                        <Sparkles className="h-2.5 w-2.5" /> Template
                      </span>
                      <div className="mt-auto">
                        <p className="text-base font-semibold">{p?.label}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-wider text-white/60">{p?.meta}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 ring-1 ring-white/5">
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
