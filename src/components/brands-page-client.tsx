'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Package, Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Brand } from '@/types/brands'
import { DecorativeShape } from '@/components/ui/noise-shapes'
import { EmphasisText } from '@/components/ui/emphasis-text'

// Debounce simples
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])
    return debouncedValue
}

type BrandsApiResponse = {
    success: boolean
    data: Brand[]
    page: number
    perPage: number
    total: number
    totalPages: number
}

export default function BrandsPageClient({
    initialBrands,
    initialPage,
    initialTotal,
    initialTotalPages,
    itemsPerPage = 24
}: {
    initialBrands: Brand[]
    initialPage: number
    initialTotal: number
    initialTotalPages: number
    itemsPerPage?: number
}) {
    const [loading, setLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchQuery = useDebounce(searchTerm, 800)
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>(initialBrands)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalPages, setTotalPages] = useState(initialTotalPages)
    const [totalBrands, setTotalBrands] = useState(initialTotal)

    useEffect(() => {
        setSearchQuery(debouncedSearchQuery)
        setCurrentPage(1)
    }, [debouncedSearchQuery])

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setSearchLoading(true)
                const params = new URLSearchParams()
                params.set('per_page', String(itemsPerPage))
                params.set('page', String(currentPage))
                params.set('orderby', 'name')
                params.set('order', 'asc')
                if (searchQuery) params.set('search', searchQuery)

                const response = await fetch(`/api/brands?${params.toString()}`)
                const data = (await response.json()) as BrandsApiResponse

                setFilteredBrands(data.data || [])
                setTotalPages(data.totalPages || 1)
                setTotalBrands(data.total || 0)
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Erro desconhecido'
                )
            } finally {
                setLoading(false)
                setSearchLoading(false)
            }
        }

        // Se temos dados SSR válidos para o estado inicial, não refaz a busca.
        const hasInitial = initialBrands.length > 0 || initialTotal > 0
        const isInitialState = searchQuery === '' && currentPage === initialPage
        if (!(hasInitial && isInitialState)) {
            fetchBrands()
        }
    }, [currentPage, searchQuery, itemsPerPage])

    const handleSearch = (term: string) => setSearchTerm(term)
    const clearSearch = () => {
        setSearchTerm('')
        setCurrentPage(1)
    }

    return (
        <>
            {/* Hero Section Moderna */}
            <section className="relative bg-gradient-to-br from-red-500 via-red-400 to-red-500 text-white py-16 pt-24 overflow-hidden">
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
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            <span>Início</span>
                        </Link>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        <span className="text-white font-medium">Marcas</span>
                    </nav>

                    {/* Título */}
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                            <Package className="w-10 h-10" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2">
                                Nossas Marcas
                            </h1>
                            <p className="text-lg md:text-xl text-white/90">
                                Trabalhamos com as principais marcas do mercado
                                automotivo
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full" />
                                <div>
                                    <p className="text-sm text-white/80">
                                        Total de Marcas
                                    </p>
                                    <p className="font-bold">
                                        {totalBrands > 0
                                            ? `${totalBrands}+ Disponíveis`
                                            : 'Carregando...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full" />
                                <div>
                                    <p className="text-sm text-white/80">
                                        Qualidade
                                    </p>
                                    <p className="font-bold">Peças Originais</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-white rounded-full" />
                                <div>
                                    <p className="text-sm text-white/80">
                                        Garantia
                                    </p>
                                    <p className="font-bold">100% Autênticas</p>
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
            </section>

            {/* Lista */}
            <section className="py-20 bg-background relative overflow-hidden">
                {/* Linhas decorativas modernas - mais sutis */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                    <div className="absolute top-0 left-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-800 to-transparent" />
                    <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-gray-800 to-transparent" />
                    <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                    <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    {/* Busca */}
                    <div className="mb-12 max-w-lg mx-auto">
                        <p className="text-center text-gray-600 mb-4">
                            Busque a sua marca favorita
                        </p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Digite o nome da marca..."
                                value={searchTerm}
                                onChange={e => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                >
                                    <X className="h-3 w-3 text-gray-600" />
                                </button>
                            )}
                            {searchLoading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                </div>
                            )}
                        </div>
                        <div className="mt-4 text-center">
                            {searchQuery && (
                                <div className="mb-2">
                                    <Badge
                                        variant="outline"
                                        className="bg-primary/10 text-primary border-primary/20"
                                    >
                                        Buscando por: “{searchQuery}”
                                    </Badge>
                                </div>
                            )}
                            <Badge
                                variant="outline"
                                className="bg-background/50 backdrop-blur-sm"
                            >
                                {loading || searchLoading
                                    ? 'Carregando...'
                                    : searchQuery
                                    ? `${totalBrands} marca${
                                          totalBrands !== 1 ? 's' : ''
                                      } encontrada${
                                          totalBrands !== 1 ? 's' : ''
                                      }`
                                    : `${totalBrands} marcas disponíveis`}
                            </Badge>
                        </div>
                    </div>

                    {/* Grid */}
                    {filteredBrands.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl p-8 max-w-md mx-auto">
                                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                {searchQuery ? (
                                    <>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Nenhuma marca encontrada
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            Não encontramos nenhuma marca que
                                            corresponda à sua busca por “
                                            {searchQuery}”.
                                        </p>
                                        <Button
                                            variant="outline"
                                            onClick={clearSearch}
                                            className="text-primary border-primary hover:bg-primary/10"
                                        >
                                            Limpar busca
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            Nenhuma marca disponível
                                        </h3>
                                        <p className="text-muted-foreground">
                                            Não há marcas com produtos
                                            cadastrados no momento.
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {filteredBrands.map((brand, idx) => (
                                <Link
                                    key={brand.id ?? idx}
                                    href={`/produtos?brand=${encodeURIComponent(
                                        brand.slug || String(brand.id ?? '')
                                    )}`}
                                    className="group"
                                >
                                    <div className="relative border rounded-xl p-4 bg-background hover:shadow-lg transition-all duration-300 group hover:border-red-200">
                                        {/* Linha decorativa sutil */}
                                        <div className="absolute inset-0 opacity-[0.03] rounded-xl">
                                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
                                            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
                                        </div>

                                        <div className="relative aspect-video bg-muted/20 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                                            {brand.image ? (
                                                <Image
                                                    src={brand.image}
                                                    alt={brand.name}
                                                    width={320}
                                                    height={180}
                                                    className="object-contain w-full h-full"
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                                                />
                                            ) : (
                                                <div className="text-xs text-muted-foreground">
                                                    Sem imagem
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative text-sm font-medium group-hover:text-red-600 transition-colors line-clamp-2">
                                            {brand.name}
                                        </div>
                                        {brand.count ? (
                                            <div className="relative text-xs text-muted-foreground">
                                                {brand.count} produto(s)
                                            </div>
                                        ) : null}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center items-center gap-4">
                            <button
                                onClick={() =>
                                    setCurrentPage(prev =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-background/80 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                            >
                                Anterior
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from(
                                    { length: Math.min(5, totalPages) },
                                    (_, i) => {
                                        const pageNum =
                                            currentPage <= 3
                                                ? i + 1
                                                : currentPage - 2 + i
                                        if (pageNum > totalPages) return null
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() =>
                                                    setCurrentPage(pageNum)
                                                }
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-background/80 border border-border hover:bg-primary/10'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        )
                                    }
                                )}
                            </div>
                            <button
                                onClick={() =>
                                    setCurrentPage(prev =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-background/80 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 transition-colors"
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}
