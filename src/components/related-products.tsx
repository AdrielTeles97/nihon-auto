'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/types/products'
// Componente simples de skeleton inline
const Skeleton = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
)

interface RelatedProductsProps {
    productId: number
    limit?: number
    className?: string
}

interface RelatedProductsResponse {
    success: boolean
    data: Product[]
    total: number
}

export function RelatedProducts({
    productId,
    limit = 4,
    className
}: RelatedProductsProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchRelatedProducts() {
            try {
                setIsLoading(true)
                setError(null)

                const response = await fetch(
                    `/api/products/${productId}/related?limit=${limit}`,
                    {
                        headers: {
                            Accept: 'application/json',
                            'Cache-Control': 'no-cache'
                        }
                    }
                )

                if (!response.ok) {
                    throw new Error('Erro ao buscar produtos relacionados')
                }

                const data: RelatedProductsResponse = await response.json()

                if (data.success) {
                    setProducts(data.data)
                } else {
                    throw new Error('Erro na resposta da API')
                }
            } catch (err) {
                console.error('Error fetching related products:', err)
                setError(
                    err instanceof Error ? err.message : 'Erro desconhecido'
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchRelatedProducts()
    }, [productId, limit])

    if (isLoading) {
        return (
            <div className={className}>
                <h2 className="text-xl font-semibold mb-6">
                    Produtos Relacionados
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Array.from({ length: limit }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="aspect-square w-full" />
                            <CardContent className="p-4">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-4 w-2/3 mb-3" />
                                <Skeleton className="h-8 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (error || !products.length) {
        return null // Não mostrar nada se houver erro ou não houver produtos
    }

    return (
        <div className={className}>
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Produtos Relacionados
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map(product => (
                    <Card
                        key={product.id}
                        className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-gray-300"
                    >
                        <Link href={`/produtos/${product.id}`}>
                            <div className="aspect-square overflow-hidden bg-gray-50">
                                <Image
                                    src={
                                        product.image ||
                                        '/images/placeholder-product.svg'
                                    }
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                />
                            </div>
                        </Link>

                        <CardContent className="p-4">
                            <div className="space-y-3">
                                <Link
                                    href={`/produtos/${product.id}`}
                                    className="block"
                                >
                                    <h3 className="font-medium text-sm text-gray-800 line-clamp-2 hover:text-red-600 transition-colors leading-tight">
                                        {product.name}
                                    </h3>
                                </Link>

                                <div className="flex flex-wrap gap-1">
                                    {product.categories
                                        ?.slice(0, 2)
                                        .map((category, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                            >
                                                {category.name}
                                            </Badge>
                                        ))}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent text-xs"
                                        asChild
                                    >
                                        <Link href={`/produtos/${product.id}`}>
                                            {product.variations &&
                                            product.variations.length > 0
                                                ? 'Ver opções'
                                                : 'Ver produto'}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
