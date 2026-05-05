"use client";

import { useState } from "react";
import { SessionBar } from "@/components/SessionBar";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import { 
  Upload, 
  Palette, 
  Sparkles, 
  Download,
  ImageIcon,
  Brush
} from "lucide-react";

const artStyles = [
  { id: "vangogh", name: "Van Gogh", description: "Starry Night style", preview: "🌌" },
  { id: "picasso", name: "Picasso", description: "Cubist style", preview: "🎨" },
  { id: "monet", name: "Monet", description: "Impressionist style", preview: "💧" },
  { id: "anime", name: "Anime", description: "Japanese animation", preview: "🎌" },
  { id: "oil", name: "Oil Painting", description: "Classical oil painting", preview: "🖼️" },
  { id: "watercolor", name: "Watercolor", description: "Watercolor painting", preview: "🎭" }
];

const styleStrengths = [
  { id: "light", name: "Light", value: 0.3, description: "Subtle style transfer" },
  { id: "medium", name: "Medium", value: 0.6, description: "Balanced style transfer" },
  { id: "strong", name: "Strong", value: 0.8, description: "Bold style transfer" },
  { id: "extreme", name: "Extreme", value: 1.0, description: "Maximum style transfer" }
];

export default function StylePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [styleImage, setStyleImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(artStyles[0]);
  const [selectedStrength, setSelectedStrength] = useState(styleStrengths[1]);
  const [isTransferring, setIsTransferring] = useState(false);
  const [styledImage, setStyledImage] = useState<string | null>(null);
  const [usePresetStyle, setUsePresetStyle] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'original' | 'style') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'original') {
          setOriginalImage(e.target?.result as string);
        } else {
          setStyleImage(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTransfer = () => {
    setIsTransferring(true);
    setTimeout(() => {
      setStyledImage(`https://picsum.photos/seed/${Date.now()}/800/800`);
      setIsTransferring(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <SessionBar 
        featureType="style transfer"
        onSessionSelect={(sessionId) => console.log('Selected session:', sessionId)}
        onNewSession={() => console.log('New session created')}
      />
      
      <div className="pl-20 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-6xl">
          
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">Style Transfer</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Apply artistic styles to your images and videos. Transform your content with famous art styles or upload your own style reference.
            </p>
          </div>

          {/* Style Method Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setUsePresetStyle(true)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  usePresetStyle ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Preset Styles
              </button>
              <button
                onClick={() => setUsePresetStyle(false)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  !usePresetStyle ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Custom Style
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mb-16">
            
            {/* Left - Original Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Original Image</h3>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="w-full h-64 bg-white rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                  {originalImage ? (
                    <img src={originalImage} alt="Original" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'original')}
                        className="hidden"
                        id="original-upload"
                      />
                      <label htmlFor="original-upload" className="cursor-pointer">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Upload className="w-6 h-6 text-gray-500" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Upload image</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle - Style Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Style Reference</h3>
              <div className="bg-gray-50 p-4 rounded-2xl">
                {usePresetStyle ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {artStyles.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style)}
                          className={`p-3 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                            selectedStyle.id === style.id ? 'border-red-500 bg-red-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="text-2xl mb-1">{style.preview}</div>
                          <div className="font-medium text-xs">{style.name}</div>
                        </button>
                      ))}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Style Strength
                      </label>
                      <div className="grid grid-cols-2 gap-1">
                        {styleStrengths.map((strength) => (
                          <button
                            key={strength.id}
                            onClick={() => setSelectedStrength(strength)}
                            className={`p-2 rounded-lg border text-center hover:bg-gray-50 transition-colors ${
                              selectedStrength.id === strength.id ? 'border-red-500 bg-red-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="text-xs font-medium">{strength.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-white rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                    {styleImage ? (
                      <img src={styleImage} alt="Style" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <div className="text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, 'style')}
                          className="hidden"
                          id="style-upload"
                        />
                        <label htmlFor="style-upload" className="cursor-pointer">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Brush className="w-6 h-6 text-gray-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">Upload style</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right - Result */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Styled Result</h3>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="w-full h-64 bg-white rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                  {isTransferring ? (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Transferring style...</span>
                    </div>
                  ) : styledImage ? (
                    <div className="relative w-full h-full">
                      <img src={styledImage} alt="Styled" className="w-full h-full object-cover rounded-xl" />
                      <button className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ImageIcon className="w-6 h-6 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Styled image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleTransfer}
              disabled={!originalImage || (!usePresetStyle && !styleImage) || isTransferring}
              className="flex items-center gap-2 px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              {isTransferring ? 'Transferring...' : 'Apply Style'}
            </button>
          </div>
        </div>
        
        {/* Features Section - Shows when user scrolls and no content generated */}
        <ScrollFeatures featureType="style" />
      </div>
    </div>
  );
} 