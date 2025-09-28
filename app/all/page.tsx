import { unstable_cache } from 'next/cache';

import GalleryImage from './(components)/image';
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
            mdxSource = await serialize(
              image.text.replaceAll('friend', '<Friend size="sm" link={false} />'),
              {
                parseFrontmatter: false,
                mdxOptions: {
                  development: false,
                },
              },
            );
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
    ['images-all'],
    {
      tags: ['images-all'],
      revalidate: 3_600,
    },
  )();

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <nav className="sticky top-0 z-30 flex w-full items-center bg-black p-4 md:p-6">
        <Friend height={24} />
      </nav>
      <section className="relative px-4 pb-4 md:px-6 md:pb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image, index) => (
            <GalleryImage key={index} image={image} />
          ))}
        </div>
      </section>
    </main>
  );
}
