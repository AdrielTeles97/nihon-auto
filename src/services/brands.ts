import axios from 'axios'

interface WordPressBrand {
    id: number
    name: string
    slug: string
    description?: string
    image?: {
        id: number
        source_url: string
    }
    meta?: {
        logo_url?: string
        website?: string
        featured?: boolean
    }
}

interface Brand {
    id: number
    name: string
    slug: string
    logo?: string
    website?: string
    featured?: boolean
}

interface Supplier {
    id: number
    name: string
    logo?: string
    description?: string
    website?: string
    featured?: boolean
    products?: any[]
}

class BrandsService {
    private baseUrl: string
    private wpApi: any

    constructor() {
        this.baseUrl =
            process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL ||
            'https://darksalmon-cobra-736244.hostingersite.com/wp-json/wc/v3'
        this.wpApi = axios.create({
            baseURL: this.baseUrl,
            timeout: 10000,
            params: {
                consumer_key:
                    process.env.WOOCOMMERCE_CONSUMER_KEY ||
                    'ck_cde4987447c3bd8dc0f1c1ec064a135f9e9dafef',
                consumer_secret:
                    process.env.WOOCOMMERCE_CONSUMER_SECRET ||
                    'cs_f9b40b5ecce45dbeb3fd0810a80cb8b90c115966'
            }
        })
    }

    // Fetch brands from WordPress/WooCommerce API
    async fetchWordPressBrands(): Promise<WordPressBrand[]> {
        try {
            console.log('🌐 Fazendo requisição para WooCommerce brands...')
            console.log('🔗 URL:', `${this.baseUrl}/products/brands`)

            // Fazer requisição real para a API do WooCommerce
            const response = await this.wpApi.get('/products/brands', {
                params: {
                    per_page: 100,
                    hide_empty: false // Mudei para false para pegar todas as marcas
                }
            })

            console.log(
                `📥 Response status: ${response.status}, dados:`,
                response.data.length,
                'itens'
            )
            console.log('🔍 Primeira marca raw:', response.data[0])

            // Transformar dados do WooCommerce para o formato esperado
            const transformedBrands = response.data.map((brand: any) => ({
                id: brand.id,
                name: brand.name,
                slug: brand.slug,
                description:
                    brand.description || `Produtos da marca ${brand.name}`,
                image: brand.image
                    ? {
                          id: brand.image.id,
                          source_url: brand.image.src
                      }
                    : undefined,
                meta: {
                    logo_url:
                        brand.image?.src || `/images/brands/${brand.slug}.svg`,
                    website: brand.meta?.website || '',
                    featured: brand.meta?.featured || false
                }
            }))

            console.log(
                '🔄 Marcas transformadas:',
                transformedBrands.map((b: any) => ({
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
            logo: wpBrand.image?.source_url || wpBrand.meta?.logo_url,
            website: wpBrand.meta?.website,
            featured: wpBrand.meta?.featured || false
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
                        logo: matchingBrand.logo || supplier.logo,
                        website: matchingBrand.website || supplier.website,
                        featured: matchingBrand.featured
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
                            converted.logo || 'SEM LOGO'
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
    async createOrUpdateBrand(brand: Omit<Brand, 'id'>): Promise<Brand | null> {
        try {
            const brandData = {
                title: brand.name,
                slug: brand.slug,
                status: 'publish',
                meta: {
                    logo_url: brand.logo,
                    website: brand.website,
                    featured: brand.featured
                }
            }

            const response = await this.wpApi.post('/brands', brandData)
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
