"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Zap, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  speed: "fast" | "medium" | "slow";
  quality: "standard" | "high" | "ultra";
  creditsPerGeneration: number;
  maxDuration: number; // in seconds
  supportedResolutions: string[];
}

const mockModels: AIModel[] = [
  {
    id: "veo-3",
    name: "VEO 3",
    provider: "Google",
    description: "Latest video generation model with exceptional quality",
    speed: "medium",
    quality: "ultra",
    creditsPerGeneration: 10,
    maxDuration: 30,
    supportedResolutions: ["1080p", "720p", "480p"]
  },
  {
    id: "kling-2.1",
    name: "Kling 2.1",
    provider: "Kuaishou",
    description: "High-quality video generation with fast processing",
    speed: "fast",
    quality: "high",
    creditsPerGeneration: 8,
    maxDuration: 20,
    supportedResolutions: ["1080p", "720p"]
  },
  {
    id: "runway-gen3",
    name: "Runway Gen-3",
    provider: "Runway",
    description: "Advanced video generation for creative professionals",
    speed: "slow",
    quality: "ultra",
    creditsPerGeneration: 15,
    maxDuration: 45,
    supportedResolutions: ["4K", "1080p", "720p"]
  },
  {
    id: "pika-1.5",
    name: "Pika 1.5",
    provider: "Pika Labs",
    description: "Efficient video generation with good quality",
    speed: "fast",
    quality: "standard",
    creditsPerGeneration: 5,
    maxDuration: 15,
    supportedResolutions: ["1080p", "720p", "480p"]
  }
];

interface ModelSelectProps {
  selectedModel?: string;
  onModelChange?: (model: AIModel) => void;
  className?: string;
}

export function ModelSelect({
  selectedModel,
  onModelChange,
  className
}: ModelSelectProps) {
  const [models, setModels] = useState<AIModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fetching models from fal.ai API
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setModels(mockModels);
      setIsLoading(false);
    };

    fetchModels();
  }, []);

  const selectedModelData = models.find(model => model.id === selectedModel);

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case "fast": return <Zap className="h-3 w-3 text-green-500" />;
      case "medium": return <Clock className="h-3 w-3 text-yellow-500" />;
      case "slow": return <Clock className="h-3 w-3 text-red-500" />;
      default: return <Clock className="h-3 w-3 text-zinc-500" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "ultra": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "high": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "standard": return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
      default: return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  return (
    <Card className={cn(
      "border-zinc-800 bg-zinc-950/50",
      className
    )}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-400" />
            <h3 className="font-medium text-white">AI Model</h3>
          </div>

          <Select
            value={selectedModel}
            onValueChange={(value) => {
              const model = models.find(m => m.id === value);
              if (model && onModelChange) {
                onModelChange(model);
              }
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="border-zinc-700 bg-zinc-900/50 text-white">
              <SelectValue placeholder={isLoading ? "Loading models..." : "Choose a model"} />
            </SelectTrigger>
            <SelectContent className="border-zinc-700 bg-zinc-900">
              {models.map((model) => (
                <SelectItem 
                  key={model.id} 
                  value={model.id}
                  className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{model.name}</span>
                    <Badge variant="outline" className={getQualityColor(model.quality)}>
                      {model.quality}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedModelData && (
            <div className="space-y-3 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{selectedModelData.name}</span>
                <span className="text-xs text-zinc-400">{selectedModelData.provider}</span>
              </div>
              
              <p className="text-xs text-zinc-400">{selectedModelData.description}</p>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1">
                  {getSpeedIcon(selectedModelData.speed)}
                  <span className="text-zinc-400">Speed: {selectedModelData.speed}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-yellow-500" />
                  <span className="text-zinc-400">{selectedModelData.creditsPerGeneration} credits</span>
                </div>
                
                <div className="col-span-2 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <span className="text-zinc-400">Max duration: {selectedModelData.maxDuration}s</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {selectedModelData.supportedResolutions.map((resolution) => (
                  <Badge 
                    key={resolution} 
                    variant="outline" 
                    className="text-xs bg-zinc-800/50 text-zinc-300 border-zinc-700"
                  >
                    {resolution}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 