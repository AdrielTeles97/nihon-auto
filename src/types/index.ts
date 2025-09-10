// Tipos para produtos
export interface Product {
    id: number
    name: string
    description: string
    short_description?: string
    price: number
    image: string
    category: string
    brand?: string
    inStock: boolean
    slug: string
    gallery?: string[]
    specifications?: Record<string, string>
    customFields?: Record<string, string | number | boolean | null>
}

// Tipos para carrinho
export interface CartItem {
    product: Product
    quantity: number
    variationId?: number
    selectedAttributes?: Record<string, string>
    variationImage?: string | null
}

export interface Cart {
    items: CartItem[]
    total: number
    itemCount: number
}

// Tipos para orçamento
export interface QuoteRequest {
    customerName: string
    customerEmail: string
    customerPhone: string
    items: CartItem[]
    message?: string
    total: number
}

// Tipos para WordPress API
export interface WordPressProduct {
    id: number
    title: {
        rendered: string
    }
    content: {
        rendered: string
    }
    excerpt?: {
        rendered: string
    }
    featured_media?: number
    acf?: {
        nome?: string
        descricao?: string
        preco?: number
        categoria?: string
        imagem?: {
            url: string
            alt: string
        }
        disponivel?: boolean
        brand?: string
        gallery?: string[]
        specifications?: Record<string, string>
    }
    slug: string
}

export interface WordPressMedia {
    id: number
    source_url: string
    alt_text: string
}

// Tipos para categorias
export interface Category {
    id: number
    name: string
    slug: string
    count: number
}

// Tipos para filtros
export interface ProductFilters {
    search?: string
    category?: string
    minPrice?: number
    maxPrice?: number
    brand?: string
    inStock?: boolean
}

// Tipos para paginação
export interface PaginationInfo {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}

export interface ProductsResponse {
    products: Product[]
    pagination: PaginationInfo
}
