import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireUser, withErrors, jsonError } from "@/lib/api";
import { requireStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  if (!user.stripeCustomerId) return jsonError(400, "No Stripe customer", "no_customer");
  const stripe = requireStripe();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId as string,
    return_url: `${appUrl}/settings`,
  });
  return NextResponse.json({ url: portal.url });
});
