import { NextRequest, NextResponse } from 'next/server';
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

// GET /api/brands - Listar todas as marcas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro
    const search = searchParams.get('search');
    
    // Buscar marcas do WooCommerce
    const response = await wcApi.get('/products/brands', {
      params: {
        hide_empty: false,
        per_page: 100
      }
    });
    
    let brands = response.data.map((brand: any) => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      count: brand.count || 0,
      image: brand.image?.src || null
    }));
    
    // Aplicar filtro de busca se fornecido
    if (search) {
      brands = brands.filter((brand: any) => 
        brand.name.toLowerCase().includes(search.toLowerCase()) ||
        brand.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return NextResponse.json({
      success: true,
      data: brands,
      total: brands.length,
      message: 'Marcas recuperadas com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível recuperar as marcas'
      },
      { status: 500 }
    );
  }
}

// POST /api/brands - Criar nova marca
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validação básica
    if (!body.name || !body.slug || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios: name, slug, description' },
        { status: 400 }
      );
    }

    // Verificar se o slug já existe
    const existingBrand = brands.find(b => b.slug === body.slug);
    if (existingBrand) {
      return NextResponse.json(
        { success: false, error: 'Slug já existe' },
        { status: 409 }
      );
    }

    const newBrand = {
      id: body.slug,
      name: body.name,
      slug: body.slug,
      logo: body.logo || '/images/brands/default-logo.svg',
      description: body.description,
      category: body.category || 'Popular',
      country: body.country || '',
      founded: body.founded || new Date().getFullYear(),
      featured: body.featured || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Em produção, salvar no banco de dados
    brands.push(newBrand);

    return NextResponse.json({
      success: true,
      data: newBrand
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar marca:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}