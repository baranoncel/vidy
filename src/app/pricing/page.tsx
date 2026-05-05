import { prisma } from "@/lib/db";
import { estimateCoins, type FalUnit } from "@/lib/pricing";
import { PricingClient } from "./pricing-client";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function PricingPage() {
  const [models, bundles] = await Promise.all([
    prisma.falModel.findMany({
      where: { enabled: true },
      orderBy: [{ category: "asc" }, { sortIndex: "asc" }],
    }),
    prisma.bundle.findMany({ where: { enabled: true }, orderBy: { sortIndex: "asc" } }),
  ]);

  const enrichedModels = models.map((m) => ({
    slug: m.slug,
    category: m.category,
    displayName: m.displayName,
    description: m.description,
    unit: m.unit,
    unitPriceUsd: m.unitPriceUsd,
    badge: m.badge,
    marketingBlurb: m.marketingBlurb,
    features: m.features,
    coinsRef: estimateCoins(m.unit as FalUnit, m.unitPriceUsd, {}),
  }));

  return <PricingClient models={enrichedModels} bundles={bundles} />;
}
