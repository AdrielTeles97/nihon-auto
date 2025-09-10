import { NextRequest, NextResponse } from 'next/server'
import { wpApi, assertWooConfig } from '@/services/wp-api'
import type { Category, WCCategory } from '@/types/categories'
import { cached, cacheHeaders } from '@/lib/cache'

assertWooConfig()

// GET /api/categories
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = (searchParams.get('search') || '').trim()
        const perPage = Number(searchParams.get('per_page') || '100')
        const page = Number(searchParams.get('page') || '1')
        const parent = searchParams.get('parent')

        const responseData = await cached(
            [
                'wc:categories',
                page,
                perPage,
                parent ?? '',
                search.toLowerCase()
            ],
            async () => {
                const resp = await wpApi.get<WCCategory[]>(
                    '/products/categories',
                    {
                        params: {
                            per_page: Math.min(Math.max(perPage, 1), 100),
                            page: Math.max(page, 1),
                            hide_empty: false,
                            ...(parent ? { parent } : {})
                        }
                    }
                )
                return resp.data
            },
            { tags: ['wc:categories'], revalidate: 3600 }
        )

        let categories: Category[] = responseData.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: (c.description || '').replace(/<[^>]*>/g, '').trim(),
            image: c.image?.src || null,
            count: c.count ?? 0,
            parentId: typeof c.parent === 'number' ? c.parent : null
        }))

        if (search) {
            const s = search.toLowerCase()
            categories = categories.filter(
                c =>
                    c.name.toLowerCase().includes(s) ||
                    c.description.toLowerCase().includes(s)
            )
        }

        return new NextResponse(
            JSON.stringify({
                success: true,
                data: categories,
                total: categories.length
            }),
            {
                headers: {
                    'Content-Type': 'application/json',
                    ...cacheHeaders(3600, 120)
                }
            }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
