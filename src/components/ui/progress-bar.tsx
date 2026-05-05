'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  speed: 500,
  minimum: 0.1
})

export function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Add custom CSS for the progress bar
    const style = document.createElement('style')
    style.innerHTML = `
      /* Progress bar styles */
      #nprogress {
        pointer-events: none;
      }
      
      #nprogress .bar {
        background: #0A009A;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }
      
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px #0A009A, 0 0 5px #0A009A;
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `
    document.head.appendChild(style)

    // Add test function to window for debugging
    ;(window as unknown as { testProgressBar?: () => void }).testProgressBar = () => {
      console.log('🧪 Testing progress bar manually')
      NProgress.start()
      setTimeout(() => {
        NProgress.done()
        console.log('🧪 Test progress bar completed')
      }, 2000)
    }

    return () => {
      document.head.removeChild(style)
      delete (window as unknown as { testProgressBar?: () => void }).testProgressBar
    }
  }, [])

  useEffect(() => {
    // Clear any existing timeout and complete progress when route changes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = undefined
    }
    console.log('🚀 Navigation completed, hiding progress bar')
    NProgress.done()
  }, [pathname, searchParams])

  useEffect(() => {
    // Handle navigation by intercepting clicks on navigation elements
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check if clicked element or its parent is a navigation link
      const anchor = target.closest('a')
      const button = target.closest('button')
      
      if (anchor && anchor.href && anchor.href !== window.location.href) {
        const url = new URL(anchor.href)
        // Only show progress for same-origin navigation
        if (url.origin === window.location.origin) {
          startProgress()
        }
      } else if (button) {
        // Check if button might trigger navigation (common in custom navigation components)
        const hasNavigationClasses = button.className.includes('tab') || 
                                    button.getAttribute('role') === 'tab' ||
                                    button.closest('[role="tablist"]') !== null
        
        if (hasNavigationClasses) {
          startProgress()
        }
      }
    }

    const startProgress = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      console.log('🔄 Navigation started, showing progress bar')
      // Reduce delay to make progress bar more responsive
      timeoutRef.current = setTimeout(() => {
        NProgress.start()
      }, 50)
    }

    // Listen for custom navigation event
    const handleNavigationStart = () => {
      console.log('📡 Custom navigation event detected')
      startProgress()
    }

    // Listen for both click and keydown events
    document.addEventListener('click', handleClick)
    window.addEventListener('navigationStart', handleNavigationStart)
    
    // Also listen for programmatic navigation by watching for URL changes
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState
    
    window.history.pushState = function(...args) {
      console.log('⏭️ History.pushState called')
      startProgress()
      return originalPushState.apply(window.history, args)
    }
    
    window.history.replaceState = function(...args) {
      console.log('🔄 History.replaceState called')
      startProgress()
      return originalReplaceState.apply(window.history, args)
    }
    
    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('navigationStart', handleNavigationStart)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = undefined
      }
    }
  }, [])

  return null
} 