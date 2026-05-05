import Link from "next/link";
import { Image as ImageIcon, Video, Music, Box, Wand2, Zap, Layers, MicVocal, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { estimateCoins, type FalUnit } from "@/lib/pricing";

const TILES = [
  { href: "/studio/image", title: "Image", body: "FLUX Pro Ultra · Ideogram V3 · Nano Banana", icon: ImageIcon, gradient: "from-violet-500/20 to-fuchsia-500/10" },
  { href: "/studio/video", title: "Video", body: "Veo 3.1 · Kling v3 · Seedance · Wan", icon: Video, gradient: "from-blue-500/20 to-indigo-500/10" },
  { href: "/studio/audio", title: "Audio", body: "Music · Sound effects · MMAudio", icon: Music, gradient: "from-amber-500/20 to-orange-500/10" },
  { href: "/studio/voice", title: "Voice", body: "ElevenLabs · Kokoro · Voice cloning", icon: MicVocal, gradient: "from-emerald-500/20 to-teal-500/10" },
  { href: "/studio/effects", title: "Effects", body: "Pikaffects · Wan FX · Kling FX", icon: Zap, gradient: "from-rose-500/20 to-pink-500/10" },
  { href: "/studio/3d", title: "3D", body: "Hunyuan3D · TRELLIS · Multi-view", icon: Box, gradient: "from-sky-500/20 to-cyan-500/10" },
  { href: "/studio/canvas", title: "Canvas", body: "Moodboard, chain workflows, share", icon: Layers, gradient: "from-purple-500/20 to-violet-500/10" },
  { href: "/studio/realtime", title: "Realtime", body: "Sub-second image generation", icon: Wand2, gradient: "from-lime-500/20 to-emerald-500/10" },
];

export default async function StudioOverview() {
  const featured = await prisma.falModel
    .findMany({
      where: { enabled: true, badge: { in: ["premium", "hot", "new"] } },
      orderBy: [{ sortIndex: "asc" }],
      take: 8,
    })
    .catch(() => []);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      {/* Hero */}
      <header className="mt-6 mb-12 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {featured.length > 0 ? "Live now" : "Vidy Studio"}
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-balance text-5xl font-semibold tracking-tight leading-[1.05] sm:text-6xl">
          One studio.{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
            Every frontier model.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/60">
          Generate, edit, and animate with a single workspace. Image, video, audio, voice, effects, 3D — all priced in transparent coins.
        </p>
      </header>

      {/* Categories grid */}
      <section className="mb-16">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className={`group relative block aspect-[5/4] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${t.gradient} p-5 transition hover:border-white/20`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)] opacity-[0.04]" />
                <t.icon className="h-5 w-5 text-white/80" />
                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="text-lg font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-white/55">{t.body}</p>
                  <ArrowRight className="mt-3 h-4 w-4 -translate-x-1 opacity-50 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured models */}
      {featured.length > 0 && (
        <section>
          <header className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Featured</h2>
            <Link href="/pricing" className="text-sm text-white/60 hover:text-white">
              Full catalog →
            </Link>
          </header>
          <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featured.map((m) => (
              <li
                key={m.slug}
                className="group relative aspect-[4/5] w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] ring-1 ring-white/5"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/15 via-transparent to-blue-500/10 opacity-60" />
                <div className="relative flex h-full flex-col p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-white/40">{m.category}</span>
                    {m.badge && (
                      <span className="rounded-full bg-white text-black px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                        {m.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-auto text-lg font-semibold tracking-tight">{m.displayName}</h3>
                  {m.description && <p className="mt-1 line-clamp-2 text-xs text-white/55">{m.description}</p>}
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[10px] uppercase tracking-wider text-white/40">per unit</span>
                    <span className="text-xs font-medium">
                      {estimateCoins(m.unit as FalUnit, m.unitPriceUsd, {}).toLocaleString()} coins
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
