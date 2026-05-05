"use client";

import { useMemo, useState } from "react";
import { Coins, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

type Bundle = {
  id: string;
  sku: string;
  displayName: string;
  coinAmount: number;
  priceUsdCents: number;
  isSubscription: boolean;
  marketingBlurb: string | null;
  badge: string | null;
};

type Model = {
  slug: string;
  category: string;
  displayName: string;
  description: string | null;
  unit: string;
  unitPriceUsd: number;
  badge: string | null;
  marketingBlurb: string | null;
  features: string[];
  coinsRef: number;
};

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "video", label: "Video" },
  { id: "image", label: "Image" },
  { id: "lipsync", label: "Lipsync" },
  { id: "upscale", label: "Upscale" },
  { id: "tts", label: "Voice" },
  { id: "audio", label: "Audio" },
  { id: "stt", label: "Speech-to-Text" },
  { id: "3d", label: "3D" },
  { id: "avatar", label: "Avatar" },
  { id: "effects", label: "Effects" },
  { id: "training", label: "Training" },
  { id: "vision", label: "Vision" },
];

const UNIT_LABEL: Record<string, string> = {
  per_second: "second",
  per_video_second: "video-second",
  per_audio_second: "audio-second",
  per_video: "video",
  per_image: "image",
  per_megapixel: "megapixel",
  per_1k_chars: "1 000 chars",
  per_minute: "minute",
  per_5_second_video: "5-sec video",
  per_4_second_video: "4-sec video",
  per_10_seconds: "10 seconds",
  per_template: "template",
  per_voice: "voice",
  per_mask: "mask",
  per_request: "request",
  per_generation: "generation",
  per_compute_second: "compute-second",
  per_step: "training step",
  per_training_run: "training run",
  per_unit: "unit",
};

export function PricingClient({ models, bundles }: { models: Model[]; bundles: Bundle[] }) {
  const [category, setCategory] = useState<string>("all");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (category === "all") return models;
    return models.filter((m) => m.category === category);
  }, [category, models]);

  async function buyBundle(sku: string) {
    setBusy(sku);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Computational Coins</h1>
        <p className="mx-auto max-w-2xl text-lg text-neutral-500">
          One transparent currency for every model. Top up once and spend across 200+ providers — Veo, Kling, Seedance, Flux,
          ElevenLabs, Topaz and more. 1 coin = $0.001.
        </p>
      </header>

      {/* Bundles */}
      <section className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {bundles.map((b) => {
          const Icon = b.sku === "coins_5k" ? Coins : b.sku === "coins_25k" ? Sparkles : b.sku === "coins_100k" ? Zap : Crown;
          return (
            <div
              key={b.id}
              className={`relative rounded-2xl border p-6 transition ${
                b.badge === "popular"
                  ? "border-violet-500/40 bg-gradient-to-b from-violet-500/5 to-transparent"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              {b.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white dark:bg-white dark:text-neutral-900">
                  {b.badge.replace("_", " ")}
                </span>
              )}
              <Icon className="mb-3 h-5 w-5 text-violet-500" />
              <h3 className="mb-1 text-xl font-semibold">{b.displayName}</h3>
              <div className="mb-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold">${(b.priceUsdCents / 100).toFixed(0)}</span>
                {b.isSubscription && <span className="text-sm text-neutral-500">/mo</span>}
              </div>
              <p className="mb-4 text-sm text-neutral-500">
                {b.isSubscription ? "Soft-unlimited fair use" : `${b.coinAmount.toLocaleString()} coins`}
              </p>
              {b.marketingBlurb && <p className="mb-5 text-xs text-neutral-500">{b.marketingBlurb}</p>}
              <Button
                onClick={() => buyBundle(b.sku)}
                disabled={busy === b.sku}
                className="w-full"
                variant={b.badge === "popular" ? "default" : "outline"}
              >
                {busy === b.sku ? "Redirecting…" : b.isSubscription ? "Subscribe" : "Buy"}
              </Button>
            </div>
          );
        })}
      </section>

      {/* Catalog */}
      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold">Live model catalog</h2>
          <p className="text-sm text-neutral-500">{models.length} models · prices update with provider rates</p>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                category === c.id
                  ? "border-violet-500 bg-violet-500 text-white"
                  : "border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <li
              key={m.slug}
              className="rounded-xl border border-neutral-200 p-4 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{m.displayName}</h3>
                {m.badge && (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                      m.badge === "premium"
                        ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                        : m.badge === "fast"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : m.badge === "new"
                            ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {m.badge}
                  </span>
                )}
              </div>
              {m.description && (
                <p className="mb-3 line-clamp-2 text-xs text-neutral-500">{m.description}</p>
              )}
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-mono text-neutral-400">{m.slug.replace(/^fal-ai\//, "")}</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between text-sm">
                <span className="text-neutral-500">per {UNIT_LABEL[m.unit] || m.unit}</span>
                <span className="font-semibold">{m.coinsRef.toLocaleString()} coins</span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
