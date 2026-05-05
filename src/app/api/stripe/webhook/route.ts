import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { postLedger } from "@/lib/coins";
import { log } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function POST(req: NextRequest) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    log.error("Stripe webhook signature failed", { err: String(err) });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, event.id);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice, event.id);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription, event.id);
        break;
      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge, event.id);
        break;
      default:
        log.debug("Unhandled stripe event", { type: event.type });
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    log.error("Stripe webhook handler failed", { err: String(err), type: event.type });
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session, eventId: string) {
  const userId = session.metadata?.userId;
  const sku = session.metadata?.sku;
  if (!userId || !sku) return;

  // Idempotency
  const existing = await prisma.paymentEvent.findUnique({ where: { stripeEventId: eventId } });
  if (existing) return;

  await prisma.paymentEvent.create({
    data: { userId, stripeEventId: eventId, kind: "checkout_completed", data: session as unknown as object },
  });

  // For one-shot bundles, grant coins now. For subscriptions, wait for invoice.payment_succeeded.
  if (session.mode === "payment") {
    const bundle = await prisma.bundle.findUnique({ where: { sku } });
    if (bundle) {
      await postLedger({
        userId,
        delta: bundle.coinAmount,
        reason: "purchase",
        stripeEventId: eventId,
        notes: `Bundle ${bundle.sku}`,
      });
      log.info("coins granted via bundle", { userId, sku, coins: bundle.coinAmount });
    }
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice, eventId: string) {
  const customerId = invoice.customer as string;
  if (!customerId) return;
  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
  if (!user) return;
  // Idempotency
  const existing = await prisma.paymentEvent.findUnique({ where: { stripeEventId: eventId } });
  if (existing) return;

  await prisma.paymentEvent.create({
    data: { userId: user.id, stripeEventId: eventId, kind: "invoice_payment_succeeded", data: invoice as unknown as object },
  });

  // Subscription invoice → grant tier's monthly coin allowance + set plan to the sub sku.
  // Stripe API v2025+ moved subscription off the top-level Invoice; fall back across versions.
  const subId =
    (invoice as unknown as { subscription?: string | null }).subscription ||
    (invoice as unknown as { parent?: { subscription_details?: { subscription?: string } } }).parent?.subscription_details
      ?.subscription;
  if (!subId) return;

  // Find the sub bundle from one of the invoice line items' price ids.
  const lines = (invoice as unknown as { lines?: { data?: Array<{ price?: { id?: string } }> } }).lines?.data ?? [];
  const priceId = lines.map((l) => l.price?.id).find(Boolean);
  if (!priceId) {
    log.warn("invoice payment without price id", { userId: user.id, eventId });
    return;
  }
  const bundle = await prisma.bundle.findFirst({
    where: { stripePriceId: priceId, isSubscription: true, enabled: true },
  });
  if (!bundle) {
    log.warn("invoice price did not match any subscription bundle", { userId: user.id, priceId });
    return;
  }

  await prisma.user.update({ where: { id: user.id }, data: { plan: bundle.sku } });
  await postLedger({
    userId: user.id,
    delta: bundle.coinAmount,
    reason: "purchase",
    stripeEventId: eventId,
    notes: `Subscription cycle ${bundle.sku} → ${bundle.coinAmount} coins`,
  });
  log.info("subscription coins granted", { userId: user.id, sku: bundle.sku, coins: bundle.coinAmount });
}

async function handleSubscriptionCancelled(sub: Stripe.Subscription, eventId: string) {
  const customerId = sub.customer as string;
  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
  if (!user) return;
  await prisma.user.update({ where: { id: user.id }, data: { plan: "free" } });
  await prisma.paymentEvent.create({
    data: { userId: user.id, stripeEventId: eventId, kind: "subscription_cancelled", data: sub as unknown as object },
  });
  log.info("subscription cancelled, plan reset to free", { userId: user.id });
  // Coins already granted in past cycles are kept (user paid for them);
  // just no new monthly grants until they resubscribe.
}

async function handleChargeRefunded(charge: Stripe.Charge, eventId: string) {
  const customerId = charge.customer as string | null;
  if (!customerId) return;
  const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
  if (!user) return;
  const existing = await prisma.paymentEvent.findUnique({ where: { stripeEventId: eventId } });
  if (existing) return;
  await prisma.paymentEvent.create({
    data: { userId: user.id, stripeEventId: eventId, kind: "charge_refunded", data: charge as unknown as object },
  });
  // Find the original purchase ledger row keyed off the original payment intent.
  // Simpler: post a negative purchase row for the refunded amount mapped to coins.
  const refundUsd = (charge.amount_refunded || 0) / 100;
  const coins = Math.ceil(refundUsd * 1000); // refund full $→coins back
  if (coins > 0) {
    await postLedger({ userId: user.id, delta: -coins, reason: "refund", stripeEventId: eventId, notes: `Charge refund $${refundUsd.toFixed(2)}` });
  }
}
