"use client";

import { useState } from "react";
import { SessionBar } from "@/components/SessionBar";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import {
  Upload,
  Wand2,
  Sparkles,
  Image as ImageIcon,
  Play,
  Download,
  Brain,
  Clock
} from "lucide-react";
import { useFeatureRun } from "@/lib/hooks/useFeatureRun";

const trainingTypes = [
  { id: "style", name: "Style", description: "Art style or aesthetic", icon: "🎨" },
  { id: "product", name: "Product", description: "Physical objects", icon: "📦" },
  { id: "character", name: "Character", description: "People or characters", icon: "👤" },
  { id: "concept", name: "Concept", description: "Abstract concepts", icon: "💡" }
];

const trainingStages = [
  { stage: "Upload", description: "Upload 5-20 images", active: true },
  { stage: "Process", description: "AI analyzes patterns", active: false },
  { stage: "Train", description: "Model learns features", active: false },
  { stage: "Test", description: "Generate test images", active: false }
];

export default function TrainPage() {
  const [selectedType, setSelectedType] = useState(trainingTypes[0]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [trainingName, setTrainingName] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [testPrompt, setTestPrompt] = useState("");
  const [generatedTest, setGeneratedTest] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const featureRun = useFeatureRun("train");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImages(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleStartTraining = async () => {
    setErrorMsg(null);
    if (imageFiles.length < 5) { setErrorMsg("Upload at least 5 images for training"); return; }
    if (!trainingName.trim()) { setErrorMsg("Give your model a trigger word"); return; }
    setIsTraining(true);
    setCurrentStage(1);
    try {
      const result = await featureRun.run({
        imagesUrl: imageFiles,
        triggerWord: trainingName.trim(),
        steps: 1000,
      });
      setCurrentStage(3);
      if (result?.errorMessage) setErrorMsg(result.errorMessage);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed");
    } finally {
      setIsTraining(false);
    }
  };

  const handleGenerateTest = () => {
    setGeneratedTest(`https://picsum.photos/seed/${Date.now()}/400/400`);
  };

  return (
    <div className="min-h-screen bg-white">
      <SessionBar 
        featureType="training"
        onSessionSelect={(sessionId) => console.log('Selected session:', sessionId)}
        onNewSession={() => console.log('New session created')}
      />
      
      <div className="pl-20 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-6xl">
          
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">Train</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Teach Vidy.ai to replicate your style, products, or characters. Upload sample images and create a custom AI model trained on your content.
            </p>
          </div>

          {/* Training Setup */}
          <div className="grid grid-cols-2 gap-16 mb-16">
            
            {/* Left - Setup */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Name
                </label>
                <input
                  type="text"
                  value={trainingName}
                  onChange={(e) => setTrainingName(e.target.value)}
                  placeholder="My Custom Style"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {trainingTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`p-4 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                        selectedType.id === type.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-600">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Training Images ({uploadedImages.length}/20)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="training-images"
                />
                <label
                  htmlFor="training-images"
                  className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-pink-500 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-sm text-gray-500">Upload 5-20 high quality images</span>
                  </div>
                </label>
              </div>

              {/* Uploaded Images Grid */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Upload ${index + 1}`} className="w-full h-16 object-cover rounded-lg" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right - Training Progress */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-lg font-semibold mb-4">Training Progress</h3>
                <div className="space-y-4">
                  {trainingStages.map((stage, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index <= currentStage ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {index < currentStage ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{stage.stage}</div>
                        <div className="text-sm text-gray-600">{stage.description}</div>
                      </div>
                      {index === currentStage && isTraining && (
                        <div className="w-4 h-4 bg-pink-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>

                {uploadedImages.length >= 5 && !isTraining && currentStage === 0 && (
                  <button
                    onClick={handleStartTraining}
                    disabled={!trainingName.trim()}
                    className="w-full mt-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Training
                  </button>
                )}

                {currentStage === 3 && !isTraining && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="text-green-700 font-medium">✓ Training Complete!</div>
                    <div className="text-green-600 text-sm">Your model is ready to use</div>
                  </div>
                )}
              </div>

              {/* Test Generation */}
              {currentStage === 3 && !isTraining && (
                <div className="bg-gray-50 p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-4">Test Your Model</h3>
                  <div className="space-y-4">
                    <textarea
                      value={testPrompt}
                      onChange={(e) => setTestPrompt(e.target.value)}
                      placeholder={`A ${selectedType.name.toLowerCase()} in the style of ${trainingName}...`}
                      className="w-full h-20 p-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-pink-500"
                    />
                    <button
                      onClick={handleGenerateTest}
                      disabled={!testPrompt.trim()}
                      className="w-full py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50"
                    >
                      Generate Test
                    </button>
                    {generatedTest && (
                      <div className="mt-4">
                        <img src={generatedTest} alt="Test generation" className="w-full h-32 object-cover rounded-xl" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Features Section - Shows when user scrolls and no content generated */}
        <ScrollFeatures featureType="train" />
      </div>
    </div>
  );
} 