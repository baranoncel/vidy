"use client";

import { useState } from "react";
import { SessionBar } from "@/components/SessionBar";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import { 
  Upload, 
  Maximize2, 
  Sparkles, 
  Download,
  ImageIcon,
  Zap
} from "lucide-react";

const upscaleFactors = [
  { id: "2x", name: "2x", description: "Double resolution", multiplier: 2 },
  { id: "4x", name: "4x", description: "Quadruple resolution", multiplier: 4 },
  { id: "8x", name: "8x", description: "8x resolution", multiplier: 8 },
  { id: "16x", name: "16x", description: "Maximum quality", multiplier: 16 }
];

const upscaleTypes = [
  { id: "photo", name: "Photo", description: "Real photos and images", icon: "📸" },
  { id: "art", name: "Digital Art", description: "Illustrations and artwork", icon: "🎨" },
  { id: "anime", name: "Anime", description: "Anime and manga style", icon: "🎌" },
  { id: "general", name: "General", description: "All-purpose upscaling", icon: "🔧" }
];

export default function UpscalePage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [selectedFactor, setSelectedFactor] = useState(upscaleFactors[1]);
  const [selectedType, setSelectedType] = useState(upscaleTypes[0]);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [upscaledImage, setUpscaledImage] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number} | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
        };
        img.src = e.target?.result as string;
        setOriginalImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpscale = () => {
    setIsUpscaling(true);
    setTimeout(() => {
      setUpscaledImage(`https://picsum.photos/seed/${Date.now()}/1200/900`);
      setIsUpscaling(false);
    }, 4000);
  };

  const getNewDimensions = () => {
    if (!originalDimensions) return null;
    return {
      width: originalDimensions.width * selectedFactor.multiplier,
      height: originalDimensions.height * selectedFactor.multiplier
    };
  };

  return (
    <div className="min-h-screen bg-white">
      <SessionBar 
        featureType="image upscaling"
        onSessionSelect={(sessionId) => console.log('Selected session:', sessionId)}
        onNewSession={() => console.log('New session created')}
      />
      
      <div className="pl-20 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-6xl">
          
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Maximize2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">Image Upscaler</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Enhance image resolution and quality using AI. Upscale your images up to 16x while preserving and enhancing details.
            </p>
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
                        onChange={handleImageUpload}
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
                {originalDimensions && (
                  <div className="text-center mt-2 text-sm text-gray-600">
                    {originalDimensions.width} × {originalDimensions.height}
                  </div>
                )}
              </div>
            </div>

            {/* Middle - Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">Upscaling Settings</h3>
              
              <div className="bg-gray-50 p-4 rounded-2xl space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upscale Factor
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {upscaleFactors.map((factor) => (
                      <button
                        key={factor.id}
                        onClick={() => setSelectedFactor(factor)}
                        className={`p-3 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                          selectedFactor.id === factor.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="font-bold text-lg">{factor.name}</div>
                        <div className="text-xs text-gray-600">{factor.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {upscaleTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedType(type)}
                        className={`p-3 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                          selectedType.id === type.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="text-lg mb-1">{type.icon}</div>
                        <div className="font-medium text-xs">{type.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {originalDimensions && (
                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <div className="text-sm text-gray-600 mb-1">Output Resolution</div>
                    <div className="font-bold">
                      {getNewDimensions()?.width} × {getNewDimensions()?.height}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Result */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center">Upscaled Result</h3>
              <div className="bg-gray-50 p-4 rounded-2xl">
                <div className="w-full h-64 bg-white rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 overflow-hidden">
                  {isUpscaling ? (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Upscaling {selectedFactor.name}...</span>
                    </div>
                  ) : upscaledImage ? (
                    <div className="relative w-full h-full">
                      <img src={upscaledImage} alt="Upscaled" className="w-full h-full object-cover rounded-xl" />
                      <button className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <ImageIcon className="w-6 h-6 text-gray-500" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">Upscaled image</span>
                    </div>
                  )}
                </div>
                {upscaledImage && getNewDimensions() && (
                  <div className="text-center mt-2 text-sm text-gray-600">
                    {getNewDimensions()?.width} × {getNewDimensions()?.height}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upscale Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleUpscale}
              disabled={!originalImage || isUpscaling}
              className="flex items-center gap-2 px-8 py-4 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-5 h-5" />
              {isUpscaling ? 'Upscaling...' : 'Upscale Image'}
            </button>
          </div>
        </div>
        
        {/* Features Section - Shows when user scrolls and no content generated */}
        <ScrollFeatures featureType="upscale" />
      </div>
    </div>
  );
} 