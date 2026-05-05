/**
 * Default fal model + estimator hints per feature page. Used by the generic
 * job runner to convert a "submit on /generate" request into a concrete fal
 * model call with a coin estimate.
 */

import type { EstimateParams, FalUnit } from "./pricing";

export type FeatureKey =
  | "generate"
  | "image"
  | "video"
  | "ugc-video"
  | "lipsync"
  | "upscale"
  | "enhance"
  | "tts"
  | "audio"
  | "dubbing"
  | "captions"
  | "clips"
  | "stories"
  | "3d"
  | "effects"
  | "realtime"
  | "style"
  | "train"
  | "edit"
  | "agent-step";

export type FeatureConfig = {
  defaultModel: string;
  alternates: string[];
  /** How to translate the request payload into estimator params for the chosen model. */
  estimateHint: (input: Record<string, unknown>) => EstimateParams;
  /** Build the fal model input from the request payload. Throw to reject invalid inputs. */
  buildFalInput: (input: Record<string, unknown>) => Record<string, unknown>;
};

const num = (v: unknown, d: number) => (typeof v === "number" && isFinite(v) ? v : typeof v === "string" && !isNaN(Number(v)) ? Number(v) : d);
const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);

export const FEATURE_MODELS: Record<FeatureKey, FeatureConfig> = {
  generate: {
    defaultModel: "fal-ai/kling-video/v3/pro/text-to-video",
    alternates: [
      "fal-ai/veo3.1",
      "fal-ai/veo3.1/fast",
      "fal-ai/bytedance/seedance-2.0/text-to-video",
      "fal-ai/wan-25-preview/text-to-video",
      "fal-ai/kling-video/v1.6/pro/text-to-video",
      "fal-ai/luma-dream-machine/ray-2",
    ],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 5) }),
    buildFalInput: (i) => ({
      prompt: str(i.prompt),
      duration: num(i.durationSeconds, 5),
      aspect_ratio: str(i.aspectRatio, "16:9"),
      negative_prompt: str(i.negativePrompt) || undefined,
    }),
  },

  video: {
    defaultModel: "fal-ai/kling-video/v3/pro/text-to-video",
    alternates: [
      "fal-ai/veo3.1",
      "fal-ai/bytedance/seedance-2.0/text-to-video",
      "fal-ai/wan-25-preview/text-to-video",
      "fal-ai/kling-video/v3/pro/image-to-video",
    ],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 5) }),
    buildFalInput: (i) => {
      const prompt = str(i.prompt);
      const imageUrl = str(i.imageUrl);
      return {
        prompt: prompt || undefined,
        image_url: imageUrl || undefined,
        duration: num(i.durationSeconds, 5),
        aspect_ratio: str(i.aspectRatio, "16:9"),
      };
    },
  },

  image: {
    defaultModel: "fal-ai/flux-pro/v1.1-ultra",
    alternates: ["fal-ai/ideogram/v3", "fal-ai/nano-banana", "fal-ai/bytedance/seedream/v4/text-to-image", "fal-ai/imagen3"],
    estimateHint: (i) => ({ numImages: num(i.numImages, 1), megapixels: num(i.megapixels, 1) }),
    buildFalInput: (i) => ({
      prompt: str(i.prompt),
      num_images: num(i.numImages, 1),
      aspect_ratio: str(i.aspectRatio, "1:1"),
      output_format: str(i.outputFormat, "png"),
    }),
  },

  "ugc-video": {
    defaultModel: "fal-ai/kling-video/v3/pro/image-to-video",
    alternates: ["fal-ai/bytedance/seedance-2.0/image-to-video"],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 8) }),
    buildFalInput: (i) => ({
      prompt: str(i.prompt),
      image_url: str(i.imageUrl),
      duration: num(i.durationSeconds, 8),
    }),
  },

  lipsync: {
    defaultModel: "fal-ai/sync-lipsync/v2",
    alternates: ["fal-ai/kling-video/lipsync/audio-to-video", "fal-ai/latentsync", "fal-ai/tavus/hummingbird-lipsync/v0"],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 30) }),
    buildFalInput: (i) => ({
      video_url: str(i.videoUrl),
      audio_url: str(i.audioUrl),
      sync_mode: str(i.syncMode, "loop"),
    }),
  },

  upscale: {
    defaultModel: "fal-ai/topaz/upscale/video",
    alternates: ["fal-ai/drct-super-resolution", "fal-ai/creative-upscaler", "fal-ai/swin2sr"],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 10), megapixels: num(i.megapixels, 1) }),
    buildFalInput: (i) => ({
      video_url: str(i.videoUrl) || undefined,
      image_url: str(i.imageUrl) || undefined,
      target_resolution: str(i.targetResolution, "4K"),
      upscale_factor: num(i.upscaleFactor, 2),
    }),
  },

  enhance: {
    defaultModel: "fal-ai/codeformer",
    alternates: ["fal-ai/nafnet/denoise", "fal-ai/nafnet/deblur", "fal-ai/mix-dehaze-net"],
    estimateHint: (i) => ({ megapixels: num(i.megapixels, 1) }),
    buildFalInput: (i) => ({ image_url: str(i.imageUrl), fidelity: num(i.fidelity, 0.5) }),
  },

  tts: {
    defaultModel: "fal-ai/elevenlabs/tts/multilingual-v2",
    alternates: [
      "fal-ai/elevenlabs/tts/turbo-v2.5",
      "fal-ai/minimax/speech-02-hd",
      "fal-ai/kokoro/american-english",
      "fal-ai/kokoro/spanish",
    ],
    estimateHint: (i) => ({ numChars: str(i.text).length || 200 }),
    buildFalInput: (i) => ({
      text: str(i.text),
      voice: str(i.voice) || undefined,
      language_code: str(i.languageCode) || undefined,
    }),
  },

  audio: {
    defaultModel: "fal-ai/ace-step",
    alternates: ["fal-ai/elevenlabs/sound-effects", "fal-ai/mmaudio-v2", "fal-ai/yue"],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 10) }),
    buildFalInput: (i) => ({
      prompt: str(i.prompt),
      duration: num(i.durationSeconds, 10),
      video_url: str(i.videoUrl) || undefined,
    }),
  },

  dubbing: {
    defaultModel: "fal-ai/sync-lipsync/v2",
    alternates: [],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 60) }),
    buildFalInput: (i) => ({
      video_url: str(i.videoUrl),
      target_language: str(i.targetLanguage, "es"),
    }),
  },

  captions: {
    defaultModel: "fal-ai/elevenlabs/speech-to-text",
    alternates: ["fal-ai/whisper", "fal-ai/speech-to-text"],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 60) }),
    buildFalInput: (i) => ({ audio_url: str(i.audioUrl) || str(i.videoUrl) }),
  },

  clips: {
    defaultModel: "fal-ai/elevenlabs/speech-to-text",
    alternates: [],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 600) }),
    buildFalInput: (i) => ({ audio_url: str(i.audioUrl) || str(i.videoUrl) }),
  },

  stories: {
    defaultModel: "fal-ai/kling-video/v3/pro/text-to-video",
    alternates: [],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 30) }),
    buildFalInput: (i) => ({ prompt: str(i.prompt) }),
  },

  "3d": {
    defaultModel: "fal-ai/hunyuan3d/v2",
    alternates: ["fal-ai/hunyuan3d/v2/turbo", "fal-ai/trellis", "fal-ai/hunyuan3d/v2/multi-view"],
    estimateHint: () => ({}),
    buildFalInput: (i) => ({ image_url: str(i.imageUrl) }),
  },

  effects: {
    defaultModel: "fal-ai/wan-effects",
    alternates: ["fal-ai/pika/v1.5/pikaffects", "fal-ai/pixverse/v3.5/effects", "fal-ai/kling-video/v1.6/pro/effects"],
    estimateHint: () => ({}),
    buildFalInput: (i) => ({ image_url: str(i.imageUrl) || undefined, video_url: str(i.videoUrl) || undefined, effect: str(i.effect) }),
  },

  realtime: {
    defaultModel: "fal-ai/sana/sprint",
    alternates: ["fal-ai/fast-lightning-sdxl"],
    estimateHint: (i) => ({ megapixels: num(i.megapixels, 0.25) }),
    buildFalInput: (i) => ({ prompt: str(i.prompt), image_size: str(i.size, "square_hd") }),
  },

  style: {
    defaultModel: "fal-ai/flux-pro/v1/canny",
    alternates: ["fal-ai/flux-pro/v1/depth", "fal-ai/flux-control-lora-canny"],
    estimateHint: (i) => ({ megapixels: num(i.megapixels, 1) }),
    buildFalInput: (i) => ({ prompt: str(i.prompt), image_url: str(i.imageUrl) }),
  },

  train: {
    defaultModel: "fal-ai/flux-lora-fast-training",
    alternates: ["fal-ai/flux-pro-trainer", "fal-ai/turbo-flux-trainer", "fal-ai/hunyuan-video-lora-training"],
    estimateHint: (i) => ({ trainingSteps: num(i.steps, 1000) }),
    buildFalInput: (i) => ({ images_data_url: str(i.imagesUrl), trigger_word: str(i.triggerWord) }),
  },

  edit: {
    defaultModel: "fal-ai/framepack",
    alternates: ["fal-ai/wan-vace"],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 10) }),
    buildFalInput: (i) => ({ video_url: str(i.videoUrl) }),
  },

  // Internal feature used by the agent executor for individual step jobs.
  "agent-step": {
    defaultModel: "fal-ai/wan-25-preview/text-to-video", // never used as a default — agent always passes modelSlug
    alternates: [],
    estimateHint: (i) => ({ durationSeconds: num(i.durationSeconds, 5), numChars: num(i.numChars, 200), megapixels: num(i.megapixels, 1) }),
    buildFalInput: (i) => i, // pass-through; agent has already resolved placeholders
  },
};

export function defaultModelFor(feature: FeatureKey): string {
  return FEATURE_MODELS[feature].defaultModel;
}

export function isValidFeature(s: string): s is FeatureKey {
  return Object.prototype.hasOwnProperty.call(FEATURE_MODELS, s);
}

export type _Unused = FalUnit;
