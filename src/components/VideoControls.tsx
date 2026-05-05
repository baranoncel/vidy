"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Image, Palette, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoControlsProps {
  onControlsChange?: (controls: VideoGenerationControls) => void;
  className?: string;
}

export interface VideoGenerationControls {
  startFrame?: string;
  endFrame?: string;
  resolution: string;
  orientation: string;
  style: string;
  duration: number;
}

const resolutions = [
  { value: "1080p", label: "1080p (Full HD)", ratio: "16:9" },
  { value: "720p", label: "720p (HD)", ratio: "16:9" },
  { value: "480p", label: "480p (SD)", ratio: "4:3" },
  { value: "4k", label: "4K (Ultra HD)", ratio: "16:9" },
];

const orientations = [
  { value: "landscape", label: "Landscape", icon: "📱", aspect: "16:9" },
  { value: "portrait", label: "Portrait", icon: "📱", aspect: "9:16" },
  { value: "square", label: "Square", icon: "⬜", aspect: "1:1" },
];

const styles = [
  { value: "realistic", label: "Realistic", description: "Photorealistic style" },
  { value: "cinematic", label: "Cinematic", description: "Movie-like quality" },
  { value: "animated", label: "Animated", description: "3D animation style" },
  { value: "artistic", label: "Artistic", description: "Stylized artistic look" },
  { value: "vintage", label: "Vintage", description: "Retro aesthetic" },
  { value: "futuristic", label: "Futuristic", description: "Sci-fi style" },
];

export function VideoControls({ onControlsChange, className }: VideoControlsProps) {
  const [controls, setControls] = useState<VideoGenerationControls>({
    resolution: "1080p",
    orientation: "landscape",
    style: "realistic",
    duration: 10,
  });

  const updateControls = (updates: Partial<VideoGenerationControls>) => {
    const newControls = { ...controls, ...updates };
    setControls(newControls);
    onControlsChange?.(newControls);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Start and End Frame */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-zinc-800 bg-zinc-950/50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-green-400" />
                <Label className="text-sm font-medium text-white">Start Frame</Label>
                <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                  Optional
                </Badge>
              </div>
              <Input
                placeholder="Paste image URL or upload..."
                value={controls.startFrame || ""}
                onChange={(e) => updateControls({ startFrame: e.target.value })}
                className="border-zinc-700 bg-zinc-900/50 text-white placeholder:text-zinc-400"
              />
              <p className="text-xs text-zinc-500">
                Initial frame to guide video generation
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-red-400" />
                <Label className="text-sm font-medium text-white">End Frame</Label>
                <Badge variant="outline" className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
                  Optional
                </Badge>
              </div>
              <Input
                placeholder="Paste image URL or upload..."
                value={controls.endFrame || ""}
                onChange={(e) => updateControls({ endFrame: e.target.value })}
                className="border-zinc-700 bg-zinc-900/50 text-white placeholder:text-zinc-400"
              />
              <p className="text-xs text-zinc-500">
                Target final frame for the video
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resolution, Orientation, Duration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-zinc-800 bg-zinc-950/50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-blue-400" />
                <Label className="text-sm font-medium text-white">Resolution</Label>
              </div>
              <Select
                value={controls.resolution}
                onValueChange={(value) => updateControls({ resolution: value })}
              >
                <SelectTrigger className="border-zinc-700 bg-zinc-900/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-900">
                  {resolutions.map((resolution) => (
                    <SelectItem 
                      key={resolution.value} 
                      value={resolution.value}
                      className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{resolution.label}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {resolution.ratio}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-purple-400" />
                <Label className="text-sm font-medium text-white">Orientation</Label>
              </div>
              <Select
                value={controls.orientation}
                onValueChange={(value) => updateControls({ orientation: value })}
              >
                <SelectTrigger className="border-zinc-700 bg-zinc-900/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-900">
                  {orientations.map((orientation) => (
                    <SelectItem 
                      key={orientation.value} 
                      value={orientation.value}
                      className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
                    >
                      <div className="flex items-center gap-2">
                        <span>{orientation.icon}</span>
                        <span>{orientation.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {orientation.aspect}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/50">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-yellow-400" />
                <Label className="text-sm font-medium text-white">Duration</Label>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="5"
                  max="60"
                  value={controls.duration}
                  onChange={(e) => updateControls({ duration: parseInt(e.target.value) || 10 })}
                  className="border-zinc-700 bg-zinc-900/50 text-white"
                />
                <span className="text-sm text-zinc-400">sec</span>
              </div>
              <p className="text-xs text-zinc-500">
                5-60 seconds
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Style Picker */}
      <Card className="border-zinc-800 bg-zinc-950/50">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-pink-400" />
              <Label className="text-sm font-medium text-white">Style</Label>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {styles.map((style) => (
                <button
                  key={style.value}
                  onClick={() => updateControls({ style: style.value })}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all duration-200",
                    "hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20",
                    controls.style === style.value
                      ? "border-blue-500 bg-blue-950/50 text-white"
                      : "border-zinc-700 bg-zinc-900/30 text-zinc-300 hover:bg-zinc-800/50"
                  )}
                >
                  <div className="font-medium text-sm">{style.label}</div>
                  <div className="text-xs text-zinc-400 mt-1">{style.description}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 