import { ProductsSection } from '@/components/products-section-modernized'
import { Footer } from '@/components/layout/Footer'
import { HeroHeader } from '@/components/layout/Header'
import HeroSection from '@/components/hero-section'
import { DoubleBanners } from '@/components/sections/DoubleBanners'

export default function HomePage() {
    // Dados estruturados JSON-LD para a organização
    const organizationJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Nihon Acessórios Automotivos',
        url: 'https://nihonacessoriosautomotivos.com.br',
        logo: 'https://nihonacessoriosautomotivos.com.br/images/logo-nihon.png',
        description:
            'Catálogo virtual de produtos automotivos. Encontre as melhores peças e acessórios para seu veículo.',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'BR',
            addressLocality: 'Brasil'
        },
        sameAs: [
            // Adicione aqui links das redes sociais quando disponível
            // 'https://facebook.com/nihonauto',
            // 'https://instagram.com/nihonauto'
        ]
    }

    // Breadcrumb para SEO
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Início',
                item: 'https://nihonacessoriosautomotivos.com.br'
            }
        ]
    }

    // WebSite schema
    const websiteJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Nihon Acessórios Automotivos',
        url: 'https://nihonacessoriosautomotivos.com.br',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate:
                    'https://nihonacessoriosautomotivos.com.br/produtos?search={search_term_string}'
            },
            'query-input': 'required name=search_term_string'
        }
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Dados Estruturados JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationJsonLd)
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd)
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteJsonLd)
                }}
            />

            <HeroHeader />
            <main>
                <HeroSection />
                <ProductsSection />
                <DoubleBanners />
            </main>
            <Footer />
        </div>
    )
}
