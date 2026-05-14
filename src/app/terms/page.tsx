import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/terms",
  title: "Terms of Service",
  description:
    "Terms of Service for Vidy — read the terms and conditions for using our AI video generation, editing, dubbing, lipsync and upscaling tools.",
  faq: [],
});

const EFFECTIVE_DATE = "May 14, 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mb-10 text-xs text-muted-foreground">
        Effective Date: {EFFECTIVE_DATE} · Last Updated: {EFFECTIVE_DATE}
      </p>

      <div className="space-y-8">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Vidy (the &ldquo;Service&rdquo;), you agree to be bound by these Terms of
            Service (&ldquo;Terms&rdquo;). If you do not agree, do not use the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">2. Description of Service</h2>
          <p>Vidy is an AI-powered video studio that allows users to:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Generate, edit, dub, lipsync, upscale and animate video using 200+ AI models</li>
            <li>Run an orchestrating agent that selects models for each step</li>
            <li>Manage assets, jobs, and computational credit balances</li>
            <li>Purchase credit bundles or subscriptions for enhanced features</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">3. User Accounts</h2>
          <h3 className="font-medium">3.1 Account Creation</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly update any changes to your information</li>
            <li>Accept responsibility for all activity under your account</li>
          </ul>
          <h3 className="mt-3 font-medium">3.2 Age Requirement</h3>
          <p>
            You must be at least 18 years old to use this Service. By using the Service you represent
            that you meet this age requirement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">4. Plans, Credits and Payments</h2>
          <h3 className="font-medium">4.1 Plans Available</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Free Plan:</strong> limited Computational Coins for trial use
            </li>
            <li>
              <strong>Credit Bundles:</strong> one-time purchases of Computational Coins
            </li>
            <li>
              <strong>Subscription Plans:</strong> recurring access with included coins
            </li>
          </ul>
          <h3 className="mt-3 font-medium">4.2 Payment Terms</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>All payments are processed through Stripe</li>
            <li>Subscriptions auto-renew unless cancelled</li>
            <li>Prices are in USD unless otherwise stated</li>
            <li>Applicable taxes will be added to stated prices</li>
          </ul>
          <h3 className="mt-3 font-medium">4.3 Computational Coins</h3>
          <p>
            Generations consume Computational Coins based on the model and parameters used. Coin
            estimates are shown before each job; final usage may vary based on what the underlying
            model actually executes.
          </p>
          <h3 className="mt-3 font-medium">4.4 Refunds</h3>
          <p>
            See our{" "}
            <Link href="/refund" className="underline">
              Refund Policy
            </Link>{" "}
            for refund and cancellation details.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">5. Acceptable Use</h2>
          <p>You agree NOT to use the Service to:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Generate illegal, harmful, defamatory or non-consensual sexual content</li>
            <li>Generate content that depicts real, identifiable individuals without consent</li>
            <li>Generate CSAM or any content sexualizing minors</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on intellectual property or publicity rights</li>
            <li>Generate hate, harassment, or content inciting violence</li>
            <li>Create deepfakes intended to deceive, defraud, or impersonate</li>
            <li>Attempt to bypass usage limits, rate limits or security measures</li>
            <li>Use automated systems or scrapers without prior written permission</li>
            <li>Upload malware or interfere with the Service</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
          <h3 className="font-medium">6.1 Service Content</h3>
          <p>
            All content on the Service, except user-generated content, is owned by Vidy and protected
            by intellectual property laws.
          </p>
          <h3 className="mt-3 font-medium">6.2 Generated Output</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>You retain rights to outputs you generate, subject to underlying model terms</li>
            <li>You grant us a license to host, process, and display your outputs to operate the Service</li>
            <li>Outputs may resemble other outputs due to AI model behavior; uniqueness is not guaranteed</li>
            <li>Some third-party models impose additional restrictions on commercial use; you are responsible for complying with them</li>
          </ul>
          <h3 className="mt-3 font-medium">6.3 User Content</h3>
          <p>
            By uploading content you grant us a worldwide, non-exclusive, royalty-free license to use,
            process, store and display such content solely for the purpose of providing the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">7. Privacy</h2>
          <p>
            Your use of the Service is subject to our{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">8. Disclaimers and Limitations</h2>
          <h3 className="font-medium">8.1 Service Availability</h3>
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
            warranties of any kind. We do not guarantee uninterrupted or error-free operation.
          </p>
          <h3 className="mt-3 font-medium">8.2 Third-Party Models</h3>
          <p>
            The Service routes requests to third-party AI models (including but not limited to those
            provided by Fal.ai and partners). Their output, availability, and content policies are
            outside of our direct control.
          </p>
          <h3 className="mt-3 font-medium">8.3 Limitation of Liability</h3>
          <p>
            To the maximum extent permitted by law, Vidy shall not be liable for any indirect,
            incidental, special, consequential or punitive damages resulting from your use of or
            inability to use the Service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">9. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Vidy, its officers, directors, employees and
            agents from any claims, damages, losses or expenses arising from your use of the Service or
            violation of these Terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">10. Termination</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>You may terminate your account at any time through account settings</li>
            <li>We may suspend or terminate your account for Terms violations</li>
            <li>Upon termination your right to use the Service ceases immediately</li>
            <li>Certain provisions of these Terms survive termination</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">11. Modifications</h2>
          <p>
            We reserve the right to modify these Terms at any time. Material changes will be
            announced via email or in-product notification. Continued use after changes constitutes
            acceptance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the State of Delaware, United States, without
            regard to its conflict of laws principles. Any dispute shall be resolved in the state or
            federal courts located in Delaware.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">13. Severability</h2>
          <p>
            If any provision of these Terms is found unenforceable, the remaining provisions shall
            remain in full force and effect.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">14. Contact</h2>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-medium">Vidy</p>
            <p>
              Email:{" "}
              <a className="underline" href="mailto:legal@vidy.app">
                legal@vidy.app
              </a>
            </p>
            <p>Website: https://vidy.app</p>
          </div>
        </section>
      </div>
    </div>
  );
}
