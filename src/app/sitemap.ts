import { MetadataRoute } from 'next'

// Função para buscar todos os produtos
async function getAllProducts() {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_SITE_URL ||
            'https://nihonacessoriosautomotivos.com.br'
        const apiUrl = `${baseUrl}/api/products?per_page=100`

        const response = await fetch(apiUrl, {
            next: { revalidate: 3600 } // Revalidar a cada hora
        })

        if (!response.ok) return []

        const data = await response.json()
        return data.data || []
    } catch (error) {
        console.error('Error fetching products for sitemap:', error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://nihonacessoriosautomotivos.com.br'

    // Páginas estáticas
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0
        },
        {
            url: `${baseUrl}/produtos`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9
        },
        {
            url: `${baseUrl}/marcas`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8
        },
        {
            url: `${baseUrl}/atendimento`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7
        },
        {
            url: `${baseUrl}/a-nihon`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6
        }
    ]

    // Buscar produtos dinamicamente
    const products = await getAllProducts()
    const productPages: MetadataRoute.Sitemap = products.map(
        (product: any) => ({
            url: `${baseUrl}/produtos/${product.id}`,
            lastModified: product.date_modified
                ? new Date(product.date_modified)
                : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8
        })
    )

    return [...staticPages, ...productPages]
}
