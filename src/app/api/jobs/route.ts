import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { enforceLimit, jsonError, requireUser, withErrors } from "@/lib/api";
import { prisma } from "@/lib/db";
import { submitJob } from "@/lib/jobs";
import { isValidFeature } from "@/lib/feature-models";
import { InsufficientCoinsError } from "@/lib/coins";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  await enforceLimit(req, "jobs", user.id);

  const body = await req.json().catch(() => ({}));
  const feature = String(body.feature || "");
  if (!isValidFeature(feature)) return jsonError(400, "Invalid feature", "invalid_feature");

  try {
    const result = await submitJob({
      userId: user.id,
      feature,
      modelSlug: typeof body.modelSlug === "string" ? body.modelSlug : undefined,
      input: (body.input ?? {}) as Record<string, unknown>,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof InsufficientCoinsError) {
      return jsonError(402, err.message, "insufficient_coins", { required: err.required, balance: err.balance });
    }
    return jsonError(400, err instanceof Error ? err.message : "Submit failed", "submit_failed");
  }
});

export const GET = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  const url = new URL(req.url);
  const feature = url.searchParams.get("feature") || undefined;
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);

  const rows = await prisma.job.findMany({
    where: { userId: user.id, ...(feature ? { feature } : {}) },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      feature: true,
      modelSlug: true,
      status: true,
      outputUrl: true,
      estCoins: true,
      finalCoins: true,
      errorMessage: true,
      createdAt: true,
      completedAt: true,
    },
  });
  return NextResponse.json({ jobs: rows });
});
