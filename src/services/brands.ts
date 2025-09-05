import { wpApi } from '@/services/wp-api'
import type { WCBrand as WordPressBrand, Brand } from '@/types/brands'
import type { AxiosInstance } from 'axios'
import type { Product } from '@/types/products'

interface Supplier {
    id: number
    name: string
    logo?: string
    description?: string
    website?: string
    featured?: boolean
    products?: Product[]
}

class BrandsService {
    private baseUrl: string
    private wpApi: AxiosInstance

    constructor() {
        this.wpApi = wpApi
        this.baseUrl = (wpApi.defaults.baseURL as string) || ''
    }

    // Fetch brands from WordPress/WooCommerce API
    async fetchWordPressBrands(): Promise<WordPressBrand[]> {
        try {
            console.log('🌐 Fazendo requisição para WooCommerce brands...')
            console.log('🔗 URL:', `${this.baseUrl}/products/brands`)

            // Fazer requisição real para a API do WooCommerce
            const response = await this.wpApi.get<WordPressBrand[]>(
                '/products/brands',
                {
                    params: {
                        per_page: 100,
                        hide_empty: false // Mudei para false para pegar todas as marcas
                    }
                }
            )

            console.log(
                `📥 Response status: ${response.status}, dados:`,
                response.data.length,
                'itens'
            )
            console.log('🔍 Primeira marca raw:', response.data[0])

            // Transformar dados do WooCommerce para o formato esperado
            const transformedBrands: WordPressBrand[] = response.data.map(
                brand => ({
                    id: brand.id,
                    name: brand.name,
                    slug: brand.slug,
                    description: brand.description
                        ? brand.description.replace(/<[^>]*>/g, '').trim()
                        : '',
                    image: brand.image
                        ? { id: brand.image.id, src: brand.image.src }
                        : null,
                    count: brand.count ?? 0
                })
            )

            console.log(
                '🔄 Marcas transformadas:',
                transformedBrands.map(b => ({
                    name: b.name,
                    hasImage: !!b.image
                }))
            )
            return transformedBrands
        } catch (error) {
            console.error(
                'Erro ao buscar marcas do WordPress/WooCommerce:',
                error
            )
            // Retornar array vazio em caso de erro - não usar dados mockados
            return []
        }
    }

    // Convert WordPress brand to our Brand interface
    private convertWordPressBrandToBrand(wpBrand: WordPressBrand): Brand {
        return {
            id: wpBrand.id,
            name: wpBrand.name,
            slug: wpBrand.slug,
            description: wpBrand.description
                ? wpBrand.description.replace(/<[^>]*>/g, '').trim()
                : '',
            image: wpBrand.image?.src || null,
            count: wpBrand.count ?? 0
        }
    }

    // Sync suppliers with WordPress brands
    async syncSuppliersWithBrands(suppliers: Supplier[]): Promise<Supplier[]> {
        try {
            const wpBrands = await this.fetchWordPressBrands()
            const brands = wpBrands.map(wpBrand =>
                this.convertWordPressBrandToBrand(wpBrand)
            )

            return suppliers.map(supplier => {
                const matchingBrand = brands.find(
                    brand =>
                        brand.name.toLowerCase() ===
                            supplier.name.toLowerCase() ||
                        brand.slug ===
                            supplier.name.toLowerCase().replace(/\s+/g, '-')
                )

                if (matchingBrand) {
                    return {
                        ...supplier,
                        logo: matchingBrand.image || supplier.logo,
                        website: supplier.website,
                        featured: supplier.featured
                    }
                }

                return supplier
            })
        } catch (error) {
            console.error('Erro ao sincronizar fornecedores com marcas:', error)
            return suppliers
        }
    }

    // Get WordPress brands (alias for fetchWordPressBrands)
    async getWordPressBrands(): Promise<WordPressBrand[]> {
        return this.fetchWordPressBrands()
    }

    // Convert array of WordPress brands to Brand interface
    convertWordPressBrandsToBrands(wpBrands: WordPressBrand[]): Brand[] {
        return wpBrands.map(wpBrand =>
            this.convertWordPressBrandToBrand(wpBrand)
        )
    }

    // Get brands for LogoCloud component
    async getBrandsForLogoCloud(limit = 8): Promise<Brand[]> {
        try {
            console.log('🔍 Buscando marcas do WordPress...')
            const wpBrands = await this.fetchWordPressBrands()
            console.log(
                `📊 Encontradas ${wpBrands.length} marcas do WordPress:`,
                wpBrands.map(b => b.name)
            )

            const brands = wpBrands
                .map(wpBrand => {
                    const converted = this.convertWordPressBrandToBrand(wpBrand)
                    console.log(
                        `🔄 Convertendo marca: ${wpBrand.name} -> Logo: ${
                            converted.image || 'SEM LOGO'
                        }`
                    )
                    return converted
                })
                // Não filtrar por logo - aceitar todas as marcas
                .slice(0, limit)

            console.log(`✅ Retornando ${brands.length} marcas para LogoCloud`)
            return brands
        } catch (error) {
            console.error('❌ Erro ao buscar marcas para LogoCloud:', error)
            return []
        }
    }

    // Create or update brand in WordPress
    async createOrUpdateBrand(
        brand: Omit<Brand, 'id' | 'count'>
    ): Promise<Brand | null> {
        try {
            const brandData = {
                title: brand.name,
                slug: brand.slug,
                status: 'publish',
                description: brand.description
            }

            const response = await this.wpApi.post<WordPressBrand>(
                '/brands',
                brandData
            )
            return this.convertWordPressBrandToBrand(response.data)
        } catch (error) {
            console.error('Erro ao criar/atualizar marca:', error)
            return null
        }
    }

    // Get all brands
    async getAllBrands(): Promise<Brand[]> {
        try {
            const wpBrands = await this.fetchWordPressBrands()
            return wpBrands.map(wpBrand =>
                this.convertWordPressBrandToBrand(wpBrand)
            )
        } catch (error) {
            console.error('Erro ao buscar todas as marcas:', error)
            return []
        }
    }
}

export const brandsService = new BrandsService()
export type { Brand, Supplier, WordPressBrand }
