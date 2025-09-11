"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useEffect, useMemo, useState } from 'react'
import type { Product as APIProduct } from '@/types/products'
import { prepareDescription } from '@/lib/description'
import type { Product as CartProduct } from '@/types'
import { getWhatsAppQuoteUrl } from '@/lib/whatsapp'

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
    sku: p.sku,
    code: p.code,
    gallery: p.gallery,
    specifications: undefined,
    customFields: undefined
  }
}

export default function ProductDetailClient({ product }: { product: APIProduct }) {
  const router = useRouter()
  const { addItem } = useCart()
  const [activeIdx, setActiveIdx] = useState(0)
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({})

  // Inicializa seleção de variações
  useEffect(() => {
    const defaults: Record<string, string> = {}
    ;(product.attributes || [])
      .filter(a => a.variation && (a.options || []).length)
      .forEach(a => {
        const key = (a.name || '').toLowerCase()
        const def = product.defaultAttributes?.[key]
        defaults[key] = def || a.options?.[0] || ''
      })
    setSelectedAttrs(defaults)
    setActiveIdx(0)
  }, [product])

  const currentVariation = useMemo(() => {
    if (!product?.variations?.length) return null
    const keys = Object.keys(selectedAttrs)
    const match = product.variations.find(v =>
      keys.every(
        k => (v.attributes?.[k] || '').toLowerCase() === (selectedAttrs[k] || '').toLowerCase()
      )
    )
    return match || null
  }, [product, selectedAttrs])

  const displayedGallery = useMemo(() => {
    const base = product?.gallery || []
    const varImg = currentVariation?.image || null
    if (!varImg) return base
    const dedup = base.filter(g => g !== varImg)
    return [varImg, ...dedup]
  }, [product?.gallery, currentVariation?.image])

  // Sempre que a variação muda, reseta o índice
  useEffect(() => {
    setActiveIdx(prev => (prev === 0 ? prev : 0))
  }, [currentVariation?.id])

  const addToCartAndGo = () => {
    const item = toCartProduct(product)
    if (currentVariation) {
      addItem(item, 1, currentVariation.id, currentVariation.attributes, currentVariation.image)
    } else {
      addItem(item, 1)
    }
    router.push('/carrinho')
  }

  const handleRequestQuote = () => {
    const productCode = String(currentVariation?.sku || product.code || product.slug || product.id)
    let productName = product.name
    if (currentVariation) {
      const attrs = Object.entries(currentVariation.attributes)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
      productName = `${productName} (${attrs})`
    }
    const whatsappUrl = getWhatsAppQuoteUrl(productName, productCode)
    window.open(whatsappUrl, '_blank')
  }

  return (
    <main className="container mx-auto px-4 pt-24 pb-10 flex-1">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden">
            <Image
              key={`main-${displayedGallery?.[activeIdx] || product.image || 'placeholder'}`}
              src={displayedGallery?.[activeIdx] || product.image || '/images/placeholder-product.svg'}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {displayedGallery && displayedGallery.length > 0 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {displayedGallery.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  className={`aspect-square rounded-md bg-gray-50 overflow-hidden border ${
                    i === activeIdx ? 'border-red-600' : 'border-transparent'
                  }`}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Imagem ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${product.name}-${i}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-contain"
                    sizes="(max-width: 768px) 20vw, 10vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>
          <p className="text-sm text-muted-foreground">
            Código: {currentVariation?.sku || product.code || product.slug || product.id}
          </p>
          {product.shortDescription && (
            <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
          )}

          {(product.attributes || []).some(a => a.variation && (a.options || []).length) && (
            <div className="space-y-3 pt-2">
              {(product.attributes || [])
                .filter(a => a.variation && (a.options || []).length)
                .map(attr => {
                  const key = (attr.name || '').toLowerCase()
                  const value = selectedAttrs[key] || ''
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <label className="text-sm w-20 shrink-0">{attr.name}:</label>
                      <select
                        className="border rounded-md px-2 py-1 text-sm"
                        value={value}
                        onChange={e =>
                          setSelectedAttrs(prev => ({ ...prev, [key]: e.target.value }))
                        }
                      >
                        {(attr.options || []).map(opt => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                })}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 gap-2" onClick={handleRequestQuote}>
              Solicitar Orçamento
            </Button>
            <Button className="gap-2" onClick={addToCartAndGo}>
              Adicionar ao carrinho
            </Button>
          </div>
          <div className="pt-2">
            <Link href="/produtos" className="inline-flex items-center text-sm underline">
              Voltar aos produtos
            </Link>
          </div>

          {product.description && (
            <div
              className="product-description prose prose-sm max-w-none dark:prose-invert mt-6"
              dangerouslySetInnerHTML={prepareDescription(product.description)}
            />
          )}

          {(product.categories?.length || product.brands?.length) && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.categories?.map(c => (
                <span key={`c-${c.id}`} className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                  {c.name}
                </span>
              ))}
              {product.brands?.map(b => (
                <span key={`b-${b.id}`} className="px-2 py-1 rounded-full bg-gray-100 text-xs">
                  {b.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
