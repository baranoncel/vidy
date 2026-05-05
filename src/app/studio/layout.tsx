import type { Metadata } from "next";
import { StudioNav } from "./studio-nav";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  path: "/studio",
  title: "Vidy Studio",
  description: "Generate, edit, and animate with Vidy's full model library — image, video, audio, effects, all from one studio.",
  faq: [],
});

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-white">
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(900px circle at 50% -10%, rgba(124,58,237,0.18), transparent 60%), radial-gradient(700px circle at 90% 80%, rgba(59,130,246,0.12), transparent 60%)",
        }}
      />
      <StudioNav />
      <div className="pt-4">{children}</div>
    </div>
  );
}
