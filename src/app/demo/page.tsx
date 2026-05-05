"use client";

import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { 
  Bell, 
  Home, 
  HelpCircle, 
  Settings, 
  Shield, 
  Mail, 
  User, 
  FileText, 
  Lock,
  Video,
  Scissors,
  Volume2
} from "lucide-react";

export default function DemoPage() {
  const defaultTabs = [
    { title: "Dashboard", icon: Home },
    { title: "Notifications", icon: Bell },
    { type: "separator" as const },
    { title: "Settings", icon: Settings },
    { title: "Support", icon: HelpCircle },
    { title: "Security", icon: Shield },
  ];

  const customColorTabs = [
    { title: "Profile", icon: User },
    { title: "Messages", icon: Mail },
    { type: "separator" as const },
    { title: "Documents", icon: FileText },
    { title: "Privacy", icon: Lock },
  ];

  const vidyTabs = [
    { title: "Generate", icon: Video },
    { title: "Clips", icon: Scissors },
    { title: "Dubbing", icon: Volume2 },
    { type: "separator" as const },
    { title: "Settings", icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          ExpandableTabs Demo
        </h1>
        <p className="text-zinc-400 text-lg">
          Interactive demonstrations of the ExpandableTabs component
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Default Configuration</h2>
          <div className="flex justify-center">
            <ExpandableTabs tabs={defaultTabs} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Custom Blue Color</h2>
          <div className="flex justify-center">
            <ExpandableTabs 
              tabs={customColorTabs} 
              activeColor="text-blue-500"
              className="border-blue-200 dark:border-blue-800" 
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Vidy.ai Style</h2>
          <div className="flex justify-center">
            <ExpandableTabs 
              tabs={vidyTabs}
              activeColor="text-blue-400"
              className="bg-background/80 backdrop-blur-lg border-zinc-800/50 shadow-2xl"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Compact Version</h2>
          <div className="flex justify-center">
            <ExpandableTabs 
              tabs={[
                { title: "Home", icon: Home },
                { title: "Settings", icon: Settings },
                { title: "Help", icon: HelpCircle },
              ]}
              className="scale-90"
            />
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 border border-zinc-800 rounded-lg bg-zinc-950/50">
        <h3 className="text-xl font-semibold text-white mb-3">Component Features</h3>
        <ul className="text-zinc-400 space-y-2">
          <li>• Smooth animations with Framer Motion</li>
          <li>• Click outside to close functionality</li>
          <li>• Customizable colors and styling</li>
          <li>• Support for separators between groups</li>
          <li>• Responsive design with Tailwind CSS</li>
          <li>• TypeScript support with proper interfaces</li>
          <li>• Accessibility features with proper ARIA labels</li>
        </ul>
      </div>
    </div>
  );
} 