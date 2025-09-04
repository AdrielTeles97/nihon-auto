import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'darksalmon-cobra-736244.hostingersite.com',
                port: '',
                pathname: '/wp-content/uploads/**'
            },
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'html.tailus.io',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**'
            }

        ],
        // Adicionar configurações para melhor performance
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        formats: ['image/webp']
    }
}

export default nextConfig
