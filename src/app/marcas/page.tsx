'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Loader2, Package, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import type { Brand } from '@/types/brands'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

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
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalBrands, setTotalBrands] = useState(0)
    const itemsPerPage = 24

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setLoading(true)
                console.log('Buscando marcas...')
                const response = await axios.get<BrandsApiResponse>(
                    '/api/brands',
                    {
                        params: {
                            per_page: itemsPerPage,
                            page: currentPage,
                            orderby: 'name',
                            order: 'asc',
                            ...(searchTerm && { search: searchTerm })
                        }
                    }
                )

                console.log('Resposta da API marcas:', response.data)
                setFilteredBrands(response.data.data || [])
                setTotalPages(response.data.totalPages || 1)
                setTotalBrands(response.data.total || 0)
            } catch (err) {
                console.error('Erro ao carregar marcas:', err)
                setError(
                    err instanceof Error ? err.message : 'Erro desconhecido'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchBrands()
    }, [currentPage, searchTerm, itemsPerPage])

    // Função para busca - resetar para página 1
    const handleSearch = (term: string) => {
        setSearchTerm(term)
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
            {/* Hero Section com Banner */}
            <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                <Image
                    src="/images/marcas-parceiras.png"
                    alt="Nossas Marcas"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 flex items-center justify-center"></div>
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
                    {/* Barra de busca */}
                    <div className="mb-12 max-w-md mx-auto">
                        <p className="text-center text-gray-600 mb-4">
                            Busque a sua marca favorita
                        </p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Buscar marca..."
                                value={searchTerm}
                                onChange={e => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                            />
                        </div>

                        {/* Contador de resultados */}
                        <div className="mt-4 text-center">
                            <Badge
                                variant="outline"
                                className="bg-background/50 backdrop-blur-sm"
                            >
                                {loading
                                    ? 'Carregando...'
                                    : `${totalBrands} marcas encontradas`}
                            </Badge>
                        </div>
                    </div>

                    {/* Grid de Marcas */}
                    {filteredBrands.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground">
                                {searchTerm
                                    ? 'Nenhuma marca encontrada para sua busca'
                                    : 'Nenhuma marca com produtos cadastrados encontrada'}
                            </p>
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
