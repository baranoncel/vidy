"use client";

import { Suspense } from "react";
import { ContentProvider } from "@/context/content-context";
import { GlobalNavigation } from "@/components/global-navigation";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StickyFooter } from "@/components/ui/sticky-footer";
import { AuthGateProvider } from "@/components/auth/AuthGate";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthGateProvider>
      <ContentProvider>
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <GlobalNavigation />
        <main className="pb-32 pt-20">{children}</main>
        <StickyFooter />
      </ContentProvider>
    </AuthGateProvider>
  );
}