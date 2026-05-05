"use client";

import { useRouter, usePathname } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { 
  Home, 
  Video, 
  Scissors, 
  Volume2, 
  Wand2, 
  Settings, 
  CreditCard,
  User,
  Users,
  MessageSquare,
  Bot,
  Mic2,
  ChevronDown,
  LogOut,
  Diamond,
  LucideIcon,
  Camera,
  Zap,
  Sparkles,
  Edit3,
  Mic,
  Box,
  Music,
  Palette,
  Tv,
  Maximize2,
  Cpu,
  Film
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { SpringElement } from "@/components/animate-ui/components/spring-element";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useContent } from "@/context/content-context";

// Features data for the home mega menu
const allFeatures = [
  {
    title: "Image",
    description: "Generate images with custom styles in Flux and Ideogram.",
    icon: Camera,
    badge: "New",
    link: "/image",
    bgColor: "bg-blue-500"
  },
  {
    title: "Video",
    description: "Generate videos with Halluo, Pika, Runway, Luma, and more.",
    icon: Video,
    badge: null,
    link: "/video",
    bgColor: "bg-orange-500"
  },
  {
    title: "Realtime",
    description: "Realtime AI rendering on a canvas. Instant feedback loops.",
    icon: Zap,
    badge: null,
    link: "/realtime",
    bgColor: "bg-cyan-500"
  },
  {
    title: "Enhancer",
    description: "Upscale and enhance images and videos up to 22K.",
    icon: Sparkles,
    badge: "New",
    link: "/enhance",
    bgColor: "bg-gray-800"
  },
  {
    title: "Edit",
    description: "Add objects, change style, or expand photos and generations.",
    icon: Edit3,
    badge: "New",
    link: "/edit",
    bgColor: "bg-purple-600"
  },
  {
    title: "Video Lipsync",
    description: "Lip sync any video to any audio.",
    icon: Mic,
    badge: "New",
    link: "/lipsync",
    bgColor: "bg-indigo-600"
  },
  {
    title: "Train",
    description: "Teach Krea to replicate your style, products, or characters.",
    icon: Wand2,
    badge: null,
    link: "/train",
    bgColor: "bg-pink-500"
  },
  {
    title: "3D Objects",
    description: "Generate 3D objects from text or images in seconds.",
    icon: Box,
    badge: null,
    link: "/3d",
    bgColor: "bg-gray-700"
  },
  {
    title: "Audio Generation",
    description: "Create music and sound effects with AI.",
    icon: Music,
    badge: null,
    link: "/audio",
    bgColor: "bg-green-500"
  },
  {
    title: "Style Transfer",
    description: "Apply artistic styles to your images and videos.",
    icon: Palette,
    badge: null,
    link: "/style",
    bgColor: "bg-red-500"
  },
  {
    title: "Text to Speech",
    description: "Convert text to natural-sounding speech.",
    icon: Volume2,
    badge: null,
    link: "/tts",
    bgColor: "bg-yellow-500"
  },
  {
    title: "Video Analytics",
    description: "Analyze and extract insights from videos.",
    icon: Tv,
    badge: null,
    link: "/analytics",
    bgColor: "bg-teal-500"
  },
  {
    title: "Image Upscaler",
    description: "Enhance image resolution and quality.",
    icon: Maximize2,
    badge: null,
    link: "/upscale",
    bgColor: "bg-indigo-500"
  },
  {
    title: "AI Assistant",
    description: "Get help with your creative projects.",
    icon: Cpu,
    badge: null,
    link: "/assistant",
    bgColor: "bg-purple-500"
  }
];

interface Tab {
  title: string;
  icon: LucideIcon;
  route: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
  route?: never;
}

type TabItem = Tab | Separator;

interface ProfileMenuItem {
  title?: string;
  icon?: React.ComponentType<{ className?: string }>;
  route?: string;
  action?: string;
  type?: "separator";
}

export function GlobalNavigation() {
  const { hasGeneratedContent } = useContent();
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showHomeMegaMenu, setShowHomeMegaMenu] = useState(false);
  const [menuHideTimeout, setMenuHideTimeout] = useState<NodeJS.Timeout | null>(null);

  // Mock user data - replace with real data
  const userData = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "JD",
    plan: "Free",
    creditsUsed: 7,
    creditsTotal: 10
  };

  const navigationTabs: TabItem[] = [
    { title: "Home", icon: Home, route: "/" },
    { title: "Generate", icon: Video, route: "/generate" },
    { title: "Agent", icon: Bot, route: "/agent" },
    { title: "Stories", icon: Film, route: "/stories" },
    { title: "Clips", icon: Scissors, route: "/clips" },
    { title: "UGC Video", icon: Users, route: "/ugc-video" },
    { title: "Captions", icon: MessageSquare, route: "/captions" },
    { title: "Lip Sync", icon: Mic2, route: "/lipsync" },
    { title: "Dubbing", icon: Volume2, route: "/dubbing" },
    { title: "Effects", icon: Wand2, route: "/effects" },
    { type: "separator" },
    { title: "AI Tools", icon: Cpu, route: "/ai-video-tools" },
  ];

  const profileMenuItems: ProfileMenuItem[] = [
    { title: "Profile", icon: User, route: "/profile" },
    { title: "Settings", icon: Settings, route: "/settings" },
    { title: "Billing", icon: CreditCard, route: "/pricing" },
    { type: "separator" },
    { title: "Sign out", icon: LogOut, action: "signout" },
  ];

  // Derive active tab from current pathname
  const activeTabIndex = navigationTabs.findIndex(
    tab => tab.type !== "separator" && tab.route === pathname
  );
  const activeTab = activeTabIndex !== -1 ? activeTabIndex : null;

  const handleNavigation = (index: number | null) => {
    if (index === null) return;
    
    const tab = navigationTabs[index];
    if (tab && tab.type !== "separator") {
      window.dispatchEvent(new CustomEvent('navigationStart'));
      router.push(tab.route);
    }
  };

  const handleProfileMenuClick = (item: ProfileMenuItem) => {
    if (item.action === "signout") {
      console.log("Sign out");
    } else if (item.route) {
      router.push(item.route);
    }
    setShowProfileDropdown(false);
  };

  const handleHomeMegaMenuShow = () => {
    // Don't show mega menu if content has been generated
    if (hasGeneratedContent) {
      return;
    }
    
    if (menuHideTimeout) {
      clearTimeout(menuHideTimeout);
      setMenuHideTimeout(null);
    }
    setShowHomeMegaMenu(true);
  };

  const handleHomeMegaMenuHide = () => {
    if (menuHideTimeout) {
      clearTimeout(menuHideTimeout);
    }
    const timeout = setTimeout(() => {
      setShowHomeMegaMenu(false);
    }, 200); // Delay to allow movement to menu
    setMenuHideTimeout(timeout);
  };

  const creditsPercentage = (userData.creditsUsed / userData.creditsTotal) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">

      
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left - Logo */}
        <div className="flex items-center gap-6">
          <SpringElement
            springConfig={{ stiffness: 300, damping: 20 }}
            dragElastic={0.3}
            springPathConfig={{
              coilCount: 6,
              amplitudeMin: 5,
              amplitudeMax: 15
            }}
          >
            <div 
              draggable={false}
              onClick={() => {
                if (pathname !== '/') {
                  router.push('/');
                }
              }}
              className="cursor-pointer"
            >
              <Logo showText={false} />
            </div>
          </SpringElement>
        </div>

        {/* Center - Navigation Tabs */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <ExpandableTabs
              tabs={navigationTabs}
              onChange={handleNavigation}
              activeColor="text-primary"
              className="bg-gray-50/80 backdrop-blur-lg shadow-sm"
              defaultActive={activeTab}
              disableTooltipForIndex={0}
              onHomeTabHover={handleHomeMegaMenuShow}
              onHomeTabLeave={handleHomeMegaMenuHide}
            />
          </div>
        </div>

                 {/* Home Tab Mega Menu - Positioned outside navigation */}
        {showHomeMegaMenu && !hasGeneratedContent && (
          <div 
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-0 w-[1000px] bg-white border border-gray-200 rounded-2xl shadow-2xl py-6 px-6"
            style={{ zIndex: 99999 }}
            onMouseEnter={handleHomeMegaMenuShow}
            onMouseLeave={handleHomeMegaMenuHide}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All Features</h3>
              <p className="text-sm text-gray-600">Explore all the powerful AI tools at your fingertips</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {allFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200 cursor-pointer"
                >
                  {/* Icon */}
                  <div className={cn(
                    "p-2.5 rounded-lg group-hover:scale-105 transition-transform duration-200 flex-shrink-0",
                    feature.bgColor || "bg-gray-100"
                  )}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm">
                        {feature.title}
                      </h4>
                      {feature.badge && (
                        <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-1">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Open Button */}
                  <Link
                    href={feature.link}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                    onClick={() => {
                      if (menuHideTimeout) {
                        clearTimeout(menuHideTimeout);
                      }
                      setShowHomeMegaMenu(false);
                    }}
                  >
                    Open
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Ready to get started?</p>
                  <p className="text-xs text-gray-600">Choose any tool and begin creating</p>
                </div>
                <Link
                  href="/generate"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
                  onClick={() => {
                    if (menuHideTimeout) {
                      clearTimeout(menuHideTimeout);
                    }
                    setShowHomeMegaMenu(false);
                  }}
                >
                  Start Creating
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Right - Dark Mode, Credits, Upgrade, Profile */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          {/* Credits Display */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 rounded-lg">
            <div className="relative w-5 h-5">
              <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  className="text-gray-300"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeDasharray={`${creditsPercentage * 0.628} 62.8`}
                  className="text-green-500"
                />
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-700">
              {Math.round(creditsPercentage)}% Daily Credits
            </span>
          </div>

          {/* Upgrade Button */}
          <button 
            onClick={() => router.push('/pricing')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-xs"
          >
            <Diamond className="w-3.5 h-3.5" />
            Upgrade Now
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {userData.avatar}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-10">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {userData.avatar}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{userData.name}</div>
                      <div className="text-sm text-gray-500">{userData.email}</div>
                      <div className="text-xs text-orange-600 font-medium">{userData.plan} Plan</div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                {profileMenuItems.map((item, index) => {
                  if (item.type === "separator") {
                    return <div key={index} className="border-t border-gray-100 my-1" />;
                  }

                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleProfileMenuClick(item)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                    >
                      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                      <span className="text-gray-700">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </div>
  );
} 