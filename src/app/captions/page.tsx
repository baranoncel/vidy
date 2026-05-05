"use client";

import { useState } from "react";
import { SessionBar } from "@/components/SessionBar";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import { 
  Upload, 
  MessageSquare, 
  Sparkles, 
  Download,
  Video,
  Type,
  Settings,
  Languages
} from "lucide-react";

const captionStyles = [
  { id: "default", name: "Default", description: "Standard white text", preview: "Aa", bg: "bg-black", color: "text-white" },
  { id: "bold", name: "Bold", description: "Bold white text", preview: "Aa", bg: "bg-black", color: "text-white font-bold" },
  { id: "outlined", name: "Outlined", description: "White text with black outline", preview: "Aa", bg: "bg-gray-200", color: "text-white" },
  { id: "box", name: "Box", description: "Text in colored box", preview: "Aa", bg: "bg-blue-500", color: "text-white" },
  { id: "highlight", name: "Highlight", description: "Highlighted background", preview: "Aa", bg: "bg-yellow-400", color: "text-black" },
  { id: "modern", name: "Modern", description: "Trendy social media style", preview: "Aa", bg: "bg-gradient-to-r from-pink-500 to-violet-500", color: "text-white font-bold" }
];

const languages = [
  { id: "en", name: "English", flag: "🇺🇸" },
  { id: "es", name: "Spanish", flag: "🇪🇸" },
  { id: "fr", name: "French", flag: "🇫🇷" },
  { id: "de", name: "German", flag: "🇩🇪" },
  { id: "it", name: "Italian", flag: "🇮🇹" },
  { id: "pt", name: "Portuguese", flag: "🇧🇷" },
  { id: "ru", name: "Russian", flag: "🇷🇺" },
  { id: "ja", name: "Japanese", flag: "🇯🇵" },
  { id: "ko", name: "Korean", flag: "🇰🇷" },
  { id: "zh", name: "Chinese", flag: "🇨🇳" }
];

const captionTypes = [
  { id: "auto", name: "Auto-Generated", description: "AI transcribes speech to text", icon: "🤖" },
  { id: "translation", name: "Translation", description: "Translate to other languages", icon: "🌐" },
  { id: "custom", name: "Custom Text", description: "Add custom text overlay", icon: "✏️" },
  { id: "lyrics", name: "Lyrics/Music", description: "Sync lyrics with music", icon: "🎵" }
];

export default function CaptionsPage() {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState(captionTypes[0]);
  const [selectedStyle, setSelectedStyle] = useState(captionStyles[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [targetLanguage, setTargetLanguage] = useState(languages[1]);
  const [customText, setCustomText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [position, setPosition] = useState("bottom");

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
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedCaptions("Generated captions ready");
      setIsGenerating(false);
    }, 3000);
  };

  const mockCaptions = [
    { start: "00:00", end: "00:03", text: "Welcome to our amazing product review!" },
    { start: "00:03", end: "00:07", text: "Today we're going to show you something incredible." },
    { start: "00:07", end: "00:11", text: "This revolutionary technology will change everything." },
    { start: "00:11", end: "00:15", text: "Let's dive in and see what makes it so special." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <SessionBar 
        featureType="captions"
        onSessionSelect={(sessionId) => console.log('Selected session:', sessionId)}
        onNewSession={() => console.log('New session created')}
      />
      
      <div className="pl-20 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-6xl">
          
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">Captions</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Generate accurate captions and subtitles for your videos. Auto-transcribe speech, translate to multiple languages, or add custom text overlays.
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
                  {/* Caption Type Selection */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Caption Type</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {captionTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type)}
                          className={`p-4 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                            selectedType.id === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium text-sm">{type.name}</div>
                          <div className="text-xs text-gray-600">{type.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Settings */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Language Settings</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Source Language
                        </label>
                        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                          {languages.slice(0, 6).map((lang) => (
                            <button
                              key={lang.id}
                              onClick={() => setSelectedLanguage(lang)}
                              className={`p-2 rounded-lg border text-center hover:bg-gray-50 transition-colors ${
                                selectedLanguage.id === lang.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                              }`}
                            >
                              <div className="text-lg mb-1">{lang.flag}</div>
                              <div className="text-xs font-medium">{lang.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedType.id === 'translation' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Translate To
                          </label>
                          <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                            {languages.slice(0, 6).map((lang) => (
                              <button
                                key={lang.id}
                                onClick={() => setTargetLanguage(lang)}
                                className={`p-2 rounded-lg border text-center hover:bg-gray-50 transition-colors ${
                                  targetLanguage.id === lang.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                }`}
                              >
                                <div className="text-lg mb-1">{lang.flag}</div>
                                <div className="text-xs font-medium">{lang.name}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Custom Text Input */}
                  {selectedType.id === 'custom' && (
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h3 className="text-lg font-semibold mb-4">Custom Text</h3>
                      <textarea
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Enter your custom text or captions here..."
                        className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  {/* Style Settings */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Caption Style</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {captionStyles.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style)}
                            className={`p-3 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                              selectedStyle.id === style.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            <div className={`w-8 h-8 ${style.bg} rounded mx-auto mb-2 flex items-center justify-center`}>
                              <span className={`text-sm ${style.color}`}>{style.preview}</span>
                            </div>
                            <div className="font-medium text-xs">{style.name}</div>
                          </button>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Font Size: {fontSize}px
                          </label>
                          <input
                            type="range"
                            min={12}
                            max={32}
                            value={fontSize}
                            onChange={(e) => setFontSize(Number(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Position
                          </label>
                          <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                          >
                            <option value="top">Top</option>
                            <option value="center">Center</option>
                            <option value="bottom">Bottom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Captions'}
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - Preview & Results */}
            <div className="space-y-6">
              {isGenerating ? (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-xl font-medium text-gray-600">Generating captions...</span>
                    <div className="text-sm text-gray-500 mt-2">
                      {selectedType.name} for {selectedLanguage.name}
                    </div>
                  </div>
                </div>
              ) : generatedCaptions ? (
                <div className="space-y-6">
                  {/* Video Preview */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Preview with Captions</h3>
                    <div className="w-full h-64 bg-black rounded-xl flex items-center justify-center relative">
                      <div className="text-center">
                        <Video className="w-16 h-16 text-white mx-auto mb-4" />
                        <div className="text-white">Video Preview</div>
                      </div>
                      {/* Caption overlay preview */}
                      <div className={`absolute ${position === 'top' ? 'top-4' : position === 'center' ? 'top-1/2 -translate-y-1/2' : 'bottom-4'} left-4 right-4`}>
                        <div className={`${selectedStyle.bg} ${selectedStyle.color} px-4 py-2 rounded-lg text-center`} style={{ fontSize: `${fontSize}px` }}>
                          Welcome to our amazing product review!
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caption Timeline */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Generated Captions</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {mockCaptions.map((caption, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 bg-white rounded-lg">
                          <div className="text-sm text-gray-500 font-mono w-20">
                            {caption.start} - {caption.end}
                          </div>
                          <div className="flex-1 text-sm">{caption.text}</div>
                          <button className="text-blue-500 hover:text-blue-600 text-sm">
                            Edit
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="bg-gray-50 p-6 rounded-2xl">
                    <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                    <div className="space-y-3">
                      <button className="w-full py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Video with Captions
                      </button>
                      <button className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-2">
                        <Type className="w-4 h-4" />
                        Download SRT File
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-500" />
                    </div>
                    <span className="text-xl font-medium text-gray-600">Caption preview</span>
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