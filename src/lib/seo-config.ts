import type { FeatureSeo } from "./seo";

/**
 * Per-feature SEO metadata + FAQ + HowTo. Every feature page imports its block,
 * builds Next.js metadata via buildMetadata, and renders the JSON-LD inline.
 */

export const FEATURE_SEO: Record<string, FeatureSeo> = {
  home: {
    path: "/",
    title: "Vidy — Agentic AI Video Studio",
    description:
      "Generate, edit, dub, lipsync, upscale and animate video with 200+ AI models. One agent that orchestrates the right models for any prompt.",
    keywords: ["AI video generator", "agentic video", "text to video", "image to video", "lipsync AI", "video upscaler"],
    faq: [
      {
        q: "What is Vidy?",
        a: "Vidy is an agentic AI video studio that orchestrates 200+ generative AI models — Veo 3.1, Kling, Seedance, Flux, ElevenLabs, Topaz and more — into end-to-end pipelines. You describe what you want, the agent picks and chains the right models.",
      },
      {
        q: "How am I billed?",
        a: "Vidy uses Computational Coins. 1 coin = $0.001. Each model has a transparent coin price (provider cost × 3). Buy a bundle and spend coins across any model — no per-tool subscriptions.",
      },
      {
        q: "Which models can I use?",
        a: "Every major frontier model including Veo 3.1, Kling v3 Pro & 4K, Seedance 2, Wan 2.5, FLUX 1.1 Pro Ultra, Ideogram V3, ElevenLabs TTS, Sync Lipsync 2.0, Topaz Video Upscale and more — see the live catalogue on the Pricing page.",
      },
      {
        q: "Can I create UGC ads from a phone screenshot?",
        a: "Yes. Upload your iOS or Android screenshot to the Agent or UGC Video page, describe the product, and Vidy chains a vision model, an image-to-video model, a TTS voice, lipsync, music and captions into a finished UGC promo.",
      },
      {
        q: "Is there a free trial?",
        a: "New accounts receive 500 free coins (≈ 50¢ of compute) on signup so you can try the platform before topping up.",
      },
    ],
  },

  generate: {
    path: "/generate",
    title: "Text-to-Video Generator",
    description:
      "Type a prompt, generate cinematic video. Powered by Veo 3.1, Kling v3 Pro, Seedance 2 and Wan 2.5 — pick the model, pay one transparent coin price.",
    keywords: ["text to video", "AI video generator", "Veo 3.1", "Kling v3", "Seedance"],
    faq: [
      { q: "Which model should I pick?", a: "Veo 3.1 for premium cinematic clips with native audio, Kling v3 Pro for the best price-to-quality balance, Wan 2.5 for cheap drafts, Seedance 2 for multi-shot stories with sound." },
      { q: "What's the maximum length?", a: "Most models support 4–10 second clips. Use the Stories or Agent page to stitch multi-shot sequences automatically." },
      { q: "Is sound included?", a: "Veo 3.1, Kling v3 Pro, Happy Horse and Seedance 2 emit synchronised native audio. Other models produce silent video; pair with the Audio or TTS pages to add sound." },
      { q: "Can I extend a clip?", a: "Yes — generate a clip and click Extend to continue from the last frame using LTX Video Extend or Framepack." },
      { q: "Does Vidy keep my prompts?", a: "Prompts are stored against your account so you can revisit, regenerate or delete them. Generations are private unless you mark them public." },
    ],
    howTo: [
      { name: "Describe the shot", text: "Write a prompt with subject, camera, lighting and mood." },
      { name: "Pick a model", text: "Choose between Veo 3.1, Kling v3 Pro, Seedance 2, Wan 2.5 or any other model." },
      { name: "Generate", text: "Coin price is shown before you submit. Hit Generate and watch the live progress stream." },
      { name: "Refine", text: "Regenerate with seeds, extend the clip, upscale to 4K with Topaz, or pass into the Agent for a full pipeline." },
    ],
  },

  image: {
    path: "/image",
    title: "AI Image Generator",
    description:
      "Generate hero imagery with FLUX 1.1 Pro Ultra, Ideogram V3, Nano Banana, Seedream V4 and more. One coin price across all providers.",
    keywords: ["AI image generator", "FLUX", "Ideogram", "text to image"],
    faq: [
      { q: "Which model is best for typography?", a: "Ideogram V3 leads on legible in-image text. FLUX 1.1 Pro Ultra is the all-rounder; Nano Banana is the cheapest." },
      { q: "Can I use my own LoRA?", a: "Yes — train a LoRA on the Train page and call it from FLUX LoRA or FLUX Dev." },
      { q: "What output formats are supported?", a: "PNG and WebP, up to 2 K (FLUX Ultra) or 4 K via the Upscale tab." },
    ],
  },

  video: {
    path: "/video",
    title: "AI Video Models — Picker",
    description:
      "Browse and compare every video model in Vidy's catalogue with live coin pricing. Filter by category, resolution, audio, multi-shot.",
    keywords: ["AI video model picker", "compare video models", "Veo vs Kling"],
    faq: [
      { q: "How does Vidy choose between models?", a: "On the Video page you pick manually. The Agent picks for you using cost, quality, resolution and the input you provide." },
      { q: "Are 4K models always more expensive?", a: "4K Kling is ~2× the price of 1080p Kling per second but skips a separate upscale pass. For long pieces, 1080p + Topaz can be cheaper." },
    ],
  },

  "ugc-video": {
    path: "/ugc-video",
    title: "AI UGC Video Generator (App Promo)",
    description:
      "Turn an iOS or Android screenshot into a finished UGC-style ad. Vidy chains a vision model, image-to-video, TTS voice, lipsync, music and captions automatically.",
    keywords: ["UGC video AI", "App Store preview video", "screenshot to video", "AI ad generator"],
    faq: [
      { q: "What inputs do I need?", a: "An iOS or Android screenshot (PNG/JPEG), a 1-line product description and a chosen tone (excited, professional, calm)." },
      { q: "Which models run inside?", a: "Vision parsing (GPT-5), Nano Banana for the device mockup, Kling v3 Pro for animation, ElevenLabs TTS, Sync Lipsync 2.0, MMAudio v2 for music, ElevenLabs STT for caption timings." },
      { q: "Output format and aspect?", a: "9:16 mp4, 30 seconds by default, sized to App Store Connect preview specs." },
      { q: "How much does it cost?", a: "A typical run is 6 000–10 000 coins ($6–$10) depending on duration and tier. The estimate is shown before you confirm." },
    ],
    howTo: [
      { name: "Upload screenshot", text: "Drop in your iOS or Android screenshot." },
      { name: "Describe the product", text: "One line on what the app does and who it's for." },
      { name: "Pick a tone", text: "Choose from UGC, professional, energetic or cinematic." },
      { name: "Approve the plan", text: "Vidy shows the planned DAG and total coin cost — confirm to run." },
      { name: "Download", text: "Final mp4 is delivered with voiceover, music, lipsync and burned captions." },
    ],
  },

  agent: {
    path: "/agent",
    title: "Agentic Video Workflow",
    description:
      "Describe any video idea — Vidy plans a multi-model pipeline (vision, generation, voice, music, lipsync, captions, upscale) and runs it end-to-end with full cost transparency.",
    keywords: ["AI video agent", "multi-model orchestration", "agentic video pipeline"],
    faq: [
      { q: "How is this different from text-to-video?", a: "Text-to-video calls one model. The agent orchestrates many — vision describes your inputs, an LLM plans, then 5–10 specialised models run in sequence to deliver a finished asset." },
      { q: "Does it ever hallucinate the wrong model?", a: "The planner emits a strict-JSON DAG validated against the live model registry. The reflector double-checks each step. Any unknown model is rejected before billing." },
      { q: "Can I edit the plan before running?", a: "Yes — every plan is shown as an editable DAG. Add, remove or swap steps, then approve to run." },
      { q: "Is each step billed separately?", a: "You're shown a total estimate up front. Each step debits coins as it runs. Failures are auto-refunded." },
    ],
  },

  lipsync: {
    path: "/lipsync",
    title: "AI Lipsync (Audio → Talking Video)",
    description:
      "Sync any voice track to any face with Sync Lipsync 2.0, Kling Lipsync or Tavus Hummingbird. Per-minute pricing, one coin currency.",
    keywords: ["AI lipsync", "Sync Lipsync 2.0", "talking head AI"],
    faq: [
      { q: "Which lipsync model is most accurate?", a: "Sync Lipsync 2.0 leads on facial detail. Kling Lipsync is faster and cheaper but less precise." },
      { q: "What audio formats work?", a: "WAV, MP3 and M4A. We auto-convert if needed." },
    ],
  },

  upscale: {
    path: "/upscale",
    title: "AI Video & Image Upscaler",
    description:
      "Upscale 480p or 720p clips to 4K with Topaz Video Upscale. Sharpen images with DRCT, Creative Upscaler or Swin2SR.",
    keywords: ["AI video upscaler", "Topaz video", "image upscaler"],
    faq: [
      { q: "Will Topaz preserve faces?", a: "Yes — Topaz Video Upscale is the production standard for face-preserving upscaling." },
      { q: "How long does a 4K upscale take?", a: "Roughly real-time — a 30 s clip ≈ 30 s of compute." },
    ],
  },

  enhance: {
    path: "/enhance",
    title: "AI Image & Video Enhancer",
    description:
      "Restore faces (CodeFormer), remove noise (NAFNet Denoise) and deblur old footage with one-click pipelines.",
    keywords: ["AI image enhancer", "CodeFormer", "denoise"],
    faq: [
      { q: "Will CodeFormer change the person's identity?", a: "It preserves identity at default strength; lower the fidelity slider for more aggressive restoration." },
    ],
  },

  tts: {
    path: "/tts",
    title: "AI Text-to-Speech",
    description:
      "Premium voiceover with ElevenLabs Multilingual v2, Minimax Speech-02 HD, Kokoro and more. 30+ languages, voice cloning supported.",
    keywords: ["AI text to speech", "ElevenLabs TTS", "voice clone"],
    faq: [
      { q: "Can I clone my voice?", a: "Yes — Minimax Voice Clone takes a 30-second sample and creates a reusable voice for $1 (3 000 coins) one-time." },
    ],
  },

  audio: {
    path: "/audio",
    title: "AI Music & Sound Effects",
    description:
      "Generate music with Ace-Step, sound effects with ElevenLabs SFX, and synced video soundtracks with MMAudio v2.",
    keywords: ["AI music generator", "ElevenLabs sound effects"],
    faq: [
      { q: "Can MMAudio match a specific scene?", a: "Yes — pass the video URL and an optional prompt; it scores the audio to the on-screen action." },
    ],
  },

  dubbing: {
    path: "/dubbing",
    title: "AI Video Dubbing (Multilingual)",
    description:
      "Translate and dub any video into 30+ languages — speech-to-text, GPT-5 translation, Kokoro voice and Sync Lipsync stitched into one workflow.",
    keywords: ["AI video dubbing", "translate video AI", "multilingual lipsync"],
    faq: [
      { q: "Is the original speaker's voice preserved?", a: "Optional — clone the voice once with Minimax Voice Clone and re-use it across every dubbed language." },
    ],
  },

  captions: {
    path: "/captions",
    title: "AI Captions & Subtitles",
    description:
      "Generate burned-in captions or .srt files for any video. Powered by ElevenLabs Speech-to-Text with word-level timing.",
    keywords: ["AI captions", "auto subtitles", "speech to text"],
    faq: [
      { q: "Word-level or line-level?", a: "Both. Word-level lets you do TikTok-style highlight captions; line-level is YouTube-friendly." },
    ],
  },

  clips: {
    path: "/clips",
    title: "AI Clip Finder (Long → Short)",
    description:
      "Auto-detect viral 30 s clips inside long-form video using GPT-5 highlight detection, then captions and 9:16 reframe in one pass.",
    keywords: ["AI clip finder", "long to short", "podcast clips AI"],
    faq: [
      { q: "How does it pick clips?", a: "Whisper-class STT + GPT-5 ranks moments by hook, completeness and emotional arc." },
    ],
  },

  stories: {
    path: "/stories",
    title: "AI Story-to-Video",
    description:
      "From text to multi-shot narrative clip: GPT-5 storyboards, FLUX renders the keyframes, Kling animates them, voiceover and music are stitched in.",
    keywords: ["AI story video", "narrative AI"],
    faq: [
      { q: "How long can a story be?", a: "30–90 s in v1, with a 6–12 shot DAG. Longer pieces planned." },
    ],
  },

  "3d": {
    path: "/3d",
    title: "Image-to-3D Generator",
    description:
      "Turn one product photo into a 3D mesh + 360° turntable mp4 via Hunyuan3D v2 and TRELLIS.",
    keywords: ["AI 3D generator", "image to 3D", "Hunyuan3D"],
    faq: [
      { q: "What output formats?", a: "GLB mesh + a rendered turntable mp4 you can drop in any landing page." },
    ],
  },

  effects: {
    path: "/effects",
    title: "AI Video Effects",
    description:
      "One-click effects (explode, melt, glitch, transitions) via Pika Pikaffects, PixVerse Effects, Wan Effects and Kling Effects.",
    keywords: ["AI video effects", "Pikaffects"],
    faq: [
      { q: "Can I chain effects?", a: "Yes — pass the output to another effect or to the Agent for a full pipeline." },
    ],
  },

  realtime: {
    path: "/realtime",
    title: "Realtime AI Generation",
    description:
      "Sub-second image and video generation via SANA Sprint and Fast Lightning SDXL — paint with prompts on a live canvas.",
    keywords: ["realtime AI generation", "SANA Sprint"],
    faq: [
      { q: "What's the latency?", a: "200–600 ms per frame at 512 px on SANA Sprint, depending on load." },
    ],
  },

  style: {
    path: "/style",
    title: "Style & Control",
    description:
      "ControlNet-driven style transfer with FLUX Pro Canny, Depth and LoRA conditioning. Lock composition, vary the look.",
    keywords: ["AI style transfer", "ControlNet", "FLUX canny"],
    faq: [
      { q: "Can I keep the original layout?", a: "Yes — Canny preserves edges, Depth preserves spatial relationships." },
    ],
  },

  train: {
    path: "/train",
    title: "Train a Custom Model",
    description:
      "Fine-tune FLUX or Hunyuan Video on your subject/style in minutes. Re-use the LoRA across every Vidy feature.",
    keywords: ["FLUX LoRA training", "fine-tune AI"],
    faq: [
      { q: "How many images do I need?", a: "5–20 well-lit images is enough for FLUX LoRA Fast." },
    ],
  },

  edit: {
    path: "/edit",
    title: "Browser Video Editor",
    description:
      "Trim, cut, layer and export with an in-browser ffmpeg-wasm editor — pipe directly into any Vidy AI feature.",
    keywords: ["browser video editor", "ffmpeg wasm"],
    faq: [
      { q: "Are edits non-destructive?", a: "Yes — the timeline is JSON; rendering is on demand." },
    ],
  },

  analytics: {
    path: "/analytics",
    title: "Account Analytics",
    description:
      "See per-feature usage, coin spend, and which models you're getting the most value from. Powered by your own job history.",
    keywords: ["AI usage analytics"],
    faq: [
      { q: "Is data shared with anyone?", a: "No — analytics are computed from your own jobs only." },
    ],
  },

  pricing: {
    path: "/pricing",
    title: "Pricing — Computational Coins",
    description:
      "Transparent coin pricing for 200+ AI models. 1 coin = $0.001. Buy a bundle once, spend across every feature.",
    keywords: ["AI video pricing", "computational coins"],
    faq: [
      { q: "Why coins instead of credits?", a: "Coins are denominated in real money ($0.001 each), so the price you see equals the cost you pay across any model." },
      { q: "Do coins expire?", a: "Bundle coins do not expire. Subscription coins are issued monthly under fair use." },
    ],
  },

  profile: { path: "/profile", title: "Profile", description: "Your account, plan and connected providers.", faq: [] },
  settings: { path: "/settings", title: "Settings", description: "Manage your account, billing and notifications.", faq: [] },

  "ai-video-tools": {
    path: "/ai-video-tools",
    title: "Every AI Video Tool in One Studio",
    description:
      "Browse Vidy's full feature set: text-to-video, image-to-video, lipsync, upscale, dubbing, captions, 3D, effects, realtime, training and the multi-model agent.",
    keywords: ["AI video tools", "AI video suite"],
    faq: [
      { q: "Do all tools share the same coin balance?", a: "Yes — one wallet, every feature." },
    ],
  },

  demo: { path: "/demo", title: "Component Demo", description: "Internal showcase.", faq: [] },
};
