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

            return transformedBrands
        } catch (error) {
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
            const wpBrands = await this.fetchWordPressBrands()

            const brands = wpBrands
                .map(wpBrand => {
                    const converted = this.convertWordPressBrandToBrand(wpBrand)
                    return converted
                })
                // Não filtrar por logo - aceitar todas as marcas
                .slice(0, limit)

            return brands
        } catch (error) {
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
            return []
        }
    }
}

export const brandsService = new BrandsService()
export type { Brand, Supplier, WordPressBrand }
