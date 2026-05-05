import { useState, useEffect } from "react";
import { X, Copy, Check, Video, Camera, Zap, Sparkles, Edit3, Mic, Wand2, Box, Music, Palette, Volume2, Tv, Maximize2, Cpu, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/ui/video-player";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Feature mapping for icons and links
const featureMap: Record<string, { icon: LucideIcon; link: string; bgColor: string }> = {
  "Video Generation": { icon: Video, link: "/video", bgColor: "bg-blue-500" },
  "Image Generation": { icon: Camera, link: "/image", bgColor: "bg-blue-500" },
  "Realtime Canvas": { icon: Zap, link: "/realtime", bgColor: "bg-cyan-500" },
  "Video Enhancement": { icon: Sparkles, link: "/enhance", bgColor: "bg-gray-800" },
  "Edit & Remix": { icon: Edit3, link: "/edit", bgColor: "bg-purple-600" },
  "Video Lipsync": { icon: Mic, link: "/lipsync", bgColor: "bg-indigo-600" },
  "Style Transfer": { icon: Palette, link: "/style", bgColor: "bg-red-500" },
  "3D Generation": { icon: Box, link: "/3d", bgColor: "bg-gray-700" },
  "Audio Generation": { icon: Music, link: "/audio", bgColor: "bg-green-500" },
  "Text to Speech": { icon: Volume2, link: "/tts", bgColor: "bg-yellow-500" },
  "Video Analytics": { icon: Tv, link: "/analytics", bgColor: "bg-teal-500" },
  "Image Upscaler": { icon: Maximize2, link: "/upscale", bgColor: "bg-indigo-500" },
  "AI Assistant": { icon: Cpu, link: "/assistant", bgColor: "bg-purple-500" },
};

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: {
    id: string;
    videoUrl: string;
    thumbnailUrl: string;
    aspectRatio: string;
    duration: string;
    creator: string;
    creatorAvatar: string;
    prompt?: string;
    feature?: string;
    model?: string;
  };
}

export function VideoModal({ isOpen, onClose, video }: VideoModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (video.prompt) {
      await navigator.clipboard.writeText(video.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button - positioned absolutely */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white shadow-sm"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Content */}
        <div className="flex h-[90vh]">
          {/* Left side - Video */}
          <div className="flex-1 bg-black/20 backdrop-blur-md flex items-center justify-center p-6">
            <div className="relative w-full h-full flex items-center justify-center">
              <VideoPlayer 
                src={video.videoUrl}
                variant="default"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Right side - Details */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-6 pt-16 flex-1 overflow-y-auto">
              {/* Prompt Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Prompt</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 px-3 gap-2"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {video.prompt || "A cinematic video showcasing beautiful landscapes with dramatic lighting and smooth camera movements."}
                  </p>
                </div>
              </div>

              {/* Feature Used */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Feature Used</h4>
                {(() => {
                  const feature = featureMap[video.feature || "Video Generation"];
                  const FeatureIcon = feature?.icon || Video;
                  return (
                    <Link 
                      href={feature?.link || "/video"}
                      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        feature?.bgColor || "bg-blue-500"
                      )}>
                        <FeatureIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 group-hover:text-gray-700">
                          {video.feature || "Video Generation"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Click to open feature
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-gray-600">
                        →
                      </div>
                    </Link>
                  );
                })()}
              </div>

              {/* AI Model */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">AI Model</h4>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">
                      {video.model || "Hailo 2.5"}
                    </p>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      Latest
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    High-quality video generation with enhanced motion and detail
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>• 1080p Output</span>
                    <span>• 30 FPS</span>
                    <span>• 60s Max</span>
                  </div>
                </div>
              </div>

              {/* Creator Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Created By</h4>
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <img 
                    src={video.creatorAvatar} 
                    alt={video.creator}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{video.creator}</p>
                    <p className="text-sm text-gray-500">Duration: {video.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <Button className="flex-1 bg-gray-900 hover:bg-black text-white">
                  Try Similar
                </Button>
                <Button variant="outline" className="flex-1">
                  Remix
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 