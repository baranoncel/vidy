import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jsonError, requireUser, withErrors } from "@/lib/api";
import { prisma } from "@/lib/db";
import { refreshJobStatus } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withErrors(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser(req);
  const { id } = await params;

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job || job.userId !== user.id) return jsonError(404, "Not found", "not_found");

  // If the job is in flight, do an opportunistic refresh (cheap if cached).
  if (job.status === "running" || job.status === "queued") {
    await refreshJobStatus(id);
  }

  const fresh = await prisma.job.findUnique({ where: { id } });
  return NextResponse.json({ job: fresh });
});
