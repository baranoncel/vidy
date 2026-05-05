"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Lazy-loaded autoplay video tile.
 * - Plays muted/looped only when in viewport (saves bandwidth)
 * - Crossfades from poster image while loading
 * - Pauses other instances when one starts (controlled by intersection observer)
 */
export function AutoplayVideo({
  src,
  poster,
  className,
  hoverOnly = false,
}: {
  src: string;
  poster?: string;
  className?: string;
  hoverOnly?: boolean;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            if (!hoverOnly) ref.current?.play().catch(() => {});
          } else {
            ref.current?.pause();
          }
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hoverOnly]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden", className)}
      onMouseEnter={hoverOnly ? () => ref.current?.play().catch(() => {}) : undefined}
      onMouseLeave={hoverOnly ? () => ref.current?.pause() : undefined}
    >
      {/* poster */}
      {poster && !loaded && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      )}
      {visible && (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          playsInline
          loop
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
