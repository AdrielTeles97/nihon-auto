import type { Category } from './categories'
import type { Brand } from './brands'

export interface WCProductImage {
    id: number
    src: string
    name?: string
    alt?: string
}

export interface WCProductCategoryRef {
    id: number
    name: string
    slug: string
}

export interface WCProductBrandRef {
    id: number
    name: string
    slug: string
}

export type WCMetaPrimitive = string | number | boolean | null
export type WCMetaValue =
    | WCMetaPrimitive
    | WCMetaPrimitive[]
    | Record<string, unknown>

export interface WCProductMetaData {
    id: number
    key: string
    value: WCMetaValue
}

export interface WCProduct {
    id: number
    name: string
    slug: string
    description: string
    short_description?: string
    sku?: string
    type?: string
    status?: 'publish' | 'draft' | 'pending' | 'private' | 'trash'
    images?: WCProductImage[]
    categories?: WCProductCategoryRef[]
    brands?: WCProductBrandRef[]
    attributes?: {
        id?: number
        name: string
        position?: number
        visible?: boolean
        variation?: boolean
        options?: string[]
    }[]
    default_attributes?: {
        id?: number
        name: string
        option: string
    }[]
    meta_data?: WCProductMetaData[]
}

export interface Product {
    id: number
    name: string
    slug: string
    description: string
    shortDescription?: string
    sku?: string
    code?: string // preferir SKU; fallback para GTIN
    image: string | null
    gallery: string[]
    categories: Pick<Category, 'id' | 'name' | 'slug'>[]
    brands: Pick<Brand, 'id' | 'name' | 'slug'>[]
    type?: string
    attributes?: { name: string; options: string[]; variation?: boolean }[]
    defaultAttributes?: Record<string, string>
    variations?: Array<{
        id: number
        sku?: string
        image?: string | null
        inStock?: boolean
        price?: number | null
        attributes: Record<string, string>
    }>
}

// Utilitário: extrai o código do produto dando preferência ao SKU
export function extractProductCodeFromWC(p: WCProduct): string | undefined {
    const sku = (p.sku || '').trim()
    if (sku) return sku

    // GTIN pode vir em meta_data com várias chaves possíveis conforme o plugin
    const candidates = [
        'gtin',
        'GTIN',
        'ean',
        'EAN',
        'upc',
        'UPC',
        'isbn',
        'ISBN',
        'yith_gtin_code'
    ]
    const found = p.meta_data?.find(m => candidates.includes(m.key))
    if (found) {
        const val = String(found.value || '').trim()
        return val || undefined
    }
    return undefined
}
