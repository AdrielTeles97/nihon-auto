import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'

export const metadata: Metadata = {
    title: 'Nihon Acessórios automotivos - Catálogo Virtual',
    description:
        'Catálogo virtual de produtos automotivos da Nihon Acessórios Automotivos. Encontre as melhores peças e acessórios para seu veículo.',
    keywords:
        'nihon peças e acessórios automotivos, produtos automotivos, peças, acessórios, catálogo'
}

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-BR" className={`${manrope.variable}`}>
            <head>
                {/* Preconnect/DNS Prefetch para hosts externos usados com frequência */}
                <link
                    rel="preconnect"
                    href="https://https://nihonacessoriosautomotivos.com.br/"
                    crossOrigin="anonymous"
                />
                <link
                    rel="dns-prefetch"
                    href="//https://nihonacessoriosautomotivos.com.br/"
                />
                <link
                    rel="preconnect"
                    href="https://ik.imagekit.io"
                    crossOrigin="anonymous"
                />
                <link rel="dns-prefetch" href="//ik.imagekit.io" />
                <link
                    rel="preconnect"
                    href="https://images.unsplash.com"
                    crossOrigin="anonymous"
                />
                <link rel="dns-prefetch" href="//images.unsplash.com" />
            </head>
            <body className={`${manrope.className} antialiased`}>
                <CartProvider>{children}</CartProvider>
            </body>
        </html>
    )
}
