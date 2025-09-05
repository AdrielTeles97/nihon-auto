import { NextRequest, NextResponse } from 'next/server'
import { wpApi, assertWooConfig } from '@/services/wp-api'
import type { WCProduct, Product } from '@/types/products'
import { extractProductCodeFromWC } from '@/types/products'
import { cached, cacheHeaders, normalizeCSV } from '@/lib/cache'

assertWooConfig()

const stripHtml = (html: string | undefined) =>
  (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()

type OrderBy = 'date' | 'id' | 'include' | 'title' | 'slug' | 'price' | 'popularity' | 'rating'
type Order = 'asc' | 'desc'

type WCProductsQuery = {
  page?: number
  per_page?: number
  search?: string
  in_stock?: boolean
  min_price?: string | number
  max_price?: string | number
  sku?: string
  orderby?: OrderBy
  order?: Order
  category?: string
  brand?: string
}

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const search = (searchParams.get('search') || '').trim()
    const page = Math.max(Number(searchParams.get('page') || '1'), 1)
    const perPage = Math.min(Math.max(Number(searchParams.get('per_page') || '24'), 1), 100)
    const category = searchParams.get('category') || ''
    const brand = searchParams.get('brand') || ''
    const inStock = searchParams.get('in_stock')
    const minPrice = searchParams.get('min_price')
    const maxPrice = searchParams.get('max_price')
    const sku = searchParams.get('sku')
    const orderby = (searchParams.get('orderby') || 'date').toLowerCase() as OrderBy
    const order = (searchParams.get('order') || 'desc').toLowerCase() as Order

    const toList = (val: string) => val.split(',').map((v) => v.trim()).filter(Boolean)
    const isNumeric = (s: string) => /^\d+$/.test(s)

    const allowedOrderBy: ReadonlySet<OrderBy> = new Set(['date', 'id', 'include', 'title', 'slug', 'price', 'popularity', 'rating'])
    const allowedOrder: ReadonlySet<Order> = new Set(['asc', 'desc'])

    const params: WCProductsQuery = {
      page,
      per_page: perPage,
      ...(search ? { search } : {}),
      ...(inStock ? { in_stock: inStock === 'true' } : {}),
      ...(minPrice ? { min_price: minPrice } : {}),
      ...(maxPrice ? { max_price: maxPrice } : {}),
      ...(sku ? { sku } : {}),
      ...(allowedOrderBy.has(orderby) ? { orderby } : {}),
      ...(allowedOrder.has(order) ? { order } : {})
    }

    // Categoria e marca: aceitam id ou slug dependendo do plugin; passamos como CSV
    const catTokens = category ? toList(category) : []
    const categoryIds = catTokens.filter(isNumeric).map((n) => Number(n))
    if (categoryIds.length) params.category = categoryIds.join(',')

    const brandTokens = brand ? toList(brand) : []
    const brandIds = brandTokens.filter(isNumeric).map((n) => Number(n))
    if (brandIds.length) params.brand = brandIds.join(',')
    const brandSlugs = brandTokens.filter((t) => !isNumeric(t))
    if (brandSlugs.length) params.brand = brandSlugs.join(',')

    const key = [
      'wc:products',
      page,
      perPage,
      search.toLowerCase(),
      (params.orderby as string | undefined) || '',
      (params.order as string | undefined) || '',
      normalizeCSV(category).join(','),
      normalizeCSV(brand).join(','),
      inStock ?? '',
      minPrice ?? '',
      maxPrice ?? '',
      sku ?? ''
    ]

    const raw = await cached(
      key,
      async () => {
        const resp = await wpApi.get<WCProduct[]>('/products', { params })
        const headers = resp.headers as Record<string, unknown>
        const tStr = (headers['x-wp-total'] as string) || (headers['X-WP-Total'] as string) || ''
        const tpStr = (headers['x-wp-totalpages'] as string) || (headers['X-WP-TotalPages'] as string) || ''
        const total = Number(tStr || resp.data.length)
        const totalPages = Number(tpStr || Math.max(1, Math.ceil(total / perPage)))
        return { items: resp.data, total, totalPages }
      },
      { tags: ['wc:products'], revalidate: 600 }
    )

    let products: Product[] = raw.items.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: stripHtml(p.description),
      shortDescription: stripHtml(p.short_description),
      code: extractProductCodeFromWC(p),
      image: p.images?.[0]?.src || null,
      gallery: (p.images || []).map((img) => img.src),
      categories: (p.categories || []).map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
      brands: (p.brands || []).map((b) => ({ id: b.id, name: b.name, slug: b.slug }))
    }))

    // Slugs pós-processados, caso a API não filtre por slug
    if (catTokens.length && !categoryIds.length) {
      const catSlugSet = new Set(catTokens.map((s) => s.toLowerCase()))
      products = products.filter((p) => p.categories.some((c) => catSlugSet.has(c.slug.toLowerCase())))
    }

    if (brandTokens.length && !brandIds.length) {
      const brandSlugSet = new Set(brandTokens.map((s) => s.toLowerCase()))
      products = products.filter((p) => p.brands.some((b) => brandSlugSet.has(b.slug.toLowerCase())))
    }

    // Totais dos headers (quando disponíveis)
    const getHeader = (h: unknown, key: string): string | undefined => {
      if (!h || typeof h !== 'object') return undefined
      const obj = h as Record<string, unknown>
      const v = (obj as Record<string, unknown>)[key] ?? (obj as Record<string, unknown>)[key.toLowerCase()]
      return typeof v === 'string' ? v : undefined
    }
    // Como estamos cacheando o payload, quando possível use o fallback de total
    const total = raw.total
    const totalPages = raw.totalPages

    return new NextResponse(
      JSON.stringify({ success: true, data: products, page, perPage, total, totalPages }),
      { headers: { 'Content-Type': 'application/json', ...cacheHeaders(600, 120) } }
    )
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
