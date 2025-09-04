
import { ProductsSection } from '@/components/products-section'
import { Footer } from '@/components/layout/Footer'
import { HeroHeader } from '@/components/layout/Header'
import HeroSection from '@/components/hero-section'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <HeroHeader />
            <main>
                <HeroSection />
                <ProductsSection />
            </main>
            <Footer />
        </div>
    )
}
