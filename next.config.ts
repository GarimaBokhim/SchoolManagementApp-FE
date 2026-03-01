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
  eslint: {
    // Ignore ESLint warnings during build, only show errors
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
