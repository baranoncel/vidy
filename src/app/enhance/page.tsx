"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/ui/video-player";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
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
  Maximize2,
  Image,
  Video,
  Settings,
  History,
  ArrowUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface EnhanceSession {
  id: string;
  name: string;
  prompt: string;
  status: "enhancing" | "completed" | "failed";
  createdAt: Date;
  result?: {
    type: "image" | "video";
    content: string;
    originalUrl?: string;
    enhancedUrl?: string;
    metadata?: any;
  };
  progress?: number;
  progressMessage?: string;
  enhanceType?: string;
}

// Available enhancement types
const enhanceTypes = [
  { 
    value: "image-upscale", 
    label: "Image Upscale",
    description: "Upscale images up to 4K resolution",
    icon: "🖼️",
    time: "30 sec.",
    features: ["4K Upscaling", "Detail Enhancement", "Noise Reduction"],
    credits: 5
  },
  { 
    value: "video-upscale", 
    label: "Video Upscale",
    description: "Upscale videos up to 4K with frame interpolation",
    icon: "🎬",
    time: "3 min.",
    features: ["4K Upscaling", "Frame Interpolation", "Stabilization"],
    credits: 20
  },
  { 
    value: "super-resolution", 
    label: "Super Resolution",
    description: "AI-powered super resolution up to 8K",
    icon: "✨",
    time: "2 min.",
    features: ["8K Upscaling", "AI Enhancement", "Detail Recovery"],
    credits: 15,
    badge: "Premium"
  },
  { 
    value: "real-esrgan", 
    label: "Real-ESRGAN",
    description: "Professional grade image enhancement",
    icon: "🔧",
    time: "45 sec.",
    features: ["Real-ESRGAN", "Anime Support", "Face Enhancement"],
    credits: 8
  },
  { 
    value: "topaz-gigapixel", 
    label: "Topaz Gigapixel",
    description: "Industry standard upscaling up to 600%",
    icon: "💎",
    time: "1 min.",
    features: ["600% Upscale", "Professional Quality", "Artifact Removal"],
    credits: 12,
    badge: "Professional"
  }
];

// Generate AI-style names for enhance sessions
const generateEnhanceSessionName = (prompt: string, enhanceType: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Enhanced', 'Upscaled', 'Improved', 'Refined', 'Professional', 'Crystal', 'Sharp', 'Ultra'];
  const suffixes = ['Image', 'Video', 'Media', 'Content', 'Visual', 'Quality', 'Resolution', 'Enhancement'];
  
  const contentWords = words.filter(word => 
    !['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'enhance', 'upscale', 'improve'].includes(word)
  );
  
  if (contentWords.length > 0) {
    const mainWord = contentWords[0].charAt(0).toUpperCase() + contentWords[0].slice(1);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const patterns = [
      `${adjective} ${mainWord}`,
      `${mainWord} ${suffix}`,
      `${mainWord} Enhancement`,
      `HD ${mainWord}`,
      `${mainWord} Pro`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

function EnhancePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"enhance" | "upscale">("enhance");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedEnhanceType, setSelectedEnhanceType] = useState("photo-enhance");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [upscaleFactor, setUpscaleFactor] = useState("2x");
  const [outputFormat, setOutputFormat] = useState("PNG");
  const [denoisingStrength, setDenoisingStrength] = useState("Medium");
  
  // Sessions data
  const [sessions, setSessions] = useState<EnhanceSession[]>([
    {
      id: "1",
      name: generateEnhanceSessionName("Old family photo restoration", "photo-enhance"),
      prompt: "Old family photo restoration",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      result: {
        type: "image",
        content: "Enhanced vintage family photo",
        originalUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300",
        enhancedUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&auto=enhance",
        metadata: { 
          enhanceType: "photo-enhance",
          improvement: "95%",
          credits: 12
        }
      },
      enhanceType: "photo-enhance"
    },
    {
      id: "2", 
      name: generateEnhanceSessionName("Low-light video from concert footage", "video-enhance"),
      prompt: "Low-light video from concert footage",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 12),
      result: {
        type: "video",
        content: "Enhanced concert video with improved lighting",
        originalUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        enhancedUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        metadata: {
          enhanceType: "video-enhance",
          improvement: "87%",
          credits: 18
        }
      },
      enhanceType: "video-enhance"
    },
    {
      id: "3",
      name: generateEnhanceSessionName("Blurry smartphone photo upscaling", "photo-enhance"),
      prompt: "Blurry smartphone photo upscaling",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 20),
      result: {
        type: "image", 
        content: "Sharp, high-resolution image from blurry original",
        originalUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200",
        enhancedUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600",
        metadata: {
          enhanceType: "photo-enhance",
          improvement: "92%",
          credits: 12
        }
      },
      enhanceType: "photo-enhance"
    },
    {
      id: "4",
      name: generateEnhanceSessionName("Vintage film grain removal and color correction", "video-enhance"), 
      prompt: "Vintage film grain removal and color correction",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 28),
      result: {
        type: "video",
        content: "Restored vintage film with vibrant colors",
        originalUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        enhancedUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        metadata: {
          enhanceType: "video-enhance",
          improvement: "89%",
          credits: 18
        }
      },
      enhanceType: "video-enhance"
    },
    {
      id: "5",
      name: generateEnhanceSessionName("Product photography enhancement for e-commerce", "photo-enhance"),
      prompt: "Product photography enhancement for e-commerce",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 35),
      result: {
        type: "image",
        content: "Professional product photos with perfect lighting",
        originalUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400",
        enhancedUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&auto=enhance",
        metadata: {
          enhanceType: "photo-enhance",
          improvement: "94%", 
          credits: 12
        }
      },
      enhanceType: "photo-enhance"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleEnhance(initialPrompt, JSON.parse(initialFiles || '[]'));
      router.replace('/enhance');
    }
  }, [searchParams, router]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionResults = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen
  const hasResultsInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleEnhance = async (promptText?: string, files?: any[]) => {
    const finalPrompt = promptText || prompt.trim();
    if (!finalPrompt) return;
    
    const newSession: EnhanceSession = {
      id: Date.now().toString(),
      name: generateEnhanceSessionName(finalPrompt, selectedEnhanceType),
      prompt: finalPrompt,
      status: "enhancing",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "AI is enhancing your content...",
      enhanceType: selectedEnhanceType
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsEnhancing(true);

    // Simulate enhancement progress
    const progressInterval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id && session.status === "enhancing") {
          const newProgress = Math.min((session.progress || 0) + Math.random() * 12, 95);
          const messages = [
            "Analyzing content quality...",
            "Upscaling resolution...", 
            "Enhancing details...",
            "Reducing noise and artifacts...",
            "Finalizing enhancement..."
          ];
          const messageIndex = Math.floor(newProgress / 20);
          
          return {
            ...session,
            progress: newProgress,
            progressMessage: messages[messageIndex] || "Almost finished..."
          };
        }
        return session;
      }));
    }, 1000);

    // Complete enhancement after delay
    setTimeout(() => {
      clearInterval(progressInterval);
      const selectedTypeData = enhanceTypes.find(t => t.value === selectedEnhanceType);
      const isVideo = selectedEnhanceType.includes('video');
      
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id) {
          return {
            ...session,
            status: "completed" as const,
            progress: 100,
            progressMessage: "Enhancement completed successfully!",
            result: {
              type: isVideo ? "video" as const : "image" as const,
              content: `Enhanced with ${selectedTypeData?.label}`,
              originalUrl: isVideo 
                ? "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
                : `https://picsum.photos/seed/${session.id}/400/400`,
              enhancedUrl: isVideo
                ? "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4"
                : `https://picsum.photos/seed/${session.id}/800/800`,
              metadata: {
                enhanceType: selectedEnhanceType,
                upscaleFactor,
                format: outputFormat,
                denoisingStrength,
                credits: selectedTypeData?.credits || 5
              }
            }
          };
        }
        return session;
      }));
      
      setIsEnhancing(false);
      setPrompt("");
    }, 6000);
  };

  const handleSendMessage = (message: string, files: any[], pastedContent: any[]) => {
    handleEnhance(message, files);
  };

  const handleNewSession = () => {
    setActiveSessionId("new-session");
    setPrompt("");
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: EnhanceSession) => {
    setPrompt(session.prompt);
    if (session.enhanceType) setSelectedEnhanceType(session.enhanceType);
  };

  const upscaleFactors = ["2x", "4x", "6x", "8x"];
  const outputFormats = ["PNG", "JPEG", "WebP", "TIFF"];
  const denoisingStrengths = ["Low", "Medium", "High"];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Enhance & Upscale</h1>
                <p className="text-gray-600">Upscale and enhance images and videos up to 8K resolution</p>
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
            {/* Left Panel - Enhancement Controls */}
            <div className="lg:col-span-1 space-y-4">
              {/* Enhancement Type Selection */}
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Enhancement Type</h3>
                <div className="space-y-2">
                  {enhanceTypes.map((type) => (
                    <div
                      key={type.value}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-all",
                        selectedEnhanceType === type.value 
                          ? "border-gray-900 bg-gray-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedEnhanceType(type.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{type.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{type.label}</span>
                              {type.badge && (
                                <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-600 rounded">
                                  {type.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600">{type.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{type.time}</div>
                          <div className="text-xs font-medium">{type.credits} credits</div>
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
                    <label className="text-sm font-medium text-gray-700 block mb-1">Upscale Factor</label>
                    <select 
                      value={upscaleFactor} 
                      onChange={(e) => setUpscaleFactor(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {upscaleFactors.map(factor => (
                        <option key={factor} value={factor}>{factor}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Output Format</label>
                    <select 
                      value={outputFormat} 
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {outputFormats.map(format => (
                        <option key={format} value={format}>{format}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Denoising Strength</label>
                    <select 
                      value={denoisingStrength} 
                      onChange={(e) => setDenoisingStrength(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {denoisingStrengths.map(strength => (
                        <option key={strength} value={strength}>{strength}</option>
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
                <h3 className="font-semibold text-gray-900 mb-4">Upload & Enhance Content</h3>
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder="Upload your image or video to enhance, or describe what you want to enhance..."
                  maxFiles={5}
                  maxFileSize={100 * 1024 * 1024}
                  fullWidth={true}
                  textareaClassName="text-lg"
                  buttonText="Enhance Content"
                  buttonClassName="bg-gray-900 hover:bg-black text-white"
                  typingExamples={[
                    "Enhance this portrait photo to 4K quality",
                    "Upscale this video to professional quality",
                    "Remove noise and improve image sharpness",
                    "Enhance video quality for social media",
                    "Improve old photo quality and resolution"
                  ]}
                />
              </div>

              {/* Results */}
              {hasResultsInSession && (
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Enhanced Content</h3>
                    <div className="text-sm text-gray-500">
                      {currentSessionResults.length} item{currentSessionResults.length !== 1 ? 's' : ''} enhanced
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {currentSessionResults.map((session) => (
                      <div key={session.id} className="border rounded-lg overflow-hidden">
                        {/* Before/After Comparison */}
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Original</h5>
                              {session.result?.type === "video" ? (
                                session.result.originalUrl && (
                                  <VideoPlayer 
                                    src={session.result.originalUrl}
                                    className="w-full h-32 rounded"
                                  />
                                )
                              ) : (
                                session.result?.originalUrl && (
                                  <img 
                                    src={session.result.originalUrl} 
                                    alt="Original"
                                    className="w-full h-32 object-cover rounded"
                                  />
                                )
                              )}
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Enhanced</h5>
                              {session.result?.type === "video" ? (
                                session.result.enhancedUrl && (
                                  <VideoPlayer 
                                    src={session.result.enhancedUrl}
                                    className="w-full h-32 rounded"
                                  />
                                )
                              ) : (
                                session.result?.enhancedUrl && (
                                  <img 
                                    src={session.result.enhancedUrl} 
                                    alt="Enhanced"
                                    className="w-full h-32 object-cover rounded"
                                  />
                                )
                              )}
                            </div>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 mb-1">{session.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{session.prompt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {session.result?.metadata?.enhanceType}
                              </span>
                              <span className="text-xs text-gray-500">
                                {session.result?.metadata?.upscaleFactor}
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
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Download enhanced</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Enhancement Progress */}
              {isEnhancing && activeSession && (
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
export default function EnhancePage() {
  return <__Sus fallback={null}><EnhancePageInner /></__Sus>;
}
