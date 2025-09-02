'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowRight,
    Star,
    Play,
    ExternalLink,
    Package,
    ShoppingCart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

interface Product {
    id: number
    name: string
    price: number
    image: string
    category: string
    slug: string
}

interface Supplier {
    id: number
    name: string
    slug: string
    logo?: string
    description?: string
    website?: string
    featured?: boolean
    products?: Product[]
    banner?: string
    video?: string
    categoryCount?: number
    totalProducts?: number
    categories?: string[]
}

// Componente para Banner com Video
function SupplierBanner({ supplier }: { supplier: Supplier }) {
    const [showVideo, setShowVideo] = useState(false)

    return (
        <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl mb-8">
            {!showVideo ? (
                <>
                    <Image
                        src={
                            supplier.banner ||
                            '/images/banners/default-banner.jpg'
                        }
                        alt={`${supplier.name} banner`}
                        fill
                        className="object-cover"
                        onError={e => {
                            const target = e.target as HTMLImageElement
                            target.src = '/images/banners/default-banner.jpg'
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                    {/* Conteúdo do Banner */}
                    <div className="absolute inset-0 flex items-center justify-between p-8">
                        <div className="text-white max-w-md">
                            <h3 className="text-3xl md:text-4xl font-bold mb-2">
                                {supplier.name}
                            </h3>
                            <p className="text-lg md:text-xl opacity-90 mb-4">
                                {supplier.description}
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    variant="secondary"
                                    className="bg-white text-black hover:bg-gray-100"
                                    asChild
                                >
                                    <Link
                                        href={`/fornecedores/${supplier.slug}`}
                                    >
                                        Ver Produtos{' '}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                {supplier.website && (
                                    <Button
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-black"
                                        asChild
                                    >
                                        <a
                                            href={supplier.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Site Oficial{' '}
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Botão de Play para Vídeo */}
                        {supplier.video && (
                            <div className="hidden md:flex">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                                    onClick={() => setShowVideo(true)}
                                >
                                    <Play className="h-8 w-8 ml-1" />
                                </Button>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="relative h-full">
                    <video
                        src={supplier.video}
                        controls
                        autoPlay
                        className="w-full h-full object-cover rounded-2xl"
                        onError={() => setShowVideo(false)}
                    >
                        Seu navegador não suporta vídeos.
                    </video>
                    <Button
                        variant="ghost"
                        className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                        onClick={() => setShowVideo(false)}
                    >
                        Fechar
                    </Button>
                </div>
            )}
        </div>
    )
}

// Componente para Card de Produto
function ProductCard({ product }: { product: Product }) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-product.svg'
                    }}
                />
                <Badge className="absolute top-2 right-2 bg-red-600 text-white">
                    {product.category}
                </Badge>
            </div>
            <CardContent className="p-4">
                <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                    {product.name}
                </h4>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-red-600">
                        R$ {product.price.toFixed(2)}
                    </span>
                    <Button size="sm" variant="ghost" asChild>
                        <Link href={`/produtos/${product.slug}`}>
                            <ShoppingCart className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// Componente para Seção de Fornecedor
function SupplierSection({
    supplier,
    index
}: {
    supplier: Supplier
    index: number
}) {
    const isEven = index % 2 === 0

    return (
        <motion.section
            className={`py-16 ${isEven ? 'bg-white' : 'bg-gray-50'}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
        >
            <div className="container mx-auto px-4">
                {/* Banner/Header */}
                <SupplierBanner supplier={supplier} />

                {/* Estatísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="text-center p-4">
                        <Package className="h-8 w-8 mx-auto mb-2 text-red-600" />
                        <div className="text-2xl font-bold text-gray-900">
                            {supplier.totalProducts || 0}
                        </div>
                        <div className="text-sm text-gray-600">Produtos</div>
                    </Card>
                    <Card className="text-center p-4">
                        <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                        <div className="text-2xl font-bold text-gray-900">
                            {supplier.categoryCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Categorias</div>
                    </Card>
                    <Card className="text-center p-4">
                        <div className="text-2xl font-bold text-red-600">
                            ★★★★★
                        </div>
                        <div className="text-sm text-gray-600">Avaliação</div>
                    </Card>
                    <Card className="text-center p-4">
                        <div className="text-2xl font-bold text-green-600">
                            ✓
                        </div>
                        <div className="text-sm text-gray-600">Verificado</div>
                    </Card>
                </div>

                {/* Categorias */}
                {supplier.categories && supplier.categories.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-lg font-semibold mb-4">
                            Categorias Disponíveis
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {supplier.categories.map((category, idx) => (
                                <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-sm"
                                >
                                    {category}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Produtos */}
                {supplier.products && supplier.products.length > 0 ? (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-2xl font-bold text-gray-900">
                                Produtos em Destaque
                            </h4>
                            <Button variant="outline" asChild>
                                <Link href={`/fornecedores/${supplier.slug}`}>
                                    Ver Todos{' '}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {supplier.products.slice(0, 4).map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            Produtos em Breve
                        </h4>
                        <p className="text-gray-600 mb-6">
                            Estamos trabalhando para adicionar produtos desta
                            marca. Volte em breve!
                        </p>
                        {supplier.website && (
                            <Button variant="outline" asChild>
                                <a
                                    href={supplier.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visitar Site Oficial{' '}
                                    <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </motion.section>
    )
}

export function SupplierSections() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                setLoading(true)
                setError(null)

                // Buscar fornecedores com produtos
                const response = await fetch('/api/suppliers?products=true')

                if (response.ok) {
                    const result = await response.json()
                    if (result.success) {
                        setSuppliers(result.data)
                        console.log(
                            `✅ Carregados ${result.data.length} fornecedores:`,
                            result.data
                        )
                    } else {
                        setError('Erro ao carregar fornecedores')
                    }
                } else {
                    setError('Erro na resposta da API')
                }
            } catch (error) {
                console.error('Erro ao buscar fornecedores:', error)
                setError('Erro de conexão')
            } finally {
                setLoading(false)
            }
        }

        fetchSuppliers()
    }, [])

    if (loading) {
        return (
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando fornecedores...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="text-red-600 mb-4">⚠️ {error}</div>
                    <Button onClick={() => window.location.reload()}>
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        )
    }

    if (suppliers.length === 0) {
        return (
            <div className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum fornecedor encontrado
                    </h3>
                    <p className="text-gray-600">
                        Configure as marcas no WooCommerce para ver os
                        fornecedores.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative">
            {suppliers.map((supplier, index) => (
                <SupplierSection
                    key={supplier.id}
                    supplier={supplier}
                    index={index}
                />
            ))}
        </div>
    )
}
