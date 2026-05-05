import "server-only";
import { z } from "zod";
import { openai, PLANNER_MODEL, requireOpenAI } from "../openai";
import { prisma } from "../db";
import { estimateCoins, type FalUnit } from "../pricing";
import type { AgentPlan, AgentRunInputs, AgentStepSpec } from "./types";
import { AGENT_TEMPLATES, TEMPLATE_BY_ID } from "./templates";

const StepSchema = z.object({
  key: z.string(),
  modelSlug: z.string(),
  inputs: z.record(z.string(), z.unknown()),
  dependsOn: z.array(z.string()).optional(),
  description: z.string().optional(),
  estimateParams: z
    .object({
      durationSeconds: z.number().optional(),
      megapixels: z.number().optional(),
      numImages: z.number().optional(),
      numChars: z.number().optional(),
    })
    .optional(),
});

const PlanSchema = z.object({
  templateId: z.string().optional(),
  steps: z.array(StepSchema).min(1).max(20),
  finalStepKey: z.string(),
});

/**
 * Build a plan. If templateId is provided, run the template; otherwise the
 * planner picks the closest template and lets GPT-5 mutate the DAG.
 */
export async function buildPlan(prompt: string, inputs: AgentRunInputs, templateId?: string): Promise<AgentPlan> {
  if (templateId && TEMPLATE_BY_ID[templateId]) {
    const partial = TEMPLATE_BY_ID[templateId].buildPlan(inputs);
    return finaliseWithCost(partial.steps, partial.finalStepKey, templateId);
  }

  // Freeform planner.
  if (!openai) {
    // No OpenAI configured: fall back to nearest template by simple keyword match.
    const guess = guessTemplate(prompt);
    if (guess) {
      const partial = guess.buildPlan(inputs);
      return finaliseWithCost(partial.steps, partial.finalStepKey, guess.id);
    }
    throw new Error("OPENAI_API_KEY not configured and no template matched the prompt");
  }

  const client = requireOpenAI();
  const enabledModels = await prisma.falModel.findMany({ where: { enabled: true }, select: { slug: true, category: true, displayName: true, unit: true, unitPriceUsd: true } });
  const modelList = enabledModels.map((m) => `${m.slug} (${m.category}) — ${m.displayName} @ $${m.unitPriceUsd}/${m.unit.replace("per_", "")}`).join("\n");
  const templateList = AGENT_TEMPLATES.map((t) => `- ${t.id}: ${t.description}`).join("\n");

  const sys = `You are Vidy's video pipeline planner. You output a strict JSON DAG of fal.ai model calls that solves the user's request.

Rules:
- Use ONLY model slugs from the catalog below. Reject any other slug.
- Output 1–10 steps. Steps may reference earlier outputs via "{{step.<key>.outputUrl}}" or "{{step.<key>.outputText}}".
- "{{input.<name>}}" references the user's uploaded files / fields.
- Each step has: key (kebab-case), modelSlug, inputs (object), optional dependsOn (array of step keys), description.
- Choose the cheapest model that meets the quality bar.
- The final step's output is what the user receives.

Templates available (you may pick one and adapt it):
${templateList}

Model catalog:
${modelList}`;

  const userMsg = `User prompt: ${prompt}\nUser inputs: ${JSON.stringify(inputs)}`;

  const completion = await client.chat.completions.create({
    model: PLANNER_MODEL,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: userMsg },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    stream: false,
  });

  const text = completion.choices[0]?.message?.content || "{}";
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Planner returned invalid JSON");
  }
  const checked = PlanSchema.safeParse(parsed);
  if (!checked.success) throw new Error(`Planner output failed validation: ${checked.error.message}`);

  const allowedSlugs = new Set(enabledModels.map((m) => m.slug));
  for (const step of checked.data.steps) {
    if (!allowedSlugs.has(step.modelSlug)) {
      throw new Error(`Planner referenced unknown model: ${step.modelSlug}`);
    }
  }

  return finaliseWithCost(checked.data.steps as AgentStepSpec[], checked.data.finalStepKey, checked.data.templateId);
}

async function finaliseWithCost(steps: AgentStepSpec[], finalStepKey: string, templateId?: string): Promise<AgentPlan> {
  const slugs = Array.from(new Set(steps.map((s) => s.modelSlug)));
  const models = await prisma.falModel.findMany({ where: { slug: { in: slugs } } });
  const byslug = new Map(models.map((m) => [m.slug, m]));
  let total = 0;
  for (const step of steps) {
    const m = byslug.get(step.modelSlug);
    if (!m) continue;
    total += estimateCoins(m.unit as FalUnit, m.unitPriceUsd, step.estimateParams ?? {});
  }
  return { steps, finalStepKey, totalEstCoins: total, templateId };
}

function guessTemplate(prompt: string) {
  const p = prompt.toLowerCase();
  for (const t of AGENT_TEMPLATES) {
    const tokens = t.id.split("-");
    if (tokens.every((w) => p.includes(w))) return t;
  }
  // Default: pick the iOS UGC template if "ugc" or "screenshot" mentioned.
  if (p.includes("ugc") || p.includes("screenshot") || p.includes("promo")) return TEMPLATE_BY_ID["ios-screenshot-to-ugc-promo"];
  if (p.includes("dub")) return TEMPLATE_BY_ID["dub-this-video"];
  if (p.includes("trailer")) return TEMPLATE_BY_ID["trailer-from-script"];
  return null;
}
