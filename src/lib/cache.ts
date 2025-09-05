import { unstable_cache, revalidateTag } from 'next/cache'

export type CacheKeyPart = string | number | boolean | null | undefined

export async function cached<T>(
  keyParts: CacheKeyPart[],
  fetcher: () => Promise<T>,
  opts: { tags: string[]; revalidate: number }
): Promise<T> {
  const key = keyParts
    .map(p => (p === undefined || p === null ? '' : String(p)))
    .join(':')
  const fn = unstable_cache(fetcher, [key], { tags: opts.tags, revalidate: opts.revalidate })
  return fn()
}

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

