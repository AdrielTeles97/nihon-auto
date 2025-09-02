import { NextRequest, NextResponse } from 'next/server'
import { getProductBySlug } from '@/services/wordpress'

export async function GET(
  _req: NextRequest,
  ctx: { params: { slug: string } }
) {
  try {
    const slug = ctx.params.slug
    const product = await getProductBySlug(slug)
    if (!product) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao buscar produto' }, { status: 500 })
  }
}

