import type { Metadata } from "next";
import { LoginClient } from "./login-client";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/login",
  title: "Sign in",
  description: "Sign in to Vidy with Google or email.",
  faq: [],
});

export default function Page({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  return <LoginClient searchParamsPromise={searchParams} />;
}
