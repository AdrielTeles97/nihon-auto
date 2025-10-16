import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Product as APIProduct } from '@/types/products'
import ProductDetailClient from '@/components/product-detail-client'
import type { Metadata } from 'next'

type ApiRes = { success: boolean; data?: APIProduct }

// Função para buscar dados do produto
async function fetchProduct(id: string): Promise<APIProduct | null> {
    try {
        const hdrs = await headers()
        const host = hdrs.get('host') ?? 'localhost:3000'
        const protocol =
            host.includes('localhost') || host.startsWith('127.0.0.1')
                ? 'http'
                : 'https'
        const apiUrl = `${protocol}://${host}/api/products/${id}${
            process.env.NODE_ENV === 'development' ? '?fresh=1' : ''
        }`

        const res = await fetch(apiUrl, { next: { revalidate: 86400 } })
        if (!res.ok) return null

        const text = await res.text()
        if (!text.trim()) return null

        const json: ApiRes = JSON.parse(text)
        return json?.success && json?.data ? json.data : null
    } catch (error) {
        console.error('Error fetching product:', error)
        return null
    }
}

// Gerar metadata dinâmica para SEO
export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const resolvedParams = await params
    const product = await fetchProduct(resolvedParams.id)

    if (!product) {
        return {
            title: 'Produto não encontrado'
        }
    }

    const title = `${product.name}`
    const description =
        product.shortDescription?.substring(0, 160) ||
        product.description?.replace(/<[^>]*>/g, '').substring(0, 160) ||
        `Compre ${
            product.name
        } na Nihon Acessórios Automotivos. ${product.categories
            ?.map(c => c.name)
            .join(', ')}.`

    return {
        title,
        description,
        keywords: [
            product.name,
            ...(product.categories?.map(c => c.name) || []),
            'peças automotivas',
            'acessórios para carro'
        ],
        openGraph: {
            title,
            description,
            type: 'website',
            images: product.image
                ? [
                      {
                          url: product.image,
                          width: 800,
                          height: 600,
                          alt: product.name
                      }
                  ]
                : [],
            url: `/produtos/${product.id}`
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: product.image ? [product.image] : []
        },
        alternates: {
            canonical: `/produtos/${product.id}`
        }
    }
}

export default async function ProductPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params
    const product = await fetchProduct(resolvedParams.id)

    if (!product) return notFound()

    // Dados estruturados JSON-LD para SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.gallery || [],
        description:
            product.shortDescription ||
            product.description?.replace(/<[^>]*>/g, ''),
        sku: product.sku || product.code || product.id.toString(),
        brand: {
            '@type': 'Brand',
            name: product.brands?.[0]?.name || 'Nihon Acessórios Automotivos'
        },
        offers: {
            '@type': 'Offer',
            url: `https://nihonacessoriosautomotivos.com.br/produtos/${product.id}`,
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: 'Nihon Acessórios Automotivos'
            }
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* JSON-LD para dados estruturados */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HeroHeader />
            <ProductDetailClient product={product} />
            <Footer />
        </div>
    )
}
