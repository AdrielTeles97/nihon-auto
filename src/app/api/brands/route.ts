import { NextRequest, NextResponse } from 'next/server'
import { wpApi, assertWooConfig } from '@/services/wp-api'
import type { Brand, WCBrand } from '@/types/brands'
import { cached, cacheHeaders, normalizeCSV } from '@/lib/cache'

assertWooConfig()

// GET /api/brands - listar marcas com imagem, descrição e contagem
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = (searchParams.get('search') || '').trim()
    const perPage = Number(searchParams.get('per_page') || '100')
    const page = Number(searchParams.get('page') || '1')
    const hideEmpty = searchParams.get('hide_empty')
    const order = searchParams.get('order') || 'asc'
    const orderby = searchParams.get('orderby') || 'name'
    const slug = searchParams.get('slug') || undefined
    const include = searchParams.get('include')
    const exclude = searchParams.get('exclude')
    const hasImage = searchParams.get('has_image')
    const calcCounts = searchParams.get('calc_counts') === 'true' || searchParams.get('recount') === 'true'

    const toNumArray = (val?: string | null) =>
      (val || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => Number(v))
        .filter((n) => !Number.isNaN(n))

    const responseData = await cached(
      [
        'wc:brands',
        page,
        perPage,
        hideEmpty === null ? 'n' : hideEmpty,
        order,
        orderby,
        slug || '',
        normalizeCSV(include).join(','),
        normalizeCSV(exclude).join(',')
      ],
      async () => {
        const resp = await wpApi.get<WCBrand[]>('/products/brands', {
          params: {
            per_page: Math.min(Math.max(perPage, 1), 100),
            page: Math.max(page, 1),
            hide_empty: hideEmpty === null ? false : hideEmpty === 'true',
            order,
            orderby,
            ...(slug ? { slug } : {}),
            ...(include ? { include: toNumArray(include) } : {}),
            ...(exclude ? { exclude: toNumArray(exclude) } : {})
          }
        })
        return resp.data
      },
      { tags: ['wc:brands'], revalidate: 3600 }
    )

    let brands: Brand[] = responseData.map((brand) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: (brand.description || '').replace(/<[^>]*>/g, '').trim(),
      count: brand.count ?? 0,
      image: brand.image?.src || null
    }))

    if (calcCounts && brands.length) {
      try {
        const counted = await Promise.all(
          brands.map(async (b) => {
            try {
              // per_page=1 para obter apenas headers com totais
              const r = await wpApi.get('/products', { params: { brand: b.id, per_page: 1 } })
              const headers = r.headers as Record<string, unknown>
              const total = Number((headers['x-wp-total'] as string) || (headers['X-WP-Total'] as string) || 0)
              return { ...b, count: Number.isFinite(total) ? total : b.count }
            } catch {
              return b
            }
          })
        )
        brands = counted
      } catch {}
    }

    if (search) {
      const s = search.toLowerCase()
      brands = brands.filter(
        (b) => b.name.toLowerCase().includes(s) || b.description.toLowerCase().includes(s)
      )
    }

    if (hasImage === 'true') {
      brands = brands.filter((b) => !!b.image)
    } else if (hasImage === 'false') {
      brands = brands.filter((b) => !b.image)
    }

    return new NextResponse(
      JSON.stringify({ success: true, data: brands, total: brands.length }),
      { headers: { 'Content-Type': 'application/json', ...cacheHeaders(3600, 120) } }
    )
  } catch (error) {
    console.error('Erro ao buscar marcas:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
