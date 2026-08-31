import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        //hostname: 'schoolapp.netraverselabs.com',
        hostname: 'khaneypaniapp.runasp.net',
        //port: '80',
        port: '',
        pathname: '/Images/**',
      },
    ],
  },
}

export default nextConfig
