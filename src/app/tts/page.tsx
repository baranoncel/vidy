"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
  Volume2, 
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
  Mic,
  Settings,
  History,
  Play,
  Pause
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

interface TTSSession {
  id: string;
  name: string;
  prompt: string;
  status: "generating" | "completed" | "failed";
  createdAt: Date;
  result?: {
    type: "audio";
    content: string;
    thumbnail?: string;
    audioUrl?: string;
    metadata?: any;
  };
  progress?: number;
  progressMessage?: string;
  voiceModel?: string;
}

// Available voice models (models)
const voiceModels = [
  { 
    value: "neural-voice", 
    label: "Neural Voice",
    description: "High-quality neural text-to-speech",
    icon: "🎤",
    time: "30 sec.",
    features: ["Natural Tone", "Multiple Languages", "Emotions"],
    credits: 5
  },
  { 
    value: "voice-cloning", 
    label: "Voice Cloning",
    description: "Clone any voice from a sample",
    icon: "👥",
    time: "2 min.",
    features: ["Voice Matching", "Custom Training", "High Fidelity"],
    credits: 20,
    badge: "Popular"
  },
  { 
    value: "celebrity-voices", 
    label: "Celebrity Voices",
    description: "Famous voice styles and impressions",
    icon: "🌟",
    time: "45 sec.",
    features: ["Celebrity Styles", "Accent Matching", "Professional Quality"],
    credits: 15,
    badge: "Premium"
  },
  { 
    value: "character-voices", 
    label: "Character Voices",
    description: "Animated and character voice styles",
    icon: "🎭",
    time: "1 min.",
    features: ["Character Styles", "Animation Ready", "Expressive"],
    credits: 10
  },
  { 
    value: "multilingual-tts", 
    label: "Multilingual TTS",
    description: "Text-to-speech in 50+ languages",
    icon: "🌍",
    time: "45 sec.",
    features: ["50+ Languages", "Native Accents", "Cultural Nuances"],
    credits: 8
  }
];

// Generate AI-style names for TTS sessions
const generateTTSSessionName = (prompt: string, voiceModel: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Voice', 'Audio', 'Speech', 'Vocal', 'Sound', 'Spoken', 'Narrated', 'Voiced'];
  const suffixes = ['Recording', 'Audio', 'Speech', 'Voice', 'Track', 'Narration', 'Reading', 'Clip'];
  
  const contentWords = words.filter(word => 
    !['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'say', 'speak', 'read'].includes(word)
  );
  
  if (contentWords.length > 0) {
    const mainWord = contentWords[0].charAt(0).toUpperCase() + contentWords[0].slice(1);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const patterns = [
      `${adjective} ${mainWord}`,
      `${mainWord} ${suffix}`,
      `${mainWord} Voice`,
      `AI ${mainWord}`,
      `${mainWord} Audio`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

function TTSPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"voice" | "clone">("voice");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedVoiceModel, setSelectedVoiceModel] = useState("neural-voice");
  const featureRun = useFeatureRun("tts");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [useEmotions, setUseEmotions] = useState(true);
  const [useMultilingual, setUseMultilingual] = useState(false);
  
  // Sessions data
  const [sessions, setSessions] = useState<TTSSession[]>([
    {
      id: "1",
      name: generateTTSSessionName("Welcome to our platform", "neural-voice"),
      prompt: "Welcome to our platform",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 1),
      result: {
        type: "audio",
        content: "Neural voice audio generated",
        thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        metadata: { 
          voiceModel: "neural-voice",
          duration: "3.2s",
          credits: 5
        }
      },
      voiceModel: "neural-voice"
    },
    {
      id: "2",
      name: generateTTSSessionName("The future of artificial intelligence is here, transforming how we work and live", "premium-voice"),
      prompt: "The future of artificial intelligence is here, transforming how we work and live",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 8),
      result: {
        type: "audio",
        content: "Premium voice narration generated",
        thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        metadata: {
          voiceModel: "premium-voice",
          duration: "8.5s",
          credits: 8
        }
      },
      voiceModel: "premium-voice"
    },
    {
      id: "3",
      name: generateTTSSessionName("Quick product demo for mobile app launch", "fast-voice"),
      prompt: "Quick product demo for mobile app launch",
      status: "completed", 
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      result: {
        type: "audio",
        content: "Fast voice demo generated",
        thumbnail: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=200&h=200",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        metadata: {
          voiceModel: "fast-voice",
          duration: "4.1s",
          credits: 3
        }
      },
      voiceModel: "fast-voice"
    },
    {
      id: "4",
      name: generateTTSSessionName("Meditation guide: Take a deep breath and relax your mind", "neural-voice"),
      prompt: "Meditation guide: Take a deep breath and relax your mind",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 22),
      result: {
        type: "audio",
        content: "Calming meditation voice generated",
        thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=200",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        metadata: {
          voiceModel: "neural-voice",
          duration: "6.8s",
          credits: 5
        }
      },
      voiceModel: "neural-voice"
    },
    {
      id: "5",
      name: generateTTSSessionName("Professional podcast intro with dynamic energy", "premium-voice"),
      prompt: "Professional podcast intro with dynamic energy",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      result: {
        type: "audio",
        content: "Energetic podcast intro generated",
        thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&h=200",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        metadata: {
          voiceModel: "premium-voice", 
          duration: "5.3s",
          credits: 8
        }
      },
      voiceModel: "premium-voice"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleGenerateVoice(initialPrompt, JSON.parse(initialFiles || '[]'));
      router.replace('/tts');
    }
  }, [searchParams, router]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionResults = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen  
  const hasResultsInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleGenerateVoice = async (promptText?: string, files?: any[]) => {
    const finalPrompt = promptText || prompt.trim();
    if (!finalPrompt) return;
    
    const newSession: TTSSession = {
      id: Date.now().toString(),
      name: generateTTSSessionName(finalPrompt, selectedVoiceModel),
      prompt: finalPrompt,
      status: "generating",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "Processing text for speech synthesis...",
      voiceModel: selectedVoiceModel
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsGenerating(true);

    const progressInterval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id && session.status === "generating") {
          const newProgress = Math.min((session.progress || 0) + Math.random() * 25, 92);
          const messages = ["Analyzing text…", "Synthesising voice…", "Applying voice model…", "Finalising…"];
          return { ...session, progress: newProgress, progressMessage: messages[Math.floor(newProgress / 25)] || "Almost done…" };
        }
        return session;
      }));
    }, 400);

    try {
      const result = await featureRun.run({ text: finalPrompt });
      clearInterval(progressInterval);
      const url = result?.outputUrl ?? null;
      const selectedTypeData = voiceModels.find(t => t.value === selectedVoiceModel);
      setSessions(prev => prev.map(session => session.id === newSession.id ? {
        ...session,
        status: result?.status === "completed" ? "completed" : "failed",
        progress: 100,
        progressMessage: result?.status === "completed" ? "Voice generated" : (result?.errorMessage || "Failed"),
        result: url ? {
          type: "audio" as const,
          content: `${selectedTypeData?.label || "Vidy"} audio generated`,
          audioUrl: url,
          metadata: { voiceModel: selectedVoiceModel, credits: result?.finalCoins ?? result?.estCoins ?? 0 },
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
    handleGenerateVoice(message, files);
  };

  const handleNewSession = () => {
    setActiveSessionId("new-session");
    setPrompt("");
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: TTSSession) => {
    setPrompt(session.prompt);
    if (session.voiceModel) setSelectedVoiceModel(session.voiceModel);
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
                <p>New Voice</p>
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
                          <Volume2 className="h-4 w-4 text-gray-400" />
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
              <h2 className="text-lg font-medium text-gray-900 mb-2">Generating voice...</h2>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            </div>
          </div>
        ) : hasResultsInSession ? (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto pb-64">
              <div className="max-w-4xl mx-auto px-4 py-8">
                {currentSessionResults.map((audio) => (
                  <div key={audio.id} className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Volume2 className="h-4 w-4" />
                      <span>{audio.prompt}</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                          {audio.result?.metadata?.duration}
                        </span>
                      </div>
                    </div>
                    
                    {audio.result?.audioUrl && (
                      <div className="relative">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg border">
                          <div className="flex items-center justify-center">
                            <div className="bg-white rounded-full p-4 shadow-lg">
                              <Play className="h-8 w-8 text-blue-500" />
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">Audio Player</p>
                            <p className="text-xs text-gray-500 mt-1">{audio.result.metadata?.duration}</p>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          <Mic className="h-3 w-3" />
                          Voice
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 mt-4">
                      <button 
                        onClick={() => handleReuseParameters(audio)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reuse parameters</span>
                      </button>
                      
                      <button 
                        onClick={() => handleCopyPrompt(audio.prompt)}
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
                  placeholder="Enter the text you want to convert to speech..."
                  models={voiceModels.map(model => ({
                    id: model.value,
                    name: model.label,
                    description: model.description,
                    badge: model.badge
                  }))}
                  defaultModel={selectedVoiceModel}
                  onModelChange={setSelectedVoiceModel}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button 
                  onClick={() => setUseEmotions(!useEmotions)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useEmotions ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Add emotions</span>
                </button>
                
                <button 
                  onClick={() => setUseMultilingual(!useMultilingual)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useMultilingual ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Multilingual</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Original centered layout when no audio */
          <div className="max-w-4xl mx-auto px-4 py-16">
            {/* Tab Navigation */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setActiveTab("voice")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "voice" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "voice" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Volume2 className={cn(
                    "h-6 w-6",
                    activeTab === "voice" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Voice</span>
              </button>
              
              <button
                onClick={() => setActiveTab("clone")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "clone" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "clone" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Mic className={cn(
                    "h-6 w-6",
                    activeTab === "clone" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Clone</span>
              </button>
            </div>

            <div className="text-center">
              {/* Claude-style AI Input */}
              <div className="max-w-2xl mx-auto">
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder={`Enter the text you want to convert to ${activeTab === "voice" ? "speech" : "cloned voice"}...`}
                  models={voiceModels.map(model => ({
                    id: model.value,
                    name: model.label,
                    description: model.description,
                    badge: model.badge
                  }))}
                  defaultModel={selectedVoiceModel}
                  onModelChange={setSelectedVoiceModel}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <button 
                  onClick={() => setUseEmotions(!useEmotions)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useEmotions ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Add emotions</span>
                </button>
                
                <button 
                  onClick={() => setUseMultilingual(!useMultilingual)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useMultilingual ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Multilingual</span>
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
export default function TTSPage() {
  return <__Sus fallback={null}><TTSPageInner /></__Sus>;
}
