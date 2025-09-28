import type { Metadata } from 'next';
import { Fragment } from 'react';

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

const title = 'all reviews';
const description = 'all friend.com reviews by NYC';
const images = [
  {
    url: 'https://nyc-friends.vercel.app/images/og/home.png',
    alt: 'nyc friends OpenGraph image',
    width: 1408,
    height: 736,
  },
];

export const metadata: Metadata = {
  title,
  description,
  keywords: ['AI companion', 'friend', 'friend.com', 'artificial intelligence', 'smart device'],
  openGraph: {
    title,
    description,
    images,
    url: 'https://nyc-friends.vercel.app',
    siteName: 'nyc friends',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title,
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

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Fragment>{children}</Fragment>;
}
