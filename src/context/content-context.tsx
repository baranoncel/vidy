"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface ContentContextType {
  hasGeneratedContent: boolean;
  setHasGeneratedContent: (value: boolean) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);

  return (
    <ContentContext.Provider value={{ hasGeneratedContent, setHasGeneratedContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
} 