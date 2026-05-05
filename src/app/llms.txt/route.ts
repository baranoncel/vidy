/**
 * llms.txt — discoverability manifest for LLM training and retrieval.
 * Spec: https://llmstxt.org/
 */

import { NextResponse } from "next/server";
import { FEATURE_SEO } from "@/lib/seo-config";
import { STUDIO_SEO } from "@/lib/studio-seo";
import { SITE } from "@/lib/seo";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const features = Object.values(FEATURE_SEO).filter((f) => f.path !== "/demo");

  const lines: string[] = [];
  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(`> ${SITE.description}`);
  lines.push("");
  lines.push("## Features");
  lines.push("");
  for (const f of features) {
    lines.push(`- [${f.title}](${SITE.domain}${f.path}): ${f.description}`);
  }
  lines.push("");
  lines.push("## Vidy Studio");
  lines.push("");
  lines.push(`- [Vidy Studio](${SITE.domain}/studio): One workspace for image, video, audio, voice, effects, 3D, and agent templates.`);
  for (const s of Object.values(STUDIO_SEO)) {
    lines.push(`- [${s.title}](${SITE.domain}${s.path}): ${s.description}`);
  }
  // Tool & use-case landings
  lines.push(`- [Upscaler](${SITE.domain}/studio/upscale): 4K upscaling for images and video.`);
  lines.push(`- [Generative editor](${SITE.domain}/studio/edit): Edit images and video with natural language.`);
  lines.push(`- [Lipsync](${SITE.domain}/studio/lipsync): Sync any voice to any face.`);
  lines.push(`- [Dubbing](${SITE.domain}/studio/dubbing): Translate and dub video into 30+ languages.`);
  lines.push(`- [Captions](${SITE.domain}/studio/captions): Auto-captions with word-level timing.`);
  lines.push(`- [Clips](${SITE.domain}/studio/clips): Long-form video to viral shorts.`);
  lines.push(`- [Train](${SITE.domain}/studio/train): Fine-tune a custom LoRA.`);
  lines.push(`- [Marketing studio](${SITE.domain}/studio/marketing): UGC, ad reels, App Store preview videos.`);
  lines.push(`- [Cinema studio](${SITE.domain}/studio/cinema): Trailers, scene breakdowns, 4K cinematic video.`);
  lines.push(`- [Character](${SITE.domain}/studio/character): Train a consistent character once, reuse everywhere.`);
  lines.push(`- [Model catalogue](${SITE.domain}/studio/models): Searchable index of every model in Vidy.`);
  lines.push(`- [Explore](${SITE.domain}/studio/explore): Live community feed of recent generations.`);
  lines.push("");
  lines.push("## FAQ");
  lines.push("");
  for (const f of features) {
    if (!f.faq.length) continue;
    lines.push(`### ${f.title}`);
    for (const item of f.faq) {
      lines.push(`- **${item.q}** ${item.a}`);
    }
    lines.push("");
  }

  return new NextResponse(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
