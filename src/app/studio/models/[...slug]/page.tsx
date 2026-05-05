import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, faqLd, SITE, url, type FaqItem } from "@/lib/seo";
import { CATEGORY_REELS } from "@/lib/studio-showcase";
import { AutoplayVideo } from "@/components/studio/AutoplayVideo";
import { modelStudioRoute, slugFromPathSegments, modelPathFromSlug, priceLabel, unitDisplay } from "@/lib/studio-helpers";

export const dynamic = "force-dynamic";

type Params = { slug: string[] };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const fullSlug = slugFromPathSegments(slug);
  const m = await prisma.falModel.findUnique({ where: { slug: fullSlug } }).catch(() => null);
  if (!m) return { title: "Model not found · Vidy Studio" };
  const path = modelPathFromSlug(m.slug);
  const title = `${m.displayName} — Vidy Studio`;
  const description = m.description || `Generate with ${m.displayName} on Vidy Studio. ${unitDisplay(m.unit)}, transparent coin pricing.`;
  return {
    title,
    description,
    alternates: { canonical: url(path) },
    openGraph: { type: "website", url: url(path), siteName: SITE.name, title, description, images: [{ url: url("/og/studio.png"), width: 1200, height: 630, alt: m.displayName }] },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export default async function ModelPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const fullSlug = slugFromPathSegments(slug);
  const m = await prisma.falModel.findUnique({ where: { slug: fullSlug } }).catch(() => null);
  if (!m) notFound();

  const siblings = await prisma.falModel
    .findMany({
      where: { enabled: true, category: m.category, NOT: { slug: m.slug } },
      orderBy: [{ sortIndex: "asc" }],
      take: 6,
    })
    .catch(() => []);

  const reel = CATEGORY_REELS[m.category];
  const showcase = reel ? reel[Math.abs(hash(m.slug)) % reel.length] : null;
  const studioRoute = modelStudioRoute(m.category);
  const path = modelPathFromSlug(m.slug);
  const { coins, unit: unitLabel } = priceLabel(m.unit, m.unitPriceUsd);

  const features = (m.features ?? []) as string[];
  const caps = (m.capabilities ?? {}) as Record<string, unknown>;

  // Per-model FAQ derived from real capability metadata
  const faq: FaqItem[] = [];
  faq.push({
    q: `What is ${m.displayName}?`,
    a: m.description || `${m.displayName} is a ${m.category} model in the Vidy catalogue.`,
  });
  faq.push({
    q: `How is ${m.displayName} priced?`,
    a: `${coins.toLocaleString()} coins ${unitLabel}. 1 coin = $0.001 USD. New accounts get 500 free coins.`,
  });
  if (caps.maxResolution) faq.push({ q: "What resolution does it produce?", a: `Up to ${String(caps.maxResolution)}.` });
  if (caps.hasAudio) faq.push({ q: "Does it produce native audio?", a: "Yes — synchronised audio is generated alongside the video." });
  if (features.includes("lora") || caps.supportsLora) faq.push({ q: "Does it support LoRAs?", a: "Yes — train a custom LoRA in /studio/train and reference it from this model." });

  // SoftwareApplication structured data — directly indexable
  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: m.displayName,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description: m.description ?? undefined,
    url: url(path),
    offers: { "@type": "Offer", priceCurrency: "USD", price: m.unitPriceUsd },
    aggregateRating: undefined,
  };

  return (
    <>
      <JsonLd id="model-breadcrumb" data={breadcrumbLd([
        { name: "Home", path: "/" },
        { name: "Studio", path: "/studio" },
        { name: "Models", path: "/studio/models" },
        { name: m.displayName, path },
      ])} />
      <JsonLd id="model-software" data={softwareLd} />
      <JsonLd id="model-faq" data={faqLd(faq)} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <nav className="mt-4 mb-6 flex items-center gap-1 text-xs text-white/40">
          <Link href="/studio" className="hover:text-white">Studio</Link>
          <span>·</span>
          <Link href="/studio/models" className="hover:text-white">Models</Link>
          <span>·</span>
          <span className="text-white/70">{m.displayName}</span>
        </nav>

        {/* Hero */}
        <section className="relative mb-10 overflow-hidden rounded-[28px] border border-white/10 ring-1 ring-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Visual */}
            <div className="relative aspect-[5/4] lg:aspect-auto lg:min-h-[420px]">
              {showcase ? (
                <AutoplayVideo src={showcase.src} poster={showcase.poster} />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-blue-500/15" />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:bg-gradient-to-r" />
            </div>
            {/* Detail */}
            <div className="flex flex-col justify-center p-7 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/55">
                  {m.category}
                </span>
                {m.badge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-300 text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                    <Sparkles className="h-2.5 w-2.5" />
                    {m.badge}
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{m.displayName}</h1>
              {m.description && <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">{m.description}</p>}

              <dl className="mt-6 grid grid-cols-2 gap-3">
                <Stat label="Price" value={`${coins.toLocaleString()} coins`} sub={unitLabel} />
                <Stat label="USD" value={`$${m.unitPriceUsd}`} sub={unitLabel} />
                {typeof caps.maxResolution === "string" && <Stat label="Max res" value={caps.maxResolution} />}
                {typeof caps.hasAudio === "boolean" && caps.hasAudio && <Stat label="Audio" value="Native" />}
              </dl>

              {features.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {features.map((f) => (
                    <span key={f} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/65">
                      {f}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`${studioRoute}?model=${encodeURIComponent(m.slug)}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-medium text-black hover:opacity-90"
                >
                  <Sparkles className="h-4 w-4" /> Try {m.displayName}
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 text-sm font-medium hover:bg-white/10"
                >
                  Pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities + FAQ */}
        <section className="mb-12 grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 ring-1 ring-white/5">
            <h2 className="text-xl font-semibold tracking-tight">Frequently asked</h2>
            <ul className="mt-4 divide-y divide-white/5">
              {faq.map((f, i) => (
                <li key={i} className="py-3.5">
                  <p className="text-sm font-medium">{f.q}</p>
                  <p className="mt-1 text-sm text-white/60">{f.a}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 ring-1 ring-white/5">
            <h2 className="text-xl font-semibold tracking-tight">Capabilities</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              {Object.entries(caps).slice(0, 8).map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-3">
                  <dt className="text-white/55">{prettyKey(k)}</dt>
                  <dd className="text-right text-white/85">{prettyValue(v)}</dd>
                </div>
              ))}
              {Object.keys(caps).length === 0 && <p className="text-sm text-white/40">No capability metadata.</p>}
            </dl>
          </div>
        </section>

        {/* Siblings */}
        {siblings.length > 0 && (
          <section>
            <header className="mb-5 flex items-end justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">More {m.category} models</h2>
              <Link href="/studio/models" className="hidden items-center gap-1 text-sm text-white/60 hover:text-white sm:inline-flex">
                See all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </header>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={modelPathFromSlug(s.slug)}
                    className="group block rounded-3xl border border-white/10 bg-white/[0.03] p-5 ring-1 ring-white/5 transition hover:border-white/30"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold">{s.displayName}</h3>
                      {s.badge && (
                        <span className="rounded-full bg-amber-300 text-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">{s.badge}</span>
                      )}
                    </div>
                    {s.description && <p className="mt-2 line-clamp-2 text-xs text-white/55">{s.description}</p>}
                    <p className="mt-3 text-[11px] text-white/40">{priceLabel(s.unit, s.unitPriceUsd).coins.toLocaleString()} coins {unitDisplay(s.unit)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <dt className="text-[10px] uppercase tracking-wider text-white/40">{label}</dt>
      <dd className="mt-1 text-base font-semibold text-white">{value}</dd>
      {sub && <p className="text-[11px] text-white/45">{sub}</p>}
    </div>
  );
}

function prettyKey(k: string) {
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()).trim();
}

function prettyValue(v: unknown): string {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (Array.isArray(v)) return v.join(", ");
  if (v == null) return "—";
  return String(v);
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
