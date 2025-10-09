'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { DividerLines } from '@/components/ui/divider-lines'
import { NoiseBackground } from '@/components/ui/noise-shapes'
import { SectionTitle } from '@/components/ui/emphasis-text'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Grid3X3 } from 'lucide-react'
import Image from 'next/image'
import type { Category } from '@/types/categories'

interface CategoriesApiResponse {
    success: boolean
    data: Category[]
    page: number
    perPage: number
    total: number
    totalPages: number
}

export function CategoriesSection() {
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [itemsPerPage] = useState(8)

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories')
                const data: CategoriesApiResponse = await response.json()

                if (data.success) {
                    setCategories(data.data)
                }
            } catch (error) {
                console.error('Erro ao carregar categorias:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    // Paginação local para evitar rolagem infinita
    const totalPages = Math.ceil(categories.length / itemsPerPage)
    const currentCategories = categories.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    )

    const nextPage = () => {
        setCurrentPage(prev => (prev + 1) % totalPages)
    }

    const prevPage = () => {
        setCurrentPage(prev => (prev - 1 + totalPages) % totalPages)
    }

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            </div>
        )
    }

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50/30">
            {/* Background com noise */}
            <NoiseBackground intensity="light" color="neutral" />

            {/* Linhas divisórias */}
            <DividerLines variant="red" />

            <div className="relative container mx-auto px-4">
                {/* Título da seção */}
                <div className="text-center mb-16">
                    <div className="relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 lg:p-8 shadow-lg">
                        <SectionTitle
                            title="Explore nossas"
                            emphasis="Categorias"
                            subtitle="Encontre exatamente o que precisa para seu veículo japonês"
                            theme="light"
                        />
                    </div>
                </div>
                {/* Controles de navegação */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Grid3X3 className="w-5 h-5" />
                            <span className="text-sm">
                                {categories.length} categorias encontradas
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                                Página {currentPage + 1} de {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    onClick={prevPage}
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                    disabled={totalPages <= 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    onClick={nextPage}
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                    disabled={totalPages <= 1}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}{' '}
                {/* Grid de categorias */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {currentCategories.map((category, index) => (
                        <div
                            key={category.id}
                            className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Link href={`/produtos?category=${category.slug}`}>
                                <div className="relative bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:scale-[1.02] hover:border-red-500/40 h-full hover:bg-white">
                                    {/* Noise background sutil */}
                                    <NoiseBackground
                                        intensity="light"
                                        color="neutral"
                                        className="rounded-xl"
                                    />

                                    <div className="relative p-4 text-center">
                                        <div className="relative h-40 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100/80">
                                            {category.image ? (
                                                <>
                                                    <Image
                                                        src={category.image}
                                                        alt={category.name}
                                                        fill
                                                        className="object-contain p-3 transition-transform duration-300 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </>
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-gray-50 group-hover:from-red-100 group-hover:via-red-50 transition-all duration-300">
                                                    <div className="text-center px-2">
                                                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                                                            {category.name.charAt(
                                                                0
                                                            )}
                                                        </div>
                                                        <p className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors line-clamp-2">
                                                            {category.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="font-medium mb-2 text-gray-900 group-hover:text-red-600 transition-colors">
                                            {category.name}
                                        </h3>

                                        {category.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {category.description}
                                            </p>
                                        )}

                                        {/* Indicador de hover */}
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                {/* Botão para ver todas as categorias */}
                {categories.length > itemsPerPage && (
                    <div className="text-center mt-12">
                        <Link href="/produtos">
                            <Button
                                size="lg"
                                className="bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 px-8 py-3"
                            >
                                Ver Todas as Categorias
                                <Grid3X3 className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
