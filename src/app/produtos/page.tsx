import Link from 'next/link'
import { HeroHeader } from '@/components/layout/Header'
import { ProductsGrid } from '@/components/products-grid'
import { Footer } from '@/components/layout/Footer'

export default function ProdutosPage() {
  return (
    <div className="min-h-screen bg-background">
      <HeroHeader />
      <main>
        <div className="bg-red-600 text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">PRODUTOS</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <nav className="text-sm text-gray-600 mb-6">
            <Link href="/" className="text-red-600 hover:underline">
              Início
            </Link>
            <span className="mx-2">{'>'}</span>
            <span>Produtos</span>
          </nav>

          <ProductsGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}
