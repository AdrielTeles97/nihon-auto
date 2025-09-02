import { NextRequest, NextResponse } from 'next/server';
import { brandsService } from '@/services/brands';

// GET /api/brands/wordpress - Buscar marcas do WordPress
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const logocloud = searchParams.get('logocloud') === 'true';
    const limit = parseInt(searchParams.get('limit') || '8');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Se for para LogoCloud, usar método específico
    if (logocloud) {
      const brands = await brandsService.getBrandsForLogoCloud(limit);
      return NextResponse.json({
        success: true,
        data: brands,
        total: brands.length,
        source: 'wordpress',
        purpose: 'logocloud'
      });
    }

    // Buscar todas as marcas do WordPress
    const wpBrands = await brandsService.getWordPressBrands();
    let brands = brandsService.convertWordPressBrandsToBrands(wpBrands);

    // Aplicar filtros
    if (featured === 'true') {
      brands = brands.filter(brand => brand.featured);
    }

    if (category) {
      brands = brands.filter(brand => 
        brand.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      brands = brands.filter(brand => 
        brand.name.toLowerCase().includes(search.toLowerCase()) ||
        brand.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Aplicar limite se especificado
    if (limit > 0) {
      brands = brands.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: brands,
      total: brands.length,
      source: 'wordpress'
    });
  } catch (error) {
    console.error('Erro ao buscar marcas do WordPress:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao conectar com WordPress',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/brands/wordpress - Criar nova marca no WordPress
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

    // Criar marca no WordPress
    const wpBrand = await brandsService.createWordPressBrand(body);
    
    if (!wpBrand) {
      return NextResponse.json(
        { success: false, error: 'Erro ao criar marca no WordPress' },
        { status: 500 }
      );
    }

    // Converter para formato da aplicação
    const brand = brandsService.convertWordPressBrandsToBrands([wpBrand])[0];

    return NextResponse.json({
      success: true,
      data: brand,
      source: 'wordpress'
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar marca no WordPress:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar marca no WordPress',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// PUT /api/brands/wordpress - Sincronizar todas as marcas
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'sync') {
      // Buscar marcas do WordPress
      const wpBrands = await brandsService.getWordPressBrands();
      const brands = brandsService.convertWordPressBrandsToBrands(wpBrands);

      return NextResponse.json({
        success: true,
        message: 'Marcas sincronizadas com sucesso',
        data: brands,
        total: brands.length,
        source: 'wordpress',
        synced_at: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { success: false, error: 'Ação não reconhecida. Use ?action=sync' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Erro ao sincronizar marcas:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao sincronizar marcas',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}