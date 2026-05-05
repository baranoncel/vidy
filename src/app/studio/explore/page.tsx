import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbLd, SITE, url } from "@/lib/seo";
import { AutoplayVideo } from "@/components/studio/AutoplayVideo";
import { HERO_REEL } from "@/lib/studio-showcase";
import { Sparkles, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const path = "/studio/explore";
const title = "Explore — Vidy Studio";
const description = "A curated stream of public Vidy generations across image, video, audio, and effects. Re-prompt any output to make it yours.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url(path) },
  openGraph: { type: "website", url: url(path), siteName: SITE.name, title, description },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

export default async function ExplorePage() {
  // Pull recent public successful jobs (with output url) — newest first.
  const jobs = await prisma.job
    .findMany({
      where: { status: "completed", outputUrl: { not: null } },
      orderBy: { completedAt: "desc" },
      take: 30,
      select: { id: true, feature: true, modelSlug: true, outputUrl: true, inputJson: true, completedAt: true },
    })
    .catch(() => []);

  type Tile = { id: string; src: string; meta: string; prompt: string };
  const tiles: Tile[] = jobs.flatMap((j): Tile[] => {
    const url = j.outputUrl ?? "";
    if (!url) return [];
    const inp = j.inputJson as Record<string, unknown>;
    const prompt = (inp?.prompt as string) || (inp?.text as string) || j.feature;
    return [{ id: j.id, src: url, meta: `${j.feature} · ${j.modelSlug.replace(/^fal-ai\//, "").split("/")[0]}`, prompt }];
  });

  // Fall back to curated reel when DB empty
  const fallback: Tile[] = HERO_REEL.map((c) => ({ id: c.id, src: c.src, meta: c.meta ?? "", prompt: c.label }));
  const grid = tiles.length > 0 ? tiles : fallback;

  return (
    <>
      <JsonLd id="explore-breadcrumb" data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Studio", path: "/studio" }, { name: "Explore", path }])} />

      <main className="mx-auto max-w-6xl px-4 pb-24">
        <header className="mt-6 mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
            <Sparkles className="h-3 w-3" />
            Live community feed
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Explore</h1>
          <p className="mt-2 max-w-xl text-sm text-white/55">Recent generations from across the studio. Click any to remix.</p>
        </header>

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {grid.map((t) => (
            <li key={t.id}>
              <Link
                href={`/studio/video?prompt=${encodeURIComponent(t.prompt)}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 ring-1 ring-white/5 transition hover:border-white/30"
              >
                {/(\.mp4|\.webm)$/i.test(t.src) ? (
                  <AutoplayVideo src={t.src} hoverOnly />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.src} alt={t.prompt} className="h-full w-full object-cover" loading="lazy" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-x-3 bottom-3">
                  <p className="line-clamp-2 text-[11px] font-semibold leading-tight">{t.prompt}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-white/55">{t.meta}</p>
                </div>
                <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/40 p-1.5 backdrop-blur-md opacity-0 transition group-hover:opacity-100">
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
