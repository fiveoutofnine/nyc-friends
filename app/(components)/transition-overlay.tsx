'use client';

import { default as NextImage } from 'next/image';
import { useEffect, useState } from 'react';

import { useTransition } from '@/lib/contexts/transition';

export default function TransitionOverlay() {
  const { transitionImage, setTransitionImage } = useTransition();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (transitionImage) {
      setIsAnimating(true);

      // Clear transition after animation completes.
      const timer = setTimeout(() => {
        setTransitionImage(null);
        setIsAnimating(false);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [transitionImage, setTransitionImage]);

  if (!transitionImage || !transitionImage.rect) return null;

  const { rect, url, index } = transitionImage;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        backgroundColor: isAnimating ? 'rgba(0,0,0,1)' : 'transparent',
        transition: 'background-color 300ms ease-out',
      }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          left: isAnimating ? '50%' : `${rect.left}px`,
          top: isAnimating ? '50%' : `${rect.top}px`,
          width: isAnimating ? '100vw' : `${rect.width}px`,
          height: isAnimating ? '100vh' : `${rect.height}px`,
          transform: isAnimating ? 'translate(-50%, -50%)' : 'none',
          transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <NextImage
          src={url}
          alt={`Image ${index}`}
          fill
          className={`transition-all duration-300 ${
            isAnimating ? 'object-contain' : 'object-cover'
          }`}
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
