"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CarouselItem {
  id: string
  title: string
  description: string
  image: string
  buttonText?: string
}

interface ModernCarouselProps {
  items: CarouselItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export const ModernCarousel = ({ 
  items, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  className 
}: ModernCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (autoPlay && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
      }, autoPlayInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, isHovered, items.length])

  const getVisibleItems = () => {
    const visibleItems = []
    for (let i = 0; i < Math.min(2, items.length); i++) {
      const index = (currentIndex + i) % items.length
      visibleItems.push({ ...items[index], index })
    }
    return visibleItems
  }

  return (
    <div 
      className={cn("relative w-full", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn("flex gap-3", className?.includes("h-[130px]") ? "h-[130px]" : "h-[400px]")}>
        {className?.includes("h-[130px]") ? (
          // Smaller 3-column layout
          <>
            {/* Previous slide preview - left */}
            {items.length > 1 && (
              <motion.div 
                className="relative flex-1 rounded-xl overflow-hidden cursor-pointer"
                onClick={prevSlide}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={items[(currentIndex - 1 + items.length) % items.length].image}
                  alt={items[(currentIndex - 1 + items.length) % items.length].title}
                  fill
                  className="object-cover"
                />
                
                {/* Slight overlay for preview effect */}
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Preview label */}
                <div className="absolute top-2 left-2">
                  <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    Prev
                  </span>
                </div>
              </motion.div>
            )}

            {/* Main slide - center */}
            <motion.div 
              className="relative flex-[1.5] rounded-xl overflow-hidden"
              layout
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={items[currentIndex].image}
                    alt={items[currentIndex].title}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/60" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                    <motion.h3 
                      className="text-lg font-bold text-white mb-3 text-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {items[currentIndex].title}
                    </motion.h3>
                    <motion.button
                      className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-white/30 transition-all duration-300"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {items[currentIndex].buttonText || "View"}
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Next slide preview - right */}
            {items.length > 1 && (
              <motion.div 
                className="relative flex-1 rounded-xl overflow-hidden cursor-pointer"
                onClick={nextSlide}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={items[(currentIndex + 1) % items.length].image}
                  alt={items[(currentIndex + 1) % items.length].title}
                  fill
                  className="object-cover"
                />
                
                {/* Slight overlay for preview effect */}
                <div className="absolute inset-0 bg-black/30" />
                
                {/* Preview label */}
                <div className="absolute top-2 left-2">
                  <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    Next
                  </span>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          // Original large layout
          <>
            {/* Main slide - 60% width */}
            <motion.div 
              className="relative flex-[3] rounded-3xl overflow-hidden"
              layout
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={items[currentIndex].image}
                    alt={items[currentIndex].title}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-end justify-between">
                      <div className="flex-1 pr-8">
                        <motion.h2 
                          className="text-3xl md:text-4xl font-bold text-white mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {items[currentIndex].title}
                        </motion.h2>
                        <motion.p 
                          className="text-white/90 text-lg mb-6 max-w-2xl"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {items[currentIndex].description}
                        </motion.p>
                      </div>
                      
                      {/* Apple-style button */}
                      <motion.button
                        className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-all duration-300 whitespace-nowrap"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {items[currentIndex].buttonText || "Read more"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Next slide preview - 40% width */}
            {items.length > 1 && (
              <motion.div 
                className="relative flex-[2] rounded-3xl overflow-hidden cursor-pointer"
                onClick={nextSlide}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={items[(currentIndex + 1) % items.length].image}
                  alt={items[(currentIndex + 1) % items.length].title}
                  fill
                  className="object-cover"
                />
                
                {/* Slight overlay for preview effect */}
                <div className="absolute inset-0 bg-black/10" />
                
                {/* Preview label */}
                <div className="absolute top-4 left-4">
                  <span className="bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                    Next
                  </span>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300 z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>


    </div>
  )
} 