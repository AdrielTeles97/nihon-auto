import Link from 'next/link'
import Image from 'next/image'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
            <HeroHeader />
            <main className="container mx-auto px-4 py-20 md:py-24 flex-1 flex items-center justify-center">
                <div className="max-w-3xl w-full">
                    <div className="text-center space-y-8">
                        {/* Logo Nihon */}
                        <div className="flex justify-center animate-in fade-in slide-in-from-top-4 duration-700 pt-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-600/10 rounded-full blur-3xl"></div>
                                <Image
                                    src="/images/logo-nihon.png"
                                    alt="Nihon Auto"
                                    width={120}
                                    height={120}
                                    className="relative"
                                    priority
                                />
                            </div>
                        </div>

                        {/* 404 Grande */}
                        <div
                            className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: '0.1s' }}
                        >
                            <h1 className="text-9xl md:text-[12rem] font-black text-gray-200 leading-none select-none">
                                404
                            </h1>
                            <div className="relative -mt-16 md:-mt-20">
                                <div className="inline-flex items-center justify-center bg-white rounded-full p-6 shadow-xl border-4 border-gray-100">
                                    <FileQuestion
                                        className="w-16 h-16 text-red-600"
                                        strokeWidth={1.5}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Título e Descrição */}
                        <div
                            className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: '0.2s' }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Página não encontrada
                            </h2>
                            <p className="text-lg text-gray-600 max-w-lg mx-auto">
                                Ops! A página que você está procurando não
                                existe ou foi movida para outro endereço.
                            </p>
                        </div>

                        {/* Cards de Sugestões */}
                        <div
                            className="grid md:grid-cols-3 gap-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: '0.3s' }}
                        >
                            <Link
                                href="/"
                                className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-red-500 transition-all duration-200 hover:shadow-lg"
                            >
                                <Home className="w-8 h-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Página Inicial
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Voltar para o início
                                </p>
                            </Link>

                            <Link
                                href="/produtos"
                                className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-red-500 transition-all duration-200 hover:shadow-lg"
                            >
                                <Search className="w-8 h-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Catálogo
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Ver todos os produtos
                                </p>
                            </Link>

                            <Link
                                href="/atendimento"
                                className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-red-500 transition-all duration-200 hover:shadow-lg"
                            >
                                <svg
                                    className="w-8 h-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Atendimento
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Fale conosco
                                </p>
                            </Link>
                        </div>

                        {/* Botão Principal */}
                        <div
                            className="pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                            style={{ animationDelay: '0.4s' }}
                        >
                            <Button asChild size="lg" className="gap-2 px-8">
                                <Link href="/">
                                    <ArrowLeft className="w-4 h-4" />
                                    Voltar para Home
                                </Link>
                            </Button>
                        </div>

                        {/* Mensagem de Suporte */}
                        <div
                            className="pt-8 animate-in fade-in duration-700"
                            style={{ animationDelay: '0.5s' }}
                        >
                            <p className="text-sm text-gray-500">
                                Precisa de ajuda? Entre em contato com nosso{' '}
                                <Link
                                    href="/atendimento"
                                    className="text-red-600 hover:text-red-700 font-medium underline"
                                >
                                    atendimento
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
