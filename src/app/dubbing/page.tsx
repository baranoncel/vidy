"use client";

import { useState } from "react";
import { SessionBar } from "@/components/SessionBar";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import { 
  Upload, 
  Volume2, 
  Sparkles, 
  Play,
  Download,
  Video,
  Mic,
  Languages,
  User
} from "lucide-react";

const languages = [
  { id: "en", name: "English", flag: "🇺🇸", voice: "Natural American" },
  { id: "es", name: "Spanish", flag: "🇪🇸", voice: "Native Spanish" },
  { id: "fr", name: "French", flag: "🇫🇷", voice: "Parisian French" },
  { id: "de", name: "German", flag: "🇩🇪", voice: "Standard German" },
  { id: "it", name: "Italian", flag: "🇮🇹", voice: "Roman Italian" },
  { id: "pt", name: "Portuguese", flag: "🇧🇷", voice: "Brazilian Portuguese" },
  { id: "ja", name: "Japanese", flag: "🇯🇵", voice: "Tokyo Japanese" },
  { id: "ko", name: "Korean", flag: "🇰🇷", voice: "Seoul Korean" },
  { id: "zh", name: "Chinese", flag: "🇨🇳", voice: "Mandarin Chinese" },
  { id: "hi", name: "Hindi", flag: "🇮🇳", voice: "Delhi Hindi" }
];

const voiceStyles = [
  { id: "natural", name: "Natural", description: "Human-like speech", quality: "High" },
  { id: "professional", name: "Professional", description: "Business narrator", quality: "Premium" },
  { id: "emotional", name: "Emotional", description: "Expressive delivery", quality: "Premium" },
  { id: "casual", name: "Casual", description: "Conversational tone", quality: "High" },
  { id: "dramatic", name: "Dramatic", description: "Theater-style", quality: "Premium" },
  { id: "cheerful", name: "Cheerful", description: "Upbeat and happy", quality: "High" }
];

const genderVoices = [
  { id: "male", name: "Male Voice", description: "Deep, authoritative", icon: "👨", count: 24 },
  { id: "female", name: "Female Voice", description: "Clear, engaging", icon: "👩", count: 32 },
  { id: "child", name: "Child Voice", description: "Young, playful", icon: "🧒", count: 8 },
  { id: "elderly", name: "Elderly Voice", description: "Wise, experienced", icon: "👴", count: 12 }
];

export default function DubbingPage() {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState(languages[1]);
  const [selectedVoiceStyle, setSelectedVoiceStyle] = useState(voiceStyles[0]);
  const [selectedGender, setSelectedGender] = useState(genderVoices[0]);
  const [preserveOriginalTiming, setPreserveOriginalTiming] = useState(true);
  const [lipSyncEnabled, setLipSyncEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedDub, setGeneratedDub] = useState<string | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedVideo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setGeneratedDub("Generated dubbing ready");
      setIsProcessing(false);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Session Bar */}
      <SessionBar 
        featureType="dubbing"
        onSessionSelect={(sessionId) => console.log('Selected session:', sessionId)}
        onNewSession={() => console.log('New session created')}
      />
      
      {/* Main Content */}
      <div className="pl-20 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-6xl">
          
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">Dubbing</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Transform your videos with AI-powered voice dubbing. Translate content to any language while maintaining perfect lip-sync and natural speech patterns.
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
                  {/* Language Selection */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Language Translation</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Source Language
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                          {languages.slice(0, 6).map((lang) => (
                            <button
                              key={lang.id}
                              onClick={() => setSourceLanguage(lang)}
                              className={`p-3 rounded-lg border text-center hover:bg-gray-50 transition-colors ${
                                sourceLanguage.id === lang.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="text-lg mb-1">{lang.flag}</div>
                              <div className="text-xs font-medium">{lang.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-center">
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Languages className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Language
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                          {languages.slice(0, 6).map((lang) => (
                            <button
                              key={lang.id}
                              onClick={() => setTargetLanguage(lang)}
                              className={`p-3 rounded-lg border text-center hover:bg-gray-50 transition-colors ${
                                targetLanguage.id === lang.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="text-lg mb-1">{lang.flag}</div>
                              <div className="text-xs font-medium">{lang.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Voice Selection */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Voice Character</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {genderVoices.map((gender) => (
                          <button
                            key={gender.id}
                            onClick={() => setSelectedGender(gender)}
                            className={`p-4 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                              selectedGender.id === gender.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="text-2xl mb-2">{gender.icon}</div>
                            <div className="font-medium text-sm">{gender.name}</div>
                            <div className="text-xs text-gray-600">{gender.count} voices</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Voice Style */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Voice Style</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {voiceStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedVoiceStyle(style)}
                          className={`p-3 rounded-xl border text-left hover:bg-gray-50 transition-colors ${
                            selectedVoiceStyle.id === style.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="font-medium text-sm">{style.name}</div>
                          <div className="text-xs text-gray-600">{style.description}</div>
                          <div className="text-xs text-emerald-600 mt-1">{style.quality} Quality</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Advanced Options</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={preserveOriginalTiming}
                          onChange={(e) => setPreserveOriginalTiming(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <div>
                          <div className="font-medium text-sm">Preserve Original Timing</div>
                          <div className="text-xs text-gray-600">Keep the same pace as original speech</div>
                        </div>
                      </label>

                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={lipSyncEnabled}
                          onChange={(e) => setLipSyncEnabled(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <div>
                          <div className="font-medium text-sm">Enable Lip Sync</div>
                          <div className="text-xs text-gray-600">Sync mouth movements with new audio</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Generate Dubbing'}
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - Preview & Results */}
            <div className="space-y-6">
              {isProcessing ? (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Volume2 className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xl font-medium text-gray-600">Generating dubbing...</span>
                    <div className="text-sm text-gray-500 mt-2">
                      {sourceLanguage.name} → {targetLanguage.name} • {selectedGender.name}
                    </div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </div>
              ) : generatedDub ? (
                <div className="space-y-6">
                  {/* Video Preview */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Dubbed Video Preview</h3>
                    <div className="w-full h-64 bg-black rounded-xl flex items-center justify-center relative">
                      <div className="text-center">
                        <Play className="w-16 h-16 text-white mx-auto mb-4" />
                        <div className="text-white">Dubbed Video Ready</div>
                        <div className="text-gray-300 text-sm">
                          {targetLanguage.name} • {selectedGender.name} • {selectedVoiceStyle.name}
                        </div>
                      </div>
                      <button className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-black hover:bg-opacity-70">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Audio Controls */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Audio Comparison</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white rounded-xl">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Mic className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Original Audio</div>
                          <div className="text-sm text-gray-600">{sourceLanguage.name}</div>
                        </div>
                        <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300">
                          <Play className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-emerald-200">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Volume2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">Dubbed Audio</div>
                          <div className="text-sm text-gray-600">{targetLanguage.name} • {selectedGender.name}</div>
                        </div>
                        <button className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600">
                          <Play className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Settings Summary */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Dubbing Settings</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Translation:</span>
                        <span className="font-medium">{sourceLanguage.name} → {targetLanguage.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Voice:</span>
                        <span className="font-medium">{selectedGender.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Style:</span>
                        <span className="font-medium">{selectedVoiceStyle.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lip Sync:</span>
                        <span className="font-medium">{lipSyncEnabled ? 'Enabled' : 'Disabled'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timing:</span>
                        <span className="font-medium">{preserveOriginalTiming ? 'Preserved' : 'Optimized'}</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Dubbed Video
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Volume2 className="w-8 h-8 text-gray-500" />
                    </div>
                    <span className="text-xl font-medium text-gray-600">Dubbing preview</span>
                    <p className="text-sm text-gray-500 mt-2">Upload a video to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Features Section - Shows when user scrolls and no content generated */}
        <ScrollFeatures featureType="audio" />
      </div>
    </div>
  );
} 