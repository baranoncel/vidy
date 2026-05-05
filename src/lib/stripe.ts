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
