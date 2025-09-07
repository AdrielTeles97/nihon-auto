import { NextRequest, NextResponse } from 'next/server'
import { wpApi, assertWooConfig } from '@/services/wp-api'
import type { WCProduct, Product } from '@/types/products'
import { extractProductCodeFromWC } from '@/types/products'
import type { AxiosError } from 'axios'
import { cached, cacheHeaders } from '@/lib/cache'

assertWooConfig()

// Mantemos o HTML do WooCommerce e fazemos sanitização no frontend
const keepHtml = (html: string | undefined) => (html || '')
// Para a breve descrição, usamos somente texto simples
const stripToText = (html: string | undefined) => (html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()

function mapProduct(p: WCProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: keepHtml(p.description),
    shortDescription: stripToText(p.short_description),
    code: extractProductCodeFromWC(p),
    image: p.images?.[0]?.src || null,
    gallery: (p.images || []).map((img) => img.src),
    categories: (p.categories || []).map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
    brands: (p.brands || []).map((b) => ({ id: b.id, name: b.name, slug: b.slug })),
    type: p.type,
    attributes: (p.attributes || []).map(a => ({ name: a.name, options: a.options || [], variation: !!a.variation })),
    defaultAttributes: Object.fromEntries((p.default_attributes || []).map(da => [da.name?.toLowerCase() || '', da.option]))
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

    // Se for produto variável, buscar variações
    if ((data.type || '').toLowerCase() === 'variable') {
      try {
        const vResp = await wpApi.get<any[]>(`/products/${id}/variations`, { params: { per_page: 100 } })
        const variations = (vResp.data || []).map((v) => ({
          id: v.id,
          sku: (v.sku || '').trim() || undefined,
          image: v.image?.src || null,
          inStock: (v.stock_status || '').toLowerCase() !== 'outofstock',
          price: v.price ? Number(v.price) : v.regular_price ? Number(v.regular_price) : null,
          attributes: Object.fromEntries((v.attributes || []).map((a: any) => [(a.name || '').toLowerCase(), a.option]))
        }))
        product.variations = variations
      } catch (e) {
        console.warn('Falha ao buscar variações do produto', id, e)
      }
    }
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
