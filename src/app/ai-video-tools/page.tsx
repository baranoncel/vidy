import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeatureLayout } from "@/components/feature/FeatureLayout";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata } from "@/lib/seo";

const seo = FEATURE_SEO["ai-video-tools"];
export const metadata: Metadata = buildMetadata(seo);

const TOOLS: { path: string; key: keyof typeof FEATURE_SEO; emoji: string }[] = [
  { path: "/generate", key: "generate", emoji: "✨" },
  { path: "/image", key: "image", emoji: "🖼️" },
  { path: "/video", key: "video", emoji: "🎬" },
  { path: "/ugc-video", key: "ugc-video", emoji: "📱" },
  { path: "/agent", key: "agent", emoji: "🤖" },
  { path: "/lipsync", key: "lipsync", emoji: "👄" },
  { path: "/upscale", key: "upscale", emoji: "🔍" },
  { path: "/enhance", key: "enhance", emoji: "✨" },
  { path: "/tts", key: "tts", emoji: "🗣️" },
  { path: "/audio", key: "audio", emoji: "🎵" },
  { path: "/dubbing", key: "dubbing", emoji: "🌍" },
  { path: "/captions", key: "captions", emoji: "📝" },
  { path: "/clips", key: "clips", emoji: "✂️" },
  { path: "/stories", key: "stories", emoji: "📖" },
  { path: "/3d", key: "3d", emoji: "🧊" },
  { path: "/effects", key: "effects", emoji: "💥" },
  { path: "/realtime", key: "realtime", emoji: "⚡" },
  { path: "/style", key: "style", emoji: "🎨" },
  { path: "/train", key: "train", emoji: "🧠" },
  { path: "/edit", key: "edit", emoji: "🎞️" },
];

export default function Page() {
  return (
    <FeatureLayout seo={seo}>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => {
          const f = FEATURE_SEO[t.key];
          return (
            <li key={t.path}>
              <Link
                href={t.path}
                className="group block rounded-xl border border-neutral-200 p-4 transition hover:border-violet-500 dark:border-neutral-800"
              >
                <div className="mb-2 text-2xl">{t.emoji}</div>
                <h3 className="mb-1 flex items-center justify-between text-sm font-semibold">
                  {f.title}
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </h3>
                <p className="line-clamp-2 text-xs text-neutral-500">{f.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </FeatureLayout>
  );
}
