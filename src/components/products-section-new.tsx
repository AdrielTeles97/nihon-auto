'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import {
    ShoppingCart,
    Eye,
    Package,
    ArrowRight,
    Loader2,
    Grid3X3
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/products'
import type { Category } from '@/types/categories'

interface ProductsApiResponse {
    success: boolean
    data: Product[]
    page: number
    perPage: number
    total: number
    totalPages: number
}

interface CategoriesApiResponse {
    success: boolean
    data: Category[]
    page: number
    perPage: number
    total: number
    totalPages: number
}

// Componente para o header de um produto no bento grid
function ProductHeader({ product }: { product: Product }) {
    return (
        <div className="relative overflow-hidden rounded-lg h-48">
            <Image
                src={product.image || '/images/placeholder-product.svg'}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover/bento:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 right-2 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300">
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0"
                    >
                        <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" className="h-8 w-8 p-0">
                        <ShoppingCart className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Componente placeholder para manter o layout
function PlaceholderCard({ className }: { className?: string }) {
    return (
        <BentoGridItem
            className={cn(
                'bg-background/40 backdrop-blur-sm border-border/30 border-dashed opacity-60 cursor-not-allowed h-full',
                className
            )}
            title={
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                        Produto em breve
                    </span>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </div>
            }
            description={
                <div className="space-y-2">
                    <div className="flex gap-1">
                        <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground border-dashed"
                        >
                            Em breve
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Novos produtos serão adicionados em breve
                    </p>
                </div>
            }
            header={
                <div className="relative overflow-hidden rounded-lg h-48 bg-muted/30 border-2 border-dashed border-muted-foreground/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                </div>
            }
            icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
    )
}

// Componente do carrossel de categorias
function CategoryCarousel() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const response = await axios.get<CategoriesApiResponse>(
                    '/api/categories',
                    {
                        params: {
                            per_page: 12,
                            hide_empty: false
                        }
                    }
                )

                // Filtrar apenas categorias com imagens
                const categoriesWithImages = response.data.data.filter(
                    cat => cat.image
                )
                setCategories(categoriesWithImages)
            } catch (err) {
                console.error('Erro ao carregar categorias:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">
                    Carregando categorias...
                </span>
            </div>
        )
    }

    if (categories.length === 0) {
        return (
            <div className="text-center py-12">
                <Grid3X3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">
                    Nenhuma categoria encontrada
                </p>
            </div>
        )
    }

    return (
        <div className="relative">
            {/* Container do carrossel */}
            <div className="relative bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl p-6 lg:p-8">
                {/* Cantos decorativos */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg" />

                {/* Container com scroll horizontal */}
                <div
                    className="overflow-x-scroll pb-4 category-scroll"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor:
                            'hsl(var(--primary) / 0.4) hsl(var(--border) / 0.2)'
                    }}
                >
                    <div
                        className="flex gap-6"
                        style={{
                            width: `${categories.length * 280}px`, // 280px = 256px (w-64) + 24px (gap-6)
                            minWidth: 'calc(100% + 200px)' // Sempre força uma largura extra para garantir scroll
                        }}
                    >
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                href={`/produtos?categoria=${category.slug}`}
                                className="flex-none w-64 min-w-64 group" // Adicionado min-w-64 para garantir largura mínima
                            >
                                <div className="relative bg-background/60 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 h-full">
                                    {/* Imagem da categoria - altura aumentada */}
                                    <div className="relative h-40 overflow-hidden">
                                        {' '}
                                        {/* Aumentado de h-32 para h-40 */}
                                        <Image
                                            src={
                                                category.image ||
                                                '/images/placeholder-product.svg'
                                            }
                                            alt={category.name}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            sizes="256px"
                                        />
                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        {/* Badge com contador */}
                                        <div className="absolute top-3 right-3">
                                            <Badge
                                                variant="secondary"
                                                className="bg-background/90 backdrop-blur-sm text-xs font-medium"
                                            >
                                                {category.count}{' '}
                                                {category.count === 1
                                                    ? 'produto'
                                                    : 'produtos'}
                                            </Badge>
                                        </div>
                                        {/* Ícone de ação */}
                                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conteúdo da categoria - padding aumentado */}
                                    <div className="p-5">
                                        {' '}
                                        {/* Aumentado de p-4 para p-5 */}
                                        <h3 className="font-semibold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                            {' '}
                                            {/* text-sm para text-base */}
                                            {category.name}
                                        </h3>
                                        {category.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {' '}
                                                {/* text-xs para text-sm */}
                                                {category.description}
                                            </p>
                                        )}
                                        {/* Indicador visual de clique */}
                                        <div className="flex items-center mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="font-medium">
                                                Ver produtos
                                            </span>
                                            <ArrowRight className="h-3 w-3 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Indicador de scroll */}
                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 backdrop-blur-sm rounded-full px-3 py-1 border border-border/30">
                        <span>Deslize para ver mais categorias</span>
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                            <div className="w-1 h-1 bg-primary/50 rounded-full animate-pulse delay-100" />
                            <div className="w-1 h-1 bg-primary/30 rounded-full animate-pulse delay-200" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ProductsSection() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                console.log('Buscando produtos...')
                const response = await axios.get<ProductsApiResponse>(
                    '/api/products',
                    {
                        params: {
                            per_page: 6,
                            orderby: 'date',
                            order: 'desc'
                        }
                    }
                )

                console.log('Resposta da API:', response.data)
                setProducts(response.data.data || [])
            } catch (err) {
                console.error('Erro ao carregar produtos:', err)
                setError(
                    err instanceof Error ? err.message : 'Erro desconhecido'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    if (loading) {
        return (
            <section id="produtos" className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-4">
                            Nossos Produtos
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                            Equipamentos profissionais de telecomunicações com
                            qualidade garantida para suas instalações e
                            projetos.
                        </p>
                    </div>
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section id="produtos" className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-playfair text-3xl lg:text-4xl font-bold mb-4">
                            Nossos Produtos
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
                            Equipamentos profissionais de telecomunicações com
                            qualidade garantida para suas instalações e
                            projetos.
                        </p>
                    </div>
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            Erro ao carregar produtos: {error}
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => window.location.reload()}
                        >
                            Tentar novamente
                        </Button>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section
            id="produtos"
            className="py-20 bg-background relative overflow-hidden"
        >
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
                {/* Banner de produtos em destaque */}
                <div className="mb-16">
                    <div className="relative w-full h-48 md:h-60 lg:h-72 rounded-2xl overflow-hidden">
                        <Image
                            src="/images/banner-produtos-em-destaque.png"
                            alt="Produtos em Destaque"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                            priority
                        />
                        {/* Overlay sutil para melhor legibilidade */}
                        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" /> */}
                    </div>

                    {/* Linha decorativa */}
                    <div className="flex items-center justify-center mt-8 mb-12">
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full max-w-xs" />
                        <div className="mx-4 w-2 h-2 rounded-full bg-primary" />
                        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full max-w-xs" />
                    </div>
                </div>

                {/* Container principal com divisões modernas */}
                <div className="relative">
                    {/* Linha vertical decorativa à esquerda */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />

                    {/* Linha vertical decorativa à direita */}
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent hidden lg:block" />

                    {/* Container interno com padding das linhas */}
                    <div className="lg:px-8">
                        {/* Bento Grid com Produtos */}
                        <div className="relative">
                            {/* Container do bento grid com bordas */}
                            <div className="relative bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl p-6 lg:p-8">
                                {/* Canto decorativo superior esquerdo */}
                                <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg" />

                                {/* Canto decorativo inferior direito */}
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg" />

                                <BentoGrid className="mb-8">
                                    {Array.from({ length: 6 }, (_, index) => {
                                        const product = products[index]

                                        // Layout mais simples e estável - 3 colunas, 2 linhas
                                        const itemClasses = [
                                            'md:col-span-2', // Primeiro item ocupa 2 colunas
                                            'md:col-span-1', // Segunda posição
                                            'md:col-span-1', // Terceira posição (completa primeira linha)
                                            'md:col-span-1', // Quarta posição (primeira da segunda linha)
                                            'md:col-span-1', // Quinta posição
                                            'md:col-span-1' // Sexta posição (completa segunda linha)
                                        ]

                                        if (product) {
                                            // Renderizar produto real
                                            return (
                                                <Link
                                                    key={product.id}
                                                    href={`/produtos/${product.id}`}
                                                >
                                                    <BentoGridItem
                                                        className={`cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 h-full ${
                                                            itemClasses[
                                                                index
                                                            ] || 'md:col-span-1'
                                                        }`}
                                                        title={
                                                            <div className="flex items-start justify-between">
                                                                <span className="text-sm font-medium leading-tight line-clamp-2 text-foreground">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </span>
                                                                <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300 flex-shrink-0 text-primary" />
                                                            </div>
                                                        }
                                                        description={
                                                            <div className="space-y-2">
                                                                {product.categories &&
                                                                    product
                                                                        .categories
                                                                        .length >
                                                                        0 && (
                                                                        <div className="flex flex-wrap gap-1">
                                                                            {product.categories
                                                                                .slice(
                                                                                    0,
                                                                                    2
                                                                                )
                                                                                .map(
                                                                                    category => (
                                                                                        <Badge
                                                                                            key={
                                                                                                category.id
                                                                                            }
                                                                                            variant="secondary"
                                                                                            className="text-xs bg-primary/10 text-primary border-primary/20"
                                                                                        >
                                                                                            {
                                                                                                category.name
                                                                                            }
                                                                                        </Badge>
                                                                                    )
                                                                                )}
                                                                        </div>
                                                                    )}
                                                                {product.brands &&
                                                                    product
                                                                        .brands
                                                                        .length >
                                                                        0 && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            <span className="text-primary font-medium">
                                                                                Marca:
                                                                            </span>{' '}
                                                                            {
                                                                                product
                                                                                    .brands[0]
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                    )}
                                                                {product.code && (
                                                                    <p className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                                                                        Cód:{' '}
                                                                        {
                                                                            product.code
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        }
                                                        header={
                                                            <ProductHeader
                                                                product={
                                                                    product
                                                                }
                                                            />
                                                        }
                                                        icon={
                                                            <Package className="h-4 w-4 text-primary" />
                                                        }
                                                    />
                                                </Link>
                                            )
                                        } else {
                                            // Renderizar placeholder
                                            return (
                                                <PlaceholderCard
                                                    key={`placeholder-${index}`}
                                                    className={
                                                        itemClasses[index] ||
                                                        'md:col-span-1'
                                                    }
                                                />
                                            )
                                        }
                                    })}
                                </BentoGrid>

                                {/* Botão Ver todos os produtos dentro do container */}
                                <div className="text-center">
                                    <Button size="lg" className="group" asChild>
                                        <Link
                                            href="/produtos"
                                            className="flex items-center gap-2"
                                        >
                                            Ver todos os produtos
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção Parceiros Nihon */}
                <div className="mt-24">
                    {/* Banner de parceiros nihon */}
                    <div className="mb-16">
                        <div className="relative w-full h-48 md:h-60 lg:h-72 rounded-2xl overflow-hidden">
                            <Image
                                src="/images/banner-parceiros-nihon.png"
                                alt="Parceiros Nihon"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                            />
                        </div>

                        {/* Linha decorativa */}
                        <div className="flex items-center justify-center mt-8 mb-12">
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full max-w-xs" />
                            <div className="mx-4 w-2 h-2 rounded-full bg-primary" />
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full max-w-xs" />
                        </div>
                    </div>
                </div>

                {/* Seção Explore por Categorias */}
                <div className="mt-24">
                    {/* Banner explore por categorias */}
                    <div className="mb-16">
                        <div className="relative w-full h-48 md:h-60 lg:h-72 rounded-2xl overflow-hidden">
                            <Image
                                src="/images/banner-explore-por-categoria.png"
                                alt="Explore por Categorias"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                            />
                            {/* Overlay sutil para melhor legibilidade */}
                            {/* <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" /> */}
                        </div>

                        {/* Linha decorativa */}
                        <div className="flex items-center justify-center mt-8 mb-12">
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full max-w-xs" />
                            <div className="mx-4 w-2 h-2 rounded-full bg-primary" />
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full max-w-xs" />
                        </div>
                    </div>

                    {/* Carrossel de Categorias */}
                    <CategoryCarousel />
                </div>
            </div>
        </section>
    )
}
