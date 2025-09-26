import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nyc-friends-assets.fiveoutofnine.com',
        port: '',
        pathname: '',
        search: '',
      },
    ],
  },
};

export default nextConfig;
