/**
 * Per-feature UI config for the JobConsole. Centralises field definitions,
 * default model lists, and result kinds so each page module is a one-liner.
 */

import type { FieldDef, ResultKind } from "@/components/feature/JobConsole";
import type { FeatureKey } from "./feature-models";
import { FEATURE_MODELS } from "./feature-models";

export type FeatureUI = {
  fields: FieldDef[];
  resultKind: ResultKind;
  modelSlugs: string[];
};

const aspectOptions = [
  { value: "16:9", label: "16:9 widescreen" },
  { value: "9:16", label: "9:16 vertical" },
  { value: "1:1", label: "1:1 square" },
  { value: "4:5", label: "4:5 portrait" },
];

const durationOptions = [
  { value: "4", label: "4 seconds" },
  { value: "5", label: "5 seconds" },
  { value: "6", label: "6 seconds" },
  { value: "8", label: "8 seconds" },
  { value: "10", label: "10 seconds" },
];

export type UserFeatureKey = Exclude<FeatureKey, "agent-step">;

export const FEATURE_UI: Record<UserFeatureKey, FeatureUI> = {
  generate: {
    fields: [
      { key: "prompt", label: "Prompt", kind: "prompt", required: true, placeholder: "A cinematic shot of a fox running through a snowy forest, golden hour" },
      { key: "negativePrompt", label: "Negative prompt", kind: "negativePrompt", placeholder: "blurry, distorted" },
      { key: "durationSeconds", label: "Duration", kind: "select", options: durationOptions, default: "5" },
      { key: "aspectRatio", label: "Aspect ratio", kind: "select", options: aspectOptions, default: "16:9" },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS.generate.defaultModel, ...FEATURE_MODELS.generate.alternates],
  },
  video: {
    fields: [
      { key: "prompt", label: "Prompt", kind: "prompt", placeholder: "Optional — leave empty if using an image" },
      { key: "imageUrl", label: "Reference image (optional)", kind: "fileImage" },
      { key: "durationSeconds", label: "Duration", kind: "select", options: durationOptions, default: "5" },
      { key: "aspectRatio", label: "Aspect ratio", kind: "select", options: aspectOptions, default: "16:9" },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS.video.defaultModel, ...FEATURE_MODELS.video.alternates],
  },
  image: {
    fields: [
      { key: "prompt", label: "Prompt", kind: "prompt", required: true, placeholder: "A neon-lit Tokyo alleyway at midnight, photorealistic" },
      { key: "numImages", label: "Variations", kind: "number", default: 1, min: 1, max: 4, step: 1 },
      { key: "aspectRatio", label: "Aspect ratio", kind: "select", options: aspectOptions, default: "1:1" },
    ],
    resultKind: "image",
    modelSlugs: [FEATURE_MODELS.image.defaultModel, ...FEATURE_MODELS.image.alternates],
  },
  "ugc-video": {
    fields: [
      { key: "imageUrl", label: "App screenshot", kind: "fileImage", required: true },
      { key: "prompt", label: "Product description", kind: "prompt", required: true, placeholder: "A focus app that blocks distractions for creators" },
      { key: "durationSeconds", label: "Length", kind: "select", options: [{ value: "8", label: "8 s" }, { value: "15", label: "15 s" }, { value: "30", label: "30 s" }], default: "15" },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS["ugc-video"].defaultModel, ...FEATURE_MODELS["ugc-video"].alternates],
  },
  lipsync: {
    fields: [
      { key: "videoUrl", label: "Face video", kind: "fileVideo", required: true },
      { key: "audioUrl", label: "Voice track", kind: "fileAudio", required: true },
      { key: "syncMode", label: "Sync mode", kind: "select", options: [{ value: "loop", label: "Loop video" }, { value: "stretch", label: "Stretch video" }], default: "loop" },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS.lipsync.defaultModel, ...FEATURE_MODELS.lipsync.alternates],
  },
  upscale: {
    fields: [
      { key: "videoUrl", label: "Video to upscale (optional)", kind: "fileVideo" },
      { key: "imageUrl", label: "Image to upscale (optional)", kind: "fileImage" },
      { key: "targetResolution", label: "Target resolution", kind: "select", options: [{ value: "1080p", label: "1080p" }, { value: "4K", label: "4K" }], default: "4K" },
      { key: "upscaleFactor", label: "Factor", kind: "number", default: 2, min: 2, max: 4, step: 1 },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS.upscale.defaultModel, ...FEATURE_MODELS.upscale.alternates],
  },
  enhance: {
    fields: [
      { key: "imageUrl", label: "Image to enhance", kind: "fileImage", required: true },
      { key: "fidelity", label: "Fidelity (0–1)", kind: "number", default: 0.5, min: 0, max: 1, step: 0.1 },
    ],
    resultKind: "image",
    modelSlugs: [FEATURE_MODELS.enhance.defaultModel, ...FEATURE_MODELS.enhance.alternates],
  },
  tts: {
    fields: [
      { key: "text", label: "Script", kind: "prompt", required: true, placeholder: "Type the script you want narrated" },
      { key: "voice", label: "Voice id (optional)", kind: "shortText", placeholder: "e.g. Rachel, James" },
      { key: "languageCode", label: "Language", kind: "select", options: [
        { value: "", label: "Auto" },
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
        { value: "it", label: "Italian" },
        { value: "pt", label: "Portuguese" },
        { value: "ja", label: "Japanese" },
        { value: "zh", label: "Mandarin" },
        { value: "hi", label: "Hindi" },
      ], default: "" },
    ],
    resultKind: "audio",
    modelSlugs: [FEATURE_MODELS.tts.defaultModel, ...FEATURE_MODELS.tts.alternates],
  },
  audio: {
    fields: [
      { key: "prompt", label: "Audio description", kind: "prompt", required: true, placeholder: "Lo-fi beat with rain and vinyl crackle" },
      { key: "videoUrl", label: "Video to score (optional)", kind: "fileVideo" },
      { key: "durationSeconds", label: "Duration", kind: "number", default: 10, min: 1, max: 60, step: 1 },
    ],
    resultKind: "audio",
    modelSlugs: [FEATURE_MODELS.audio.defaultModel, ...FEATURE_MODELS.audio.alternates],
  },
  dubbing: {
    fields: [
      { key: "videoUrl", label: "Source video", kind: "fileVideo", required: true },
      { key: "targetLanguage", label: "Target language", kind: "select", options: [
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
        { value: "ja", label: "Japanese" },
        { value: "hi", label: "Hindi" },
        { value: "pt", label: "Portuguese" },
        { value: "zh", label: "Mandarin" },
      ], default: "es" },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS.dubbing.defaultModel],
  },
  captions: {
    fields: [
      { key: "videoUrl", label: "Video", kind: "fileVideo", required: true },
    ],
    resultKind: "json",
    modelSlugs: [FEATURE_MODELS.captions.defaultModel, ...FEATURE_MODELS.captions.alternates],
  },
  clips: {
    fields: [
      { key: "videoUrl", label: "Long-form video", kind: "fileVideo", required: true },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS.clips.defaultModel],
  },
  stories: {
    fields: [
      { key: "prompt", label: "Story", kind: "prompt", required: true, placeholder: "An astronaut discovers an oasis on Mars" },
      { key: "durationSeconds", label: "Total length", kind: "select", options: [{ value: "30", label: "30 s" }, { value: "60", label: "60 s" }, { value: "90", label: "90 s" }], default: "30" },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS.stories.defaultModel],
  },
  "3d": {
    fields: [
      { key: "imageUrl", label: "Object photo", kind: "fileImage", required: true },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS["3d"].defaultModel, ...FEATURE_MODELS["3d"].alternates],
  },
  effects: {
    fields: [
      { key: "imageUrl", label: "Source image", kind: "fileImage" },
      { key: "videoUrl", label: "Source video", kind: "fileVideo" },
      { key: "effect", label: "Effect", kind: "select", options: [
        { value: "explode", label: "Explode" },
        { value: "melt", label: "Melt" },
        { value: "ageing", label: "Ageing" },
        { value: "transition", label: "Transition" },
      ], default: "explode" },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS.effects.defaultModel, ...FEATURE_MODELS.effects.alternates],
  },
  realtime: {
    fields: [
      { key: "prompt", label: "Prompt", kind: "prompt", required: true, placeholder: "Sub-second updates" },
      { key: "size", label: "Size", kind: "select", options: [{ value: "square_hd", label: "Square HD" }, { value: "portrait", label: "Portrait" }], default: "square_hd" },
    ],
    resultKind: "image",
    modelSlugs: [FEATURE_MODELS.realtime.defaultModel, ...FEATURE_MODELS.realtime.alternates],
  },
  style: {
    fields: [
      { key: "imageUrl", label: "Source image", kind: "fileImage", required: true },
      { key: "prompt", label: "New style prompt", kind: "prompt", required: true, placeholder: "anime style, soft lighting" },
    ],
    resultKind: "image",
    modelSlugs: [FEATURE_MODELS.style.defaultModel, ...FEATURE_MODELS.style.alternates],
  },
  train: {
    fields: [
      { key: "imagesUrl", label: "Training images zip URL", kind: "url", required: true, placeholder: "Upload a zip of 5–20 images, paste public URL" },
      { key: "triggerWord", label: "Trigger word", kind: "shortText", required: true, placeholder: "e.g. baranavatar" },
      { key: "steps", label: "Training steps", kind: "number", default: 1000, min: 250, max: 4000, step: 100 },
    ],
    resultKind: "json",
    modelSlugs: [FEATURE_MODELS.train.defaultModel, ...FEATURE_MODELS.train.alternates],
  },
  edit: {
    fields: [
      { key: "videoUrl", label: "Video to re-encode", kind: "fileVideo", required: true },
    ],
    resultKind: "video",
    modelSlugs: [FEATURE_MODELS.edit.defaultModel, ...FEATURE_MODELS.edit.alternates],
  },
};
