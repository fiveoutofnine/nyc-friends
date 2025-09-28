'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type TransitionContextType = {
  transitionImage: {
    url: string;
    index: number;
    rect: DOMRect | null;
  } | null;
  setTransitionImage: (image: { url: string; index: number; rect: DOMRect | null } | null) => void;
};

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [transitionImage, setTransitionImage] = useState<{
    url: string;
    index: number;
    rect: DOMRect | null;
  } | null>(null);

  return (
    <TransitionContext.Provider value={{ transitionImage, setTransitionImage }}>
      {children}
    </TransitionContext.Provider>
  );
}

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error('`useTransition` must be used within a `TransitionProvider`');
  }
  return context;
}
