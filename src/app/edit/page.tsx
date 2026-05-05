"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
  Edit, 
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
  Scissors,
  Palette,
  Settings,
  History,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface EditSession {
  id: string;
  name: string;
  prompt: string;
  status: "editing" | "completed" | "failed";
  createdAt: Date;
  result?: {
    type: "edit" | "video";
    content: string;
    thumbnail?: string;
    beforeUrl?: string;
    afterUrl?: string;
    videoUrl?: string;
    metadata?: any;
  };
  progress?: number;
  progressMessage?: string;
  editType?: string;
}

// Available edit types (models)
const editTypes = [
  { 
    value: "object-removal", 
    label: "Object Removal",
    description: "Remove unwanted objects from images and videos",
    icon: "🚫",
    time: "2 min.",
    features: ["Smart Selection", "Background Fill", "Video Support"],
    credits: 10
  },
  { 
    value: "object-addition", 
    label: "Object Addition",
    description: "Add new objects seamlessly into scenes",
    icon: "➕",
    time: "3 min.",
    features: ["Natural Placement", "Lighting Match", "Shadow Generation"],
    credits: 15
  },
  { 
    value: "style-change", 
    label: "Style Change",
    description: "Transform the artistic style of content",
    icon: "🎨",
    time: "2 min.",
    features: ["Multiple Styles", "Preserve Details", "Custom Styles"],
    credits: 12
  },
  { 
    value: "background-replace", 
    label: "Background Replace",
    description: "Replace backgrounds with perfect edge detection",
    icon: "🖼️",
    time: "1 min.",
    features: ["Auto Masking", "Edge Refinement", "Depth Aware"],
    credits: 8
  },
  { 
    value: "photo-expansion", 
    label: "Photo Expansion",
    description: "Expand images beyond their original boundaries",
    icon: "📐",
    time: "2 min.",
    features: ["Outpainting", "Style Consistency", "Multiple Ratios"],
    credits: 10,
    badge: "Popular"
  }
];

// Generate AI-style names for edit sessions
const generateEditSessionName = (prompt: string, editType: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Smart', 'Pro', 'Advanced', 'Creative', 'Perfect', 'Enhanced', 'Refined', 'Polished'];
  const suffixes = ['Edit', 'Fix', 'Enhancement', 'Retouch', 'Makeover', 'Transform', 'Revision', 'Update'];
  
  const contentWords = words.filter(word => 
    !['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'remove', 'add', 'change'].includes(word)
  );
  
  if (contentWords.length > 0) {
    const mainWord = contentWords[0].charAt(0).toUpperCase() + contentWords[0].slice(1);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const patterns = [
      `${adjective} ${mainWord}`,
      `${mainWord} ${suffix}`,
      `${mainWord} Edit`,
      `Pro ${mainWord}`,
      `${mainWord} Pro`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

function EditPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "effects">("edit");
  const [isEditing, setIsEditing] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedEditType, setSelectedEditType] = useState("object-removal");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [useHighPrecision, setUseHighPrecision] = useState(true);
  const [usePreserveQuality, setUsePreserveQuality] = useState(true);
  
  // Sessions data
  const [sessions, setSessions] = useState<EditSession[]>([
    {
      id: "1",
      name: generateEditSessionName("Remove background from product video", "object-removal"),
      prompt: "Remove background from product video",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 4),
      result: {
        type: "video",
        content: "Clean product video with transparent background",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200",
        metadata: { 
          editType: "object-removal",
          duration: "8s",
          credits: 15
        }
      },
      editType: "object-removal"
    },
    {
      id: "2",
      name: generateEditSessionName("Color grading for cinematic mood", "color-correction"),
      prompt: "Color grading for cinematic mood",
      status: "completed", 
      createdAt: new Date(Date.now() - 1000 * 60 * 11),
      result: {
        type: "video",
        content: "Professional color graded footage",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200",
        metadata: {
          editType: "color-correction",
          duration: "12s",
          credits: 10
        }
      },
      editType: "color-correction"
    },
    {
      id: "3",
      name: generateEditSessionName("Add smooth transitions between scenes", "transitions"),
      prompt: "Add smooth transitions between scenes",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 18),
      result: {
        type: "video",
        content: "Seamless scene transitions added",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200",
        metadata: {
          editType: "transitions",
          duration: "15s",
          credits: 8
        }
      },
      editType: "transitions"
    },
    {
      id: "4",
      name: generateEditSessionName("Stabilize shaky handheld footage", "stabilization"),
      prompt: "Stabilize shaky handheld footage", 
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 25),
      result: {
        type: "video",
        content: "Smooth, stabilized video footage",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200",
        metadata: {
          editType: "stabilization",
          duration: "10s",
          credits: 12
        }
      },
      editType: "stabilization"
    },
    {
      id: "5",
      name: generateEditSessionName("Extract person from crowded street scene", "object-removal"),
      prompt: "Extract person from crowded street scene",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 32),
      result: {
        type: "video",
        content: "Clean extraction with seamless background fill",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200",
        metadata: {
          editType: "object-removal",
          duration: "7s",
          credits: 15
        }
      },
      editType: "object-removal"
    },
    {
      id: "6",
      name: generateEditSessionName("Speed ramping for action sequence", "speed-effects"),
      prompt: "Speed ramping for action sequence",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 40),
      result: {
        type: "video",
        content: "Dynamic speed effects applied",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200",
        metadata: {
          editType: "speed-effects", 
          duration: "9s",
          credits: 10
        }
      },
      editType: "speed-effects"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleStartEdit(initialPrompt, JSON.parse(initialFiles || '[]'));
      router.replace('/edit');
    }
  }, [searchParams, router]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionResults = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen
  const hasResultsInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleStartEdit = async (promptText?: string, files?: any[]) => {
    const finalPrompt = promptText || prompt.trim();
    if (!finalPrompt) return;
    
    const newSession: EditSession = {
      id: Date.now().toString(),
      name: generateEditSessionName(finalPrompt, selectedEditType),
      prompt: finalPrompt,
      status: "editing",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "Analyzing content for editing...",
      editType: selectedEditType
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsEditing(true);

    // Simulate edit progress
    const progressInterval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id && session.status === "editing") {
          const newProgress = Math.min((session.progress || 0) + Math.random() * 15, 95);
          const messages = [
            "Analyzing content structure...",
            "Processing edit request...", 
            "Applying intelligent edits...",
            "Refining results...",
            "Finalizing output..."
          ];
          const messageIndex = Math.floor(newProgress / 20);
          
          return {
            ...session,
            progress: newProgress,
            progressMessage: messages[messageIndex] || "Almost done..."
          };
        }
        return session;
      }));
    }, 800);

    // Complete after 4-6 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      const selectedTypeData = editTypes.find(t => t.value === selectedEditType);
      
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id) {
          return {
            ...session,
            status: "completed" as const,
            progress: 100,
            progressMessage: "Edit completed successfully!",
            result: {
              type: "edit" as const,
              content: `${selectedTypeData?.label} completed`,
              thumbnail: `https://picsum.photos/seed/${session.id}/200/200`,
              beforeUrl: `https://picsum.photos/seed/${session.id}before/400/300`,
              afterUrl: `https://picsum.photos/seed/${session.id}after/400/300`,
              metadata: {
                editType: selectedEditType,
                credits: selectedTypeData?.credits || 10
              }
            }
          };
        }
        return session;
      }));
      
      setIsEditing(false);
      setPrompt("");
    }, Math.random() * 2000 + 4000);
  };

  const handleSendMessage = (message: string, files: any[], pastedContent: any[]) => {
    handleStartEdit(message, files);
  };

  const handleNewSession = () => {
    setActiveSessionId("new-session");
    setPrompt("");
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: EditSession) => {
    setPrompt(session.prompt);
    if (session.editType) setSelectedEditType(session.editType);
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
                <p>New Edit</p>
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
                          <Edit className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status indicator */}
                      <div className="absolute top-1 right-1">
                        {session.status === "editing" && (
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
        {isEditing ? (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Processing edit...</h2>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          </div>
        ) : hasResultsInSession ? (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto pb-64">
              <div className="max-w-4xl mx-auto px-4 py-8">
                {currentSessionResults.map((edit) => (
                  <div key={edit.id} className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Edit className="h-4 w-4" />
                      <span>{edit.prompt}</span>
                    </div>
                    
                    {edit.result?.beforeUrl && edit.result?.afterUrl && (
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Before</p>
                          <img 
                            src={edit.result.beforeUrl} 
                            alt="Before edit"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">After</p>
                          <img 
                            src={edit.result.afterUrl} 
                            alt="After edit"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mt-4">
                      <button 
                        onClick={() => handleReuseParameters(edit)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reuse parameters</span>
                      </button>
                      
                      <button 
                        onClick={() => handleCopyPrompt(edit.prompt)}
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
                  placeholder="Describe what you want to edit in your image or video..."
                  models={editTypes.map(type => ({
                    id: type.value,
                    name: type.label,
                    description: type.description,
                    badge: type.badge
                  }))}
                  defaultModel={selectedEditType}
                  onModelChange={setSelectedEditType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button 
                  onClick={() => setUseHighPrecision(!useHighPrecision)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useHighPrecision ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>High precision</span>
                </button>
                
                <button 
                  onClick={() => setUsePreserveQuality(!usePreserveQuality)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    usePreserveQuality ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Preserve quality</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Original centered layout when no edits */
          <div className="max-w-4xl mx-auto px-4 py-16">
            {/* Tab Navigation */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setActiveTab("edit")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "edit" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "edit" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Edit className={cn(
                    "h-6 w-6",
                    activeTab === "edit" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Edit</span>
              </button>
              
              <button
                onClick={() => setActiveTab("effects")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "effects" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "effects" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Sparkles className={cn(
                    "h-6 w-6",
                    activeTab === "effects" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Effects</span>
              </button>
            </div>

            <div className="text-center">
              {/* Claude-style AI Input */}
              <div className="max-w-2xl mx-auto">
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder={`Describe what you want to edit in your ${activeTab}...`}
                  models={editTypes.map(type => ({
                    id: type.value,
                    name: type.label,
                    description: type.description,
                    badge: type.badge
                  }))}
                  defaultModel={selectedEditType}
                  onModelChange={setSelectedEditType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <button 
                  onClick={() => setUseHighPrecision(!useHighPrecision)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useHighPrecision ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>High precision</span>
                </button>
                
                <button 
                  onClick={() => setUsePreserveQuality(!usePreserveQuality)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    usePreserveQuality ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Preserve quality</span>
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
export default function EditPage() {
  return <__Sus fallback={null}><EditPageInner /></__Sus>;
}
