'use client'

import { cn } from '@/lib/utils'
import React from 'react'

interface ProgressiveBlurProps {
  className?: string
  direction?: 'left' | 'right' | 'top' | 'bottom'
  blurIntensity?: number
  children?: React.ReactNode
}

export function ProgressiveBlur({
  className,
  direction = 'right',
  blurIntensity = 1,
  children,
}: ProgressiveBlurProps) {
  const getGradientDirection = () => {
    switch (direction) {
      case 'left':
        return 'to right'
      case 'right':
        return 'to left'
      case 'top':
        return 'to bottom'
      case 'bottom':
        return 'to top'
      default:
        return 'to left'
    }
  }

  const getBlurGradient = () => {
    const maxBlur = blurIntensity * 4
    const steps = 10
    const gradientStops = []

    for (let i = 0; i <= steps; i++) {
      const percentage = (i / steps) * 100
      const blurValue = (i / steps) * maxBlur
      gradientStops.push(`blur(${blurValue}px) ${percentage}%`)
    }

    return gradientStops.join(', ')
  }

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        background: `linear-gradient(${getGradientDirection()}, transparent 0%, rgba(0,0,0,0.1) 100%)`,
        backdropFilter: `blur(${blurIntensity}px)`,
        WebkitBackdropFilter: `blur(${blurIntensity}px)`,
        maskImage: `linear-gradient(${getGradientDirection()}, transparent 0%, black 100%)`,
        WebkitMaskImage: `linear-gradient(${getGradientDirection()}, transparent 0%, black 100%)`,
      }}
    >
      {children}
    </div>
  )
}