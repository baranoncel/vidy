import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireUser, withErrors } from "@/lib/api";
import { getCoinBalance } from "@/lib/coins";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  const balance = await getCoinBalance(user.id);
  return NextResponse.json({ balance });
});
