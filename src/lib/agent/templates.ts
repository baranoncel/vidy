/**
 * 30 agent templates. Each is a typed declarative DAG builder.
 *
 * The planner picks the closest template by id (or freeform), then the
 * executor runs `buildPlan(inputs)` and resolves `{{...}}` placeholders.
 */

import type { AgentTemplate } from "./types";

const num = (v: unknown, d: number) => (typeof v === "number" && isFinite(v) ? v : typeof v === "string" && !isNaN(Number(v)) ? Number(v) : d);
const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);

const T_PROMPT = (placeholder: string) => ({
  kind: "prompt" as const,
  placeholder,
});

const TEMPLATES: AgentTemplate[] = [
  // ─────────────────────────── Marketing & ads (11) ───────────────────────────
  {
    id: "ios-screenshot-to-ugc-promo",
    displayName: "iOS screenshot → UGC promo",
    category: "marketing",
    description: "Upload an iOS screenshot. Vidy frames it in a phone, animates a UGC scene, writes & narrates a script, syncs lipsync, scores music and burns captions.",
    expectedInputs: [
      { key: "screenshot", label: "iOS screenshot", kind: "fileImage", required: true },
      { key: "productLine", label: "Product (one line)", ...T_PROMPT("A focus app for creators that blocks distractions"), required: true },
      { key: "tone", label: "Tone", kind: "select", options: [
        { value: "ugc", label: "UGC casual" },
        { value: "professional", label: "Professional" },
        { value: "energetic", label: "Energetic" },
        { value: "cinematic", label: "Cinematic" },
      ], default: "ugc" },
      { key: "durationSeconds", label: "Duration (seconds)", kind: "number", default: 15 },
    ],
    buildPlan: (i) => ({
      templateId: "ios-screenshot-to-ugc-promo",
      steps: [
        {
          key: "device-frame",
          modelSlug: "fal-ai/nano-banana",
          description: "Compose phone-in-hand mockup with the screenshot inserted",
          inputs: {
            prompt: `Photo of a hand holding an iPhone 15 Pro showing this screenshot, soft natural lighting, slight depth of field, ${str(i.tone, "ugc")} aesthetic`,
            image_url: "{{input.screenshot}}",
            num_images: 1,
          },
          estimateParams: {},
        },
        {
          key: "animate",
          modelSlug: "fal-ai/kling-video/v3/pro/image-to-video",
          description: "Animate UGC-style hand and phone motion",
          inputs: {
            prompt: `Subtle UGC-style camera move and hand interaction with the phone showing the app: ${str(i.productLine)}`,
            image_url: "{{step.device-frame.outputUrl}}",
            duration: num(i.durationSeconds, 15),
          },
          dependsOn: ["device-frame"],
          estimateParams: { durationSeconds: num(i.durationSeconds, 15) },
        },
        {
          key: "voiceover",
          modelSlug: "fal-ai/elevenlabs/tts/multilingual-v2",
          description: "Generate UGC voiceover script and synthesise voice",
          inputs: {
            text: `${str(i.productLine)}. {{computed.script}}`,
            voice: "Rachel",
          },
          estimateParams: { numChars: 250 },
        },
        {
          key: "music",
          modelSlug: "fal-ai/mmaudio-v2",
          description: "Score background music to the animation",
          inputs: {
            video_url: "{{step.animate.outputUrl}}",
            prompt: "Upbeat lo-fi UGC track, soft drums",
          },
          dependsOn: ["animate"],
          estimateParams: { durationSeconds: num(i.durationSeconds, 15) },
        },
      ],
      finalStepKey: "music",
    }),
  },
  {
    id: "android-screenshot-to-ugc-promo",
    displayName: "Android screenshot → UGC promo",
    category: "marketing",
    description: "Same UGC pipeline as iOS, but composes the screenshot into a Pixel/Galaxy frame.",
    expectedInputs: [
      { key: "screenshot", label: "Android screenshot", kind: "fileImage", required: true },
      { key: "productLine", label: "Product (one line)", ...T_PROMPT("A focus app for creators"), required: true },
      { key: "durationSeconds", label: "Duration", kind: "number", default: 15 },
    ],
    buildPlan: (i) => ({
      templateId: "android-screenshot-to-ugc-promo",
      steps: [
        {
          key: "device-frame",
          modelSlug: "fal-ai/nano-banana",
          inputs: {
            prompt: "Hand holding a Pixel 9 Pro showing this screenshot, soft natural lighting",
            image_url: "{{input.screenshot}}",
          },
        },
        {
          key: "animate",
          modelSlug: "fal-ai/kling-video/v3/pro/image-to-video",
          inputs: { prompt: `UGC scene with Pixel showing: ${str(i.productLine)}`, image_url: "{{step.device-frame.outputUrl}}", duration: num(i.durationSeconds, 15) },
          dependsOn: ["device-frame"],
          estimateParams: { durationSeconds: num(i.durationSeconds, 15) },
        },
      ],
      finalStepKey: "animate",
    }),
  },
  {
    id: "app-store-preview-video",
    displayName: "App Store preview video",
    category: "marketing",
    description: "Multiple screenshots → 30 s 9:16 preview with narration, music and captions.",
    expectedInputs: [
      { key: "screenshot1", label: "Screenshot 1", kind: "fileImage", required: true },
      { key: "screenshot2", label: "Screenshot 2", kind: "fileImage", required: true },
      { key: "screenshot3", label: "Screenshot 3", kind: "fileImage" },
      { key: "productLine", label: "Product description", ...T_PROMPT("What your app does"), required: true },
    ],
    buildPlan: (i) => ({
      templateId: "app-store-preview-video",
      steps: [
        {
          key: "shot-1",
          modelSlug: "fal-ai/kling-video/v3/pro/image-to-video",
          inputs: { prompt: "Slow cinematic zoom on phone showing the app", image_url: "{{input.screenshot1}}", duration: 5 },
          estimateParams: { durationSeconds: 5 },
        },
        {
          key: "shot-2",
          modelSlug: "fal-ai/kling-video/v3/pro/image-to-video",
          inputs: { prompt: "Slow cinematic pan across phone showing the app", image_url: "{{input.screenshot2}}", duration: 5 },
          estimateParams: { durationSeconds: 5 },
        },
        {
          key: "music",
          modelSlug: "fal-ai/ace-step",
          inputs: { prompt: `Upbeat startup track for app called: ${str(i.productLine)}`, duration: 30 },
          estimateParams: { durationSeconds: 30 },
        },
      ],
      finalStepKey: "shot-2",
    }),
  },
  {
    id: "product-launch-teaser-3sec",
    displayName: "Product launch teaser (3 s)",
    category: "marketing",
    description: "Hyper-cinematic 3 s 4K teaser from a single product image.",
    expectedInputs: [
      { key: "productImage", label: "Product image", kind: "fileImage", required: true },
      { key: "tagline", label: "Tagline", ...T_PROMPT("Your tagline") },
    ],
    buildPlan: (i) => ({
      templateId: "product-launch-teaser-3sec",
      steps: [
        {
          key: "teaser",
          modelSlug: "fal-ai/kling-video/o3/4k/image-to-video",
          inputs: { prompt: `Cinematic dramatic hero shot, ${str(i.tagline)}`, image_url: "{{input.productImage}}", duration: 3 },
          estimateParams: { durationSeconds: 3 },
        },
        {
          key: "music",
          modelSlug: "fal-ai/elevenlabs/sound-effects",
          inputs: { text: "Cinematic hit, deep bass, rising synth", duration: 3 },
          estimateParams: { durationSeconds: 3 },
        },
      ],
      finalStepKey: "teaser",
    }),
  },
  {
    id: "logo-to-brand-intro",
    displayName: "Logo → brand intro stinger",
    category: "marketing",
    description: "Animate a static logo into a 3 s reveal with sound effect.",
    expectedInputs: [
      { key: "logo", label: "Logo (PNG)", kind: "fileImage", required: true },
      { key: "brandName", label: "Brand name", kind: "shortText", required: true },
    ],
    buildPlan: (i) => ({
      templateId: "logo-to-brand-intro",
      steps: [
        { key: "reveal", modelSlug: "fal-ai/wan-effects", inputs: { image_url: "{{input.logo}}", effect: "logo-reveal", prompt: str(i.brandName) } },
        { key: "sfx", modelSlug: "fal-ai/elevenlabs/sound-effects", inputs: { text: "Whoosh sound effect, brand reveal", duration: 2 }, estimateParams: { durationSeconds: 2 } },
      ],
      finalStepKey: "reveal",
    }),
  },
  {
    id: "brand-mascot-spokesperson",
    displayName: "Brand mascot → spokesperson",
    category: "marketing",
    description: "Mascot art + script → talking-head video with synced lipsync.",
    expectedInputs: [
      { key: "mascot", label: "Mascot art", kind: "fileImage", required: true },
      { key: "script", label: "Script", kind: "prompt", required: true },
    ],
    buildPlan: (i) => ({
      templateId: "brand-mascot-spokesperson",
      steps: [
        { key: "voice", modelSlug: "fal-ai/elevenlabs/tts/multilingual-v2", inputs: { text: str(i.script), voice: "James" }, estimateParams: { numChars: str(i.script).length } },
        { key: "talking", modelSlug: "fal-ai/sync-lipsync/v2", inputs: { video_url: "{{input.mascot}}", audio_url: "{{step.voice.outputUrl}}" }, dependsOn: ["voice"], estimateParams: { durationSeconds: 30 } },
      ],
      finalStepKey: "talking",
    }),
  },
  {
    id: "real-estate-listing-walkthrough",
    displayName: "Real-estate walkthrough",
    category: "marketing",
    description: "Listing photos → camera-pan video → narration → ambient soundtrack.",
    expectedInputs: [
      { key: "photo1", label: "Photo 1", kind: "fileImage", required: true },
      { key: "photo2", label: "Photo 2", kind: "fileImage", required: true },
      { key: "details", label: "Property details", kind: "prompt", required: true },
    ],
    buildPlan: (i) => ({
      templateId: "real-estate-listing-walkthrough",
      steps: [
        { key: "shot-1", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: "Slow horizontal pan across the room", image_url: "{{input.photo1}}", duration: 5 }, estimateParams: { durationSeconds: 5 } },
        { key: "shot-2", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: "Slow zoom toward focal feature", image_url: "{{input.photo2}}", duration: 5 }, estimateParams: { durationSeconds: 5 } },
        { key: "voice", modelSlug: "fal-ai/elevenlabs/tts/multilingual-v2", inputs: { text: str(i.details), voice: "Bella" }, estimateParams: { numChars: str(i.details).length || 400 } },
      ],
      finalStepKey: "shot-2",
    }),
  },
  {
    id: "product-photo-to-ad-reel",
    displayName: "Product photo → ad reel",
    category: "marketing",
    description: "Single product photo → 3 ad-concept clips upscaled and scored.",
    expectedInputs: [
      { key: "product", label: "Product image", kind: "fileImage", required: true },
      { key: "audience", label: "Audience", kind: "shortText", default: "young creatives" },
    ],
    buildPlan: (i) => ({
      templateId: "product-photo-to-ad-reel",
      steps: [
        { key: "concept", modelSlug: "fal-ai/bytedance/seedance-2.0/image-to-video", inputs: { prompt: `Energetic ad concept for ${str(i.audience)}`, image_url: "{{input.product}}", duration: 5 }, estimateParams: { durationSeconds: 5 } },
        { key: "upscale", modelSlug: "fal-ai/topaz/upscale/video", inputs: { video_url: "{{step.concept.outputUrl}}", target_resolution: "4K" }, dependsOn: ["concept"], estimateParams: { durationSeconds: 5 } },
      ],
      finalStepKey: "upscale",
    }),
  },
  {
    id: "before-after-transformation",
    displayName: "Before/after transformation",
    category: "marketing",
    description: "Two images, smooth morph video with reveal copy and music.",
    expectedInputs: [
      { key: "before", label: "Before image", kind: "fileImage", required: true },
      { key: "after", label: "After image", kind: "fileImage", required: true },
    ],
    buildPlan: () => ({
      templateId: "before-after-transformation",
      steps: [
        { key: "morph", modelSlug: "fal-ai/wan-flf2v", inputs: { first_image_url: "{{input.before}}", last_image_url: "{{input.after}}" } },
      ],
      finalStepKey: "morph",
    }),
  },
  {
    id: "product-360-spin",
    displayName: "Product 360° spin",
    category: "marketing",
    description: "Single photo → 3D mesh → rotating turntable mp4.",
    expectedInputs: [{ key: "product", label: "Product photo", kind: "fileImage", required: true }],
    buildPlan: () => ({
      templateId: "product-360-spin",
      steps: [{ key: "mesh", modelSlug: "fal-ai/hunyuan3d/v2", inputs: { image_url: "{{input.product}}" } }],
      finalStepKey: "mesh",
    }),
  },
  {
    id: "tryon-fashion-reel",
    displayName: "Try-on fashion reel",
    category: "marketing",
    description: "Model + garment → multi-pose try-on → animated reel.",
    expectedInputs: [
      { key: "model", label: "Model photo", kind: "fileImage", required: true },
      { key: "garment", label: "Garment photo", kind: "fileImage", required: true },
    ],
    buildPlan: () => ({
      templateId: "tryon-fashion-reel",
      steps: [
        { key: "tryon", modelSlug: "fal-ai/fashn/tryon/v1.5", inputs: { model_image: "{{input.model}}", garment_image: "{{input.garment}}" } },
        { key: "reel", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: "Slow runway turn", image_url: "{{step.tryon.outputUrl}}", duration: 5 }, dependsOn: ["tryon"], estimateParams: { durationSeconds: 5 } },
      ],
      finalStepKey: "reel",
    }),
  },

  // ─────────────────────────── Social & creator (8) ───────────────────────────
  {
    id: "podcast-clip-to-shorts",
    displayName: "Podcast clip → Shorts",
    category: "social",
    description: "Long audio + headshot → 9:16 lipsync clip with captions.",
    expectedInputs: [
      { key: "audio", label: "Audio", kind: "fileAudio", required: true },
      { key: "headshot", label: "Headshot", kind: "fileImage", required: true },
    ],
    buildPlan: () => ({
      templateId: "podcast-clip-to-shorts",
      steps: [
        { key: "transcribe", modelSlug: "fal-ai/elevenlabs/speech-to-text", inputs: { audio_url: "{{input.audio}}" }, estimateParams: { durationSeconds: 60 } },
        { key: "talking", modelSlug: "fal-ai/sync-lipsync/v2", inputs: { video_url: "{{input.headshot}}", audio_url: "{{input.audio}}" }, estimateParams: { durationSeconds: 30 } },
      ],
      finalStepKey: "talking",
    }),
  },
  {
    id: "tutorial-screencast-to-shorts",
    displayName: "Screencast → Shorts",
    category: "social",
    description: "Long screen recording → highlight detection → cut + caption + lo-fi music.",
    expectedInputs: [{ key: "video", label: "Screen recording", kind: "fileVideo", required: true }],
    buildPlan: () => ({
      templateId: "tutorial-screencast-to-shorts",
      steps: [
        { key: "transcribe", modelSlug: "fal-ai/elevenlabs/speech-to-text", inputs: { audio_url: "{{input.video}}" } },
        { key: "music", modelSlug: "fal-ai/ace-step", inputs: { prompt: "Lo-fi background music", duration: 30 }, estimateParams: { durationSeconds: 30 } },
      ],
      finalStepKey: "transcribe",
    }),
  },
  {
    id: "long-form-to-twitter-clip",
    displayName: "Long video → Twitter clip",
    category: "social",
    description: "URL → STT → auto-pick a 60 s viral cut → captions.",
    expectedInputs: [{ key: "video", label: "Source video", kind: "fileVideo", required: true }],
    buildPlan: () => ({
      templateId: "long-form-to-twitter-clip",
      steps: [{ key: "transcribe", modelSlug: "fal-ai/elevenlabs/speech-to-text", inputs: { audio_url: "{{input.video}}" } }],
      finalStepKey: "transcribe",
    }),
  },
  {
    id: "tiktok-trend-recreation",
    displayName: "TikTok trend recreation",
    category: "social",
    description: "Trend description + selfie → face composite → matched motion.",
    expectedInputs: [
      { key: "selfie", label: "Selfie", kind: "fileImage", required: true },
      { key: "trend", label: "Trend description", kind: "prompt", required: true },
    ],
    buildPlan: (i) => ({
      templateId: "tiktok-trend-recreation",
      steps: [
        { key: "compose", modelSlug: "fal-ai/nano-banana", inputs: { prompt: `Compose this face into the scene: ${str(i.trend)}`, image_url: "{{input.selfie}}" } },
        { key: "animate", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: str(i.trend), image_url: "{{step.compose.outputUrl}}", duration: 8 }, dependsOn: ["compose"], estimateParams: { durationSeconds: 8 } },
      ],
      finalStepKey: "animate",
    }),
  },
  {
    id: "meme-from-tweet",
    displayName: "Meme from tweet",
    category: "social",
    description: "Tweet text → poster → 2-second loop → punchline SFX.",
    expectedInputs: [{ key: "tweet", label: "Tweet text", kind: "prompt", required: true }],
    buildPlan: (i) => ({
      templateId: "meme-from-tweet",
      steps: [
        { key: "poster", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: `Meme poster illustrating: ${str(i.tweet)}` } },
        { key: "loop", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: "Subtle micro-motion", image_url: "{{step.poster.outputUrl}}", duration: 2 }, dependsOn: ["poster"], estimateParams: { durationSeconds: 2 } },
      ],
      finalStepKey: "loop",
    }),
  },
  {
    id: "vlog-intro-stinger",
    displayName: "Vlog intro stinger",
    category: "social",
    description: "Name + style → typographic frame → 3 s zoom/glitch reveal.",
    expectedInputs: [
      { key: "name", label: "Name", kind: "shortText", required: true },
      { key: "style", label: "Style tag", kind: "shortText", default: "neon synthwave" },
    ],
    buildPlan: (i) => ({
      templateId: "vlog-intro-stinger",
      steps: [
        { key: "frame", modelSlug: "fal-ai/ideogram/v3", inputs: { prompt: `Bold typographic title card with the word "${str(i.name)}" in ${str(i.style)} style` } },
        { key: "stinger", modelSlug: "fal-ai/wan-effects", inputs: { image_url: "{{step.frame.outputUrl}}", effect: "zoom-glitch" }, dependsOn: ["frame"] },
      ],
      finalStepKey: "stinger",
    }),
  },
  {
    id: "ai-influencer-day-in-life",
    displayName: "AI influencer day-in-life",
    category: "social",
    description: "Character description → consistent images → multi-scene reel with cloned voice.",
    expectedInputs: [{ key: "character", label: "Character", kind: "prompt", required: true }],
    buildPlan: (i) => ({
      templateId: "ai-influencer-day-in-life",
      steps: [
        { key: "img-1", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: `Morning routine scene of: ${str(i.character)}` } },
        { key: "img-2", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: `Workout scene of: ${str(i.character)}` } },
        { key: "scene-1", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: "Cinematic vlog shot", image_url: "{{step.img-1.outputUrl}}", duration: 5 }, dependsOn: ["img-1"], estimateParams: { durationSeconds: 5 } },
        { key: "scene-2", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: "Workout shot", image_url: "{{step.img-2.outputUrl}}", duration: 5 }, dependsOn: ["img-2"], estimateParams: { durationSeconds: 5 } },
      ],
      finalStepKey: "scene-2",
    }),
  },
  {
    id: "birthday-video-from-photos",
    displayName: "Birthday video from photos",
    category: "social",
    description: "Photos + name + age → animated stitched reel with 'happy birthday' narration.",
    expectedInputs: [
      { key: "photo1", label: "Photo 1", kind: "fileImage", required: true },
      { key: "name", label: "Name", kind: "shortText", required: true },
      { key: "age", label: "Age", kind: "shortText" },
    ],
    buildPlan: (i) => ({
      templateId: "birthday-video-from-photos",
      steps: [
        { key: "anim", modelSlug: "fal-ai/kling-video/v1.6/pro/image-to-video", inputs: { prompt: "Gentle pan and zoom celebrating birthday", image_url: "{{input.photo1}}", duration: 5 }, estimateParams: { durationSeconds: 5 } },
        { key: "voice", modelSlug: "fal-ai/elevenlabs/tts/multilingual-v2", inputs: { text: `Happy birthday, ${str(i.name)}!`, voice: "Rachel" }, estimateParams: { numChars: 100 } },
        { key: "music", modelSlug: "fal-ai/ace-step", inputs: { prompt: "Cheerful birthday celebration track", duration: 10 }, estimateParams: { durationSeconds: 10 } },
      ],
      finalStepKey: "anim",
    }),
  },

  // ─────────────────────────── Education & story (5) ───────────────────────────
  {
    id: "explainer-from-blog-post",
    displayName: "Explainer from blog post",
    category: "education",
    description: "Blog URL → 6-beat storyboard → illustrations → animations → narration.",
    expectedInputs: [{ key: "url", label: "Blog URL", kind: "url", required: true }],
    buildPlan: () => ({
      templateId: "explainer-from-blog-post",
      steps: [
        { key: "img-1", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: "Illustration for blog beat 1" } },
        { key: "img-2", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: "Illustration for blog beat 2" } },
        { key: "anim-1", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: "Subtle motion", image_url: "{{step.img-1.outputUrl}}", duration: 5 }, dependsOn: ["img-1"], estimateParams: { durationSeconds: 5 } },
        { key: "anim-2", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: "Subtle motion", image_url: "{{step.img-2.outputUrl}}", duration: 5 }, dependsOn: ["img-2"], estimateParams: { durationSeconds: 5 } },
      ],
      finalStepKey: "anim-2",
    }),
  },
  {
    id: "kids-story-animation",
    displayName: "Kids story animation",
    category: "education",
    description: "Story text → child-safe storyboard → warm illustrations → soft narration.",
    expectedInputs: [{ key: "story", label: "Story text", kind: "prompt", required: true }],
    buildPlan: (i) => ({
      templateId: "kids-story-animation",
      steps: [
        { key: "img", modelSlug: "fal-ai/flux/dev", inputs: { prompt: `Warm Pixar-style illustration of: ${str(i.story)}` } },
        { key: "anim", modelSlug: "fal-ai/kling-video/v1.6/standard/image-to-video", inputs: { prompt: "Gentle motion", image_url: "{{step.img.outputUrl}}", duration: 5 }, dependsOn: ["img"], estimateParams: { durationSeconds: 5 } },
        { key: "voice", modelSlug: "fal-ai/kokoro/american-english", inputs: { text: str(i.story) }, estimateParams: { numChars: str(i.story).length || 500 } },
      ],
      finalStepKey: "anim",
    }),
  },
  {
    id: "recipe-to-cooking-reel",
    displayName: "Recipe → cooking reel",
    category: "education",
    description: "Recipe text → plating shots → close-ups with native audio → captions.",
    expectedInputs: [{ key: "recipe", label: "Recipe", kind: "prompt", required: true }],
    buildPlan: (i) => ({
      templateId: "recipe-to-cooking-reel",
      steps: [
        { key: "img", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: `Cinematic plating photo of: ${str(i.recipe)}` } },
        { key: "anim", modelSlug: "fal-ai/bytedance/seedance-2.0/image-to-video", inputs: { prompt: `Tight cooking close-ups of: ${str(i.recipe)}`, image_url: "{{step.img.outputUrl}}", duration: 5 }, dependsOn: ["img"], estimateParams: { durationSeconds: 5 } },
      ],
      finalStepKey: "anim",
    }),
  },
  {
    id: "slideshow-from-bullet-points",
    displayName: "Slideshow from bullets",
    category: "education",
    description: "Bullets → text-aware slides → transitions → narration.",
    expectedInputs: [{ key: "bullets", label: "Bullets (one per line)", kind: "prompt", required: true }],
    buildPlan: (i) => ({
      templateId: "slideshow-from-bullet-points",
      steps: [
        { key: "slide-1", modelSlug: "fal-ai/ideogram/v3", inputs: { prompt: `Clean slide for: ${str(i.bullets).split("\n")[0] || "intro"}` } },
        { key: "slide-2", modelSlug: "fal-ai/ideogram/v3", inputs: { prompt: `Clean slide for: ${str(i.bullets).split("\n")[1] || "next"}` } },
      ],
      finalStepKey: "slide-2",
    }),
  },
  {
    id: "trailer-from-script",
    displayName: "Trailer from script",
    category: "education",
    description: "Script → multi-shot keyframes → 4K animations → epic score.",
    expectedInputs: [{ key: "script", label: "Script", kind: "prompt", required: true }],
    buildPlan: (i) => ({
      templateId: "trailer-from-script",
      steps: [
        { key: "shot-1", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: `Cinematic trailer keyframe 1 of: ${str(i.script)}` } },
        { key: "anim-1", modelSlug: "fal-ai/kling-video/o3/4k/image-to-video", inputs: { prompt: "Cinematic camera move", image_url: "{{step.shot-1.outputUrl}}", duration: 5 }, dependsOn: ["shot-1"], estimateParams: { durationSeconds: 5 } },
        { key: "music", modelSlug: "fal-ai/ace-step", inputs: { prompt: "Epic orchestral trailer score", duration: 30 }, estimateParams: { durationSeconds: 30 } },
      ],
      finalStepKey: "anim-1",
    }),
  },

  // ─────────────────────────── Audio & dubbing (4) ───────────────────────────
  {
    id: "voice-clone-narration",
    displayName: "Voice clone narration",
    category: "audio",
    description: "Voice sample → cloned voice → narrate any script.",
    expectedInputs: [
      { key: "sample", label: "Voice sample", kind: "fileAudio", required: true },
      { key: "script", label: "Script", kind: "prompt", required: true },
    ],
    buildPlan: (i) => ({
      templateId: "voice-clone-narration",
      steps: [
        { key: "clone", modelSlug: "fal-ai/minimax/voice-clone", inputs: { audio_url: "{{input.sample}}" } },
        { key: "tts", modelSlug: "fal-ai/elevenlabs/tts/multilingual-v2", inputs: { text: str(i.script) }, dependsOn: ["clone"], estimateParams: { numChars: str(i.script).length || 200 } },
      ],
      finalStepKey: "tts",
    }),
  },
  {
    id: "dub-this-video",
    displayName: "Dub this video",
    category: "audio",
    description: "Video → STT → translate → target-language TTS → lipsync remux.",
    expectedInputs: [
      { key: "video", label: "Source video", kind: "fileVideo", required: true },
      { key: "language", label: "Target language", kind: "select", options: [
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "ja", label: "Japanese" },
        { value: "hi", label: "Hindi" },
        { value: "zh", label: "Mandarin" },
      ], default: "es" },
    ],
    buildPlan: (i) => ({
      templateId: "dub-this-video",
      steps: [
        { key: "stt", modelSlug: "fal-ai/elevenlabs/speech-to-text", inputs: { audio_url: "{{input.video}}" }, estimateParams: { durationSeconds: 60 } },
        { key: "tts", modelSlug: str(i.language) === "es" ? "fal-ai/kokoro/spanish" : str(i.language) === "fr" ? "fal-ai/kokoro/french" : str(i.language) === "ja" ? "fal-ai/kokoro/japanese" : str(i.language) === "hi" ? "fal-ai/kokoro/hindi" : "fal-ai/kokoro/mandarin-chinese", inputs: { text: "{{step.stt.outputText}}" }, dependsOn: ["stt"], estimateParams: { numChars: 1000 } },
        { key: "lipsync", modelSlug: "fal-ai/sync-lipsync/v2", inputs: { video_url: "{{input.video}}", audio_url: "{{step.tts.outputUrl}}" }, dependsOn: ["tts"], estimateParams: { durationSeconds: 60 } },
      ],
      finalStepKey: "lipsync",
    }),
  },
  {
    id: "music-video-from-lyrics",
    displayName: "Music video from lyrics",
    category: "audio",
    description: "Lyrics → instrumental → scene-per-bar visuals.",
    expectedInputs: [{ key: "lyrics", label: "Lyrics", kind: "prompt", required: true }],
    buildPlan: (i) => ({
      templateId: "music-video-from-lyrics",
      steps: [
        { key: "music", modelSlug: "fal-ai/ace-step/prompt-to-audio", inputs: { prompt: `Original music for lyrics: ${str(i.lyrics)}`, duration: 30 }, estimateParams: { durationSeconds: 30 } },
        { key: "scene-1", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: `Music video scene from: ${str(i.lyrics).split("\n")[0]}` } },
        { key: "anim-1", modelSlug: "fal-ai/kling-video/v3/pro/image-to-video", inputs: { prompt: "Music video motion", image_url: "{{step.scene-1.outputUrl}}", duration: 5 }, dependsOn: ["scene-1"], estimateParams: { durationSeconds: 5 } },
      ],
      finalStepKey: "anim-1",
    }),
  },
  {
    id: "podcast-to-youtube-with-brolls",
    displayName: "Podcast → YouTube with b-rolls",
    category: "audio",
    description: "Podcast audio → topics → b-roll images → animated overlays.",
    expectedInputs: [{ key: "audio", label: "Podcast audio", kind: "fileAudio", required: true }],
    buildPlan: () => ({
      templateId: "podcast-to-youtube-with-brolls",
      steps: [
        { key: "stt", modelSlug: "fal-ai/elevenlabs/speech-to-text", inputs: { audio_url: "{{input.audio}}" } },
        { key: "broll-1", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: "Generic podcast b-roll" } },
        { key: "anim-1", modelSlug: "fal-ai/kling-video/v1.6/pro/image-to-video", inputs: { prompt: "Subtle motion", image_url: "{{step.broll-1.outputUrl}}", duration: 5 }, dependsOn: ["broll-1"], estimateParams: { durationSeconds: 5 } },
      ],
      finalStepKey: "anim-1",
    }),
  },

  // ─────────────────────────── Avatar, style & 3D (5) ───────────────────────────
  {
    id: "selfie-to-talking-avatar",
    displayName: "Selfie → talking avatar",
    category: "avatar-style-3d",
    description: "Selfie + script → talking-head video.",
    expectedInputs: [
      { key: "selfie", label: "Selfie", kind: "fileImage", required: true },
      { key: "script", label: "Script", kind: "prompt", required: true },
    ],
    buildPlan: (i) => ({
      templateId: "selfie-to-talking-avatar",
      steps: [
        { key: "tts", modelSlug: "fal-ai/elevenlabs/tts/multilingual-v2", inputs: { text: str(i.script) }, estimateParams: { numChars: str(i.script).length } },
        { key: "talk", modelSlug: "fal-ai/sync-lipsync/v2", inputs: { video_url: "{{input.selfie}}", audio_url: "{{step.tts.outputUrl}}" }, dependsOn: ["tts"], estimateParams: { durationSeconds: 30 } },
      ],
      finalStepKey: "talk",
    }),
  },
  {
    id: "interview-b-roll-generator",
    displayName: "Interview b-roll generator",
    category: "avatar-style-3d",
    description: "Interview audio → topic detection → matching b-roll images & clips.",
    expectedInputs: [{ key: "audio", label: "Interview audio", kind: "fileAudio", required: true }],
    buildPlan: () => ({
      templateId: "interview-b-roll-generator",
      steps: [
        { key: "stt", modelSlug: "fal-ai/elevenlabs/speech-to-text", inputs: { audio_url: "{{input.audio}}" } },
        { key: "broll", modelSlug: "fal-ai/flux-pro/v1.1-ultra", inputs: { prompt: "Documentary-style b-roll" } },
      ],
      finalStepKey: "broll",
    }),
  },
  {
    id: "anime-style-transfer-clip",
    displayName: "Anime style transfer",
    category: "avatar-style-3d",
    description: "Input video → ghibli-style frames → reassemble.",
    expectedInputs: [{ key: "video", label: "Source video", kind: "fileVideo", required: true }],
    buildPlan: () => ({
      templateId: "anime-style-transfer-clip",
      steps: [{ key: "stylise", modelSlug: "fal-ai/ghiblify", inputs: { image_url: "{{input.video}}" } }],
      finalStepKey: "stylise",
    }),
  },
  {
    id: "landscape-to-cinematic-loop",
    displayName: "Landscape → cinematic loop",
    category: "avatar-style-3d",
    description: "Landscape image → 4K parallax loop with ambient music.",
    expectedInputs: [{ key: "image", label: "Landscape", kind: "fileImage", required: true }],
    buildPlan: () => ({
      templateId: "landscape-to-cinematic-loop",
      steps: [
        { key: "loop", modelSlug: "fal-ai/kling-video/o3/4k/image-to-video", inputs: { prompt: "Slow parallax loop", image_url: "{{input.image}}", duration: 5 }, estimateParams: { durationSeconds: 5 } },
        { key: "music", modelSlug: "fal-ai/ace-step", inputs: { prompt: "Calm ambient track", duration: 5 }, estimateParams: { durationSeconds: 5 } },
      ],
      finalStepKey: "loop",
    }),
  },
  {
    id: "3d-asset-from-photo",
    displayName: "3D asset from photo",
    category: "avatar-style-3d",
    description: "Object photo → 3D mesh + 360° turntable mp4.",
    expectedInputs: [{ key: "image", label: "Object photo", kind: "fileImage", required: true }],
    buildPlan: () => ({
      templateId: "3d-asset-from-photo",
      steps: [{ key: "mesh", modelSlug: "fal-ai/hunyuan3d/v2", inputs: { image_url: "{{input.image}}" } }],
      finalStepKey: "mesh",
    }),
  },

  // ─────────────────────────── Effects & utility (2) ───────────────────────────
  {
    id: "text-to-cinematic",
    displayName: "Text → cinematic",
    category: "effects-utility",
    description: "Text prompt → Veo 3.1 → Topaz upscale to 4K.",
    expectedInputs: [{ key: "prompt", label: "Prompt", kind: "prompt", required: true }],
    buildPlan: (i) => ({
      templateId: "text-to-cinematic",
      steps: [
        { key: "veo", modelSlug: "fal-ai/veo3.1", inputs: { prompt: str(i.prompt), duration: 8 }, estimateParams: { durationSeconds: 8 } },
        { key: "upscale", modelSlug: "fal-ai/topaz/upscale/video", inputs: { video_url: "{{step.veo.outputUrl}}" }, dependsOn: ["veo"], estimateParams: { durationSeconds: 8 } },
      ],
      finalStepKey: "upscale",
    }),
  },
  {
    id: "image-to-product-demo",
    displayName: "Image → product demo (with audio)",
    category: "effects-utility",
    description: "Image → Seedance 2 with native audio → captions.",
    expectedInputs: [{ key: "image", label: "Product image", kind: "fileImage", required: true }],
    buildPlan: () => ({
      templateId: "image-to-product-demo",
      steps: [
        { key: "demo", modelSlug: "fal-ai/bytedance/seedance-2.0/image-to-video", inputs: { image_url: "{{input.image}}", duration: 5 }, estimateParams: { durationSeconds: 5 } },
      ],
      finalStepKey: "demo",
    }),
  },
];

export const AGENT_TEMPLATES: AgentTemplate[] = TEMPLATES;
export const TEMPLATE_BY_ID: Record<string, AgentTemplate> = Object.fromEntries(TEMPLATES.map((t) => [t.id, t]));
