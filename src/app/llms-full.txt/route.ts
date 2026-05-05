/**
 * llms-full.txt — long-form documentation for LLM ingestion.
 */

import { NextResponse } from "next/server";
import { FEATURE_SEO } from "@/lib/seo-config";
import { SITE } from "@/lib/seo";
import { prisma } from "@/lib/db";
import { estimateCoins, type FalUnit } from "@/lib/pricing";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const features = Object.values(FEATURE_SEO).filter((f) => f.path !== "/demo");
  const models = await prisma.falModel.findMany({ where: { enabled: true }, orderBy: [{ category: "asc" }, { sortIndex: "asc" }] }).catch(() => []);

  const lines: string[] = [];
  lines.push(`# ${SITE.name} — Full Documentation`);
  lines.push("");
  lines.push(`${SITE.description}`);
  lines.push("");
  lines.push("## Pricing");
  lines.push("");
  lines.push("Vidy uses **Computational Coins**. 1 coin = $0.001 USD. Every model's price is the underlying provider cost (fal.ai) marked up 3× and ceiled. There is no per-tool subscription — one wallet, every feature.");
  lines.push("");

  for (const f of features) {
    lines.push(`## ${f.title}`);
    lines.push("");
    lines.push(`URL: ${SITE.domain}${f.path}`);
    lines.push("");
    lines.push(f.description);
    lines.push("");
    if (f.howTo?.length) {
      lines.push("### How it works");
      f.howTo.forEach((s, i) => lines.push(`${i + 1}. **${s.name}** — ${s.text}`));
      lines.push("");
    }
    if (f.faq.length) {
      lines.push("### FAQ");
      for (const item of f.faq) lines.push(`- **${item.q}** ${item.a}`);
      lines.push("");
    }
  }

  if (models.length) {
    lines.push("## Model catalogue");
    lines.push("");
    let lastCat = "";
    for (const m of models) {
      if (m.category !== lastCat) {
        lines.push(`### ${m.category}`);
        lastCat = m.category;
      }
      const refCoins = estimateCoins(m.unit as FalUnit, m.unitPriceUsd, {});
      lines.push(`- \`${m.slug}\` — ${m.displayName}: $${m.unitPriceUsd}/${m.unit.replace("per_", "")} (≈${refCoins} coins ref)${m.description ? ` — ${m.description}` : ""}`);
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
