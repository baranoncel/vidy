"use client";

import { SessionBar } from "@/components/SessionBar";
import { ScrollFeatures } from "@/components/ui/scroll-features";

export default function EffectsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Session Bar */}
      <SessionBar 
        featureType="effects"
        onSessionSelect={(sessionId) => console.log('Selected session:', sessionId)}
        onNewSession={() => console.log('New session created')}
      />
      
      {/* Main Content */}
      <div className="pl-20 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h1 className="text-5xl font-bold text-gray-900">Video Effects Studio</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Transform your videos with professional AI-powered visual effects, including particle systems, color grading, motion graphics, and cinematic filters for stunning content creation and post-production workflows.
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-600 text-lg">
              Apply stunning visual effects to your videos with AI.
            </p>
            <div className="mt-8 p-8 rounded-lg bg-gray-50">
              <p className="text-gray-500">
                This page will feature the EffectGrid and EffectPanel components.
              </p>
            </div>
          </div>
        </div>
        
        {/* Features Section - Shows when user scrolls and no content generated */}
        <ScrollFeatures featureType="style" />
      </div>
    </div>
  );
} 