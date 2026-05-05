import type { NextRequest } from "next/server";
import { jsonError, requireUser } from "@/lib/api";
import { prisma } from "@/lib/db";
import { refreshJobStatus } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const POLL_MS = 1500;
const TIMEOUT_MS = 5 * 60 * 1000;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let user;
  try {
    user = await requireUser(req);
  } catch (err) {
    return err as Response;
  }
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || job.userId !== user.id) return jsonError(404, "Not found", "not_found");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const startedAt = Date.now();
      let lastSnapshot = "";

      const send = (event: string, data: unknown) => {
        const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(payload));
      };

      while (true) {
        await refreshJobStatus(id);
        const fresh = await prisma.job.findUnique({ where: { id } });
        if (!fresh) {
          send("error", { message: "Job vanished" });
          break;
        }
        const snapshot = `${fresh.status}|${fresh.outputUrl ?? ""}|${fresh.errorMessage ?? ""}`;
        if (snapshot !== lastSnapshot) {
          lastSnapshot = snapshot;
          send("update", {
            status: fresh.status,
            outputUrl: fresh.outputUrl,
            errorMessage: fresh.errorMessage,
            finalCoins: fresh.finalCoins,
            estCoins: fresh.estCoins,
          });
        }
        if (fresh.status === "completed" || fresh.status === "failed" || fresh.status === "cancelled") {
          send("done", { status: fresh.status, outputUrl: fresh.outputUrl });
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
