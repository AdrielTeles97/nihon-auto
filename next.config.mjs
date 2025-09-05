/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Ignora erros de ESLint durante o build (Vercel)
        ignoreDuringBuilds: true
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'darksalmon-cobra-736244.hostingersite.com',
                port: '',
                pathname: '/wp-content/uploads/**'
            }
        ]
    }
}

export default nextConfig
