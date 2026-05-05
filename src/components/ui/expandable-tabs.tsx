"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Tab {
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
  defaultActive?: number | null;
  disableTooltipForIndex?: number; // Index of tab to disable tooltip for
  onHomeTabHover?: () => void;
  onHomeTabLeave?: () => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring" as const, bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
  defaultActive = null,
  disableTooltipForIndex,
  onHomeTabHover,
  onHomeTabLeave,
}: ExpandableTabsProps) {
  const [selected, setSelected] = React.useState<number | null>(defaultActive);
  const outsideClickRef = React.useRef<HTMLDivElement>(null);

  // Update selected state when defaultActive changes
  React.useEffect(() => {
    const id = setTimeout(() => setSelected(defaultActive), 0);
    return () => clearTimeout(id);
  }, [defaultActive]);

  // Handle clicks outside the component
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (outsideClickRef.current && !outsideClickRef.current.contains(event.target as Node)) {
        // Only collapse if no defaultActive is set (not on a specific page)
        if (defaultActive === null) {
          setSelected(null);
          onChange?.(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onChange, defaultActive]);

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-gray-200" aria-hidden="true" />
  );

  return (
    <TooltipProvider>
      <div
        ref={outsideClickRef}
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-2xl bg-background p-1 shadow-sm",
          className
        )}
      >
        {tabs.map((tab, index) => {
          if (tab.type === "separator") {
            return <Separator key={`separator-${index}`} />;
          }

          const Icon = tab.icon;
          const isSelected = selected === index;
          
          const shouldShowTooltip = disableTooltipForIndex !== index;
          
          if (!shouldShowTooltip) {
            return (
              <motion.button
                key={tab.title}
                variants={buttonVariants}
                initial={false}
                animate="animate"
                custom={isSelected}
                onClick={() => handleSelect(index)}
                onMouseEnter={() => {
                  if (index === 0 && onHomeTabHover) {
                    onHomeTabHover();
                  }
                }}
                onMouseLeave={() => {
                  if (index === 0 && onHomeTabLeave) {
                    onHomeTabLeave();
                  }
                }}
                transition={transition}
                className={cn(
                  "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer",
                  isSelected
                    ? "bg-white shadow-sm border border-gray-200 text-gray-900"
                    : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                )}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-colors duration-300",
                    isSelected ? "text-gray-900" : ""
                  )}
                />
                <AnimatePresence initial={false}>
                  {isSelected && (
                    <motion.span
                      variants={spanVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={transition}
                      className="overflow-hidden"
                    >
                      {tab.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          }

          return (
            <Tooltip key={tab.title}>
              <TooltipTrigger asChild>
                <motion.button
                  variants={buttonVariants}
                  initial={false}
                  animate="animate"
                  custom={isSelected}
                  onClick={() => handleSelect(index)}
                  transition={transition}
                  className={cn(
                    "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer",
                    isSelected
                      ? "bg-white shadow-sm border border-gray-200 text-gray-900"
                      : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                  )}
                >
                  <Icon 
                    size={20} 
                    className={cn(
                      "transition-colors duration-300",
                      isSelected ? "text-gray-900" : ""
                    )}
                  />
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.span
                        variants={spanVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                        className="overflow-hidden"
                      >
                        {tab.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </TooltipTrigger>
              {!isSelected && (
                <TooltipContent side="bottom" sideOffset={8}>
                  {tab.title}
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
} 