# Cursor Prompts – Page Bundle

Unified prompt definitions the Cursor agent references when generating or editing code for each page.

---

## `home.prompt`

```txt
# System
You are building the **Home** page of Vidy.ai.

## Goals
- Render hero section with headline, sub‑headline, CTA buttons.
- Display 3 FeatureShortcut cards (linking to /generate, /clips, /dubbing).
- Show RecentVideos masonry grid (fetch last 12 public videos via `supabase.from('videos')`).
- Dark‑mode first, flat colours, no gradients.
- Use Shadcn `Button`, `Card`, `Tooltip`.

## Constraints
- Data loads via SWR.
- Grid responsive: min width 200 px, gap‑4.
- Prefer React Server Components where feasible.
```

---

## `generate.prompt`

```txt
# System
You are implementing **AI Video Generator** (`/generate`).

## Workflow
1. Center `PromptBox` (import from `@/components/PromptBox`).
2. Under box render StartFrame, EndFrame, Resolution, Orientation, Style Selects.
3. Left Toolbar (`SessionBar`): `+` button => new session; list sessions ordered by `created_at DESC`.
4. Bottom‑left `ModelSelect` fetches fal.ai models and stores choice in `models` state.
5. On submit: call `/api/fal/generate` with form + model + credit check.
6. Push returned `video_url` into current session list and Supabase.

## UI Rules
- Tooltips on every icon.
- Use `use-debounce` for prompt typing (300 ms) to avoid spamming.
- Use ui-map.md file to apply ui needs.

---

## `clips.prompt`

```txt
# System
You are implementing **Clip Generator** (`/clips`).

## Steps
1. Replace PromptBox with `LinkInput` (validates YouTube/TikTok/Vimeo URLs).
2. On submit, POST `/api/sieve/autocrop` with the link.
3. Receive array of 10 clips + `virality_score`.
4. Render each clip in SessionBar, highest score first, badge displays score 0‑100.
5. Secondary actions per clip: regenerate, extend, share, download.

## Constraints
- Re‑use SessionBar component from `/generate`.
- Debounce submit 2 s to avoid double billing.
- Use ui-map.md file to apply ui needs.

---

## `dubbing.prompt`

```txt
# System
You are implementing **Dubbing** (`/dubbing`).

## Workflow
1. VideoUploadOrLink component in centre (drag‑drop or URL).
2. `LanguageSelect` with 25 ISO 639‑1 options.
3. `VoiceCloneToggle` (+3× credits) → when enabled, send `voice_clone=true`.
4. Submit: POST `/api/sieve/dubbing`.
5. Store dubbed video in Supabase and link in SessionBar.

## UI Rules
- Show credit cost preview before submit.
- Display progress bar with polling endpoint `/api/jobs/:id`.
- Use ui-map.md file to apply ui needs.

---

## `effects.prompt`

```txt
# System
You are implementing **Effects** (`/effects`).

## Steps
1. Fetch Wan effect presets via `/api/fal/wan/effects`.
2. Display in `EffectGrid` (Shadcn `Card`).
3. Selecting an effect opens `EffectPanel` right‑side sheet with sliders: strength, duration, blend.
4. `Preview` button → 3 s sample via `/api/fal/wan/preview` (no credit charge).
5. `Apply` button debits credits, POST `/api/fal/wan/apply`.

## UI Constraints
- Maintain toolbar/session UX parity with `/generate`.
- Tooltip cost estimate under Apply.
- Use ui-map.md file to apply ui needs.

---

## `settings.prompt`

```txt
# System
You are implementing **Settings** (`/settings`).

## Modules
- `ProfileForm` (name, avatar, email — Supabase update).
- `PlanSection` pulls Stripe subscription via `/api/stripe/plan`.
- `CreditHistory` table (last 50 transactions).
- `LogoutButton` (Supabase `signOut`).

## UI Rules
- Each section collapsible (Shadcn Accordion).
- Use optimistic updates with SWR mutate.
- Use ui-map.md file to apply ui needs.

---

## `pricing.prompt`

```txt
# System
You are implementing **Pricing** (`/pricing`).

## Content
- 3 PlanCards: Basic, Pro, Enterprise.
- Feature matrix (Shadcn `Table` → sticky header).
- CTA buttons trigger `/api/stripe/checkout` with plan id.
- Separate Credit Add‑On section (buy 100, 500, 1000 credits).

## Rules
- Prices fetched live from Stripe Price API.
- Show price in user's locale with `Intl.NumberFormat`.
- Use ui-map.md file to apply ui needs.
```

# Video AI Platform Prompts

## Regular Agent Prompts

### Video Generation
- "Create a cinematic video of a sunset over mountains"
- "Generate a futuristic cityscape video with neon lights"
- "Make a nature documentary style video of a forest"

### Video Editing
- "Add smooth transitions and color grading to make it cinematic"
- "Cut this video into 30-second social media clips"
- "Remove background noise and enhance audio quality"

## 🆕 Workflow Agent Prompts

*These prompts work with the new Workflow Agent that creates multi-step plans*

### UGC Video Workflows
- "Create a UGC video using the images I uploaded with captions and testimonial style"
- "Build an authentic user-generated content video from my photos and add subtitles"
- "Make a testimonial video from these images with automated captions"

### Image to Video Workflows
- "Turn these images into a dynamic video and enhance the quality"
- "Create a cinematic video from my uploaded images with smooth transitions"
- "Animate these photos into a video and add stylistic effects"

### Video Enhancement Workflows
- "Edit this video, add dubbing in Spanish, and sync the lip movements"
- "Enhance the video quality, apply artistic style, and generate captions"
- "Cut the best parts, upscale to 4K, and add professional effects"

### Complex Multi-Step Workflows
- "Create a 3D animation from these images, add text-to-speech narration, and generate automatic captions"
- "Edit this video into clips, add dubbing in French with lip sync, and create a style transfer effect"
- "Generate a video from text, enhance quality, add effects, create captions, and provide analytics"

### 3D Content Workflows
- "Create 3D models from these images and generate a rotating animation video"
- "Build a 3D scene and add cinematic camera movements"

### Style Transfer Workflows  
- "Apply a Van Gogh painting style to this video and enhance the artistic effect"
- "Transform this video into anime style and add dynamic effects"

### Content Analysis Workflows
- "Analyze this video content, generate insights, and create an executive summary"
- "Extract key moments, create clips, and provide detailed analytics"

## Testing Instructions

1. **Navigate to Agent page**: `/agent`
2. **Select "Workflow Agent"** from the model dropdown (look for the ⚙️ icon)
3. **Upload files** (optional): Drag images, videos, or audio files
4. **Enter one of the workflow prompts** above
5. **Review the generated workflow plan** with steps and costs
6. **Approve and watch execution** in real-time

## Expected Workflow Examples

### Example 1: UGC + Captions
**Input**: Upload 3 images + "Create a UGC video with captions"
**Workflow**:
- Step 1: Generate UGC Video (11 credits, 3 min)
- Step 2: Add Captions (4 credits, 1 min)
- **Total**: 15 credits, 4 minutes

### Example 2: Video Dubbing + Lip Sync
**Input**: Upload video + "Dub to French with lip sync"
**Workflow**:
- Step 1: Voice Dubbing (18 credits, 3 min)  
- Step 2: Lip Sync (16 credits, 2 min)
- **Total**: 34 credits, 5 minutes

### Example 3: Complex Enhancement
**Input**: Upload video + "Edit, enhance quality, add effects, and analyze"
**Workflow**:
- Step 1: Edit Video (10 credits, 2 min)
- Step 2: Enhance Video Quality (12 credits, 2 min)
- Step 3: Add Effects (9 credits, 90 sec)
- Step 4: Analyze Results (3 credits, 30 sec)
- **Total**: 34 credits, 6 minutes

## Tips for Better Workflows

1. **Be Specific**: "Create UGC video with captions" vs "Make a video"
2. **Mention Files**: "Using the images I uploaded" helps the AI plan better
3. **Include End Goals**: "For social media", "professional quality", "testimonial style"
4. **Combine Features**: The AI can chain multiple Vidy features intelligently
5. **Check Costs**: Review the workflow plan before approving

---

*The Workflow Agent understands natural language and creates optimized step-by-step plans automatically.*