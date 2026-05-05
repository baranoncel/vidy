import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { enforceLimit, jsonError, requireUser, withErrors } from "@/lib/api";
import { submitJob } from "@/lib/jobs";
import { isValidFeature } from "@/lib/feature-models";
import { InsufficientCoinsError } from "@/lib/coins";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrors(async (req: NextRequest, { params }: { params: Promise<{ name: string }> }) => {
  const { name } = await params;
  if (!isValidFeature(name)) return jsonError(400, "Invalid feature", "invalid_feature");

  const user = await requireUser(req);
  // Heavier limit for video/training features.
  const limiter = ["video", "generate", "ugc-video", "lipsync", "upscale", "stories", "train"].includes(name) ? "expensive" : "jobs";
  await enforceLimit(req, limiter, user.id);

  const body = await req.json().catch(() => ({}));

  try {
    const result = await submitJob({
      userId: user.id,
      feature: name,
      modelSlug: typeof body.modelSlug === "string" ? body.modelSlug : undefined,
      input: (body.input ?? body) as Record<string, unknown>,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof InsufficientCoinsError) {
      return jsonError(402, err.message, "insufficient_coins", { required: err.required, balance: err.balance });
    }
    return jsonError(400, err instanceof Error ? err.message : "Submit failed", "submit_failed");
  }
});
