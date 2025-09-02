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
      },
    });

    // Compatibilidade: alguns consumidores esperam um array simples
    const format = searchParams.get('format');
    if (format !== 'full' && (brand || search || category)) {
      return NextResponse.json(products.products);
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
