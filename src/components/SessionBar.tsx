"use client";

import { useState } from "react";
import { Plus, Video, CheckCircle, XCircle, Loader2, Edit2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

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

interface SessionBarProps {
  featureType?: string;
  activeSessionId?: string;
  onSessionSelect?: (sessionId: string) => void;
  onNewSession?: () => void;
}

// Generate AI-style names based on prompt content and feature type
const generateAISessionName = (prompt: string, featureType: string): string => {
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
      `${featureType} ${mainWord}`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  // Fallback to generic name
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

// Generate feature-specific mock sessions
const generateFeatureSessions = (featureType: string): Session[] => {
  const baseTime = Date.now();
  
  switch (featureType?.toLowerCase()) {
    case "generate":
    case "video":
      return [
        {
          id: "1",
          name: "Ferrari Dreams",
          prompt: "a man sitting on a ferrari red",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 5),
          thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200",
          videoUrl: "https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4",
          model: "wan-2.1",
          resolution: "720p",
          style: "Default"
        },
        {
          id: "2", 
          name: "Neon Metropolis",
          prompt: "futuristic city at night",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 30),
          thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200&h=200",
          videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
          model: "wan-2.1",
          resolution: "1080p",
          style: "Cinematic"
        }
      ];
      
    case "captions":
      return [
        {
          id: "1",
          name: "Review Captions",
          prompt: "Product review video captions",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 10),
          thumbnail: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=200&h=200",
          model: "whisper-v3",
          resolution: "1080p"
        },
        {
          id: "2",
          name: "Podcast Subs",
          prompt: "Podcast episode subtitles",
          status: "generating" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 5),
          thumbnail: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200",
          progress: 65,
          progressMessage: "Transcribing audio...",
          model: "whisper-v3"
        }
      ];
      
    case "ugc video":
    case "ugc":
      return [
        {
          id: "1",
          name: "Skincare Story",
          prompt: "Testimonial video - skincare routine",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 15),
          thumbnail: "https://images.unsplash.com/photo-1594824797147-d7be1ac993bd?w=200&h=200",
          model: "ugc-ai-v2",
          style: "Authentic"
        },
        {
          id: "2",
          name: "Unbox Magic",
          prompt: "Product unboxing reaction",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 45),
          thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200",
          model: "ugc-ai-v2",
          style: "Excited"
        }
      ];
      
    case "effects":
      return [
        {
          id: "1",
          name: "Particle Blast",
          prompt: "Particle explosion effect",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 8),
          thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&h=200",
          model: "vfx-ai-v1",
          style: "Cinematic"
        },
        {
          id: "2",
          name: "Vintage Vibes",
          prompt: "Color grade vintage film look",
          status: "generating" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 3),
          thumbnail: "https://images.unsplash.com/photo-1489824904134-89b55fcc595e?w=200&h=200",
          progress: 30,
          progressMessage: "Applying color grade...",
          model: "color-ai-v1"
        }
      ];
      
    case "clips":
      return [
        {
          id: "1",
          name: "TikTok Ready",
          prompt: "YouTube video to TikTok clips",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 12),
          thumbnail: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=200&h=200",
          model: "autocrop-v2",
          resolution: "9:16"
        },
        {
          id: "2",
          name: "Best Moments",
          prompt: "Podcast highlights extraction",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 35),
          thumbnail: "https://images.unsplash.com/photo-1590736969955-71cc94901144?w=200&h=200",
          model: "highlights-ai-v1",
          resolution: "16:9"
        }
      ];
      
    case "lip sync":
    case "lipsync":
      return [
        {
          id: "1",
          name: "Pitch Perfect",
          prompt: "Avatar speaking product pitch",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 20),
          thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200",
          model: "lipsync-v3",
          style: "Professional"
        },
        {
          id: "2",
          name: "Character Voice",
          prompt: "Character voice for animation",
          status: "generating" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 7),
          thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200",
          progress: 85,
          progressMessage: "Syncing lip movements...",
          model: "lipsync-v3"
        }
      ];
      
    case "dubbing":
      return [
        {
          id: "1",
          name: "Spanish Dub",
          prompt: "English to Spanish dubbing",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 25),
          thumbnail: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=200&h=200",
          model: "voice-clone-v2",
          style: "Spanish (Mexico)"
        },
        {
          id: "2",
          name: "French Voice",
          prompt: "French documentary voiceover",
          status: "generating" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 4),
          thumbnail: "https://images.unsplash.com/photo-1506057213367-028a17ec52e5?w=200&h=200",
          progress: 55,
          progressMessage: "Cloning voice...",
          model: "voice-clone-v2"
        }
      ];
      
    case "ai video tools":
    case "ai tools":
      return [
        {
          id: "1",
          name: "4K Upscale",
          prompt: "Video upscale to 4K quality",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 18),
          thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=200",
          model: "upscale-ai-v1",
          resolution: "4K"
        },
        {
          id: "2",
          name: "Clean Removal",
          prompt: "Object removal from video",
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 40),
          thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200",
          model: "inpaint-v2",
          style: "Seamless"
        }
      ];
      
    default:
      const prompt1 = `${featureType} project 1`;
      const prompt2 = `${featureType} project 2`;
      return [
        {
          id: "1",
          name: generateAISessionName(prompt1, featureType),
          prompt: prompt1,
          status: "completed" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 10),
          thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200"
        },
        {
          id: "2",
          name: generateAISessionName(prompt2, featureType),
          prompt: prompt2,
          status: "generating" as const,
          createdAt: new Date(baseTime - 1000 * 60 * 5),
          thumbnail: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=200&h=200",
          progress: 40,
          progressMessage: "Processing..."
        }
      ];
  }
};

export function SessionBar({ 
  featureType = "generate",
  activeSessionId = "1", 
  onSessionSelect, 
  onNewSession 
}: SessionBarProps) {
  const [sessions, setSessions] = useState<Session[]>(() => generateFeatureSessions(featureType));
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleSessionClick = (sessionId: string) => {
    if (editingSessionId !== sessionId) {
      onSessionSelect?.(sessionId);
    }
  };

  const handleNewSession = () => {
    onNewSession?.();
  };

  const handleEditName = (sessionId: string, currentName: string) => {
    setEditingSessionId(sessionId);
    setEditingName(currentName);
  };

  const handleSaveName = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, name: editingName.trim() || session.name }
        : session
    ));
    setEditingSessionId(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditingName("");
  };

  return (
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
                    onClick={() => handleSessionClick(session.id)}
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

                    {/* Edit button */}
                    <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditName(session.id, session.name);
                        }}
                        className="w-4 h-4 bg-black bg-opacity-50 text-white rounded-sm flex items-center justify-center hover:bg-opacity-70"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                      </button>
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

        {/* Edit name modal */}
        {editingSessionId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Edit Session Name</h3>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter session name..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName(editingSessionId);
                  if (e.key === 'Escape') handleCancelEdit();
                }}
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleSaveName(editingSessionId)}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
} 