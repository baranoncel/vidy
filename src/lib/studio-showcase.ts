/**
 * Curated public showcase videos used for autoplay tiles in /studio.
 * These are royalty-free Pexels assets (verified public CDN).
 * Replace with first-party render URLs once /studio collects enough community gens.
 */

export type ShowcaseClip = {
  id: string;
  src: string;
  poster?: string;
  label: string;
  meta?: string;
  category: "video" | "image" | "audio" | "effects" | "3d" | "voice";
};

const PEXELS = "https://videos.pexels.com/video-files";

export const HERO_REEL: ShowcaseClip[] = [
  { id: "h1", category: "video", src: `${PEXELS}/30333849/13003128_2560_1440_25fps.mp4`, label: "Cinematic chase", meta: "Veo 3.1 · 8s" },
  { id: "h2", category: "video", src: `${PEXELS}/3129671/3129671-uhd_2560_1440_30fps.mp4`, label: "Neon city flyover", meta: "Kling v3 4K" },
  { id: "h3", category: "video", src: `${PEXELS}/4827/4827-uhd_3840_2160_25fps.mp4`, label: "Coastal drone", meta: "Seedance 2" },
  { id: "h4", category: "video", src: `${PEXELS}/2257008/2257008-uhd_2560_1440_25fps.mp4`, label: "Macro coffee pour", meta: "Wan 2.5" },
  { id: "h5", category: "video", src: `${PEXELS}/5377684/5377684-hd_1920_1080_25fps.mp4`, label: "Bokeh portrait", meta: "Luma Ray 2" },
];

export const CATEGORY_REELS: Record<string, ShowcaseClip[]> = {
  image: [
    { id: "i1", category: "image", src: `${PEXELS}/4827/4827-uhd_3840_2160_25fps.mp4`, poster: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=900&q=70&auto=format", label: "FLUX 1.1 Pro Ultra", meta: "Photoreal · 2K" },
    { id: "i2", category: "image", src: `${PEXELS}/5377684/5377684-hd_1920_1080_25fps.mp4`, poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=900&q=70&auto=format", label: "Ideogram V3", meta: "Text-aware" },
    { id: "i3", category: "image", src: `${PEXELS}/4992493/4992493-uhd_2732_1440_25fps.mp4`, poster: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=70&auto=format", label: "Nano Banana", meta: "Fast preview" },
  ],
  video: [
    { id: "v1", category: "video", src: `${PEXELS}/30333849/13003128_2560_1440_25fps.mp4`, label: "Veo 3.1", meta: "Native audio · 1080p" },
    { id: "v2", category: "video", src: `${PEXELS}/3129671/3129671-uhd_2560_1440_30fps.mp4`, label: "Kling v3 Pro", meta: "Multi-shot" },
    { id: "v3", category: "video", src: `${PEXELS}/4827/4827-uhd_3840_2160_25fps.mp4`, label: "Seedance 2", meta: "Director-level" },
    { id: "v4", category: "video", src: `${PEXELS}/2257008/2257008-uhd_2560_1440_25fps.mp4`, label: "Wan 2.5", meta: "Best price" },
  ],
  audio: [
    { id: "a1", category: "audio", src: `${PEXELS}/2257008/2257008-uhd_2560_1440_25fps.mp4`, label: "Cinematic score", meta: "Ace-Step" },
    { id: "a2", category: "audio", src: `${PEXELS}/5377684/5377684-hd_1920_1080_25fps.mp4`, label: "Lo-fi beat", meta: "Ace-Step" },
    { id: "a3", category: "audio", src: `${PEXELS}/4992493/4992493-uhd_2732_1440_25fps.mp4`, label: "Sound effects", meta: "ElevenLabs" },
  ],
  voice: [
    { id: "vo1", category: "voice", src: `${PEXELS}/3209828/3209828-hd_1920_1080_25fps.mp4`, label: "Multilingual TTS", meta: "30+ languages" },
    { id: "vo2", category: "voice", src: `${PEXELS}/5722127/5722127-hd_1920_1080_30fps.mp4`, label: "Voice cloning", meta: "30s sample" },
  ],
  effects: [
    { id: "e1", category: "effects", src: `${PEXELS}/4827/4827-uhd_3840_2160_25fps.mp4`, label: "Explode", meta: "Wan Effects" },
    { id: "e2", category: "effects", src: `${PEXELS}/3129671/3129671-uhd_2560_1440_30fps.mp4`, label: "Melt", meta: "Pikaffects" },
    { id: "e3", category: "effects", src: `${PEXELS}/2257008/2257008-uhd_2560_1440_25fps.mp4`, label: "Transform", meta: "PixVerse Effects" },
    { id: "e4", category: "effects", src: `${PEXELS}/5722127/5722127-hd_1920_1080_30fps.mp4`, label: "Dissolve", meta: "Kling FX" },
    { id: "e5", category: "effects", src: `${PEXELS}/4992493/4992493-uhd_2732_1440_25fps.mp4`, label: "Ageing", meta: "Wan FX" },
    { id: "e6", category: "effects", src: `${PEXELS}/30333849/13003128_2560_1440_25fps.mp4`, label: "Zoom-glitch", meta: "Wan FX" },
  ],
  "3d": [
    { id: "t1", category: "3d", src: `${PEXELS}/5722127/5722127-hd_1920_1080_30fps.mp4`, label: "Hunyuan3D v2", meta: "Mesh + GLB" },
    { id: "t2", category: "3d", src: `${PEXELS}/3209828/3209828-hd_1920_1080_25fps.mp4`, label: "TRELLIS", meta: "Multi-view" },
  ],
};

export const TEMPLATE_PREVIEWS: Record<string, ShowcaseClip> = {
  "ios-screenshot-to-ugc-promo": { id: "tp1", category: "video", src: `${PEXELS}/5722127/5722127-hd_1920_1080_30fps.mp4`, label: "iOS UGC promo", meta: "9 steps · ~6K coins" },
  "trailer-from-script": { id: "tp2", category: "video", src: `${PEXELS}/30333849/13003128_2560_1440_25fps.mp4`, label: "Script → trailer", meta: "Multi-shot 4K" },
  "kids-story-animation": { id: "tp3", category: "video", src: `${PEXELS}/2257008/2257008-uhd_2560_1440_25fps.mp4`, label: "Kids story", meta: "Warm + soft" },
  "before-after-transformation": { id: "tp4", category: "video", src: `${PEXELS}/4827/4827-uhd_3840_2160_25fps.mp4`, label: "Before / after", meta: "Smooth morph" },
  "product-360-spin": { id: "tp5", category: "video", src: `${PEXELS}/4992493/4992493-uhd_2732_1440_25fps.mp4`, label: "Product 360°", meta: "3D mesh + spin" },
  "dub-this-video": { id: "tp6", category: "video", src: `${PEXELS}/3209828/3209828-hd_1920_1080_25fps.mp4`, label: "Dub a video", meta: "Lipsync v2" },
  "podcast-clip-to-shorts": { id: "tp7", category: "video", src: `${PEXELS}/5377684/5377684-hd_1920_1080_25fps.mp4`, label: "Podcast → Shorts", meta: "9:16 + captions" },
  "music-video-from-lyrics": { id: "tp8", category: "video", src: `${PEXELS}/3129671/3129671-uhd_2560_1440_30fps.mp4`, label: "Lyrics → music video", meta: "Per-bar visuals" },
};
