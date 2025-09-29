import { unstable_cache } from 'next/cache';

import CustomMDX from './(components)/custom-mdx';
import { serialize } from 'next-mdx-remote/serialize';

import { db } from '@/lib/db';

import Friend from '@/components/common/friend';

export default async function Page() {
  const mdxSource = await unstable_cache(
    async () => {
      const images = await db.query.images.findMany({
        orderBy: (images, { asc }) => [asc(images.index)],
      });

      const allText = images.map((image) => image.text).join('\n');
      return await serialize(allText.replaceAll('friend', '<Friend />'), {
        parseFrontmatter: false,
        mdxOptions: {
          development: false,
        },
      });
    },
    ['images-wall'],
    {
      tags: ['images-wall'],
      revalidate: 3_600,
    },
  )();

  return (
    <main className="flex min-h-screen flex-col bg-black">
      <nav className="sticky top-0 z-30 flex w-full items-center bg-black/50 p-4 backdrop-blur md:p-6">
        <Friend height={24} />
      </nav>
      <section className="relative whitespace-pre px-4 pb-4 text-3xl leading-relaxed text-gray-12 md:px-6 md:pb-6">
        <article className="mr-auto text-wrap">
          <CustomMDX mdxSource={mdxSource} />
        </article>
      </section>
    </main>
  );
}
