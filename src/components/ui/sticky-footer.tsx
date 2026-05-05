"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, FileText, MessageCircle } from "lucide-react";
import Link from "next/link";

const useCases = [
  { title: "Content Creation", description: "Create engaging videos for social media", href: "/use-cases/content-creation" },
  { title: "Marketing Campaigns", description: "Generate promotional videos and ads", href: "/use-cases/marketing" },
  { title: "Education", description: "Create educational and training content", href: "/use-cases/education" },
  { title: "E-commerce", description: "Product demos and showcase videos", href: "/use-cases/ecommerce" },
  { title: "Entertainment", description: "Creative storytelling and animations", href: "/use-cases/entertainment" },
  { title: "Business", description: "Corporate presentations and reports", href: "/use-cases/business" },
];

const helpItems = [
  { title: "Documentation", description: "Learn how to use Vidy", icon: FileText, href: "/docs" },
  { title: "F.A.Q", description: "Frequently asked questions", icon: MessageCircle, href: "/faq" },
  { title: "Contact Support", description: "Get help from our team", icon: MessageCircle, href: "/contact" },
];

const legalItems = [
  { title: "Terms of Service", description: "Our terms and conditions", href: "/legal/terms" },
  { title: "Privacy Policy", description: "How we protect your data", href: "/legal/privacy" },
  { title: "Cookie Policy", description: "Our use of cookies", href: "/legal/cookies" },
  { title: "DMCA", description: "Copyright and takedown policy", href: "/legal/dmca" },
  { title: "Refund Policy", description: "Our refund terms", href: "/legal/refunds" },
];

interface StickyFooterProps {
  className?: string;
}

export function StickyFooter({ className }: StickyFooterProps) {
  const [showUseCases, setShowUseCases] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLegal, setShowLegal] = useState(false);

  return (
    <div className={cn("fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50", className)}>
      {/* Use Cases Menu */}
      {showUseCases && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/10 p-4 min-w-[400px] ring-1 ring-black/5">
            <div className="grid grid-cols-2 gap-3">
              {useCases.map((useCase) => (
                <Link
                  key={useCase.title}
                  href={useCase.href}
                  className="group flex flex-col gap-1 p-3 rounded-2xl hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-white/30 cursor-pointer backdrop-blur-sm"
                  onClick={() => setShowUseCases(false)}
                >
                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-gray-700">
                    {useCase.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {useCase.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Menu */}
      {showHelp && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/10 p-4 min-w-[280px] ring-1 ring-black/5">
            <div className="space-y-2">
              {helpItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-white/30 cursor-pointer backdrop-blur-sm"
                  onClick={() => setShowHelp(false)}
                >
                  <div className="p-2 rounded-xl bg-white/60 backdrop-blur-sm">
                    <item.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-gray-700">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legal Menu */}
      {showLegal && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl shadow-black/10 p-4 min-w-[280px] ring-1 ring-black/5">
            <div className="space-y-2">
              {legalItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex flex-col gap-1 p-3 rounded-2xl hover:bg-white/50 transition-all duration-200 border border-transparent hover:border-white/30 cursor-pointer backdrop-blur-sm"
                  onClick={() => setShowLegal(false)}
                >
                  <h3 className="font-medium text-gray-900 text-sm group-hover:text-gray-700">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Bar */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl shadow-black/10 ring-1 ring-black/5">
        <div className="px-8 py-4">
          <div className="flex items-center justify-center gap-8">
            {/* Use Cases */}
            <button
              className="relative flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              onClick={() => {
                setShowUseCases(!showUseCases);
                setShowHelp(false);
                setShowLegal(false);
              }}
            >
              Use Cases
              <ChevronUp 
                className={cn(
                  "h-4 w-4 transition-transform",
                  showUseCases ? "rotate-180" : ""
                )}
              />
            </button>

            {/* Blog */}
            <Link 
              href="/blog"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Blog
            </Link>

            {/* Affiliate */}
            <Link 
              href="/affiliate"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Affiliate
            </Link>

            {/* Pricing */}
            <Link 
              href="/pricing"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Pricing
            </Link>

            {/* Help */}
            <button
              className="relative flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              onClick={() => {
                setShowHelp(!showHelp);
                setShowUseCases(false);
                setShowLegal(false);
              }}
            >
              Help
              <ChevronUp 
                className={cn(
                  "h-4 w-4 transition-transform",
                  showHelp ? "rotate-180" : ""
                )}
              />
            </button>

            {/* Legal */}
            <button
              className="relative flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              onClick={() => {
                setShowLegal(!showLegal);
                setShowUseCases(false);
                setShowHelp(false);
              }}
            >
              Legal
              <ChevronUp 
                className={cn(
                  "h-4 w-4 transition-transform",
                  showLegal ? "rotate-180" : ""
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 