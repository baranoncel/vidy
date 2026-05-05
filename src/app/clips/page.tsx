"use client";

import { useState } from "react";
import { SessionBar } from "@/components/SessionBar";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import {
  Upload,
  Scissors,
  Sparkles,
  Play,
  Pause,
  Download,
  Video,
  Clock,
  Zap
} from "lucide-react";
import { useAgentRun } from "@/lib/hooks/useFeatureRun";

const clipPresets = [
  { id: "social", name: "Social Media", durations: [15, 30, 60], aspect: "9:16", icon: "📱" },
  { id: "youtube", name: "YouTube Shorts", durations: [15, 30, 60], aspect: "9:16", icon: "📺" },
  { id: "instagram", name: "Instagram", durations: [15, 30, 60], aspect: "1:1", icon: "📸" },
  { id: "tiktok", name: "TikTok", durations: [15, 30, 60], aspect: "9:16", icon: "🎵" },
  { id: "custom", name: "Custom", durations: [10, 30, 60, 120], aspect: "16:9", icon: "⚙️" }
];

const clipTypes = [
  { id: "highlights", name: "Highlights", description: "Best moments extraction", icon: "⭐" },
  { id: "chapters", name: "Chapters", description: "Split into sections", icon: "📖" },
  { id: "moments", name: "Key Moments", description: "Important scenes", icon: "🎯" },
  { id: "manual", name: "Manual", description: "Custom selection", icon: "✂️" }
];

export default function ClipsPage() {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(clipPresets[0]);
  const [selectedType, setSelectedType] = useState(clipTypes[0]);
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedClips, setGeneratedClips] = useState<string[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(30);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const agentRun = useAgentRun("long-form-to-twitter-clip");

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUploadedVideo(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateClips = async () => {
    setErrorMsg(null);
    if (!videoFile) { setErrorMsg("Upload a video first"); return; }
    setIsProcessing(true);
    try {
      await agentRun.run(
        { video: videoFile },
        { templateId: "long-form-to-twitter-clip", prompt: "Find the most viral 60s clip and reformat for shorts" },
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed");
    }
  };

  if (agentRun.outputUrl && !generatedClips.includes(agentRun.outputUrl)) setGeneratedClips([agentRun.outputUrl]);
  if (isProcessing && (agentRun.status === "completed" || agentRun.status === "failed")) {
    Promise.resolve().then(() => setIsProcessing(false));
  }

  return (
    <div className="min-h-screen bg-white">
      <SessionBar 
        featureType="video clipping"
        onSessionSelect={(sessionId) => console.log('Selected session:', sessionId)}
        onNewSession={() => console.log('New session created')}
      />
      
      <div className="pl-20 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-6xl">
          
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <Scissors className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">Clips</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Transform long videos into engaging short clips. Extract highlights, create chapters, or manually trim your content for social media.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-16">
            
            {/* Left Side - Upload & Settings */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-3xl">
                <div className="w-full h-64 bg-white rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                  {uploadedVideo ? (
                    <video 
                      src={uploadedVideo} 
                      className="w-full h-full object-cover rounded-xl" 
                      controls 
                    />
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-8 h-8 text-gray-500" />
                        </div>
                        <span className="text-xl font-medium text-gray-600">Upload video</span>
                        <p className="text-sm text-gray-500 mt-2">MP4, MOV, AVI up to 2GB</p>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {uploadedVideo && (
                <div className="space-y-6">
                  {/* Clip Type Selection */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Clip Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {clipTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type)}
                          className={`p-4 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                            selectedType.id === type.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium text-sm">{type.name}</div>
                          <div className="text-xs text-gray-600">{type.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Platform Presets */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Platform & Duration</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {clipPresets.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => setSelectedPreset(preset)}
                            className={`p-3 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                              selectedPreset.id === preset.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="text-lg mb-1">{preset.icon}</div>
                            <div className="font-medium text-sm">{preset.name}</div>
                            <div className="text-xs text-gray-600">{preset.aspect}</div>
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration: {selectedDuration}s
                        </label>
                        <div className="flex gap-2">
                          {selectedPreset.durations.map((duration) => (
                            <button
                              key={duration}
                              onClick={() => setSelectedDuration(duration)}
                              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                                selectedDuration === duration
                                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                                  : 'border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {duration}s
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual Timing (for manual type) */}
                  {selectedType.id === 'manual' && (
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold mb-4">Manual Selection</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Time (seconds)
                            </label>
                            <input
                              type="number"
                              value={startTime}
                              onChange={(e) => setStartTime(Number(e.target.value))}
                              className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                              min={0}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Time (seconds)
                            </label>
                            <input
                              type="number"
                              value={endTime}
                              onChange={(e) => setEndTime(Number(e.target.value))}
                              className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                              min={startTime + 1}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateClips}
                    disabled={isProcessing}
                    className="w-full py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Generate Clips'}
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - Results */}
            <div className="space-y-6">
              {isProcessing ? (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Scissors className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xl font-medium text-gray-600">Processing video...</span>
                    <div className="text-sm text-gray-500 mt-2">
                      Generating {selectedType.name} clips for {selectedPreset.name}
                    </div>
                  </div>
                </div>
              ) : generatedClips.length > 0 ? (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Generated Clips ({generatedClips.length})</h3>
                  <div className="space-y-4">
                    {generatedClips.map((clip, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Video className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Clip {index + 1}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {selectedDuration}s • {selectedPreset.aspect}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white hover:bg-orange-600">
                              <Play className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-black hover:bg-opacity-70">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download All Clips
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Scissors className="w-8 h-8 text-gray-500" />
                    </div>
                    <span className="text-xl font-medium text-gray-600">Generated clips</span>
                    <p className="text-sm text-gray-500 mt-2">Upload a video to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Features Section - Shows when user scrolls and no content generated */}
        <ScrollFeatures featureType="video" />
      </div>
    </div>
  );
} 