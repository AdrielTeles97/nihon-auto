"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useEffect, useState } from 'react'
import type { Product as APIProduct } from '@/types/products'
import type { Product as CartProduct } from '@/types'

function toCartProduct(p: APIProduct): CartProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    short_description: p.shortDescription,
    price: 0,
    image: p.image || '/images/placeholder-product.svg',
    category: p.categories[0]?.name || '',
    brand: p.brands[0]?.name,
    inStock: true,
    slug: p.slug,
    gallery: p.gallery,
    specifications: undefined,
    customFields: { code: p.code ?? null }
  }
}

export default function ProductPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { addItem } = useCart()

  const [product, setProduct] = useState<APIProduct | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (res.status === 404) { if (!ignore) setNotFound(true); return }
        const json = await res.json()
        if (!ignore) {
          setProduct(json.data)
          setActiveIdx(0)
        }
      } catch { if (!ignore) setNotFound(true) }
    }
    load()
    return () => { ignore = true }
  }, [params.id])

  const addToCartAndGo = () => {
    if (product) {
      addItem(toCartProduct(product), 1)
      router.push('/carrinho')
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <HeroHeader />
        <main className="container mx-auto px-4 py-16">
          <p className="text-center text-muted-foreground">Produto não encontrado.</p>
          <div className="text-center mt-6">
            <Link href="/produtos" className="underline">Voltar aos produtos</Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <HeroHeader />
        <main className="container mx-auto px-4 py-16">
          <p className="text-center text-muted-foreground">Carregando produto...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroHeader />
      <main className="container mx-auto px-4 pt-24 pb-10 flex-1">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden">
              <Image
                src={product.gallery?.[activeIdx] || product.image || '/images/placeholder-product.svg'}
                alt={product.name}
                width={800}
                height={800}
                className="h-full w-full object-contain"
                unoptimized
              />
            </div>
            {product.gallery && product.gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {product.gallery.map((src, i) => (
                  <button
                    key={i}
                    className={`aspect-square rounded-md bg-gray-50 overflow-hidden border ${i === activeIdx ? 'border-red-600' : 'border-transparent'}`}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Imagem ${i + 1}`}
                  >
                    <Image src={src} alt={`${product.name}-${i}`} width={200} height={200} className="h-full w-full object-contain" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>
            <p className="text-sm text-muted-foreground">Código: {product.code || product.slug || product.id}</p>
            {product.shortDescription && (
              <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
            )}
            <div className="flex gap-3 pt-2">
              <Button className="gap-2" onClick={addToCartAndGo}>Adicionar ao carinho</Button>
              <Link href="/produtos" className="inline-flex items-center text-sm underline">Voltar aos produtos</Link>
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none dark:prose-invert mt-6">
                <p>{product.description}</p>
              </div>
            )}

            {(product.categories?.length || product.brands?.length) && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.categories?.map((c) => (
                  <span key={`c-${c.id}`} className="px-2 py-1 rounded-full bg-gray-100 text-xs">{c.name}</span>
                ))}
                {product.brands?.map((b) => (
                  <span key={`b-${b.id}`} className="px-2 py-1 rounded-full bg-gray-100 text-xs">{b.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
