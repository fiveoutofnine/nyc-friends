'use client';

import { default as NextImage } from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import { Share } from 'lucide-react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

import { useTransition } from '@/lib/contexts/transition';
import type { Image } from '@/lib/db/schema';

import CustomMDX from '@/components/templates/custom-mdx';
import { IconButton, toast } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type GalleryImageProps = {
  image: Image & { mdxSource?: MDXRemoteSerializeResult };
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const GalleryImage: React.FC<GalleryImageProps> = ({ image }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const { setTransitionImage } = useTransition();
  const imageRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const isTouchScreen = mounted ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) : false;

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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        setTransitionImage({
          url: image.url,
          index: image.index,
          rect,
        });

        // Small delay to ensure the transition state is set.
        setTimeout(() => {
          router.push(`/?img=${image.index}`);
        }, 50);
      }
    },
    [image, router, setTransitionImage],
  );

  return (
    <a
      ref={imageRef}
      key={image.id}
      href={`/?img=${image.index}`}
      onClick={handleClick}
      className="group relative w-full overflow-hidden border border-gray-7 bg-gray-3 transition-colors hover:border-gray-8"
      style={{
        aspectRatio: '1 / 1',
      }}
    >
      <NextImage
        src={image.url}
        alt={image.text}
        width={image.width}
        height={image.height}
        className="animate-fadeIn h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        draggable={false}
      />
      <div
        className={clsx(
          'pointer-events-none absolute inset-0 h-[1.875rem] -translate-y-full bg-black/50 px-2.5 pt-2.5 font-mono text-base leading-5 text-gray-12 transition-all group-hover:translate-y-0',
          'after:aria-hidden="true" after:pointer-events-none after:absolute after:-bottom-20 after:left-0 after:h-20 after:w-full after:bg-gradient-to-b after:from-black/50 after:to-transparent after:content-[""]',
          isTouchScreen ? 'hidden' : 'flex',
        )}
      >
        {(image.city ?? 'IMG').toUpperCase()}_{String(image.index).padStart(4, '0')}
      </div>
      <IconButton
        className={clsx(
          'absolute right-1.5 top-1.5',
          isTouchScreen
            ? 'flex'
            : 'hidden group-hover:flex group-hover:animate-in group-hover:fade-in',
        )}
        size="md"
        variant="ghost"
        aria-label="Share image"
        onClick={(e) => {
          e.preventDefault();
          share();
        }}
      >
        <Share />
      </IconButton>
      <div
        className={clsx(
          'pointer-events-none absolute bottom-0 left-0 right-0 bg-black/50 px-2.5 pb-2.5',
          'before:aria-hidden="true" before:pointer-events-none before:absolute before:-top-20 before:left-0 before:h-20 before:w-full before:bg-gradient-to-t before:from-black/50 before:to-transparent before:content-[""]',
        )}
      >
        <div className="line-clamp-1 select-none flex-wrap whitespace-pre-wrap text-base leading-5">
          {mounted && image.mdxSource ? <CustomMDX {...image.mdxSource} /> : image.text}
        </div>
      </div>
    </a>
  );
};

export default GalleryImage;
