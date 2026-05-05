import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Sparkles, User } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, faqLd, SITE, url } from "@/lib/seo";
import { AutoplayVideo } from "@/components/studio/AutoplayVideo";
import { CATEGORY_REELS } from "@/lib/studio-showcase";

export const dynamic = "force-dynamic";

const path = "/studio/character";
const title = "Character creator — Vidy";
const description = "Train a consistent character once. Reuse the same identity across every image, video, and lipsync output.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url(path) },
  openGraph: { type: "website", url: url(path), siteName: SITE.name, title, description },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const FAQ = [
  { q: "How does Character work?", a: "Train a LoRA on 5–20 images of your subject in /studio/train. Then call the LoRA from any image or video model that supports it." },
  { q: "Will identity stay consistent?", a: "Yes — that's the point. The LoRA encodes the subject so every render uses the same face, garments, or style." },
];

export default function CharacterPage() {
  return (
    <>
      <JsonLd id="char-breadcrumb" data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Studio", path: "/studio" }, { name: "Character", path }])} />
      <JsonLd id="char-faq" data={faqLd(FAQ)} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <section className="relative mt-4 mb-12 overflow-hidden rounded-[28px] border border-white/10 ring-1 ring-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[5/4] lg:aspect-auto">
              <AutoplayVideo src={CATEGORY_REELS.video[3].src} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:bg-gradient-to-r" />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <span className="inline-flex w-max items-center gap-1 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-white/70">
                <User className="h-3 w-3" /> Character
              </span>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight leading-tight sm:text-5xl">One identity. <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">Every output.</span></h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">Train a LoRA from 5–20 photos. Reuse the same character across image, video, and lipsync.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/studio/train" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-medium text-black hover:opacity-90">
                  <Sparkles className="h-4 w-4" /> Train a character
                </Link>
                <Link href="/studio/image" className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-sm font-medium hover:bg-white/10">
                  Use existing LoRA <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
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
