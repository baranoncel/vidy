import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireUser, withErrors, jsonError } from "@/lib/api";
import { requireStripe, BUNDLE_PRICE_IDS, type BundleSku } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_SKUS = Object.keys(BUNDLE_PRICE_IDS) as BundleSku[];

export const POST = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  const body = (await req.json().catch(() => ({}))) as { sku?: string };
  const sku = body.sku as BundleSku | undefined;

  if (!sku || !VALID_SKUS.includes(sku)) {
    return jsonError(400, "Invalid sku", "invalid_sku");
  }

  const priceId = BUNDLE_PRICE_IDS[sku];
  if (!priceId) {
    return jsonError(503, "Bundle not configured", "bundle_unavailable");
  }

  const stripe = requireStripe();

  let customerId = user.stripeCustomerId as string | undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }

  const isSubscription = sku === "unlimited_monthly";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: isSubscription ? "subscription" : "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/settings?checkout=success&sku=${sku}`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: { userId: user.id, sku },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
});
