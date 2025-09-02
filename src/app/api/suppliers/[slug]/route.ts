import { NextRequest, NextResponse } from 'next/server';

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

interface RouteParams {
  params: {
    slug: string;
  };
}

// GET /api/suppliers/[slug] - Buscar fornecedor específico
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;
    
    const supplier = suppliers.find(s => s.slug === slug);
    
    if (!supplier) {
      return NextResponse.json(
        { success: false, error: 'Fornecedor não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/suppliers/[slug] - Atualizar fornecedor
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    const supplierIndex = suppliers.findIndex(s => s.slug === slug);
    
    if (supplierIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Fornecedor não encontrado' },
        { status: 404 }
      );
    }

    // Atualizar fornecedor
    const updatedSupplier = {
      ...suppliers[supplierIndex],
      ...body,
      updated_at: new Date().toISOString()
    };

    // Em produção, atualizar no banco de dados
    suppliers[supplierIndex] = updatedSupplier;

    return NextResponse.json({
      success: true,
      data: updatedSupplier
    });
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/suppliers/[slug] - Deletar fornecedor
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;
    
    const supplierIndex = suppliers.findIndex(s => s.slug === slug);
    
    if (supplierIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Fornecedor não encontrado' },
        { status: 404 }
      );
    }

    // Em produção, deletar do banco de dados
    const deletedSupplier = suppliers.splice(supplierIndex, 1)[0];

    return NextResponse.json({
      success: true,
      message: 'Fornecedor deletado com sucesso',
      data: deletedSupplier
    });
  } catch (error) {
    console.error('Erro ao deletar fornecedor:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}