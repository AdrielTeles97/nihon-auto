'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { DividerLines } from '@/components/ui/divider-lines'
import { NoiseBackground, DecorativeShape } from '@/components/ui/noise-shapes'
import { SectionTitle } from '@/components/ui/emphasis-text'
import { ArrowRight, ShoppingCart, Package, Check } from 'lucide-react'
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
    isAdding,
    isAdded
}: {
    product: Product
    index: number
    onAddToCart: (product: Product) => void
    isAdding: boolean
    isAdded: boolean
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
                            {/* Linhas decorativas de fundo - Estilo moderno */}
                            <div className="absolute inset-0 opacity-[0.06]">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-900 to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-900 to-transparent" />
                                <div className="absolute top-0 left-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-black to-transparent" />
                                <div className="absolute top-0 right-1/3 w-[1px] h-full bg-gradient-to-b from-transparent via-black to-transparent" />
                                <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                                <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                            </div>

                            <Image
                                src={
                                    product.image ||
                                    '/images/placeholder-product.svg'
                                }
                                alt={product.name}
                                fill
                                className="object-contain transition-all duration-500 group-hover:scale-105 bg-white"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Botão de adicionar ao carrinho com feedback */}
                            <div
                                className={cn(
                                    'absolute bottom-2 right-2 transition-all duration-300',
                                    isAdded
                                        ? 'opacity-100'
                                        : 'opacity-0 group-hover:opacity-100'
                                )}
                            >
                                <Button
                                    size="sm"
                                    className={cn(
                                        'h-8 px-3 text-white border-none shadow-lg transition-all duration-300',
                                        isAdding &&
                                            'bg-yellow-500 hover:bg-yellow-600',
                                        isAdded &&
                                            'bg-green-500 hover:bg-green-600 scale-110',
                                        !isAdding &&
                                            !isAdded &&
                                            'bg-red-600 hover:bg-red-700'
                                    )}
                                    onClick={handleAddToCart}
                                    disabled={isAdding || isAdded}
                                >
                                    {isAdding ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : isAdded ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <ShoppingCart className="w-4 h-4" />
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

export function ProductsGrid({
    initialProducts = []
}: {
    initialProducts?: Product[]
}) {
    const [products, setProducts] = useState<Product[]>(initialProducts)
    const [isLoading, setIsLoading] = useState(initialProducts.length === 0)
    const [addingToCart, setAddingToCart] = useState<string | null>(null)
    const [addedToCart, setAddedToCart] = useState<string | null>(null)
    const { addItem } = useCart()
    const router = useRouter()

    useEffect(() => {
        if (initialProducts.length > 0) return
        async function fetchProducts() {
            try {
                const response = await fetch(
                    '/api/products?per_page=12&page=1&order=desc'
                )
                const data: ProductsApiResponse = await response.json()
                if (data.success) setProducts(data.data)
            } catch (error) {
                console.error('Erro ao carregar produtos:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [initialProducts.length])

    const handleAddToCart = async (product: Product) => {
        // Se o produto tem variações, vai para página do produto
        if (product.variations && product.variations.length > 0) {
            router.push(`/produtos/${product.id}`)
            return
        }

        // Se não tem variações, adiciona direto ao carrinho
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
                sku: product.sku,
                code: product.code,
                gallery: product.gallery
            }

            addItem(cartProduct, 1)

            // Mostrar feedback de sucesso
            setAddingToCart(null)
            setAddedToCart(product.id.toString())

            setTimeout(() => {
                setAddedToCart(null)
            }, 2000)
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error)
            setAddingToCart(null)
        }
    }

    // Só completar com placeholders se tiver produtos mas não atingir 12
    // Se não tiver nenhum produto, não mostra placeholders
    const displayProducts: (Product | null)[] = [...products]

    // Só adiciona placeholders se já tiver pelo menos 1 produto
    if (products.length > 0 && products.length < 12) {
        while (displayProducts.length < 12) {
            displayProducts.push(null)
        }
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
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-red-50/30">
            {/* Background com noise */}
            <NoiseBackground intensity="light" color="neutral" />

            {/* Shapes decorativas */}
            <DecorativeShape
                variant="circle"
                color="red"
                size="lg"
                className="top-10 -left-20 opacity-30"
            />
            <DecorativeShape
                variant="rectangle"
                color="neutral"
                size="md"
                className="bottom-20 -right-32 opacity-20"
            />

            {/* Linhas divisórias sutis em vermelho */}
            <DividerLines variant="red" />

            {/* Grid decorativo de fundo - Tom vermelho suave */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-red-300/40 to-transparent" />
                <div className="absolute top-0 left-2/4 w-[1px] h-full bg-gradient-to-b from-transparent via-red-400/50 to-transparent" />
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-red-300/40 to-transparent" />
                <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-300/40 to-transparent" />
                <div className="absolute top-2/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-400/50 to-transparent" />
                <div className="absolute bottom-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-300/40 to-transparent" />
            </div>

            {/* Gradiente decorativo no topo */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400/30 to-transparent" />

            <div className="relative container mx-auto px-4">
                {/* Título da seção - Redesenhado */}
                <div className="text-center mb-16 relative">
                    {/* Badge decorativo */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                        <Package className="w-4 h-4 text-red-600" />
                        <span className="text-sm font-medium text-red-700">
                            Premium Quality
                        </span>
                    </div>

                    {/* Título principal */}
                    <div
                        className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
                            <span className="text-gray-900">Nossos </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                                Produtos
                            </span>
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Descubra nossa seleção exclusiva de peças
                            automotivas premium
                            <span className="text-red-600 font-semibold">
                                {' '}
                                com qualidade garantida
                            </span>
                        </p>
                    </div>

                    {/* Linha decorativa */}
                    <div
                        className="flex items-center justify-center gap-3 mt-8 animate-in fade-in duration-700"
                        style={{ animationDelay: '0.2s' }}
                    >
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/50" />
                    </div>
                </div>

                {/* Grid de produtos - Layout moderno 2x2 */}
                <div className="relative mb-16">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
                                    isAdded={
                                        addedToCart === product.id.toString()
                                    }
                                />
                            ) : (
                                <ProductPlaceholder
                                    key={`placeholder-${index}`}
                                    index={index}
                                />
                            )
                        )}
                    </div>
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
