import type { Viewport } from 'next';
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
