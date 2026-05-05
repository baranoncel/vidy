"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Image as ImageIcon, Video, Music, Sparkles, Zap, Wand2, Layers, Box, MicVocal } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/studio", label: "Overview", icon: Sparkles },
  { href: "/studio/image", label: "Image", icon: ImageIcon },
  { href: "/studio/video", label: "Video", icon: Video },
  { href: "/studio/audio", label: "Audio", icon: Music },
  { href: "/studio/voice", label: "Voice", icon: MicVocal },
  { href: "/studio/effects", label: "Effects", icon: Zap },
  { href: "/studio/3d", label: "3D", icon: Box },
  { href: "/studio/canvas", label: "Canvas", icon: Layers },
  { href: "/studio/realtime", label: "Realtime", icon: Wand2 },
];

export function StudioNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky top-20 z-30 mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
      <div className="flex w-full items-center gap-1.5 overflow-x-auto rounded-full border border-white/10 bg-black/40 px-1.5 py-1.5 backdrop-blur-xl ring-1 ring-white/5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const active = pathname === t.href || (t.href !== "/studio" && pathname.startsWith(t.href));
          return (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                active
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white hover:bg-white/5",
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
