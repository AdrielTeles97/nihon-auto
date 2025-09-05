export interface WCCategory {
  id: number
  name: string
  slug: string
  description?: string
  image?: {
    id: number
    src: string
  } | null
  count?: number
  parent?: number
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string | null
  count: number
  parentId: number | null
}

