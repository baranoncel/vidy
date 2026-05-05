"use client";

import { useState } from "react";
import { SessionBar } from "@/components/SessionBar";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import {
  Upload,
  Users,
  Sparkles,
  Play,
  Download,
  Video,
  User,
  Settings
} from "lucide-react";
import { useAgentRun } from "@/lib/hooks/useFeatureRun";

const influencerStyles = [
  { id: "lifestyle", name: "Lifestyle", description: "Daily life content", icon: "✨", bg: "bg-pink-100", color: "text-pink-600" },
  { id: "tech", name: "Tech Review", description: "Product reviews", icon: "📱", bg: "bg-blue-100", color: "text-blue-600" },
  { id: "fitness", name: "Fitness", description: "Workout content", icon: "💪", bg: "bg-green-100", color: "text-green-600" },
  { id: "beauty", name: "Beauty", description: "Makeup & skincare", icon: "💄", bg: "bg-purple-100", color: "text-purple-600" },
  { id: "food", name: "Food", description: "Cooking & recipes", icon: "🍳", bg: "bg-orange-100", color: "text-orange-600" },
  { id: "travel", name: "Travel", description: "Travel vlogs", icon: "✈️", bg: "bg-cyan-100", color: "text-cyan-600" }
];

const videoFormats = [
  { id: "story", name: "Story", aspect: "9:16", duration: "15s", platform: "Instagram/TikTok" },
  { id: "reel", name: "Reel", aspect: "9:16", duration: "30s", platform: "Instagram" },
  { id: "short", name: "Short", aspect: "9:16", duration: "60s", platform: "YouTube" },
  { id: "post", name: "Feed Post", aspect: "1:1", duration: "60s", platform: "Instagram" }
];

const avatars = [
  { id: "alex", name: "Alex", gender: "Male", age: "25", style: "Tech Enthusiast", avatar: "👨‍💻" },
  { id: "sarah", name: "Sarah", gender: "Female", age: "28", style: "Lifestyle", avatar: "👩‍🦰" },
  { id: "mike", name: "Mike", gender: "Male", age: "32", style: "Fitness", avatar: "👨‍🏋️" },
  { id: "emma", name: "Emma", gender: "Female", age: "24", style: "Beauty", avatar: "👩‍💄" },
  { id: "david", name: "David", gender: "Male", age: "29", style: "Travel", avatar: "👨‍🎒" },
  { id: "lisa", name: "Lisa", gender: "Female", age: "26", style: "Food", avatar: "👩‍🍳" }
];

export default function UGCVideoPage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(influencerStyles[0]);
  const [selectedFormat, setSelectedFormat] = useState(videoFormats[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const agentRun = useAgentRun("ios-screenshot-to-ugc-promo");

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setProductImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!productFile) {
      setErrorMsg("Upload a product image first");
      return;
    }
    setErrorMsg(null);
    setIsGenerating(true);
    setGeneratedVideo(null);
    try {
      const durationSeconds = parseInt(selectedFormat.duration) || 15;
      await agentRun.run(
        {
          screenshot: productFile,
          productLine: prompt || `${selectedStyle.name} content with ${selectedAvatar.name}`,
          tone: selectedStyle.id,
          durationSeconds,
        },
        { templateId: "ios-screenshot-to-ugc-promo", prompt: prompt || `Create a ${selectedFormat.duration} ${selectedStyle.name} UGC promo` },
      );
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed");
    }
  };

  // Pull state from agentRun every render
  if (agentRun.outputUrl && agentRun.outputUrl !== generatedVideo) setGeneratedVideo(agentRun.outputUrl);
  if (isGenerating && (agentRun.status === "completed" || agentRun.status === "failed")) {
    // Defer to next render to satisfy React's rules
    Promise.resolve().then(() => setIsGenerating(false));
  }

  return (
    <div className="min-h-screen bg-white">
      <SessionBar 
        featureType="UGC video"
        onSessionSelect={(sessionId) => console.log('Selected session:', sessionId)}
        onNewSession={() => console.log('New session created')}
      />
      
      <div className="pl-20 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-6xl">
          
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">UGC Video</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Create authentic user-generated content with AI influencers. Generate engaging videos that look like real customer testimonials and reviews.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-16">
            
            {/* Left Side - Input & Settings */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-3xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Content Description
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Create a video review of a new skincare product, highlighting its benefits and showing before/after results..."
                    className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product/Brand Image (Optional)
                  </label>
                  <div className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-gray-300 transition-colors">
                    {productImage ? (
                      <img src={productImage} alt="Product" className="h-20 w-auto rounded" />
                    ) : (
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProductUpload}
                          className="hidden"
                          id="product-upload"
                        />
                        <label htmlFor="product-upload" className="cursor-pointer">
                          <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <span className="text-sm text-gray-500">Upload product image</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {influencerStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style)}
                        className={`p-3 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                          selectedStyle.id === style.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200'
                        }`}
                      >
                        <div className={`w-8 h-8 ${style.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                          <span className="text-lg">{style.icon}</span>
                        </div>
                        <div className="font-medium text-sm">{style.name}</div>
                        <div className="text-xs text-gray-600">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Avatar
                  </label>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                    {avatars.map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => setSelectedAvatar(avatar)}
                        className={`p-3 rounded-xl border text-left hover:bg-gray-50 transition-colors ${
                          selectedAvatar.id === avatar.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{avatar.avatar}</div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{avatar.name}</div>
                            <div className="text-xs text-gray-600">
                              {avatar.gender}, {avatar.age} • {avatar.style}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Format
                  </label>
                  <div className="space-y-2">
                    {videoFormats.map((format) => (
                      <button
                        key={format.id}
                        onClick={() => setSelectedFormat(format)}
                        className={`w-full p-3 rounded-xl border text-left hover:bg-gray-50 transition-colors ${
                          selectedFormat.id === format.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{format.name}</div>
                            <div className="text-sm text-gray-600">
                              {format.aspect} • {format.duration} • {format.platform}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? 'Generating...' : 'Generate UGC Video'}
              </button>
            </div>

            {/* Right Side - Preview & Output */}
            <div className="space-y-6">
              {/* Avatar Preview */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Selected Creator</h3>
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
                  <div className="text-4xl">{selectedAvatar.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium text-lg">{selectedAvatar.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedAvatar.gender}, {selectedAvatar.age} years old
                    </div>
                    <div className="text-sm text-gray-600">Specializes in {selectedAvatar.style}</div>
                  </div>
                </div>
              </div>

              {/* Video Output */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Generated Video</h3>
                <div className="w-full h-80 bg-white rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                  {isGenerating ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <span className="text-xl font-medium text-gray-600">Creating UGC video...</span>
                      <div className="text-sm text-gray-500 mt-2">
                        {selectedAvatar.name} • {selectedStyle.name} style
                      </div>
                    </div>
                  ) : generatedVideo ? (
                    <div className="relative w-full h-full">
                      <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-200 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-16 h-16 text-violet-600 mx-auto mb-4" />
                          <div className="text-lg font-medium text-violet-700">UGC Video Ready</div>
                          <div className="text-sm text-violet-600">
                            {selectedFormat.duration} • {selectedFormat.aspect}
                          </div>
                        </div>
                      </div>
                      <button className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-black hover:bg-opacity-70">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video className="w-8 h-8 text-gray-500" />
                      </div>
                      <span className="text-xl font-medium text-gray-600">UGC video preview</span>
                      <p className="text-sm text-gray-500 mt-2">Video will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Settings Preview */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Video Settings</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Style:</span>
                    <span className="font-medium">{selectedStyle.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">{selectedFormat.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedFormat.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aspect Ratio:</span>
                    <span className="font-medium">{selectedFormat.aspect}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform:</span>
                    <span className="font-medium">{selectedFormat.platform}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section - Shows when user scrolls and no content generated */}
        <ScrollFeatures featureType="video" />
      </div>
    </div>
  );
} 