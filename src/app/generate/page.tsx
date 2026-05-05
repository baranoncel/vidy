"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/ui/video-player";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
  Video, 
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
  Volume2,
  Download,
  Share2,
  Repeat,
  Wand2,
  Link2,
  Settings,
  Upload,
  ImageIcon,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

interface Session {
  id: string;
  name: string; // AI-generated, user-editable name
  prompt: string;
  status: "generating" | "completed" | "failed";
  createdAt: Date;
  thumbnail?: string;
  videoUrl?: string;
  progress?: number;
  progressMessage?: string;
  model?: string;
  resolution?: string;
  style?: string;
}

// Available models
const models = [
  { 
    value: "wan-2.1", 
    label: "Wan 2.1",
    description: "New fast model with live previews",
    icon: "🦅",
    time: "1 min.",
    features: ["Start frame", "End frame", "Styles"],
    credits: 10,
    selected: true
  },
  { 
    value: "hunyuan", 
    label: "Hunyuan",
    description: "Fast and high-quality model",
    icon: "🌀",
    time: "1 min.",
    features: [],
    credits: 8
  },
  { 
    value: "kling-2.1", 
    label: "Kling 2.1",
    description: "New frontier model",
    icon: "👑",
    time: "5 min.",
    features: ["Start frame"],
    badge: "Expensive model",
    credits: 50
  },
  { 
    value: "kling-2.0", 
    label: "Kling 2.0",
    description: "Frontier model",
    icon: "👑",
    time: "5 min.",
    features: ["Start frame"],
    badge: "Expensive model",
    credits: 45
  },
  { 
    value: "veo-2", 
    label: "Veo 2",
    description: "Expensive high-quality model from Google",
    icon: "🎥",
    time: "5 min.",
    features: ["Start frame"],
    badge: "Expensive model",
    credits: 60
  },
  { 
    value: "veo-3", 
    label: "Veo 3",
    description: "Expensive high-quality model from Google",
    icon: "🎥",
    time: "5 min.",
    features: [],
    badge: "Expensive model",
    credits: 70
  },
  { 
    value: "seedance", 
    label: "Seedance",
    description: "New fast, high-quality model from ByteDance",
    icon: "📊",
    time: "2 min.",
    features: ["Start frame"],
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
  }
];

// Generate AI-style names based on prompt content
const generateAISessionName = (prompt: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Creative', 'Dynamic', 'Artistic', 'Professional', 'Stunning', 'Vibrant', 'Epic', 'Sleek', 'Modern', 'Elegant'];
  const suffixes = ['Vision', 'Project', 'Creation', 'Studio', 'Work', 'Piece', 'Design', 'Concept'];
  
  // Try to extract key content words
  const contentWords = words.filter(word => 
    !['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'].includes(word)
  );
  
  if (contentWords.length > 0) {
    const mainWord = contentWords[0].charAt(0).toUpperCase() + contentWords[0].slice(1);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    // Different naming patterns
    const patterns = [
      `${adjective} ${mainWord}`,
      `${mainWord} ${suffix}`,
      `${adjective} ${suffix}`,
      `${mainWord} Study`,
      `Video ${mainWord}`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  // Fallback to generic name
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"video" | "image">("video");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [resolution, setResolution] = useState("720p");
  const [showResolutionDropdown, setShowResolutionDropdown] = useState(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("Default");
  const [selectedModel, setSelectedModel] = useState("wan-2.1");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [useStartFrame, setUseStartFrame] = useState(false);
  const [useEndFrame, setUseEndFrame] = useState(false);

  // Real backend wiring: hits /api/feature/generate (or /image when activeTab is image),
  // uploads to R2 if needed, polls SSE.
  const featureRun = useFeatureRun(activeTab === "image" ? "image" : "generate");
  
  // Mock sessions data
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      name: "Ferrari Dreams",
      prompt: "a man sitting on a ferrari red",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200",
      videoUrl: "https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4",
      model: "wan-2.1",
      resolution: "720p",
      style: "Default"
    },
    {
      id: "2", 
      name: "Ocean Waves",
      prompt: "peaceful ocean waves crashing on a tropical beach at golden hour",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 12),
      thumbnail: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200&h=200",
      videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
      model: "wan-2.1",
      resolution: "1080p", 
      style: "Cinematic"
    },
    {
      id: "3",
      name: "Cyberpunk City",
      prompt: "futuristic cyberpunk city with neon lights and flying cars at night",
      status: "completed", 
      createdAt: new Date(Date.now() - 1000 * 60 * 25),
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200",
      videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
      model: "wan-2.5",
      resolution: "4K",
      style: "Abstract"
    },
    {
      id: "4",
      name: "Forest Animation", 
      prompt: "magical forest with glowing fireflies and ancient trees swaying in the wind",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 40),
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=200", 
      videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
      model: "wan-2.1",
      resolution: "720p",
      style: "Anime"
    },
    {
      id: "5",
      name: "Space Journey",
      prompt: "astronaut floating through colorful nebula with distant galaxies",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 55),
      thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=200",
      videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4", 
      model: "wan-2.5",
      resolution: "1080p",
      style: "Realistic"
    },
    {
      id: "6",
      name: "Dancing Flames",
      prompt: "mesmerizing campfire flames dancing in slow motion with sparks flying",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 68),
      thumbnail: "https://images.unsplash.com/photo-1574273746324-ebe9a6e03d79?w=200&h=200",
      videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
      model: "wan-2.1", 
      resolution: "720p",
      style: "Cinematic"
    }
  ]);

  const resolutions = ["480p", "720p", "1080p", "4K"];
  const styles = ["Default", "Cinematic", "Anime", "Realistic", "Abstract"];

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionVideos = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen
  const hasVideosInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    const newSession: Session = {
      id: Date.now().toString(),
      name: generateAISessionName(prompt.trim()),
      prompt: prompt.trim(),
      status: "generating",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "Initializing...",
      model: selectedModel,
      resolution,
      style: selectedStyle
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsGenerating(true);

    try {
      const durationMap: Record<string, number> = { "5": 5, "8": 8, "10": 10 };
      const durationSeconds = durationMap[resolution] ?? 5;
      const result = await featureRun.run({
        prompt: prompt.trim(),
        durationSeconds,
        aspectRatio: "16:9",
      });
      const url = result?.outputUrl ?? null;
      setSessions(prev => prev.map(s =>
        s.id === newSession.id
          ? {
              ...s,
              status: result?.status === "completed" ? "completed" : "failed",
              videoUrl: url || undefined,
              thumbnail: url || undefined,
            }
          : s,
      ));
    } catch (err) {
      setSessions(prev => prev.map(s =>
        s.id === newSession.id ? { ...s, status: "failed", progressMessage: err instanceof Error ? err.message : "Failed" } : s,
      ));
    } finally {
      setIsGenerating(false);
      setPrompt("");
    }
  };

  const handleSendMessage = (message: string, files: any[], pastedContent: any[]) => {
    setPrompt(message);
    setTimeout(() => {
      if (message.trim()) {
        handleGenerate();
      }
    }, 100);
  };

  const handleNewSession = () => {
    const newSessionId = "new-session";
    setActiveSessionId(newSessionId);
    setPrompt("");
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: Session) => {
    setPrompt(session.prompt);
    setSelectedModel(session.model || "wan-2.1");
    setResolution(session.resolution || "720p");
    setSelectedStyle(session.style || "Default");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Left Sidebar - Sessions */}
      <TooltipProvider>
        <div className="fixed left-0 top-1/2 -translate-y-1/2 w-16 bg-gray-50 border border-gray-100 rounded-r-xl shadow-lg z-50 flex flex-col max-h-[80vh]">
          <div className="p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleNewSession}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-white text-gray-900 border-gray-200 shadow-lg">
                <p>New Session</p>
              </TooltipContent>
            </Tooltip>
          </div>
        
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {sessions.map((session) => (
              <div key={session.id} className="relative group">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveSessionId(session.id)}
                      className={cn(
                        "w-full h-12 rounded-lg overflow-hidden relative transition-all",
                        activeSessionId === session.id 
                          ? "ring-2 ring-blue-500" 
                          : "hover:ring-2 hover:ring-gray-300"
                      )}
                    >
                      {session.thumbnail ? (
                        <img
                          src={session.thumbnail}
                          alt={session.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Video className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status indicator */}
                      <div className="absolute top-1 right-1">
                        {session.status === "generating" && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                        )}
                        {session.status === "completed" && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                        {session.status === "failed" && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white text-gray-900 border-gray-200 shadow-lg">
                    <p className="font-medium">{session.name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>

      {/* Main Content */}
      <div className="pl-20">
        {isGenerating ? (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Generating...</h2>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          </div>
        ) : hasVideosInSession ? (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto pb-64">
              <div className="max-w-4xl mx-auto px-4 py-8">
                {currentSessionVideos.map((video) => (
                  <div key={video.id} className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Video className="h-4 w-4" />
                      <span>{video.prompt}</span>
                    </div>
                    
                    {video.videoUrl && (
                      <VideoPlayer src={video.videoUrl} />
                    )}
                    
                    <div className="flex items-center gap-3 mt-4">
                      <button 
                        onClick={() => handleReuseParameters(video)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reuse parameters</span>
                      </button>
                      
                      <button 
                        onClick={() => handleCopyPrompt(video.prompt)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        <span>Copy prompt</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom prompt section - sticky */}
            <div className="fixed bottom-0 left-20 right-0 z-50 py-8">
              <div className="max-w-2xl mx-auto px-4">
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder={`Describe a ${activeTab} and click generate...`}
                  models={models.map(model => ({
                    id: model.value,
                    name: model.label,
                    description: model.description,
                    badge: model.badge
                  }))}
                  defaultModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button 
                  onClick={() => setUseStartFrame(!useStartFrame)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useStartFrame ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Start frame</span>
                </button>
                
                <button 
                  onClick={() => setUseEndFrame(!useEndFrame)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useEndFrame ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>End frame</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Original centered layout when no videos */
          <div className="max-w-4xl mx-auto px-4 py-16">
            {/* Tab Navigation */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setActiveTab("video")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "video" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "video" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Video className={cn(
                    "h-6 w-6",
                    activeTab === "video" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Video</span>
              </button>
              
              <button
                onClick={() => setActiveTab("image")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "image" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "image" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Image className={cn(
                    "h-6 w-6",
                    activeTab === "image" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Image</span>
              </button>
            </div>

            <div className="text-center">
              {/* Claude-style AI Input */}
              <div className="max-w-2xl mx-auto">
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder={`Describe a ${activeTab} and click generate...`}
                  models={models.map(model => ({
                    id: model.value,
                    name: model.label,
                    description: model.description,
                    badge: model.badge
                  }))}
                  defaultModel={selectedModel}
                  onModelChange={setSelectedModel}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <button 
                  onClick={() => setUseStartFrame(!useStartFrame)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useStartFrame ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Start frame</span>
                </button>
                
                <button 
                  onClick={() => setUseEndFrame(!useEndFrame)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useEndFrame ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>End frame</span>
                </button>
                
                {/* Style Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowStyleDropdown(!showStyleDropdown)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Style</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {showStyleDropdown && (
                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[60]">
                      {styles.map((style) => (
                        <button
                          key={style}
                          onClick={() => {
                            setSelectedStyle(style);
                            setShowStyleDropdown(false);
                          }}
                          className={cn(
                            "block w-full px-4 py-2 text-sm text-left hover:bg-gray-50",
                            selectedStyle === style && "bg-gray-50 font-medium"
                          )}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Resolution Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowResolutionDropdown(!showResolutionDropdown)}
                    className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    {resolution}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  
                  {showResolutionDropdown && (
                    <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[60]">
                      {resolutions.map((res) => (
                        <button
                          key={res}
                          onClick={() => {
                            setResolution(res);
                            setShowResolutionDropdown(false);
                          }}
                          className={cn(
                            "block w-full px-4 py-2 text-sm text-left hover:bg-gray-50",
                            resolution === res && "bg-gray-50 font-medium"
                          )}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 