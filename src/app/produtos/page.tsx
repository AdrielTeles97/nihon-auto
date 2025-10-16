import Link from 'next/link'
import { HeroHeader } from '@/components/layout/Header'
import { ProductsGrid } from '@/components/products-grid'
import { Footer } from '@/components/layout/Footer'
import { Suspense } from 'react'
import { Package, Home, ChevronRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Todos os Produtos',
    description:
        'Explore nossa linha completa de acessórios automotivos. Peças de qualidade premium para todos os modelos de veículos. Entrega para todo o Brasil.',
    keywords: [
        'produtos automotivos',
        'peças para carro',
        'acessórios automotivos',
        'catálogo de peças',
        'loja de autopeças'
    ],
    openGraph: {
        title: 'Todos os Produtos - Nihon Acessórios',
        description:
            'Explore nossa linha completa de acessórios automotivos. Peças de qualidade premium para todos os modelos de veículos.',
        type: 'website'
    },
    alternates: {
        canonical: '/produtos'
    }
}

function ProductsGridWrapper() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Carregando produtos...</p>
                    </div>
                </div>
            }
        >
            <ProductsGrid />
        </Suspense>
    )
}

export default function ProdutosPage() {
    return (
        <div className="min-h-screen bg-background pt-20 flex flex-col">
            <HeroHeader />
            <main className="flex-1">
                {/* Hero Section Moderna */}
                <div className="relative bg-gradient-to-br from-red-500 via-red-400 to-red-500 text-white py-16 pt-24 overflow-hidden">
                    {/* Overlay para melhorar contraste do texto */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/40 via-transparent to-red-600/40" />

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
                        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
                        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
                    </div>

                    {/* Shapes Decorativas */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

                    <div className="container mx-auto px-4 relative">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-2 text-sm text-white/80 mb-6 animate-in fade-in slide-in-from-left-4 duration-500">
                            <Link
                                href="/"
                                className="flex items-center gap-1 hover:text-white transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                <span>Início</span>
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-white font-medium">
                                Produtos
                            </span>
                        </nav>

                        {/* Título */}
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                <Package className="w-10 h-10" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2">
                                    Nossos Produtos
                                </h1>
                                <p className="text-lg md:text-xl text-white/90">
                                    Explore nossa linha completa de acessórios
                                    automotivos
                                </p>
                            </div>
                        </div>

                        {/* Stats ou Info Cards */}
                        <div
                            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: '0.1s' }}
                        >
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <div>
                                        <p className="text-sm text-white/80">
                                            Qualidade
                                        </p>
                                        <p className="font-bold">
                                            Premium Garantida
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <div>
                                        <p className="text-sm text-white/80">
                                            Entrega
                                        </p>
                                        <p className="font-bold">
                                            Para Todo Brasil
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                    <div>
                                        <p className="text-sm text-white/80">
                                            Atendimento
                                        </p>
                                        <p className="font-bold">
                                            Especializado
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wave Divider */}
                    <div className="absolute bottom-0 left-0 right-0">
                        <svg
                            viewBox="0 0 1440 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-auto"
                        >
                            <path
                                d="M0 48h1440V0c-240 48-480 48-720 24C480 0 240 0 0 24v24z"
                                fill="currentColor"
                                className="text-background"
                            />
                        </svg>
                    </div>
                </div>

                {/* Grid de Produtos */}
                <div className="container mx-auto px-4 py-8">
                    <ProductsGridWrapper />
                </div>
            </main>
            <Footer />
        </div>
    )
}
