"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
  Image, 
  Sparkles, 
  MoreHorizontal, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  RefreshCw,
  ChevronDown,
  Download,
  Share2,
  Repeat,
  Wand2,
  Palette,
  Camera,
  Settings,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface ImageSession {
  id: string;
  name: string;
  prompt: string;
  status: "generating" | "completed" | "failed";
  createdAt: Date;
  result?: {
    type: "image";
    content: string;
    imageUrl?: string;
    metadata?: any;
  };
  progress?: number;
  progressMessage?: string;
  model?: string;
}

// Available image models
const imageModels = [
  { 
    value: "flux-pro", 
    label: "Flux Pro",
    description: "Professional quality image generation",
    icon: "⚡",
    time: "30 sec.",
    features: ["High Quality", "Style Control", "Aspect Ratios"],
    credits: 5
  },
  { 
    value: "ideogram", 
    label: "Ideogram",
    description: "Great for text in images and logos",
    icon: "💡",
    time: "20 sec.",
    features: ["Text Rendering", "Logo Design", "Creative Styles"],
    credits: 3
  },
  { 
    value: "dall-e-3", 
    label: "DALL·E 3",
    description: "OpenAI's advanced image model",
    icon: "🎨",
    time: "25 sec.",
    features: ["Natural Language", "Creative Concepts", "Fine Details"],
    credits: 8
  },
  { 
    value: "midjourney", 
    label: "Midjourney",
    description: "Artistic and creative image generation",
    icon: "🌟",
    time: "45 sec.",
    features: ["Artistic Style", "Creative Vision", "High Quality"],
    credits: 10,
    badge: "Premium"
  }
];

// Generate AI-style names for image sessions
const generateImageSessionName = (prompt: string, model: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Stunning', 'Creative', 'Artistic', 'Beautiful', 'Vibrant', 'Epic', 'Masterful', 'Elegant'];
  const suffixes = ['Image', 'Art', 'Creation', 'Design', 'Artwork', 'Piece', 'Visual', 'Portrait'];
  
  const contentWords = words.filter(word => 
    !['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'create', 'make', 'generate'].includes(word)
  );
  
  if (contentWords.length > 0) {
    const mainWord = contentWords[0].charAt(0).toUpperCase() + contentWords[0].slice(1);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const patterns = [
      `${adjective} ${mainWord}`,
      `${mainWord} ${suffix}`,
      `AI ${mainWord}`,
      `${mainWord} Creation`,
      `Digital ${mainWord}`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

function ImagePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedModel, setSelectedModel] = useState("flux-pro");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [stylePreset, setStylePreset] = useState("Default");
  
  // Sessions data
  const [sessions, setSessions] = useState<ImageSession[]>([
    {
      id: "1",
      name: generateImageSessionName("A futuristic cityscape at sunset", "flux-pro"),
      prompt: "A futuristic cityscape at sunset",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 3),
      result: {
        type: "image",
        content: "Generated a stunning futuristic cityscape",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=800",
        metadata: { 
          model: "flux-pro",
          aspectRatio: "1:1",
          style: "Default",
          credits: 5
        }
      },
      model: "flux-pro"
    },
    {
      id: "2",
      name: generateImageSessionName("Elegant portrait of a renaissance artist in their studio", "flux-dev"),
      prompt: "Elegant portrait of a renaissance artist in their studio",
      status: "completed", 
      createdAt: new Date(Date.now() - 1000 * 60 * 8),
      result: {
        type: "image",
        content: "Generated classical portrait artwork",
        imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800",
        metadata: {
          model: "flux-dev",
          aspectRatio: "4:3", 
          style: "Classical",
          credits: 3
        }
      },
      model: "flux-dev"
    },
    {
      id: "3",
      name: generateImageSessionName("Minimalist geometric patterns in pastel colors", "flux-schnell"),
      prompt: "Minimalist geometric patterns in pastel colors",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      result: {
        type: "image", 
        content: "Generated abstract geometric design",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=800",
        metadata: {
          model: "flux-schnell",
          aspectRatio: "1:1",
          style: "Minimalist",
          credits: 2
        }
      },
      model: "flux-schnell"
    },
    {
      id: "4",
      name: generateImageSessionName("Mystical forest with glowing mushrooms and fairy lights", "flux-pro"),
      prompt: "Mystical forest with glowing mushrooms and fairy lights",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 22),
      result: {
        type: "image",
        content: "Generated magical fantasy scene",
        imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=800",
        metadata: {
          model: "flux-pro",
          aspectRatio: "16:9",
          style: "Fantasy", 
          credits: 5
        }
      },
      model: "flux-pro"
    },
    {
      id: "5", 
      name: generateImageSessionName("Modern architectural marvel with glass and steel", "flux-dev"),
      prompt: "Modern architectural marvel with glass and steel",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      result: {
        type: "image",
        content: "Generated contemporary architecture",
        imageUrl: "https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?w=800&h=800",
        metadata: {
          model: "flux-dev",
          aspectRatio: "3:4",
          style: "Modern",
          credits: 3
        }
      },
      model: "flux-dev"
    },
    {
      id: "6",
      name: generateImageSessionName("Vintage travel poster for Mars colony expedition", "flux-pro"),
      prompt: "Vintage travel poster for Mars colony expedition", 
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 38),
      result: {
        type: "image",
        content: "Generated retro-futuristic poster",
        imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=800",
        metadata: {
          model: "flux-pro",
          aspectRatio: "2:3",
          style: "Vintage",
          credits: 5
        }
      },
      model: "flux-pro"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleGenerate(initialPrompt, JSON.parse(initialFiles || '[]'));
      router.replace('/image');
    }
  }, [searchParams, router]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionResults = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen
  const hasResultsInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleGenerate = async (promptText?: string, files?: any[]) => {
    const finalPrompt = promptText || prompt.trim();
    if (!finalPrompt) return;
    
    const newSession: ImageSession = {
      id: Date.now().toString(),
      name: generateImageSessionName(finalPrompt, selectedModel),
      prompt: finalPrompt,
      status: "generating",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "AI is creating your image...",
      model: selectedModel
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsGenerating(true);

    // Simulate generation progress
    const progressInterval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id && session.status === "generating") {
          const newProgress = Math.min((session.progress || 0) + Math.random() * 15, 95);
          const messages = [
            "Analyzing your prompt...",
            "Generating initial concepts...", 
            "Refining details...",
            "Adding finishing touches..."
          ];
          const messageIndex = Math.floor(newProgress / 25);
          
          return {
            ...session,
            progress: newProgress,
            progressMessage: messages[messageIndex] || "Almost done..."
          };
        }
        return session;
      }));
    }, 800);

    // Complete generation after delay
    setTimeout(() => {
      clearInterval(progressInterval);
      const selectedModelData = imageModels.find(m => m.value === selectedModel);
      
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id) {
          return {
            ...session,
            status: "completed" as const,
            progress: 100,
            progressMessage: "Image generated successfully!",
            result: {
              type: "image" as const,
              content: `Generated with ${selectedModelData?.label}`,
              imageUrl: `https://picsum.photos/seed/${session.id}/800/800`,
              metadata: {
                model: selectedModel,
                aspectRatio,
                style: stylePreset,
                credits: selectedModelData?.credits || 5
              }
            }
          };
        }
        return session;
      }));
      
      setIsGenerating(false);
      setPrompt("");
    }, 5000);
  };

  const handleSendMessage = (message: string, files: any[], pastedContent: any[]) => {
    handleGenerate(message, files);
  };

  const handleNewSession = () => {
    setActiveSessionId("new-session");
    setPrompt("");
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: ImageSession) => {
    setPrompt(session.prompt);
    if (session.model) setSelectedModel(session.model);
  };

  const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];
  const stylePresets = ["Default", "Photorealistic", "Artistic", "Anime", "Oil Painting", "Watercolor"];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Image Generation</h1>
                <p className="text-gray-600">Create stunning images with custom styles using AI</p>
              </div>
              <Button 
                onClick={handleNewSession}
                className="bg-gray-900 hover:bg-black text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Generation Controls */}
            <div className="lg:col-span-1 space-y-4">
              {/* Model Selection */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">AI Model</h3>
                <div className="space-y-2">
                  {imageModels.map((model) => (
                    <div
                      key={model.value}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        selectedModel === model.value 
                          ? "border-gray-900 bg-gray-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedModel(model.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{model.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{model.label}</span>
                              {model.badge && (
                                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">
                                  {model.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{model.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{model.time}</div>
                          <div className="text-xs font-medium">{model.credits} credits</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Options</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Aspect Ratio</label>
                    <select 
                      value={aspectRatio} 
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {aspectRatios.map(ratio => (
                        <option key={ratio} value={ratio}>{ratio}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Style Preset</label>
                    <select 
                      value={stylePreset} 
                      onChange={(e) => setStylePreset(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {stylePresets.map(style => (
                        <option key={style} value={style}>{style}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Chat & Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chat Input */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Describe Your Image</h3>
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder="Describe the image you want to create..."
                  maxFiles={3}
                  maxFileSize={10 * 1024 * 1024}
                  fullWidth={true}
                  textareaClassName="text-lg"
                  buttonText="Generate Image"
                  buttonClassName="bg-gray-900 hover:bg-black text-white"
                  typingExamples={[
                    "A majestic mountain landscape at golden hour",
                    "Portrait of a cyberpunk character with neon lights",
                    "Abstract geometric art in blue and gold",
                    "A cozy coffee shop interior with warm lighting",
                    "Futuristic city skyline with flying cars"
                  ]}
                />
              </div>

              {/* Results */}
              {hasResultsInSession && (
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Generated Images</h3>
                    <div className="text-sm text-gray-500">
                      {currentSessionResults.length} image{currentSessionResults.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentSessionResults.map((session) => (
                      <div key={session.id} className="border rounded-lg overflow-hidden">
                        {session.result?.imageUrl && (
                          <img 
                            src={session.result.imageUrl} 
                            alt={session.prompt}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-1">{session.name}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{session.prompt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {session.result?.metadata?.model}
                              </span>
                              <span className="text-xs text-gray-500">
                                {session.result?.metadata?.credits} credits
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleCopyPrompt(session.prompt)}
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy prompt</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleReuseParameters(session)}
                                  >
                                    <Repeat className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Reuse parameters</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Generation Progress */}
              {isGenerating && activeSession && (
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{activeSession.name}</h3>
                      <p className="text-sm text-gray-600">{activeSession.progressMessage}</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-900 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${activeSession.progress || 0}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>{activeSession.progressMessage}</span>
                    <span>{Math.round(activeSession.progress || 0)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 

import { Suspense as __Sus } from "react";
export default function ImagePage() {
  return <__Sus fallback={null}><ImagePageInner /></__Sus>;
}
