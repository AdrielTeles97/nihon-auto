import { NextResponse } from 'next/server';
import axios from 'axios';

const WC_API_BASE_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL || '';
const WC_CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || '';
const WC_CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || '';

if (!WC_API_BASE_URL || !WC_CONSUMER_KEY || !WC_CONSUMER_SECRET) {
  console.error('WooCommerce API configuration missing');
}

const wcApi = axios.create({
  baseURL: WC_API_BASE_URL,
  timeout: 10000,
  params: {
    consumer_key: WC_CONSUMER_KEY,
    consumer_secret: WC_CONSUMER_SECRET
  }
});

export async function GET() {
  try {
    const response = await wcApi.get('/products/categories', {
      params: {
        hide_empty: false,
        per_page: 100
      }
    });
    
    const categories = response.data.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      count: cat.count || 0,
      image: cat.image?.src || null,
      parent: cat.parent || 0
    }));

    return NextResponse.json({
      success: true,
      data: categories,
      total: categories.length,
      message: 'Categorias recuperadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao buscar categorias do WooCommerce:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível recuperar as categorias'
      },
      { status: 500 }
    );
  }
}

