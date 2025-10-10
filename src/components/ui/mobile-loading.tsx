import React from 'react'
import { cn } from '@/lib/utils'

interface MobileLoadingProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
    className?: string
}

export function MobileLoading({
    size = 'md',
    text,
    className
}: MobileLoadingProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    }

    return (
        <div
            className={cn('flex items-center justify-center gap-2', className)}
        >
            <div
                className={cn(
                    'animate-spin rounded-full border-2 border-gray-300 border-t-red-600',
                    sizeClasses[size]
                )}
            />
            {text && (
                <span className="text-sm text-gray-600 animate-pulse">
                    {text}
                </span>
            )}
        </div>
    )
}

export function MobileSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('animate-pulse', className)}>
            <div className="bg-gray-200 rounded-lg h-4 w-3/4 mb-2"></div>
            <div className="bg-gray-200 rounded-lg h-4 w-1/2"></div>
        </div>
    )
}

export function MobileCardSkeleton() {
    return (
        <div className="bg-white border rounded-lg p-4 animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-2">
                <div className="bg-gray-200 rounded h-3 w-1/4"></div>
                <div className="bg-gray-200 rounded h-4 w-3/4"></div>
                <div className="bg-gray-200 rounded h-4 w-1/2"></div>
                <div className="flex gap-2 mt-4">
                    <div className="bg-gray-200 rounded h-8 flex-1"></div>
                    <div className="bg-gray-200 rounded h-8 flex-1"></div>
                </div>
            </div>
        </div>
    )
}
