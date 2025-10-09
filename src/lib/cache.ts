import { unstable_cache, revalidateTag } from 'next/cache'

export type CacheKeyPart = string | number | boolean | null | undefined

/**
 * Sistema de cache inteligente com tags para revalidação granular
 *
 * Estratégia de cache:
 * - Produtos individuais: 1 hora (podem ser atualizados via webhook)
 * - Lista de produtos: 10 minutos (revalidação automática)
 * - Categorias: 1 hora (raramente mudam)
 * - Marcas: 6 horas (muito raramente mudam)
 */
export async function cached<T>(
    keyParts: CacheKeyPart[],
    fetcher: () => Promise<T>,
    opts: { tags: string[]; revalidate: number }
): Promise<T> {
    const key = keyParts
        .map(p => (p === undefined || p === null ? '' : String(p)))
        .join(':')
    const fn = unstable_cache(fetcher, [key], {
        tags: opts.tags,
        revalidate: opts.revalidate
    })
    return fn()
}

/**
 * Headers de cache para CDN/Browser
 * Usa stale-while-revalidate para resposta instantânea
 */
export function cacheHeaders(ttlSeconds: number, swrSeconds = 60): HeadersInit {
    return {
        'Cache-Control': `public, s-maxage=${ttlSeconds}, stale-while-revalidate=${swrSeconds}`
    }
}

export function normalizeCSV(value: string | null | undefined): string[] {
    return (value || '')
        .split(',')
        .map(v => v.trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
}

export { revalidateTag }
