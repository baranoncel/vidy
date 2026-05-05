import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jsonError, requireUser, withErrors } from "@/lib/api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withErrors(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await requireUser(req);
  const { id } = await params;
  const run = await prisma.agentRun.findUnique({
    where: { id },
    include: { steps: { orderBy: { stepIndex: "asc" } } },
  });
  if (!run || run.userId !== user.id) return jsonError(404, "Not found", "not_found");
  return NextResponse.json({ run });
});
