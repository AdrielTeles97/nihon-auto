'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useRef, useState } from 'react'

interface InfiniteSliderProps {
  children: React.ReactNode
  gap?: number
  duration?: number
  durationOnHover?: number
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  speed?: number
  speedOnHover?: number
}

export function InfiniteSlider({
  children,
  gap = 20,
  duration = 25,
  durationOnHover,
  className,
  reverse = false,
  pauseOnHover = false,
  speed = 1,
  speedOnHover,
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [animationDuration, setAnimationDuration] = useState(duration)
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sliderRef.current || !containerRef.current) return

    const slider = sliderRef.current
    const container = containerRef.current
    const sliderWidth = slider.scrollWidth
    const containerWidth = container.clientWidth

    // Calculate duration based on speed
    const calculatedDuration = sliderWidth / (speed * 50)
    setAnimationDuration(calculatedDuration)

    if (isHovered && speedOnHover) {
      const hoveredDuration = sliderWidth / (speedOnHover * 50)
      setAnimationDuration(hoveredDuration)
    } else if (isHovered && durationOnHover) {
      setAnimationDuration(durationOnHover)
    } else if (isHovered && pauseOnHover) {
      setAnimationDuration(0)
    }
  }, [isHovered, speed, speedOnHover, durationOnHover, pauseOnHover, duration])

  const childrenArray = React.Children.toArray(children)
  const duplicatedChildren = [...childrenArray, ...childrenArray]

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={sliderRef}
        className="flex w-max animate-infinite-slider"
        style={{
          gap: `${gap}px`,
          animationDuration: `${animationDuration}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationPlayState: isHovered && pauseOnHover ? 'paused' : 'running',
        }}
      >
        {duplicatedChildren.map((child, index) => (
          <div key={index} className="flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}

// Add this to your global CSS or Tailwind config
// @keyframes infinite-slider {
//   from {
//     transform: translateX(0);
//   }
//   to {
//     transform: translateX(-50%);
//   }
// }