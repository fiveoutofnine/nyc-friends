import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import { Fragment } from 'react';

import Gallery from './(components)/gallery';
import { serialize } from 'next-mdx-remote/serialize';

import { db } from '@/lib/db';
import type { Image } from '@/lib/db/schema';

import Friend from '@/components/common/friend';

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ img?: string }>;
}): Promise<Metadata> {
  const { img } = await searchParams;

  let image: Image | undefined = undefined;
  if (img) {
    const index = parseInt(img);
    if (!isNaN(index)) {
      image = await unstable_cache(
        async () =>
          await db.query.images.findFirst({
            where: (images, { eq }) => eq(images.index, index),
          }),
        [`image-${index}`],
        {
          tags: [`image-${index}`],
          revalidate: 3_600,
        },
      )();
    }
  }

  const title = image?.index ? `friend.com review #${image.index}` : 'nyc friends';
  const description = image?.text ?? 'friend.com reviews by NYC';
  const images = [
    {
      url: image?.url ?? 'https://nyc-friends.vercel.app/images/og/home.png',
      alt:
        image?.index !== undefined
          ? `nyc friend.com review #${image.index}`
          : 'nyc friends OpenGraph image',
      width: image?.width ?? 1408,
      height: image?.height ?? 736,
    },
  ];

  return {
    title: {
      template: '%s | nyc friends',
      default: title,
    },
    description,
    keywords: ['AI companion', 'friend', 'friend.com', 'artificial intelligence', 'smart device'],
    openGraph: {
      title: image?.text ? description : title,
      description,
      images,
      url: 'https://nyc-friends.vercel.app',
      siteName: 'nyc friends',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      title: image?.text ? description : title,
      description,
      images,
      card: 'summary_large_image',
      creator: '@fiveoutofnine',
      creatorId: '1269561030272643076',
    },
    alternates: {
      canonical: 'https://nyc-friends.vercel.app',
    },
    manifest: '/manifest.json',
  };
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default async function Page({ searchParams }: { searchParams: Promise<{ img?: string }> }) {
  const images = await unstable_cache(
    async () => {
      const images = await db.query.images.findMany({
        orderBy: (images, { asc }) => [asc(images.index)],
      });

      return await Promise.all(
        images.map(async (image) => {
          let mdxSource = undefined;
          try {
            mdxSource = await serialize(image.text.replaceAll('friend', '<Friend />'), {
              parseFrontmatter: false,
              mdxOptions: {
                development: false,
              },
            });
          } catch (error) {
            console.error('MDX serialization failed for image:', image.id, error);
          }

          return {
            ...image,
            mdxSource,
          };
        }),
      );
    },
    ['images'],
    {
      tags: ['images'],
      revalidate: 3_600,
    },
  )();

  // Randomly shuffle the images.
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  const { img } = await searchParams;

  // If `img` query param is provided, swap that image to position 0.
  if (img) {
    const index = parseInt(img);
    if (!isNaN(index)) {
      const foundIndex = images.findIndex((img) => img.index === index);
      if (foundIndex !== -1 && foundIndex !== 0) {
        // Swap the found image with the first image.
        [images[0], images[foundIndex]] = [images[foundIndex], images[0]];
      }
    }
  }

  return (
    <Fragment>
      <main className="flex h-screen w-full items-center justify-center bg-black">
        <Gallery images={images} />
        <Friend className="absolute left-4 top-4 md:left-6 md:top-6" height={24} />
      </main>
    </Fragment>
  );
}
