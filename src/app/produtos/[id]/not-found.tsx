import Link from 'next/link'
import Image from 'next/image'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { PackageX, Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <HeroHeader />
            <main className="container mx-auto px-4 py-20 md:py-24 flex-1 flex items-center justify-center">
                <div className="max-w-2xl w-full text-center space-y-8">
                    {/* Ícone Grande */}
                    <div className="flex justify-center pt-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative bg-red-50 rounded-full p-8">
                                <PackageX
                                    className="w-24 h-24 text-red-600"
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Título e Descrição */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                            Produto não encontrado
                        </h1>
                        <p className="text-lg text-gray-600 max-w-md mx-auto">
                            O produto que você está procurando não existe ou foi
                            removido do nosso catálogo.
                        </p>
                    </div>

                    {/* Sugestões */}
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
                            <Search className="w-4 h-4" />O que você pode fazer:
                        </h2>
                        <ul className="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>Verifique se o link está correto</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>
                                    Use a busca para encontrar produtos
                                    similares
                                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-600 mt-0.5">•</span>
                                <span>
                                    Navegue pelas categorias do catálogo
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="gap-2">
                            <Link href="/produtos">
                                <ArrowLeft className="w-4 h-4" />
                                Voltar aos Produtos
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="gap-2"
                        >
                            <Link href="/">
                                <Home className="w-4 h-4" />
                                Ir para Home
                            </Link>
                        </Button>
                    </div>

                    {/* Logo Nihon */}
                    <div className="pt-8 opacity-50">
                        <Image
                            src="/images/logo-nihon.png"
                            alt="Nihon Auto"
                            width={80}
                            height={80}
                            className="mx-auto grayscale"
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
