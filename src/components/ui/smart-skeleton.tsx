'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useAdaptiveLoading } from '@/hooks/useAdaptiveLoading'

interface SmartSkeletonProps {
    className?: string
    children?: React.ReactNode
    priority?: 'high' | 'medium' | 'low'
    fallback?: React.ReactNode
}

export function SmartSkeleton({
    className,
    children,
    priority = 'medium',
    fallback
}: SmartSkeletonProps) {
    const { isReady, connectionSpeed } = useAdaptiveLoading({ priority })

    if (!isReady) {
        return (
            <div className={cn('animate-pulse', className)}>
                {fallback || (
                    <div className="bg-gray-200 rounded-lg h-full w-full"></div>
                )}
            </div>
        )
    }

    return <>{children}</>
}

// Skeleton para produtos
export function ProductCardSkeleton() {
    return (
        <div className="bg-white border rounded-lg p-4 animate-pulse">
            {/* Imagem skeleton */}
            <div className="aspect-square bg-gray-200 rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
            </div>

            {/* Código skeleton */}
            <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>

            {/* Título skeleton */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Botões skeleton */}
            <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    )
}

// Skeleton para grid de produtos
export function ProductsGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}

// Skeleton para carousel de marcas
export function BrandsCarouselSkeleton() {
    return (
        <div className="w-full">
            <div className="animate-pulse">
                {/* Título skeleton */}
                <div className="text-center mb-8">
                    <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                </div>

                {/* Carousel skeleton */}
                <div className="relative overflow-hidden">
                    <div className="flex space-x-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-shrink-0 w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center"
                            >
                                <div className="w-24 h-8 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Skeleton adaptativo que mostra conteúdo progressivamente
export function ProgressiveSkeleton({
    children,
    skeletonCount = 3,
    delay = 200
}: {
    children: React.ReactNode[]
    skeletonCount?: number
    delay?: number
}) {
    const [visibleCount, setVisibleCount] = React.useState(0)
    const { connectionSpeed } = useAdaptiveLoading({ priority: 'medium' })

    React.useEffect(() => {
        const adaptiveDelay = {
            fast: delay * 0.5,
            medium: delay,
            slow: delay * 1.5
        }[connectionSpeed]

        if (visibleCount < React.Children.count(children)) {
            const timer = setTimeout(() => {
                setVisibleCount(prev => prev + 1)
            }, adaptiveDelay)

            return () => clearTimeout(timer)
        }
    }, [visibleCount, children, delay, connectionSpeed])

    const childrenArray = React.Children.toArray(children)

    return (
        <>
            {childrenArray.slice(0, visibleCount).map((child, index) => (
                <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                    {child}
                </div>
            ))}
            {visibleCount < childrenArray.length &&
                Array.from({
                    length: Math.min(
                        skeletonCount,
                        childrenArray.length - visibleCount
                    )
                }).map((_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />)}
        </>
    )
}
