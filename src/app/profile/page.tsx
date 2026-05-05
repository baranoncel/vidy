import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FeatureLayout } from "@/components/feature/FeatureLayout";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata } from "@/lib/seo";
import { auth } from "@/lib/auth";
import { getCoinBalance } from "@/lib/coins";

const seo = FEATURE_SEO.profile;
export const metadata: Metadata = buildMetadata(seo);

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");
  const balance = await getCoinBalance(session.user.id);

  return (
    <FeatureLayout seo={seo}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">Account</h3>
          <p className="text-sm">{session.user.name}</p>
          <p className="text-sm text-neutral-500">{session.user.email}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">Coin balance</h3>
          <p className="text-2xl font-bold">{balance.toLocaleString()}</p>
          <p className="text-sm text-neutral-500">≈ ${(balance / 1000).toFixed(2)} USD</p>
        </div>
      </div>
    </FeatureLayout>
  );
}
