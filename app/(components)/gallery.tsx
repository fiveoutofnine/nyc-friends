'use client';

import { default as NextImage } from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import * as Accordion from '@radix-ui/react-accordion';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Share } from 'lucide-react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { twMerge } from 'tailwind-merge';

import type { Image } from '@/lib/db/schema';

import Location from '@/components/common/location';
import CustomMDX from '@/components/templates/custom-mdx';
import { IconButton, toast } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type GalleryProps = {
  images: (Image & { mdxSource?: MDXRemoteSerializeResult })[];
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const [accordionTouched, setAccordionTouched] = useState<boolean>(false);
  const [accordionValue, setAccordionValue] = useState<string>('text');

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
      // Ignore if any modifier key (except shift) is pressed.
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

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
        case ' ':
          // Only toggle accordion if no other element is focused.
          if (document.activeElement === document.body) {
            e.preventDefault();
            setAccordionValue((prev) => (prev === 'text' ? '' : 'text'));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, navigate, setAccordionValue]);

  const image = images[index];

  const share = useCallback(async () => {
    const shareUrl = `${window.location.origin}?img=${image.index}`;

    if (navigator.share) {
      await navigator.share({
        title: image.text ?? `friend.com review #${image.index}`,
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
      <div className="absolute right-2 top-2 z-10 flex items-center md:right-3 md:top-3">
        <IconButton onClick={share} size="xl" variant="ghost" aria-label="Share image">
          <Share />
        </IconButton>
      </div>
      <div className="relative h-full w-full">
        <NextImage
          key={image.url}
          src={image.url}
          alt={image.text}
          width={image.width}
          height={image.height}
          className="animate-fadeIn h-full w-full select-none object-contain"
          draggable={false}
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
      <Accordion.Root
        type="single"
        value={accordionValue}
        onValueChange={(value) => {
          setAccordionValue(value);
          setAccordionTouched(true);
        }}
        collapsible
      >
        <div
          className={clsx(
            'pointer-events-none absolute bottom-0 left-0 w-full bg-black/50 pb-4 pl-4 md:pb-6 md:pl-6',
            'before:aria-hidden="true" before:pointer-events-none before:absolute before:-top-8 before:left-0 before:h-8 before:w-full before:bg-gradient-to-t before:from-black/50 before:to-transparent before:content-[""]',
          )}
        >
          <Accordion.Item className="flex flex-col gap-0.5" value="text">
            <div className="flex h-7 items-center justify-between">
              <div className="flex items-center">
                <Link
                  className="pointer-events-auto select-none text-nowrap font-mono text-xl text-gray-11 transition-colors hover:text-gray-12 hover:underline focus-visible:rounded"
                  href="/all"
                >
                  ← ALL
                </Link>
                <span
                  className="select-none whitespace-pre text-gray-11"
                  role="separator"
                  aria-hidden
                >
                  {' '}
                  /{' '}
                </span>
                <Accordion.Trigger className="group pointer-events-auto flex h-7 items-center gap-1 font-mono text-xl text-gray-11 transition-colors hover:text-gray-12 focus-visible:rounded data-[state=closed]:text-gray-12">
                  {String(image.index).padStart(4, '0')}
                  <ChevronRight className="size-5 transition-transform duration-200 group-data-[state=open]:-rotate-90" />
                </Accordion.Trigger>
              </div>
              {image.location ? <Location location={image.location} /> : null}
            </div>
            <Accordion.Content
              className={clsx(
                'select-none flex-wrap whitespace-pre-wrap pr-4 text-3xl data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down md:pr-6',
                !accordionTouched ? 'line-clamp-3' : '',
              )}
            >
              {mounted && image.mdxSource ? <CustomMDX {...image.mdxSource} /> : image.text}
            </Accordion.Content>
          </Accordion.Item>
        </div>
      </Accordion.Root>
    </div>
  );
};

export default Gallery;
