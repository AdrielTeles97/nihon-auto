import axios from 'axios'

// WordPress/WooCommerce API interfaces
export interface Product {
    id: number
    name: string
    description: string
    price: number
    image: string
    category: string
    brand?: string
    inStock: boolean
    slug: string
    gallery?: string[]
    specifications?: Record<string, any>
}

// WooCommerce Product interface
export interface WooCommerceProduct {
    id: number
    name: string
    description: string
    short_description: string
    price: string
    regular_price: string
    sale_price: string
    slug: string
    status: string
    stock_status: string
    manage_stock: boolean
    stock_quantity: number | null
    images: {
        id: number
        src: string
        alt: string
    }[]
    categories: {
        id: number
        name: string
        slug: string
    }[]
    tags: {
        id: number
        name: string
        slug: string
    }[]
    attributes: {
        id: number
        name: string
        options: string[]
    }[]
}

export interface WordPressMedia {
    id: number
    source_url: string
    alt_text: string
}

export interface Category {
    id: number
    name: string
    slug: string
    count?: number
}

export interface ProductFilters {
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    brand?: string
    inStock?: boolean
}

export interface ProductsResponse {
    products: Product[]
    pagination: {
        currentPage: number
        totalPages: number
        totalItems: number
        itemsPerPage: number
    }
}

// API Configuration
const WORDPRESS_BASE_URL =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace('/wp-json/wp/v2', '') ||
    'https://darksalmon-cobra-736244.hostingersite.com'
const WC_API_BASE_URL =
    process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL ||
    'https://darksalmon-cobra-736244.hostingersite.com/wp-json/wc/v3'
const WP_API_BASE_URL =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    'https://darksalmon-cobra-736244.hostingersite.com/wp-json/wp/v2'

// WooCommerce API credentials
const WC_CONSUMER_KEY =
    process.env.WOOCOMMERCE_CONSUMER_KEY ||
    'ck_cde4987447c3bd8dc0f1c1ec064a135f9e9dafef'
const WC_CONSUMER_SECRET =
    process.env.WOOCOMMERCE_CONSUMER_SECRET ||
    'cs_f9b40b5ecce45dbeb3fd0810a80cb8b90c115966'

const wcApi = axios.create({
    baseURL: WC_API_BASE_URL,
    timeout: 10000,
    params: {
        consumer_key: WC_CONSUMER_KEY,
        consumer_secret: WC_CONSUMER_SECRET
    }
})

const wpApi = axios.create({
    baseURL: WP_API_BASE_URL,
    timeout: 10000
})

// Helper function to fetch media
async function fetchMedia(mediaId: number): Promise<string> {
    try {
        const response = await wpApi.get<WordPressMedia>(`/media/${mediaId}`)
        return response.data.source_url
    } catch (error) {
        console.error('Erro ao buscar mídia:', error)
        return '/placeholder-product.svg'
    }
}

// Transform WooCommerce product to our Product interface
function transformWooCommerceProduct(wcProduct: WooCommerceProduct): Product {
    const mainImage =
        wcProduct.images && wcProduct.images.length > 0
            ? wcProduct.images[0].src
            : '/placeholder-product.svg'

    const gallery = wcProduct.images ? wcProduct.images.map(img => img.src) : []

    const category =
        wcProduct.categories && wcProduct.categories.length > 0
            ? wcProduct.categories[0].name
            : 'Sem categoria'

    // Extract brand from brands array (WooCommerce brands extension)
    let brand = undefined
    if ((wcProduct as any).brands && (wcProduct as any).brands.length > 0) {
        brand = (wcProduct as any).brands[0].name
    } else {
        // Fallback: Extract brand from attributes or tags
        const brandAttribute = wcProduct.attributes?.find(
            attr =>
                attr.name.toLowerCase().includes('marca') ||
                attr.name.toLowerCase().includes('brand')
        )
        brand =
            brandAttribute?.options[0] ||
            wcProduct.tags?.find(tag =>
                tag.name.toLowerCase().includes('marca')
            )?.name
    }

    return {
        id: wcProduct.id,
        name: wcProduct.name,
        description: wcProduct.description.replace(/<[^>]*>/g, ''),
        price: parseFloat(wcProduct.price) || 0,
        image: mainImage,
        category,
        brand,
        inStock: wcProduct.stock_status === 'instock',
        slug: wcProduct.slug,
        gallery,
        specifications:
            wcProduct.attributes?.reduce((specs, attr) => {
                specs[attr.name] = attr.options.join(', ')
                return specs
            }, {} as Record<string, any>) || {}
    }
}

// Fetch products from WooCommerce API
export async function getProducts(options?: {
    filters?: ProductFilters
    page?: number
    limit?: number
    brand?: string
}): Promise<ProductsResponse> {
    const { filters, page = 1, limit = 12, brand } = options || {}
    const perPage = limit
    try {
        const params: any = {
            page,
            per_page: perPage,
            status: 'publish'
        }

        // Aplicar filtros
        if (filters?.search) {
            params.search = filters.search
        }

        if (filters?.category && filters.category !== 'Todas') {
            params.category = filters.category
        }

        if (filters?.minPrice !== undefined) {
            params.min_price = filters.minPrice
        }

        if (filters?.maxPrice !== undefined) {
            params.max_price = filters.maxPrice
        }

        if (filters?.inStock !== undefined) {
            params.stock_status = filters.inStock ? 'instock' : 'outofstock'
        }

        // Try to fetch from WooCommerce API first
        const response = await wcApi.get<WooCommerceProduct[]>('/products', {
            params
        })

        const products: Product[] = response.data.map(wcProduct =>
            transformWooCommerceProduct(wcProduct)
        )

        // Apply brand filter (WooCommerce doesn't have native brand filter)
        let filteredProducts = products
        const brandFilter = brand || filters?.brand
        if (brandFilter) {
            filteredProducts = filteredProducts.filter(
                p =>
                    p.brand?.toLowerCase() === brandFilter.toLowerCase() ||
                    p.name.toLowerCase().includes(brandFilter.toLowerCase()) ||
                    p.category.toLowerCase().includes(brandFilter.toLowerCase())
            )
        }

        // Informações de paginação dos headers
        const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1')
        const totalItems = parseInt(response.headers['x-wp-total'] || '0')

        return {
            products: filteredProducts,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: perPage
            }
        }
    } catch (error) {
        console.error('Erro ao buscar produtos do WooCommerce:', error)
        // Return empty result if WooCommerce API fails
        return {
            products: [],
            pagination: {
                currentPage: page,
                totalPages: 0,
                totalItems: 0,
                itemsPerPage: perPage
            }
        }
    }
}

// Fetch single product
export async function getProduct(id: number): Promise<Product | null> {
    try {
        const response = await wcApi.get<WooCommerceProduct>(`/products/${id}`)
        return transformWooCommerceProduct(response.data)
    } catch (error) {
        console.error('Erro ao buscar produto do WooCommerce:', error)
        return null
    }
}

// Buscar produto por slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const response = await wcApi.get<WooCommerceProduct[]>('/products', {
            params: { slug }
        })

        if (response.data.length === 0) {
            return null
        }

        return transformWooCommerceProduct(response.data[0])
    } catch (error) {
        console.error('Erro ao buscar produto por slug:', error)
        return null
    }
}

// Fetch categories
export async function getCategories(): Promise<Category[]> {
    try {
        const response = await wcApi.get('/products/categories')
        return response.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            count: cat.count
        }))
    } catch (error) {
        console.warn(
            'WooCommerce API não disponível, usando categorias mock:',
            error
        )
        return [
            { id: 1, name: 'Smartphones', slug: 'smartphones', count: 10 },
            { id: 2, name: 'Notebooks', slug: 'notebooks', count: 15 },
            { id: 3, name: 'Tablets', slug: 'tablets', count: 8 },
            { id: 4, name: 'Acessórios', slug: 'acessorios', count: 12 },
            { id: 5, name: 'Audio & Video', slug: 'audio-video', count: 6 }
        ]
    }
}

// Buscar produtos em destaque
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
    try {
        const response = await wcApi.get('/products', {
            params: {
                featured: true,
                per_page: limit,
                status: 'publish'
            }
        })
        return response.data.map(transformWooCommerceProduct)
    } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error)
        return []
    }
}

// Interface para marcas do WooCommerce
export interface WooCommerceBrand {
    id: number
    name: string
    slug: string
    description: string
    count: number
    image?: {
        id: number
        src: string
        alt: string
    }
}

export interface Brand {
    id: number
    name: string
    slug: string
    description: string
    count: number
    image?: string
}

// Função para transformar marca do WooCommerce
function transformWooCommerceBrand(wcBrand: WooCommerceBrand): Brand {
    return {
        id: wcBrand.id,
        name: wcBrand.name,
        slug: wcBrand.slug,
        description: wcBrand.description,
        count: wcBrand.count,
        image: wcBrand.image?.src
    }
}

// Buscar marcas do WooCommerce
export async function getBrands(): Promise<Brand[]> {
    try {
        const response = await wcApi.get('/products/brands', {
            params: {
                per_page: 100,
                hide_empty: true // Só mostrar marcas que têm produtos
            }
        })
        return response.data.map(transformWooCommerceBrand)
    } catch (error) {
        console.error('Erro ao buscar marcas do WooCommerce:', error)
        // Retornar array vazio em caso de erro - não usar dados mockados
        return []
    }
}
