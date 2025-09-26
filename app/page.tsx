import { unstable_cache } from 'next/cache';

import Gallery from './(components)/gallery';
import { serialize } from 'next-mdx-remote/serialize';

import { db } from '@/lib/db';

import Friend from '@/components/common/friend';

export default async function Page() {
  const images = await unstable_cache(
    async () => {
      const images = await db.query.images.findMany({
        orderBy: (images, { asc }) => [asc(images.index)],
      });

      return await Promise.all(
        images.map(async (image) => {
          let mdxSource = undefined;
          try {
            mdxSource = await serialize(image.text, {
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

  return (
    <main className="flex h-screen w-full items-center justify-center bg-black">
      <Gallery images={images} />
      <Friend className="absolute left-4 top-4 md:left-6 md:top-6" height={24} />
    </main>
  );
}
