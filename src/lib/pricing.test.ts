import { describe, expect, it } from "vitest";
import { estimateCoins, estimateFalUsd, falUsdToCoins } from "./pricing";

describe("falUsdToCoins", () => {
  it("multiplies by 3 then by 1000 and ceils", () => {
    expect(falUsdToCoins(0.07 * 5)).toBe(1050); // Kling 2.5 Turbo Pro, 5s
    expect(falUsdToCoins(0.05 * 5)).toBe(750); // Wan 2.5, 5s
    // 0.4 * 8 has fp-rounding noise; ceil gives 9601 — we always round UP so we never lose money.
    expect(falUsdToCoins(0.4 * 8)).toBe(9601); // Veo 3.1, 8s
    expect(falUsdToCoins(0.06)).toBe(180); // Flux 1.1 Pro Ultra, 1 image
  });

  it("returns 0 for non-positive inputs", () => {
    expect(falUsdToCoins(0)).toBe(0);
    expect(falUsdToCoins(-0.1)).toBe(0);
  });

  it("ceils sub-cent values to at least 1 coin", () => {
    expect(falUsdToCoins(0.0001)).toBe(1); // 0.0001 * 3 * 1000 = 0.3 → ceil 1
  });
});

describe("estimateFalUsd", () => {
  it("per_second uses durationSeconds", () => {
    expect(estimateFalUsd("per_second", 0.07, { durationSeconds: 5 })).toBeCloseTo(0.35, 5);
  });
  it("per_5_second_video buckets up", () => {
    expect(estimateFalUsd("per_5_second_video", 0.45, { durationSeconds: 5 })).toBeCloseTo(0.45, 5);
    expect(estimateFalUsd("per_5_second_video", 0.45, { durationSeconds: 6 })).toBeCloseTo(0.9, 5);
  });
  it("per_minute scales by seconds/60", () => {
    expect(estimateFalUsd("per_minute", 3, { durationSeconds: 30 })).toBeCloseTo(1.5, 5);
  });
  it("per_megapixel scales by megapixels and numImages", () => {
    expect(estimateFalUsd("per_megapixel", 0.04, { megapixels: 1, numImages: 4 })).toBeCloseTo(0.16, 5);
    expect(estimateFalUsd("per_megapixel", 0.04, { megapixels: 2, numImages: 1 })).toBeCloseTo(0.08, 5);
  });
  it("per_1k_chars scales by char count", () => {
    expect(estimateFalUsd("per_1k_chars", 0.1, { numChars: 200 })).toBeCloseTo(0.02, 5);
    expect(estimateFalUsd("per_1k_chars", 0.1, { numChars: 1500 })).toBeCloseTo(0.15, 5);
  });
});

describe("estimateCoins", () => {
  it("composes estimateFalUsd and falUsdToCoins", () => {
    expect(estimateCoins("per_second", 0.07, { durationSeconds: 5 })).toBe(1050);
    expect(estimateCoins("per_image", 0.06, { numImages: 1 })).toBe(180);
    expect(estimateCoins("per_minute", 3, { durationSeconds: 60 })).toBe(9000);
  });
});
