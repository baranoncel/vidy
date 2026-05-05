"use client";


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/ui/video-player";
import ClaudeChatInput from "@/components/ui/claude-style-ai-input";
import { 
  Video, 
  Image, 
  Sparkles, 
  MoreHorizontal, 
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  RefreshCw,
  ChevronDown,
  Volume2,
  Download,
  Share2,
  Repeat,
  Wand2,
  Bot,
  MessageSquare,
  Brain,
  Zap,
  Settings,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

// Workflow system interfaces
interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  feature: string; // Which Vidy feature to use
  featureIcon: string;
  estimatedDuration: string; // e.g., "2 min"
  estimatedCost: number; // in credits
  status: "pending" | "processing" | "completed" | "failed";
  inputFiles?: string[]; // file URLs this step needs
  outputFiles?: string[]; // file URLs this step produces
  parameters?: Record<string, any>;
  progress?: number;
  result?: any;
  errorMessage?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  totalEstimatedCost: number;
  totalEstimatedDuration: string;
  status: "planning" | "pending-approval" | "approved" | "executing" | "completed" | "failed";
  uploadedFiles: UploadedFile[];
  currentStepIndex?: number;
  progress?: number;
  createdAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string; // MIME type
  size: number;
  url: string; // Signed URL
  uploadPath: string; // Supabase storage path
  uploadedAt: Date;
  metadata?: {
    duration?: string;
    resolution?: string;
    aspectRatio?: string;
  };
}

// Available features for workflow steps
const workflowFeatures = {
  "generate": { name: "Generate Video", icon: "🎬", baseCredits: 15, link: "/generate" },
  "edit": { name: "Edit Video", icon: "✂️", baseCredits: 10, link: "/edit" },
  "enhance": { name: "Enhance Video", icon: "✨", baseCredits: 12, link: "/enhance" },
  "upscale": { name: "Upscale Video", icon: "📈", baseCredits: 8, link: "/upscale" },
  "style": { name: "Style Transfer", icon: "🎨", baseCredits: 14, link: "/style" },
  "tts": { name: "Text to Speech", icon: "🗣️", baseCredits: 5, link: "/tts" },
  "dubbing": { name: "Voice Dubbing", icon: "🎙️", baseCredits: 18, link: "/dubbing" },
  "lipsync": { name: "Lip Sync", icon: "👄", baseCredits: 16, link: "/lipsync" },
  "effects": { name: "Add Effects", icon: "⚡", baseCredits: 9, link: "/effects" },
  "3d": { name: "3D Generation", icon: "🧊", baseCredits: 20, link: "/3d" },
  "captions": { name: "Generate Captions", icon: "📝", baseCredits: 4, link: "/captions" },
  "clips": { name: "Smart Clips", icon: "✂️", baseCredits: 7, link: "/clips" },
  "analytics": { name: "Video Analytics", icon: "📊", baseCredits: 3, link: "/analytics" },
  "ugc-video": { name: "UGC Video", icon: "👥", baseCredits: 11, link: "/ugc-video" }
};

interface AgentSession {
  id: string;
  name: string; // AI-generated, user-editable name
  prompt: string;
  status: "processing" | "completed" | "failed";
  createdAt: Date;
  result?: {
    type: "video" | "text" | "analysis";
    content: string;
    thumbnail?: string;
    videoUrl?: string;
    metadata?: any;
  };
  progress?: number;
  progressMessage?: string;
  agentType?: string;
  // Workflow support
  workflow?: Workflow;
  hasWorkflow?: boolean;
  uploadedFiles?: UploadedFile[];
}

// Available agent types (models)
const agentTypes = [
  { 
    value: "video-creator", 
    label: "Video Creator",
    description: "Create videos from prompts and ideas",
    icon: "🎬",
    time: "2 min.",
    features: ["Text to Video", "Image to Video", "Style Transfer"],
    credits: 15
  },
  { 
    value: "video-editor", 
    label: "Video Editor",
    description: "Edit, enhance and transform existing videos",
    icon: "✂️",
    time: "1 min.",
    features: ["Cut & Trim", "Add Effects", "Remove Objects"],
    credits: 10
  },
  { 
    value: "video-analyzer", 
    label: "Video Analyzer",
    description: "Analyze video content and extract insights",
    icon: "🧠",
    time: "30 sec.",
    features: ["Content Analysis", "Scene Detection", "Metadata Extraction"],
    credits: 5
  },
  { 
    value: "multi-agent", 
    label: "Multi-Agent",
    description: "Complex tasks using multiple specialized agents",
    icon: "🤖",
    time: "3 min.",
    features: ["End-to-End Workflows", "Smart Routing", "Task Orchestration"],
    credits: 25,
    badge: "Advanced"
  },
  { 
    value: "workflow-agent", 
    label: "Workflow Agent",
    description: "Plan and execute multi-step workflows with file uploads",
    icon: "⚙️",
    time: "5-15 min.",
    features: ["File Upload", "Step Planning", "Cost Estimation", "Workflow Execution"],
    credits: 0, // Variable based on workflow
    badge: "New"
  }
];

// Generate AI-style names for agent sessions
const generateAgentSessionName = (prompt: string, agentType: string): string => {
  const words = prompt.toLowerCase().split(' ').slice(0, 3);
  const adjectives = ['Smart', 'AI', 'Advanced', 'Intelligent', 'Creative', 'Automated', 'Dynamic', 'Powerful'];
  const suffixes = ['Task', 'Job', 'Mission', 'Operation', 'Analysis', 'Creation', 'Process'];
  
  // Try to extract key content words
  const contentWords = words.filter(word => 
    !['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'create', 'make', 'generate'].includes(word)
  );
  
  if (contentWords.length > 0) {
    const mainWord = contentWords[0].charAt(0).toUpperCase() + contentWords[0].slice(1);
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    // Different naming patterns for agent tasks
    const patterns = [
      `${adjective} ${mainWord}`,
      `${mainWord} ${suffix}`,
      `Agent ${mainWord}`,
      `${mainWord} Task`,
      `AI ${mainWord}`
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
  }
  
  // Fallback to agent-specific name
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${adjective} ${suffix}`;
};

// Workflow planning function - AI-powered step generation
const planWorkflow = async (prompt: string, files: UploadedFile[]): Promise<Workflow> => {
  // This would typically call an AI service to analyze the request
  // For now, we'll use a smart rule-based system to demonstrate the concept
  
  const steps: WorkflowStep[] = [];
  let totalCost = 0;
  
  // Analyze prompt for different intentions
  const lowerPrompt = prompt.toLowerCase();
  const hasImages = files.some(f => f.type.startsWith('image/'));
  const hasVideos = files.some(f => f.type.startsWith('video/'));
  const hasAudio = files.some(f => f.type.startsWith('audio/'));
  
  // UGC Video workflow example
  if (lowerPrompt.includes('ugc') || lowerPrompt.includes('user generated') || lowerPrompt.includes('testimonial')) {
    if (hasImages) {
      steps.push({
        id: '1',
        name: 'Generate UGC Video',
        description: 'Create user-generated content style video from uploaded images',
        feature: 'ugc-video',
        featureIcon: '👥',
        estimatedDuration: '3 min',
        estimatedCost: 11,
        status: 'pending',
        inputFiles: files.filter(f => f.type.startsWith('image/')).map(f => f.url),
        parameters: { style: 'authentic', format: 'testimonial' }
      });
      totalCost += 11;
    }
    
    if (lowerPrompt.includes('caption') || lowerPrompt.includes('subtitle')) {
      steps.push({
        id: '2',
        name: 'Add Captions',
        description: 'Generate automatic captions for the video',
        feature: 'captions',
        featureIcon: '📝',
        estimatedDuration: '1 min',
        estimatedCost: 4,
        status: 'pending'
      });
      totalCost += 4;
    }
  }
  
  // Image to Video workflow
  else if (hasImages && (lowerPrompt.includes('video') || lowerPrompt.includes('animate'))) {
    steps.push({
      id: '1',
      name: 'Generate Video from Images',
      description: 'Convert uploaded images into a dynamic video',
      feature: 'generate',
      featureIcon: '🎬',
      estimatedDuration: '4 min',
      estimatedCost: 15,
      status: 'pending',
      inputFiles: files.filter(f => f.type.startsWith('image/')).map(f => f.url),
      parameters: { inputType: 'images', style: 'cinematic' }
    });
    totalCost += 15;
    
    if (lowerPrompt.includes('enhance') || lowerPrompt.includes('quality')) {
      steps.push({
        id: '2',
        name: 'Enhance Video Quality',
        description: 'Improve video resolution and quality',
        feature: 'enhance',
        featureIcon: '✨',
        estimatedDuration: '2 min',
        estimatedCost: 12,
        status: 'pending'
      });
      totalCost += 12;
    }
  }
  
  // Video editing workflow
  else if (hasVideos) {
    if (lowerPrompt.includes('edit') || lowerPrompt.includes('cut') || lowerPrompt.includes('trim')) {
      steps.push({
        id: '1',
        name: 'Edit Video',
        description: 'Trim, cut, and edit uploaded video',
        feature: 'edit',
        featureIcon: '✂️',
        estimatedDuration: '2 min',
        estimatedCost: 10,
        status: 'pending',
        inputFiles: files.filter(f => f.type.startsWith('video/')).map(f => f.url)
      });
      totalCost += 10;
    }
    
    if (lowerPrompt.includes('dub') || lowerPrompt.includes('voice') || lowerPrompt.includes('language')) {
      steps.push({
        id: String(steps.length + 1),
        name: 'Voice Dubbing',
        description: 'Add professional voice dubbing to video',
        feature: 'dubbing',
        featureIcon: '🎙️',
        estimatedDuration: '3 min',
        estimatedCost: 18,
        status: 'pending'
      });
      totalCost += 18;
      
      if (lowerPrompt.includes('lip') || lowerPrompt.includes('sync')) {
        steps.push({
          id: String(steps.length + 1),
          name: 'Lip Sync',
          description: 'Synchronize lip movements with new audio',
          feature: 'lipsync',
          featureIcon: '👄',
          estimatedDuration: '2 min',
          estimatedCost: 16,
          status: 'pending'
        });
        totalCost += 16;
      }
    }
    
    if (lowerPrompt.includes('effect') || lowerPrompt.includes('filter')) {
      steps.push({
        id: String(steps.length + 1),
        name: 'Add Effects',
        description: 'Apply visual effects and filters',
        feature: 'effects',
        featureIcon: '⚡',
        estimatedDuration: '90 sec',
        estimatedCost: 9,
        status: 'pending'
      });
      totalCost += 9;
    }
  }
  
  // 3D generation workflow
  else if (lowerPrompt.includes('3d') || lowerPrompt.includes('three dimensional')) {
    steps.push({
      id: '1',
      name: 'Generate 3D Content',
      description: 'Create 3D models and animations',
      feature: '3d',
      featureIcon: '🧊',
      estimatedDuration: '5 min',
      estimatedCost: 20,
      status: 'pending',
      inputFiles: hasImages ? files.filter(f => f.type.startsWith('image/')).map(f => f.url) : undefined
    });
    totalCost += 20;
  }
  
  // Style transfer workflow
  else if (lowerPrompt.includes('style') || lowerPrompt.includes('art') || lowerPrompt.includes('painting')) {
    const targetFeature = hasVideos ? 'style' : 'generate';
    steps.push({
      id: '1',
      name: hasVideos ? 'Apply Style Transfer' : 'Generate Stylized Video',
      description: hasVideos ? 'Apply artistic style to uploaded video' : 'Create stylized video from prompt',
      feature: targetFeature,
      featureIcon: '🎨',
      estimatedDuration: '3 min',
      estimatedCost: targetFeature === 'style' ? 14 : 15,
      status: 'pending',
      inputFiles: hasVideos ? files.filter(f => f.type.startsWith('video/')).map(f => f.url) : undefined
    });
    totalCost += targetFeature === 'style' ? 14 : 15;
  }
  
  // Default workflow if no specific patterns match
  if (steps.length === 0) {
    steps.push({
      id: '1',
      name: 'Generate Video',
      description: 'Create video based on your description',
      feature: 'generate',
      featureIcon: '🎬',
      estimatedDuration: '4 min',
      estimatedCost: 15,
      status: 'pending',
      inputFiles: files.length > 0 ? files.map(f => f.url) : undefined
    });
    totalCost += 15;
  }
  
  // Add analytics step if requested
  if (lowerPrompt.includes('analyz') || lowerPrompt.includes('insight') || lowerPrompt.includes('metric')) {
    steps.push({
      id: String(steps.length + 1),
      name: 'Analyze Results',
      description: 'Generate detailed video analytics and insights',
      feature: 'analytics',
      featureIcon: '📊',
      estimatedDuration: '30 sec',
      estimatedCost: 3,
      status: 'pending'
    });
    totalCost += 3;
  }
  
  const estimatedTotalTime = calculateTotalDuration(steps.map(s => s.estimatedDuration));
  
  return {
    id: Date.now().toString(),
    name: generateWorkflowName(prompt, steps),
    description: prompt,
    steps,
    totalEstimatedCost: totalCost,
    totalEstimatedDuration: estimatedTotalTime,
    status: 'planning',
    uploadedFiles: files,
    createdAt: new Date()
  };
};

// Helper functions for workflow
const generateWorkflowName = (prompt: string, steps: WorkflowStep[]): string => {
  const mainFeatures = steps.slice(0, 2).map(s => workflowFeatures[s.feature as keyof typeof workflowFeatures]?.name).join(' + ');
  const words = prompt.split(' ').slice(0, 2);
  return `${words.join(' ')} - ${mainFeatures}`;
};

const calculateTotalDuration = (durations: string[]): string => {
  let totalMinutes = 0;
  durations.forEach(duration => {
    const match = duration.match(/(\d+(?:\.\d+)?)\s*(min|sec)/);
    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2];
      if (unit === 'min') {
        totalMinutes += value;
      } else if (unit === 'sec') {
        totalMinutes += value / 60;
      }
    }
  });
  
  if (totalMinutes < 1) {
    return `${Math.round(totalMinutes * 60)} sec`;
  } else {
    return `${Math.round(totalMinutes)} min`;
  }
};

// File upload function (following user's implementation plan)
const uploadFile = async (file: File, userId: string): Promise<UploadedFile> => {
  // This would integrate with Supabase as outlined in the user's plan
  // Real implementation would look like:
  /*
  const uuid = crypto.randomUUID();
  const fileExtension = file.name.split('.').pop();
  const filePath = `${userId}/${uuid}.${fileExtension}`;
  
  // 1. Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(filePath, file, { 
      upsert: true, 
      cacheControl: '3600', 
      contentType: file.type 
    });
  
  if (error) throw error;
  
  // 2. Create signed URL for AI services
  const { data: signedData } = await supabase.storage
    .from('videos')
    .createSignedUrl(filePath, 3600); // 1 hour
  
  // 3. Store metadata in uploads table
  const { data: uploadRecord } = await supabase
    .from('uploads')
    .insert({
      user_id: userId,
      file_path: filePath,
      media_type: file.type,
      size: file.size,
      created_at: new Date()
    });
  */
  
  // For demo purposes, we'll simulate the upload
  const uuid = crypto.randomUUID();
  const fileExtension = file.name.split('.').pop();
  const filePath = `${userId}/${uuid}.${fileExtension}`;
  
  // Simulate upload progress
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Mock signed URL (in real implementation, this would come from Supabase)
  const mockSignedUrl = `https://mock-storage.supabase.co/storage/v1/object/sign/videos/${filePath}?token=mock-token`;
  
  return {
    id: uuid,
    name: file.name,
    type: file.type,
    size: file.size,
    url: mockSignedUrl,
    uploadPath: filePath,
    uploadedAt: new Date(),
    metadata: file.type.startsWith('video/') ? {
      duration: '10s', // Would be detected during upload
      resolution: '1080p',
      aspectRatio: '16:9'
    } : undefined
  };
};

// Demo file generation for testing
const generateDemoFiles = (fileTypes: string[]): UploadedFile[] => {
  const demoFileTemplates = {
    'image': [
      { name: 'sunset-mountain.jpg', type: 'image/jpeg', size: 2.4 * 1024 * 1024, description: 'Beautiful sunset over mountains' },
      { name: 'city-skyline.jpg', type: 'image/jpeg', size: 3.1 * 1024 * 1024, description: 'Modern city skyline at night' },
      { name: 'portrait-photo.jpg', type: 'image/jpeg', size: 1.8 * 1024 * 1024, description: 'Professional portrait photo' },
      { name: 'product-shot.png', type: 'image/png', size: 4.2 * 1024 * 1024, description: 'Product photography' }
    ],
    'video': [
      { name: 'raw-footage.mp4', type: 'video/mp4', size: 45.6 * 1024 * 1024, description: 'Raw video footage', metadata: { duration: '30s', resolution: '1080p', aspectRatio: '16:9' } },
      { name: 'interview.mov', type: 'video/quicktime', size: 89.2 * 1024 * 1024, description: 'Interview recording', metadata: { duration: '2m 15s', resolution: '4K', aspectRatio: '16:9' } },
      { name: 'broll-clips.mp4', type: 'video/mp4', size: 67.8 * 1024 * 1024, description: 'B-roll footage', metadata: { duration: '1m 45s', resolution: '1080p', aspectRatio: '16:9' } }
    ],
    'audio': [
      { name: 'voiceover.mp3', type: 'audio/mpeg', size: 5.2 * 1024 * 1024, description: 'Professional voiceover' },
      { name: 'background-music.wav', type: 'audio/wav', size: 12.4 * 1024 * 1024, description: 'Background music track' }
    ]
  } as const;

  const files: UploadedFile[] = [];
  
  fileTypes.forEach(type => {
    const templates = demoFileTemplates[type as keyof typeof demoFileTemplates] || [];
    templates.forEach((template, index) => {
      if (index < 3) { // Limit to 3 files per type
        const uuid = crypto.randomUUID();
        files.push({
          id: uuid,
          name: template.name,
          type: template.type,
          size: template.size,
          url: `https://demo-storage.supabase.co/storage/v1/object/sign/videos/demo-user/${uuid}`,
          uploadPath: `demo-user/${uuid}`,
          uploadedAt: new Date(),
          metadata: 'metadata' in template ? template.metadata : (template.type.startsWith('image/') ? { aspectRatio: '16:9' } : undefined)
        });
      }
    });
  });

  return files;
};

// Demo workflow scenarios
const demoWorkflowScenarios = [
  {
    name: "UGC Video with Captions",
    prompt: "Create a UGC video using the images I uploaded with captions and testimonial style",
    fileTypes: ['image'],
    description: "Perfect for creating authentic user-generated content from product photos"
  },
  {
    name: "Video Dubbing + Lip Sync",
    prompt: "Dub this video to French with professional lip sync",
    fileTypes: ['video'],
    description: "Translate and synchronize video content for global audiences"
  },
  {
    name: "Image to Enhanced Video",
    prompt: "Turn these images into a cinematic video and enhance the quality",
    fileTypes: ['image'],
    description: "Transform static images into dynamic, high-quality video content"
  },
  {
    name: "Complex Video Pipeline",
    prompt: "Edit this video, add dubbing in Spanish, sync the lips, add effects, and generate analytics",
    fileTypes: ['video'],
    description: "Complete video processing pipeline with multiple enhancements"
  },
  {
    name: "3D Animation Creation",
    prompt: "Create 3D models from these images and generate a rotating animation video",
    fileTypes: ['image'],
    description: "Convert 2D images into immersive 3D animated content"
  },
  {
    name: "Style Transfer Workflow",
    prompt: "Apply Van Gogh painting style to this video and enhance the artistic effect",
    fileTypes: ['video'],
    description: "Transform video with artistic styles and creative effects"
  }
];

function AgentPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"agent" | "multi-agent">("agent");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string>("new-session");
  const [selectedAgentType, setSelectedAgentType] = useState("video-creator");
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [useContextMode, setUseContextMode] = useState(false);
  const [useMemoryMode, setUseMemoryMode] = useState(false);
  
  // Workflow state
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [showWorkflowApproval, setShowWorkflowApproval] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [workflowExecutionMode, setWorkflowExecutionMode] = useState(false);
  
  // Demo mode for testing
  const [demoMode, setDemoMode] = useState(true); // Enable by default for testing
  const [demoFiles, setDemoFiles] = useState<UploadedFile[]>([]);
  
  // Sessions data
  const [sessions, setSessions] = useState<AgentSession[]>([
    {
      id: "1",
      name: generateAgentSessionName("Create a cinematic video of a sunset over mountains", "video-creator"),
      prompt: "Create a cinematic video of a sunset over mountains",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
      result: {
        type: "video",
        content: "Generated a beautiful sunset video",
        thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        metadata: { 
          agentType: "video-creator",
          duration: "5s", 
          resolution: "1080p",
          credits: 15
        }
      },
      agentType: "video-creator"
    },
    {
      id: "2",
      name: generateAgentSessionName("Transform product photos into professional marketing video", "workflow-agent"),
      prompt: "Transform product photos into professional marketing video",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
      result: {
        type: "video",
        content: "Created multi-step marketing workflow",
        thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        metadata: { 
          agentType: "workflow-agent",
          workflowSteps: 4,
          totalCredits: 45,
          duration: "12s"
        }
      },
      agentType: "workflow-agent",
      hasWorkflow: true
    },
    {
      id: "3", 
      name: generateAgentSessionName("Analyze user engagement metrics from video content", "data-analyst"),
      prompt: "Analyze user engagement metrics from video content",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 35),
      result: {
        type: "analysis",
        content: "Generated comprehensive analytics report",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200",
        metadata: { 
          agentType: "data-analyst",
          insights: 12,
          charts: 5,
          credits: 8
        }
      },
      agentType: "data-analyst"
    },
    {
      id: "4",
      name: generateAgentSessionName("Create talking avatar for product demonstration", "avatar-creator"), 
      prompt: "Create talking avatar for product demonstration",
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 50),
      result: {
        type: "video",
        content: "Generated realistic talking avatar",
        thumbnail: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200",
        videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
        metadata: { 
          agentType: "avatar-creator",
          duration: "8s",
          voiceCloned: true,
          credits: 22
        }
      },
      agentType: "avatar-creator"
    },
    {
      id: "5",
      name: generateAgentSessionName("Optimize video content for social media platforms", "content-optimizer"),
      prompt: "Optimize video content for social media platforms", 
      status: "completed",
      createdAt: new Date(Date.now() - 1000 * 60 * 70),
      result: {
        type: "video",
        content: "Created platform-specific optimized versions",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200",
        videoUrl: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4",
        metadata: { 
          agentType: "content-optimizer",
          platforms: ["Instagram", "TikTok", "YouTube"],
          versions: 3,
          credits: 18
        }
      },
      agentType: "content-optimizer"
    }
  ]);

  // Check for initial prompt from home page
  useEffect(() => {
    const initialPrompt = searchParams.get('prompt');
    const initialFiles = searchParams.get('files');
    
    if (initialPrompt) {
      setPrompt(initialPrompt);
      // Auto-start processing if there's an initial prompt
      handleProcess(initialPrompt, JSON.parse(initialFiles || '[]'));
      
      // Clean up URL
      router.replace('/agent');
    }
  }, [searchParams, router]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const currentSessionResults = sessions.filter(s => 
    s.status === "completed" && s.id.startsWith(activeSessionId)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Show results when user explicitly selects a session, otherwise show new session screen
  const hasResultsInSession = activeSession && sessions.some(s => s.id === activeSessionId && s.status === "completed");

  const handleProcess = async (promptText?: string, files?: any[]) => {
    const finalPrompt = promptText || prompt.trim();
    if (!finalPrompt) return;
    
    const newSession: AgentSession = {
      id: Date.now().toString(),
      name: generateAgentSessionName(finalPrompt, selectedAgentType),
      prompt: finalPrompt,
      status: "processing",
      createdAt: new Date(),
      progress: 0,
      progressMessage: "AI Agent is analyzing your request...",
      agentType: selectedAgentType
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsProcessing(true);
    
    // Simulate agent processing with realistic stages
    const stages = [
      { progress: 20, message: "Understanding your request..." },
      { progress: 40, message: "Selecting optimal approach..." },
      { progress: 60, message: "Processing with AI models..." },
      { progress: 80, message: "Generating final result..." },
      { progress: 100, message: "Complete!" }
    ];
    
    for (const stage of stages) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSessions(prev => prev.map(s => 
        s.id === newSession.id 
          ? { ...s, progress: stage.progress, progressMessage: stage.message }
          : s
      ));
    }
    
    // Complete the session
    setTimeout(() => {
      setSessions(prev => prev.map(s => 
        s.id === newSession.id 
          ? { 
              ...s, 
              status: "completed",
              result: {
                type: "video",
                content: `Successfully processed: ${finalPrompt}`,
                thumbnail: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&h=200",
                videoUrl: "https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4",
                metadata: { 
                  agentType: selectedAgentType,
                  duration: "5s", 
                  resolution: "1080p",
                  credits: agentTypes.find(a => a.value === selectedAgentType)?.credits || 10
                }
              }
            }
          : s
      ));
      setIsProcessing(false);
      if (!promptText) setPrompt(""); // Only clear if not from URL
    }, 500);
  };

  const handleSendMessage = (message: string, files: any[], pastedContent: any[]) => {
    setPrompt(message);
    setTimeout(() => {
      if (message.trim()) {
        if (selectedAgentType === 'workflow-agent') {
          handleWorkflowCreation(message, files);
        } else {
          handleProcess();
        }
      }
    }, 100);
  };

  const handleWorkflowCreation = async (message: string, files: any[]) => {
    setIsUploadingFiles(true);
    
    try {
      let uploadedFileResults: UploadedFile[];
      
      if (demoMode && files.length === 0) {
        // In demo mode, auto-generate appropriate files based on the prompt
        const promptLower = message.toLowerCase();
        let fileTypes: string[] = [];
        
        if (promptLower.includes('image') || promptLower.includes('photo') || promptLower.includes('picture')) {
          fileTypes.push('image');
        }
        if (promptLower.includes('video') || promptLower.includes('footage') || promptLower.includes('clip')) {
          fileTypes.push('video');
        }
        if (promptLower.includes('audio') || promptLower.includes('voice') || promptLower.includes('sound')) {
          fileTypes.push('audio');
        }
        
        // Default to images if no specific type mentioned
        if (fileTypes.length === 0) {
          fileTypes = ['image'];
        }
        
        uploadedFileResults = generateDemoFiles(fileTypes);
        setDemoFiles(uploadedFileResults);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else if (demoMode && files.length > 0) {
        // Use provided files but simulate upload
        const uploadPromises = files.map(file => uploadFile(file, 'demo-user-id'));
        uploadedFileResults = await Promise.all(uploadPromises);
      } else {
        // Real upload mode
        const uploadPromises = files.map(file => uploadFile(file, 'demo-user-id'));
        uploadedFileResults = await Promise.all(uploadPromises);
      }
      
      setUploadedFiles(uploadedFileResults);
      
      // Plan workflow
      const workflow = await planWorkflow(message, uploadedFileResults);
      setCurrentWorkflow(workflow);
      setShowWorkflowApproval(true);
      
    } catch (error) {
      console.error('Error creating workflow:', error);
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleApproveWorkflow = async () => {
    if (!currentWorkflow) return;
    
    setShowWorkflowApproval(false);
    setWorkflowExecutionMode(true);
    
    // Create session with workflow
    const newSession: AgentSession = {
      id: Date.now().toString(),
      name: currentWorkflow.name,
      prompt: currentWorkflow.description,
      status: "processing",
      createdAt: new Date(),
      hasWorkflow: true,
      workflow: { ...currentWorkflow, status: 'executing' },
      uploadedFiles: currentWorkflow.uploadedFiles,
      agentType: 'workflow-agent'
    };
    
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
    
    // Start executing workflow steps
    executeWorkflow(newSession.id, currentWorkflow);
  };

  const executeWorkflow = async (sessionId: string, workflow: Workflow) => {
    let updatedWorkflow = { ...workflow };
    
    for (let i = 0; i < workflow.steps.length; i++) {
      // Update current step
      updatedWorkflow.currentStepIndex = i;
      updatedWorkflow.steps[i].status = 'processing';
      
      // Update session
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId 
            ? { ...session, workflow: updatedWorkflow, progressMessage: `Executing: ${workflow.steps[i].name}` }
            : session
        )
      );
      
      // Simulate step execution (in real implementation, this would call actual APIs)
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      
      // Complete step
      updatedWorkflow.steps[i].status = 'completed';
      updatedWorkflow.steps[i].result = {
        videoUrl: i === workflow.steps.length - 1 ? "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4" : undefined,
        message: `${workflow.steps[i].name} completed successfully`
      };
      
      const progress = ((i + 1) / workflow.steps.length) * 100;
      updatedWorkflow.progress = progress;
    }
    
    // Complete workflow
    updatedWorkflow.status = 'completed';
    updatedWorkflow.completedAt = new Date();
    
    // Update final session
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === sessionId 
          ? { 
              ...session, 
              status: 'completed',
              workflow: updatedWorkflow,
              result: {
                type: 'video',
                content: 'Workflow completed successfully',
                videoUrl: "https://videos.pexels.com/video-files/4827/4827-uhd_3840_2160_25fps.mp4",
                thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200",
                metadata: { 
                  workflowSteps: updatedWorkflow.steps.length,
                  totalCredits: updatedWorkflow.totalEstimatedCost,
                  duration: updatedWorkflow.totalEstimatedDuration
                }
              }
            }
          : session
      )
    );
    
    setWorkflowExecutionMode(false);
    setCurrentWorkflow(null);
  };

  const handleNewSession = () => {
    setActiveSessionId("new-session");
    setPrompt("");
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
  };

  const handleReuseParameters = (session: AgentSession) => {
    setPrompt(session.prompt);
    setSelectedAgentType(session.agentType || "video-creator");
  };

  // Workflow UI Components
  const WorkflowApprovalModal = () => {
    if (!showWorkflowApproval || !currentWorkflow) return null;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Workflow Plan</h2>
            <button 
              onClick={() => setShowWorkflowApproval(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-base font-medium text-gray-900 mb-2">{currentWorkflow.name}</h3>
            <p className="text-sm text-gray-600">{currentWorkflow.description}</p>
          </div>

          {/* Uploaded Files */}
          {currentWorkflow.uploadedFiles.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {currentWorkflow.uploadedFiles.map((file) => (
                  <div key={file.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="text-xs font-medium text-gray-900 truncate">{file.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workflow Steps */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Workflow Steps</h4>
            <div className="space-y-3">
              {currentWorkflow.steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{step.featureIcon}</span>
                      <h5 className="text-sm font-medium text-gray-900">{step.name}</h5>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {workflowFeatures[step.feature as keyof typeof workflowFeatures]?.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {step.estimatedDuration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {step.estimatedCost} credits
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Total Estimated Cost</h4>
                <p className="text-xs text-gray-600">Estimated completion time: {currentWorkflow.totalEstimatedDuration}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold text-gray-900">{currentWorkflow.totalEstimatedCost}</div>
                <div className="text-xs text-gray-500">credits</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleApproveWorkflow}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Execute Workflow
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowWorkflowApproval(false)}
              className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const WorkflowExecutionDisplay = ({ session }: { session: AgentSession }) => {
    if (!session.workflow || !session.hasWorkflow) return null;

    const workflow = session.workflow;
    const currentStepIndex = workflow.currentStepIndex ?? 0;
    const currentStep = workflow.steps[currentStepIndex];

    return (
      <div className="space-y-4">
        {/* Progress Header */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Executing Workflow</h3>
            <span className="text-xs text-gray-600">
              Step {currentStepIndex + 1} of {workflow.steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gray-900 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${workflow.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Current Step */}
        {workflow.status === 'executing' && currentStep && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-4 w-4 text-gray-600 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900">{currentStep.name}</h4>
                <p className="text-xs text-gray-600">{currentStep.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Completed Steps */}
        <div className="space-y-2">
          {workflow.steps.map((step, index) => {
            if (step.status === 'pending') return null;
            
            return (
              <div key={step.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                    step.status === 'completed' ? "bg-gray-100 text-gray-600" :
                    step.status === 'processing' ? "bg-gray-100 text-gray-600" :
                    step.status === 'failed' ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                  )}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : step.status === 'processing' ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : step.status === 'failed' ? (
                      <XCircle className="h-3 w-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{step.featureIcon}</span>
                      <h5 className="text-sm font-medium text-gray-900">{step.name}</h5>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded",
                        step.status === 'completed' ? "bg-gray-100 text-gray-600" :
                        step.status === 'processing' ? "bg-gray-100 text-gray-600" :
                        step.status === 'failed' ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-600"
                      )}>
                        {step.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                    {step.result?.message && (
                      <p className="text-xs text-gray-600 mt-1">{step.result.message}</p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.estimatedCost} credits
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Result */}
        {workflow.status === 'completed' && session.result?.videoUrl && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Final Result</h4>
            <VideoPlayer src={session.result.videoUrl} />
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white">
        {/* Left Sidebar - Sessions */}
        <div className="fixed left-0 top-1/2 -translate-y-1/2 w-16 bg-gray-50 border border-gray-100 rounded-r-xl shadow-lg z-50 flex flex-col max-h-[80vh]">
          <div className="p-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={handleNewSession}
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-white text-gray-900 border-gray-200 shadow-lg">
                <p>New Agent Session</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {sessions.map((session) => (
              <div key={session.id} className="relative group">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setActiveSessionId(session.id)}
                      className={cn(
                        "w-full h-12 rounded-lg overflow-hidden relative transition-all",
                        activeSessionId === session.id 
                          ? "ring-2 ring-blue-500" 
                          : "hover:ring-2 hover:ring-gray-300"
                      )}
                    >
                      {session.result?.thumbnail ? (
                        <img
                          src={session.result.thumbnail}
                          alt={session.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status indicator */}
                      <div className="absolute top-1 right-1">
                        {session.status === "processing" && (
                          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                        )}
                        {session.status === "completed" && (
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        )}
                        {session.status === "failed" && (
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                        )}
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-white text-gray-900 border-gray-200 shadow-lg">
                    <p className="font-medium">{session.name}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>

      {/* Main Content */}
      <div className="pl-20">
        {isProcessing ? (
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                {selectedAgentType === 'workflow-agent' ? 'Planning Workflow...' : 'AI Agent Processing...'}
              </h2>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              {selectedAgentType === 'workflow-agent' && (
                <p className="text-sm text-gray-600 mt-2">
                  Analyzing your request and uploaded files to create the optimal workflow
                </p>
              )}
            </div>
          </div>
        ) : hasResultsInSession ? (
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto pb-64">
              <div className="max-w-4xl mx-auto px-4 py-8">
                {currentSessionResults.map((result) => (
                  <div key={result.id} className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Bot className="h-4 w-4" />
                      <span>{result.prompt}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                        {agentTypes.find(a => a.value === result.agentType)?.label || 'Agent'}
                      </span>
                      {result.hasWorkflow && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          Workflow
                        </span>
                      )}
                    </div>
                    
                    {/* Show workflow execution if it's a workflow session */}
                    {result.hasWorkflow ? (
                      <WorkflowExecutionDisplay session={result} />
                    ) : (
                      <>
                        {result.result?.videoUrl && (
                          <VideoPlayer src={result.result.videoUrl} />
                        )}
                        
                        <div className="flex items-center gap-3 mt-4">
                          <button 
                            onClick={() => handleReuseParameters(result)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <RefreshCw className="h-4 w-4" />
                            <span>Reuse parameters</span>
                          </button>
                          
                          <button 
                            onClick={() => handleCopyPrompt(result.prompt)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Copy prompt</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom prompt section - sticky */}
            <div className="fixed bottom-0 left-20 right-0 z-50 py-8">
              <div className="max-w-2xl mx-auto px-4">
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder={`Describe what you want the AI agent to do...`}
                  models={agentTypes.map(agent => ({
                    id: agent.value,
                    name: agent.label,
                    description: agent.description,
                    badge: agent.badge
                  }))}
                  defaultModel={selectedAgentType}
                  onModelChange={setSelectedAgentType}
                />
              </div>

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-6">
                <button 
                  onClick={() => setUseContextMode(!useContextMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useContextMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Context mode</span>
                </button>
                
                <button 
                  onClick={() => setUseMemoryMode(!useMemoryMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useMemoryMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Memory mode</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Original centered layout when no results */
          <div className="max-w-4xl mx-auto px-4 py-16">
            {/* Tab Navigation */}
            <div className="flex justify-center gap-8 mb-12">
              <button
                onClick={() => setActiveTab("agent")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "agent" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "agent" ? "bg-blue-500" : "bg-gray-100"
                )}>
                  <Bot className={cn(
                    "h-6 w-6",
                    activeTab === "agent" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>AI Agent</span>
              </button>
              
              <button
                onClick={() => setActiveTab("multi-agent")}
                className={cn(
                  "flex items-center gap-3 text-lg font-medium transition-all",
                  activeTab === "multi-agent" 
                    ? "text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-lg transition-all",
                  activeTab === "multi-agent" ? "bg-blue-500" : "bg-gray-100"
                )}>
                  <Sparkles className={cn(
                    "h-6 w-6",
                    activeTab === "multi-agent" ? "text-white" : "text-gray-500"
                  )} />
                </div>
                <span>Multi-Agent</span>
              </button>
            </div>

            <div className="text-center">
              {/* Claude-style AI Input */}
              <div className="max-w-2xl mx-auto">
                <ClaudeChatInput 
                  onSendMessage={handleSendMessage}
                  placeholder={`Describe what you want the AI agent to do...`}
                  models={agentTypes.map(agent => ({
                    id: agent.value,
                    name: agent.label,
                    description: agent.description,
                    badge: agent.badge
                  }))}
                  defaultModel={selectedAgentType}
                  onModelChange={setSelectedAgentType}
                />
              </div>

              {/* Demo Scenarios for Workflow Agent */}
              {selectedAgentType === 'workflow-agent' && demoMode && (
                <div className="mt-12 max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-base font-medium text-gray-900 mb-2">Demo Workflow Scenarios</h3>
                    <p className="text-sm text-gray-600">Click any scenario below to test the workflow system</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demoWorkflowScenarios.map((scenario, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setPrompt(scenario.prompt);
                          handleWorkflowCreation(scenario.prompt, []);
                        }}
                        className="p-4 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-left transition-all hover:shadow-sm group"
                      >
                        <h4 className="text-sm font-medium text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                          {scenario.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                          {scenario.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <span>📁</span>
                            {scenario.fileTypes.join(', ')} files
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Auto-generate
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-700 mb-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs font-medium">Demo Mode Active</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Files will be auto-generated for testing. Toggle demo mode off to use real file uploads.
                    </p>
                  </div>
                  
                  {/* Quick Start Guide */}
                  <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                    <h4 className="text-xs font-medium text-gray-900 mb-3">Quick Start Guide</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <strong className="text-gray-900">1. Try a Demo Scenario</strong>
                        <p>Click any card above to see the workflow system in action</p>
                      </div>
                      <div>
                        <strong className="text-gray-900">2. Custom Prompts</strong>
                        <p>Type your own request in the chat input above</p>
                      </div>
                      <div>
                        <strong className="text-gray-900">3. Review Workflow</strong>
                        <p>See step-by-step plan with costs and timeline</p>
                      </div>
                      <div>
                        <strong className="text-gray-900">4. Watch Execution</strong>
                        <p>Monitor real-time progress as each step completes</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="flex items-center justify-center gap-6 mt-8">
                <button 
                  onClick={() => setUseContextMode(!useContextMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useContextMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Context mode</span>
                </button>
                
                <button 
                  onClick={() => setUseMemoryMode(!useMemoryMode)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm transition-colors",
                    useMemoryMode ? "bg-gray-900" : "bg-gray-300"
                  )}></div>
                  <span>Memory mode</span>
                </button>
                
                {/* Demo Mode Toggle for Workflow Agent */}
                {selectedAgentType === 'workflow-agent' && (
                  <button 
                    onClick={() => setDemoMode(!demoMode)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <div className={cn(
                      "w-4 h-4 rounded-sm transition-colors",
                      demoMode ? "bg-gray-900" : "bg-gray-300"
                    )}></div>
                    <span>Demo mode</span>
                  </button>
                )}
                
                {/* Agent Type Display */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Bot className="h-4 w-4" />
                  <span>{agentTypes.find(a => a.value === selectedAgentType)?.label}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Workflow Approval Modal */}
      <WorkflowApprovalModal />

      {/* File Upload Loading Overlay */}
      {isUploadingFiles && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8 max-w-md w-full mx-4 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-4 text-gray-600" />
            <h3 className="text-base font-medium text-gray-900 mb-2">
              {demoMode ? 'Generating Demo Files & Planning Workflow...' : 'Uploading Files'}
            </h3>
            <p className="text-sm text-gray-600">
              {demoMode 
                ? 'Creating realistic file examples and analyzing your request...' 
                : 'Please wait while we upload your files and plan the workflow...'
              }
            </p>
            {demoMode && (
              <div className="mt-4 text-xs text-gray-500">
                <p>Demo mode: Files auto-generated based on your request</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
} 

import { Suspense as __Sus } from "react";
export default function AgentPage() {
  return <__Sus fallback={null}><AgentPageInner /></__Sus>;
}
