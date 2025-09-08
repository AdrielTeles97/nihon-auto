'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { DividerLines } from '@/components/ui/divider-lines'
import { NoiseBackground, DecorativeShape } from '@/components/ui/noise-shapes'
import { SectionTitle } from '@/components/ui/emphasis-text'
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

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/categories')
                const data: CategoriesApiResponse = await response.json()

                if (data.success) {
                    setCategories(data.data.slice(0, 8))
                }
            } catch (error) {
                console.error('Erro ao carregar categorias:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            </div>
        )
    }

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background com noise */}
            <NoiseBackground intensity="light" />

            {/* Shapes decorativas */}
            <DecorativeShape
                variant="circle"
                color="red"
                size="md"
                className="top-32 -left-16"
            />
            <DecorativeShape
                variant="rectangle"
                color="neutral"
                size="lg"
                className="bottom-0 -right-40"
            />

            {/* Linhas divisórias */}
            <DividerLines variant="subtle" />

            <div className="relative container mx-auto px-4">
                {/* Título da seção */}
                <div className="text-center mb-16">
                    <div className="relative bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl p-6 lg:p-8">
                        <SectionTitle
                            title="Explore nossas"
                            emphasis="Categorias"
                            subtitle="Encontre exatamente o que precisa para seu veículo japonês"
                        />
                    </div>
                </div>

                {/* Grid de categorias */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className="group animate-in fade-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <Link href={`/produtos?categoria=${category.slug}`}>
                                <div className="relative bg-background/60 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 hover:scale-[1.02] hover:border-red-500/30 h-full">
                                    {/* Noise background sutil */}
                                    <NoiseBackground
                                        intensity="light"
                                        className="rounded-xl"
                                    />

                                    <div className="relative p-4 text-center">
                                        <div className="relative h-32 mb-4 overflow-hidden rounded-lg">
                                            <Image
                                                src={
                                                    category.image ||
                                                    '/images/placeholder-product.svg'
                                                }
                                                alt={category.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>

                                        <h3 className="font-medium mb-2 group-hover:text-red-600 transition-colors">
                                            {category.name}
                                        </h3>

                                        {category.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {category.description}
                                            </p>
                                        )}

                                        {/* Indicador de hover */}
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shape SVG decorativa */}
            <div className="absolute top-0 left-0 w-full overflow-hidden">
                <svg
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-16 rotate-180"
                >
                    <path
                        d="M1200,0H0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05C827.58,32.17,886.67,4.24,951.2,4.24Z"
                        className="fill-red-50/20"
                    />
                </svg>
            </div>
        </section>
    )
}
