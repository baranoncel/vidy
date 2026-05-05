"use client";


import { useState, useEffect } from "react";
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
  BookOpen,
  FileText,
  Pen,
  Zap,
  Settings,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useAgentRun } from "@/lib/hooks/useFeatureRun";

interface StorySession {
  id: string;
  name: string;
  prompt: string;
  status: "creating" | "completed" | "failed";
  createdAt: Date;
  result?: {
    type: "video" | "text" | "storyboard";
    content: string;
    thumbnail?: string;
    videoUrl?: string;
    metadata?: any;
  };
  progress?: number;
  progressMessage?: string;
  storyType?: string;
}

// Available story types (models)
const storyTypes = [
  { 
    value: "visual-story", 
    label: "Visual Story",
    description: "Create engaging visual narratives with videos",
    icon: "🎬",
    time: "3 min.",
    features: ["Video Stories", "Scene Transitions", "Visual Effects"],
    credits: 20
  },
  { 
    value: "brand-story", 
    label: "Brand Story",
    description: "Craft compelling brand narratives and commercials",
    icon: "🏢",
    time: "2 min.",
    features: ["Brand Identity", "Product Stories", "Marketing Videos"],
    credits: 15
  },
  { 
    value: "social-story", 
    label: "Social Story",
    description: "Create stories optimized for social media platforms",
    icon: "📱",
    time: "1 min.",
    features: ["Short Form", "TikTok Style", "Instagram Reels"],
    credits: 10
  },
  { 
    value: "documentary", 
    label: "Documentary",
    description: "Professional documentary-style storytelling",
    icon: "🎞️",
    time: "5 min.",
    features: ["Real Stories", "Interview Style", "Narration"],
    credits: 30,
    badge: "Premium"
  }
];

// Generate AI-style names for story sessions
const generateStorySessionName = (prompt: string, storyType: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Epic', 'Captivating', 'Inspiring', 'Dramatic', 'Heartfelt', 'Powerful', 'Moving', 'Engaging'];
  const suffixes = ['Tale', 'Story', 'Journey', 'Adventure', 'Chronicle', 'Saga', 'Narrative', 'Legend'];
  
  // Try to extract key content words
  const contentWords = words.filter(word => 
    !['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'create', 'make', 'tell'].includes(word)
  );
  
  if (contentWords.length > 0) {
    const mainWord = contentWords[0].charAt(0).toUpperCase() + contentWords[0].slice(1);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    // Different naming patterns for story creation
    const patterns = [
      `${adjective} ${mainWord}`,
      `${mainWord} ${suffix}`,
      `Story ${mainWord}`,
      `${mainWord} Chronicles`,
      `The ${mainWord}`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  // Fallback to story-specific name
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

function StoriesPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"story" | "multi-story">("story");
  const [isCreating, setIsCreating] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedStoryType, setSelectedStoryType] = useState("visual-story");
  const agentRun = useAgentRun();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [useContextMode, setUseContextMode] = useState(false);
  const [useMemoryMode, setUseMemoryMode] = useState(false);
  
  // Sessions data
  const [sessions, setSessions] = useState<StorySession[]>([
    {
      id: "1",
      name: generateStorySessionName("A journey through ancient mountains at sunrise", "visual-story"),
      prompt: "A journey through ancient mountains at sunrise",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      result: {
        type: "video",
        content: "Created a stunning visual story",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        metadata: { 
          storyType: "visual-story",
          duration: "5s", 
          resolution: "1080p",
          credits: 20
        }
      },
      storyType: "visual-story"
    },
    {
      id: "2",
      name: generateStorySessionName("The legend of the digital nomad who changed the world", "narrative-story"),
      prompt: "The legend of the digital nomad who changed the world", 
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 18),
      result: {
        type: "video",
        content: "Created an epic narrative story",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        metadata: {
          storyType: "narrative-story", 
          duration: "12s",
          resolution: "1080p",
          credits: 28
        }
      },
      storyType: "narrative-story"
    },
    {
      id: "3", 
      name: generateStorySessionName("Behind the scenes of a startup's first million", "documentary-story"),
      prompt: "Behind the scenes of a startup's first million",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 32),
      result: {
        type: "video",
        content: "Created documentary-style story",
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        metadata: {
          storyType: "documentary-story",
          duration: "8s", 
          resolution: "1080p",
          credits: 25
        }
      },
      storyType: "documentary-story"
    },
    {
      id: "4",
      name: generateStorySessionName("A day in the life of an AI researcher discovering consciousness", "character-story"),
      prompt: "A day in the life of an AI researcher discovering consciousness",
      status: "completed", 
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
      result: {
        type: "video",
        content: "Created character-driven story",
        thumbnail: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        metadata: {
          storyType: "character-story",
          duration: "10s",
          resolution: "1080p", 
          credits: 22
        }
      },
      storyType: "character-story"
    },
    {
      id: "5",
      name: generateStorySessionName("The magical bookstore that exists between dimensions", "fantasy-story"),
      prompt: "The magical bookstore that exists between dimensions",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      result: {
        type: "video", 
        content: "Created fantasy adventure story",
        thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        metadata: {
          storyType: "visual-story",
          duration: "7s",
          resolution: "1080p",
          credits: 18
        }
      },
      storyType: "visual-story"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      // Auto-start creating if there's an initial prompt
      handleCreate(initialPrompt, JSON.parse(initialFiles || '[]'));
      
      // Clean up URL
      router.replace('/stories');
    }
  }, [searchParams, router]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionResults = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen
  const hasResultsInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleCreate = async (promptText?: string, files?: any[]) => {
    const finalPrompt = promptText || prompt.trim();
    if (!finalPrompt) return;
    
    const newSession: StorySession = {
      id: Date.now().toString(),
      name: generateStorySessionName(finalPrompt, selectedStoryType),
      prompt: finalPrompt,
      status: "creating",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "Story AI is crafting your narrative...",
      storyType: selectedStoryType
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsCreating(true);
    setPrompt("");

    try {
      const result = await agentRun.run(
        { prompt: finalPrompt },
        { templateId: selectedStoryType === "kids" ? "kids-story-animation" : "trailer-from-script", prompt: finalPrompt },
      );
      const url = result?.outputUrl ?? null;
      setSessions(prev => prev.map(s => s.id === newSession.id ? {
        ...s,
        status: result?.status === "completed" ? "completed" : "failed",
        result: url ? {
          type: "video",
          content: "Created an engaging story",
          thumbnail: url,
          videoUrl: url,
          metadata: {
            storyType: selectedStoryType,
            duration: "30s",
            resolution: "1080p",
            credits: result?.finalCoins ?? result?.estCoins ?? 0,
          },
        } : undefined,
      } : s));
    } catch (err) {
      setSessions(prev => prev.map(s => s.id === newSession.id ? { ...s, status: "failed" as const } : s));
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendMessage = (message: string, files: any[], pastedContent: any[]) => {
    setPrompt(message);
    handleCreate(message, files);
  };

  const handleNewSession = () => {
    setActiveSessionId("new-session");
    setSessions(prev => []);
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: StorySession) => {
    setPrompt(session.prompt);
    if (session.storyType) {
      setSelectedStoryType(session.storyType);
    }
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
                <p>New Story Session</p>
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
                      {session.result?.thumbnail ? (
                        <img
                          src={session.result.thumbnail}
                          alt={session.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status indicator */}
                      <div className="absolute top-1 right-1">
                        {session.status === "creating" && (
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
        {isCreating ? (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Creating Story...</h2>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          </div>
        ) : hasResultsInSession ? (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto pb-64">
              <div className="max-w-4xl mx-auto px-4 py-8">
                {currentSessionResults.map((result) => (
                  <div key={result.id} className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <BookOpen className="h-4 w-4" />
                      <span>{result.prompt}</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                        {storyTypes.find(t => t.value === result.storyType)?.label || 'Story'}
                      </span>
                    </div>
                    
                    {result.result?.videoUrl && (
                      <VideoPlayer src={result.result.videoUrl} />
                    )}
                    
                    <div className="flex items-center gap-3 mt-4">
                      <button 
                        onClick={() => handleReuseParameters(result)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reuse parameters</span>
                      </button>
                      
                      <button 
                        onClick={() => handleCopyPrompt(result.prompt)}
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
                  placeholder={`Describe the story you want to create...`}
                  models={storyTypes.map(story => ({
                    id: story.value,
                    name: story.label,
                    description: story.description,
                    badge: story.badge
                  }))}
                  defaultModel={selectedStoryType}
                  onModelChange={setSelectedStoryType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button 
                  onClick={() => setUseContextMode(!useContextMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useContextMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Context mode</span>
                </button>
                
                <button 
                  onClick={() => setUseMemoryMode(!useMemoryMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useMemoryMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Memory mode</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Original centered layout when no results */
          <div className="max-w-4xl mx-auto px-4 py-16">
            {/* Tab Navigation */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setActiveTab("story")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "story" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "story" ? "bg-purple-500" : "bg-gray-100"
                )}>
                  <BookOpen className={cn(
                    "h-6 w-6",
                    activeTab === "story" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Story</span>
              </button>
              
              <button
                onClick={() => setActiveTab("multi-story")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "multi-story" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "multi-story" ? "bg-purple-500" : "bg-gray-100"
                )}>
                  <FileText className={cn(
                    "h-6 w-6",
                    activeTab === "multi-story" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Multi-Story</span>
              </button>
            </div>

            <div className="text-center">
              {/* Claude-style AI Input */}
              <div className="max-w-2xl mx-auto">
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder={`Describe the story you want to create...`}
                  models={storyTypes.map(story => ({
                    id: story.value,
                    name: story.label,
                    description: story.description,
                    badge: story.badge
                  }))}
                  defaultModel={selectedStoryType}
                  onModelChange={setSelectedStoryType}
                />
              </div>

              {/* Feature Description */}
              <div className="mt-12 text-left">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {activeTab === "story" ? "Create Engaging Stories" : "Multi-Story Narratives"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {activeTab === "story" 
                    ? "Transform your ideas into compelling visual stories. Our AI understands narrative structure, pacing, and emotional beats to create engaging content." 
                    : "Create complex, multi-part narratives with interconnected storylines. Perfect for series, campaigns, or elaborate storytelling projects."
                  }
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {storyTypes.slice(0, 4).map((story) => (
                    <div 
                      key={story.value}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-all",
                        selectedStoryType === story.value 
                          ? "border-purple-500 bg-purple-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedStoryType(story.value)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{story.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">{story.label}</div>
                          <div className="text-xs text-gray-500">{story.time} • {story.credits} credits</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{story.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {story.features.map((feature) => (
                          <span key={feature} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 

import { Suspense as __Sus } from "react";
export default function StoriesPage() {
  return <__Sus fallback={null}><StoriesPageInner /></__Sus>;
}
