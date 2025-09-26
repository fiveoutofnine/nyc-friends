'use client';

import { useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface GalleryImage {
  src: string;
  title: string;
  description?: string;
}

interface GalleryCarouselProps {
  images: GalleryImage[];
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const GalleryCarousel: React.FC<GalleryCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (direction: 'prev' | 'next') => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    } else {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }

    setTimeout(() => setIsTransitioning(false), 500);
  };

  const currentImage = images[currentIndex];

  if (!images || images.length === 0) {
    return 'No images available.';
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-1">
      <div className="relative h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={currentImage.src}
          src={currentImage.src}
          alt={currentImage.title}
          className="animate-fadeIn h-full w-full object-contain"
        />
      </div>
      <button
        onClick={() => navigate('prev')}
        className="group absolute left-0 top-0 h-full w-1/2 transition-colors duration-300 focus:outline-none"
        aria-label="Previous artwork"
      >
        <span className="hidden items-center justify-start pl-8 group-hover:flex group-hover:animate-in group-hover:fade-in">
          <ChevronLeft className="size-12 text-gray-11" />
        </span>
      </button>
      <button
        onClick={() => navigate('next')}
        className="group absolute right-0 top-0 h-full w-1/2 transition-colors duration-300 focus:outline-none"
        aria-label="Next artwork"
      >
        <span className="hidden items-center justify-end pr-8 duration-300 group-hover:flex group-hover:animate-in group-hover:fade-in">
          <ChevronRight className="size-12 text-gray-11" />
        </span>
      </button>
      <div className="absolute bottom-4 left-4 flex flex-col gap-1">
        <h1 className="text-3xl font-light tracking-wide text-gray-12">{currentImage.title}</h1>
        {currentImage.description && (
          <p className="text-lg font-light text-gray-11">{currentImage.description}</p>
        )}
      </div>
    </div>
  );
};

export default GalleryCarousel;
