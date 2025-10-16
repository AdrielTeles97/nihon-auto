import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/contexts/cart-context'

export const metadata: Metadata = {
    metadataBase: new URL('https://nihonacessoriosautomotivos.com.br'),
    title: {
        default: 'Nihon Acessórios Automotivos - Catálogo Virtual',
        template: '%s | Nihon Acessórios'
    },
    description:
        'Catálogo virtual de produtos automotivos da Nihon Acessórios Automotivos. Encontre as melhores peças e acessórios para seu veículo com qualidade premium garantida.',
    keywords: [
        'nihon peças e acessórios automotivos',
        'produtos automotivos',
        'peças automotivas',
        'acessórios para carro',
        'catálogo automotivo',
        'frisos automotivos',
        'áudio e vídeo automotivo',
        'peças originais'
    ],
    authors: [{ name: 'Nihon Acessórios Automotivos' }],
    creator: 'Nihon Acessórios Automotivos',
    publisher: 'Nihon Acessórios Automotivos',
    formatDetection: {
        email: false,
        address: false,
        telephone: false
    },
    openGraph: {
        type: 'website',
        locale: 'pt_BR',
        url: 'https://nihonacessoriosautomotivos.com.br',
        siteName: 'Nihon Acessórios Automotivos',
        title: 'Nihon Acessórios Automotivos - Catálogo Virtual',
        description:
            'Catálogo virtual de produtos automotivos. Encontre as melhores peças e acessórios para seu veículo com qualidade premium garantida.',
        images: [
            {
                url: '/images/logo-nihon.png',
                width: 1200,
                height: 630,
                alt: 'Nihon Acessórios Automotivos'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Nihon Acessórios Automotivos - Catálogo Virtual',
        description:
            'Catálogo virtual de produtos automotivos. Encontre as melhores peças e acessórios para seu veículo.',
        images: ['/images/logo-nihon.png']
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },
    verification: {
        // Adicione suas keys de verificação aqui quando tiver
        // google: 'seu-codigo-google-search-console',
        // yandex: 'seu-codigo-yandex',
        // bing: 'seu-codigo-bing'
    }
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
