"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkInputProps {
  onSubmit?: (url: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const validateUrl = (url: string): boolean => {
  const patterns = [
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,  // YouTube
    /^https?:\/\/(www\.)?(tiktok\.com)\/.+/,             // TikTok
    /^https?:\/\/(www\.)?(vimeo\.com)\/.+/,              // Vimeo
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

const getPlatformName = (url: string): string => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
  if (url.includes('tiktok.com')) return 'TikTok';
  if (url.includes('vimeo.com')) return 'Vimeo';
  return 'Platform';
};

export function LinkInput({ 
  onSubmit, 
  disabled = false, 
  placeholder = "Paste a YouTube, TikTok, or Vimeo link...",
  className 
}: LinkInputProps) {
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleUrlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    if (newUrl.trim()) {
      setIsValid(validateUrl(newUrl.trim()));
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;
    
    if (validateUrl(trimmedUrl)) {
      onSubmit?.(trimmedUrl);
    } else {
      setIsValid(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const platformName = url.trim() ? getPlatformName(url) : '';

  return (
    <div className={cn("relative max-w-2xl mx-auto", className)}>
      {/* Platform indicator */}
      {platformName && isValid && (
        <div className="absolute top-4 left-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
            <Link2 className="h-3 w-3" />
            <span className="font-medium">{platformName}</span>
          </div>
        </div>
      )}

      <textarea
        value={url}
        onChange={handleUrlChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full p-4 pt-14 pr-24 text-gray-700 bg-gray-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 placeholder:text-gray-400 min-h-[120px]",
          !isValid && "ring-2 ring-red-500/20 bg-red-50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        rows={3}
      />
      
      {/* Error message */}
      {!isValid && (
        <div className="absolute bottom-4 left-4 text-xs text-red-600">
          Please enter a valid YouTube, TikTok, or Vimeo URL
        </div>
      )}
      
      {/* Character count */}
      <span className="absolute bottom-4 left-4 text-xs text-gray-400">
        {url.length}/500
      </span>
      
      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!url.trim() || !isValid || disabled}
        className={cn(
          "absolute bottom-4 right-4",
          "bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all"
        )}
      >
        <Sparkles className="h-4 w-4 mr-1.5" />
        Generate Clips
      </Button>
    </div>
  );
} 