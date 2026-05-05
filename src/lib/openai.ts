import "server-only";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const PLANNER_MODEL = process.env.OPENAI_PLANNER_MODEL || "gpt-5";
export const REFLECTOR_MODEL = process.env.OPENAI_REFLECTOR_MODEL || "gpt-5-mini";
export const VISION_MODEL = process.env.OPENAI_VISION_MODEL || "gpt-5";

export function openaiConfigured(): boolean {
  return !!openai;
}

export function requireOpenAI(): OpenAI {
  if (!openai) throw new Error("OPENAI_API_KEY not configured");
  return openai;
}
