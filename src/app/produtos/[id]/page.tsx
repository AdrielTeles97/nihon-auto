"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { findProductByIdOrSlug } from "@/data/products"
import { useCart } from "@/contexts/cart-context"
import { HeroHeader } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"

export default function ProductPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { addItem } = useCart()

  const product = findProductByIdOrSlug(params.id)

  if (!product) {
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

  const addToCartAndGo = () => {
    addItem(product, 1)
    router.push("/carrinho")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <HeroHeader />
      <main className="container mx-auto px-4 pt-24 pb-10 flex-1">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden">
              <Image
                src={product.image || "/images/placeholder-product.svg"}
                alt={product.name}
                width={800}
                height={800}
                className="h-full w-full object-contain"
                unoptimized
              />
            </div>
            {product.gallery && product.gallery.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.gallery.map((src, i) => (
                  <div key={i} className="aspect-square rounded-md bg-gray-50 overflow-hidden">
                    <Image src={src} alt={`${product.name}-${i}`} width={200} height={200} className="h-full w-full object-contain" unoptimized />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>
            <p className="text-sm text-muted-foreground">Código: {product.slug ?? product.id}</p>
            {product.short_description && (
              <p className="text-sm text-muted-foreground">{product.short_description}</p>
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

            {product.specifications && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Especificações</h3>
                <ul className="text-sm space-y-1">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <li key={k} className="text-muted-foreground"><span className="font-medium text-foreground">{k}:</span> {String(v)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
