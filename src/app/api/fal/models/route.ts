import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withErrors } from "@/lib/api";
import { estimateCoins, type FalUnit } from "@/lib/pricing";

export const runtime = "nodejs";
export const revalidate = 60;

export const GET = withErrors(async (req: Request) => {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") ?? undefined;

  const rows = await prisma.falModel.findMany({
    where: {
      enabled: true,
      ...(category ? { category } : {}),
    },
    orderBy: [{ sortIndex: "asc" }, { displayName: "asc" }],
  });

  // Attach a representative coin price using a default 5-second / 1MP estimate
  const enriched = rows.map((m) => ({
    slug: m.slug,
    category: m.category,
    displayName: m.displayName,
    description: m.description,
    unit: m.unit,
    unitPriceUsd: m.unitPriceUsd,
    capabilities: m.capabilities,
    features: m.features,
    badge: m.badge,
    marketingBlurb: m.marketingBlurb,
    coinsPerStandardUnit: estimateCoins(m.unit as FalUnit, m.unitPriceUsd, {}),
  }));

  return NextResponse.json({ models: enriched, count: enriched.length });
});
