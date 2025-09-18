import { NextRequest, NextResponse } from 'next/server'
import { wpApi, assertWooConfig } from '@/services/wp-api'
import type { WCProduct, Product } from '@/types/products'
import { extractProductCodeFromWC } from '@/types/products'
import type { AxiosError } from 'axios'
import { cached, cacheHeaders } from '@/lib/cache'

assertWooConfig()

// Mantemos o HTML do WooCommerce e fazemos sanitização no frontend
const keepHtml = (html: string | undefined) => html || ''
// Para a breve descrição, usamos somente texto simples
const stripToText = (html: string | undefined) =>
    (html || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim()

function mapProduct(p: WCProduct): Product {
    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: keepHtml(p.description),
        shortDescription: stripToText(p.short_description),
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
        })),
        defaultAttributes: Object.fromEntries(
            (p.default_attributes || []).map(da => [
                da.name?.toLowerCase() || '',
                da.option
            ])
        )
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const resolvedParams = await params
    const productId = resolvedParams.id

    try {
        const fresh = req.nextUrl.searchParams.get('fresh') === '1'

        // Se fresh=1, não usar cache
        if (fresh) {
            const result = await fetchProductFromAPI(productId)
            return NextResponse.json(result, { headers: cacheHeaders(3600) })
        }

        // Tentar buscar do cache primeiro
        const cachedProduct = await cached(
            ['product', productId],
            () => fetchProductFromAPI(productId),
            {
                tags: ['products'],
                revalidate: 3600
            }
        )
        return NextResponse.json(cachedProduct, { headers: cacheHeaders(3600) })
    } catch (error) {
        console.error('Error in product API:', error)
        if ((error as AxiosError)?.response?.status === 404) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

async function fetchProductFromAPI(productId: string) {
    // Buscar produto base
    const productResponse = await wpApi.get<WCProduct>(`/products/${productId}`)
    const product = mapProduct(productResponse.data)

    // Se for produto variável, buscar variações
    if ((product.type || '').toLowerCase() === 'variable') {
        try {
            interface VariationAttribute {
                name?: string
                option: string
            }

            interface WCVariation {
                id: number
                attributes: VariationAttribute[]
                stock_status: string
                price: string
            }

            const variationsResponse = await wpApi.get<WCVariation[]>(
                `/products/${productId}/variations`
            )
            product.variations = variationsResponse.data.map(
                (v: WCVariation) => ({
                    id: v.id,
                    attributes: Object.fromEntries(
                        (v.attributes || []).map((attr: VariationAttribute) => [
                            attr.name?.toLowerCase() || '',
                            attr.option
                        ])
                    ),
                    inStock: v.stock_status === 'instock',
                    price: v.price ? parseFloat(v.price) : null
                })
            )
        } catch (e) {
            console.warn(
                `Failed to fetch variations for product ${productId}:`,
                e
            )
            product.variations = []
        }
    }

    return { success: true, data: product }
}
