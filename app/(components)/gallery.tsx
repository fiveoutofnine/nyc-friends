'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

import type { Image } from '@/lib/db/schema';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface GalleryProps {
  images: Image[];
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => setMounted(true), []);

  const isTouchScreen = mounted ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) : false;

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
    } else {
      setIndex((prev) => (prev + 1) % images.length);
    }
  };

  const image = images[index];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (!images || images.length === 0) {
    return 'No images available.';
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-1">
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={image.url}
          src={image.url}
          alt={image.text}
          className="animate-fadeIn h-full w-full object-contain"
        />
      </div>
      {(
        [
          {
            direction: 'prev',
            className: 'left-0 justify-start hover:bg-gradient-to-r',
            icon: <ChevronLeft className="size-8 md:size-12" />,
            ariaLabel: 'Previous artwork',
          },
          {
            direction: 'next',
            className: 'right-0 justify-end hover:bg-gradient-to-l',
            icon: <ChevronRight className="size-8 md:size-12" />,
            ariaLabel: 'Next artwork',
          },
        ] satisfies {
          direction: 'prev' | 'next';
          className: string;
          icon: React.ReactNode;
          ariaLabel: string;
        }[]
      ).map(({ direction, className, icon, ariaLabel }) => (
        <button
          key={direction}
          onClick={() => navigate(direction)}
          className={twMerge(
            clsx(
              'group absolute top-0 flex h-full w-1/2 items-center from-black/70 to-transparent px-4 opacity-0 focus:outline-none md:px-6',
              !isTouchScreen ? 'transition-opacity duration-300 hover:opacity-100' : '',
              className,
            ),
          )}
          aria-label={ariaLabel}
        >
          {!isTouchScreen ? (
            <span className="hidden text-gray-11 group-hover:flex group-hover:animate-in group-hover:fade-in">
              {icon}
            </span>
          ) : null}
        </button>
      ))}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1">
        <h1 className="text-3xl font-light tracking-wide text-gray-12">{image.text}</h1>
      </div>
    </div>
  );
};

export default Gallery;
