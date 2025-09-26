'use client';

import { useCallback, useEffect, useState } from 'react';

import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Share } from 'lucide-react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { twMerge } from 'tailwind-merge';

import type { Image } from '@/lib/db/schema';

import CustomMDX from '@/components/templates/custom-mdx';
import { IconButton, toast } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface GalleryProps {
  images: (Image & { mdxSource?: MDXRemoteSerializeResult })[];
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

  const navigate = useCallback(
    (direction: 'prev' | 'next') => {
      if (direction === 'prev') {
        setIndex((prev) => (prev - 1 + images.length) % images.length);
      } else {
        setIndex((prev) => (prev + 1) % images.length);
      }
    },
    [images.length],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          navigate('prev');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          navigate('next');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, navigate]);

  const image = images[index];

  const share = useCallback(async () => {
    const shareUrl = `${window.location.origin}?img=${image.index}`;

    if (navigator.share) {
      await navigator.share({
        title: `IMG_${String(image.index).padStart(4, '0')}`,
        text: image.text,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        intent: 'success',
        title: 'Link copied to clipboard.',
        description: shareUrl,
      });
    }
  }, [image]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (!images || images.length === 0) {
    return 'No images available.';
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <IconButton
        className="absolute right-2 top-2 z-10 md:right-3 md:top-3"
        onClick={share}
        size="xl"
        variant="ghost"
        aria-label="Share image"
      >
        <Share />
      </IconButton>
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
              'group absolute top-0 flex h-full w-1/2 items-center from-black/70 to-transparent px-4 opacity-0 focus:outline-none focus-visible:ring-0 md:px-6',
              !isTouchScreen
                ? 'transition-opacity duration-300 hover:opacity-100 focus-visible:bg-gray-3/50 focus-visible:opacity-100'
                : '',
              className,
            ),
          )}
          aria-label={ariaLabel}
        >
          {!isTouchScreen ? (
            <span className="hidden text-gray-11 group-hover:flex group-hover:animate-in group-hover:fade-in group-focus-visible:flex group-focus-visible:animate-in group-focus-visible:fade-in">
              {icon}
            </span>
          ) : null}
        </button>
      ))}
      <div
        className={clsx(
          'pointer-events-none absolute bottom-0 left-0 flex w-full flex-col gap-1 bg-black/50 px-4 pb-4 md:px-6 md:pb-6',
          'before:aria-hidden="true" before:pointer-events-none before:absolute before:-top-8 before:left-0 before:h-8 before:w-full before:bg-gradient-to-t before:from-black/50 before:to-transparent before:content-[""]',
        )}
      >
        <span className="font-vhs-mono text-xl text-gray-11">
          IMG_{String(image.index).padStart(4, '0')}
        </span>
        <div className="flex-wrap whitespace-pre-wrap text-3xl">
          {mounted && image.mdxSource ? <CustomMDX {...image.mdxSource} /> : image.text}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
