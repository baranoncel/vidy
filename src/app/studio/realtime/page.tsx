"use client";

import { useState } from "react";
import { PromptBar } from "@/components/studio/PromptBar";
import { useStudioModels } from "@/lib/hooks/useStudioModels";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

export default function StudioRealtimePage() {
  const { models } = useStudioModels("image"); // sana/sprint, fast-lightning-sdxl live in image cat
  const [selected, setSelected] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [last, setLast] = useState<string>("");
  const fr = useFeatureRun("realtime");

  if (!selected && models.length > 0) {
    const fast = models.find((m) => m.slug.includes("sana/sprint") || m.slug.includes("fast-lightning"));
    setSelected(fast?.slug || models[0].slug);
  }

  async function submit(prompt: string) {
    setLast(prompt);
    try {
      const result = await fr.run({ prompt, size: "square_hd" }, { modelSlug: selected ?? undefined });
      if (result?.outputUrl) setImgUrl(result.outputUrl);
    } catch {}
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24">
      <header className="mb-7 mt-6">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Realtime</h1>
        <p className="mt-2 max-w-xl text-sm text-white/55">Sub-second image generation — type and watch.</p>
      </header>
      <PromptBar
        models={models.filter((m) => m.slug.includes("sprint") || m.slug.includes("lightning") || m.slug.includes("fast"))}
        selectedSlug={selected}
        onSelect={setSelected}
        onSubmit={submit}
        busy={fr.status === "running" || fr.status === "queued"}
        placeholder="Type and the image regenerates instantly…"
        values={{}}
        onValuesChange={() => {}}
      />
      <section className="mt-8 grid place-items-center">
        <div className="aspect-square w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] ring-1 ring-white/5">
          {imgUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgUrl} alt={last} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-white/30">No output yet</div>
          )}
        </div>
      </section>
    </main>
  );
}
