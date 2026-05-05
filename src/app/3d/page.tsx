"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
  Box, 
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
  Settings,
  History,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface ThreeDSession {
  id: string;
  name: string;
  prompt: string;
  status: "generating" | "completed" | "failed";
  createdAt: Date;
  result?: {
    type: "3d-model";
    content: string;
    thumbnail?: string;
    modelUrl?: string;
    metadata?: any;
  };
  progress?: number;
  progressMessage?: string;
  modelType?: string;
}

// Available 3D model types (models)
const modelTypes = [
  { 
    value: "object-generation", 
    label: "Object Generation",
    description: "Generate 3D objects from text descriptions",
    icon: "🎯",
    time: "8 min.",
    features: ["Text to 3D", "High Detail", "Multiple Formats"],
    credits: 25
  },
  { 
    value: "character-creation", 
    label: "Character Creation",
    description: "Create detailed 3D characters and avatars",
    icon: "👤",
    time: "12 min.",
    features: ["Rigged Models", "Animation Ready", "Custom Textures"],
    credits: 40,
    badge: "Popular"
  },
  { 
    value: "environment-design", 
    label: "Environment Design",
    description: "Build complete 3D environments and scenes",
    icon: "🏞️",
    time: "15 min.",
    features: ["Large Scenes", "Lighting Setup", "Asset Library"],
    credits: 50,
    badge: "Premium"
  },
  { 
    value: "text-to-mesh", 
    label: "Text to Mesh",
    description: "Convert text descriptions to 3D meshes",
    icon: "📝",
    time: "6 min.",
    features: ["Fast Generation", "Clean Topology", "Optimized"],
    credits: 20
  },
  { 
    value: "style-transfer-3d", 
    label: "3D Style Transfer",
    description: "Apply artistic styles to 3D models",
    icon: "🎨",
    time: "10 min.",
    features: ["Style Mixing", "Texture Generation", "Material Creation"],
    credits: 30
  }
];

// Generate AI-style names for 3D sessions
const generateThreeDSessionName = (prompt: string, modelType: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['3D', 'Dimensional', 'Sculpted', 'Modeled', 'Rendered', 'Digital', 'Virtual', 'Poly'];
  const suffixes = ['Model', 'Object', 'Creation', 'Design', 'Asset', 'Sculpture', 'Build', 'Mesh'];
  
  const contentWords = words.filter(word => 
    !['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'create', 'make', 'generate', '3d'].includes(word)
  );
  
  if (contentWords.length > 0) {
    const mainWord = contentWords[0].charAt(0).toUpperCase() + contentWords[0].slice(1);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const patterns = [
      `${adjective} ${mainWord}`,
      `${mainWord} ${suffix}`,
      `${mainWord} 3D`,
      `3D ${mainWord}`,
      `${mainWord} Model`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

function ThreeDPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"object" | "character">("object");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedModelType, setSelectedModelType] = useState("object-generation");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [useHighResolution, setUseHighResolution] = useState(true);
  const [useTextures, setUseTextures] = useState(true);
  
  // Sessions data
  const [sessions, setSessions] = useState<ThreeDSession[]>([
    {
      id: "1",
      name: generateThreeDSessionName("Modern chair design", "object-generation"),
      prompt: "Modern chair design",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 8),
      result: {
        type: "3d-model",
        content: "3D chair model generated",
        thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200",
        modelUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400",
        metadata: { 
          modelType: "object-generation",
          polygons: "15.2K",
          credits: 25
        }
      },
      modelType: "object-generation"
    },
    {
      id: "2",
      name: generateThreeDSessionName("Fantasy warrior character with armor and sword", "character-generation"),
      prompt: "Fantasy warrior character with armor and sword",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      result: {
        type: "3d-model",
        content: "3D fantasy character generated",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200",
        modelUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400",
        metadata: {
          modelType: "character-generation",
          polygons: "42.8K",
          credits: 35
        }
      },
      modelType: "character-generation"
    },
    {
      id: "3",
      name: generateThreeDSessionName("Vintage sports car with detailed interior", "object-generation"),
      prompt: "Vintage sports car with detailed interior",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 22),
      result: {
        type: "3d-model",
        content: "3D vintage car model generated",
        thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200",
        modelUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=400",
        metadata: {
          modelType: "object-generation",
          polygons: "89.5K",
          credits: 25
        }
      },
      modelType: "object-generation"
    },
    {
      id: "4",
      name: generateThreeDSessionName("Futuristic robot companion with LED details", "character-generation"),
      prompt: "Futuristic robot companion with LED details", 
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      result: {
        type: "3d-model",
        content: "3D robot character generated",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200",
        modelUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400",
        metadata: {
          modelType: "character-generation",
          polygons: "67.3K",
          credits: 35
        }
      },
      modelType: "character-generation"
    },
    {
      id: "5",
      name: generateThreeDSessionName("Architectural building with modern glass facade", "object-generation"),
      prompt: "Architectural building with modern glass facade",
      status: "completed", 
      createdAt: new Date(Date.now() - 1000 * 60 * 38),
      result: {
        type: "3d-model",
        content: "3D building model generated",
        thumbnail: "https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?w=200&h=200",
        modelUrl: "https://images.unsplash.com/photo-1511452885600-a3d2c9148a31?w=400&h=400",
        metadata: {
          modelType: "object-generation",
          polygons: "156.7K",
          credits: 25
        }
      },
      modelType: "object-generation"
    },
    {
      id: "6",
      name: generateThreeDSessionName("Mystical dragon with detailed scales and wings", "character-generation"),
      prompt: "Mystical dragon with detailed scales and wings",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
      result: {
        type: "3d-model",
        content: "3D dragon character generated", 
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200",
        modelUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400",
        metadata: {
          modelType: "character-generation",
          polygons: "198.4K",
          credits: 35
        }
      },
      modelType: "character-generation"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleGenerate3D(initialPrompt, JSON.parse(initialFiles || '[]'));
      router.replace('/3d');
    }
  }, [searchParams, router]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionResults = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen
  const hasResultsInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleGenerate3D = async (promptText?: string, files?: any[]) => {
    const finalPrompt = promptText || prompt.trim();
    if (!finalPrompt) return;
    
    const newSession: ThreeDSession = {
      id: Date.now().toString(),
      name: generateThreeDSessionName(finalPrompt, selectedModelType),
      prompt: finalPrompt,
      status: "generating",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "Initializing 3D generation...",
      modelType: selectedModelType
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsGenerating(true);

    // Simulate 3D generation progress (longer than other types)
    const progressInterval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id && session.status === "generating") {
          const newProgress = Math.min((session.progress || 0) + Math.random() * 8, 95);
          const messages = [
            "Analyzing 3D requirements...",
            "Building mesh structure...", 
            "Generating geometry...",
            "Creating textures...",
            "Optimizing topology...",
            "Finalizing 3D model..."
          ];
          const messageIndex = Math.floor(newProgress / 16);
          
          return {
            ...session,
            progress: newProgress,
            progressMessage: messages[messageIndex] || "Almost finished..."
          };
        }
        return session;
      }));
    }, 1200);

    // Complete after 8-12 seconds (3D takes longer)
    setTimeout(() => {
      clearInterval(progressInterval);
      const selectedTypeData = modelTypes.find(t => t.value === selectedModelType);
      
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id) {
          return {
            ...session,
            status: "completed" as const,
            progress: 100,
            progressMessage: "3D model generated successfully!",
            result: {
              type: "3d-model" as const,
              content: `${selectedTypeData?.label} completed`,
              thumbnail: `https://picsum.photos/seed/${session.id}/200/200`,
              modelUrl: `https://picsum.photos/seed/${session.id}/400/400`,
              metadata: {
                modelType: selectedModelType,
                polygons: `${Math.floor(Math.random() * 50 + 10)}.${Math.floor(Math.random() * 9)}K`,
                credits: selectedTypeData?.credits || 25
              }
            }
          };
        }
        return session;
      }));
      
      setIsGenerating(false);
      setPrompt("");
    }, Math.random() * 4000 + 8000);
  };

  const handleSendMessage = (message: string, files: any[], pastedContent: any[]) => {
    handleGenerate3D(message, files);
  };

  const handleNewSession = () => {
    setActiveSessionId("new-session");
    setPrompt("");
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: ThreeDSession) => {
    setPrompt(session.prompt);
    if (session.modelType) setSelectedModelType(session.modelType);
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
                <p>New 3D Model</p>
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
                          <Box className="h-4 w-4 text-gray-400" />
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
              <h2 className="text-lg font-medium text-gray-900 mb-2">Generating 3D model...</h2>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          </div>
        ) : hasResultsInSession ? (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto pb-64">
              <div className="max-w-4xl mx-auto px-4 py-8">
                {currentSessionResults.map((model) => (
                  <div key={model.id} className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Box className="h-4 w-4" />
                      <span>{model.prompt}</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {model.result?.metadata?.polygons} polygons
                        </span>
                      </div>
                    </div>
                    
                    {model.result?.modelUrl && (
                      <div className="relative">
                        <img 
                          src={model.result.modelUrl} 
                          alt={model.prompt}
                          className="w-full h-96 object-cover rounded-lg bg-gradient-to-br from-gray-100 to-gray-200"
                        />
                                                 <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                           <Box className="h-3 w-3" />
                           3D Model
                         </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mt-4">
                      <button 
                        onClick={() => handleReuseParameters(model)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reuse parameters</span>
                      </button>
                      
                      <button 
                        onClick={() => handleCopyPrompt(model.prompt)}
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
                  placeholder="Describe the 3D model you want to create..."
                  models={modelTypes.map(type => ({
                    id: type.value,
                    name: type.label,
                    description: type.description,
                    badge: type.badge
                  }))}
                  defaultModel={selectedModelType}
                  onModelChange={setSelectedModelType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button 
                  onClick={() => setUseHighResolution(!useHighResolution)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useHighResolution ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>High resolution</span>
                </button>
                
                <button 
                  onClick={() => setUseTextures(!useTextures)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useTextures ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Include textures</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Original centered layout when no models */
          <div className="max-w-4xl mx-auto px-4 py-16">
            {/* Tab Navigation */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setActiveTab("object")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "object" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "object" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Box className={cn(
                    "h-6 w-6",
                    activeTab === "object" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Object</span>
              </button>
              
              <button
                onClick={() => setActiveTab("character")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "character" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "character" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Layers className={cn(
                    "h-6 w-6",
                    activeTab === "character" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Character</span>
              </button>
            </div>

            <div className="text-center">
              {/* Claude-style AI Input */}
              <div className="max-w-2xl mx-auto">
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder={`Describe the 3D ${activeTab} you want to create...`}
                  models={modelTypes.map(type => ({
                    id: type.value,
                    name: type.label,
                    description: type.description,
                    badge: type.badge
                  }))}
                  defaultModel={selectedModelType}
                  onModelChange={setSelectedModelType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <button 
                  onClick={() => setUseHighResolution(!useHighResolution)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useHighResolution ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>High resolution</span>
                </button>
                
                <button 
                  onClick={() => setUseTextures(!useTextures)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useTextures ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Include textures</span>
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
export default function ThreeDPage() {
  return <__Sus fallback={null}><ThreeDPageInner /></__Sus>;
}
