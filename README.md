# Vidy — Agentic AI Video Studio

Vidy generates, edits, dubs, lipsyncs, upscales and animates video by orchestrating **200+ generative AI models** through a single agent. Pay in transparent **Computational Coins** (1 coin = $0.001), buy a bundle once, spend across every feature.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Auth**: [better-auth](https://better-auth.com) with Google OAuth + email/password
- **DB**: Prisma + PostgreSQL
- **Storage**: Cloudflare R2 (S3-compatible)
- **Payments**: Stripe (one-shot bundles + Pro Unlimited subscription)
- **AI**: `@fal-ai/client` queue API + webhook callbacks; OpenAI GPT-5 for the agent planner
- **Rate limit**: Upstash Redis sliding window
- **Deploy**: Coolify (Dockerfile + Postgres service; R2/Stripe/fal/OpenAI external)

## Quick start

```bash
pnpm install
cp .env.example .env.local
# Fill DATABASE_URL, BETTER_AUTH_SECRET, FAL_KEY, OPENAI_API_KEY, R2_*, STRIPE_*, etc.
pnpm db:push
pnpm db:seed:fal     # seeds ~200 fal.ai models with coin pricing
pnpm db:seed:bundles # seeds the 4 Stripe SKUs
pnpm dev
```

Visit http://localhost:3000.

## Features (all wired end-to-end)

| Page | Purpose |
|---|---|
| `/generate`, `/video` | Text-to-video (Veo 3.1, Kling v3 Pro, Seedance 2, Wan 2.5) |
| `/image` | Text-to-image (FLUX Pro Ultra, Ideogram V3, Nano Banana, Seedream V4) |
| `/ugc-video` | Phone screenshot → finished UGC ad (delegates to agent) |
| `/agent` | Free-form agent: "make me a UGC promo from this iOS screenshot" → planner builds a DAG of 5–10 model calls |
| `/lipsync` | Sync Lipsync 2.0, Kling Lipsync, Tavus Hummingbird |
| `/upscale` | Topaz Video Upscale, DRCT, Creative Upscaler, Swin2SR |
| `/enhance` | CodeFormer, NAFNet Denoise/Deblur, Dehaze |
| `/tts` | ElevenLabs Multilingual v2, Minimax Speech-02 HD, Kokoro per language |
| `/audio` | Ace-Step music, ElevenLabs SFX, MMAudio v2 video scoring |
| `/dubbing` | STT → GPT-5 translate → Kokoro voice → Sync Lipsync 2.0 |
| `/captions` | ElevenLabs STT with word-level timing |
| `/clips` | Long-form to viral 60s clip (STT + GPT-5 highlight detection) |
| `/stories` | Multi-shot narrative video (storyboard → images → animations → narration) |
| `/3d` | Hunyuan3D v2, TRELLIS, Multi-View |
| `/effects` | Wan Effects, Pika Pikaffects, PixVerse Effects, Kling Effects |
| `/realtime` | SANA Sprint, Fast Lightning SDXL — sub-second generations |
| `/style` | FLUX Pro Canny, Depth, Control LoRA |
| `/train` | FLUX LoRA Fast, FLUX Pro Trainer, Hunyuan Video LoRA |
| `/edit` | Browser ffmpeg-wasm timeline + server export via Framepack |
| `/analytics` | Per-feature usage, coin spend, completed/failed totals |
| `/profile`, `/settings` | Account, plan, coin history, Stripe portal |
| `/pricing` | Live model catalogue with coin prices + 4 bundle SKUs |
| `/ai-video-tools` | Index of every tool |

Plus: `/api/auth/*`, `/api/coins/*`, `/api/stripe/*`, `/api/jobs/*`, `/api/feature/<name>`, `/api/agent/runs/*`, `/api/agent/templates`, `/api/fal/{models,webhook}`, `/api/uploads/presign`. SEO: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`. Every feature page ships with metadata, OpenGraph, Twitter card, FAQ JSON-LD, breadcrumb LD, and (where relevant) HowTo LD.

## Computational Coins

`1 coin = $0.001`. Pricing rule, single source of truth ([src/lib/pricing.ts](src/lib/pricing.ts)):

```ts
falUsdToCoins(usd) = Math.ceil(usd × 3 × 1000)
```

A 5-second Kling 2.5 Turbo Pro clip ($0.07/sec × 5 = $0.35 raw) costs the user **1 050 coins**. Coins debit before submit, reconcile when fal echoes the actual cost, and refund on failure.

## Agent

`/agent` (or any page that delegates) submits to `/api/agent/runs`:

1. **Planner** — GPT-5 receives the prompt + uploaded refs + the FalModel registry. It returns a strict-JSON DAG validated against the live model catalog. If GPT-5 isn't configured, a template guess fallback runs ([src/lib/agent/planner.ts](src/lib/agent/planner.ts)).
2. **Executor** — topo-sorts the DAG, resolves `{{step.<key>.outputUrl}}` and `{{input.<name>}}` placeholders, calls `submitJob` per step (which goes through fal queue + R2 + coin debit), and persists each `AgentStep` ([src/lib/agent/executor.ts](src/lib/agent/executor.ts)).
3. **Stream** — `/api/agent/runs/[id]/stream` pushes step status changes over SSE.

Thirty starter templates ship in [src/lib/agent/templates.ts](src/lib/agent/templates.ts) — iOS UGC promo, app preview, real-estate walkthrough, dub-this-video, music video from lyrics, kids story animation, podcast → shorts, and more. The planner can pick a template or build a freeform DAG.

## Coolify deploy

```
1. Create a new "Application" pointed at this repo.
2. Build pack: Dockerfile (already at repo root, multi-stage, Next.js standalone).
3. Add a "PostgreSQL" service in the same project; copy the connection string into DATABASE_URL.
4. Set every env var from .env.example. R2/Stripe/fal/OpenAI/Resend/Upstash/Google OAuth all stay external.
5. Deploy. After first boot run: pnpm db:push && pnpm db:seed:fal && pnpm db:seed:bundles.
```

## Test the pipeline

- `pnpm test` runs the pricing math suite (`src/lib/pricing.test.ts`).
- `pnpm typecheck` for full TS validation.
- `pnpm build` produces a production build (matches the Coolify image).
- E2E checklist lives in [docs/feature-status.md](docs/feature-status.md).

## Project layout

```
prisma/                 schema.prisma, seeds/{fal-models, bundles}.ts
src/lib/                auth, db, r2, stripe, coins, fal, openai, pricing, rate-limit, logger, jobs, hooks, agent/{planner,executor,templates,types}
src/components/         feature/{JobConsole,FeatureLayout,FeaturePage,ModelOptionsLoader}, seo/{JsonLd,FaqSection}
src/app/                27 feature pages + auth + api routes + sitemap/robots/llms.txt
src/middleware.ts       session-cookie gate for protected pages
Dockerfile              multi-stage Next.js standalone for Coolify
```
