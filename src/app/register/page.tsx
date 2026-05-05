import type { Metadata } from "next";
import { RegisterClient } from "./register-client";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/register",
  title: "Create your account",
  description: "Sign up for Vidy and get 500 free Computational Coins.",
  faq: [],
});

export default function Page() {
  return <RegisterClient />;
}
