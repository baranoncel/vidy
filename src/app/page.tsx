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

const seo = FEATURE_SEO.home;
export const metadata: Metadata = buildMetadata(seo);

const PILLARS = [
  { icon: Bot, title: "One agent, many models", body: "Tell Vidy what you want — it picks the right models and chains them in a transparent DAG you approve before debit." },
  { icon: Layers, title: "200+ models", body: "Veo 3.1, Kling v3 & 4K, Seedance 2, Wan, Pika, Luma, Flux, Ideogram, ElevenLabs, Topaz, Sync Lipsync — all behind one wallet." },
  { icon: Coins, title: "Computational Coins", body: "1 coin = $0.001. Provider cost × 3 markup, ceiled. No tool subscriptions, no surprises." },
  { icon: Zap, title: "Live progress", body: "SSE streams every step. R2 stores every output. Failed jobs auto-refund." },
];

export default async function Home() {
  const featured = await prisma.falModel.findMany({
    where: { enabled: true, badge: { in: ["premium", "hot", "new"] } },
    orderBy: [{ sortIndex: "asc" }],
    take: 6,
  }).catch(() => []);

  return (
    <>
      <JsonLd id="home-software" data={softwareApplicationLd()} />
      <JsonLd id="home-org" data={organizationLd()} />
      <JsonLd id="home-faq" data={faqLd(seo.faq)} />

      <main className="mx-auto max-w-6xl px-4 py-16">
        <header className="mb-16 text-center">
          <span className="mb-4 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-600 dark:text-violet-400">
            <Sparkles className="h-3 w-3" />
            Agentic AI Video Studio
          </span>
          <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Generate, edit, dub and animate video with one agent.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-500">
            {seo.description}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/agent" className="gap-2">
                <Wand2 className="h-4 w-4" />
                Try the agent
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing" className="gap-2">
                <Coins className="h-4 w-4" />
                See coin pricing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
              <p.icon className="mb-3 h-5 w-5 text-violet-500" />
              <h3 className="mb-1 text-sm font-semibold">{p.title}</h3>
              <p className="text-sm text-neutral-500">{p.body}</p>
            </div>
          ))}
        </section>

        {featured.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Featured models</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((m) => (
                <li
                  key={m.slug}
                  className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
                >
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

        <section className="rounded-3xl border border-violet-500/30 bg-gradient-to-b from-violet-500/5 to-transparent p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready to ship a video today?</h2>
          <p className="mx-auto mt-2 max-w-xl text-neutral-500">
            New accounts get 500 coins (~50¢) free. Top up any time. Cancel any subscription with one click.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/register">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/ai-video-tools">Browse all tools</Link>
            </Button>
          </div>
        </section>
      </main>

      <FaqSection items={seo.faq} />
    </>
  );
}
