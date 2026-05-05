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

const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  // `output: "standalone"` is for self-host (Docker/Coolify); Vercel does its own packaging.
  ...(isVercel
    ? {}
    : {
        output: "standalone" as const,
        // Bundle Prisma into the standalone output for self-host only (pnpm puts these under .pnpm/).
        outputFileTracingIncludes: {
          "/**/*": [
            "./node_modules/.pnpm/@prisma+client*/**",
            "./node_modules/.pnpm/prisma*/**",
            "./node_modules/.pnpm/@prisma+engines*/**",
            "./prisma/**",
          ],
        },
      }),
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
};

export default nextConfig;
