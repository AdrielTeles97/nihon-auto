import type { NextConfig } from 'next'

const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL
const wpHostname = wpUrl ? new URL(wpUrl).hostname : undefined

const nextConfig: NextConfig = {
  images: {
    remotePatterns: wpHostname
      ? [
          {
            protocol: 'https',
            hostname: wpHostname,
            pathname: '/**'
          }
        ]
      : []
  }
}

export default nextConfig
