# Vidy feature status & E2E checklist

Status as of build pass on this branch. The audit ran end-to-end against the architecture; before flipping any of these to "verified in prod" run the corresponding live test.

## Backbone

- [x] Auth (better-auth) — `/api/auth/[...all]`, `/login`, `/register`, Google OAuth + email/password
- [x] Sessions persisted in `Session` table; 30-day expiry
- [x] Middleware redirects unauthenticated users to `/login` for every feature page
- [x] DB schema applied via `pnpm db:push`; all relations covered
- [x] Cloudflare R2 client + presigned PUT (`/api/uploads/presign`)
- [x] Stripe checkout + customer portal + webhook (`checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted`, `charge.refunded`) with idempotency on `stripeEventId`
- [x] Coin ledger with `debitCoinsOrThrow` / `refundCoins` / `reconcileCoins` and unit-tested `falUsdToCoins`
- [x] Upstash Redis sliding window — `jobs`, `agent`, `expensive`, `upload` limiters
- [x] Structured logger (`src/lib/logger.ts`)

## fal model catalog

- [x] ~200 models seeded across video, image, audio, lipsync, upscale, 3d, avatar, vision, tts, stt, training, text, effects
- [x] `/api/fal/models` returns the catalog with reference coin prices
- [x] `/pricing` page renders bundles + filterable live catalog grid
- [x] Pricing math test green: `pnpm vitest run src/lib/pricing.test.ts`

## Job runner

- [x] `submitJob({userId, feature, modelSlug?, input, agentRunId?, agentStepId?})` debits coins before fal submit
- [x] fal queue submit returns `request_id`; webhook callback (`/api/fal/webhook`) verifies token and HMAC
- [x] Output downloaded to R2 with public URL; reconcile coins when fal echoes a different actual cost
- [x] Auto-refund on submit failure or fal error
- [x] SSE streams: `/api/jobs/[id]/stream` polls every 1.5s and pushes `update` / `done` / `timeout` events

## Feature pages (27)

| Page | Route | Backend | SEO | FAQ | Notes |
|---|---|---|---|---|---|
| Home | `/` | live featured models | ✓ | ✓ | Removed `picsum.photos` mock; real catalog data |
| Generate | `/generate` | `/api/feature/generate` | ✓ | ✓ | Veo 3.1, Kling v3 Pro, Seedance 2, Wan 2.5 |
| Image | `/image` | `/api/feature/image` | ✓ | ✓ | FLUX Ultra, Ideogram V3, Nano Banana, Seedream V4 |
| Video | `/video` | `/api/feature/video` | ✓ | ✓ | Picker + same models as Generate, plus i2v |
| UGC Video | `/ugc-video` | `/api/feature/ugc-video` | ✓ | ✓ | Single-step variant; full pipeline lives at `/agent` template `ios-screenshot-to-ugc-promo` |
| Agent | `/agent` | `/api/agent/runs` | ✓ | ✓ | 30 templates, live SSE DAG |
| Lipsync | `/lipsync` | `/api/feature/lipsync` | ✓ | ✓ | Sync 2.0, Kling Lipsync, Tavus |
| Upscale | `/upscale` | `/api/feature/upscale` | ✓ | ✓ | Topaz Video, DRCT, Creative Upscaler |
| Enhance | `/enhance` | `/api/feature/enhance` | ✓ | ✓ | CodeFormer, NAFNet |
| TTS | `/tts` | `/api/feature/tts` | ✓ | ✓ | ElevenLabs Multilingual + Kokoro per language |
| Audio | `/audio` | `/api/feature/audio` | ✓ | ✓ | Ace-Step, ElevenLabs SFX, MMAudio v2 |
| Dubbing | `/dubbing` | agent template `dub-this-video` | ✓ | ✓ | Pipeline: STT → translate → TTS → lipsync |
| Captions | `/captions` | `/api/feature/captions` | ✓ | ✓ | ElevenLabs STT |
| Clips | `/clips` | `/api/feature/clips` | ✓ | ✓ | STT-driven highlight detection |
| Stories | `/stories` | `/api/feature/stories` | ✓ | ✓ | Multi-shot via agent |
| 3D | `/3d` | `/api/feature/3d` | ✓ | ✓ | Hunyuan3D, TRELLIS |
| Effects | `/effects` | `/api/feature/effects` | ✓ | ✓ | Wan, Pika, PixVerse, Kling effects |
| Realtime | `/realtime` | `/api/feature/realtime` | ✓ | ✓ | SANA Sprint, Fast Lightning SDXL |
| Style | `/style` | `/api/feature/style` | ✓ | ✓ | FLUX Pro Canny/Depth |
| Train | `/train` | `/api/feature/train` | ✓ | ✓ | FLUX LoRA Fast, Pro Trainer, Hunyuan Video LoRA |
| Edit | `/edit` | `/api/feature/edit` | ✓ | ✓ | Server export via Framepack |
| Analytics | `/analytics` | Postgres aggregates | ✓ | ✓ | Per-feature, per-status totals |
| Profile | `/profile` | session + coin balance | ✓ | n/a | |
| Settings | `/settings` | Stripe portal + ledger history | ✓ | n/a | |
| Pricing | `/pricing` | live FalModel + Bundle | ✓ | ✓ | |
| AI-Video-Tools | `/ai-video-tools` | static index | ✓ | ✓ | |
| Demo | `/demo` | ExpandableTabs showcase | n/a | n/a | Internal |

Every feature page imports `FEATURE_SEO[<key>]` and renders `FeatureLayout` + `JsonLd` (FAQ + breadcrumb + optional HowTo).

## SEO + LLM discoverability

- [x] `/sitemap.xml` lists every public route
- [x] `/robots.txt` allows crawling, blocks `/api`, `/profile`, `/settings`
- [x] `/llms.txt` (LLM-discoverability manifest)
- [x] `/llms-full.txt` (full feature + model catalogue dump for LLM ingestion)
- [x] OpenGraph + Twitter card + canonical on every page
- [x] FAQPage JSON-LD on every feature page
- [x] HowTo JSON-LD on Generate, UGC Video
- [x] BreadcrumbList JSON-LD on every page
- [x] SoftwareApplication + Organization JSON-LD in root layout

## E2E test plan (run before launch)

1. **Auth**: sign up via Google → verify session cookie → balance reads 500 (signup bonus). Sign out, sign in via email/password.
2. **Coins**: buy `coins_5k` bundle on Stripe test → webhook fires → `CoinLedger` row `+5000 reason=purchase` → balance updates. Refund the charge → ledger row `-5000 reason=refund`.
3. **Pricing math**: `pnpm vitest run` (9 tests pass) — represents the contract between the seeder and the runtime.
4. **Generate text-to-video**: prompt → Wan 2.5 → mp4 in R2 → debit ≈ 750 coins.
5. **Image**: prompt → FLUX 1.1 Pro Ultra → image in R2 → debit 180 coins.
6. **Lipsync**: face + audio → sync-lipsync/v2 → mp4 → debit ≈ 9 000 coins/min.
7. **Upscale**: 480p mp4 → topaz/upscale/video → 4K mp4 → debit per-second.
8. **TTS, Audio, Dubbing, Captions, Clips, Stories, 3D, Effects, Realtime, Style, Train, UGC-Video, Edit, Enhance, Analytics, AI-Video-Tools**: each produces a real artifact (or, for Realtime/Edit/Analytics, the appropriate non-fal artifact).
9. **Agent E2E**: upload an iOS screenshot, prompt *"make a 15-second UGC promo"*, see plan render, watch each step complete (device-frame → animate → voiceover → music), final mp4 plays. Total cost = sum of step costs.
10. **Failure paths**: invalid input → job marked failed → coins refunded → user sees clear error. Insufficient balance → submit blocked with 402 + CTA. Rate-limit → 429 with `Retry-After`.
11. **Coolify deploy**: `docker build .` → push image → Coolify rolling deploy → smoke 3 jobs against the live URL.
