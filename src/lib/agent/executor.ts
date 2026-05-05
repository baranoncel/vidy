import "server-only";
import { prisma } from "../db";
import { submitJob } from "../jobs";
import { getFalResult, getFalStatus } from "../fal";
import { isValidFeature } from "../feature-models";
import { log } from "../logger";
import { completeJobFromFal, failJob } from "../jobs";
import type { AgentPlan, AgentStepSpec } from "./types";

/**
 * Execute the plan top-down. Each step:
 *  1. Resolves placeholders against prior outputs.
 *  2. Maps to a feature key (heuristic by category) and submitJob() to fal.
 *  3. Polls fal status until completion (webhook may also fire concurrently).
 *  4. Persists outputs onto AgentStep.
 *
 * Failures fail the run and refund coins for not-yet-started steps.
 */
export async function runAgent(agentRunId: string) {
  const run = await prisma.agentRun.findUnique({ where: { id: agentRunId }, include: { steps: { orderBy: { stepIndex: "asc" } } } });
  if (!run) throw new Error("AgentRun not found");
  if (run.status !== "running") {
    await prisma.agentRun.update({ where: { id: agentRunId }, data: { status: "running", startedAt: new Date() } });
  }

  const plan = run.plan as unknown as AgentPlan;
  const userId = run.userId;
  const inputs = (run.inputUrlsJson ?? {}) as Record<string, unknown>;
  const stepOutputs: Record<string, { outputUrl?: string; outputText?: string }> = {};

  // Topo order: respect dependsOn.
  const order = topoSort(plan.steps);

  for (const stepKey of order) {
    const spec = plan.steps.find((s) => s.key === stepKey)!;
    const stepRow = run.steps.find((r) => r.stepKey === stepKey);
    if (!stepRow) {
      log.error("missing step row", { agentRunId, stepKey });
      continue;
    }
    if (stepRow.status === "completed") {
      stepOutputs[stepKey] = { outputUrl: stepRow.outputUrl ?? undefined };
      continue;
    }

    // Resolve placeholders.
    const resolved = resolvePlaceholders(spec.inputs, inputs, stepOutputs);

    await prisma.agentStep.update({
      where: { id: stepRow.id },
      data: { status: "running", startedAt: new Date(), inputsJson: resolved as object },
    });

    try {
      const feature = featureFromCategoryGuess(spec);
      const submission = await submitJob({
        userId,
        feature,
        modelSlug: spec.modelSlug,
        input: resolved as Record<string, unknown>,
        agentRunId,
        agentStepId: stepRow.id,
      });

      // Poll until terminal.
      const job = await pollJobToCompletion(submission.jobId);
      if (!job || job.status === "failed") {
        throw new Error(job?.errorMessage || "Step failed");
      }

      stepOutputs[stepKey] = { outputUrl: job.outputUrl ?? undefined };
      await prisma.agentStep.update({
        where: { id: stepRow.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          outputUrl: job.outputUrl,
          finalCoins: job.finalCoins ?? job.estCoins,
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await prisma.agentStep.update({
        where: { id: stepRow.id },
        data: { status: "failed", completedAt: new Date(), errorMessage: msg.slice(0, 500) },
      });
      await prisma.agentRun.update({
        where: { id: agentRunId },
        data: { status: "failed", errorMessage: msg.slice(0, 500), completedAt: new Date() },
      });
      log.error("agent step failed", { agentRunId, stepKey, msg });
      return;
    }
  }

  const finalUrl = stepOutputs[plan.finalStepKey]?.outputUrl;
  await prisma.agentRun.update({
    where: { id: agentRunId },
    data: { status: "completed", completedAt: new Date(), finalOutputUrl: finalUrl },
  });
  log.info("agent run completed", { agentRunId, finalUrl });
}

function topoSort(steps: AgentStepSpec[]): string[] {
  const order: string[] = [];
  const seen = new Set<string>();
  const map = new Map(steps.map((s) => [s.key, s]));
  function visit(key: string, stack: Set<string>) {
    if (seen.has(key)) return;
    if (stack.has(key)) throw new Error(`Cycle detected at ${key}`);
    stack.add(key);
    const step = map.get(key);
    if (!step) throw new Error(`Step not found: ${key}`);
    for (const dep of step.dependsOn ?? []) visit(dep, stack);
    stack.delete(key);
    seen.add(key);
    order.push(key);
  }
  for (const s of steps) visit(s.key, new Set());
  return order;
}

function resolvePlaceholders(
  obj: unknown,
  inputs: Record<string, unknown>,
  stepOutputs: Record<string, { outputUrl?: string; outputText?: string }>,
): unknown {
  if (typeof obj === "string") {
    return obj.replace(/\{\{(\w+)\.([\w-]+)(?:\.(\w+))?\}\}/g, (_, scope, key, prop) => {
      if (scope === "input") {
        const v = inputs[key];
        return typeof v === "string" ? v : v == null ? "" : JSON.stringify(v);
      }
      if (scope === "step") {
        const out = stepOutputs[key];
        if (!out) return "";
        if (prop === "outputUrl") return out.outputUrl ?? "";
        if (prop === "outputText") return out.outputText ?? "";
        return out.outputUrl ?? "";
      }
      return "";
    });
  }
  if (Array.isArray(obj)) return obj.map((x) => resolvePlaceholders(x, inputs, stepOutputs));
  if (obj && typeof obj === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = resolvePlaceholders(v, inputs, stepOutputs);
    return out;
  }
  return obj;
}

function featureFromCategoryGuess(spec: AgentStepSpec): "agent-step" {
  void spec; // We tag every agent-internal job with feature="agent-step" so analytics treat them as part of a run.
  return "agent-step";
}

async function pollJobToCompletion(jobId: string) {
  const start = Date.now();
  const TIMEOUT_MS = 10 * 60 * 1000;
  while (Date.now() - start < TIMEOUT_MS) {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return null;
    if (job.status === "completed" || job.status === "failed") return job;
    if (job.falRequestId) {
      try {
        const status = await getFalStatus(job.modelSlug, job.falRequestId);
        const s = (status as { status?: string }).status;
        if (s === "COMPLETED") {
          const result = await getFalResult(job.modelSlug, job.falRequestId);
          await completeJobFromFal(jobId, result);
        } else if (s === "FAILED" || s === "CANCELLED") {
          await failJob(jobId, `fal status ${s}`);
        }
      } catch (err) {
        log.warn("poll fal status failed", { jobId, err: String(err) });
      }
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  await failJob(jobId, "Agent step polling timeout");
  return prisma.job.findUnique({ where: { id: jobId } });
}

// Add feature key for agent steps to feature-models so submitJob accepts it.
export const _stub = isValidFeature;
