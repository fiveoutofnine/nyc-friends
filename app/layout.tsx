import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import LocalFont from 'next/font/local';

import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import clsx from 'clsx';

import { Toaster } from '@/components/ui';

// -----------------------------------------------------------------------------
// Fonts
// -----------------------------------------------------------------------------

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const vcrOsdMono = LocalFont({
  src: '../public/static/fonts/VCR_OSD_MONO_1.001.woff2',
  variable: '--font-vcr-osd-mono',
});

// -----------------------------------------------------------------------------
// Metadata
// -----------------------------------------------------------------------------

const title = 'nyc friends';
const description = 'friend.com reviews by NYC';
const images = [
  {
    url: 'https://nyc-friends.vercel.app/images/og/home.png',
    alt: 'nyc friends OpenGraph image',
    width: 1200,
    height: 630,
  },
];

export const metadata: Metadata = {
  title: {
    template: '%s | nyc friends',
    default: title,
  },
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

export const viewport: Viewport = {
  themeColor: '#000',
  width: 'device-width',
  initialScale: 1,
};

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      className={clsx(inter.variable, vcrOsdMono.variable, 'dark')}
      style={{ background: '#000' }}
      lang="en"
    >
      <body className={clsx(inter.className, 'relative flex min-h-screen w-full flex-col')}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
