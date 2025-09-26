import { unstable_cache } from 'next/cache';

import Gallery from './(components)/gallery';

import { db } from '@/lib/db';

export default async function Page() {
  const images = await unstable_cache(async () => await db.query.images.findMany(), ['images'], {
    tags: ['images'],
    revalidate: 3_600,
  })();

  // Randomly shuffle the images.
  for (let i = images.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }

  return (
    <main className="flex h-screen w-full items-center justify-center bg-black">
      <Gallery images={images} />
    </main>
  );
}
