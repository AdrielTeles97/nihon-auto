import { NextRequest, NextResponse } from 'next/server';
import { brandsService } from '@/services/brands';

// Mock data - Em produção, isso viria do WordPress/banco de dados
const suppliers = [
  {
    id: '3m',
    name: '3M',
    slug: '3m',
    logo: '/images/suppliers/3m-logo.svg',
    description: 'Líder mundial em inovação, oferecendo soluções premium para cuidado automotivo.',
    website: 'https://www.3m.com.br',
    total_products: 47,
    categories: ['Compostos', 'Lixas', 'Ceras', 'Acessórios'],
    featured: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'vonixx',
    name: 'VONIXX',
    slug: 'vonixx',
    logo: '/images/suppliers/vonixx-logo.svg',
    description: 'Marca brasileira especializada em produtos de alta performance para detalhamento.',
    website: 'https://www.vonixx.com.br',
    total_products: 32,
    categories: ['Shampoos', 'Removedores', 'Pretinhos', 'Ceras'],
    featured: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'chemical-guys',
    name: 'Chemical Guys',
    slug: 'chemical-guys',
    logo: '/images/suppliers/chemical-guys-logo.svg',
    description: 'Marca americana premium com produtos inovadores para entusiastas automotivos.',
    website: 'https://www.chemicalguys.com',
    total_products: 28,
    categories: ['Shampoos', 'Ceras', 'Microfibras', 'Detalhamento'],
    featured: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'meguiars',
    name: 'MEGUIAR\'S',
    slug: 'meguiars',
    logo: '/images/suppliers/meguiars-logo.svg',
    description: 'Tradição e qualidade há mais de 120 anos no cuidado automotivo profissional.',
    website: 'https://www.meguiars.com',
    total_products: 35,
    categories: ['Shampoos', 'Compostos', 'Ceras', 'Pneus'],
    featured: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
];

// GET /api/suppliers - Listar todos os fornecedores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const syncWithBrands = searchParams.get('sync') === 'true';

    let filteredSuppliers = [...suppliers];

    // Sincronizar com marcas do WordPress se solicitado
    if (syncWithBrands) {
      try {
        filteredSuppliers = await brandsService.syncSuppliersWithBrands(filteredSuppliers);
        console.log('Fornecedores sincronizados com marcas do WordPress');
      } catch (error) {
        console.warn('Erro ao sincronizar com marcas do WordPress:', error);
        // Continuar com dados locais em caso de erro
      }
    }

    // Filtrar por destaque
    if (featured === 'true') {
      filteredSuppliers = filteredSuppliers.filter(supplier => supplier.featured);
    }

    // Filtrar por categoria
    if (category) {
      filteredSuppliers = filteredSuppliers.filter(supplier => 
        supplier.categories.some(cat => 
          cat.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Filtrar por busca
    if (search) {
      filteredSuppliers = filteredSuppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredSuppliers,
      total: filteredSuppliers.length,
      synced_with_wordpress: syncWithBrands
    });
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/suppliers - Criar novo fornecedor
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
    const existingSupplier = suppliers.find(s => s.slug === body.slug);
    if (existingSupplier) {
      return NextResponse.json(
        { success: false, error: 'Slug já existe' },
        { status: 409 }
      );
    }

    const newSupplier = {
      id: body.slug,
      name: body.name,
      slug: body.slug,
      logo: body.logo || '/images/suppliers/default-logo.svg',
      description: body.description,
      website: body.website || '',
      total_products: body.total_products || 0,
      categories: body.categories || [],
      featured: body.featured || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Em produção, salvar no banco de dados
    suppliers.push(newSupplier);

    return NextResponse.json({
      success: true,
      data: newSupplier
    }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}