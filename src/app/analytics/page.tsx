import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FeatureLayout } from "@/components/feature/FeatureLayout";
import { FEATURE_SEO } from "@/lib/seo-config";
import { buildMetadata } from "@/lib/seo";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const seo = FEATURE_SEO.analytics;
export const metadata: Metadata = buildMetadata(seo);

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const [byFeature, byStatus, totals] = await Promise.all([
    prisma.job.groupBy({
      by: ["feature"],
      where: { userId: session.user.id },
      _count: { _all: true },
      _sum: { finalCoins: true, estCoins: true },
    }),
    prisma.job.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: { _all: true },
    }),
    prisma.coinLedger.aggregate({
      where: { userId: session.user.id },
      _sum: { delta: true },
    }),
  ]);

  const balance = totals._sum.delta ?? 0;
  const totalJobs = byStatus.reduce((acc, r) => acc + r._count._all, 0);

  return (
    <FeatureLayout seo={seo}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Coin balance" value={balance.toLocaleString()} sub={`≈ $${(balance / 1000).toFixed(2)}`} />
        <Stat label="Total jobs" value={totalJobs.toString()} />
        <Stat
          label="Completed"
          value={(byStatus.find((r) => r.status === "completed")?._count._all ?? 0).toString()}
          sub={`${byStatus.find((r) => r.status === "failed")?._count._all ?? 0} failed`}
        />
      </div>

      <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-neutral-500">By feature</h3>
      <table className="w-full overflow-hidden rounded-xl border border-neutral-200 text-sm dark:border-neutral-800">
        <thead className="bg-neutral-50 dark:bg-neutral-900">
          <tr>
            <th className="p-3 text-left">Feature</th>
            <th className="p-3 text-right">Runs</th>
            <th className="p-3 text-right">Coins spent</th>
          </tr>
        </thead>
        <tbody>
          {byFeature.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-neutral-500">
                No usage yet.
              </td>
            </tr>
          )}
          {byFeature.map((r) => (
            <tr key={r.feature} className="border-t border-neutral-200 dark:border-neutral-800">
              <td className="p-3 font-medium">{r.feature}</td>
              <td className="p-3 text-right">{r._count._all}</td>
              <td className="p-3 text-right">{(r._sum.finalCoins ?? r._sum.estCoins ?? 0).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </FeatureLayout>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">
      <p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </div>
  );
}
