'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Package, Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import type { Brand } from '@/types/brands'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { DecorativeShape } from '@/components/ui/noise-shapes'
import { EmphasisText } from '@/components/ui/emphasis-text'

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

interface BrandsApiResponse {
    success: boolean
    data: Brand[]
    page: number
    perPage: number
    total: number
    totalPages: number
}

export default function MarcasPage() {
    const [loading, setLoading] = useState(true)
    const [searchLoading, setSearchLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchQuery = useDebounce(searchTerm, 800)
    const [searchQuery, setSearchQuery] = useState('') // Para o debounce
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalBrands, setTotalBrands] = useState(0)
    const itemsPerPage = 24

    // Debounce função
    // Update search query when debounced value changes
    useEffect(() => {
        setSearchQuery(debouncedSearchQuery)
        setCurrentPage(1)
    }, [debouncedSearchQuery])

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setSearchLoading(true)

                const response = await axios.get<BrandsApiResponse>(
                    '/api/brands',
                    {
                        params: {
                            per_page: itemsPerPage,
                            page: currentPage,
                            orderby: 'name',
                            order: 'asc',
                            ...(searchQuery && { search: searchQuery })
                        }
                    }
                )

                setFilteredBrands(response.data.data || [])
                setTotalPages(response.data.totalPages || 1)
                setTotalBrands(response.data.total || 0)
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Erro desconhecido'
                )
            } finally {
                setLoading(false)
                setSearchLoading(false)
            }
        }

        fetchBrands()
    }, [currentPage, searchQuery, itemsPerPage])

    // Função para busca - com debounce
    const handleSearch = (term: string) => {
        setSearchTerm(term)
    }

    // Função para limpar busca
    const clearSearch = () => {
        setSearchTerm('')
        setCurrentPage(1)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <HeroHeader />

                {/* Loading */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <span className="ml-3 text-muted-foreground">
                                Carregando marcas...
                            </span>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background">
                <HeroHeader />
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <HeroHeader />

            {/* Nova seção Hero moderna */}
            <section className="relative py-32 overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-red-950">
                {/* Background com noise */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `url('/noise.svg')`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '400px 400px'
                    }}
                />

                {/* Overlay escuro adicional */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Shapes decorativas */}
                <div className="absolute -top-20 -right-20 w-40 h-40 opacity-20">
                    <DecorativeShape variant="circle" />
                </div>
                <div className="absolute top-1/2 -left-16 w-32 h-32 opacity-15">
                    <DecorativeShape variant="rectangle" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-red-600/30 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-red-500/50">
                            <Package className="h-4 w-4 text-red-400" />
                            <span className="text-red-100 text-sm font-medium">
                                Nossas Marcas Parceiras
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            <EmphasisText>Marcas</EmphasisText> Parceiras
                        </h1>

                        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                            Trabalhamos com as principais marcas do mercado
                            automotivo, oferecendo produtos de qualidade e
                            confiança para o seu veículo.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Badge
                                variant="secondary"
                                className="text-lg px-4 py-2 bg-red-600/30 backdrop-blur-sm text-white border-red-500/50 hover:bg-red-600/30 cursor-default"
                            >
                                {totalBrands > 0
                                    ? `${totalBrands} Marcas Disponíveis`
                                    : 'Carregando marcas...'}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Gradiente de transição */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
            </section>

            {/* Seção de Marcas */}
            <section className="py-20 bg-background relative overflow-hidden">
                {/* Background com noise pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div
                        className="w-full h-full bg-repeat"
                        style={{
                            backgroundImage: `url('/noise.svg')`,
                            backgroundSize: '200px 200px'
                        }}
                    />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Barra de busca aprimorada */}
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

                            {/* Botão de limpar busca */}
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                >
                                    <X className="h-3 w-3 text-gray-600" />
                                </button>
                            )}

                            {/* Indicador de loading da busca */}
                            {searchLoading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                </div>
                            )}
                        </div>

                        {/* Contador de resultados aprimorado */}
                        <div className="mt-4 text-center">
                            {searchQuery && (
                                <div className="mb-2">
                                    <Badge
                                        variant="outline"
                                        className="bg-primary/10 text-primary border-primary/20"
                                    >
                                        Buscando por: &ldquo;{searchQuery}
                                        &rdquo;
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

                    {/* Grid de Marcas */}
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
                            <span className="text-muted-foreground">
                                Carregando marcas...
                            </span>
                        </div>
                    ) : filteredBrands.length === 0 ? (
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
                                            corresponda à sua busca por &ldquo;
                                            {searchQuery}&rdquo;.
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredBrands.map(brand => (
                                <Link
                                    key={brand.id}
                                    href={`/produtos?brand=${brand.slug}`}
                                    className="group"
                                >
                                    <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 p-6">
                                        {/* Logo da marca */}
                                        <div className="relative h-20 mb-4 flex items-center justify-center">
                                            <Image
                                                src={
                                                    brand.image ||
                                                    '/images/placeholder-logo.png'
                                                }
                                                alt={brand.name}
                                                fill
                                                className="object-contain transition-transform duration-300 group-hover:scale-110"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                                            />
                                        </div>

                                        {/* Nome da marca */}
                                        <div className="text-center">
                                            <h3 className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                                {brand.name}
                                            </h3>
                                        </div>

                                        {/* Overlay de hover */}
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Controles de Paginação */}
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
            <Footer />
        </div>
    )
}
