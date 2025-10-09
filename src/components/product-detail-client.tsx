'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useEffect, useMemo, useState } from 'react'
import type { Product as APIProduct } from '@/types/products'
import { prepareDescription } from '@/lib/description'
import type { Product as CartProduct } from '@/types'
import { getWhatsAppQuoteUrl } from '@/lib/whatsapp'
import { ProductVariations } from '@/components/product-variations'
import { StockStatus } from '@/components/stock-status'
import { RelatedProducts } from '@/components/related-products'

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
        sku: p.sku,
        code: p.code,
        gallery: p.gallery,
        specifications: undefined,
        customFields: undefined
    }
}

export default function ProductDetailClient({
    product
}: {
    product: APIProduct
}) {
    const router = useRouter()
    const { addItem } = useCart()
    const [activeIdx, setActiveIdx] = useState(0)
    const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>(
        {}
    )

    // Normalização de chaves e valores
    const normalizeKey = (key: string) =>
        (key || '').toLowerCase().trim().replace(/^pa_/, '')
    const normalizeValue = (val: string) => (val || '').toLowerCase().trim()

    // Inicializar seleção de atributos
    useEffect(() => {
        const defaults: Record<string, string> = {}

        if (product.variations?.length) {
            // Inicializar APENAS com a primeira cor (atributo principal)
            // Deixar os demais atributos vazios para o usuário escolher
            const firstInStock = product.variations.find(
                v => v.inStock !== false
            )
            const targetVariation = firstInStock || product.variations[0]

            // Pegar apenas o atributo de cor
            const corKey = normalizeKey('cor')
            if (targetVariation.attributes?.[corKey]) {
                defaults[corKey] = targetVariation.attributes[corKey]
            }

            // Não inicializar outros atributos (costura, etc.)
            // O usuário deve selecionar manualmente
        }

        setSelectedAttrs(defaults)
        setActiveIdx(0)
    }, [product])

    // Encontrar variação atual baseada na seleção
    const currentVariation = useMemo(() => {
        if (!product?.variations?.length) return null

        return (
            product.variations.find(variation => {
                return Object.entries(selectedAttrs).every(([key, value]) => {
                    if (!value) return true

                    const normKey = normalizeKey(key)
                    const normValue = normalizeValue(value)

                    // As chaves já vêm normalizadas do backend (sem pa_)
                    const varValue = normalizeValue(
                        variation.attributes?.[normKey] || ''
                    )

                    // Se a variação não define este atributo, tratamos como match
                    if (!varValue) return true

                    return varValue === normValue
                })
            }) || null
        )
    }, [product.variations, selectedAttrs])

    // Galeria de imagens
    const displayedGallery = useMemo(() => {
        const baseGallery = product?.gallery || []
        const varImg = currentVariation?.image

        if (varImg) {
            // Remover duplicatas e colocar imagem da variação primeiro
            const filtered = baseGallery.filter(img => img !== varImg)
            return [varImg, ...filtered]
        }

        return baseGallery
    }, [product?.gallery, currentVariation?.image])

    // Resetar índice da galeria quando trocar variação
    useEffect(() => {
        setActiveIdx(0)
    }, [currentVariation?.id])

    const addToCartAndGo = () => {
        const item = toCartProduct(product)
        if (currentVariation) {
            addItem(
                item,
                1,
                currentVariation.id,
                currentVariation.attributes,
                currentVariation.image
            )
        } else {
            addItem(item, 1)
        }
        router.push('/carrinho')
    }

    const handleRequestQuote = () => {
        const productCode = String(
            currentVariation?.sku || product.code || product.slug || product.id
        )
        let productName = product.name
        if (currentVariation) {
            const attrs = Object.entries(currentVariation.attributes)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ')
            productName = `${productName} (${attrs})`
        }
        const whatsappUrl = getWhatsAppQuoteUrl(productName, productCode)
        window.open(whatsappUrl, '_blank')
    }

    return (
        <main className="container mx-auto px-4 pt-24 pb-10 flex-1">
            <div className="grid gap-8 md:grid-cols-2">
                {/* Galeria */}
                <div>
                    <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden">
                        <Image
                            src={
                                displayedGallery?.[activeIdx] ||
                                product.image ||
                                '/images/placeholder-product.svg'
                            }
                            alt={product.name}
                            width={800}
                            height={800}
                            className="h-full w-full object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>
                    {displayedGallery && displayedGallery.length > 1 && (
                        <div className="mt-4 grid grid-cols-5 gap-3">
                            {displayedGallery.map((src, i) => (
                                <button
                                    key={`thumb-${i}`}
                                    className={`aspect-square rounded-md bg-gray-50 overflow-hidden border-2 transition-all ${
                                        i === activeIdx
                                            ? 'border-red-600'
                                            : 'border-transparent hover:border-gray-300'
                                    }`}
                                    onClick={() => setActiveIdx(i)}
                                    aria-label={`Imagem ${i + 1}`}
                                >
                                    <Image
                                        src={src}
                                        alt={`${product.name} - Imagem ${
                                            i + 1
                                        }`}
                                        width={120}
                                        height={120}
                                        className="h-full w-full object-contain"
                                        sizes="120px"
                                        loading="lazy"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Informações do produto */}
                <div className="space-y-4">
                    <h1 className="text-2xl font-semibold leading-tight">
                        {product.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Código:{' '}
                        {currentVariation?.sku ||
                            product.code ||
                            product.slug ||
                            product.id}
                    </p>
                    {product.shortDescription && (
                        <p className="text-sm text-muted-foreground">
                            {product.shortDescription}
                        </p>
                    )}

                    {/* Variações */}
                    <ProductVariations
                        product={product}
                        selectedAttrs={selectedAttrs}
                        onSelectionChange={setSelectedAttrs}
                    />

                    {/* Status do estoque */}
                    <div className="pt-4">
                        <StockStatus
                            inStock={currentVariation?.inStock ?? true}
                            stockStatus={
                                currentVariation?.inStock === false
                                    ? 'outofstock'
                                    : 'instock'
                            }
                        />
                    </div>

                    {/* Botões de ação */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 gap-2"
                            onClick={handleRequestQuote}
                        >
                            Solicitar Orçamento
                        </Button>
                        <Button className="gap-2" onClick={addToCartAndGo}>
                            Adicionar ao carrinho
                        </Button>
                    </div>
                    <div className="pt-2">
                        <Link
                            href="/produtos"
                            className="inline-flex items-center text-sm underline hover:text-red-600"
                        >
                            Voltar aos produtos
                        </Link>
                    </div>

                    {/* Tags de categoria e marca */}
                    {(product.categories?.length || product.brands?.length) && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {product.categories?.map(c => (
                                <span
                                    key={`c-${c.id}`}
                                    className="px-2 py-1 rounded-full bg-gray-100 text-xs"
                                >
                                    {c.name}
                                </span>
                            ))}
                            {product.brands?.map(b => (
                                <span
                                    key={`b-${b.id}`}
                                    className="px-2 py-1 rounded-full bg-gray-100 text-xs"
                                >
                                    {b.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Descrição do produto */}
            {product.description && (
                <section className="mt-10 w-full">
                    <h2 className="text-lg font-semibold text-left">
                        Descrição do produto
                    </h2>
                    <div
                        className="product-description prose prose-sm max-w-none dark:prose-invert mt-4"
                        dangerouslySetInnerHTML={prepareDescription(
                            product.description
                        )}
                    />
                </section>
            )}

            {/* Produtos Relacionados */}
            <section className="mt-12 w-full">
                <RelatedProducts productId={product.id} limit={4} />
            </section>
        </main>
    )
}
