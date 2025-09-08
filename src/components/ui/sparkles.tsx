'use client'
import React from 'react'
import { cn } from '@/lib/utils'

type SparklesProps = {
    id?: string
    className?: string
    background?: string
    particleSize?: number
    minSize?: number
    maxSize?: number
    speed?: number
    particleColor?: string
    particleDensity?: number
    refresh?: boolean
}

export default function SparklesCore({
    id,
    className,
    background = 'transparent',
}: SparklesProps) {
    return (
        <div
            id={id}
            className={cn('relative w-full h-full overflow-hidden', className)}
            style={{ background }}
        >
            {/* Efeito de sparkles usando CSS puro */}
            <div className="absolute inset-0 opacity-20">
                <div className="animate-pulse bg-gradient-to-r from-white/10 via-white/20 to-white/10 w-full h-full" />
            </div>
        </div>
    )
}

export { SparklesCore }
