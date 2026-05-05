# Vidy.ai – Environment Setup

> Follow these steps to spin up Vidy.ai locally and on Vercel.

---

## 1. Prerequisites

* **Node LTS ≥ 20** (use `nvm install 20 && nvm use 20`)
* **pnpm ≥ 9** → `npm i -g pnpm`
* **Supabase CLI** → `brew install supabase/tap/supabase`
* **Firebase CLI** → `npm i -g firebase-tools`
* **Vercel CLI** → `npm i -g vercel`

---

## 2. Clone & install

```bash
# clone
git clone https://github.com/your-org/vidy-ai.git && cd vidy-ai

# install deps (workspace aware)
pnpm install --frozen-lockfile
```

---

## 3. Environment variables

Copy `.env.example` → `.env.local` then populate:

```bash
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL="https://<project-id>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<public-anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

# === Stripe ===
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# === Firebase ===
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="vidy-ai"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-..."

# === Fal.ai ===
FAL_API_KEY="fal_sk_..."

# === Azure OpenAI (Virality scoring) ===
AZURE_OPENAI_ENDPOINT="https://<res>.openai.azure.com/"
AZURE_OPENAI_API_KEY="..."
AZURE_OPENAI_MODEL="gpt-4o"
```

> **Tip:** Prefix client‑exposed keys with `NEXT_PUBLIC_` as per Next.js rules ([reddit.com](https://www.reddit.com/r/Supabase/comments/12ehsx3/supabase_and_nextjs_environment_variables/?utm_source=chatgpt.com)).

Commit `.env.local` **only** to your secrets store; never to git.

---

## 4. Supabase local stack

```bash
supabase init              # creates supabase/.env, supabase/config.toml
supabase start             # spins up Postgres + Studio locally
```

Run the SQL in `/supabase/schema.sql` to create `videos`, `credits`, etc.

---

## 5. Stripe webhook

```bash
stripe login               # CLI auth
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Keys live in Stripe Dashboard → Developers > API keys ([stackoverflow.com](https://stackoverflow.com/questions/69327122/next-js-stripe-environment-variable-in-vercel?utm_source=chatgpt.com)).

---

## 6. Firebase Analytics

```bash
firebase login
firebase use --add vidy-ai
firebase analytics:enable
```

Import GA4 in client: `import { getAnalytics } from "firebase/analytics";` ([stackoverflow.com](https://stackoverflow.com/questions/66812479/nextjs-how-to-correctly-add-firebase-analytics-to-nextjs-app?utm_source=chatgpt.com)).

---

## 7. Dev server

```bash
pnpm dev     # next dev on http://localhost:3000
```

Hot‑reload is enabled.

---

## 8. Deploy to Vercel

```bash
vercel link        # connect project
vercel env pull    # pulls env into .env.local
vercel             # first deploy
```

Monorepo env docs: Vercel auto‑detects workspaces ([vercel.com](https://vercel.com/docs/monorepos?utm_source=chatgpt.com)).

---

## 9. Lint, test, build

```bash
pnpm lint
pnpm test          # vitest
pnpm build         # next build
```

---

## 10. Updating packages

Context7 MCP keeps deps evergreen—run weekly:

```bash
pnpm dlx context7-mcp update
```

---

You're ready! Questions? See `/README.md` or ping @dev‑ops. 