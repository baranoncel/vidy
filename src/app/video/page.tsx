"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/ui/video-player";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
  Video, 
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
  Volume2,
  Download,
  Share2,
  Repeat,
  Wand2,
  Film,
  Settings,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

interface VideoSession {
  id: string;
  name: string;
  prompt: string;
  status: "generating" | "completed" | "failed";
  createdAt: Date;
  result?: {
    type: "video";
    content: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    metadata?: any;
  };
  progress?: number;
  progressMessage?: string;
  model?: string;
}

// Available video models
const videoModels = [
  { 
    value: "hailo-2.5", 
    label: "Hailo 2.5",
    description: "Fast and high-quality video generation",
    icon: "🚀",
    time: "2 min.",
    features: ["High Quality", "Fast Generation", "Multiple Styles"],
    credits: 15
  },
  { 
    value: "pika-2.2", 
    label: "Pika 2.2",
    description: "Add, remove, change things in your video. Pika effects",
    icon: "☁️",
    time: "4 min.",
    features: ["Start frame", "End frame", "Effects"],
    credits: 25
  },
  { 
    value: "runway-gen-3", 
    label: "Runway Gen-3",
    description: "Professional video generation model",
    icon: "🎬",
    time: "3 min.",
    features: ["Cinematic Quality", "Motion Control", "Style Transfer"],
    credits: 20
  },
  { 
    value: "luma-dream", 
    label: "Luma Dream Machine",
    description: "Realistic video generation with physics",
    icon: "🌟",
    time: "5 min.",
    features: ["Physics Simulation", "Realistic Motion", "High Fidelity"],
    credits: 30,
    badge: "Premium"
  },
  { 
    value: "veo-2", 
    label: "Veo 2",
    description: "Google's expensive high-quality model",
    icon: "🎥",
    time: "5 min.",
    features: ["Start frame", "Ultra High Quality"],
    badge: "Expensive",
    credits: 60
  }
];

// Generate AI-style names for video sessions
const generateVideoSessionName = (prompt: string, model: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Epic', 'Cinematic', 'Dynamic', 'Stunning', 'Creative', 'Professional', 'Artistic', 'Powerful'];
  const suffixes = ['Video', 'Film', 'Clip', 'Scene', 'Movie', 'Production', 'Visual', 'Creation'];
  
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
      `${mainWord} Studio`,
      `${mainWord} Production`,
      `AI ${mainWord}`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

function VideoPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedModel, setSelectedModel] = useState("hailo-2.5");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [duration, setDuration] = useState("5");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [motionIntensity, setMotionIntensity] = useState("Medium");
  const featureRun = useFeatureRun("video");
  
  // Sessions data
  const [sessions, setSessions] = useState<VideoSession[]>([
    {
      id: "1",
      name: generateVideoSessionName("A drone flying over a mountain landscape", "hailo-2.5"),
      prompt: "A drone flying over a mountain landscape",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      result: {
        type: "video",
        content: "Generated a stunning aerial video",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200",
        metadata: { 
          model: "hailo-2.5",
          duration: "5s",
          aspectRatio: "16:9",
          credits: 15
        }
      },
      model: "hailo-2.5"
    },
    {
      id: "2",
      name: generateVideoSessionName("Time-lapse of city lights transitioning from day to night", "hailo-1.5"),
      prompt: "Time-lapse of city lights transitioning from day to night",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 12),
      result: {
        type: "video",
        content: "Generated urban time-lapse video",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200",
        metadata: {
          model: "hailo-1.5", 
          duration: "8s",
          aspectRatio: "16:9",
          credits: 12
        }
      },
      model: "hailo-1.5"
    },
    {
      id: "3",
      name: generateVideoSessionName("Underwater coral reef with tropical fish swimming", "hailo-2.5"),
      prompt: "Underwater coral reef with tropical fish swimming",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 20),
      result: {
        type: "video",
        content: "Generated underwater marine life video", 
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=200&h=200",
        metadata: {
          model: "hailo-2.5",
          duration: "6s",
          aspectRatio: "16:9",
          credits: 15
        }
      },
      model: "hailo-2.5"
    },
    {
      id: "4", 
      name: generateVideoSessionName("Abstract liquid metal flowing in zero gravity", "hailo-mini"),
      prompt: "Abstract liquid metal flowing in zero gravity",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 28),
      result: {
        type: "video",
        content: "Generated abstract fluid dynamics video",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200",
        metadata: {
          model: "hailo-mini",
          duration: "4s", 
          aspectRatio: "1:1",
          credits: 8
        }
      },
      model: "hailo-mini"
    },
    {
      id: "5",
      name: generateVideoSessionName("Cherry blossoms falling in slow motion with gentle breeze", "hailo-1.5"),
      prompt: "Cherry blossoms falling in slow motion with gentle breeze",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 35),
      result: {
        type: "video",
        content: "Generated serene nature video",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200&h=200", 
        metadata: {
          model: "hailo-1.5",
          duration: "7s",
          aspectRatio: "9:16",
          credits: 12
        }
      },
      model: "hailo-1.5"
    },
    {
      id: "6",
      name: generateVideoSessionName("Futuristic robot assembling itself from scattered parts", "hailo-2.5"), 
      prompt: "Futuristic robot assembling itself from scattered parts",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 43),
      result: {
        type: "video",
        content: "Generated sci-fi transformation video",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200",
        metadata: {
          model: "hailo-2.5",
          duration: "10s",
          aspectRatio: "16:9", 
          credits: 15
        }
      },
      model: "hailo-2.5"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleGenerate(initialPrompt, JSON.parse(initialFiles || '[]'));
      router.replace('/video');
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
    
    const newSession: VideoSession = {
      id: Date.now().toString(),
      name: generateVideoSessionName(finalPrompt, selectedModel),
      prompt: finalPrompt,
      status: "generating",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "AI is creating your video...",
      model: selectedModel
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsGenerating(true);

    // Light progress hint while real backend runs
    const progressInterval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id && session.status === "generating") {
          const newProgress = Math.min((session.progress || 0) + Math.random() * 8, 92);
          const messages = ["Analyzing prompt…", "Queuing job…", "Generating frames…", "Rendering…", "Almost ready…"];
          return { ...session, progress: newProgress, progressMessage: messages[Math.floor(newProgress / 20)] || "Almost ready…" };
        }
        return session;
      }));
    }, 1200);

    try {
      const result = await featureRun.run({
        prompt: finalPrompt,
        durationSeconds: Number(duration) || 5,
        aspectRatio,
      });
      clearInterval(progressInterval);
      const url = result?.outputUrl ?? null;
      const selectedModelData = videoModels.find(m => m.value === selectedModel);
      setSessions(prev => prev.map(session => session.id === newSession.id ? {
        ...session,
        status: result?.status === "completed" ? "completed" : "failed",
        progress: 100,
        progressMessage: result?.status === "completed" ? "Video generated successfully" : (result?.errorMessage || "Failed"),
        result: url ? {
          type: "video" as const,
          content: `Generated with ${selectedModelData?.label || "Vidy"}`,
          videoUrl: url,
          thumbnailUrl: url,
          metadata: {
            model: result?.modelSlug || selectedModel,
            duration: `${duration}s`,
            aspectRatio,
            motionIntensity,
            credits: result?.finalCoins ?? result?.estCoins ?? selectedModelData?.credits ?? 0,
          },
        } : undefined,
      } : session));
    } catch (err) {
      clearInterval(progressInterval);
      setSessions(prev => prev.map(s => s.id === newSession.id ? { ...s, status: "failed" as const, progressMessage: err instanceof Error ? err.message : "Failed" } : s));
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
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

  const handleReuseParameters = (session: VideoSession) => {
    setPrompt(session.prompt);
    if (session.model) setSelectedModel(session.model);
  };

  const durations = ["3", "5", "10", "15"];
  const aspectRatios = ["16:9", "9:16", "1:1", "4:3"];
  const motionIntensities = ["Low", "Medium", "High"];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Generation</h1>
                <p className="text-gray-600">Generate videos with Hailo, Pika, Runway, Luma, and more</p>
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
                  {videoModels.map((model) => (
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
                    <label className="text-sm font-medium text-gray-700 block mb-1">Duration</label>
                    <select 
                      value={duration} 
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {durations.map(dur => (
                        <option key={dur} value={dur}>{dur} seconds</option>
                      ))}
                    </select>
                  </div>
                  
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
                    <label className="text-sm font-medium text-gray-700 block mb-1">Motion Intensity</label>
                    <select 
                      value={motionIntensity} 
                      onChange={(e) => setMotionIntensity(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {motionIntensities.map(intensity => (
                        <option key={intensity} value={intensity}>{intensity}</option>
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
                <h3 className="font-semibold text-gray-900 mb-4">Describe Your Video</h3>
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder="Describe the video you want to create..."
                  maxFiles={3}
                  maxFileSize={50 * 1024 * 1024}
                  fullWidth={true}
                  textareaClassName="text-lg"
                  buttonText="Generate Video"
                  buttonClassName="bg-gray-900 hover:bg-black text-white"
                  typingExamples={[
                    "A drone flying over a mountain landscape at sunset",
                    "A person walking through a neon-lit cyberpunk city",
                    "Ocean waves crashing on a rocky coastline",
                    "A cat playing with a ball of yarn in slow motion",
                    "Time-lapse of clouds moving over a city skyline"
                  ]}
                />
              </div>

              {/* Results */}
              {hasResultsInSession && (
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Generated Videos</h3>
                    <div className="text-sm text-gray-500">
                      {currentSessionResults.length} video{currentSessionResults.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    {currentSessionResults.map((session) => (
                      <div key={session.id} className="border rounded-lg overflow-hidden">
                        {session.result?.videoUrl && (
                          <VideoPlayer 
                            src={session.result.videoUrl}
                            className="w-full h-64"
                          />
                        )}
                        <div className="p-4">
                          <h4 className="font-medium text-gray-900 mb-1">{session.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{session.prompt}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {session.result?.metadata?.model}
                              </span>
                              <span className="text-xs text-gray-500">
                                {session.result?.metadata?.duration}
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
export default function VideoPage() {
  return <__Sus fallback={null}><VideoPageInner /></__Sus>;
}
