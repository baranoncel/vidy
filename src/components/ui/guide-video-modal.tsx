import { useState, useEffect } from "react";
import { X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuideVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videos: {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    duration: string;
  }[];
}

export function GuideVideoModal({ isOpen, onClose, title, videos }: GuideVideoModalProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Set first video as default
      if (videos.length > 0) {
        timeoutId = setTimeout(() => setSelectedVideo(videos[0].youtubeId), 0);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, videos]);

  if (!isOpen) return null;

  const currentVideo = videos.find(v => v.youtubeId === selectedVideo) || videos[0];

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white shadow-sm"
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">Learn how to get the most out of Vidy</p>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-200px)]">
          {/* Main video area */}
          <div className="flex-1 bg-black flex items-center justify-center">
            <div className="relative w-full h-full">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                title={currentVideo?.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Video list sidebar */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Videos ({videos.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {videos.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video.youtubeId)}
                  className={cn(
                    "w-full p-4 text-left border-b border-gray-200 hover:bg-white transition-colors",
                    selectedVideo === video.youtubeId ? "bg-white border-l-4 border-l-blue-500" : ""
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white drop-shadow-lg" fill="white" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">
                          {index + 1}.
                        </span>
                        <h4 className={cn(
                          "font-medium text-sm line-clamp-2",
                          selectedVideo === video.youtubeId ? "text-blue-600" : "text-gray-900"
                        )}>
                          {video.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 