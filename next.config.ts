
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '7276',
        pathname: '/Images/**',
      },
      {
        protocol: 'https',
        hostname: 'elitespacenepal.premiumasp.net',
        pathname: '/Images/**',
      },
    ],
  },

}

export default nextConfig
