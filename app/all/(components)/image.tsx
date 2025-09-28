'use client';

import { default as NextImage } from 'next/image';
import { useEffect, useState } from 'react';

import clsx from 'clsx';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

import type { Image } from '@/lib/db/schema';

import CustomMDX from '@/components/templates/custom-mdx';

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

  useEffect(() => setMounted(true), []);
  return (
    <a
      key={image.id}
      href={`/?img=${image.index}`}
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
          'absolute bottom-0 left-0 right-0 bg-black/50 px-2.5 pb-2.5',
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
