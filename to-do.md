# Vidy — Status

Original MVP list (all done):

- [x] Scaffold Next.js app
- [x] Install Tailwind + Shadcn-style components
- [x] Auth (better-auth with Google OAuth + email/password)
- [x] DB (Prisma + PostgreSQL) with full schema (users, sessions, coin ledger, jobs, agent runs/steps, fal model catalog, bundles, payment events)
- [x] Stripe products: 4 bundles (5K / 25K / 100K / Pro Unlimited monthly) + checkout + portal + webhook
- [x] Coin ledger with 3× markup on fal cost, ceil rounding, idempotent debit/refund/reconcile
- [x] /generate, /image, /video, /ugc-video and 22 other feature pages — all wired through `/api/feature/<name>` + fal queue + webhook + R2 + SSE
- [x] Computational Coins live catalogue at /pricing (200+ models seeded)
- [x] Agentic pipeline: planner (GPT-5) + executor + 30 templates + live SSE step view
- [x] SEO: per-page metadata, OpenGraph, Twitter card, FAQ JSON-LD, HowTo LD, breadcrumb LD, sitemap.xml, robots.txt, llms.txt, llms-full.txt
- [x] Coolify deployment: multi-stage Dockerfile + standalone Next.js build

What is intentionally **not** in v1 (parked):

- Inngest / BullMQ (fal queue + webhooks cover long-running jobs without an extra service)
- Browser ffmpeg-wasm timeline editor on /edit (route exists, server export wired; client timeline UI is the next pass)
- /realtime WebSocket streaming (page works via fal subscribe; full canvas streaming is a follow-up)
- Firebase GA4 event hooks (PostHog placeholder is wired; GA4 is one env-var addition)

For the verification checklist see [docs/feature-status.md](docs/feature-status.md).
