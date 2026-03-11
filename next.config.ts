import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'schoolapp.netraverselabs.com',
        port: '',
        pathname: '/Images/**',
      },
    ],
  },
}

export default nextConfig
