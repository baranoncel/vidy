"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
  Zap, 
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
  Brush,
  Palette,
  Settings,
  History,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface RealtimeSession {
  id: string;
  name: string;
  prompt: string;
  status: "rendering" | "completed" | "failed";
  createdAt: Date;
  result?: {
    type: "canvas";
    content: string;
    thumbnail?: string;
    canvasUrl?: string;
    metadata?: any;
  };
  progress?: number;
  progressMessage?: string;
  canvasType?: string;
}

// Available realtime canvas types (models)
const canvasTypes = [
  { 
    value: "sketch-to-art", 
    label: "Sketch to Art",
    description: "Transform sketches into art in real-time",
    icon: "✏️",
    time: "Instant",
    features: ["Real-time", "Sketch Input", "Art Styles"],
    credits: 1
  },
  { 
    value: "style-transfer", 
    label: "Style Transfer",
    description: "Apply artistic styles instantly",
    icon: "🎨",
    time: "Instant",
    features: ["Live Preview", "Multiple Styles", "Adjustable"],
    credits: 1
  },
  { 
    value: "ai-painter", 
    label: "AI Painter",
    description: "Collaborative AI painting canvas",
    icon: "🖌️",
    time: "Instant",
    features: ["AI Assistance", "Brush Tools", "Layer Support"],
    credits: 2
  },
  { 
    value: "magic-canvas", 
    label: "Magic Canvas",
    description: "AI-powered creative canvas with instant feedback",
    icon: "✨",
    time: "Instant",
    features: ["Smart Suggestions", "Auto-complete", "Style Mixing"],
    credits: 3,
    badge: "Premium"
  }
];

// Generate AI-style names for realtime sessions
const generateRealtimeSessionName = (prompt: string, canvasType: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Live', 'Interactive', 'Dynamic', 'Instant', 'Real-time', 'Magic', 'Creative', 'Smart'];
  const suffixes = ['Canvas', 'Art', 'Creation', 'Studio', 'Sketch', 'Painting', 'Design', 'Work'];
  
  const contentWords = words.filter(word => 
    !['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'create', 'make', 'draw'].includes(word)
  );
  
  if (contentWords.length > 0) {
    const mainWord = contentWords[0].charAt(0).toUpperCase() + contentWords[0].slice(1);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const patterns = [
      `${adjective} ${mainWord}`,
      `${mainWord} ${suffix}`,
      `${mainWord} Studio`,
      `Live ${mainWord}`,
      `${mainWord} Canvas`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

function RealtimePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"canvas" | "collaboration">("canvas");
  const [isCanvasActive, setIsCanvasActive] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedCanvasType, setSelectedCanvasType] = useState("video-canvas");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [useRealTimeMode, setUseRealTimeMode] = useState(true);
  const [useCollabMode, setUseCollabMode] = useState(false);
  
  // Sessions data
  const [sessions, setSessions] = useState<RealtimeSession[]>([
    {
      id: "1",
      name: generateRealtimeSessionName("Abstract landscape painting", "sketch-to-art"),
      prompt: "Abstract landscape painting",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 1),
      result: {
        type: "canvas",
        content: "Real-time art creation canvas",
        thumbnail: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=200&h=200",
        canvasUrl: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=600",
        metadata: { 
          canvasType: "sketch-to-art",
          credits: 1
        }
      },
      canvasType: "sketch-to-art"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleStartCanvas(initialPrompt, JSON.parse(initialFiles || '[]'));
      router.replace('/realtime');
    }
  }, [searchParams, router]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionResults = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen
  const hasResultsInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleStartCanvas = async (promptText?: string, files?: any[]) => {
    const finalPrompt = promptText || prompt.trim();
    if (!finalPrompt) return;
    
    const newSession: RealtimeSession = {
      id: Date.now().toString(),
      name: generateRealtimeSessionName(finalPrompt, selectedCanvasType),
      prompt: finalPrompt,
      status: "rendering",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "Initializing real-time canvas...",
      canvasType: selectedCanvasType
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsCanvasActive(true);

    // Simulate instant rendering (realtime should be very fast)
    const progressInterval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id && session.status === "rendering") {
          const newProgress = Math.min((session.progress || 0) + Math.random() * 25, 95);
          const messages = [
            "Setting up canvas...",
            "Loading AI models...", 
            "Configuring real-time feedback...",
            "Canvas ready!"
          ];
          const messageIndex = Math.floor(newProgress / 25);
          
          return {
            ...session,
            progress: newProgress,
            progressMessage: messages[messageIndex] || "Almost ready..."
          };
        }
        return session;
      }));
    }, 300);

    // Complete very quickly for realtime
    setTimeout(() => {
      clearInterval(progressInterval);
      const selectedTypeData = canvasTypes.find(t => t.value === selectedCanvasType);
      
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id) {
          return {
            ...session,
            status: "completed" as const,
            progress: 100,
            progressMessage: "Canvas is live and ready!",
            result: {
              type: "canvas" as const,
              content: `Real-time canvas with ${selectedTypeData?.label}`,
              thumbnail: `https://picsum.photos/seed/${session.id}/200/200`,
              canvasUrl: `https://picsum.photos/seed/${session.id}/800/600`,
              metadata: {
                canvasType: selectedCanvasType,
                credits: selectedTypeData?.credits || 1
              }
            }
          };
        }
        return session;
      }));
      
      setIsCanvasActive(false);
      setPrompt("");
    }, 2000);
  };

  const handleSendMessage = (message: string, files: any[], pastedContent: any[]) => {
    handleStartCanvas(message, files);
  };

  const handleNewSession = () => {
    setActiveSessionId("new-session");
    setPrompt("");
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: RealtimeSession) => {
    setPrompt(session.prompt);
    if (session.canvasType) setSelectedCanvasType(session.canvasType);
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
                <p>New Canvas</p>
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
                          <Zap className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status indicator */}
                      <div className="absolute top-1 right-1">
                        {session.status === "rendering" && (
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
        {isCanvasActive ? (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Setting up canvas...</h2>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          </div>
        ) : hasResultsInSession ? (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto pb-64">
              <div className="max-w-4xl mx-auto px-4 py-8">
                {currentSessionResults.map((canvas) => (
                  <div key={canvas.id} className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Zap className="h-4 w-4" />
                      <span>{canvas.prompt}</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs">LIVE</span>
                      </div>
                    </div>
                    
                    {canvas.result?.canvasUrl && (
                      <div className="relative">
                        <img 
                          src={canvas.result.canvasUrl} 
                          alt={canvas.prompt}
                          className="w-full h-96 object-cover rounded-lg"
                        />
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          <Play className="h-3 w-3" />
                          Live Canvas
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mt-4">
                      <button 
                        onClick={() => handleReuseParameters(canvas)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reuse parameters</span>
                      </button>
                      
                      <button 
                        onClick={() => handleCopyPrompt(canvas.prompt)}
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
                  placeholder="Describe what you want to create on your real-time canvas..."
                  models={canvasTypes.map(type => ({
                    id: type.value,
                    name: type.label,
                    description: type.description,
                    badge: type.badge
                  }))}
                  defaultModel={selectedCanvasType}
                  onModelChange={setSelectedCanvasType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button 
                  onClick={() => setUseRealTimeMode(!useRealTimeMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useRealTimeMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Real-time mode</span>
                </button>
                
                <button 
                  onClick={() => setUseCollabMode(!useCollabMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useCollabMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Collaboration mode</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Original centered layout when no canvases */
          <div className="max-w-4xl mx-auto px-4 py-16">
            {/* Tab Navigation */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setActiveTab("canvas")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "canvas" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "canvas" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Zap className={cn(
                    "h-6 w-6",
                    activeTab === "canvas" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Canvas</span>
              </button>
              
              <button
                onClick={() => setActiveTab("collaboration")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "collaboration" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "collaboration" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Brush className={cn(
                    "h-6 w-6",
                    activeTab === "collaboration" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Collaboration</span>
              </button>
            </div>

            <div className="text-center">
              {/* Claude-style AI Input */}
              <div className="max-w-2xl mx-auto">
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder={`Describe what you want to create on your real-time ${activeTab}...`}
                  models={canvasTypes.map(type => ({
                    id: type.value,
                    name: type.label,
                    description: type.description,
                    badge: type.badge
                  }))}
                  defaultModel={selectedCanvasType}
                  onModelChange={setSelectedCanvasType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <button 
                  onClick={() => setUseRealTimeMode(!useRealTimeMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useRealTimeMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Real-time mode</span>
                </button>
                
                <button 
                  onClick={() => setUseCollabMode(!useCollabMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useCollabMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Collaboration mode</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 

import { Suspense as __Sus } from "react";
export default function RealtimePage() {
  return <__Sus fallback={null}><RealtimePageInner /></__Sus>;
}
