import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { enforceLimit, jsonError, requireUser, withErrors } from "@/lib/api";
import { prisma } from "@/lib/db";
import { buildPlan } from "@/lib/agent/planner";
import { runAgent } from "@/lib/agent/executor";
import { hasCoins } from "@/lib/coins";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  await enforceLimit(req, "agent", user.id);

  const body = await req.json().catch(() => ({}));
  const prompt = String(body.prompt || "");
  const inputs = (body.inputs ?? {}) as Record<string, unknown>;
  const templateId = typeof body.templateId === "string" ? body.templateId : undefined;
  const autoStart = body.autoStart !== false;

  if (!prompt && !templateId) return jsonError(400, "prompt or templateId required", "missing_prompt");

  const plan = await buildPlan(prompt, inputs, templateId);

  if (!(await hasCoins(user.id, plan.totalEstCoins))) {
    return jsonError(402, "Insufficient coins for plan", "insufficient_coins", { required: plan.totalEstCoins });
  }

  const run = await prisma.agentRun.create({
    data: {
      userId: user.id,
      prompt,
      templateId: plan.templateId,
      plan: plan as unknown as object,
      status: autoStart ? "running" : "planning",
      totalEstCoins: plan.totalEstCoins,
      inputUrlsJson: inputs as object,
      startedAt: autoStart ? new Date() : null,
      steps: {
        create: plan.steps.map((s, idx) => ({
          stepIndex: idx,
          stepKey: s.key,
          modelSlug: s.modelSlug,
          inputsJson: s.inputs as object,
          status: "pending",
          estCoins: 0, // computed at run time from FalModel; UI can show plan-level total
          dependsOn: s.dependsOn ?? [],
        })),
      },
    },
    include: { steps: true },
  });

  if (autoStart) {
    // Fire and forget — executor runs out-of-band and updates the row.
    runAgent(run.id).catch((err) => console.error("agent error", err));
  }

  return NextResponse.json({ runId: run.id, plan, status: run.status });
});

export const GET = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  const url = new URL(req.url);
  const limit = Math.min(Number(url.searchParams.get("limit") || 25), 100);
  const rows = await prisma.agentRun.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { id: true, prompt: true, templateId: true, status: true, totalEstCoins: true, finalOutputUrl: true, createdAt: true, completedAt: true },
  });
  return NextResponse.json({ runs: rows });
});
