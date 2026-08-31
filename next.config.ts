import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'khaneypaniapp.runasp.net',
        port: '',
        pathname: '/Images/**',
      },
    ],
  },
}

export default nextConfig
