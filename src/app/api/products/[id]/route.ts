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

        // Cache granular por produto individual
        // Pode ser invalidado instantaneamente via webhook quando o produto for atualizado
        const isDev = process.env.NODE_ENV === 'development'
        const cacheTime = isDev ? 30 : 3600 // 30s em dev, 1 hora em produção

        const cachedProduct = await cached(
            ['product', productId],
            () => fetchProductFromAPI(productId),
            {
                // Tag específica do produto para revalidação granular
                tags: [`wc:product:${productId}`, 'wc:products'],
                revalidate: cacheTime
            }
        )

        // CDN cache com stale-while-revalidate para resposta instantânea
        return NextResponse.json(cachedProduct, {
            headers: cacheHeaders(cacheTime, 300) // 5min de stale-while-revalidate
        })
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
    const wcProduct = productResponse.data

    // Verificar se o produto está publicado
    if (wcProduct.status !== 'publish') {
        throw new Error('Product not published')
    }

    const product = mapProduct(wcProduct)

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
                sku?: string
                image?: { id: number; src: string }
            }

            // Buscar TODAS as variações (WooCommerce pagina em 10 por padrão, aumentar para 100)
            const variationsResponse = await wpApi.get<WCVariation[]>(
                `/products/${productId}/variations?per_page=100`
            )
            product.variations = variationsResponse.data.map(
                (v: WCVariation) => ({
                    id: v.id,
                    sku: v.sku,
                    image: v.image?.src || null,
                    attributes: Object.fromEntries(
                        (v.attributes || []).map((attr: VariationAttribute) => {
                            // Normalizar chave: minúscula e remover prefixo pa_
                            const key = (attr.name || '')
                                .toLowerCase()
                                .trim()
                                .replace(/^pa_/, '')
                            return [key, attr.option]
                        })
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
