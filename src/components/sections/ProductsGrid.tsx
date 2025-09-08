'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { DividerLines } from '@/components/ui/divider-lines'
import { NoiseBackground, DecorativeShape } from '@/components/ui/noise-shapes'
import { SectionTitle } from '@/components/ui/emphasis-text'
import { ArrowRight, ShoppingCart, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { Product } from '@/types/products'
import { useCart } from '@/contexts/cart-context'

interface ProductsApiResponse {
    success: boolean
    data: Product[]
    page: number
    perPage: number
    total: number
    totalPages: number
}

// Componente para card de produto individual
function ProductCard({
    product,
    index,
    onAddToCart,
    isAdding
}: {
    product: Product
    index: number
    onAddToCart: (product: Product) => void
    isAdding: boolean
}) {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onAddToCart(product)
    }

    return (
        <div
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
            }}
        >
            <Link href={`/produtos/${product.id}`}>
                <BentoGridItem
                    title=""
                    description={
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium hover:text-red-600 transition-colors line-clamp-2 text-sm">
                                    {product.name}
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <div className="flex gap-1">
                                    {product.categories
                                        ?.slice(0, 2)
                                        .map((category, idx) => (
                                            <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="text-xs bg-black text-white hover:bg-red-600 transition-colors"
                                            >
                                                {category.name}
                                            </Badge>
                                        ))}
                                </div>
                                <div className="text-sm font-semibold text-red-600">
                                    Consulte preço
                                </div>
                            </div>
                        </div>
                    }
                    header={
                        <div className="relative overflow-hidden rounded-lg h-48 group">
                            <Image
                                src={
                                    product.image ||
                                    '/images/placeholder-product.svg'
                                }
                                alt={product.name}
                                fill
                                className="object-cover transition-all duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Botão de adicionar ao carrinho */}
                            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                    size="sm"
                                    className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg"
                                    onClick={handleAddToCart}
                                    disabled={isAdding}
                                >
                                    {isAdding ? (
                                        <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <ShoppingCart className="w-3 h-3" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    }
                    className={cn(
                        'relative border border-border/40 bg-background/60 backdrop-blur-sm hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 hover:border-red-500/30 group',
                        index === 3 && 'md:col-span-2',
                        index === 4 && 'md:col-span-2'
                    )}
                />
            </Link>
        </div>
    )
}

// Componente placeholder para produtos em breve
function ProductPlaceholder({ index }: { index: number }) {
    return (
        <div
            className="animate-in fade-in-0 slide-in-from-bottom-4"
            style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
            }}
        >
            <BentoGridItem
                title=""
                description=""
                header={
                    <div className="relative overflow-hidden rounded-lg h-48 bg-muted/30 border-2 border-dashed border-muted-foreground/20">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center mx-auto mb-2">
                                    <Package className="w-6 h-6 text-muted-foreground/50" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Produto em breve
                                </p>
                            </div>
                        </div>
                    </div>
                }
                className={cn(
                    'relative border border-border/40 bg-background/60 backdrop-blur-sm',
                    index === 3 && 'md:col-span-2',
                    index === 4 && 'md:col-span-2'
                )}
            />
        </div>
    )
}

export function ProductsGrid() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState<string | null>(null)
    const { addItem } = useCart()

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products?limit=6')
                const data: ProductsApiResponse = await response.json()

                if (data.success) {
                    setProducts(data.data.slice(0, 6))
                }
            } catch (error) {
                console.error('Erro ao carregar produtos:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProducts()
    }, [])

    const handleAddToCart = async (product: Product) => {
        setAddingToCart(product.id.toString())

        try {
            const cartProduct = {
                id: product.id,
                name: product.name,
                description: product.description,
                price: 0,
                image: product.image || '/images/placeholder-product.svg',
                category: product.categories?.[0]?.name || 'Sem categoria',
                inStock: true,
                slug: product.slug,
                gallery: product.gallery
            }

            addItem(cartProduct, 1)

            setTimeout(() => {
                setAddingToCart(null)
            }, 1500)
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error)
            setAddingToCart(null)
        }
    }

    // Completar com placeholders até 6 itens
    const displayProducts: (Product | null)[] = [...products]
    while (displayProducts.length < 6) {
        displayProducts.push(null)
    }

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                    Carregando produtos...
                </p>
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
                size="lg"
                className="top-10 -left-20"
            />
            <DecorativeShape
                variant="rectangle"
                color="neutral"
                size="md"
                className="bottom-20 -right-32"
            />

            {/* Linhas divisórias */}
            <DividerLines variant="subtle" />

            <div className="relative container mx-auto px-4">
                {/* Título da seção */}
                <div className="text-center mb-16">
                    <div className="relative bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl p-6 lg:p-8">
                        <SectionTitle
                            title="Nossos"
                            emphasis="Produtos"
                            subtitle="Descubra nossa seleção exclusiva de peças automotivas premium com qualidade garantida"
                        />
                    </div>
                </div>

                {/* Grid de produtos */}
                <div className="relative mb-16">
                    <BentoGrid className="max-w-4xl mx-auto">
                        {displayProducts.map((product, index) =>
                            product ? (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    onAddToCart={handleAddToCart}
                                    isAdding={
                                        addingToCart === product.id.toString()
                                    }
                                />
                            ) : (
                                <ProductPlaceholder
                                    key={`placeholder-${index}`}
                                    index={index}
                                />
                            )
                        )}
                    </BentoGrid>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <Link href="/produtos">
                        <Button
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            Ver Todos os Produtos
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
