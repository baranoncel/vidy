import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { enforceLimit, requireUser, withErrors } from "@/lib/api";
import { presignPut, publicUrlFor, userUploadKey } from "@/lib/r2";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = withErrors(async (req: NextRequest) => {
  const user = await requireUser(req);
  await enforceLimit(req, "upload", user.id);
  const body = await req.json().catch(() => ({}));
  const ext = (typeof body.ext === "string" ? body.ext : "bin").replace(/[^a-z0-9]/gi, "").slice(0, 6) || "bin";
  const contentType = typeof body.contentType === "string" ? body.contentType : "application/octet-stream";
  const uploadId = crypto.randomUUID();
  const key = userUploadKey(user.id, uploadId, ext);
  const url = await presignPut(key, contentType, 3600);
  const publicUrl = publicUrlFor(key);
  return NextResponse.json({ uploadUrl: url, key, publicUrl });
});
