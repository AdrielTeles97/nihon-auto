import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/services/wordpress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') as 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' || undefined;

    // Buscar produtos do WordPress/WooCommerce
    const products = await getProducts({
      brand,
      limit,
      page,
      filters: {
        search,
        category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStock: typeof inStock === 'string' ? inStock === 'true' : undefined,
        sort,
      },
    });

    // Sempre retornar o formato completo com paginação
    return NextResponse.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
