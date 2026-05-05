"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  SlidersHorizontal,
  ArrowUp,
  X,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  ChevronDown,
  Check,
  Loader2,
  AlertCircle,
  Copy,
  UploadCloud,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Replace Math.random with nanoid
// import { nanoid } from "nanoid";

// Types
export interface FileWithPreview {
  id: string;
  file: File;
  preview?: string;
  type: string;
  uploadStatus: "pending" | "uploading" | "complete" | "error";
  uploadProgress?: number;
  abortController?: AbortController;
  textContent?: string;
}

export interface PastedContent {
  id: string;
  content: string;
  timestamp: Date;
  wordCount: number;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

interface ChatInputProps {
  onSendMessage?: (
    message: string,
    files: FileWithPreview[],
    pastedContent: PastedContent[]
  ) => void;
  disabled?: boolean;
  placeholder?: string;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  models?: ModelOption[];
  defaultModel?: string;
  onModelChange?: (modelId: string) => void;
  fullWidth?: boolean; // Add fullWidth prop to control width
  textareaClassName?: string; // Add custom textarea styling
  buttonText?: string; // Custom button text instead of arrow
  buttonClassName?: string; // Custom button styling
  typingExamples?: string[]; // Array of example prompts for typing animation
  expandedHeight?: boolean; // Expand height by 20%
}

// Constants
const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const PASTE_THRESHOLD = 200; // characters threshold for showing as pasted content
const DEFAULT_MODELS_INTERNAL: ModelOption[] = [
  {
    id: "claude-sonnet-4",
    name: "Claude Sonnet 4",
    description: "Balanced model",
    badge: "Latest",
  },
  {
    id: "claude-opus-3.5",
    name: "Claude Opus 3.5",
    description: "Highest intelligence",
  },
  {
    id: "claude-haiku-3",
    name: "Claude Haiku 3",
    description: "Fastest responses",
  },
];

// File type helpers
const getFileIcon = (type: string) => {
  if (type.startsWith("image/"))
    return <ImageIcon className="h-5 w-5 text-zinc-400" />;
  if (type.startsWith("video/"))
    return <Video className="h-5 w-5 text-zinc-400" />;
  if (type.startsWith("audio/"))
    return <Music className="h-5 w-5 text-zinc-400" />;
  if (type.includes("zip") || type.includes("rar") || type.includes("tar"))
    return <Archive className="h-5 w-5 text-zinc-400" />;
  return <FileText className="h-5 w-5 text-zinc-400" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

const getFileTypeLabel = (type: string): string => {
  const parts = type.split("/");
  let label = parts[parts.length - 1].toUpperCase();
  if (label.length > 7 && label.includes("-")) {
    // e.g. VND.OPENXMLFORMATS-OFFICEDOCUMENT...
    label = label.substring(0, label.indexOf("-"));
  }
  if (label.length > 10) {
    label = label.substring(0, 10) + "...";
  }
  return label;
};

// Helper function to check if a file is textual
const isTextualFile = (file: File): boolean => {
  const textualTypes = [
    "text/",
    "application/json",
    "application/xml",
    "application/javascript",
    "application/typescript",
  ];

  const textualExtensions = [
    "txt",
    "md",
    "py",
    "js",
    "ts",
    "jsx",
    "tsx",
    "html",
    "htm",
    "css",
    "scss",
    "sass",
    "json",
    "xml",
    "yaml",
    "yml",
    "csv",
    "sql",
    "sh",
    "bash",
    "php",
    "rb",
    "go",
    "java",
    "c",
    "cpp",
    "h",
    "hpp",
    "cs",
    "rs",
    "swift",
    "kt",
    "scala",
    "r",
    "vue",
    "svelte",
    "astro",
    "config",
    "conf",
    "ini",
    "toml",
    "log",
    "gitignore",
    "dockerfile",
    "makefile",
    "readme",
  ];

  // Check MIME type
  const isTextualMimeType = textualTypes.some((type) =>
    file.type.toLowerCase().startsWith(type)
  );

  // Check file extension
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  const isTextualExtension =
    textualExtensions.includes(extension) ||
    file.name.toLowerCase().includes("readme") ||
    file.name.toLowerCase().includes("dockerfile") ||
    file.name.toLowerCase().includes("makefile");

  return isTextualMimeType || isTextualExtension;
};

// Helper function to read file content as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// Helper function to get file extension for badge
const getFileExtension = (filename: string): string => {
  const extension = filename.split(".").pop()?.toUpperCase() || "FILE";
  return extension.length > 8 ? extension.substring(0, 8) + "..." : extension;
};

// Textual File Preview Component
const TextualFilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewText = file.textContent?.slice(0, 150) || "";
  const needsTruncation = (file.textContent?.length || 0) > 150;
  const fileExtension = getFileExtension(file.file.name);

  return (
    <div className="bg-white border border-gray-300 relative rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden">
      <div className="text-[8px] text-gray-700 whitespace-pre-wrap break-words max-h-24 overflow-y-auto custom-scrollbar">
        {file.textContent ? (
          <>
            {isExpanded || !needsTruncation ? file.textContent : previewText}
            {!isExpanded && needsTruncation && "..."}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      {/* OVERLAY */}
      <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-gray-200 from-transparent overflow-hidden">
        <p className="capitalize text-gray-800 text-xs bg-white border border-gray-300 px-2 py-1 rounded-md">
          {fileExtension}
        </p>
        {/* Upload status indicator */}
        {file.uploadStatus === "uploading" && (
          <div className="absolute top-2 left-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
          </div>
        )}
        {file.uploadStatus === "error" && (
          <div className="absolute top-2 left-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-600" />
          </div>
        )}
        {/* Actions */}
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
          {file.textContent && (
            <Button
              size="icon"
              variant="outline"
              className="size-6"
              onClick={() =>
                navigator.clipboard.writeText(file.textContent || "")
              }
              title="Copy content"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => onRemove(file.id)}
            title="Remove file"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// File Preview Component
const FilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
}> = ({ file, onRemove }) => {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isTextual = isTextualFile(file.file);

  // If it's a textual file, use the TextualFilePreviewCard
  if (isTextual) {
    return <TextualFilePreviewCard file={file} onRemove={onRemove} />;
  }

  return (
    <div
      className={cn(
        "relative group bg-white border w-fit border-gray-300 rounded-lg size-[125px] shadow-md flex-shrink-0 overflow-hidden",
        (isImage || isVideo) ? "p-0" : "p-3"
      )}
    >
      {isImage && file.preview ? (
        <div className="relative size-full overflow-hidden bg-gray-200">
          <img
            src={file.preview || "/placeholder.svg"}
            alt={file.file.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : isVideo && file.preview ? (
        <div className="relative size-full overflow-hidden bg-gray-200">
          <video
            src={file.preview}
            className="w-full h-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
            <Play className="h-6 w-6 text-white drop-shadow-md" />
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 size-[125px] overflow-hidden">
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-gray-200 from-transparent overflow-hidden">
                <p className="absolute bottom-2 left-2 capitalize text-gray-800 text-xs bg-white border border-gray-300 px-2 py-1 rounded-md">
                  {getFileTypeLabel(file.type)}
                </p>
              </div>
              {file.uploadStatus === "uploading" && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
              )}
              {file.uploadStatus === "error" && (
                <AlertCircle className="h-3.5 w-3.5 text-red-600" />
              )}
            </div>

            <p
              className="max-w-[90%] text-xs font-medium text-gray-800 truncate"
              title={file.file.name}
            >
              {file.file.name}
            </p>
            <p className="text-[10px] text-gray-600 mt-1">
              {formatFileSize(file.file.size)}
            </p>
          </div>
        </div>
      )}
      <Button
        size="icon"
        variant="outline"
        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white/90 border-gray-300"
        onClick={() => onRemove(file.id)}
      >
        <X className="h-4 w-4 text-gray-700" />
      </Button>
    </div>
  );
};

// Pasted Content Preview Component
const PastedContentCard: React.FC<{
  content: PastedContent;
  onRemove: (id: string) => void;
}> = ({ content, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewText = content.content.slice(0, 150);
  const needsTruncation = content.content.length > 150;

  return (
    <div className="bg-white border border-gray-300 relative rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden">
      <div className="text-[8px] text-gray-700 whitespace-pre-wrap break-words max-h-24 overflow-y-auto custom-scrollbar">
        {isExpanded || !needsTruncation ? content.content : previewText}
        {!isExpanded && needsTruncation && "..."}
      </div>
      {/* OVERLAY */}
      <div className="group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b to-gray-200 from-transparent overflow-hidden">
        <p className="capitalize text-gray-800 text-xs bg-white border border-gray-300 px-2 py-1 rounded-md">
          PASTED
        </p>
        {/* Actions */}
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => navigator.clipboard.writeText(content.content)}
            title="Copy content"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => onRemove(content.id)}
            title="Remove content"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Model Selector Component
//   - <= 10 models: dropdown opens BELOW the button
//   - >  10 models: opens a centered modal with search
const ModelSelectorDropdown: React.FC<{
  models: ModelOption[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}> = ({ models, selectedModel, onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectedModelData =
    models.find((m) => m.id === selectedModel) || models[0];
  const dropdownRef = useRef<HTMLDivElement>(null);
  const useModal = models.length > 10;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (useModal) return; // modal handles its own backdrop close
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [useModal]);

  const filtered = useModal
    ? models.filter((m) => {
        const q = search.toLowerCase();
        return !q || m.name.toLowerCase().includes(q) || (m.description || "").toLowerCase().includes(q);
      })
    : models;

  if (!selectedModelData) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate max-w-[150px] sm:max-w-[220px]">{selectedModelData.name}</span>
        <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      {isOpen && !useModal && (
        <div className="absolute top-full left-0 mt-2 w-80 max-w-[90vw] bg-white border border-black/10 rounded-2xl shadow-xl ring-1 ring-black/5 z-30 p-2 max-h-[60vh] overflow-y-auto">
          {models.map((model) => (
            <button
              key={model.id}
              className={cn(
                "w-full text-left p-2.5 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-between",
                model.id === selectedModel && "bg-gray-100",
              )}
              onClick={() => {
                onModelChange(model.id);
                setIsOpen(false);
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{model.name}</span>
                  {model.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-gray-900 text-white rounded uppercase tracking-wider">
                      {model.badge}
                    </span>
                  )}
                </div>
                {model.description && <p className="text-xs text-gray-600 mt-0.5 truncate">{model.description}</p>}
              </div>
              {model.id === selectedModel && <Check className="h-4 w-4 text-gray-900 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}

      {isOpen && useModal && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/95 ring-1 ring-black/5 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-black/5 flex items-center gap-3">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${models.length} models…`}
                className="flex-1 h-10 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-gray-900"
              />
              <button onClick={() => setIsOpen(false)} className="rounded-full p-1.5 hover:bg-black/5">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
              {filtered.length === 0 && (
                <p className="text-center py-8 text-sm text-gray-500">No models match &quot;{search}&quot;.</p>
              )}
              {filtered.map((model) => (
                <button
                  key={model.id}
                  className={cn(
                    "w-full text-left p-3 rounded-2xl hover:bg-gray-100 transition-colors flex items-start justify-between gap-3",
                    model.id === selectedModel && "bg-gray-100",
                  )}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-900">{model.name}</span>
                      {model.badge && (
                        <span className="px-1.5 py-0.5 text-[10px] bg-gray-900 text-white rounded uppercase tracking-wider">
                          {model.badge}
                        </span>
                      )}
                    </div>
                    {model.description && <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{model.description}</p>}
                  </div>
                  {model.id === selectedModel && <Check className="h-4 w-4 text-gray-900 flex-shrink-0 mt-1" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main ChatInput Component
const ClaudeChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "How can I help you today?",
  maxFiles = MAX_FILES,
  maxFileSize = MAX_FILE_SIZE,
  acceptedFileTypes,
  models = DEFAULT_MODELS_INTERNAL,
  defaultModel,
  onModelChange,
  fullWidth = false,
  textareaClassName,
  buttonText,
  buttonClassName,
  typingExamples,
  expandedHeight = false,
}) => {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [pastedContent, setPastedContent] = useState<PastedContent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    defaultModel || models[0]?.id || ""
  );
  const [currentTypingText, setCurrentTypingText] = useState("");
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const maxHeight =
        Number.parseInt(getComputedStyle(textareaRef.current).maxHeight, 10) ||
        120;
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
    }
  }, [message]);

  // Typing animation effect
  useEffect(() => {
    if (!typingExamples || typingExamples.length === 0 || message.trim()) {
      const id = setTimeout(() => {
        setCurrentTypingText("");
        setIsTyping(false);
      }, 0);
      return () => clearTimeout(id);
    }

    const currentExample = typingExamples[currentExampleIndex];
    let currentCharIndex = 0;
    let isCancelled = false;

    // Reset text immediately when changing examples (deferred to next tick)
    const resetId = setTimeout(() => {
      setCurrentTypingText("");
      setIsTyping(true);
    }, 0);

    const typeText = () => {
      if (isCancelled) return;
      
      // Typing forward only
      if (currentCharIndex < currentExample.length) {
        setCurrentTypingText(currentExample.slice(0, currentCharIndex + 1));
        currentCharIndex++;
        setTimeout(typeText, 50); // Fast typing speed
      } else {
        // Pause at end, then move to next example
        setTimeout(() => {
          if (!isCancelled) {
            setCurrentExampleIndex((prev) => (prev + 1) % typingExamples.length);
            setIsTyping(false);
          }
        }, 3000); // Pause for 3 seconds to read the full text
      }
    };

    const timer = setTimeout(typeText, 500); // Initial delay

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      clearTimeout(resetId);
    };
  }, [currentExampleIndex, typingExamples, message]);

  // Separate effect to handle message changes
  useEffect(() => {
    const id = setTimeout(() => {
      if (message.trim()) {
        setCurrentTypingText("");
        setIsTyping(false);
      } else if (!message.trim() && typingExamples && typingExamples.length > 0) {
        // Restart typing animation when message becomes empty
        setCurrentExampleIndex(0);
        setIsTyping(false);
      }
    }, 0);
    return () => clearTimeout(id);
  }, [message, typingExamples]);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const currentFileCount = files.length;
      if (currentFileCount >= maxFiles) {
        alert(
          `Maximum ${maxFiles} files allowed. Please remove some files to add new ones.`
        );
        return;
      }

      const availableSlots = maxFiles - currentFileCount;
      const filesToAdd = Array.from(selectedFiles).slice(0, availableSlots);

      if (selectedFiles.length > availableSlots) {
        alert(
          `You can only add ${availableSlots} more file(s). ${
            selectedFiles.length - availableSlots
          } file(s) were not added.`
        );
      }

      const newFiles = filesToAdd
        .filter((file) => {
          if (file.size > maxFileSize) {
            alert(
              `File ${file.name} (${formatFileSize(
                file.size
              )}) exceeds size limit of ${formatFileSize(maxFileSize)}.`
            );
            return false;
          }
          if (
            acceptedFileTypes &&
            !acceptedFileTypes.some(
              (type) =>
                file.type.includes(type) || type === file.name.split(".").pop()
            )
          ) {
            alert(
              `File type for ${
                file.name
              } not supported. Accepted types: ${acceptedFileTypes.join(", ")}`
            );
            return false;
          }
          return true;
        })
        .map((file) => ({
          id: Math.random().toString(),
          file,
          preview: (file.type.startsWith("image/") || file.type.startsWith("video/"))
            ? URL.createObjectURL(file)
            : undefined,
          type: file.type || "application/octet-stream",
          uploadStatus: "pending" as const,
          uploadProgress: 0,
        }));

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((fileToUpload) => {
        // Read text content for textual files
        if (isTextualFile(fileToUpload.file)) {
          readFileAsText(fileToUpload.file)
            .then((textContent) => {
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileToUpload.id ? { ...f, textContent } : f
                )
              );
            })
            .catch((error) => {
              console.error("Error reading file content:", error);
              setFiles((prev) =>
                prev.map((f) =>
                  f.id === fileToUpload.id
                    ? { ...f, textContent: "Error reading file content" }
                    : f
                )
              );
            });
        }

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileToUpload.id ? { ...f, uploadStatus: "uploading" } : f
          )
        );

        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 5; // Simulate faster upload
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileToUpload.id
                  ? { ...f, uploadStatus: "complete", uploadProgress: 100 }
                  : f
              )
            );
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileToUpload.id
                  ? { ...f, uploadProgress: progress }
                  : f
              )
            );
          }
        }, 150); // Faster interval
      });
    },
    [files.length, maxFiles, maxFileSize, acceptedFileTypes]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      // TODO: Abort upload if in progress using fileToRemove.abortController
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardData = e.clipboardData;
      const items = clipboardData.items;

      const fileItems = Array.from(items).filter(
        (item) => item.kind === "file"
      );
      if (fileItems.length > 0 && files.length < maxFiles) {
        e.preventDefault();
        const pastedFiles = fileItems
          .map((item) => item.getAsFile())
          .filter(Boolean) as File[];
        const dataTransfer = new DataTransfer();
        pastedFiles.forEach((file) => dataTransfer.items.add(file));
        handleFileSelect(dataTransfer.files);
        return;
      }

      const textData = clipboardData.getData("text");
      if (
        textData &&
        textData.length > PASTE_THRESHOLD &&
        pastedContent.length < 5
      ) {
        // Limit pasted content items
        e.preventDefault();
        setMessage(message + textData.slice(0, PASTE_THRESHOLD) + "..."); // Add a portion to textarea

        const pastedItem: PastedContent = {
          id: Math.random().toString(),
          content: textData,
          timestamp: new Date(),
          wordCount: textData.split(/\s+/).filter(Boolean).length,
        };

        setPastedContent((prev) => [...prev, pastedItem]);
      }
    },
    [handleFileSelect, files.length, maxFiles, pastedContent.length, message]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  const handleSend = useCallback(() => {
    if (
      disabled ||
      (!message.trim() && files.length === 0 && pastedContent.length === 0)
    )
      return;
    if (files.some((f) => f.uploadStatus === "uploading")) {
      alert("Please wait for all files to finish uploading.");
      return;
    }

    onSendMessage?.(message, files, pastedContent);

    setMessage("");
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setPastedContent([]);
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [message, files, pastedContent, disabled, onSendMessage]);

  const handleModelChangeInternal = useCallback(
    (modelId: string) => {
      setSelectedModel(modelId);
      onModelChange?.(modelId);
    },
    [onModelChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const hasContent =
    message.trim() || files.length > 0 || pastedContent.length > 0;
  const canSend =
    hasContent &&
    !disabled &&
    !files.some((f) => f.uploadStatus === "uploading");

  return (
    <div
      className={cn(
        "relative w-full",
        fullWidth ? "max-w-full" : "max-w-2xl mx-auto"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-[#1C3F62] border-2 border-dashed border-blue-500 rounded-xl flex flex-col items-center justify-center pointer-events-none">
          <p className="text-sm text-blue-500 flex items-center gap-2">
            <ImageIcon className="size-4 opacity-50" />
            Drop files here to add to chat
          </p>
        </div>
      )}

      <div className={cn(
        "bg-[#f0f0f0] border border-gray-300 rounded-xl shadow-lg items-end gap-2 flex flex-col",
        expandedHeight ? "min-h-[180px]" : "min-h-[150px]"
      )}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder={currentTypingText || placeholder}
          disabled={disabled}
          className={cn(
            "flex-1 w-full p-4 focus-within:border-none focus:outline-none focus:border-none border-none outline-none focus-within:ring-0 focus-within:ring-offset-0 focus-within:outline-none resize-none border-0 bg-transparent text-gray-800 shadow-none focus-visible:ring-0 placeholder:text-gray-400 placeholder:text-xl sm:placeholder:text-2xl text-sm sm:text-base custom-scrollbar",
            expandedHeight ? "min-h-[120px] max-h-[144px]" : "min-h-[100px] max-h-[120px]",
            textareaClassName
          )}
          rows={1}
        />
        <div className="flex items-center gap-2 justify-between w-full px-3 pb-1.5">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200 flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || files.length >= maxFiles}
              title={
                files.length >= maxFiles
                  ? `Max ${maxFiles} files reached`
                  : "Attach files"
              }
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-600 hover:text-gray-800 hover:bg-gray-200 flex-shrink-0"
              disabled={disabled}
              title="Options (Not implemented)"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            {models && models.length > 0 && (
              <ModelSelectorDropdown
                models={models}
                selectedModel={selectedModel}
                onModelChange={handleModelChangeInternal}
              />
            )}

            <Button
              size={buttonText ? "default" : "icon"}
              className={cn(
                buttonText ? "px-4 py-2 flex-shrink-0 rounded-md transition-colors" : "h-9 w-9 p-0 flex-shrink-0 rounded-md transition-colors",
                buttonClassName || (canSend
                  ? "bg-gray-800 hover:bg-gray-900 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed")
              )}
              onClick={handleSend}
              disabled={!canSend}
              title={buttonText ? buttonText : "Send message"}
            >
              {buttonText ? (
                <div className="flex items-center gap-2">
                  {buttonText}
                  <ArrowUp className="h-4 w-4" />
                </div>
              ) : (
                <ArrowUp className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        {(files.length > 0 || pastedContent.length > 0) && (
          <div className="overflow-x-auto border-t-[1px] p-3 border-gray-300 w-full bg-gray-100 hide-scroll-bar">
            <div className="flex gap-3">
              {pastedContent.map((content) => (
                <PastedContentCard
                  key={content.id}
                  content={content}
                  onRemove={(id) =>
                    setPastedContent((prev) => prev.filter((c) => c.id !== id))
                  }
                />
              ))}
              {files.map((file) => (
                <FilePreviewCard
                  key={file.id}
                  file={file}
                  onRemove={removeFile}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept={acceptedFileTypes?.join(",")}
        onChange={(e) => {
          handleFileSelect(e.target.files);
          if (e.target) e.target.value = ""; // Reset file input
        }}
      />
    </div>
  );
};

export default ClaudeChatInput; 