'use client'

import { useState, useEffect, useCallback } from 'react'

interface ConnectionInfo {
    effectiveType: '4g' | '3g' | '2g' | 'slow-2g'
    downlink: number
    rtt: number
    saveData: boolean
}

interface AdaptiveLoadingOptions {
    priority?: 'high' | 'medium' | 'low'
    minDelay?: number
    maxDelay?: number
}

export function useAdaptiveLoading(options: AdaptiveLoadingOptions = {}) {
    const { priority = 'medium', minDelay = 0, maxDelay = 2000 } = options

    const [isReady, setIsReady] = useState(false)
    const [connectionSpeed, setConnectionSpeed] = useState<
        'fast' | 'medium' | 'slow'
    >('medium')

    // Detectar velocidade da conexão
    useEffect(() => {
        const detectConnection = () => {
            if ('connection' in navigator) {
                const conn = (navigator as any).connection
                const effectiveType = conn?.effectiveType || '4g'
                const downlink = conn?.downlink || 10

                if (effectiveType === '4g' && downlink > 5) {
                    setConnectionSpeed('fast')
                } else if (
                    effectiveType === '3g' ||
                    (effectiveType === '4g' && downlink <= 5)
                ) {
                    setConnectionSpeed('medium')
                } else {
                    setConnectionSpeed('slow')
                }
            } else {
                // Fallback: detectar pela performance
                const timing = performance.timing
                const loadTime = timing.loadEventEnd - timing.navigationStart

                if (loadTime < 1000) {
                    setConnectionSpeed('fast')
                } else if (loadTime < 3000) {
                    setConnectionSpeed('medium')
                } else {
                    setConnectionSpeed('slow')
                }
            }
        }

        detectConnection()
    }, [])

    // Calcular delay baseado na conexão e prioridade
    useEffect(() => {
        const getDelay = () => {
            const priorityMultiplier = {
                high: 0,
                medium: 1,
                low: 2
            }[priority]

            const speedDelay = {
                fast: minDelay,
                medium: minDelay + (maxDelay - minDelay) * 0.3,
                slow: minDelay + (maxDelay - minDelay) * 0.6
            }[connectionSpeed]

            return Math.min(speedDelay * priorityMultiplier, maxDelay)
        }

        const delay = getDelay()

        if (delay === 0) {
            setIsReady(true)
        } else {
            const timer = setTimeout(() => setIsReady(true), delay)
            return () => clearTimeout(timer)
        }
    }, [connectionSpeed, priority, minDelay, maxDelay])

    return {
        isReady,
        connectionSpeed,
        shouldPreload: connectionSpeed === 'fast',
        shouldLazyLoad: connectionSpeed === 'slow'
    }
}

// Hook para carregar dados de forma inteligente
export function useSmartFetch<T>(
    fetchFn: () => Promise<T>,
    options: {
        priority?: 'high' | 'medium' | 'low'
        cacheKey?: string
        staleTime?: number
    } = {}
) {
    const { priority = 'medium', cacheKey, staleTime = 5 * 60 * 1000 } = options

    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const { isReady, connectionSpeed } = useAdaptiveLoading({ priority })

    useEffect(() => {
        if (!isReady) return

        let cancelled = false

        const loadData = async () => {
            // Verificar cache primeiro
            if (cacheKey && typeof window !== 'undefined') {
                const cached = sessionStorage.getItem(cacheKey)
                if (cached) {
                    try {
                        const { data: cachedData, timestamp } =
                            JSON.parse(cached)
                        if (Date.now() - timestamp < staleTime) {
                            setData(cachedData)
                            setLoading(false)
                            return
                        }
                    } catch {}
                }
            }

            try {
                const result = await fetchFn()

                if (!cancelled) {
                    setData(result)

                    // Salvar no cache
                    if (cacheKey && typeof window !== 'undefined') {
                        sessionStorage.setItem(
                            cacheKey,
                            JSON.stringify({
                                data: result,
                                timestamp: Date.now()
                            })
                        )
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err
                            : new Error('Erro ao carregar')
                    )
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadData()

        return () => {
            cancelled = true
        }
    }, [isReady, fetchFn, cacheKey, staleTime])

    return {
        data,
        loading,
        error,
        connectionSpeed,
        isReady
    }
}

// Hook para preload de recursos críticos
export function usePreloadCritical() {
    const { shouldPreload, connectionSpeed } = useAdaptiveLoading({
        priority: 'high'
    })

    useEffect(() => {
        if (!shouldPreload) return

        // Preload de recursos críticos apenas em conexões rápidas
        const preloadResources = [
            '/api/products?per_page=6',
            '/api/brands?calc_counts=true'
        ]

        preloadResources.forEach(url => {
            fetch(url, {
                headers: { 'Content-Type': 'application/json' }
            }).catch(() => {}) // Silenciar erros de preload
        })
    }, [shouldPreload])

    return { connectionSpeed }
}
