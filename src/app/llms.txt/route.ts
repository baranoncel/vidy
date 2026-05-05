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
