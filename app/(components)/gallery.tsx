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
  const [hoveredSide, setHoveredSide] = useState<'prev' | 'next' | null>(null);
  const [focusedSide, setFocusedSide] = useState<'prev' | 'next' | null>(null);

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

  // Keyboard navigation.
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
      <div
        className="relative h-full w-full"
        onClick={(e) => {
          // Only navigate on left click, not right click or context menu.
          if (e.button !== 0) return;

          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const isLeftHalf = x < rect.width / 2;

          navigate(isLeftHalf ? 'prev' : 'next');
        }}
        onMouseMove={(e) => {
          if (isTouchScreen) return;

          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const isLeftHalf = x < rect.width / 2;

          setHoveredSide(isLeftHalf ? 'prev' : 'next');
        }}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <NextImage
          key={image.url}
          src={image.url}
          alt={image.text}
          width={image.width}
          height={image.height}
          className="animate-fadeIn h-full w-full select-none object-contain"
          draggable={true}
        />
      </div>
      {!isTouchScreen
        ? (
            [
              {
                direction: 'prev',
                side: 'left-0 justify-start',
                gradient: 'bg-gradient-to-r',
                icon: <ChevronLeft className="size-8 md:size-12" />,
                ariaLabel: 'Previous artwork',
              },
              {
                direction: 'next',
                side: 'right-0 justify-end',
                gradient: 'bg-gradient-to-l',
                icon: <ChevronRight className="size-8 md:size-12" />,
                ariaLabel: 'Next artwork',
              },
            ] satisfies {
              direction: 'prev' | 'next';
              side: string;
              gradient: string;
              icon: React.ReactNode;
              ariaLabel: string;
            }[]
          ).map(({ direction, side, gradient, icon, ariaLabel }) => {
            const isActive = hoveredSide === direction || focusedSide === direction;

            return (
              <div
                key={direction}
                role="button"
                tabIndex={0}
                aria-label={ariaLabel}
                className={twMerge(
                  clsx(
                    'absolute top-0 flex h-full w-1/2 cursor-pointer items-center from-black/70 to-transparent px-4 transition-opacity duration-300 focus:outline-none focus-visible:ring-0 md:px-6',
                    side,
                    isActive
                      ? clsx('opacity-100 focus-visible:bg-gray-3/50', gradient)
                      : 'opacity-0',
                  ),
                )}
                onPointerDown={(e) => {
                  // Temporarily disable pointer events for right-click to allow
                  // context menu.
                  if (e.button === 2) {
                    const target = e.currentTarget;
                    target.style.pointerEvents = 'none';

                    requestAnimationFrame(() => {
                      // Dispatch context menu event to the image beneath.
                      const event = new MouseEvent('contextmenu', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: e.clientX,
                        clientY: e.clientY,
                      });
                      document.elementFromPoint(e.clientX, e.clientY)?.dispatchEvent(event);
                    });

                    // Re-enable after context menu closes.
                    const handleRestore = () => {
                      if (target && target.style) {
                        target.style.pointerEvents = 'auto';
                      }
                      window.removeEventListener('click', handleRestore);
                      window.removeEventListener('contextmenu', handleRestore);
                    };

                    window.addEventListener('click', handleRestore);
                    window.addEventListener('contextmenu', handleRestore);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(direction);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(direction);
                  }
                }}
                onFocus={() => setFocusedSide(direction)}
                onBlur={() => setFocusedSide(null)}
                onMouseEnter={() => setHoveredSide(direction)}
                onMouseLeave={() => setHoveredSide(null)}
              >
                <span
                  className={clsx(
                    'pointer-events-none text-gray-11',
                    isActive ? 'flex animate-in fade-in' : 'hidden',
                  )}
                >
                  {icon}
                </span>
              </div>
            );
          })
        : null}
      <Accordion.Root
        type="single"
        value={accordionValue}
        onValueChange={(value) => {
          setAccordionValue(value);

          if (!accordionTouched) {
            setTimeout(() => setAccordionTouched(true), 200);
          }
        }}
        collapsible
      >
        <div
          className={clsx(
            'pointer-events-none absolute bottom-0 left-0 w-full bg-black/50 pb-4 pl-4 md:pb-6 md:pl-6',
            'before:aria-hidden="true" before:pointer-events-none before:absolute before:-top-20 before:left-0 before:h-20 before:w-full before:bg-gradient-to-t before:from-black/50 before:to-transparent before:content-[""]',
          )}
        >
          <Accordion.Item className="flex flex-col gap-0.5" value="text">
            <div className="flex h-7 items-center justify-between">
              <div className="flex items-center">
                <Link
                  className="pointer-events-auto select-none text-nowrap font-mono text-xl text-gray-11 transition-colors hover:text-gray-12 hover:underline focus-visible:rounded"
                  href={`/all#${(image.city ?? 'IMG').toUpperCase()}-${String(image.index).padStart(4, '0')}`}
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
