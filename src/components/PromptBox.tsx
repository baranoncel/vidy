"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptBoxProps {
  onPromptChange?: (prompt: string) => void;
  onSubmit?: (prompt: string) => void;
  isGenerating?: boolean;
  placeholder?: string;
  className?: string;
}

export function PromptBox({
  onPromptChange,
  onSubmit,
  isGenerating = false,
  placeholder = "Describe the video you want to create...",
  className
}: PromptBoxProps) {
  const [prompt, setPrompt] = useState("");
  const [debouncedPrompt] = useDebounce(prompt, 300);

  useEffect(() => {
    if (debouncedPrompt && onPromptChange) {
      onPromptChange(debouncedPrompt);
    }
  }, [debouncedPrompt, onPromptChange]);

  const handleSubmit = () => {
    if (prompt.trim() && onSubmit && !isGenerating) {
      onSubmit(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className={cn(
      "w-full max-w-2xl mx-auto bg-white backdrop-blur-sm",
      className
    )}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-semibold">AI Video Generator</h3>
          </div>
          
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="min-h-[120px] resize-none bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
              disabled={isGenerating}
            />
            
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {prompt.length}/500
              </span>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!prompt.trim() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">Enter</kbd> to generate
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 