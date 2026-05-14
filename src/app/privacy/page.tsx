import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "Privacy Policy for Vidy — how we collect, use, store and protect your data when you use our AI video studio.",
  faq: [],
});

const EFFECTIVE_DATE = "May 14, 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-sm leading-relaxed">
      <h1 className="mb-2 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mb-10 text-xs text-muted-foreground">
        Effective Date: {EFFECTIVE_DATE} · Last Updated: {EFFECTIVE_DATE}
      </p>

      <div className="space-y-8">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">1. Introduction</h2>
          <p>
            Vidy (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the Vidy AI video
            studio (the &ldquo;Service&rdquo;). This Privacy Policy explains what we collect, how we
            use it, and the choices you have.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">2. Information We Collect</h2>
          <h3 className="font-medium">2.1 Personal Information</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>Email address</li>
            <li>Name (optional)</li>
            <li>Profile picture (if provided via OAuth)</li>
            <li>Payment information (processed securely by Stripe — we do not store card numbers)</li>
            <li>Files you upload (images, audio, video) for generation, editing, dubbing or lipsync</li>
          </ul>
          <h3 className="mt-3 font-medium">2.2 Usage Data</h3>
          <ul className="list-disc space-y-1 pl-6">
            <li>IP address and approximate location</li>
            <li>Browser and device information</li>
            <li>Pages visited, features used, and time spent</li>
            <li>Job metadata: prompts, model selected, parameters, and coin usage</li>
            <li>Error and diagnostic logs</li>
          </ul>
          <h3 className="mt-3 font-medium">2.3 Cookies and Tracking</h3>
          <p>
            We use cookies and similar technologies to keep you signed in, remember preferences, and
            measure aggregate product analytics.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">3. How We Use Your Information</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>To provide and operate the Service</li>
            <li>To process generations and deliver outputs</li>
            <li>To manage your account, balance and subscription</li>
            <li>To process payments through Stripe</li>
            <li>To send transactional emails and, with your consent, product updates</li>
            <li>To improve product quality and the orchestration agent</li>
            <li>To detect and prevent fraud, abuse and policy violations</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">4. Sharing and Disclosure</h2>
          <p>
            We do not sell your personal information. We share data only with the following categories
            of recipients:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Service providers:</strong> Stripe (payments), Fal.ai and other model providers
              (AI inference), Cloudflare or AWS S3 (storage and delivery), Resend (transactional
              email), Upstash (rate limiting), and authentication providers.
            </li>
            <li>
              <strong>Legal:</strong> when required by law, subpoena, or to protect our rights and
              users.
            </li>
            <li>
              <strong>Business transfers:</strong> in connection with a merger, acquisition or asset
              sale.
            </li>
            <li>
              <strong>Consent:</strong> with your explicit consent.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">5. AI Model Processing</h2>
          <p>
            To generate or transform media, your prompts, uploaded files and parameters are sent to
            third-party model providers (including Fal.ai and partner inference endpoints). These
            providers process the data solely to return the requested output and operate under their
            own terms and privacy policies. We do not authorize providers to use your inputs to train
            base models where opt-out is available, and where supported we forward the appropriate
            no-training signals.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">6. Data Security</h2>
          <p>
            We implement technical and organizational measures to protect your data, including:
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>TLS encryption for data in transit</li>
            <li>Encryption at rest for stored objects</li>
            <li>Scoped credentials and least-privilege access</li>
            <li>PCI-compliant payment processing via Stripe</li>
            <li>Regular dependency and security updates</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">7. Your Rights and Choices</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              <strong>Access:</strong> request a copy of your personal data
            </li>
            <li>
              <strong>Correction:</strong> request correction of inaccurate data
            </li>
            <li>
              <strong>Deletion:</strong> request deletion of your account and associated data
            </li>
            <li>
              <strong>Portability:</strong> request your data in a portable format
            </li>
            <li>
              <strong>Opt-out:</strong> unsubscribe from marketing communications
            </li>
            <li>
              <strong>Restriction:</strong> request restriction of processing
            </li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a className="underline" href="mailto:privacy@vidy.app">
              privacy@vidy.app
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">8. Data Retention</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>Account data: retained until account deletion</li>
            <li>Generated outputs and source uploads: retained for the lifetime of your account, or until you delete them</li>
            <li>Payment records: retained as required for tax and accounting compliance (typically 7 years)</li>
            <li>Logs: retained for up to 90 days for operational and security purposes</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">9. Children&rsquo;s Privacy</h2>
          <p>
            The Service is not intended for individuals under 18. We do not knowingly collect data
            from children under 18. If you believe a minor has provided us data, contact us and we
            will delete it.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">10. International Transfers</h2>
          <p>
            Your information may be processed in countries other than your own. Where required, we
            rely on Standard Contractual Clauses and other appropriate safeguards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">11. California Privacy Rights (CCPA)</h2>
          <p>California residents have additional rights, including:</p>
          <ul className="list-disc space-y-1 pl-6">
            <li>Right to know what personal information is collected</li>
            <li>Right to know if personal information is sold or disclosed (we do not sell)</li>
            <li>Right to delete personal information</li>
            <li>Right to non-discrimination for exercising privacy rights</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">12. Updates to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will revise the &ldquo;Last
            Updated&rdquo; date and, for material changes, notify you via email or in-product
            notification.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">13. Contact</h2>
          <div className="rounded-md border border-border bg-card p-4">
            <p className="font-medium">Vidy</p>
            <p>
              Email:{" "}
              <a className="underline" href="mailto:privacy@vidy.app">
                privacy@vidy.app
              </a>
            </p>
            <p>Website: https://vidy.app</p>
          </div>
          <p className="text-xs text-muted-foreground">
            See also our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/refund" className="underline">
              Refund Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
