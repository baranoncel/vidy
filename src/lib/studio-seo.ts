import type { Metadata } from "next";
import { SITE, url, type FaqItem } from "./seo";

export type StudioSeo = {
  path: string;
  title: string;
  metaTitle?: string;
  description: string;
  keywords?: string[];
  faq: FaqItem[];
  modelCategory?: string;
  ogImage?: string;
};

export function buildStudioMetadata(seo: StudioSeo): Metadata {
  const canonical = url(seo.path);
  const ogImage = seo.ogImage ? url(seo.ogImage) : url(`/og${seo.path.replace(/\/$/, "")}.png`);
  const title = seo.metaTitle || `${seo.title} · Vidy Studio`;
  return {
    title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE.name,
      title,
      description: seo.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: seo.title }],
    },
    twitter: { card: "summary_large_image", site: SITE.twitter, title, description: seo.description, images: [ogImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  };
}

export const STUDIO_SEO: Record<string, StudioSeo> = {
  image: {
    path: "/studio/image",
    title: "Image generator",
    metaTitle: "AI Image Generator · Vidy Studio",
    description: "Generate photoreal, illustrated, or typographic images with FLUX 1.1 Pro Ultra, Ideogram V3, Nano Banana, Seedream V4 and more — all in one bar.",
    keywords: ["AI image generator", "FLUX Pro Ultra", "Ideogram V3", "Nano Banana", "Seedream V4", "text to image"],
    modelCategory: "image",
    faq: [
      { q: "Which image model is best for legible text in posters?", a: "Ideogram V3 is the leader for in-image text rendering. FLUX 1.1 Pro Ultra is the all-rounder. Nano Banana is the cheapest fast preview model." },
      { q: "Can I upload a reference?", a: "Yes — drop an image into the prompt bar. We'll route it to the best image-edit / image-to-image variant of your selected model." },
      { q: "Aspect ratios supported?", a: "1:1, 16:9, 9:16, 4:5 and 3:2. Toggle in the Settings drawer below the prompt bar." },
    ],
  },
  video: {
    path: "/studio/video",
    title: "Video generator",
    metaTitle: "AI Video Generator · Vidy Studio",
    description: "Cinematic AI video from text or a reference image — Veo 3.1, Kling v3 Pro & 4K, Seedance 2, Wan 2.5, Luma Ray 2, Pika 2.2 and more.",
    keywords: ["AI video generator", "Veo 3.1", "Kling v3", "Seedance 2", "Wan 2.5", "text to video", "image to video"],
    modelCategory: "video",
    faq: [
      { q: "Which video model has native audio?", a: "Veo 3.1, Kling v3 Pro, Seedance 2, and Happy Horse 1.0 emit synchronised native audio. Other models produce silent video — pair with /studio/audio for a soundtrack." },
      { q: "Can I generate from a still image?", a: "Yes — drop an image into the prompt bar; we route to the image-to-video variant automatically." },
      { q: "What's the maximum duration?", a: "4–10 seconds depending on the model. For longer pieces, use Canvas templates that stitch multi-shot scenes." },
    ],
  },
  audio: {
    path: "/studio/audio",
    title: "Music & sound effects",
    metaTitle: "AI Music & Sound Effect Generator · Vidy Studio",
    description: "Generate music, sound effects, and ambient soundtracks with Ace-Step, ElevenLabs SFX, MMAudio, and Yue.",
    keywords: ["AI music generator", "AI sound effects", "Ace-Step", "ElevenLabs sound effects", "MMAudio"],
    modelCategory: "audio",
    faq: [
      { q: "Can I score a video?", a: "Yes — pass a video URL to MMAudio v2 and it composes audio matched to on-screen action." },
      { q: "What lengths are possible?", a: "1–60 seconds for music; up to 30 seconds for SFX." },
    ],
  },
  voice: {
    path: "/studio/voice",
    title: "Voiceover & cloning",
    metaTitle: "AI Voice Generator & Cloning · Vidy Studio",
    description: "Multilingual voiceover and voice cloning — ElevenLabs Multilingual v2, Minimax Speech-02 HD, Kokoro, and more.",
    keywords: ["AI voice generator", "ElevenLabs TTS", "voice cloning", "multilingual voiceover", "Kokoro TTS"],
    modelCategory: "tts",
    faq: [
      { q: "How do I clone my voice?", a: "Record or upload a 30-second sample and run /studio/voice with Minimax Voice Clone. The cloned voice is reusable across every Vidy feature." },
      { q: "Languages supported?", a: "30+ — English, Spanish, French, German, Italian, Portuguese, Japanese, Mandarin, Hindi, and more via Kokoro and ElevenLabs Multilingual." },
    ],
  },
  effects: {
    path: "/studio/effects",
    title: "Visual effects",
    metaTitle: "AI Visual Effects · Vidy Studio",
    description: "One-click cinematic effects — explode, melt, dissolve, age, transform — on any image or video. Powered by Wan FX, Pikaffects, Kling FX, and PixVerse Effects.",
    keywords: ["AI video effects", "Pikaffects", "Wan effects", "Kling effects", "PixVerse effects"],
    modelCategory: "effects",
    faq: [
      { q: "Can I chain effects?", a: "Yes — pass the output of one effect into another, or build a multi-step Canvas template that combines them with audio + captions." },
    ],
  },
  "3d": {
    path: "/studio/3d",
    title: "Image to 3D",
    metaTitle: "AI Image-to-3D Generator · Vidy Studio",
    description: "Turn a single photo into a 3D mesh and 360° turntable mp4 with Hunyuan3D v2 and TRELLIS.",
    keywords: ["AI 3D generator", "image to 3D", "Hunyuan3D", "TRELLIS"],
    modelCategory: "3d",
    faq: [
      { q: "What output formats?", a: "GLB mesh + a rendered turntable mp4 you can drop into any landing page or game engine." },
      { q: "Multi-view supported?", a: "Yes — Hunyuan3D v2 Multi-View and TRELLIS Multi accept multiple reference angles for higher fidelity." },
    ],
  },
  realtime: {
    path: "/studio/realtime",
    title: "Realtime canvas",
    metaTitle: "Realtime AI Image Canvas · Vidy Studio",
    description: "Sub-second image generation. Type and the picture updates instantly — powered by SANA Sprint and Fast Lightning SDXL.",
    keywords: ["realtime AI", "SANA Sprint", "fast image generation", "live AI canvas"],
    modelCategory: "image",
    faq: [
      { q: "How fast is it?", a: "200–600 ms per render at 512px on SANA Sprint, depending on prompt length and load." },
    ],
  },
  canvas: {
    path: "/studio/canvas",
    title: "Multi-model templates",
    metaTitle: "Multi-Model Workflow Templates · Vidy Canvas",
    description: "Pre-built agentic templates that chain 5–10 models into a finished asset — UGC promos, trailers, dubs, music videos, and more.",
    keywords: ["multi-model AI workflow", "AI agent templates", "UGC video AI", "AI video templates"],
    faq: [
      { q: "What is a template?", a: "A typed DAG of model calls. Each step's output flows into the next. The agent shows the plan + estimated coin cost before debit." },
      { q: "Can I edit a template?", a: "Yes — pick a template, then ask the agent to swap or remove steps. Plans are JSON, not opaque pipelines." },
    ],
  },
};
