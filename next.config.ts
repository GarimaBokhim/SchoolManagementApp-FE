
import type { NextConfig } from 'next'

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'https://localhost:7276'

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

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${API_URL}/api/:path*`,
        },
      ],
    }
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },
}

export default nextConfig
