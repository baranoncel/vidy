import "server-only";
import { fal } from "@fal-ai/client";
import crypto from "node:crypto";

const FAL_KEY = process.env.FAL_KEY || process.env.FAL_API_KEY;

if (FAL_KEY) {
  fal.config({ credentials: FAL_KEY });
}

export function falConfigured(): boolean {
  return !!FAL_KEY;
}

export type FalSubmitOptions = {
  modelSlug: string;
  input: Record<string, unknown>;
  webhookUrl?: string;
};

export type FalSubmitResult = {
  requestId: string;
};

/**
 * Submit a job to fal's queue API. Returns a request_id we can use to poll
 * status / receive the webhook callback.
 */
export async function submitFalJob(opts: FalSubmitOptions): Promise<FalSubmitResult> {
  if (!falConfigured()) {
    throw new Error("FAL_KEY not configured");
  }
  const { request_id } = await fal.queue.submit(opts.modelSlug, {
    input: opts.input as Record<string, unknown>,
    webhookUrl: opts.webhookUrl,
  });
  return { requestId: request_id };
}

export async function getFalStatus(modelSlug: string, requestId: string) {
  return fal.queue.status(modelSlug, { requestId, logs: false });
}

export async function getFalResult<T = unknown>(modelSlug: string, requestId: string): Promise<T> {
  const result = await fal.queue.result(modelSlug, { requestId });
  return result as T;
}

/**
 * Submit + wait synchronously. Use only for small/fast models inside the
 * agent executor when latency is acceptable; prefer queue+webhook for video.
 */
export async function runFalSync<T = unknown>(modelSlug: string, input: Record<string, unknown>): Promise<T> {
  if (!falConfigured()) throw new Error("FAL_KEY not configured");
  const result = await fal.subscribe(modelSlug, { input, logs: false });
  return result as T;
}

/**
 * Verify the HMAC signature on a fal queue webhook callback. fal posts the raw
 * body; we hash it with the shared secret and compare to the signature header.
 */
export function verifyFalWebhook(rawBody: string, signature: string | null): boolean {
  const secret = process.env.FAL_WEBHOOK_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production"; // permit in dev
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

/**
 * Resolve the most useful URL out of a fal model output payload.
 * Different models use different shapes; we look at the common ones.
 */
export function extractOutputUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  if (typeof p.video === "object" && p.video && typeof (p.video as Record<string, unknown>).url === "string") {
    return (p.video as Record<string, string>).url;
  }
  if (typeof p.audio === "object" && p.audio && typeof (p.audio as Record<string, unknown>).url === "string") {
    return (p.audio as Record<string, string>).url;
  }
  if (typeof p.image === "object" && p.image && typeof (p.image as Record<string, unknown>).url === "string") {
    return (p.image as Record<string, string>).url;
  }
  if (Array.isArray(p.images) && p.images.length > 0) {
    const first = p.images[0] as Record<string, unknown>;
    if (typeof first?.url === "string") return first.url;
  }
  if (typeof p.url === "string") return p.url;
  if (Array.isArray(p.frames) && p.frames.length > 0) {
    const f = p.frames[0] as Record<string, unknown>;
    if (typeof f?.url === "string") return f.url;
  }
  return null;
}

export function buildWebhookUrl(jobId: string): string {
  const base = process.env.FAL_WEBHOOK_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const secret = process.env.FAL_WEBHOOK_SECRET || "dev";
  const token = crypto.createHmac("sha256", secret).update(jobId).digest("hex").slice(0, 32);
  return `${base.replace(/\/$/, "")}/api/fal/webhook?jobId=${jobId}&token=${token}`;
}

export function verifyWebhookToken(jobId: string, token: string): boolean {
  const secret = process.env.FAL_WEBHOOK_SECRET || "dev";
  const expected = crypto.createHmac("sha256", secret).update(jobId).digest("hex").slice(0, 32);
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
  } catch {
    return false;
  }
}
