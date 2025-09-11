import { HeroHeader } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import BrandsPageClient from '@/components/brands-page-client'

type BrandsApiResponse = {
  success: boolean
  data: import('@/types/brands').Brand[]
  page: number
  perPage: number
  total: number
  totalPages: number
}

export default async function MarcasPage() {
  try {
    const res = await fetch('/api/brands?per_page=24&page=1&orderby=name&order=asc', {
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('brands api error')
    const json = (await res.json()) as BrandsApiResponse
    const success = (json as any)?.success !== false

    return (
      <div className="min-h-screen bg-background">
        <HeroHeader />
        <BrandsPageClient
          initialBrands={success ? json?.data || [] : []}
          initialPage={(json as any)?.currentPage || 1}
          initialTotal={success ? json?.total || (json?.data?.length ?? 0) : 0}
          initialTotalPages={success ? json?.totalPages || 1 : 1}
          itemsPerPage={json?.perPage || 24}
        />
        <Footer />
      </div>
    )
  } catch {
    return (
      <div className="min-h-screen bg-background">
        <HeroHeader />
        <BrandsPageClient initialBrands={[]} initialPage={1} initialTotal={0} initialTotalPages={1} itemsPerPage={24} />
        <Footer />
      </div>
    )
  }
}
export const dynamic = 'force-dynamic'
export const revalidate = 0
