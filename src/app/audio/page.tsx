"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
  Music, 
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
  Volume2,
  Settings,
  History,
  Play,
  Pause,
  Headphones
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface AudioSession {
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
  audioType?: string;
}

// Available audio types (models)
const audioTypes = [
  { 
    value: "music-generation", 
    label: "Music Generation",
    description: "Create original music from text descriptions",
    icon: "🎵",
    time: "3 min.",
    features: ["Multiple Genres", "Custom Length", "High Quality"],
    credits: 15
  },
  { 
    value: "sound-effects", 
    label: "Sound Effects",
    description: "Generate realistic sound effects and ambience",
    icon: "🔊",
    time: "1 min.",
    features: ["Realistic SFX", "Ambient Sounds", "Custom Duration"],
    credits: 8
  },
  { 
    value: "audio-enhancement", 
    label: "Audio Enhancement",
    description: "Improve and enhance existing audio quality",
    icon: "✨",
    time: "2 min.",
    features: ["Noise Reduction", "Quality Boost", "Audio Repair"],
    credits: 10,
    badge: "Popular"
  },
  { 
    value: "voice-synthesis", 
    label: "Voice Synthesis",
    description: "Advanced voice generation and manipulation",
    icon: "🎤",
    time: "2 min.",
    features: ["Custom Voices", "Emotion Control", "Multiple Languages"],
    credits: 12
  },
  { 
    value: "audio-mixing", 
    label: "Audio Mixing",
    description: "Professional audio mixing and mastering",
    icon: "🎛️",
    time: "4 min.",
    features: ["Multi-track", "Professional Mix", "Mastering"],
    credits: 20,
    badge: "Premium"
  }
];

// Generate AI-style names for audio sessions
const generateAudioSessionName = (prompt: string, audioType: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Audio', 'Sound', 'Music', 'Sonic', 'Acoustic', 'Digital', 'Studio', 'Pro'];
  const suffixes = ['Track', 'Mix', 'Audio', 'Sound', 'Music', 'Recording', 'Composition', 'Piece'];
  
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
      `${mainWord} Mix`,
      `Studio ${mainWord}`,
      `${mainWord} Audio`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

function AudioPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"music" | "effects">("music");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedAudioType, setSelectedAudioType] = useState("music-generation");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [useHighQuality, setUseHighQuality] = useState(true);
  const [useStereo, setUseStereo] = useState(true);
  
  // Sessions data
  const [sessions, setSessions] = useState<AudioSession[]>([
    {
      id: "1",
      name: generateAudioSessionName("Ambient nature sounds for meditation", "environment-audio"),
      prompt: "Ambient nature sounds for meditation",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 3),
      result: {
        type: "audio",
        content: "Peaceful forest ambience generated",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        thumbnail: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=200",
        metadata: { 
          audioType: "environment-audio",
          duration: "2:15",
          credits: 8
        }
      },
      audioType: "environment-audio"
    },
    {
      id: "2",
      name: generateAudioSessionName("Upbeat electronic music for workout video", "music-generation"),
      prompt: "Upbeat electronic music for workout video",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
      result: {
        type: "audio",
        content: "High-energy electronic track generated",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200",
        metadata: {
          audioType: "music-generation",
          duration: "3:45", 
          credits: 15
        }
      },
      audioType: "music-generation"
    },
    {
      id: "3",
      name: generateAudioSessionName("Retro 80s synthwave soundtrack", "music-generation"),
      prompt: "Retro 80s synthwave soundtrack",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 18),
      result: {
        type: "audio",
        content: "Nostalgic synthwave track generated",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200", 
        metadata: {
          audioType: "music-generation",
          duration: "4:20",
          credits: 15
        }
      },
      audioType: "music-generation"
    },
    {
      id: "4",
      name: generateAudioSessionName("Coffee shop ambience with gentle chatter", "environment-audio"),
      prompt: "Coffee shop ambience with gentle chatter",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 25),
      result: {
        type: "audio",
        content: "Cozy cafe atmosphere generated",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        thumbnail: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&h=200",
        metadata: {
          audioType: "environment-audio",
          duration: "5:30",
          credits: 8
        }
      },
      audioType: "environment-audio"
    },
    {
      id: "5", 
      name: generateAudioSessionName("Dramatic orchestral score for film trailer", "music-generation"),
      prompt: "Dramatic orchestral score for film trailer",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 33),
      result: {
        type: "audio",
        content: "Epic cinematic score generated",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200",
        metadata: {
          audioType: "music-generation",
          duration: "2:45",
          credits: 15
        }
      },
      audioType: "music-generation"
    },
    {
      id: "6",
      name: generateAudioSessionName("Futuristic sci-fi sound effects collection", "sfx-generation"),
      prompt: "Futuristic sci-fi sound effects collection",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 40),
      result: {
        type: "audio",
        content: "Space-age sound effects generated",
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        thumbnail: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=200&h=200",
        metadata: {
          audioType: "sfx-generation",
          duration: "1:30",
          credits: 10
        }
      },
      audioType: "sfx-generation"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleGenerateAudio(initialPrompt, JSON.parse(initialFiles || '[]'));
      router.replace('/audio');
    }
  }, [searchParams, router]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionResults = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen
  const hasResultsInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleGenerateAudio = async (promptText?: string, files?: any[]) => {
    const finalPrompt = promptText || prompt.trim();
    if (!finalPrompt) return;
    
    const newSession: AudioSession = {
      id: Date.now().toString(),
      name: generateAudioSessionName(finalPrompt, selectedAudioType),
      prompt: finalPrompt,
      status: "generating",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "Analyzing audio requirements...",
      audioType: selectedAudioType
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsGenerating(true);

    // Simulate audio generation progress
    const progressInterval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id && session.status === "generating") {
          const newProgress = Math.min((session.progress || 0) + Math.random() * 12, 95);
          const messages = [
            "Processing audio prompt...",
            "Generating audio patterns...", 
            "Applying audio effects...",
            "Mixing and mastering...",
            "Finalizing audio track..."
          ];
          const messageIndex = Math.floor(newProgress / 20);
          
          return {
            ...session,
            progress: newProgress,
            progressMessage: messages[messageIndex] || "Almost ready..."
          };
        }
        return session;
      }));
    }, 600);

    // Complete after 3-5 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      const selectedTypeData = audioTypes.find(t => t.value === selectedAudioType);
      
      setSessions(prev => prev.map(session => {
        if (session.id === newSession.id) {
          return {
            ...session,
            status: "completed" as const,
            progress: 100,
            progressMessage: "Audio generated successfully!",
            result: {
              type: "audio" as const,
              content: `${selectedTypeData?.label} completed`,
              thumbnail: `https://picsum.photos/seed/${session.id}/200/200`,
              audioUrl: `https://www.soundjay.com/misc/sounds/bell-ringing-05.wav`,
              metadata: {
                audioType: selectedAudioType,
                duration: `${Math.floor(Math.random() * 3 + 1)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
                credits: selectedTypeData?.credits || 15
              }
            }
          };
        }
        return session;
      }));
      
      setIsGenerating(false);
      setPrompt("");
    }, Math.random() * 2000 + 3000);
  };

  const handleSendMessage = (message: string, files: any[], pastedContent: any[]) => {
    handleGenerateAudio(message, files);
  };

  const handleNewSession = () => {
    setActiveSessionId("new-session");
    setPrompt("");
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: AudioSession) => {
    setPrompt(session.prompt);
    if (session.audioType) setSelectedAudioType(session.audioType);
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
                <p>New Audio</p>
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
                          <Music className="h-4 w-4 text-gray-400" />
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
              <h2 className="text-lg font-medium text-gray-900 mb-2">Generating audio...</h2>
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
                      <Music className="h-4 w-4" />
                      <span>{audio.prompt}</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          {audio.result?.metadata?.duration}
                        </span>
                      </div>
                    </div>
                    
                    {audio.result?.audioUrl && (
                      <div className="relative">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg border">
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-white rounded-full p-4 shadow-lg">
                              <Headphones className="h-8 w-8 text-purple-500" />
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-600 mb-2">Audio Player</p>
                            <div className="flex items-center justify-center gap-4">
                              <div className="w-32 h-1 bg-gray-200 rounded-full">
                                <div className="w-8 h-1 bg-purple-500 rounded-full"></div>
                              </div>
                              <span className="text-xs text-gray-500">{audio.result.metadata?.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          <Volume2 className="h-3 w-3" />
                          Audio
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
                  placeholder="Describe the audio you want to create..."
                  models={audioTypes.map(type => ({
                    id: type.value,
                    name: type.label,
                    description: type.description,
                    badge: type.badge
                  }))}
                  defaultModel={selectedAudioType}
                  onModelChange={setSelectedAudioType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button 
                  onClick={() => setUseHighQuality(!useHighQuality)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useHighQuality ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>High quality</span>
                </button>
                
                <button 
                  onClick={() => setUseStereo(!useStereo)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useStereo ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Stereo output</span>
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
                onClick={() => setActiveTab("music")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "music" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "music" ? "bg-orange-500" : "bg-gray-100"
                )}>
                  <Music className={cn(
                    "h-6 w-6",
                    activeTab === "music" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Music</span>
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
                  <Volume2 className={cn(
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
                  placeholder={`Describe the ${activeTab} you want to create...`}
                  models={audioTypes.map(type => ({
                    id: type.value,
                    name: type.label,
                    description: type.description,
                    badge: type.badge
                  }))}
                  defaultModel={selectedAudioType}
                  onModelChange={setSelectedAudioType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <button 
                  onClick={() => setUseHighQuality(!useHighQuality)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useHighQuality ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>High quality</span>
                </button>
                
                <button 
                  onClick={() => setUseStereo(!useStereo)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useStereo ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Stereo output</span>
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
export default function AudioPage() {
  return <__Sus fallback={null}><AudioPageInner /></__Sus>;
}
