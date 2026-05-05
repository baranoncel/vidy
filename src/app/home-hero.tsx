"use client";

import { useRouter } from "next/navigation";
import { Sparkles, Wand2 } from "lucide-react";
import ClaudeChatInput, { type FileWithPreview, type PastedContent } from "@/components/ui/claude-style-ai-input";
import { ModernCarousel } from "@/components/ui/feature-carousel";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { SparklesText } from "@/components/ui/sparkles-text";
import { Button } from "@/components/ui/button";
import { useAuthGate } from "@/components/auth/AuthGate";

const TYPING_EXAMPLES = [
  "Make me a 15s UGC promo from this iOS screenshot",
  "Cinematic shot of a fox running through a snowy forest at golden hour",
  "Dub this video into Spanish with my own voice cloned",
  "Animate this product photo into a 5-second hero clip",
  "Turn this blog post into a 30s explainer video with narration",
];

type CarouselItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
};

export function HomeHero({ modelCount, carouselItems }: { modelCount: number; carouselItems: CarouselItem[] }) {
  const router = useRouter();
  const { requireAuth } = useAuthGate();

  function onSendMessage(message: string, files: FileWithPreview[], _pasted: PastedContent[]) {
    void _pasted;
    const params = new URLSearchParams();
    if (message) params.set("prompt", message);
    if (files.length > 0) params.set("withFiles", "1");
    requireAuth(() => {
      router.push(`/agent${params.toString() ? `?${params.toString()}` : ""}`);
    });
  }

  return (
    <section className="relative overflow-hidden">
      <AnimatedGridPattern
        numSquares={40}
        maxOpacity={0.08}
        duration={3}
        className="absolute inset-0 h-full w-full -z-10 opacity-60 [mask-image:radial-gradient(700px_circle_at_center,white,transparent)]"
      />
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-12 text-center">
        <span className="mb-4 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-600 dark:text-violet-400">
          <Sparkles className="h-3 w-3" />
          Agentic AI Video Studio · {modelCount.toLocaleString()} models
        </span>
        <h1 className="mx-auto mt-2 max-w-3xl text-balance text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Generate, edit, dub and animate video with{" "}
          <SparklesText text="one agent" className="inline-block text-5xl sm:text-6xl" />
          .
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-neutral-500">
          Describe what you want, drop your assets in, and Vidy chains the right AI models — Veo, Kling, Seedance, FLUX,
          ElevenLabs, Topaz and more — into a finished asset.
        </p>

        <div className="mx-auto mt-8 max-w-3xl">
          <ClaudeChatInput
            onSendMessage={onSendMessage}
            placeholder="Describe your video idea, drop files, hit ↑"
            typingExamples={TYPING_EXAMPLES}
            buttonText=""
            fullWidth
          />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-neutral-500">
          <span>Try:</span>
          {[
            "iOS screenshot → UGC promo",
            "text → Veo 3.1 4K",
            "video → dub into 7 languages",
            "blog post → explainer",
          ].map((p) => (
            <span key={p} className="rounded-full border border-neutral-200 px-2 py-0.5 dark:border-neutral-800">
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Feature carousel */}
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <ModernCarousel items={carouselItems} autoPlay autoPlayInterval={5500} />
      </div>
    </section>
  );
}
