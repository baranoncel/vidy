import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { 
  Video, 
  Camera, 
  Zap, 
  Sparkles, 
  Edit3, 
  Mic, 
  Wand2, 
  Box,
  Music,
  Palette,
  Volume2,
  Tv,
  Maximize2,
  Cpu,
  Play,
  Layers,
  FileVideo,
  Film
} from 'lucide-react'

interface FeaturesProps {
  featureType: 'video' | 'image' | 'realtime' | 'enhance' | 'edit' | 'lipsync' | 'train' | '3d' | 'audio' | 'style' | 'tts' | 'analytics' | 'upscale' | 'ai-video-tools'
}

const featureData = {
  video: {
    title: "Video Generation",
    subtitle: "Create stunning videos with AI",
    description: "Generate professional videos from text prompts using cutting-edge AI models like Hailo, Pika, Runway, and Luma. Transform your ideas into cinematic content in seconds.",
    icon: Video,
    features: [
      { title: "Multiple AI Models", desc: "Access Hailo, Pika, Runway, Luma and more" },
      { title: "Text to Video", desc: "Generate videos from simple text descriptions" },
      { title: "High Quality Output", desc: "Professional-grade video generation up to 4K" },
      { title: "Style Control", desc: "Fine-tune artistic style and visual aesthetics" }
    ],
    mainImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=600&h=400&fit=crop"
  },
  image: {
    title: "Image Generation", 
    subtitle: "Custom images with Flux and Ideogram",
    description: "Generate high-quality images with custom styles using state-of-the-art AI models. Perfect for creative projects, marketing materials, and artistic exploration.",
    icon: Camera,
    features: [
      { title: "Flux Integration", desc: "Advanced image generation with Flux models" },
      { title: "Ideogram Support", desc: "Text-to-image with typography support" },
      { title: "Style Customization", desc: "Control artistic style and visual elements" },
      { title: "High Resolution", desc: "Generate images up to 4K resolution" }
    ],
    mainImage: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&h=400&fit=crop"
  },
  realtime: {
    title: "Realtime AI Rendering",
    subtitle: "Instant feedback loops on canvas",
    description: "Experience the future of AI creativity with real-time rendering on an interactive canvas. Get instant visual feedback as you create and iterate.",
    icon: Zap,
    features: [
      { title: "Live Rendering", desc: "See changes instantly as you create" },
      { title: "Interactive Canvas", desc: "Direct manipulation and real-time editing" },
      { title: "Instant Feedback", desc: "Immediate visual response to your inputs" },
      { title: "Creative Flow", desc: "Uninterrupted creative process" }
    ],
    mainImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop"
  },
  enhance: {
    title: "AI Enhancer",
    subtitle: "Upscale to 22K resolution",
    description: "Enhance and upscale your images and videos to unprecedented quality levels. Our AI-powered enhancement technology can upscale content up to 22K resolution.",
    icon: Sparkles,
    features: [
      { title: "22K Upscaling", desc: "Ultra-high resolution enhancement up to 22K" },
      { title: "Video Enhancement", desc: "Improve video quality and resolution" },
      { title: "Image Restoration", desc: "Restore and enhance old or damaged images" },
      { title: "Quality Improvement", desc: "AI-powered detail enhancement and sharpening" }
    ],
    mainImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
  },
  edit: {
    title: "AI Editor",
    subtitle: "Add objects, change style, expand",
    description: "Advanced AI editing tools that let you add objects, change artistic styles, or expand photos and generations seamlessly. Transform your content with precision.",
    icon: Edit3,
    features: [
      { title: "Object Addition", desc: "Add new objects and elements to existing content" },
      { title: "Style Transfer", desc: "Change artistic style and visual aesthetics" },
      { title: "Content Expansion", desc: "Expand images beyond original boundaries" },
      { title: "Seamless Integration", desc: "Natural-looking edits and modifications" }
    ],
    mainImage: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop"
  },
  lipsync: {
    title: "Video Lipsync",
    subtitle: "Sync any video to any audio",
    description: "Revolutionary lip sync technology that can synchronize any video to any audio track. Perfect for dubbing, language localization, and creative content.",
    icon: Mic,
    features: [
      { title: "Universal Sync", desc: "Sync any video to any audio track" },
      { title: "Natural Motion", desc: "Realistic lip movement generation" },
      { title: "Multi-language", desc: "Support for multiple languages and accents" },
      { title: "High Accuracy", desc: "Precise synchronization and timing" }
    ],
    mainImage: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=400&fit=crop"
  },
  train: {
    title: "AI Training",
    subtitle: "Teach AI your style and products",
    description: "Train custom AI models to replicate your unique style, products, or characters. Create personalized AI that understands your brand and creative vision.",
    icon: Wand2,
    features: [
      { title: "Style Learning", desc: "Train AI to replicate your artistic style" },
      { title: "Product Recognition", desc: "Teach AI about your specific products" },
      { title: "Character Creation", desc: "Generate consistent character appearances" },
      { title: "Brand Consistency", desc: "Maintain visual brand identity across content" }
    ],
    mainImage: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
  },
  '3d': {
    title: "3D Object Generation",
    subtitle: "Create 3D objects in seconds",
    description: "Generate stunning 3D objects from text descriptions or images in just seconds. Perfect for game development, product visualization, and creative projects.",
    icon: Box,
    features: [
      { title: "Text to 3D", desc: "Generate 3D objects from text descriptions" },
      { title: "Image to 3D", desc: "Convert 2D images into 3D models" },
      { title: "Fast Generation", desc: "Create 3D objects in seconds" },
      { title: "Export Ready", desc: "Compatible with major 3D software and formats" }
    ],
    mainImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=400&fit=crop"
  },
  audio: {
    title: "Audio Generation",
    subtitle: "Create music and sound effects",
    description: "Generate original music tracks and sound effects using AI. From ambient soundscapes to energetic beats, create the perfect audio for your projects.",
    icon: Music,
    features: [
      { title: "Music Generation", desc: "Create original music in various genres" },
      { title: "Sound Effects", desc: "Generate custom sound effects and audio" },
      { title: "Style Control", desc: "Control tempo, mood, and musical elements" },
      { title: "High Quality", desc: "Professional audio quality output" }
    ],
    mainImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1571974599782-87624638275f?w=600&h=400&fit=crop"
  },
  style: {
    title: "Style Transfer",
    subtitle: "Apply artistic styles to content",
    description: "Transform your images and videos with artistic style transfer. Apply the visual aesthetics of famous artworks or create your own unique style combinations.",
    icon: Palette,
    features: [
      { title: "Artistic Styles", desc: "Apply famous art styles to your content" },
      { title: "Custom Styles", desc: "Create and use your own style combinations" },
      { title: "Video Styling", desc: "Apply consistent styles to video content" },
      { title: "Style Mixing", desc: "Blend multiple artistic influences" }
    ],
    mainImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
  },
  tts: {
    title: "Text to Speech",
    subtitle: "Natural-sounding voice synthesis",
    description: "Convert text to natural-sounding speech with advanced AI voice synthesis. Choose from multiple voices, languages, and speaking styles.",
    icon: Volume2,
    features: [
      { title: "Natural Voices", desc: "Human-like speech synthesis" },
      { title: "Multiple Languages", desc: "Support for various languages and accents" },
      { title: "Voice Styles", desc: "Different speaking styles and emotions" },
      { title: "Custom Speed", desc: "Adjustable speech rate and pronunciation" }
    ],
    mainImage: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop"
  },
  analytics: {
    title: "Video Analytics",
    subtitle: "Extract insights from videos",
    description: "Analyze your videos to extract valuable insights, detect objects, recognize faces, and understand content patterns for better decision making.",
    icon: Tv,
    features: [
      { title: "Content Analysis", desc: "Understand what's happening in your videos" },
      { title: "Object Detection", desc: "Identify and track objects in video content" },
      { title: "Face Recognition", desc: "Detect and analyze faces in videos" },
      { title: "Pattern Recognition", desc: "Identify trends and patterns in content" }
    ],
    mainImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
  },
  upscale: {
    title: "Image Upscaler",
    subtitle: "Enhance resolution and quality",
    description: "Dramatically improve image resolution and quality using advanced AI upscaling algorithms. Perfect for enhancing old photos or increasing image detail.",
    icon: Maximize2,
    features: [
      { title: "AI Upscaling", desc: "Intelligent resolution enhancement" },
      { title: "Quality Boost", desc: "Improve overall image quality and clarity" },
      { title: "Detail Recovery", desc: "Restore fine details and textures" },
      { title: "Batch Processing", desc: "Process multiple images simultaneously" }
    ],
    mainImage: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
  },
  'ai-video-tools': {
    title: "AI Video Tools",
    subtitle: "Complete video creation suite",
    description: "Access our complete suite of AI-powered video tools. From generation to editing, enhancement to analysis - everything you need for professional video creation.",
    icon: Cpu,
    features: [
      { title: "Comprehensive Suite", desc: "All video tools in one place" },
      { title: "Workflow Integration", desc: "Seamlessly combine different AI tools" },
      { title: "Professional Output", desc: "Industry-standard video production quality" },
      { title: "Time Efficient", desc: "Dramatically reduce video production time" }
    ],
    mainImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&h=800&fit=crop",
    smallImage: "https://images.unsplash.com/photo-1551808525-51a94da548ce?w=600&h=400&fit=crop"
  }
}

export function FeaturesSection({ featureType }: FeaturesProps) {
  const data = featureData[featureType]
  const Icon = data.icon

  return (
    <section className="bg-zinc-50 dark:bg-muted/25 py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-white shadow-lg">
              <Icon className="h-8 w-8 text-gray-700" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{data.title}</h2>
          </div>
          <p className="text-xl text-gray-600 mb-2">{data.subtitle}</p>
          <p className="text-gray-600 max-w-2xl mx-auto">{data.description}</p>
        </div>

        <div className="mx-auto grid gap-2 sm:grid-cols-5">
          <Card className="group overflow-hidden shadow-black/5 sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
            <CardHeader>
              <div className="md:p-6">
                <p className="font-medium">{data.features[0].title}</p>
                <p className="text-muted-foreground mt-3 max-w-sm text-sm">{data.features[0].desc}</p>
              </div>
            </CardHeader>

            <div className="relative h-fit pl-6 md:pl-12">
              <div className="absolute -inset-6 [background:radial-gradient(75%_95%_at_50%_0%,transparent,hsl(var(--background))_100%)]"></div>

              <div className="bg-background overflow-hidden rounded-tl-lg border-l border-t pl-2 pt-2 dark:bg-zinc-950">
                <img
                  src={data.mainImage}
                  className="w-full h-auto object-cover"
                  alt={`${data.title} illustration`}
                  width={1207}
                  height={929}
                />
              </div>
            </div>
          </Card>

          <Card className="group overflow-hidden shadow-zinc-950/5 sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
            <p className="mx-auto my-6 max-w-md text-balance px-6 text-center text-lg font-semibold sm:text-2xl md:p-6">
              {data.features[1].title}: {data.features[1].desc}
            </p>

            <CardContent className="mt-auto h-fit">
              <div className="relative mb-6 sm:mb-0">
                <div className="absolute -inset-6 [background:radial-gradient(50%_75%_at_75%_50%,transparent,hsl(var(--background))_100%)]"></div>
                <div className="aspect-[76/59] overflow-hidden rounded-r-lg border">
                  <img
                    src={data.smallImage}
                    className="w-full h-full object-cover"
                    alt={`${data.title} preview`}
                    width={600}
                    height={400}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group p-6 shadow-black/5 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12">
            <p className="mx-auto mb-12 max-w-md text-balance text-center text-lg font-semibold sm:text-2xl">
              {data.features[2].title}: {data.features[2].desc}
            </p>

            <div className="flex justify-center gap-6">
              <div className="inset-shadow-sm dark:inset-shadow-white/5 bg-muted/35 relative flex aspect-square size-16 items-center rounded-[7px] border p-3 shadow-lg ring dark:shadow-white/5 dark:ring-black">
                <span className="absolute right-2 top-1 block text-sm">AI</span>
                <Icon className="mt-auto size-4" />
              </div>
              <div className="inset-shadow-sm dark:inset-shadow-white/5 bg-muted/35 flex aspect-square size-16 items-center justify-center rounded-[7px] border p-3 shadow-lg ring dark:shadow-white/5 dark:ring-black">
                <Play className="size-4" />
              </div>
            </div>
          </Card>

          <Card className="group relative shadow-black/5 sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
            <CardHeader className="p-6 md:p-12">
              <p className="font-medium">{data.features[3].title}</p>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm">{data.features[3].desc}</p>
            </CardHeader>
            <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                <div className="rounded-[--radius] aspect-square border border-dashed"></div>
                <div className="rounded-[--radius] bg-muted/50 flex aspect-square items-center justify-center border p-4">
                  <Video className="size-8 text-gray-600" />
                </div>
                <div className="rounded-[--radius] aspect-square border border-dashed"></div>
                <div className="rounded-[--radius] bg-muted/50 flex aspect-square items-center justify-center border p-4">
                  <Camera className="size-8 text-gray-600" />
                </div>
                <div className="rounded-[--radius] aspect-square border border-dashed"></div>
                <div className="rounded-[--radius] bg-muted/50 flex aspect-square items-center justify-center border p-4">
                  <Sparkles className="size-8 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 