import { NextRequest, NextResponse } from 'next/server'
import { wpApi, assertWooConfig } from '@/services/wp-api'
import type { WCProduct, Product } from '@/types/products'
import { extractProductCodeFromWC } from '@/types/products'
import type { AxiosError } from 'axios'
import { cached, cacheHeaders } from '@/lib/cache'

assertWooConfig()

const stripHtml = (html: string | undefined) =>
  (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()

function mapProduct(p: WCProduct): Product {
  return {
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
  }
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const data = await cached(
      ['wc:product', id],
      async () => {
        const resp = await wpApi.get<WCProduct>(`/products/${id}`)
        return resp.data
      },
      { tags: [`wc:product:${id}`], revalidate: 86400 }
    )
    const product = mapProduct(data)
    return new NextResponse(JSON.stringify({ success: true, data: product }), {
      headers: { 'Content-Type': 'application/json', ...cacheHeaders(86400, 600) }
    })
  } catch (error: unknown) {
    // 404 do WooCommerce
    const status = (error as AxiosError)?.response?.status
    if (status === 404) {
      return NextResponse.json({ success: false, error: 'Produto não encontrado' }, { status: 404 })
    }
    console.error('Erro ao buscar produto por id:', error)
    return NextResponse.json({ success: false, error: 'Erro interno do servidor' }, { status: 500 })
  }
}
