import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/contexts/CartContext'
import { Toaster } from '@/components/ui/sonner'
// import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
    title: 'Nihon Auto - Catálogo Virtual',
    description:
        'Catálogo virtual de acessórios automotivos japoneses Nihon Auto. Encontre as melhores peças e acessórios para seu veículo japonês.',
    keywords:
        'nihon auto, produtos automotivos, peças japonesas, acessórios, catálogo, toyota, honda, nissan'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="pt-BR">
            <body className="font-manrope antialiased">
                <CartProvider>
                    {children}
                    <Toaster />
                </CartProvider>
            </body>
        </html>
    )
}
