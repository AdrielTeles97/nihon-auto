import { NextRequest, NextResponse } from 'next/server';
import { getBrands } from '@/services/wordpress';

// GET /api/brands - Listar todas as marcas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de filtro
    const search = searchParams.get('search');
    
    // Buscar marcas do WooCommerce
    let brands = await getBrands();
    
    // Aplicar filtro de busca se fornecido
    if (search) {
      brands = brands.filter(brand => 
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