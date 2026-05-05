"use client";

import { useState } from "react";
import { SessionBar } from "@/components/SessionBar";
import { ScrollFeatures } from "@/components/ui/scroll-features";
import { 
  Upload, 
  Mic, 
  Sparkles, 
  Play, 
  X, 
  Check,
  User,
  Volume2
} from "lucide-react";

interface Voice {
  name: string;
  country: string;
  accent: string;
  age: string;
  gender: string;
  style: string;
  flag: string;
}

const voices: Voice[] = [
  {
    name: "Rachel",
    country: "American",
    accent: "Calm",
    age: "Young",
    gender: "Female",
    style: "Narration",
    flag: "🇺🇸"
  },
  {
    name: "Drew",
    country: "American",
    accent: "Well-rounded",
    age: "Middle aged",
    gender: "Male",
    style: "News",
    flag: "🇺🇸"
  },
  {
    name: "Clyde",
    country: "American",
    accent: "War veteran",
    age: "Middle aged",
    gender: "Male",
    style: "Characters",
    flag: "🇺🇸"
  },
  {
    name: "Paul",
    country: "American",
    accent: "Authoritative",
    age: "Middle aged",
    gender: "Male",
    style: "News",
    flag: "🇺🇸"
  }
];

export default function LipSyncPage() {
  const [showSpeechOptions, setShowSpeechOptions] = useState(false);
  const [showFaceOptions, setShowFaceOptions] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(voices[0]);
  const [scriptText, setScriptText] = useState("");
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'face' | 'speech' | null>('face');

  const characters = [
    { id: "character1", name: "Character 1", image: "👨‍💼" },
    { id: "character2", name: "Character 2", image: "👩‍💼" },
    { id: "character3", name: "Character 3", image: "👨‍🎓" },
    { id: "character4", name: "Character 4", image: "👩‍🎓" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaceImage(e.target?.result as string);
        setShowFaceOptions(false);
        setCurrentStep('speech');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId);
    setShowFaceOptions(false);
    setCurrentStep('speech');
  };

  const handleGenerate = () => {
    setShowGenerateModal(false);
    // Handle generation logic here
    console.log("Generating with:", { selectedVoice, scriptText, faceImage, selectedCharacter });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Session Bar */}
      <SessionBar 
        featureType="lip sync"
        onSessionSelect={(sessionId) => console.log('Selected session:', sessionId)}
        onNewSession={() => console.log('New session created')}
      />
      
      {/* Main Content */}
      <div className="pl-20 flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="w-full max-w-5xl">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900">Lip sync</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
              Create realistic talking avatar videos with perfect lip-sync using AI face animation, voice synthesis, and natural speech patterns for presentations, marketing, and educational content.
            </p>
          </div>

          {/* Main Interface */}
          <div className="flex items-start justify-center gap-16">
            
            {/* Left Side - Add Face */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-50 p-6 rounded-3xl">
                <div
                  className="w-80 h-80 bg-white rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-2 border-dashed border-gray-200"
                  onClick={() => setShowFaceOptions(!showFaceOptions)}
                >
                  {faceImage ? (
                    <img src={faceImage} alt="Uploaded face" className="w-full h-full object-cover rounded-3xl" />
                  ) : selectedCharacter ? (
                    <div className="text-8xl">
                      {characters.find(c => c.id === selectedCharacter)?.image}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-gray-500" />
                      </div>
                      <span className="text-xl font-medium text-gray-600">Add face</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Step indicator */}
              {currentStep === 'face' && (
                <div className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-medium">
                  Step 1: Add face
                </div>
              )}
            </div>

            {/* Plus Icon */}
            <div className="text-gray-400 mt-40">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>

            {/* Right Side - Add Speech */}
            <div className="flex flex-col items-center">
              <div className="bg-gray-50 p-6 rounded-3xl">
                <div
                  className="w-80 h-80 bg-white rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border-2 border-dashed border-gray-200"
                  onClick={() => setShowSpeechOptions(!showSpeechOptions)}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mic className="w-8 h-8 text-gray-500" />
                    </div>
                    <span className="text-xl font-medium text-gray-600">Add speech</span>
                  </div>
                </div>
              </div>
              
              {/* Step indicator */}
              {currentStep === 'speech' && (
                <div className="mt-6 px-6 py-2 bg-black text-white rounded-full text-sm font-medium">
                  Step 2: Add speech
                </div>
              )}
            </div>

            {/* Generate Button */}
            <div className="mt-40">
              <div className="bg-gray-50 p-4 rounded-2xl">
                <button 
                  className="flex items-center gap-2 px-8 py-4 bg-white text-gray-600 rounded-xl hover:bg-gray-50 transition-colors text-lg font-medium border border-gray-200"
                  disabled={!faceImage && !selectedCharacter}
                >
                  <Sparkles className="w-5 h-5" />
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section - Shows when user scrolls and no content generated */}
        <ScrollFeatures featureType="lipsync" />
      </div>

      {/* Face Options Modal */}
      {showFaceOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Upload Photo</h3>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="face-upload"
                />
                <label
                  htmlFor="face-upload"
                  className="w-full h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors font-medium"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </label>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Character</h3>
                <div className="grid grid-cols-2 gap-3">
                  {characters.map((character) => (
                    <button
                      key={character.id}
                      onClick={() => handleCharacterSelect(character.id)}
                      className={`p-4 rounded-xl border text-center hover:bg-gray-50 transition-colors ${
                        selectedCharacter === character.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="text-3xl mb-2">{character.image}</div>
                      <div className="text-sm text-gray-600">{character.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setShowFaceOptions(false)}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Speech Options Modal */}
      {showSpeechOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowSpeechOptions(false);
                  setShowGenerateModal(true);
                }}
                className="w-full h-16 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-3 hover:bg-blue-600 transition-colors"
              >
                <Sparkles className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Generate</div>
                  <div className="text-sm opacity-90">Write and generate speech</div>
                </div>
              </button>

              <button className="w-full h-16 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-3 hover:bg-blue-600 transition-colors">
                <Upload className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Upload</div>
                  <div className="text-sm opacity-90">Upload an audio file</div>
                </div>
              </button>

              <button className="w-full h-16 bg-blue-500 text-white rounded-xl flex items-center justify-center space-x-3 hover:bg-blue-600 transition-colors">
                <Mic className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-semibold">Record</div>
                  <div className="text-sm opacity-90">Record your voice</div>
                </div>
              </button>
              
              <button
                onClick={() => setShowSpeechOptions(false)}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            
            {/* Step 1: Script Input */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">1. Type what you want your character to say</h3>
              <div className="relative">
                <textarea
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  placeholder="Write what you want your character to say..."
                  className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500"
                />
                <button className="absolute bottom-4 right-4 w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step 2: Voice Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">2. Choose a voice</h3>
              <div className="space-y-2">
                {voices.map((voice) => (
                  <div
                    key={voice.name}
                    onClick={() => setSelectedVoice(voice)}
                    className={`p-4 rounded-xl cursor-pointer transition-colors flex items-center space-x-4 ${
                      selectedVoice?.name === voice.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <button className="w-8 h-8 bg-black bg-opacity-20 rounded-full flex items-center justify-center">
                      <Play className="w-4 h-4" />
                    </button>
                    <span className="text-lg">{voice.flag}</span>
                    <span className="font-semibold">{voice.name}</span>
                    <div className="flex space-x-3 text-sm">
                      <span>{voice.country}</span>
                      <span>{voice.accent}</span>
                      <span>{voice.age}</span>
                      <span>{voice.gender}</span>
                      <span>{voice.style}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                  <Play className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 