import type { FalUnit } from "./pricing";
import { estimateCoins } from "./pricing";

export function unitDisplay(unit: string): string {
  return unit.replace(/^per_/, "per ").replace(/_/g, " ");
}

export function modelStudioRoute(category: string): string {
  switch (category) {
    case "video":
    case "effects":
      return "/studio/video";
    case "image":
      return "/studio/image";
    case "tts":
      return "/studio/voice";
    case "stt":
      return "/studio/captions";
    case "audio":
      return "/studio/audio";
    case "3d":
      return "/studio/3d";
    case "lipsync":
      return "/studio/lipsync";
    case "upscale":
      return "/studio/upscale";
    case "training":
      return "/studio/train";
    default:
      return "/studio";
  }
}

export function priceLabel(unit: string, unitPriceUsd: number): { coins: number; unit: string } {
  return {
    coins: estimateCoins(unit as FalUnit, unitPriceUsd, {}),
    unit: unitDisplay(unit),
  };
}

/** URL-safe slug for /studio/models/[...slug] */
export function modelPathSegments(slug: string): string[] {
  return slug.replace(/^fal-ai\//, "").split("/").filter(Boolean);
}

export function modelPathFromSlug(slug: string): string {
  return `/studio/models/${modelPathSegments(slug).join("/")}`;
}

export function slugFromPathSegments(segments: string[]): string {
  return `fal-ai/${segments.join("/")}`;
}
