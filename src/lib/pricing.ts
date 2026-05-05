/**
 * Computational Coins pricing.
 * 1 coin = $0.001 user-paid. Markup = 3× over fal raw cost.
 * Always ceil so we never lose money on rounding.
 */

export const COIN_PER_USD = 1000;
export const FAL_MARKUP = 3;

export function falUsdToCoins(falUsd: number): number {
  if (falUsd <= 0) return 0;
  return Math.ceil(falUsd * FAL_MARKUP * COIN_PER_USD);
}

export function coinsToUsd(coins: number): number {
  return coins / COIN_PER_USD;
}

/**
 * Estimate fal cost in USD for a given model + params.
 * Each fal billing unit has a corresponding estimator branch.
 *
 * Inputs:
 *   - unit & unitPriceUsd come from the FalModel row.
 *   - params describe the request (duration, megapixels, char count, ...).
 *
 * Returns USD cost. Caller can pass to falUsdToCoins() to get the coin price.
 */
export type FalUnit =
  | "per_second"
  | "per_video"
  | "per_megapixel"
  | "per_image"
  | "per_1k_chars"
  | "per_minute"
  | "per_compute_second"
  | "per_request"
  | "per_generation"
  | "per_step"
  | "per_training_run"
  | "per_audio_second"
  | "per_video_second"
  | "per_5_second_video"
  | "per_4_second_video"
  | "per_10_seconds"
  | "per_template"
  | "per_voice"
  | "per_mask"
  | "per_unit";

export type EstimateParams = {
  durationSeconds?: number;
  megapixels?: number;
  numImages?: number;
  numChars?: number;
  audioSeconds?: number;
  computeSeconds?: number; // best-effort estimate; default 5s
  trainingSteps?: number;
};

export function estimateFalUsd(
  unit: FalUnit,
  unitPriceUsd: number,
  params: EstimateParams = {},
): number {
  const {
    durationSeconds = 5,
    megapixels = 1,
    numImages = 1,
    numChars = 200,
    audioSeconds = 5,
    computeSeconds = 5,
    trainingSteps = 1000,
  } = params;

  switch (unit) {
    case "per_second":
    case "per_video_second":
    case "per_audio_second":
      return unitPriceUsd * durationSeconds;
    case "per_minute":
      return unitPriceUsd * (durationSeconds / 60);
    case "per_10_seconds":
      return unitPriceUsd * Math.ceil(durationSeconds / 10);
    case "per_5_second_video":
      return unitPriceUsd * Math.ceil(durationSeconds / 5);
    case "per_4_second_video":
      return unitPriceUsd * Math.ceil(durationSeconds / 4);
    case "per_video":
    case "per_request":
    case "per_generation":
    case "per_template":
    case "per_voice":
    case "per_mask":
    case "per_unit":
      return unitPriceUsd;
    case "per_image":
      return unitPriceUsd * numImages;
    case "per_megapixel":
      return unitPriceUsd * megapixels * numImages;
    case "per_1k_chars":
      return unitPriceUsd * (numChars / 1000);
    case "per_compute_second":
      return unitPriceUsd * computeSeconds;
    case "per_training_run":
      return unitPriceUsd;
    case "per_step":
      return unitPriceUsd * trainingSteps;
    default: {
      const _exhaustive: never = unit;
      void _exhaustive;
      return unitPriceUsd;
    }
  }
}

export function estimateCoins(
  unit: FalUnit,
  unitPriceUsd: number,
  params: EstimateParams = {},
): number {
  return falUsdToCoins(estimateFalUsd(unit, unitPriceUsd, params));
}
