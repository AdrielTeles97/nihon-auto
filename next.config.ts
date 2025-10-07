import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    eslint: {
        // Evita que warnings de lint quebrem o build (ex.: Vercel)
        ignoreDuringBuilds: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.nihonacessoriosautomotivos.com.br',
                port: '',
                pathname: '/**'
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
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Permite formatos modernos quando possível
        formats: ['image/avif', 'image/webp'],
        dangerouslyAllowSVG: true,
        // Evita comportamento de download em /_next/image
        contentDispositionType: 'inline'
    },
    async headers() {
        return [
            {
                // Cache agressivo para assets estáticos do diretório /public/images
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ]
    }
}

export default nextConfig
