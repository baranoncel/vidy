import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FeatureLayout } from "@/components/feature/FeatureLayout";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata } from "@/lib/seo";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SettingsClient } from "./settings-client";

const seo = FEATURE_SEO.settings;
export const metadata: Metadata = buildMetadata(seo);

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const recentLedger = await prisma.coinLedger.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return (
    <FeatureLayout seo={seo}>
      <SettingsClient
        user={{ name: session.user.name, email: session.user.email, plan: (session.user as { plan?: string }).plan || "free" }}
        ledger={recentLedger.map((r) => ({
          id: r.id,
          delta: r.delta,
          reason: r.reason,
          createdAt: r.createdAt.toISOString(),
          notes: r.notes,
          modelSlug: r.modelSlug,
        }))}
      />
    </FeatureLayout>
  );
}
