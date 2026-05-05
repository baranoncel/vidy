import "server-only";
import Stripe from "stripe";

const apiKey = process.env.STRIPE_SECRET_KEY;

export const stripe = apiKey
  ? new Stripe(apiKey, { apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion })
  : null;

export function stripeConfigured(): boolean {
  return !!stripe;
}

export function requireStripe(): Stripe {
  if (!stripe) throw new Error("STRIPE_SECRET_KEY not configured");
  return stripe;
}

export const BUNDLE_PRICE_IDS = {
  coins_5k: process.env.STRIPE_PRICE_COINS_5K,
  coins_25k: process.env.STRIPE_PRICE_COINS_25K,
  coins_100k: process.env.STRIPE_PRICE_COINS_100K,
  unlimited_monthly: process.env.STRIPE_PRICE_UNLIMITED_MONTHLY,
} as const;

export type BundleSku = keyof typeof BUNDLE_PRICE_IDS;
