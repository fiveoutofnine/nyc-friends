import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

import { serialize } from 'next-mdx-remote/serialize';

import { db } from '@/lib/db';

export async function GET() {
  const images = await unstable_cache(async () => await db.query.images.findMany(), ['images'], {
    tags: ['images'],
    revalidate: 3_600,
  })();

  // Randomly shuffle the images.
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  // Serialize MDX content for each image
  const serializedImages = await Promise.all(
    images.map(async (image) => {
      try {
        const mdxSource = await serialize(image.text);
        return {
          ...image,
          mdxSource,
        };
      } catch (error) {
        // If MDX serialization fails, return the original text
        console.error('MDX serialization failed for image:', image.id, error);
        return {
          ...image,
          mdxSource: await serialize(image.text, { parseFrontmatter: false }),
        };
      }
    }),
  );

  return NextResponse.json(serializedImages);
}
