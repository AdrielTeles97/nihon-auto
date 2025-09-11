import Link from 'next/link'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroHeader />
      <main className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-6">Produto não encontrado.</p>
          <Link href="/produtos" className="underline text-red-600 hover:text-red-700">
            Voltar aos produtos
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

