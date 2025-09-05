/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora erros de ESLint durante o build (Vercel)
    ignoreDuringBuilds: true,
  },
}

export default nextConfig

