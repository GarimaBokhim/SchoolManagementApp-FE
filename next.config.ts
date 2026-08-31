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
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `http://khaneypaniapp.runasp.net/api/:path*`,
        },
      ],
    }
  },
}

export default nextConfig
