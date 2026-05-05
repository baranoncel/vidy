import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireUser, withErrors } from "@/lib/api";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit") || 50), 200);
  const rows = await prisma.coinLedger.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return NextResponse.json({ rows });
});
