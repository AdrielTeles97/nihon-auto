import { ProductsSection } from '@/components/products-section-modernized'
import { Footer } from '@/components/layout/Footer'
import { HeroHeader } from '@/components/layout/Header'
import HeroSection from '@/components/hero-section'
import { DoubleBanners } from '@/components/sections/DoubleBanners'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
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
