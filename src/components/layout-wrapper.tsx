"use client";

import { Suspense } from "react";
import { ContentProvider } from "@/context/content-context";
import { GlobalNavigation } from "@/components/global-navigation";
import { ProgressBar } from "@/components/ui/progress-bar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider>
      <Suspense fallback={null}>
        <ProgressBar />
      </Suspense>
      <GlobalNavigation />
      <main className="pt-20">
        {children}
      </main>
    </ContentProvider>
  );
}