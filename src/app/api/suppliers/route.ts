import { NextRequest, NextResponse } from 'next/server'
import { brandsService } from '@/services/brands'
import { getProducts } from '@/services/wordpress'

// Interface para Supplier baseado nas marcas do WooCommerce
interface Supplier {
    id: number
    name: string
    slug: string
    logo?: string
    description?: string
    website?: string
    featured?: boolean
    products?: any[]
    banner?: string
    video?: string
    categoryCount?: number
    totalProducts?: number
    categories?: string[]
    created_at?: string
    updated_at?: string
}

// Função para buscar produtos por marca
async function getProductsByBrand(brandName: string) {
    try {
        const productsResponse = await getProducts({
            filters: { brand: brandName },
            limit: 50
        })
        return productsResponse.products
    } catch (error) {
        console.error(`Erro ao buscar produtos da marca ${brandName}:`, error)
        return []
    }
}

// Função para criar supplier baseado na marca do WooCommerce
async function createSupplierFromBrand(brand: any): Promise<Supplier> {
    const products = await getProductsByBrand(brand.name)

    // Extrair categorias únicas dos produtos
    const categories = [...new Set(products.map(p => p.category))].filter(
        Boolean
    )

    return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo || `/images/suppliers/${brand.slug}-logo.svg`,
        description: `Produtos premium da marca ${brand.name} para cuidado automotivo.`,
        website: brand.website || '',
        featured: brand.featured || false,
        products: products.slice(0, 6), // Limitar a 6 produtos para performance
        banner: `/images/banners/${brand.slug}-banner.jpg`,
        video: `/videos/${brand.slug}-showcase.mp4`,
        categoryCount: categories.length,
        totalProducts: products.length,
        categories: categories,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
}

// GET /api/suppliers - Listar todos os fornecedores baseado nas marcas do WooCommerce
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const featured = searchParams.get('featured')
        const category = searchParams.get('category')
        const search = searchParams.get('search')
        const withProducts = searchParams.get('products') === 'true'

        console.log('🔍 Buscando fornecedores das marcas do WooCommerce...')

        // Buscar marcas do WooCommerce
        const wpBrands = await brandsService.getWordPressBrands()
        console.log(`📦 Encontradas ${wpBrands.length} marcas no WooCommerce`)

        if (wpBrands.length === 0) {
            console.warn(
                '⚠️  Nenhuma marca encontrada no WooCommerce, usando dados fallback'
            )

            // Fallback para dados mock se não houver marcas
            const mockSuppliers: Supplier[] = [
                {
                    id: 1,
                    name: 'YAMAHA',
                    slug: 'yamaha',
                    logo: '/images/suppliers/yamaha-logo.svg',
                    description:
                        'Marca premium de qualidade internacional para cuidado automotivo',
                    website: 'https://yamaha.com.br',
                    featured: true,
                    products: [],
                    banner: '/images/banners/yamaha-banner.jpg',
                    video: '/videos/yamaha-showcase.mp4',
                    categoryCount: 3,
                    totalProducts: 15,
                    categories: ['Eletrônicos', 'Acessórios', 'Premium'],
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]

            return NextResponse.json({
                success: true,
                data: mockSuppliers,
                total: mockSuppliers.length,
                source: 'mock',
                message:
                    'Usando dados fallback - configure as marcas no WooCommerce'
            })
        }

        // Converter marcas do WooCommerce em fornecedores
        const suppliers: Supplier[] = []

        for (const brand of wpBrands) {
            try {
                const supplier = await createSupplierFromBrand(brand)
                suppliers.push(supplier)
                console.log(
                    `✅ Fornecedor criado: ${supplier.name} (${supplier.totalProducts} produtos)`
                )
            } catch (error) {
                console.error(
                    `❌ Erro ao criar fornecedor para marca ${brand.name}:`,
                    error
                )
            }
        }

        // Aplicar filtros
        let filteredSuppliers = suppliers

        // Filtrar por destaque
        if (featured === 'true') {
            filteredSuppliers = filteredSuppliers.filter(
                supplier => supplier.featured
            )
        }

        // Filtrar por categoria
        if (category) {
            filteredSuppliers = filteredSuppliers.filter(supplier =>
                supplier.categories?.some((cat: string) =>
                    cat.toLowerCase().includes(category.toLowerCase())
                )
            )
        }

        // Filtrar por busca
        if (search) {
            filteredSuppliers = filteredSuppliers.filter(
                supplier =>
                    supplier.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    supplier.description
                        ?.toLowerCase()
                        .includes(search.toLowerCase())
            )
        }

        // Se não quiser produtos, remover para reduzir payload
        if (!withProducts) {
            filteredSuppliers = filteredSuppliers.map(supplier => {
                const { products, ...supplierWithoutProducts } = supplier
                return supplierWithoutProducts
            })
        }

        console.log(`🎯 Retornando ${filteredSuppliers.length} fornecedores`)

        return NextResponse.json({
            success: true,
            data: filteredSuppliers,
            total: filteredSuppliers.length,
            source: 'woocommerce',
            filters_applied: {
                featured: featured === 'true',
                category: category || null,
                search: search || null,
                with_products: withProducts
            }
        })
    } catch (error) {
        console.error('❌ Erro ao buscar fornecedores:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Erro interno do servidor',
                message:
                    error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}

// POST /api/suppliers - Criar novo fornecedor/marca
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validação básica
        if (!body.name || !body.slug || !body.description) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Campos obrigatórios: name, slug, description'
                },
                { status: 400 }
            )
        }

        // Criar marca no WooCommerce
        const newBrand = await brandsService.createOrUpdateBrand({
            name: body.name,
            slug: body.slug,
            logo: body.logo,
            website: body.website,
            featured: body.featured || false
        })

        if (!newBrand) {
            return NextResponse.json(
                { success: false, error: 'Erro ao criar marca no WooCommerce' },
                { status: 500 }
            )
        }

        // Converter para supplier
        const supplier = await createSupplierFromBrand(newBrand)

        console.log(`✅ Novo fornecedor criado: ${supplier.name}`)

        return NextResponse.json(
            {
                success: true,
                data: supplier,
                message: 'Fornecedor criado com sucesso'
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('❌ Erro ao criar fornecedor:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Erro interno do servidor',
                message:
                    error instanceof Error ? error.message : 'Erro desconhecido'
            },
            { status: 500 }
        )
    }
}

export type { Supplier }
