import type { Metadata } from 'next';
import { Fragment } from 'react';

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

const title = 'wall of reviews';
const description = 'wall of friend.com reviews by NYC';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['AI companion', 'friend', 'friend.com', 'artificial intelligence', 'smart device'],
  openGraph: {
    title,
    description,
    url: 'https://nyc-friends.vercel.app',
    siteName: 'nyc friends',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title,
    description,
    creator: '@fiveoutofnine',
    creatorId: '1269561030272643076',
  },
  alternates: {
    canonical: 'https://nyc-friends.vercel.app',
  },
  robots: {
    index: false,
    follow: false,
  },
  manifest: '/manifest.json',
};

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Fragment>{children}</Fragment>;
}
