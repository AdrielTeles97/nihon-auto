import React from 'react'
import { cn } from '@/lib/utils'

interface NoiseBackgroundProps {
    className?: string
    intensity?: 'light' | 'medium' | 'strong'
    color?: 'neutral' | 'red' | 'white'
}

export function NoiseBackground({
    className,
    intensity = 'light',
    color = 'neutral'
}: NoiseBackgroundProps) {
    const getOpacity = () => {
        switch (intensity) {
            case 'strong':
                return 'opacity-20'
            case 'medium':
                return 'opacity-10'
            default:
                return 'opacity-5'
        }
    }

    const getFilter = () => {
        switch (color) {
            case 'red':
                return 'hue-rotate-[350deg] saturate-150'
            case 'white':
                return 'invert'
            default:
                return ''
        }
    }

    return (
        <div
            className={cn(
                'absolute inset-0 pointer-events-none bg-repeat mix-blend-overlay',
                getOpacity(),
                getFilter(),
                className
            )}
            style={{
                backgroundImage: 'url(/noise.svg)',
                backgroundSize: '200px 200px'
            }}
        />
    )
}

interface DecorativeShapeProps {
    className?: string
    variant?: 'circle' | 'rectangle' | 'triangle'
    color?: 'red' | 'neutral' | 'accent'
    size?: 'sm' | 'md' | 'lg'
}

export function DecorativeShape({
    className,
    variant = 'circle',
    color = 'red',
    size = 'md'
}: DecorativeShapeProps) {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-32 h-32'
            case 'lg':
                return 'w-96 h-96'
            default:
                return 'w-64 h-64'
        }
    }

    const getColorClasses = () => {
        switch (color) {
            case 'red':
                return 'bg-gradient-to-br from-red-600/20 to-red-400/5'
            case 'accent':
                return 'bg-gradient-to-br from-primary/20 to-primary/5'
            default:
                return 'bg-gradient-to-br from-muted/20 to-muted/5'
        }
    }

    const getVariantClasses = () => {
        switch (variant) {
            case 'rectangle':
                return 'rounded-2xl'
            case 'triangle':
                return 'rounded-full clip-path-triangle'
            default:
                return 'rounded-full'
        }
    }

    return (
        <div
            className={cn(
                'absolute blur-3xl pointer-events-none',
                getSizeClasses(),
                getColorClasses(),
                getVariantClasses(),
                className
            )}
        />
    )
}
