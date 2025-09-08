import React from 'react'
import { cn } from '@/lib/utils'

interface EmphasisTextProps {
    children: React.ReactNode
    className?: string
    variant?: 'primary' | 'secondary' | 'accent'
}

export function EmphasisText({
    children,
    className,
    variant = 'primary'
}: EmphasisTextProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return 'text-red-500 font-medium'
            case 'accent':
                return 'text-red-600 font-semibold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent'
            default:
                return 'text-red-600 font-bold'
        }
    }

    return <span className={cn(getVariantStyles(), className)}>{children}</span>
}

interface SectionTitleProps {
    title: string
    subtitle?: string
    emphasis?: string
    className?: string
    align?: 'left' | 'center' | 'right'
    theme?: 'dark' | 'light'
}

export function SectionTitle({
    title,
    subtitle,
    emphasis,
    className,
    align = 'center',
    theme = 'dark'
}: SectionTitleProps) {
    const alignClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    const titleColorClass = theme === 'dark' ? 'text-white' : 'text-gray-900'
    const subtitleColorClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-600'

    return (
        <div className={cn(alignClass[align], className)}>
            <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${titleColorClass}`}>
                {title} {emphasis && <EmphasisText>{emphasis}</EmphasisText>}
            </h2>
            {subtitle && (
                <p className={`text-lg max-w-2xl mx-auto ${subtitleColorClass}`}>
                    {subtitle}
                </p>
            )}
        </div>
    )
}
