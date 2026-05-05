"use client";

import { FeaturesSection } from './features-section';
import { useContent } from '@/context/content-context';

interface ScrollFeaturesProps {
  featureType: 'video' | 'image' | 'realtime' | 'enhance' | 'edit' | 'lipsync' | 'train' | '3d' | 'audio' | 'style' | 'tts' | 'analytics' | 'upscale' | 'ai-video-tools'
}

export function ScrollFeatures({ featureType }: ScrollFeaturesProps) {
  const { hasGeneratedContent } = useContent();
  
  // Only hide features if content has been generated
  if (hasGeneratedContent) {
    return null;
  }

  return (
    <div className="mt-32">
      <FeaturesSection featureType={featureType} />
    </div>
  );
} 