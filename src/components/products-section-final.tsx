'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { Cover } from '@/components/ui/cover'
import {
    ArrowRight,
    Clock,
    Truck,
    Shield,
    ShoppingCart,
    ExternalLink,
    Package
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import type { Product } from '@/types/products'
import type { Category } from '@/types/categories'
import { useCart } from '@/contexts/cart-context'

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
function ProductHeader({
    product,
    onAddToCart,
    isAdding
}: {
    product: Product
    onAddToCart: (e: React.MouseEvent) => void
    isAdding: boolean
}) {
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onAddToCart(e)
    }

    const handleViewProduct = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        window.open(`/produtos/${product.id}`, '_blank')
    }

    return (
        <div className="relative overflow-hidden rounded-lg h-48">
            <Image
                src={product.image || '/images/placeholder-product.svg'}
                alt={product.name}
                fill
                className="object-cover transition-all duration-500 group-hover/bento:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-2 right-2 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300">
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-black border-none shadow-lg"
                        onClick={handleViewProduct}
                    >
                        <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button
                        size="sm"
                        className="h-8 px-2 bg-red-600 hover:bg-red-700 text-white border-none shadow-lg"
                        onClick={handleAddToCart}
                        disabled={isAdding}
                    >
                        {isAdding ? (
                            <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart className="w-3 h-3 mr-1" />
                                <span className="text-xs">Add</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Feedback visual quando produto é adicionado */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 bg-green-600/80 flex items-center justify-center rounded-lg"
                    >
                        <div className="text-white text-sm font-medium">
                            Adicionado!
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Componente para o footer de um produto no bento grid
function ProductDescription({ product }: { product: Product }) {
    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <Link
                    href={`/produtos/${product.id}`}
                    className="font-medium hover:text-red-600 transition-colors line-clamp-2 text-sm"
                >
                    {product.name}
                </Link>
            </div>
            <div className="space-y-2">
                <div className="flex gap-1">
                    {product.categories?.slice(0, 2).map((category, index) => (
                        <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-black text-white hover:bg-black/80"
                        >
                            {category.name}
                        </Badge>
                    ))}
                </div>
                <div className="text-lg font-bold text-red-600">
                    Consulte preço
                </div>
            </div>
        </div>
    )
}

// Componente para placeholder quando não há produtos
function ProductPlaceholder() {
    return (
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
    )
}

// Componente CategoryCarousel
function CategoryCarousel() {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then((data: CategoriesApiResponse) => {
                if (data.success) {
                    setCategories(data.data.slice(0, 8))
                }
            })
            .catch(console.error)
    }, [])

    if (categories.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
                <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                >
                    <Link href={`/produtos?categoria=${category.slug}`}>
                        <div className="relative bg-background/60 backdrop-blur-sm border border-border/40 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 h-full">
                            <div className="p-4 text-center">
                                <div className="relative h-40 overflow-hidden">
                                    <Image
                                        src={
                                            category.image ||
                                            '/images/placeholder-product.svg'
                                        }
                                        alt={category.name}
                                        fill
                                        className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                                    />
                                </div>
                                <h3 className="font-medium mt-3 group-hover:text-primary transition-colors">
                                    {category.name}
                                </h3>
                                {category.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    )
}

export function ProductsSection() {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [addingToCart, setAddingToCart] = useState<string | null>(null)
    const { addItem } = useCart()
    const router = useRouter()

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products?limit=6')
                const data: ProductsApiResponse = await response.json()

                if (data.success) {
                    setProducts(data.data)
                } else {
                    console.error('Erro ao buscar produtos:', data)
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
        // Se o produto tem variações, vai para página do produto
        if (product.variations && product.variations.length > 0) {
            router.push(`/produtos/${product.id}`)
            return
        }

        // Se não tem variações, adiciona direto ao carrinho
        setAddingToCart(product.id.toString())

        try {
            // Converter para o formato do carrinho
            const cartProduct = {
                id: product.id,
                name: product.name,
                description: product.description,
                price: 0, // Produtos não tem preço, só consulta
                image: product.image || '/images/placeholder-product.svg',
                category: product.categories?.[0]?.name || 'Sem categoria',
                inStock: true,
                slug: product.slug,
                sku: product.sku,
                code: product.code,
                gallery: product.gallery
            }

            addItem(cartProduct, 1)

            // Feedback visual
            setTimeout(() => {
                setAddingToCart(null)
            }, 1500)
        } catch (error) {
            console.error('Erro ao adicionar produto ao carrinho:', error)
            setAddingToCart(null)
        }
    }

    // Completar com placeholders se necessário
    const displayProducts = [...products]
    while (displayProducts.length < 6) {
        displayProducts.push({
            id: Date.now() + displayProducts.length, // ID único
            name: 'Produto em breve',
            slug: `placeholder-${displayProducts.length}`,
            description: 'Em breve',
            image: '/images/placeholder-product.svg',
            gallery: [],
            categories: [],
            brands: []
        } as Product)
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
        <section className="relative min-h-screen bg-background overflow-hidden">
            {/* Linha horizontal superior */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Linha horizontal inferior */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Linhas verticais decorativas */}
            <div className="absolute top-0 left-16 w-px h-full bg-gradient-to-b from-transparent via-border/50 to-transparent opacity-50" />
            <div className="absolute top-0 right-16 w-px h-full bg-gradient-to-b from-transparent via-border/50 to-transparent opacity-50" />

            <div className="relative container mx-auto px-4 py-24">
                {/* Header da seção */}
                <div className="text-center mb-16">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg" />

                        <div className="relative bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl p-6 lg:p-8">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                Nossos <Cover>Produtos</Cover>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Descubra nossa seleção exclusiva de peças
                                automotivas premium com qualidade garantida
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid de produtos usando BentoGrid */}
                <div className="relative mb-16">
                    <BentoGrid className="max-w-4xl mx-auto">
                        {displayProducts.map((product, index) => (
                            <BentoGridItem
                                key={product.id}
                                title=""
                                description={
                                    product.name !== 'Produto em breve' ? (
                                        <ProductDescription product={product} />
                                    ) : undefined
                                }
                                header={
                                    product.name === 'Produto em breve' ? (
                                        <ProductPlaceholder />
                                    ) : (
                                        <ProductHeader
                                            product={product}
                                            onAddToCart={() =>
                                                handleAddToCart(product)
                                            }
                                            isAdding={
                                                addingToCart ===
                                                product.id.toString()
                                            }
                                        />
                                    )
                                }
                                className={cn(
                                    'relative border border-border/40 bg-background/60 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:border-primary/30',
                                    index === 3 && 'md:col-span-2',
                                    index === 4 && 'md:col-span-2'
                                )}
                            />
                        ))}
                    </BentoGrid>
                </div>

                {/* Call to Action */}
                <div className="text-center mb-32">
                    <Link href="/produtos">
                        <Button
                            size="lg"
                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            Ver Todos os Produtos
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                {/* Seção de Diferenciais */}
                <div className="relative mt-32 overflow-hidden bg-neutral-50 rounded-2xl">
                    {/* Linhas divisórias */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
                        <div className="absolute top-0 left-16 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent opacity-50" />
                        <div className="absolute top-0 right-16 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent opacity-50" />
                    </div>

                    <div className="relative container mx-auto px-4 py-24">
                        <div className="text-center mb-16">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                Por que escolher a{' '}
                                <Cover>Nihon acessórios</Cover>?
                            </h3>
                            <p className="text-muted-foreground">
                                Nossos diferenciais que garantem a melhor
                                experiência
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center group">
                                <div className="bg-gradient-to-br from-red-50 to-red-100/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Truck className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Entrega Rápida
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Entrega expressa para todo o Brasil
                                </p>
                            </div>

                            <div className="text-center group">
                                <div className="bg-gradient-to-br from-red-50 to-red-100/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Qualidade Garantida
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Produtos originais com garantia
                                </p>
                            </div>

                            <div className="text-center group">
                                <div className="bg-gradient-to-br from-red-50 to-red-100/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <Clock className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">
                                    Atendimento 24/7
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Suporte especializado sempre disponível
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de Categorias */}
                <div className="mt-24">
                    <div className="text-center mb-16">
                        <div className="relative">
                            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg" />

                            <div className="relative bg-background/40 backdrop-blur-sm border border-border/30 rounded-2xl p-6 lg:p-8">
                                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                                    Explore nossas <Cover>Categorias</Cover>
                                </h3>
                                <p className="text-muted-foreground">
                                    Encontre exatamente o que precisa para seu
                                    veículo
                                </p>
                            </div>
                        </div>
                    </div>

                    <CategoryCarousel />
                </div>
            </div>
        </section>
    )
}

export default ProductsSection
