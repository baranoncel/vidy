import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireUser, withErrors, jsonError } from "@/lib/api";
import { requireStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  const body = (await req.json().catch(() => ({}))) as { sku?: string };
  const sku = body.sku;
  if (!sku || typeof sku !== "string") return jsonError(400, "Missing sku", "missing_sku");

  const bundle = await prisma.bundle.findUnique({ where: { sku } });
  if (!bundle || !bundle.enabled) return jsonError(400, "Invalid or disabled sku", "invalid_sku");
  if (!bundle.stripePriceId || bundle.stripePriceId.startsWith("pending_")) {
    return jsonError(503, "Bundle not configured in Stripe yet", "bundle_unconfigured");
  }

  // Gate top-ups: only active subscribers can buy them.
  if (!bundle.isSubscription) {
    const userPlan = await prisma.user.findUnique({ where: { id: user.id }, select: { plan: true } });
    const plan = userPlan?.plan || "free";
    if (plan === "free" || !plan.startsWith("sub_")) {
      return jsonError(403, "Top-ups are available to active subscribers only. Pick a subscription plan first.", "subscription_required");
    }
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: bundle.isSubscription ? "subscription" : "payment",
    line_items: [{ price: bundle.stripePriceId, quantity: 1 }],
    success_url: `${appUrl}/settings?checkout=success&sku=${sku}`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: { userId: user.id, sku },
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
});
