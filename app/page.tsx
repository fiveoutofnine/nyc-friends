import GalleryCarousel from './(components)/gallery-carousel';

export default function Page() {
  const images = [
    {
      src: 'https://nyc-friends-assets.fiveoutofnine.com/nyc/0000.webp',
      title: 'NYC 0000',
      description: 'NYC 0000',
    },
    {
      src: 'https://nyc-friends-assets.fiveoutofnine.com/nyc/0001.webp',
      title: 'NYC 0001',
      description: 'NYC 0001',
    },
  ];

  return (
    <main className="flex h-screen w-full items-center justify-center bg-black">
      <GalleryCarousel images={images} />
    </main>
  );
}
