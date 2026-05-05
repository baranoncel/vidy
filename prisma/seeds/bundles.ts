/**
 * Seed the four Stripe bundles. Run after creating the corresponding Stripe
 * Products/Prices and setting STRIPE_PRICE_* env vars.
 *
 *   pnpm db:seed:bundles
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BUNDLES = [
  {
    sku: "coins_5k",
    displayName: "Starter",
    coinAmount: 5_000,
    priceUsdCents: 500,
    isSubscription: false,
    sortIndex: 1,
    marketingBlurb: "5,000 Computational Coins — try Vidy on a few clips.",
    badge: null,
  },
  {
    sku: "coins_25k",
    displayName: "Creator",
    coinAmount: 25_000,
    priceUsdCents: 2_500,
    isSubscription: false,
    sortIndex: 2,
    marketingBlurb: "25,000 coins. Enough for a TikTok-week of premium clips.",
    badge: "popular",
  },
  {
    sku: "coins_100k",
    displayName: "Studio",
    coinAmount: 100_000,
    priceUsdCents: 10_000,
    isSubscription: false,
    sortIndex: 3,
    marketingBlurb: "100,000 coins. Run heavy 4K and Veo workloads at the best per-coin price.",
    badge: "best_value",
  },
  {
    sku: "unlimited_monthly",
    displayName: "Pro Unlimited",
    coinAmount: 1_000_000_000,
    priceUsdCents: 3_000,
    isSubscription: true,
    sortIndex: 4,
    marketingBlurb: "Soft-unlimited monthly access at fair-use rates. Cancel anytime.",
    badge: "new",
  },
] as const;

const PRICE_IDS: Record<string, string | undefined> = {
  coins_5k: process.env.STRIPE_PRICE_COINS_5K,
  coins_25k: process.env.STRIPE_PRICE_COINS_25K,
  coins_100k: process.env.STRIPE_PRICE_COINS_100K,
  unlimited_monthly: process.env.STRIPE_PRICE_UNLIMITED_MONTHLY,
};

async function main() {
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
