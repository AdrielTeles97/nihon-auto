import type { Product } from '@/types/products'
import { ProductsGrid } from './ProductsGrid'

type ProductsApiResponse = {
    success: boolean
    data: Product[]
    page: number
    perPage: number
    total: number
    totalPages: number
}

export default async function ProductsGridServer() {
    try {
        const res = await fetch(`/api/products?per_page=12&page=1&order=desc`, {
            // Usa cache de dados do Next no server (revalida a cada 10 minutos)
            next: { revalidate: 600 }
        })
        const json = (await res.json()) as ProductsApiResponse
        const initial = json?.success ? json.data : []
        return <ProductsGrid initialProducts={initial} />
    } catch {
        // Em caso de falha, renderiza grid client sem dados (graceful fallback)
        return <ProductsGrid />
    }
}
