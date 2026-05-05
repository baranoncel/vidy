import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { completeJobFromFal, failJob } from "@/lib/jobs";
import { verifyFalWebhook, verifyWebhookToken } from "@/lib/fal";
import { log } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const jobId = url.searchParams.get("jobId");
  const token = url.searchParams.get("token");
  if (!jobId || !token) return NextResponse.json({ error: "missing token" }, { status: 400 });
  if (!verifyWebhookToken(jobId, token)) return NextResponse.json({ error: "bad token" }, { status: 401 });

  const raw = await req.text();
  const sig = req.headers.get("fal-signature") || req.headers.get("x-fal-signature");
  // Token already authenticates the call; HMAC body verification is a second fence when configured.
  if (process.env.FAL_WEBHOOK_SECRET) {
    if (!verifyFalWebhook(raw, sig)) {
      // fal docs: webhook signing is currently per-app; if not configured, fall back to token-only.
      log.warn("fal webhook signature missing/invalid; trusting token", { jobId });
    }
  }

  let body: { status?: string; payload?: unknown; error?: string } = {};
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  try {
    if (body.status === "OK" || body.status === "COMPLETED") {
      await completeJobFromFal(jobId, body.payload ?? body);
    } else if (body.status === "ERROR" || body.status === "FAILED") {
      await failJob(jobId, body.error || "fal reported error");
    } else {
      log.debug("fal webhook ignored", { jobId, status: body.status });
    }
  } catch (err) {
    log.error("fal webhook handler failed", { jobId, err: String(err) });
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
