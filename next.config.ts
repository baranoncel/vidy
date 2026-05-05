import type { NextConfig } from "next";

const r2PublicUrl = process.env.R2_PUBLIC_URL;
let r2Hostname: string | null = null;
if (r2PublicUrl) {
  try {
    r2Hostname = new URL(r2PublicUrl).hostname;
  } catch {
    r2Hostname = null;
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  // Bundle the Prisma engine + client into the standalone output (pnpm
  // monorepo style places these under .pnpm/, which Next's tracer doesn't
  // always pick up automatically).
  outputFileTracingIncludes: {
    "/**/*": ["./node_modules/.pnpm/@prisma+client*/**", "./node_modules/.pnpm/prisma*/**", "./node_modules/.pnpm/@prisma+engines*/**", "./prisma/**"],
  },
  images: {
    remotePatterns: [
      ...(r2Hostname
        ? [{ protocol: "https" as const, hostname: r2Hostname, pathname: "/**" }]
        : []),
      { protocol: "https", hostname: "v3.fal.media", pathname: "/**" },
      { protocol: "https", hostname: "fal.media", pathname: "/**" },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
