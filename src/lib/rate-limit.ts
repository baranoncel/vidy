import "server-only";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

function makeLimiter(tokens: number, window: `${number} ${"s" | "m" | "h" | "d"}`, prefix: string) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix,
    analytics: false,
  });
}

export const limiters = {
  jobs: makeLimiter(30, "1 m", "vidy:rl:jobs"),
  agent: makeLimiter(5, "1 m", "vidy:rl:agent"),
  expensive: makeLimiter(5, "1 m", "vidy:rl:expensive"),
  upload: makeLimiter(20, "1 m", "vidy:rl:upload"),
};

export type LimiterKey = keyof typeof limiters;

export async function rateLimit(key: LimiterKey, identifier: string) {
  const limiter = limiters[key];
  if (!limiter) return { success: true, remaining: Infinity, reset: 0 } as const;
  const result = await limiter.limit(identifier);
  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
  } as const;
}
