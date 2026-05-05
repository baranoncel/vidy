"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Download, 
  Share2, 
  Copy, 
  Volume2, 
  RotateCcw, 
  Expand,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  prompt?: string;
  aspectRatio: "16:9" | "9:16" | "1:1" | "4:3";
  className?: string;
}

const aspectRatioClasses = {
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "1:1": "aspect-square",
  "4:3": "aspect-[4/3]",
};

export function VideoCard({ 
  id, 
  title, 
  videoUrl, 
  thumbnailUrl, 
  prompt,
  aspectRatio,
  className 
}: VideoCardProps) {
  const handleAction = (action: string) => {
    console.log(`${action} action for video ${id}`);
    // TODO: Implement actual actions
  };

  return (
    <Card className={cn(
      "group overflow-hidden bg-white hover:bg-gray-50 transition-all duration-300",
      className
    )}>
      <div className="relative">
        {/* Video/Thumbnail */}
        <div className={cn("relative overflow-hidden bg-gray-100", aspectRatioClasses[aspectRatio])}>
          {videoUrl ? (
            <video
              className="w-full h-full object-cover"
              poster={thumbnailUrl}
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Play className="h-12 w-12 text-gray-400" />
            </div>
          )}
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="sm" variant="secondary" className="bg-white/80 hover:bg-white text-gray-700">
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Title overlay */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <h4 className="text-sm font-medium text-white truncate">{title}</h4>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="p-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-wrap gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 px-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleAction("regenerate")}
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Regenerate</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 px-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleAction("extend")}
                >
                  <Expand className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Extend</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 px-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleAction("sfx")}
                >
                  <Volume2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add SFX</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 px-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleAction("copy")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy Prompt</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 px-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleAction("share")}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 px-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleAction("download")}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
} 