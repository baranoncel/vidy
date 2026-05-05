import type { NextRequest } from "next/server";
import { jsonError, requireUser } from "@/lib/api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const POLL_MS = 1500;
const TIMEOUT_MS = 15 * 60 * 1000;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    return err as Response;
  }
  const { id } = await params;
  const run = await prisma.agentRun.findUnique({ where: { id } });
  if (!run || run.userId !== user.id) return jsonError(404, "Not found", "not_found");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const startedAt = Date.now();
      let lastSnapshot = "";
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      while (true) {
        const fresh = await prisma.agentRun.findUnique({
          where: { id },
          include: { steps: { orderBy: { stepIndex: "asc" } } },
        });
        if (!fresh) {
          send("error", { message: "Run vanished" });
          break;
        }
        const stepsSnapshot = fresh.steps.map((s) => `${s.status}:${s.outputUrl ?? ""}`).join("|");
        const snapshot = `${fresh.status}|${fresh.finalOutputUrl ?? ""}|${stepsSnapshot}`;
        if (snapshot !== lastSnapshot) {
          lastSnapshot = snapshot;
          send("update", {
            status: fresh.status,
            finalOutputUrl: fresh.finalOutputUrl,
            errorMessage: fresh.errorMessage,
            steps: fresh.steps.map((s) => ({
              stepKey: s.stepKey,
              modelSlug: s.modelSlug,
              status: s.status,
              outputUrl: s.outputUrl,
              errorMessage: s.errorMessage,
            })),
          });
        }
        if (fresh.status === "completed" || fresh.status === "failed" || fresh.status === "cancelled") {
          send("done", { status: fresh.status });
          break;
        }
        if (Date.now() - startedAt > TIMEOUT_MS) {
          send("timeout", { message: "Stream timeout" });
          break;
        }
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}
