import { NextRequest, NextResponse } from 'next/server'
import { wpApi, assertWooConfig } from '@/services/wp-api'
import type { WCProduct, Product } from '@/types/products'
import { extractProductCodeFromWC } from '@/types/products'
import { cached, cacheHeaders } from '@/lib/cache'

assertWooConfig()

// Função para mapear produto WC para nosso formato
const mapProduct = (p: WCProduct): Product => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    shortDescription: (p.short_description || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim(),
    sku: p.sku,
    code: extractProductCodeFromWC(p),
    image: p.images?.[0]?.src || null,
    gallery: (p.images || []).map(img => img.src),
    categories: (p.categories || []).map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug
    })),
    brands: (p.brands || []).map(b => ({
        id: b.id,
        name: b.name,
        slug: b.slug
    })),
    type: p.type,
    attributes: (p.attributes || []).map(a => ({
        name: a.name,
        options: a.options || [],
        variation: !!a.variation
    }))
})

// GET /api/products/[id]/related
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await params
        const { searchParams } = new URL(request.url)
        const limit = Math.min(Number(searchParams.get('limit') || '4'), 12)

        const isDev = process.env.NODE_ENV === 'development'
        const cacheTime = isDev ? 30 : 1800 // 30 segundos em dev, 30 minutos em produção

        const relatedProducts = await cached(
            ['related-products', productId],
            async () => {
                // Primeiro, buscar o produto atual para entender suas categorias e marcas
                const currentProductResponse = await wpApi.get<WCProduct>(
                    `/products/${productId}`
                )
                const currentProduct = currentProductResponse.data

                const categoryIds = (currentProduct.categories || []).map(
                    c => c.id
                )
                const brandIds = (currentProduct.brands || []).map(b => b.id)

                // Buscar produtos relacionados baseado em:
                // 1. Mesma categoria
                // 2. Mesma marca
                // 3. Produtos em destaque
                const searchCriteria = []

                // Prioridade 1: Mesma categoria E mesma marca
                if (categoryIds.length && brandIds.length) {
                    searchCriteria.push({
                        category: categoryIds.join(','),
                        brand: brandIds.join(','),
                        per_page: limit,
                        exclude: [productId]
                    })
                }

                // Prioridade 2: Mesma categoria
                if (categoryIds.length) {
                    searchCriteria.push({
                        category: categoryIds.join(','),
                        per_page: limit,
                        exclude: [productId]
                    })
                }

                // Prioridade 3: Mesma marca
                if (brandIds.length) {
                    searchCriteria.push({
                        brand: brandIds.join(','),
                        per_page: limit,
                        exclude: [productId]
                    })
                }

                // Prioridade 4: Produtos em destaque
                searchCriteria.push({
                    featured: true,
                    per_page: limit,
                    exclude: [productId]
                })

                // Prioridade 5: Produtos mais recentes
                searchCriteria.push({
                    orderby: 'date',
                    order: 'desc',
                    per_page: limit,
                    exclude: [productId]
                })

                let relatedProducts: WCProduct[] = []

                // Tentar cada critério até conseguir produtos suficientes
                for (const criteria of searchCriteria) {
                    if (relatedProducts.length >= limit) break

                    try {
                        const response = await wpApi.get<WCProduct[]>(
                            '/products',
                            {
                                params: criteria
                            }
                        )

                        // Adicionar produtos que ainda não temos
                        const newProducts = response.data.filter(
                            p =>
                                !relatedProducts.some(
                                    existing => existing.id === p.id
                                )
                        )

                        relatedProducts = [
                            ...relatedProducts,
                            ...newProducts
                        ].slice(0, limit)
                    } catch (error) {
                        console.warn(
                            'Error fetching related products with criteria:',
                            criteria,
                            error
                        )
                        continue
                    }
                }

                return relatedProducts.map(mapProduct)
            },
            {
                tags: ['products', 'related-products'],
                revalidate: cacheTime
            }
        )

        return NextResponse.json(
            {
                success: true,
                data: relatedProducts,
                total: relatedProducts.length
            },
            {
                headers: cacheHeaders(cacheTime)
            }
        )
    } catch (error) {
        console.error('Error fetching related products:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
