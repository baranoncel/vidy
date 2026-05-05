import "server-only";
import { prisma } from "./db";
import { debitCoinsOrThrow, refundCoins, reconcileCoins, postLedger } from "./coins";
import { estimateCoins, estimateFalUsd, type FalUnit, falUsdToCoins } from "./pricing";
import { buildWebhookUrl, extractOutputUrl, getFalResult, getFalStatus, submitFalJob } from "./fal";
import { downloadToBuffer, inferExtFromContentType, jobOutputKey, publicUrlFor, putToR2 } from "./r2";
import { FEATURE_MODELS, type FeatureKey, isValidFeature } from "./feature-models";
import { log } from "./logger";

export type SubmitJobInput = {
  userId: string;
  feature: FeatureKey;
  modelSlug?: string;
  input: Record<string, unknown>;
  agentRunId?: string;
  agentStepId?: string;
};

export type SubmitJobResult = {
  jobId: string;
  estCoins: number;
  modelSlug: string;
  status: "queued" | "running";
};

export async function submitJob(payload: SubmitJobInput): Promise<SubmitJobResult> {
  if (!isValidFeature(payload.feature)) throw new Error(`Unknown feature: ${payload.feature}`);
  const cfg = FEATURE_MODELS[payload.feature];
  const slug = payload.modelSlug || cfg.defaultModel;

  const model = await prisma.falModel.findUnique({ where: { slug } });
  if (!model) throw new Error(`Model not found: ${slug}`);
  if (!model.enabled) throw new Error(`Model disabled: ${slug}`);

  const params = cfg.estimateHint(payload.input);
  const estUsd = estimateFalUsd(model.unit as FalUnit, model.unitPriceUsd, params);
  const estCoins = falUsdToCoins(estUsd);

  // Validate the fal input — throws on missing fields.
  const falInput = cfg.buildFalInput(payload.input);

  // Create the job + debit atomically.
  const job = await prisma.$transaction(async (tx) => {
    const created = await tx.job.create({
      data: {
        userId: payload.userId,
        feature: payload.feature,
        modelSlug: slug,
        status: "queued",
        inputJson: payload.input as object,
        estCoins,
        estFalUsd: estUsd,
        agentRunId: payload.agentRunId,
        agentStepId: payload.agentStepId,
      },
    });
    return created;
  });

  try {
    await debitCoinsOrThrow(payload.userId, estCoins, {
      jobId: job.id,
      agentRunId: payload.agentRunId,
      modelSlug: slug,
      falCostUsd: estUsd,
    });
  } catch (err) {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: "failed", errorMessage: String(err), completedAt: new Date() },
    });
    throw err;
  }

  // Submit to fal queue with our webhook URL.
  try {
    const { requestId } = await submitFalJob({
      modelSlug: slug,
      input: falInput,
      webhookUrl: buildWebhookUrl(job.id),
    });
    const updated = await prisma.job.update({
      where: { id: job.id },
      data: { status: "running", falRequestId: requestId, startedAt: new Date() },
    });
    log.info("job submitted", { jobId: job.id, slug, requestId, estCoins });
    return { jobId: updated.id, estCoins, modelSlug: slug, status: "running" };
  } catch (err) {
    await refundCoins(payload.userId, estCoins, { jobId: job.id, modelSlug: slug, notes: "submit failed" });
    await prisma.job.update({
      where: { id: job.id },
      data: { status: "failed", errorMessage: String(err), completedAt: new Date() },
    });
    throw err;
  }
}

/**
 * Mark a job complete using a fal queue result payload. Stores output to R2,
 * reconciles coins if fal reported actual usage, and emits a stream event.
 */
export async function completeJobFromFal(jobId: string, payload: unknown) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error(`Job ${jobId} not found`);
  if (job.status === "completed") return job;

  const sourceUrl = extractOutputUrl(payload);
  if (!sourceUrl) {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "failed", errorMessage: "fal returned no output url", completedAt: new Date(), outputJson: payload as object },
    });
    await refundCoins(job.userId, job.estCoins, { jobId, modelSlug: job.modelSlug, notes: "no output url" });
    return null;
  }

  let storedUrl: string;
  try {
    const { buffer, contentType } = await downloadToBuffer(sourceUrl);
    const ext = inferExtFromContentType(contentType);
    const key = jobOutputKey(job.userId, job.id, ext);
    await putToR2(key, buffer, contentType);
    storedUrl = publicUrlFor(key);
  } catch (err) {
    log.warn("R2 store failed; using fal CDN url directly", { jobId, err: String(err) });
    storedUrl = sourceUrl;
  }

  // Reconcile if fal echoed an actual cost we can read.
  let finalCoins = job.estCoins;
  let finalUsd = job.estFalUsd ?? null;
  const echoedUsd = readFalCost(payload);
  if (echoedUsd && echoedUsd > 0) {
    finalUsd = echoedUsd;
    finalCoins = falUsdToCoins(echoedUsd);
    if (finalCoins !== job.estCoins) {
      await reconcileCoins(job.userId, job.estCoins, finalCoins, {
        jobId,
        modelSlug: job.modelSlug,
        falCostUsd: echoedUsd,
      });
    }
  }

  const updated = await prisma.job.update({
    where: { id: jobId },
    data: {
      status: "completed",
      outputUrl: storedUrl,
      outputJson: payload as object,
      finalCoins,
      finalFalUsd: finalUsd,
      completedAt: new Date(),
    },
  });
  log.info("job completed", { jobId, slug: job.modelSlug, finalCoins });
  return updated;
}

export async function failJob(jobId: string, message: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) return;
  if (job.status === "completed" || job.status === "failed") return;
  await prisma.job.update({
    where: { id: jobId },
    data: { status: "failed", errorMessage: message.slice(0, 1000), completedAt: new Date() },
  });
  await refundCoins(job.userId, job.estCoins, { jobId, modelSlug: job.modelSlug, notes: message.slice(0, 200) });
}

function readFalCost(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  if (typeof p.cost === "number") return p.cost;
  if (p.metrics && typeof p.metrics === "object" && typeof (p.metrics as Record<string, unknown>).cost === "number") {
    return (p.metrics as Record<string, number>).cost;
  }
  return null;
}

/**
 * Polling fallback: query fal queue status if our webhook never fires.
 * Called by the SSE stream loop and by /api/jobs/[id] GET on cold reads.
 */
export async function refreshJobStatus(jobId: string) {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || !job.falRequestId) return job;
  if (job.status === "completed" || job.status === "failed") return job;

  try {
    const status = await getFalStatus(job.modelSlug, job.falRequestId);
    const s = (status as { status?: string }).status;
    if (s === "COMPLETED") {
      const result = await getFalResult(job.modelSlug, job.falRequestId);
      return await completeJobFromFal(jobId, result);
    }
    if (s === "FAILED" || s === "CANCELLED") {
      await failJob(jobId, `fal status ${s}`);
      return prisma.job.findUnique({ where: { id: jobId } });
    }
  } catch (err) {
    log.warn("refreshJobStatus error", { jobId, err: String(err) });
  }
  return job;
}

export const _internal = { extractOutputUrl, estimateCoins };
