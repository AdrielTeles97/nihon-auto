export interface WCBrand {
  id: number
  name: string
  slug: string
  description?: string
  image?: {
    id: number
    src: string
  } | null
  count?: number
}

export interface Brand {
  id: number
  name: string
  slug: string
  description: string
  image: string | null
  count: number
}

