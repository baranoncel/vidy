import "server-only";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";
import { rateLimit, type LimiterKey } from "./rate-limit";

export type ApiError = { error: string; code?: string; details?: unknown };

export function jsonError(status: number, error: string, code?: string, details?: unknown): NextResponse<ApiError> {
  return NextResponse.json({ error, code, details }, { status });
}

export async function getSessionUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  return session?.user ?? null;
}

export async function requireUser(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) {
    throw jsonError(401, "Unauthorized", "unauthorized");
  }
  return user;
}

export async function enforceLimit(req: NextRequest, key: LimiterKey, identifier: string) {
  const result = await rateLimit(key, identifier);
  if (!result.success) {
    throw NextResponse.json(
      { error: "Rate limit exceeded", code: "rate_limited", reset: result.reset },
      { status: 429, headers: { "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString() } },
    );
  }
}

/** Wraps a handler so thrown NextResponse objects become the response. */
export function withErrors<T extends (...args: never[]) => Promise<NextResponse>>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof NextResponse) return err;
      if (err instanceof Response) return err as NextResponse;
      console.error("API handler error:", err);
      const message = err instanceof Error ? err.message : "Internal server error";
      return jsonError(500, message, "internal_error");
    }
  }) as T;
}
