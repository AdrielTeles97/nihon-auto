import type { Product } from "@/types"

// Simple demo catalog used by grid and product page
export const demoProducts: Product[] = [
  {
    id: 67963,
    name: "Abraçadeira Cinta Nylon 14x5.6mm (20 un)",
    description: "Abraçadeira de nylon de alta resistência, ideal para fixação geral.",
    short_description: "Abraçadeira 14x5.6mm",
    price: 0,
    image: "/images/placeholder-product.svg",
    category: "Abraçadeiras",
    inStock: true,
    slug: "MC-67963",
    gallery: [
      "/images/placeholder-product.svg",
      "/images/placeholder-product.svg",
      "/images/placeholder-product.svg",
    ],
    specifications: { Cor: "Preto", Material: "Nylon" },
  },
  {
    id: 88688,
    name: "Abraçadeira Cinta Nylon 2.5x10cm PR (100 un)",
    description: "Pacote com 100 unidades, uso automotivo e geral.",
    short_description: "Abraçadeira 2.5x10cm",
    price: 0,
    image: "/images/placeholder-product.svg",
    category: "Abraçadeiras",
    inStock: true,
    slug: "MC-88688",
    gallery: [
      "/images/placeholder-product.svg",
      "/images/placeholder-product.svg",
    ],
  },
  {
    id: 88683,
    name: "Abraçadeira Cinta Nylon 3.6x15cm PR (100 un)",
    description: "Conjunto reforçado, ideal para fixação firme.",
    short_description: "Abraçadeira 3.6x15cm",
    price: 0,
    image: "/images/placeholder-product.svg",
    category: "Abraçadeiras",
    inStock: true,
    slug: "MC-88683",
  },
]

export function findProductByIdOrSlug(idOrSlug: string) {
  return demoProducts.find(
    p => String(p.id) === String(idOrSlug) || p.slug === idOrSlug,
  )
}

