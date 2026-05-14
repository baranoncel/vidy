import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/refund",
  title: "Refund Policy",
  description:
    "Refund Policy for Vidy — refunds, cancellations and chargebacks for subscriptions and Computational Coin purchases.",
  faq: [],
});

const EFFECTIVE_DATE = "May 14, 2026";

export default function RefundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Refund &amp; Cancellation Policy</h1>
      <p className="mb-6 text-xs text-muted-foreground">
        Effective Date: {EFFECTIVE_DATE} · Last Updated: {EFFECTIVE_DATE}
      </p>

      <div className="mb-8 rounded-md border border-border bg-muted/40 p-4">
        <p>
          <strong>7-day money-back guarantee.</strong> If you&rsquo;re not satisfied with your initial
          subscription purchase, contact us within 7 days for a full refund, provided you have not
          consumed a material portion of your Computational Coins.
        </p>
      </div>

      <div className="space-y-8">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">1. Subscription Refunds</h2>
          <h3 className="font-medium">1.1 New Subscriptions</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Full refund available within 7 days of initial purchase</li>
            <li>Eligible only if usage has not consumed more than 20% of included Computational Coins</li>
            <li>Refunds processed within 5–10 business days to the original payment method</li>
            <li>Access to paid features is revoked upon refund</li>
          </ul>
          <h3 className="mt-3 font-medium">1.2 Renewal Charges</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Renewal refunds are considered case-by-case</li>
            <li>Must be requested within 48 hours of the renewal charge</li>
            <li>Unused portion may be eligible for a pro-rated refund</li>
          </ul>
          <h3 className="mt-3 font-medium">1.3 Non-Refundable Items</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Computational Coins already consumed by completed generations</li>
            <li>Partial-month usage outside the 7-day window</li>
            <li>Add-on / one-time purchases marked as final at checkout</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">2. Computational Coin Purchases</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Coins are consumed per-generation based on the model and parameters used</li>
            <li>Consumed coins are non-refundable</li>
            <li>Unused coins from a bundle may be refunded within 14 days of purchase</li>
            <li>Coins cannot be transferred between accounts</li>
            <li>Unused coins expire 12 months from the purchase date unless otherwise stated</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">3. Cancellation</h2>
          <h3 className="font-medium">3.1 How to Cancel</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Cancel anytime from the customer portal in your account settings</li>
            <li>Or email support@vidy.app from your account email</li>
            <li>Cancellation takes effect at the end of the current billing period</li>
            <li>You retain access until the end of the paid period</li>
          </ul>
          <h3 className="mt-3 font-medium">3.2 After Cancellation</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Your account reverts to the free plan</li>
            <li>Existing generations and assets remain accessible</li>
            <li>Paid-tier features become unavailable</li>
            <li>Any remaining unused coins remain valid until their expiration date</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">4. How to Request a Refund</h2>
          <ol className="list-decimal space-y-1 pl-6">
            <li>
              Email{" "}
              <a className="underline" href="mailto:support@vidy.app">
                support@vidy.app
              </a>{" "}
              from your account email
            </li>
            <li>Include the charge date, amount and (optionally) your Stripe receipt number</li>
            <li>Specify the reason — useful but not required</li>
            <li>You&rsquo;ll receive a confirmation within 24–48 hours</li>
          </ol>
          <h3 className="mt-3 font-medium">Processing Time</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Approval: 1–2 business days</li>
            <li>Processing by Stripe: 5–10 business days</li>
            <li>Posting to your bank: depends on the institution</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">5. Special Circumstances</h2>
          <h3 className="font-medium">5.1 Service Issues</h3>
          <p>If a model fails to return output through no fault of yours, we will:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Re-credit the Computational Coins spent on the failed job, or</li>
            <li>Provide a service credit / subscription extension as appropriate</li>
          </ul>
          <h3 className="mt-3 font-medium">5.2 Billing Errors</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Duplicate charges: full refund of the duplicate</li>
            <li>Incorrect amount: refund of the difference</li>
            <li>Unauthorized charges: investigation, and full refund if verified</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">6. Chargebacks</h2>
          <p>
            Please contact us before initiating a chargeback. Filing a chargeback without first
            requesting a refund may result in immediate account suspension and the loss of remaining
            Computational Coins.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">7. Updates</h2>
          <p>
            We may update this Refund Policy. Changes are reflected on this page with a new
            &ldquo;Last Updated&rdquo; date.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">8. Contact</h2>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-medium">Vidy — Support</p>
            <p>
              Email:{" "}
              <a className="underline" href="mailto:support@vidy.app">
                support@vidy.app
              </a>
            </p>
            <p>Response time: 24–48 hours</p>
            <p>Website: https://vidy.app</p>
          </div>
        </section>
      </div>
    </div>
  );
}
