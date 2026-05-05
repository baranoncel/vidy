import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

interface LogoIconProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: { width: 20, height: 20, class: "w-5 h-5" },
  md: { width: 32, height: 32, class: "w-8 h-8" }, 
  lg: { width: 48, height: 48, class: "w-12 h-12" },
  xl: { width: 64, height: 64, class: "w-16 h-16" }
};

export function Logo({ className, size = "md", showText = false }: LogoProps) {
  const { width, height, class: sizeClass } = sizeMap[size];
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image 
        src="/vidy.svg" 
        alt="Vidy.ai Logo" 
        width={width}
        height={height}
        className={sizeClass}
        priority={size === "md" || size === "lg"} // Prioritize loading for common sizes
        draggable={false}
      />
      {showText && (
        <span className="text-lg font-bold text-gray-900">Vidy.ai</span>
      )}
    </div>
  );
}

export function LogoIcon({ className, size = "md" }: LogoIconProps) {
  const { width, height, class: sizeClass } = sizeMap[size];
  
  return (
    <Image 
      src="/vidy.svg" 
      alt="Vidy.ai" 
      width={width}
      height={height}
      className={cn(sizeClass, className)}
      priority={size === "md" || size === "lg"}
      draggable={false}
    />
  );
} 