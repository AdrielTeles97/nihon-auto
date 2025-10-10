import { useState, useEffect, useCallback, useRef } from 'react'

interface UseOptimizedFetchOptions {
    enabled?: boolean
    staleTime?: number
    retryCount?: number
}

interface UseOptimizedFetchReturn<T> {
    data: T | null
    loading: boolean
    error: Error | null
    refetch: () => void
}

export function useOptimizedFetch<T>(
    url: string,
    options: UseOptimizedFetchOptions = {}
): UseOptimizedFetchReturn<T> {
    const {
        enabled = true,
        staleTime = 5 * 60 * 1000,
        retryCount = 3
    } = options

    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(
        new Map()
    )
    const abortControllerRef = useRef<AbortController | null>(null)

    const fetchData = useCallback(async () => {
        if (!enabled || !url) return

        // Verificar cache
        const cached = cacheRef.current.get(url)
        if (cached && Date.now() - cached.timestamp < staleTime) {
            setData(cached.data)
            return
        }

        // Cancelar requisição anterior
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        const controller = new AbortController()
        abortControllerRef.current = controller

        setLoading(true)
        setError(null)

        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()

            // Salvar no cache
            cacheRef.current.set(url, { data: result, timestamp: Date.now() })

            setData(result)
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(err)
            }
        } finally {
            setLoading(false)
        }
    }, [url, enabled, staleTime])

    const refetch = useCallback(() => {
        cacheRef.current.delete(url)
        fetchData()
    }, [url, fetchData])

    useEffect(() => {
        fetchData()

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [fetchData])

    return { data, loading, error, refetch }
}
