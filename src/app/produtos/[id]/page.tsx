import { notFound } from 'next/navigation'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import type { Product as APIProduct } from '@/types/products'
import ProductDetailClient from '@/components/product-detail-client'

type ApiRes = { success: boolean; data?: APIProduct }

export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(`/api/products/${params.id}`, { next: { revalidate: 86400 } })
  if (res.status === 404) return notFound()
  const json = (await res.json()) as ApiRes
  if (!json?.success || !json?.data) return notFound()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroHeader />
      <ProductDetailClient product={json.data} />
      <Footer />
    </div>
  )
}

