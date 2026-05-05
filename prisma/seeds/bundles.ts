/**
 * Seed the bundle catalog: 3 subscription tiers (primary) + 3 top-up packs
 * (extras for active subscribers).
 *
 *   pnpm db:seed:bundles
 *
 * Subscription `coinAmount` = coins granted per billing cycle.
 * Top-up `coinAmount` = coins granted once per checkout.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BUNDLES = [
  // ---------- Subscriptions (primary entry, monthly recurring) ----------
  {
    sku: "sub_starter",
    displayName: "Starter",
    coinAmount: 10_000, // per cycle
    priceUsdCents: 900,
    isSubscription: true,
    sortIndex: 1,
    marketingBlurb: "10,000 coins every month. Best for hobbyists and side projects.",
    badge: null,
  },
  {
    sku: "sub_creator",
    displayName: "Creator",
    coinAmount: 35_000,
    priceUsdCents: 2_900,
    isSubscription: true,
    sortIndex: 2,
    marketingBlurb: "35,000 coins/mo. Ideal for daily content workflows.",
    badge: "popular",
  },
  {
    sku: "sub_studio",
    displayName: "Studio",
    coinAmount: 130_000,
    priceUsdCents: 9_900,
    isSubscription: true,
    sortIndex: 3,
    marketingBlurb: "130,000 coins/mo. For agencies and high-throughput teams.",
    badge: "best_value",
  },

  // ---------- Top-up packages (subscribers only) ----------
  {
    sku: "topup_5k",
    displayName: "Top-up · 5,000 coins",
    coinAmount: 5_000,
    priceUsdCents: 500,
    isSubscription: false,
    sortIndex: 11,
    marketingBlurb: "Quick top-up when you're close to the cap.",
    badge: "topup",
  },
  {
    sku: "topup_25k",
    displayName: "Top-up · 25,000 coins",
    coinAmount: 25_000,
    priceUsdCents: 2_500,
    isSubscription: false,
    sortIndex: 12,
    marketingBlurb: "Mid-size top-up for a busy week.",
    badge: "topup",
  },
  {
    sku: "topup_100k",
    displayName: "Top-up · 100,000 coins",
    coinAmount: 100_000,
    priceUsdCents: 10_000,
    isSubscription: false,
    sortIndex: 13,
    marketingBlurb: "Large top-up for video sprints and 4K runs.",
    badge: "topup",
  },
] as const;

const PRICE_IDS: Record<string, string | undefined> = {
  sub_starter: process.env.STRIPE_PRICE_SUB_STARTER,
  sub_creator: process.env.STRIPE_PRICE_SUB_CREATOR,
  sub_studio: process.env.STRIPE_PRICE_SUB_STUDIO,
  topup_5k: process.env.STRIPE_PRICE_TOPUP_5K,
  topup_25k: process.env.STRIPE_PRICE_TOPUP_25K,
  topup_100k: process.env.STRIPE_PRICE_TOPUP_100K,
};

async function main() {
  // Disable any legacy SKUs (coins_5k, coins_25k, coins_100k, unlimited_monthly)
  await prisma.bundle.updateMany({
    where: { sku: { in: ["coins_5k", "coins_25k", "coins_100k", "unlimited_monthly"] } },
    data: { enabled: false },
  });

  for (const b of BUNDLES) {
    const stripePriceId = PRICE_IDS[b.sku] || `pending_${b.sku}`;
    await prisma.bundle.upsert({
      where: { sku: b.sku },
      update: {
        displayName: b.displayName,
        coinAmount: b.coinAmount,
        priceUsdCents: b.priceUsdCents,
        stripePriceId,
        isSubscription: b.isSubscription,
        sortIndex: b.sortIndex,
        marketingBlurb: b.marketingBlurb,
        badge: b.badge,
        enabled: true,
      },
      create: {
        sku: b.sku,
        displayName: b.displayName,
        coinAmount: b.coinAmount,
        priceUsdCents: b.priceUsdCents,
        stripePriceId,
        isSubscription: b.isSubscription,
        sortIndex: b.sortIndex,
        marketingBlurb: b.marketingBlurb,
        badge: b.badge,
        enabled: true,
      },
    });
    console.log(`upserted bundle: ${b.sku}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
