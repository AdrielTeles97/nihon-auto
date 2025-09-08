'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/cart-context'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/types/categories'
import type { Brand } from '@/types/brands'
import type { Product as APIProduct } from '@/types/products'
import type { Product as CartProduct } from '@/types'

type ProductsResponse = {
    success: boolean
    data: APIProduct[]
    page: number
    perPage: number
    total: number
    totalPages: number
}

function toCartProduct(p: APIProduct): CartProduct {
    return {
        id: p.id,
        name: p.name,
        description: p.description,
        short_description: p.shortDescription,
        price: 0,
        image: p.image || '/images/placeholder-product.svg',
        category: p.categories[0]?.name || '',
        brand: p.brands[0]?.name,
        inStock: true,
        slug: p.slug,
        gallery: p.gallery,
        specifications: undefined,
        customFields: { code: p.code ?? null }
    }
}

export function ProductsGrid() {
    const { addItem } = useCart()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [categories, setCategories] = useState<Category[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [products, setProducts] = useState<APIProduct[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [showAllTypes, setShowAllTypes] = useState(false)
    const [showAllManufacturers, setShowAllManufacturers] = useState(false)

    const selectedCategories = useMemo(
        () =>
            (searchParams.get('category') || '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean),
        [searchParams]
    )
    const selectedBrands = useMemo(
        () =>
            (searchParams.get('brand') || '')
                .split(',')
                .map(s => s.trim())
                .filter(Boolean),
        [searchParams]
    )

    // Fetch filters (once)
    useEffect(() => {
        let ignore = false
        const load = async () => {
            try {
                const [catsRes, brandsRes] = await Promise.all([
                    fetch('/api/categories').then(r => r.json()),
                    fetch('/api/brands?calc_counts=true').then(r => r.json())
                ])
                if (!ignore) {
                    setCategories(catsRes.data || [])
                    setBrands(brandsRes.data || [])
                }
            } catch {}
        }
        load()
        return () => {
            ignore = true
        }
    }, [])

    // Fetch products when filters/pagination change
    useEffect(() => {
        let ignore = false
        const load = async () => {
            setLoading(true)
            try {
                const url = new URL('/api/products', window.location.origin)
                searchParams.forEach((v, k) => url.searchParams.set(k, v))
                if (!url.searchParams.get('per_page'))
                    url.searchParams.set('per_page', '12')
                const res = await fetch(url.toString())
                const json: ProductsResponse = await res.json()
                if (!ignore) {
                    setProducts(json.data || [])
                    setPage(json.page || 1)
                    setTotalPages(json.totalPages || 1)
                }
            } finally {
                if (!ignore) setLoading(false)
            }
        }
        load()
        return () => {
            ignore = true
        }
    }, [searchParams])

    const toggleToken = (list: string[], token: string) => {
        const s = new Set(list)
        if (s.has(token)) s.delete(token)
        else s.add(token)
        return Array.from(s)
    }

    const updateQuery = (key: string, values: string[]) => {
        const params = new URLSearchParams(searchParams.toString())
        if (values.length) params.set(key, values.join(','))
        else params.delete(key)
        params.delete('page') // reset page
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleCategoryCheck = (slug: string) => {
        updateQuery('category', toggleToken(selectedCategories, slug))
    }
    const handleBrandCheck = (slug: string) => {
        updateQuery('brand', toggleToken(selectedBrands, slug))
    }

    const goToPage = (p: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(Math.max(1, Math.min(totalPages, p))))
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar com filtros */}
            <div className="lg:w-64 flex-shrink-0">
                <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b">
                        Filtrar produtos
                    </h3>

                    {/* Tipo de Produto (Categorias) */}
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            TIPO DE PRODUTO
                            <ChevronDown className="h-4 w-4 ml-auto" />
                        </h4>
                        <div className="space-y-2">
                            {(() => {
                                // Computa lista com 'Todas' no topo e sem 'Sem categoria'
                                const allCount = (categories || []).reduce(
                                    (acc, c) => acc + (c.count ?? 0),
                                    0
                                )
                                const cleaned = (categories || []).filter(
                                    c =>
                                        c.slug !== 'sem-categoria' &&
                                        c.slug !== 'uncategorized'
                                )
                                const listed = [
                                    {
                                        id: 0,
                                        slug: '__all__',
                                        name: 'Todas',
                                        count: allCount,
                                        description: '',
                                        image: null,
                                        parentId: null
                                    },
                                    ...cleaned
                                ]
                                const slice = listed.slice(
                                    0,
                                    showAllTypes ? listed.length : 5
                                )
                                return slice.map(cat => (
                                    <div
                                        key={cat.slug}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={
                                                    cat.slug === '__all__'
                                                        ? selectedCategories.length ===
                                                          0
                                                        : selectedCategories.includes(
                                                              cat.slug
                                                          )
                                                }
                                                onChange={() =>
                                                    cat.slug === '__all__'
                                                        ? updateQuery(
                                                              'category',
                                                              []
                                                          )
                                                        : handleCategoryCheck(
                                                              cat.slug
                                                          )
                                                }
                                            />
                                            <span className="text-blue-600 hover:underline">
                                                {cat.slug === '__all__'
                                                    ? 'Todas'
                                                    : cat.name}
                                            </span>
                                        </label>
                                        <span className="text-gray-500">
                                            ({cat.count ?? 0})
                                        </span>
                                    </div>
                                ))
                            })()}
                            {!showAllTypes && categories.length > 5 && (
                                <button
                                    onClick={() => setShowAllTypes(true)}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Ver mais...
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Fabricantes (Marcas) */}
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                            FABRICANTES
                            <ChevronDown className="h-4 w-4 ml-auto" />
                        </h4>
                        <div className="space-y-2">
                            {(brands || [])
                                .slice(
                                    0,
                                    showAllManufacturers ? brands.length : 5
                                )
                                .map(b => (
                                    <div
                                        key={b.slug}
                                        className="flex items-center justify-between text-sm"
                                    >
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={selectedBrands.includes(
                                                    b.slug
                                                )}
                                                onChange={() =>
                                                    handleBrandCheck(b.slug)
                                                }
                                            />
                                            <span className="text-blue-600 hover:underline">
                                                {b.name}
                                            </span>
                                        </label>
                                        <span className="text-gray-500">
                                            ({b.count ?? 0})
                                        </span>
                                    </div>
                                ))}
                            {!showAllManufacturers && brands.length > 5 && (
                                <button
                                    onClick={() =>
                                        setShowAllManufacturers(true)
                                    }
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Ver mais...
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de produtos */}
            <div className="flex-1">
                {loading && (
                    <div className="text-sm text-muted-foreground mb-3">
                        Carregando produtos...
                    </div>
                )}

                {/* Quando não há produtos e não está carregando */}
                {!loading && products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-gray-500 mb-4">
                            <svg
                                className="w-16 h-16 mx-auto mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum produto encontrado
                        </h3>
                        <p className="text-gray-500 text-center max-w-md">
                            Não encontramos produtos que correspondam aos seus
                            critérios de busca. Tente ajustar os filtros ou usar
                            termos diferentes.
                        </p>
                    </div>
                )}

                {/* Grid de produtos - só aparece quando há produtos */}
                {products.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <Card
                                key={product.id}
                                className="hover:shadow-lg transition-shadow"
                            >
                                <CardContent className="p-4">
                                    <Link href={`/produtos/${product.id}`}>
                                        <div className="aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                                            <Image
                                                src={
                                                    product.image ||
                                                    '/images/placeholder-product.svg'
                                                }
                                                alt={product.name}
                                                className="w-full h-full object-contain"
                                                width={200}
                                                height={200}
                                                unoptimized
                                            />
                                        </div>
                                    </Link>
                                    <div className="text-xs text-gray-500 mb-1">
                                        Cod:{' '}
                                        {product.code ||
                                            product.slug ||
                                            product.id}
                                    </div>
                                    <Link
                                        href={`/produtos/${product.id}`}
                                        className="block"
                                    >
                                        <h3 className="font-medium text-sm text-gray-800 mb-3 line-clamp-2 hover:underline">
                                            {product.name}
                                        </h3>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent mb-4 cursor-pointer"
                                    >
                                        Orçamento
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-red-600 border-red-600 hover:bg-red-50 bg-transparent cursor-pointer"
                                        onClick={() => {
                                            addItem(toCartProduct(product), 1)
                                            router.push('/carrinho')
                                        }}
                                    >
                                        Adicionar ao carinho
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Paginação - só aparece quando há produtos */}
                {products.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => goToPage(page - 1)}
                        >
                            Anterior
                        </Button>
                        {Array.from({ length: Math.max(1, totalPages) })
                            .slice(0, 7)
                            .map((_, i) => {
                                const p = i + 1
                                return (
                                    <Button
                                        key={p}
                                        variant={
                                            p === page ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() => goToPage(p)}
                                    >
                                        {p}
                                    </Button>
                                )
                            })}
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => goToPage(page + 1)}
                        >
                            Próxima
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
